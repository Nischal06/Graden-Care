# Understory (Garden Care) 🌿

> **Screen-Zero Open-Source Naturalist & Permaculture Garden Companion**  
> An audio-first, offline-capable field naturalist companion designed to get you off screens and deeply engaged with the living soil and ecosystem.

---

## 🌟 Key Features

- **🎧 Screen-Zero Audio Field Mode**: Audio-first interface designed for foraging, weeding, and observation without needing to stare at a smartphone screen.
- **🔊 Procedural Forest Soundscape**: Native Web Audio API ambient sound engine synthesizing procedural wind, bird calls, rustling leaves, and stream acoustics.
- **🍄 Specimen & Plant Identification**: Local knowledge database and recognition system for wild edibles, fungi (e.g. Turkey Tail), medicinal herbs (Stinging Nettle), and garden crops (Heirloom Tomatoes).
- **📖 Field Journal & Observations**: Log touch, smell, tactile observations, soil moisture, and habitat notes.
- **⚡ Dual Mode Intelligence**: Works 100% offline with local heuristics and simulated edge models, with optional live cloud intelligence via Google Gemini Flash.
- **🌱 Glassmorphism Dark UI**: Organic nature-inspired dark palette designed for outdoor visibility and low battery consumption.

---

## 🚀 Quick Start

### Option 1: PowerShell Local Server (Windows)
Run the included local HTTP server script:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then open your browser at [http://localhost:8080](http://localhost:8080).

### Option 2: Any Static Web Server
You can serve the directory using Python or Node.js:

```bash
# Python 3
python -m http.server 8080

# Or npx serve
npx serve .
```

---

## 📁 Project Structure

```text
├── index.html          # Main application structure & semantic layout
├── styles.css          # Modern organic design system & responsive styling
├── app.js              # State engine, Web Audio synth, naturalist logic
├── server.ps1          # Lightweight native PowerShell HTTP server
├── assets/             # Botanical specimen reference imagery
│   ├── stinging_nettle.jpg
│   ├── tomato_plant.jpg
│   └── turkey_tail.jpg
└── README.md           # Project documentation
```

---

## 🛠️ Built With

- **HTML5 & Vanilla CSS3** (Custom tokens, glassmorphism, responsive CSS grid/flexbox)
- **Vanilla JavaScript (ES6+)**
- **Web Audio API** (Procedural frequency-synthesized nature acoustics)
- **Web Speech API** (Speech-to-text input & speech synthesis naturalist voice)

---

## 📄 License

Open-source and free for all community gardeners, naturalists, and foragers.
