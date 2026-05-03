// ─── lib/r2/upload.ts ─────────────────────────────────────────────────────────
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const R2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
})

export async function getUploadUrl(filename: string, contentType: string) {
  const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const url = await getSignedUrl(
    R2,
    new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType }),
    { expiresIn: 300 }
  )
  return { url, key, publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}` }
}

export async function deleteFromR2(key: string) {
  await R2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }))
}

// Upload helper for client side
export async function uploadBlobToR2(blob: Blob, filename: string): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType: blob.type }),
  })
  const { url, publicUrl } = await res.json()
  await fetch(url, { method: 'PUT', body: blob, headers: { 'Content-Type': blob.type } })
  return publicUrl
}


// ─── lib/notifications/send.ts ────────────────────────────────────────────────
import { Resend } from 'resend'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NotifType, NotificationPrefs } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIF_PREF_MAP: Record<NotifType, keyof NotificationPrefs> = {
  encourage:  'on_encourage',
  like:       'on_like',
  reply:      'on_voice_reply',
  follow:     'on_new_follower',
  trending:   'on_trending',
  milestone:  'on_milestone',
}

const NOTIF_SUBJECTS: Record<NotifType, string> = {
  encourage:  'Someone encouraged your voice 🎙️',
  like:       'Someone loved your post ❤️',
  reply:      'You have a new reply on Raise The Volume',
  follow:     'Someone is now following your voice',
  trending:   'Your voice is trending 🔥',
  milestone:  'You hit a new milestone! 🏆',
}

interface CreateNotifParams {
  recipient_id: string
  actor_id?: string
  type: NotifType
  post_id?: string
  message?: string
  supabase: SupabaseClient
}

export async function createNotification({
  recipient_id, actor_id, type, post_id, message, supabase
}: CreateNotifParams) {
  // 1. Write notification to DB
  await supabase.from('notifications').insert({
    recipient_id, actor_id, type, post_id,
    message: message ?? null,
  })

  // 2. Check recipient prefs
  const { data: prefs } = await supabase
    .from('notification_prefs')
    .select('*')
    .eq('user_id', recipient_id)
    .single()

  if (!prefs || !prefs.all_notifs) return
  const prefKey = NOTIF_PREF_MAP[type]
  if (prefKey && !prefs[prefKey]) return

  // 3. Fetch recipient email (admin client needed for auth.users)
  const { data: authUser } = await supabase.auth.admin.getUserById(recipient_id)
  const email = authUser?.user?.email
  if (!email) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', recipient_id)
    .single()

  await resend.emails.send({
    from: 'Raise The Volume <hello@raisethevol.com>',
    to: email,
    subject: NOTIF_SUBJECTS[type],
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
        <img src="https://www.raisethevol.com/raise_the_vol_logo.png" width="48" style="border-radius:50%;margin-bottom:16px"/>
        <h2 style="color:#3C3489">Hi ${profile?.display_name ?? 'there'},</h2>
        <p style="color:#444;line-height:1.6">${message ?? NOTIF_SUBJECTS[type]}</p>
        <a href="https://www.raisethevol.com/notifications"
           style="display:inline-block;margin-top:16px;background:#7F77DD;color:white;
                  padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">
          View on Raise The Volume
        </a>
        <p style="margin-top:24px;font-size:12px;color:#999">
          You can manage notification preferences in your profile settings.
        </p>
      </div>
    `,
  })
}


// ─── lib/badges/check.ts ─────────────────────────────────────────────────────
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BadgeKey } from '@/types'

interface BadgeCheck {
  key: BadgeKey
  label: string
  check: (uid: string, sb: SupabaseClient) => Promise<boolean>
}

const BADGE_CHECKS: BadgeCheck[] = [
  {
    key: 'first_voice',
    label: 'First voice — you took the leap',
    check: async (uid, sb) => {
      const { count } = await sb.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', uid)
      return (count ?? 0) >= 1
    },
  },
  {
    key: 'hundred_encouragements',
    label: '100 encouragements given',
    check: async (uid, sb) => {
      const { count } = await sb.from('encouragements').select('*', { count: 'exact', head: true }).eq('user_id', uid)
      return (count ?? 0) >= 100
    },
  },
  {
    key: 'joy_spreader',
    label: 'Spreader of joy',
    check: async (uid, sb) => {
      const { count } = await sb.from('posts').select('*', { count: 'exact', head: true })
        .eq('user_id', uid).eq('mood', 'Joyful')
      return (count ?? 0) >= 5
    },
  },
]

export async function awardBadgesIfEarned(userId: string, supabase: SupabaseClient) {
  // Fetch already-earned badges
  const { data: existing } = await supabase.from('badges').select('badge_key').eq('user_id', userId)
  const earned = new Set((existing ?? []).map((b: any) => b.badge_key))

  for (const { key, check } of BADGE_CHECKS) {
    if (earned.has(key)) continue
    const qualifies = await check(userId, supabase)
    if (qualifies) {
      await supabase.from('badges').insert({ user_id: userId, badge_key: key })
    }
  }
}
