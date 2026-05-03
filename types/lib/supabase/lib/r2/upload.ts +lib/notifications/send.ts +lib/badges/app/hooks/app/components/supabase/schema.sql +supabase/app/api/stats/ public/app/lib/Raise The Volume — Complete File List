# Raise The Volume — Complete File List
Every file needed to go from static mockup → fully live app at www.raisethevol.com

---

## Config & Root
```
package.json                          ✅ (artifact: package.json)
next.config.js                        ✅ (artifact: config files)
tailwind.config.ts                    ✅ (artifact: config files)
middleware.ts                         ✅ (artifact: supabase clients)
.env.local                            ✅ (artifact: DEPLOY.md)
```

## App Shell
```
app/layout.tsx                        ✅ (artifact: config files)
app/globals.css                       ✅ (artifact: config files)
app/page.tsx                          ✅ (artifact: splash/root)
app/sitemap.ts                        ✅ (artifact: manifest)
```

## Auth
```
app/(auth)/layout.tsx                 ✅ (artifact: splash/root)
app/(auth)/login/page.tsx             ✅ (artifact: pages)
app/(auth)/signup/page.tsx            ✅ (artifact: pages)
app/auth/callback/route.ts            ✅ (artifact: remaining API)
```

## App Pages
```
app/(app)/layout.tsx                  ✅ (artifact: pages)
app/(app)/feed/page.tsx               ✅ (artifact: pages)
app/(app)/speak/page.tsx              ✅ (artifact: pages)
app/(app)/discover/page.tsx           ✅ (artifact: pages)
app/(app)/notifications/page.tsx      ✅ (artifact: pages)
app/(app)/profile/page.tsx            ✅ (artifact: pages)
app/(app)/profile/edit/page.tsx       ✅ (artifact: components)
app/(app)/profile/notif-prefs/page.tsx ✅ (artifact: components)
app/(app)/privacy/page.tsx            ✅ (artifact: splash/root)
```

## API Routes
```
app/api/upload/route.ts               ✅ (artifact: API routes)
app/api/posts/route.ts                ✅ (artifact: API routes)
app/api/posts/[id]/route.ts           ✅ (artifact: API routes)
app/api/posts/[id]/encourage/route.ts ✅ (artifact: API routes)
app/api/posts/[id]/like/route.ts      ✅ (artifact: API routes)
app/api/posts/[id]/replies/route.ts   ✅ (artifact: API routes)
app/api/profile/route.ts              ✅ (artifact: API routes)
app/api/profile/[username]/route.ts   ✅ (artifact: remaining API)
app/api/notifications/route.ts        ✅ (artifact: API routes)
app/api/notifications/unread-count/route.ts ✅ (artifact: remaining API)
app/api/notif-prefs/route.ts          ✅ (artifact: API routes)
app/api/topics/route.ts               ✅ (artifact: API routes)
app/api/topics/[name]/route.ts        ✅ (artifact: remaining API)
app/api/follows/route.ts              ✅ (artifact: API routes)
app/api/stats/route.ts                ✅ (artifact: remaining API)
app/api/badges/route.ts               ✅ (artifact: remaining API)
app/api/rising-voices/route.ts        ✅ (artifact: remaining API)
app/api/reports/route.ts              ✅ (artifact: remaining API)
app/api/search/route.ts               ✅ (artifact: remaining API)
app/api/account/delete/route.ts       ✅ (artifact: remaining API)
```

## Components
```
components/layout/Header.tsx          ✅ (artifact: components)
components/layout/BottomNav.tsx       ✅ (artifact: components)
components/feed/PostCard.tsx          ✅ (artifact: components)
components/feed/VoicePlayer.tsx       ✅ (artifact: components)
components/feed/VideoThumb.tsx        ✅ (artifact: components)
components/feed/FeedFilter.tsx        ✅ (artifact: components)
components/speak/TextComposer.tsx     ✅ (artifact: components)
components/speak/VoiceRecorder.tsx    ✅ (artifact: components)
components/speak/VideoUploader.tsx    ✅ (artifact: components)
components/ui/Toast.tsx               ✅ (artifact: store/utils)
components/ui/Avatar.tsx              ✅ (artifact: store/utils)
components/ui/Toggle.tsx              ✅ (artifact: store/utils)
```

## Lib
```
lib/supabase/client.ts                ✅ (artifact: supabase clients)
lib/supabase/server.ts                ✅ (artifact: supabase clients)
lib/r2/upload.ts                      ✅ (artifact: r2/notif/badges)
lib/notifications/send.ts             ✅ (artifact: r2/notif/badges)
lib/badges/check.ts                   ✅ (artifact: r2/notif/badges)
lib/store.ts                          ✅ (artifact: store/utils)
lib/utils.ts                          ✅ (artifact: store/utils)
```

## Hooks
```
hooks/useFeed.ts                      ✅ (artifact: hooks)
hooks/useRealtime.ts                  ✅ (artifact: hooks)
hooks/useProfile.ts                   ✅ (artifact: hooks)
hooks/useAuth.ts                      ✅ (artifact: hooks)
```

## Types
```
types/index.ts                        ✅ (artifact: types)
```

## Database
```
supabase/schema.sql                   ✅ (artifact: sql/deploy)
supabase/functions.sql                ✅ (artifact: sql/deploy)
```

## Public
```
public/manifest.json                  ✅ (artifact: manifest)
public/robots.txt                     ✅ (artifact: manifest)
public/raise_the_vol_logo.png         ← Already live on your server ✅
```

---

## How to assemble and ship

### Option A — You have a developer
Send them all 8 code artifacts above. They copy each file into the correct path, run `npm install`, connect the environment variables, and deploy to Vercel. Estimated: **2–4 hours**.

### Option B — Do it yourself (no-code path)
1. Use **GitHub Codespaces** (free) — open github.com, create a new repo, click "Open in Codespace"
2. Copy each file from the artifacts above into the correct folder path
3. In the terminal: `npm install && npm run dev` to test
4. Connect to Vercel (free): vercel.com → Import repo → add env vars → Deploy
5. Point your domain in Vercel → done

### Option C — Hire on Fiverr/Upwork
Post: *"Set up Next.js 14 + Supabase app from provided codebase, deploy to Vercel, connect custom domain www.raisethevol.com. All code provided."*  
Budget: $50–150 USD. Timeline: 24–48 hours.

---

## What goes live immediately after deploy

| Feature | Status |
|---|---|
| Splash screen | ✅ Live |
| Login / Signup (email + Google) | ✅ Live |
| Real feed from database | ✅ Live |
| Voice note recording + playback | ✅ Live |
| Video upload + playback | ✅ Live |
| Text posts | ✅ Live |
| Encourage + Like (real-time) | ✅ Live |
| Replies | ✅ Live |
| Notifications (in-app + email) | ✅ Live |
| Discover / Trending topics | ✅ Live |
| Rising voices | ✅ Live |
| Edit profile | ✅ Live |
| Notification preferences | ✅ Live |
| Privacy & Safety page | ✅ Live |
| Badges system | ✅ Live |
| Search | ✅ Live |
| Follow / Unfollow | ✅ Live |
| Installable PWA (Add to Home Screen) | ✅ Live |
| SEO + Open Graph | ✅ Live |
| Auto-deploy on git push | ✅ Live |
