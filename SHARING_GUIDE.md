# 🎮 How to Share Your Bomberman Clone

## ✅ Production Build Complete!

Your game has been built and is ready to share! All files are in the `dist` folder.

## 🚀 Quick Sharing Options (Easiest to Hardest)

### Option 1: Deploy to Netlify (FREE & EASIEST) ⭐ RECOMMENDED

**Steps:**
1. Go to [netlify.com](https://www.netlify.com/) and sign up (free)
2. Drag and drop your entire `dist` folder into Netlify
3. Get a live URL like: `https://your-bomberman-game.netlify.app`
4. Share the URL with friends!

**Pros:**
- ✅ Free forever
- ✅ Takes 30 seconds
- ✅ Professional URL
- ✅ Works on any device with a browser
- ✅ Easy to update (just drag and drop again)

### Option 2: Deploy to GitHub Pages (FREE)

**Steps:**
1. Create a GitHub repository for your game
2. Push your code to GitHub
3. Run these commands:
   ```bash
   npm install gh-pages --save-dev
   ```
4. Add to `package.json` scripts:
   ```json
   "deploy": "vite build && gh-pages -d dist"
   ```
5. Run: `npm run deploy`
6. Enable GitHub Pages in repository settings
7. Share URL: `https://yourusername.github.io/bomberman-clone`

**Pros:**
- ✅ Free forever
- ✅ Version controlled
- ✅ Good for portfolio

### Option 3: Deploy to Vercel (FREE)

**Steps:**
1. Go to [vercel.com](https://vercel.com/) and sign up
2. Install Vercel CLI: `npm install -g vercel`
3. Run: `vercel` in your project folder
4. Follow the prompts
5. Share the URL you get

**Pros:**
- ✅ Free forever
- ✅ Very fast deployment
- ✅ Automatic deployments from Git

### Option 4: Share as ZIP File (OFFLINE)

**For friends who want to play locally:**

1. Zip the entire `dist` folder
2. Send via email, Discord, or file sharing service
3. Friends need to:
   - Extract the ZIP file
   - Double-click `index.html` to play in their browser

**Pros:**
- ✅ No internet needed after download
- ✅ Works offline

**Cons:**
- ❌ Each friend needs to download
- ❌ Can't play multiplayer online

### Option 5: Host on Your Own Server

If you have web hosting, just upload the contents of the `dist` folder to your web server.

## 🎯 Step-by-Step: Netlify (Recommended)

1. **Go to Netlify:**
   - Visit https://app.netlify.com/
   - Sign up with GitHub, GitLab, or email (free)

2. **Deploy:**
   - Click "Add new site" → "Deploy manually"
   - Drag your `dist` folder into the upload area
   - Wait 10-30 seconds

3. **Share:**
   - Copy your new URL (something like `random-name-123.netlify.app`)
   - Optional: Click "Site settings" → "Change site name" to customize
   - Share the URL with friends!

4. **Update Later:**
   - Run `npm run build` again
   - Drag the new `dist` folder to Netlify
   - Same URL, updated game!

## 📱 Your Friends Can Play On:

- ✅ Windows PC (Chrome, Firefox, Edge)
- ✅ Mac (Safari, Chrome, Firefox)
- ✅ Android phones/tablets
- ✅ iPhones/iPads
- ✅ Linux
- ✅ Any device with a modern web browser!

## 🎮 Controls for Your Friends

**Keyboard:**
- Arrow Keys: Move
- Space: Place bomb

**Mobile/Touch:**
- Touch controls work on mobile devices

## 🔧 If You Make Changes

1. Edit your code
2. Run: `npm run build`
3. Re-upload the `dist` folder to your hosting service
4. Done! Same URL, updated game.

## 💡 Pro Tips

1. **Custom Domain:** 
   - Netlify/Vercel let you use your own domain (like `bomberman.yourdomain.com`)

2. **Analytics:** 
   - Add Google Analytics to see how many friends are playing

3. **Share Link:**
   - Create a short link with bit.ly or tiny.url for easy sharing

4. **Social Media:**
   - Share on Discord, Twitter, etc. The game works in any browser!

## 🐛 Troubleshooting

### "CORS Error When Opening index.html Locally"

If you get a CORS error like: `Access to script at 'file://...' has been blocked by CORS policy`

**✅ RECOMMENDED SOLUTIONS:**

**Option 1: Use Vite Preview (BEST)**
```bash
npm run preview
```
This starts a local server at `http://localhost:4173` - just open that in your browser!

**Option 2: Use Python's Built-in Server**
```bash
cd dist
python -m http.server 8000
# Or if you have Python 2:
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser.

**Option 3: Use Node.js http-server**
```bash
npx http-server dist -p 8000
```
Then open `http://localhost:8000` in your browser.

**Option 4: Use VS Code Live Server Extension**
- Install "Live Server" extension in VS Code
- Right-click `dist/index.html` → "Open with Live Server"

---

**⚠️ NOT RECOMMENDED: Disable CORS in Chrome**

You can disable CORS, but this is **dangerous** and should only be temporary:

**Windows:**
1. Close ALL Chrome/Brave windows completely
2. Press Win+R, paste this and hit Enter:
   ```
   chrome.exe --user-data-dir="C:/temp/chrome_dev" --disable-web-security --disable-site-isolation-trials
   ```
   (For Brave, replace `chrome.exe` with the full path to `brave.exe`)

**Mac:**
```bash
open -na "Google Chrome" --args --user-data-dir="/tmp/chrome_dev" --disable-web-security --disable-site-isolation-trials
```

**Linux:**
```bash
google-chrome --user-data-dir="/tmp/chrome_dev" --disable-web-security --disable-site-isolation-trials
```

**⚠️ WARNINGS:**
- This disables critical security features
- Do NOT browse the internet with CORS disabled
- Do NOT login to websites in this mode
- Only use for testing your local game
- Always close this Chrome instance when done
- Use a separate user data directory (as shown above)

---

**"The game doesn't load"**
- Make sure you uploaded the entire `dist` folder contents
- Check browser console for errors (F12)

**"Sprites are missing"**
- Ensure the `sprites` folder is in the deployed `dist` folder

**"Can't play multiplayer online"**
- Current version is local multiplayer (same keyboard)
- For online multiplayer, you'd need to add WebSocket server

## 📊 What's in the dist folder?

```
dist/
├── index.html          # Main HTML file
├── assets/
│   └── index-*.js      # All your game code (minified)
└── sprites/            # Game graphics
    ├── player_blue.png
    ├── player_green.png
    ├── player_red.png
    └── player_yellow.png
```

**Total size:** ~536 KB (very small and fast to load!)

## 🎉 You're Ready!

Your game is production-ready and optimized. Pick your favorite sharing method above and let your friends enjoy your Bomberman clone!

---

**Need help?** Check out:
- Netlify Docs: https://docs.netlify.com/
- Vercel Docs: https://vercel.com/docs
- GitHub Pages: https://pages.github.com/
