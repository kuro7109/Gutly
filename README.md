# Gutly

A calm, non-diagnostic gut-health companion for young adults in India. Log meals with a photo, check in on how your gut feels, and see gentle patterns with honest confidence bands. Gutly never diagnoses, never ranks foods as good or bad, and points to a doctor when something sounds serious.

This repository holds:

| Path | What it is |
| --- | --- |
| `index.html` | Desktop web app (also works on phones) |
| `mobile/index.html` | Mobile app prototype, with a reviewer rail on wide screens |
| `api/chat.js` | Serverless function behind the Gutly chat |
| `api/dish.js` | Serverless function that names the dish in a meal photo |
| `src/*.src.html` | Editable sources for both apps (mascot images not embedded) |
| `assets/mascot/` | Guti, the mascot, in 8 moods |
| `scripts/bundle.mjs` | Rebuilds `index.html` and `mobile/index.html` from `src/` |

Both apps are single HTML files with no build step. Data stays in the browser (localStorage); accounts are local to the device.

## Deploy on Vercel (recommended)

Vercel serves the two apps and runs the `api/` functions, so the chat and photo naming use real AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkuro7109%2FGutly&project-name=gutly&repository-name=gutly&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20for%20the%20Gutly%20chat%20and%20photo%20naming%20(stays%20on%20the%20server)&envLink=https%3A%2F%2Fconsole.anthropic.com%2Fsettings%2Fkeys)

The button asks for `ANTHROPIC_API_KEY` and creates a copy of this repo in your account. To deploy this repo itself instead:

1. Go to [vercel.com/new](https://vercel.com/new), pick **Import Git Repository**, and choose `kuro7109/Gutly`.
2. Leave **Framework Preset** as *Other*. No build command or output directory is needed.
3. Under **Environment Variables**, add `ANTHROPIC_API_KEY` with your key from [console.anthropic.com](https://console.anthropic.com/). Optional: `ANTHROPIC_MODEL` (default `claude-haiku-5-5`).
4. Deploy. Every push to `main` redeploys automatically; pull requests get preview links.

If you add or change the key after the first deploy, redeploy (Deployments → ⋯ → Redeploy) so the functions pick it up.

URLs once deployed:

- `https://<your-project>.vercel.app/` – web app
- `https://<your-project>.vercel.app/mobile` – mobile prototype

Phones (iPhone, Android phones) that open the main URL are sent to `/mobile` automatically; tablets and computers get the web app. Add `?web=1` to the URL to open the web app on a phone.

On a phone, the mobile app fills the screen and can be installed: Safari → Share → Add to Home Screen, or Chrome → ⋮ → Add to Home screen / Install app. It then opens full-screen from a Guti icon.

The status pill in each app shows **AI** when the functions answer, and **Offline · scripted replies** when no key is set. The apps work fully offline either way.

### Keeping the key safe

- The key lives only in Vercel's environment variables. It is never in the HTML or sent to the browser.
- The functions only accept requests from the same site (add more origins with `ALLOWED_ORIGINS`, comma-separated).
- Requests are size-limited, and every user message passes the app's safety screen first (red-flag symptoms → see a doctor; self-harm → Tele-MANAS 14416 or 112).
- Set a monthly spend limit on your Anthropic account.

## Deploy on GitHub Pages (static only)

Settings → Pages → Deploy from branch → `main` / root. The apps run in Offline mode there because GitHub Pages cannot run the `api/` functions. The camera works (HTTPS).

## Camera

- On a self-hosted HTTPS site (Vercel or Pages), **Log meal** opens a live camera viewfinder after the browser asks for permission.
- If the camera is blocked or missing, phones open the native camera, and desktops can choose or drag in a photo.

## Local development

```bash
npm i -g vercel
cp .env.example .env.local   # add your key
vercel dev                   # serves the apps and /api on http://localhost:3000
```

After editing `src/web.src.html` or `src/mobile.src.html`, run `npm run bundle` to rebuild the two HTML files, then commit both.

## Safety

Gutly is a wellness companion, not a medical device. It does not diagnose, treat or recommend medicines. Persistent or severe symptoms (blood in stool, fever, vomiting, weight loss, severe pain) should be seen by a doctor.
