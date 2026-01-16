# 📁 Project Structure

Complete breakdown of the CryptoIntel Pro codebase.

## Directory Tree

```
cointracker-pro/
├── app/                          # Next.js 14 App Router
│   ├── globals.css              # Global styles with terminal theme
│   ├── layout.js                # Root layout component
│   ├── page.js                  # Main dashboard page
│   └── admin/                   # Future admin pages (optional)
│
├── components/                   # React components
│   ├── PriceCard.js             # Individual coin card display
│   ├── OrderBook.js             # Live order book visualization
│   ├── Modal.js                 # Detailed coin modal with charts
│   └── AdminPanel.js            # Floating admin console
│
├── lib/                         # Utility functions and logic
│   ├── store.js                 # Zustand state management
│   └── websocket.js             # Binance WebSocket integration
│
├── public/                      # Static assets (create if needed)
│   └── favicon.ico
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vercel.json                  # Vercel deployment config
├── README.md                    # Main documentation
└── DEPLOYMENT_GUIDE.md          # Detailed deployment steps
```

---

## File Descriptions

### Configuration Files

#### `package.json`
- Project metadata and dependencies
- Scripts for dev, build, start, lint
- All npm packages listed here

#### `next.config.js`
- Next.js framework configuration
- Image domains whitelist
- Build optimizations

#### `tailwind.config.js`
- Custom color palette (neon-emerald, crimson, gold)
- Animation keyframes
- Font families
- Theme extensions

#### `postcss.config.js`
- PostCSS plugins configuration
- Required for Tailwind CSS

#### `vercel.json`
- Vercel deployment settings
- Build routes and environment

---

### App Directory (`app/`)

#### `app/layout.js`
**Purpose**: Root layout wrapper for all pages
- Sets up HTML structure
- Includes metadata (title, description)
- Wraps all pages with consistent styling

**Key Features**:
- Meta tags for SEO
- Global CSS import
- Anti-aliasing enabled

#### `app/page.js`
**Purpose**: Main dashboard page
- Primary user interface
- Displays coin grid
- Houses all filtering and sorting logic

**Key Features**:
- Real-time WebSocket connection
- Filtering by sector (L1, L2, DePIN, etc.)
- Sorting by probability, grade, date
- Probability decay toggle
- Live connection status indicator
- Empty state handling
- Responsive grid layout

**State Management**:
- Uses Zustand store for global state
- Local state for UI interactions
- WebSocket hook for live data

#### `app/globals.css`
**Purpose**: Global styles and theme
- Terminal aesthetic (pure black background)
- Custom scrollbar styling
- Animation keyframes
- Utility classes
- Font imports (JetBrains Mono, Orbitron)

**Highlights**:
- Scanline effect
- Grid background
- Glow effects
- Custom selection colors
- Shimmer loading animations

---

### Components Directory (`components/`)

#### `components/PriceCard.js`
**Purpose**: Individual coin display card

**Displays**:
- Ticker and sector badge
- Setup grade (A/B/C)
- Live price and 24h change
- 24h high/low range with visual bar
- Distance to ATH percentage
- 24h volume
- BTC/ETH correlation coefficients
- Mini order book on hover
- Probability score gauge
- Action buttons (refresh, remove)
- Last updated timestamp

**Interactions**:
- Click to open detailed modal
- Hover for order book preview
- Refresh button to update timestamp
- Remove button with confirmation

**Visual Design**:
- Green border glow on hover
- Color-coded by price movement
- Animated entrance/exit
- Gradient backgrounds

#### `components/OrderBook.js`
**Purpose**: Market depth visualization

**Displays**:
- Top 5 bids (buy orders) in green
- Top 5 asks (sell orders) in red
- Quantity bars scaled to max
- Spread calculation
- Mini version for card hover

**Features**:
- Real-time updates from WebSocket
- Visual depth bars
- Price and quantity formatting
- Responsive to container size

#### `components/Modal.js`
**Purpose**: Detailed coin analysis view

**Displays**:
- Full header with ticker, grade, price
- Timeframe selector (15m, 1h, 4h, 1d)
- TradingView chart link
- Statistics grid (high, low, volume, ATH distance)
- Full order book
- Probability slider (0-100%)
- Setup grade buttons (A/B/C)
- Correlation bars (BTC/ETH)
- Research notes textarea

**Interactions**:
- Edit probability score with slider
- Change setup grade
- Add/edit research notes
- Save all changes at once
- Click outside to close

**Design**:
- Full-screen overlay with backdrop blur
- Smooth animations (scale, fade)
- Organized 3-column layout
- Color-coded grades

#### `components/AdminPanel.js`
**Purpose**: Password-protected admin console

**Features**:
- Floating action button (bottom right)
- Password authentication (default: crypto2024)
- Bulk ticker entry (comma-separated)
- Single coin entry with full config
- Probability slider
- Grade selector
- Notes field
- Lock console button

**Security**:
- Password prompt before access
- Session-based authentication (Zustand)
- Easy to customize password
- Can be extended with real auth

---

### Library Directory (`lib/`)

#### `lib/store.js`
**Purpose**: Central state management with Zustand

**State Variables**:
- `coins`: Array of tracked coins
- `priceData`: Live price information
- `orderBooks`: Market depth data
- `sortBy`: Current sort method
- `filterSector`: Active sector filter
- `probabilityDecay`: Decay toggle
- `isAdminAuthenticated`: Admin access
- `wsConnected`: WebSocket status

