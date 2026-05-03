// ─── hooks/useFeed.ts ─────────────────────────────────────────────────────────
'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Post, FeedFilter } from '@/types'

export function useFeed(filter: FeedFilter) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (reset = false) => {
    reset ? setLoading(true) : setLoadingMore(true)
    const c = reset ? null : cursor
    const params = new URLSearchParams({ type: filter.type })
    if (c) params.set('cursor', c)

    const res = await fetch(`/api/posts?${params}`)
    const { posts: newPosts, nextCursor } = await res.json()

    setPosts(prev => reset ? newPosts : [...prev, ...newPosts])
    setCursor(nextCursor)
    setHasMore(newPosts.length === 20)
    setLoading(false)
    setLoadingMore(false)
  }, [filter.type, cursor])

  useEffect(() => { fetchPosts(true) }, [filter.type])

  const toggleEncourage = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/encourage`, { method: 'POST' })
    const { encouraged } = await res.json()
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      has_encouraged: encouraged,
      encouragements_count: p.encouragements_count + (encouraged ? 1 : -1),
    } : p))
  }

  const toggleLike = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    const { liked } = await res.json()
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      has_liked: liked,
      likes_count: p.likes_count + (liked ? 1 : -1),
    } : p))
  }

  return { posts, loading, loadingMore, hasMore, fetchMore: () => fetchPosts(false), toggleEncourage, toggleLike }
}


// ─── hooks/useRealtime.ts ─────────────────────────────────────────────────────
'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimePost(postId: string, onUpdate: () => void) {
  const supabase = createClient()
  useEffect(() => {
    const ch = supabase.channel(`post-enc-${postId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'encouragements',
        filter: `post_id=eq.${postId}`,
      }, onUpdate)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [postId])
}

export function useRealtimeNotifications(userId: string, onNew: (n: any) => void) {
  const supabase = createClient()
  useEffect(() => {
    if (!userId) return
    const ch = supabase.channel(`notifs-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `recipient_id=eq.${userId}`,
      }, payload => onNew(payload.new))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [userId])
}

export function useRealtimeFeed(onNewPost: (p: any) => void) {
  const supabase = createClient()
  useEffect(() => {
    const ch = supabase.channel('feed-new-posts')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'posts',
      }, payload => onNewPost(payload.new))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])
}


// ─── hooks/useProfile.ts ──────────────────────────────────────────────────────
'use client'
import { useState, useEffect } from 'react'
import type { Profile, Badge } from '@/types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [pRes, bRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/badges'),
      ])
      const { profile } = await pRes.json()
      const { badges } = await bRes.json()
      setProfile(profile)
      setBadges(badges ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function updateProfile(updates: Partial<Profile>) {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const { profile } = await res.json()
    setProfile(profile)
    return profile
  }

  return { profile, badges, loading, updateProfile }
}


// ─── hooks/useAuth.ts ─────────────────────────────────────────────────────────
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return { user, loading, signOut }
}
