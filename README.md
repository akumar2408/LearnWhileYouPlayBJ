# Learn‑While‑You‑Play Blackjack (Dealer‑Assisted Coach)

Visually slick Expo React Native app that **quietly** rates each player decision vs. basic strategy and a subset of **index deviations** (Illustrious 18 + a few extras). After the shoe, it shows **heatmaps** of your accuracy by situation.

## Highlights
- **Dealer Console**: Tap dealt cards (player seats + dealer upcard). App tracks **Hi‑Lo running count** and **true count**.
- **Stealth Coaching**: No advice mid‑hand by default. You log players’ actions (Hit/Stand/Double/Split/Surrender), and the app rates them silently.
- **Indices**: Applies core deviations using the **true count** (rounded) when the situation matches (e.g., *16 vs 10 — Stand @ TC≥0*).
- **Insights**: Post‑shoe **heatmaps** for hard/soft/pair buckets, “Top Mistakes,” and overall accuracy.
- **Offline**: All local — ideal for home games and practice sessions.

## Tech
- React Native (Expo)
- react‑navigation
- AsyncStorage persistence
- react‑native‑svg heatmaps
- Strategy engine in `/src/engine/*`

## Run it
```bash
npm i -g expo@latest
npm i
npm run start
# press i for iOS simulator or a for Android
```

## Flow
1. **Home → Table Setup → Round**
2. Tap **Dealer Upcard** and each **Seat**’s cards as they are dealt.
3. For each decision per seat, tap the action performed (H/S/D/Split/Sur).  
   The app evaluates vs basic + indices **quietly**.
4. Update **Decks Remaining** periodically to keep a good **True Count**.
5. Tap **Finish Shoe** → view **Summary** → **Analytics** heatmaps.

## Notes
- Basic strategy model assumes 4–8D, **S17**, **DAS**, **Late Surrender** (configurable toggles affect a few spots).
- Index set is a **curated subset**; you can expand `/src/engine/indexDeviations.ts` with more.
- EV deltas are not computed here (to stay light on device); we score correctness and frequency. You can plug an EV table later.

## Extend
- Add **per‑seat bankroll** and payouts.
- Add **voice input** (push‑to‑talk: “hit/stand/double”).
- Add **local P2P** to let players see their personal logs post‑shoe.

---

## New Features
- **Bankrolls & Payouts:** per-seat balances with quick outcome buttons (Win/Lose/Push/Blackjack/Surrender) and hand multiplier for doubles. Supports 3:2 or 6:5.
- **Stealth Mode (real):** if OFF, a subtle “Hint” line appears under seats with the recommended action (includes index note + TC).
- **Voice Input (beta):** Uses `react-native-voice` when available; falls back to a typed command bar. Say “hit / stand / double / split / surrender.”
- **Local Sharing:** Per-seat report via **QR code** or **Copy JSON** on the **Share** screen. Players can scan or paste to keep their own logs.

### Note on Voice
This build uses a typed command bar for commands (hit/stand/double/split/surrender). 
If you later want true speech recognition, we can add it behind a dev client with a supported STT library.
