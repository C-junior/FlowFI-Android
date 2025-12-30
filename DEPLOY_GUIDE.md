# 🚀 Deployment Guide for Vercel + Firebase

You have successfully converted your backend to be Serverless-ready for Vercel!

## 1. Environment Variables in Vercel

Go to your Vercel Project Settings > Environment Variables and add the following:

| Variable | Description |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram Bot Token (`8333...`) |
| `GEMINI_API_KEY` | Your Gemini API Key (`AIza...`) |
| `FIREBASE_SERVICE_ACCOUNT` | **(Crucial)** The JSON content of your Firebase Service Account Key |

### How to get `FIREBASE_SERVICE_ACCOUNT`:
1. Go to [Firebase Console](https://console.firebase.google.com/) > Project Settings > Service accounts.
2. Click **Generate new private key**.
3. Open the downloaded JSON file.
4. Copy the **entire content** of the JSON file.
5. Paste it as the value for `FIREBASE_SERVICE_ACCOUNT` in Vercel.
   - *Tip: Remove newlines if Vercel complains, but usually it handles JSON fine.*

## 2. Telegram Webhook Setup

Since serverless functions don't run constantly, the bot cannot "poll" for messages. You must set up a **Webhook**.

After deploying to Vercel, the easiest way is to copy and paste this URL into your browser address bar:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR-VERCEL-PROJECT>.vercel.app/api/telegram
```

**Example:**
If your bot token is `123:ABC` and your Vercel app is `flowfiapp.vercel.app`:
`https://api.telegram.org/bot123:ABC/setWebhook?url=https://flowfiapp.vercel.app/api/telegram`

You should see a JSON response: `{"ok":true,"result":true,"description":"Webhook was set"}`.

## 3. Testing Locally

You can still run the backend locally:

1. Open a terminal in `backend/`.
2. Run `npm start`.
3. The server will start on port 3001.
4. **Note:** For the local backend to write to Firestore, you might need to set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account key file, or rely on `gcloud auth application-default login`.

## 4. Frontend Sync (Magic Link)

The app now uses a "Magic Link" to connect your Telegram account automatically!

1. Open the FlowFi App.
2. Go to **Settings**.
3. Scroll to the **Telegram Bot** section.
4. Click **"Conectar Telegram"**.
5. This will open Telegram. Click **"Start"** at the bottom of the chat.
6. The bot will reply confirming the connection.
7. Return to FlowFi, refresh the page, and you should see "Conectado!".

Now, any expense you send to the bot will automatically appear in your app!

## ⚠️ Troubleshooting

### "net::ERR_BLOCKED_BY_CLIENT" Error
If you see this error in your browser console, it means an extension (like AdBlock, uBlock Origin, Privacy Badger) or browser feature (like Brave Shields) is blocking the connection to Firebase.
**Solution:** Disable your ad blocker or "Shields" for your app's URL (localhost or vercel.app).

### Data not syncing?
1. **Check the Bot Reply:** If the bot replies "✅ Despesa extraída!", the data **is** saved in Firebase.
2. **Check Telegram ID:** Ensure the ID shown by the bot (`/start`) matches exactly the ID you entered in the App Settings.
3. **Check Console Logs:** Look for "Error syncing Telegram expenses" in your browser console.