**Actions**:
- `addCoin()`: Add single coin with config
- `addBulkCoins()`: Parse and add multiple coins
- `removeCoin()`: Delete coin from list
- `updateCoinProbability()`: Change score
- `updateCoinGrade()`: Change grade
- `updateCoinNotes()`: Update research notes
- `refreshCoin()`: Update timestamp
- `updatePriceData()`: Store live prices
- `updateOrderBook()`: Store market depth
- `updateCorrelation()`: Store BTC/ETH betas
- `applyProbabilityDecay()`: Reduce scores over time
- `getFilteredCoins()`: Apply filters and sorting

**Sector Auto-Categorization**:
- Keywords for each sector
- Automatic matching by ticker
- Fallback to "Other" category

**Persistence**:
- Uses Zustand persist middleware
- Saves to localStorage
- Survives page refreshes
- Selective state storage

#### `lib/websocket.js`
**Purpose**: Binance WebSocket integration

**Hook: `useBinanceWebSocket()`**
- Connects to Binance stream
- Subscribes to ticker and depth data
- Formats symbols (adds USDT)
- Handles multiple coins simultaneously
- Auto-reconnect on disconnect

**Data Processing**:
- Parses ticker events (price, volume, change)
- Parses depth events (order book)
- Calculates correlations
- Updates Zustand store

**Hook: `useCoinData(ticker)`**
- Retrieves price data for specific coin
- Calculates distance to ATH
- Determines if near ATH (<5%)
- Returns formatted data object

**Correlation Calculation**:
- Stores 100 price points per coin
- Calculates Pearson correlation coefficient
- Compares each coin to BTC and ETH
- Updates every price tick

---

## Data Flow

### Adding a Coin
```
User clicks + button
  → Opens AdminPanel
  → Password check (if needed)
  → User enters tickers
  → addBulkCoins() or addCoin()
  → determineSector() categorizes
  → Coin added to store
  → Store persists to localStorage
  → WebSocket subscribes to new ticker
  → Live data starts flowing
```

### Live Data Updates
```
Binance WebSocket sends message
  → websocket.js receives event
  → Parses ticker or depth data
  → Calculates correlations
  → Updates Zustand store
  → PriceCard re-renders with new data
  → OrderBook updates depth display
  → User sees live prices
```

### Filtering and Sorting
```
User changes filter/sort
  → Updates store state
  → getFilteredCoins() recalculates
  → Grid re-renders with new order
  → Smooth animations (Framer Motion)
```

---

## Key Technologies

### Next.js 14 (App Router)
- Server Components by default
- Client Components with `'use client'`
- File-based routing
- Automatic code splitting
- API routes (not used here, but available)

### Zustand
- Lightweight state management
- No boilerplate (vs Redux)
- Built-in persistence
- Easy to test and debug

### Framer Motion
- Declarative animations
- AnimatePresence for enter/exit
- Gesture animations (hover, tap)
- Spring physics

### Tailwind CSS
- Utility-first styling
- Custom theme integration
- Responsive design (md:, lg: breakpoints)
- Dark mode ready (not used here)

### Binance WebSocket
- Public API (no key needed)
- Real-time market data
- Multiple simultaneous connections
- Auto-reconnect logic

---

## Styling System

### Color Palette
- **Terminal Black**: `#000000` - Main background
- **Terminal Dark**: `#0A0A0A` - Secondary background
- **Terminal Border**: `#1A1A1A` - Borders
- **Neon Emerald**: `#10B981` - Positive/Buy
- **Neon Crimson**: `#EF4444` - Negative/Sell
- **Neon Gold**: `#F59E0B` - ATH indicators
- **Neon Blue**: `#3B82F6` - Neutral/Info
- **Neon Purple**: `#A855F7` - Highlights

### Typography
- **Display Font**: Orbitron (headers, logo)
- **Mono Font**: JetBrains Mono (prices, data)
- **Tabular Numbers**: Aligned digits for clean data display

### Animations
- **Pulse**: Slow pulse for live indicators
- **Glow**: Pulsing glow for borders
- **Slide Up**: Entry animation for cards
- **Fade In**: General content appearance
- **Shimmer**: Loading skeleton effect

---

## Performance Considerations

### Optimizations
1. **WebSocket Throttling**: Updates limited to avoid overload
2. **Component Memoization**: React memo where needed
3. **Virtual Scrolling**: Not implemented (add if >100 coins)
4. **Lazy Loading**: Images and charts load on demand
5. **Code Splitting**: Next.js automatic splitting

### Scalability
- **Current**: Handles ~50 coins smoothly
- **Recommended Max**: 100 coins
- **Beyond 100**: Consider pagination or virtualization

---

## Future Enhancements

### Planned Features
1. **Supabase Integration**: Cloud storage
2. **CoinTracking API**: Portfolio tracking
3. **Advanced Charts**: TradingView widget embed
4. **Alerts System**: Price/probability notifications
5. **Export Reports**: PDF generation
6. **Multi-User Support**: Team collaboration
7. **Mobile App**: React Native version
8. **Dark/Light Toggle**: Theme switcher

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Add coin via bulk entry
- [ ] Add coin via single entry with custom config
- [ ] Verify live prices update
- [ ] Check order book loads
- [ ] Open coin modal
- [ ] Edit probability/grade/notes
- [ ] Test all filters (sector)
- [ ] Test all sort options
- [ ] Verify probability decay works
- [ ] Test on mobile devices
- [ ] Check admin password protection

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Troubleshooting Guide

### Common Issues

**Issue**: Coins not updating
- Check WebSocket connection (header status)
- Open browser console for errors
- Verify ticker format (uppercase, no spaces)

**Issue**: localStorage full
- Clear old data: `localStorage.clear()`
- Reduce number of tracked coins

**Issue**: Slow performance
- Too many coins (>100)
- Old browser version
- Disable probability decay
- Check console for errors

---

This structure document should help you understand every part of the codebase. Each file has a clear purpose and they all work together to create a professional crypto intelligence dashboard.
