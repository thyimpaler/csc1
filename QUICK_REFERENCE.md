# 🚀 CryptoIntel Pro - Quick Reference

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```

**Default Admin Password**: `crypto2024`

---

## 🔑 Key Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Deployment
git init             # Initialize Git
git add .            # Stage all files
git commit -m "msg"  # Commit changes
git push             # Push to GitHub
vercel               # Deploy to Vercel
```

---

## 🎯 Common Tasks

### Add Coins
1. Click green **+** button (bottom right)
2. Enter password: `crypto2024`
3. Paste tickers: `BTC, ETH, SOL, ARB`
4. Click "Add Bulk Tickers"

### Edit Coin
1. Click any coin card
2. Adjust probability slider
3. Change grade (A/B/C)
4. Add research notes
5. Click "Save Changes"

### Filter & Sort
- **Filter**: Click sector badges (L1, L2, DePIN, etc.)
- **Sort**: Use dropdown (Probability, Grade, Recent, Sector)
- **Decay**: Toggle "Auto Decay" switch

### View Details
- **Hover card** → See mini order book
- **Click card** → Open full modal
- **Modal features**:
  - Full order book
  - TradingView link
  - Correlation charts
  - Edit all properties

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `app/page.js` | Main dashboard |
| `components/PriceCard.js` | Coin display |
| `components/AdminPanel.js` | Admin console |
| `lib/store.js` | State management |
| `lib/websocket.js` | Live data |
| `tailwind.config.js` | Theme colors |
| `.env.local` | API keys (create from .env.example) |

---

## 🎨 Color Codes

```javascript
// Terminal Theme
Background:    #000000  (pure black)
Borders:       #1A1A1A  (dark gray)
Text:          #E5E7EB  (light gray)

// Neon Accents
Buy/Positive:  #10B981  (emerald)
Sell/Negative: #EF4444  (crimson)
ATH/Special:   #F59E0B  (gold)
Info:          #3B82F6  (blue)
```

---

## 🔧 Configuration

### Change Admin Password
Edit `components/AdminPanel.js`:
```javascript
const ADMIN_PASSWORD = 'your-new-password';
```

### Add New Sector
Edit `lib/store.js`:
```javascript
const SECTOR_KEYWORDS = {
  YourSector: ['keyword1', 'keyword2'],
  // ...
};
```

### Customize Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  neon: {
    emerald: '#10B981',  // Change these
    crimson: '#EF4444',
    // ...
  }
}
```

---

## 🐛 Troubleshooting

### WebSocket Not Connecting
```bash
# Check browser console (F12)
# Look for: "WebSocket connected"
# If offline, check:
1. Internet connection
2. Binance not blocked
3. Ticker format (uppercase, USDT auto-added)
```

### Build Fails
```bash
# Clear and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### localStorage Full
```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Then refresh page
```

### Coins Not Showing
```bash
# Verify:
1. Added coins via admin panel
2. WebSocket connected (green LIVE indicator)
3. No console errors (F12)
4. Try different ticker (BTC always works)
```

---

## 📊 Data Sources

| Data Type | Source | Update Frequency |
|-----------|--------|------------------|
| Live Prices | Binance WebSocket | Real-time (~1s) |
| Order Book | Binance WebSocket | Real-time (~100ms) |
| 24h Stats | Binance WebSocket | Real-time |
| Correlations | Calculated locally | Every price update |

---

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Test locally (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Change admin password
- [ ] Review `.gitignore`
- [ ] Create GitHub repo

### GitHub Push
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Vercel Deploy
1. Go to vercel.com
2. Import GitHub repo
3. Framework: Next.js (auto-detected)
4. Click "Deploy"
5. Wait 2-3 minutes
6. Done! 🎉

---

## 🎯 Pro Tips

### Performance
- Keep watchlist under 50 coins
- Enable probability decay for auto-cleanup
- Clear localStorage monthly

### Research Workflow
1. **Morning**: Bulk add top ATH gainers
2. **Day**: Update probability scores as research progresses
3. **Evening**: Add notes to Grade A setups
4. **Weekly**: Review and remove Grade C coins

### Using Grades
- **Grade A**: High confidence, ready to trade
- **Grade B**: Good setup, needs confirmation
- **Grade C**: Watching, speculative

### Correlation Tips
- **BTC β > 0.7**: Strong correlation, moves with Bitcoin
- **BTC β < 0.3**: Independent movement
- **Negative β**: Inverse correlation (rare, interesting!)

---

## 📱 Keyboard Shortcuts

Currently not implemented, but you can add:
```javascript
// Future feature ideas:
Ctrl+K    → Open quick add
Ctrl+F    → Focus search
Ctrl+S    → Save changes
Esc       → Close modal
```

---

## 📚 Documentation Links

- **README.md** - Project overview
- **DEPLOYMENT_GUIDE.md** - Step-by-step Vercel deployment
- **PROJECT_STRUCTURE.md** - Code organization
- **FEATURES.md** - Complete feature list

---

## 🆘 Quick Help

### Can't add coins?
→ Check admin password (default: `crypto2024`)

### Prices not updating?
→ Check LIVE indicator in header (should be green)

### Modal won't open?
→ Check browser console for JavaScript errors

### Forgot admin password?
→ Edit `components/AdminPanel.js` and change it

### Need to start fresh?
→ Run: `localStorage.clear()` in browser console

---

## 🎓 Learning Path

1. **Day 1**: Install and add your first coins
2. **Day 2**: Explore filtering and sorting
3. **Day 3**: Learn probability scoring system
4. **Week 1**: Master correlation analysis
5. **Week 2**: Deploy to Vercel
6. **Month 1**: Build your research workflow

---

## 💡 Feature Requests

Want to add features? Check:
1. `FEATURES.md` → See what's planned
2. `PROJECT_STRUCTURE.md` → Understand code
3. `lib/store.js` → Add state/actions
4. `components/` → Add UI components

---

## 📞 Support

1. **Browser Console** (F12) → Check for errors
2. **README.md** → Comprehensive guide
3. **DEPLOYMENT_GUIDE.md** → Vercel help
4. **GitHub Issues** → Report bugs

---

**Remember**: This is YOUR dashboard. Customize it to fit your workflow!

---

Last Updated: January 2026
