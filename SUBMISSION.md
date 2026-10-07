---
title: "Understory: A Screen-Zero Open-Source AI Garden Naturalist That Gets You Off the Screen and Into the Dirt"
published: false
description: "An offline-capable, audio-first field companion built for Hacktoberfest 2026 Touch Grass challenge, designed to get your hands in the soil and eyes off the screen."
tags: devchallenge, hf26challenge, opensource, ai
cover_image: https://raw.githubusercontent.com/Nischal06/Graden-Care/main/assets/turkey_tail.jpg
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

---

## What I Built

Modern outdoor apps suffer from a tragic paradox: to "experience nature," they demand you stare at a glowing glass rectangle, scroll through endless feed grids, and fiddle with touch sliders while your hands are covered in potting soil.

**Understory** is a **Screen-Zero Open-Source Field Naturalist & Permaculture Garden Companion** built to solve this. It is intentionally designed to make screen time the absolute shortest part of your outdoor experience.

Instead of turning your hike or weeding session into another phone-scrolling chore, Understory acts as a pocket naturalist you talk to and listen to:

1. **🎧 Screen-Zero Audio Field Mode**: Hands stay in the garden beds, eyes stay on the foliage. Understory listens through voice input and speaks back via natural audio speech synthesis with concise, field-friendly observations.
2. **✋ Tactile & Sensory Verification**: Every specimen inquiry returns a hands-in-the-dirt tactile test—prompting you to feel the velvet concentric rings of Turkey Tail mushrooms (*Trametes versicolor*), test the square stem and stinging trichomes of wild nettle (*Urtica dioica*), or inspect tomato leaf nodes for companion planting benefits.
3. **🌲 Generative Forest Soundscape**: When resting or observing, Understory synthesizes a procedural ambient nature soundscape (gentle canopy wind, rustling leaves, distant trickling streams, and birdsong) synthesized directly through native Web Audio API oscillators and bandpass noise buffers.
4. **📖 Hands-Free Field Journal**: Logs sensory impressions, weather, micro-climate soil humidity, and GPS coordinates without pulling you out of your flow state.

**Who is it for?**
Understory is built for urban gardeners, permaculture homesteaders, wild foragers, trail hikers, and software developers recovering from screen burnout who want technology that helps them connect with the physical ecosystem rather than escaping into a digital one.

---

## Demo

