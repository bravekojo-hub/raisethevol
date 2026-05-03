export type PostType = 'voice' | 'video' | 'text'
export type Audience = 'everyone' | 'spiritual' | 'professional'
export type Mood = 'Grateful' | 'Heavy' | 'Hopeful' | 'Joyful' | 'Seeking advice' | 'Just sharing' | 'Celebrating'
export type NotifType = 'encourage' | 'like' | 'reply' | 'follow' | 'trending' | 'milestone'
export type BadgeKey = 'first_voice' | 'hundred_encouragements' | 'joy_spreader'

export interface Profile {
  id: string
  username: string
  display_name: string
  bio: string | null
  location: string | null
  avatar_url: string | null
  website: string | null
  topics: string[]
  is_anonymous: boolean
  is_verified_pro: boolean
  is_spiritual: boolean
  followers_count: number
  following_count: number
  voices_count: number
  encouragements_received: number
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  type: PostType
  body: string | null
  mood: string | null
  topic: string | null
  audience: Audience
  is_anonymous: boolean
  media_url: string | null
  media_duration: number | null
  thumbnail_url: string | null
  likes_count: number
  encouragements_count: number
  replies_count: number
  is_trending: boolean
  created_at: string
  profiles: Profile | null
  // client-side computed
  has_encouraged?: boolean
  has_liked?: boolean
}

export interface Reply {
  id: string
  post_id: string
  user_id: string
  type: PostType
  body: string | null
  media_url: string | null
  media_duration: number | null
  is_anonymous: boolean
  created_at: string
  profiles: Profile | null
}

export interface Topic {
  id: string
  name: string
  category: string
  voices_count: number
  videos_count: number
  is_trending: boolean
  last_active_at: string
}

export interface Notification {
  id: string
  recipient_id: string
  actor_id: string | null
  type: NotifType
  post_id: string | null
  message: string | null
  is_read: boolean
  created_at: string
  actor?: Profile
}

export interface NotificationPrefs {
  user_id: string
  all_notifs: boolean
  on_encourage: boolean
  on_like: boolean
  on_milestone: boolean
  on_voice_reply: boolean
  on_video_reply: boolean
  on_text_reply: boolean
  on_spiritual_reply: boolean
  on_pro_reply: boolean
  on_new_follower: boolean
  on_following_posts: boolean
  on_trending: boolean
  on_suggested_topics: boolean
  on_rising_voices: boolean
  email_weekly: boolean
  email_updates: boolean
}

export interface Badge {
  id: string
  user_id: string
  badge_key: BadgeKey
  earned_at: string
}

export interface FeedFilter {
  type: 'all' | PostType | 'joy' | 'spiritual'
}