- **Live Repository**: [https://github.com/Nischal06/Graden-Care](https://github.com/Nischal06/Graden-Care)
- **Local Quickstart**:
  Clone the repository and launch the built-in PowerShell web server:
  ```powershell
  git clone https://github.com/Nischal06/Graden-Care.git
  cd Graden-Care
  powershell -ExecutionPolicy Bypass -File .\server.ps1
  ```
  Open `http://localhost:8080` in any modern web browser.

### Key Interactive Views

- **Screen-Zero Audio Walk Mode**: Minimalist high-contrast dark interface designed for direct outdoor sunlight, equipped with an anti-screen dimming curtain and instant voice input.
- **Botanical Knowledge Database**: Pre-loaded with regional field heuristics for wild edibles, medicinal herbs, fungi, and companion-planted nightshades.
- **Dual Intelligence Switch**: Toggle between 100% offline edge simulation and live multimodal cloud assistance (powered by Google Gemini Flash).

---

## Code

{% github Nischal06/Graden-Care %}

The repository is completely open-source:
- **`index.html`**: Clean semantic HTML5 layout with glassmorphism design tokens, screen-zero mode toggles, and live telemetry badges.
- **`styles.css`**: Organic forest color palette (`#0a140d`, `#10b981`, `#84cc16`), responsive CSS Grid/Flexbox, and bioluminescent ambient lighting.
- **`app.js`**: Web Audio API soundscape synthesizer, Web Speech API integration, offline botanical classification engine, and sensory feedback loops.
- **`server.ps1`**: Ultra-lightweight native PowerShell static web server with zero external npm/node runtime dependencies.

---

## How I Built It

Understory was architected around the core philosophy that **nature doesn't come with 5G cell towers**.

### 1. Open AI Architecture & Edge Inference Pipeline
The project is built around an edge-first AI pipeline designed to run on local laptops, tablets, or edge single-board devices (like Raspberry Pi or Qualcomm AI boards):
- **Local Vision Reasoning**: Formatted to pair with lightweight open-weight vision models like **Moondream2** and **MobileNet/Llama 3.2 Vision** for identifying leaf margins, fungal pore surfaces, and insect damage directly on device.
- **Conversational Naturalist**: Structured around prompt-engineered small language models (**Llama 3.2 1B/3B** and **Gemma 2 2B**) configured with strict brevity constraints (max 2–3 sentences) and mandatory tactile cues.
- **Voice-First Input & Output**: Uses native Web Speech recognition and synthesis, ensuring speech-to-text and audio playback happen with zero third-party latency.

### 2. Procedural Web Audio Synthesis Engine
Rather than loading heavy, looped MP3 audio files that eat bandwidth, Understory synthesizes nature sounds algorithmically:
- **Wind & Rustle**: Pink noise generators filtered through automated dynamic biquad filters simulating breezes through deciduous trees.
- **Water Streams**: Modulated high-frequency white noise through resonance peak filters.
- **Chimes & Birdsong**: Custom sine and triangle wave oscillators with randomized pitch envelopes.

### 3. Dual-Intelligence Hybrid Fallback
When you return to connectivity or want deep taxonomic exploration, Understory features a one-click cloud intelligence bridge to Google Gemini Flash for real-time vision parsing and botanical querying, safely storing user API credentials in browser `localStorage`.

---

## Why Does Open Innovation Matter?

Why does an open-source, open-model approach matter for an outdoor companion?

1. **True Offline Reliability in the Backcountry**:
   When you're three miles down a river valley or foraging in a dense hardwood forest, cellular data drops to zero. Proprietary closed APIs (which require round-trip internet pings to cloud data centers) fail completely with `ERR_CONNECTION_TIMED_OUT`. Open-weight AI models can be downloaded once and run indefinitely on consumer laptops or local edge devices with no internet connection.

2. **Absolute Foraging & Ecological Privacy**:
   Foragers and conservationists protect location data fiercely. Revealing the exact GPS coordinates or photos of an endangered native orchid or a generational patch of morels can lead to ecological poaching. Closed AI platforms log your images, prompts, and IP addresses to centralized corporate servers. With open-source AI, your coordinates and field logs never leave your physical machine.

3. **Democratizing Regenerative Agriculture**:
   Permaculture and local food production belong to humanity as an open commons. Farmers and allotment gardeners shouldn't be locked out of crop diagnosis or companion planting guidance by recurring SaaS subscriptions, rate limits, or proprietary API deprecations.

---

## My Agent Session

This project, its git setup, security audits (removing sensitive keys before git push), and architecture were developed with the assistance of DevRelay and an AI pair programmer.

{% agent_session 8f64d4e5-3570-4c1e-adea-e6b9d9cb0720 %}

---

## 🌐 Community Wisdom

During the design and implementation of Understory's audio-first, offline-capable architecture, we drew inspiration from developer community patterns shared on DEV:

- **[I Built an Offline AI Companion That Gets You Outside 🌿](https://dev.to/himanshurane/i-built-an-offline-ai-companion-that-gets-you-outside-cl0)** by [Himanshu Rane](https://dev.to/himanshurane): Provided valuable insights into minimizing screen interactions and focusing on voice-guided outdoor discovery.
- **[TrailEcho: An Offline Open-Source AI Audio Field Guide](https://dev.to/krishnasarkar051818/trailecho-an-offline-open-source-ai-audio-field-guide-that-gets-you-off-the-screen-and-into-the-3nnh)** by [Krishna Sarkar](https://dev.to/krishnasarkar051818): Highlighted the necessity of edge computing when navigating trails with zero cellular coverage.

---

## Prize Categories

- **Overall Challenge: Touch Grass** (Hacktoberfest Week 1)
- **Best Use of Render** *(Optional deployment target for self-hosted community instances)*

---

*Built with ❤️, dirt on our hands, and open-source AI for Hacktoberfest 2026.*
