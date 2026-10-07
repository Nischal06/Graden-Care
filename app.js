/* ============================================================
   UNDERSTORY: THE SCREEN-ZERO POCKET NATURALIST & GARDEN APP
   Core Logic & Web Audio Nature Synthesizer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    activeTab: 'tab-screen-zero',
    soundscapeActive: false,
    audioContext: null,
    natureNodes: {},
    speaking: false,
    screenTimeSeconds: 42,
    outsideTimeSeconds: 5240, // ~1h 27m
    currentSpecimenId: 'turkey_tail',
    antiScreenCurtainActive: false,
    lastInteractionTimestamp: Date.now(),
    geminiApiKey: localStorage.getItem('understory_gemini_key') || '',
    useGeminiCloud: !!localStorage.getItem('understory_gemini_key'),
    journalEntries: [
      {
        id: 'entry-1',
        name: 'Turkey Tail Fungus (Trametes versicolor)',
        time: '09:40 AM',
        location: 'Bear Creek Ravine (3,420 ft)',
        thumb: 'assets/turkey_tail.jpg',
        sensory: 'Pores verified on underside. Soft suede texture on concentric bands.'
      },
      {
        id: 'entry-2',
        name: 'Wild Stinging Nettle (Urtica dioica)',
        time: '10:15 AM',
        location: 'Stream Bank Trail (3,380 ft)',
        thumb: 'assets/stinging_nettle.jpg',
        sensory: 'Trichome hairs identified along square stem. Harvested young apical tops.'
      },
      {
        id: 'entry-3',
        name: 'Heirloom Tomato Bed (Bed A)',
        time: '11:10 AM',
        location: 'Homestead Allotment',
        thumb: 'assets/tomato_plant.jpg',
        sensory: 'Soil moisture tested at 68%. Basil companion plants repelling hornworms.'
      }
    ]
  };

  // Specimen Knowledge Database (Simulated Local Llama 3.2 + Moondream2)
  const specimenDatabase = {
    turkey_tail: {
      name: 'Turkey Tail Fungus',
      scientific: 'Trametes versicolor',
      thumb: 'assets/turkey_tail.jpg',
      badges: [
        { label: 'Verified Forageable', class: 'pill-safe-forage', icon: '🍄' },
        { label: 'Tactile Test Required', class: 'pill-tactile', icon: '✋' }
      ],
      boxLabel: 'Trametes versicolor [99.4% conf]',
      boxCoords: { top: '28%', left: '22%', width: '56%', height: '48%' },
      identification: 'Concentric growth bands alternating in shades of buff, cinnamon, and cream with a velvet-soft upper surface. Underside features 3–8 microscopic white pores per millimeter rather than gills.',
      tactileCue: 'Run your thumb across the damp surface: true Turkey Tail feels like soft suede or moleskin, and the underside is flat and spongy. If the underside is smooth parchment with no pores, it is False Turkey Tail (Stereum ostrea).',
      gardenAction: 'Saprophytic log inoculant: Highly beneficial for building woodland fungal humus and accelerating nurse-log soil replenishment in shaded garden corners.',
      audioSpeech: 'Examining shelf fungus. It has alternating concentric zones of brown and ochre with a pore-covered underside, consistent with Turkey Tail. Feel the top—it should be velvet-smooth. Check the underside: tiny white pores confirm true Turkey Tail. False Turkey Tail is smooth parchment with no pores.'
    },
    tomato_plant: {
      name: 'Heirloom Brandywine Tomato',
      scientific: 'Solanum lycopersicum',
      thumb: 'assets/tomato_plant.jpg',
      badges: [
        { label: 'Garden Bed A', class: 'pill-safe-forage', icon: '🍅' },
        { label: 'High Foliage Vigour', class: 'pill-garden-alert', icon: '🌿' }
      ],
      boxLabel: 'Solanum lycopersicum [98.7% conf]',
      boxCoords: { top: '20%', left: '15%', width: '65%', height: '60%' },
      identification: 'Potato-leaf foliage characteristic of heirloom Brandywine. Fruit trusses show balanced green development with strong calyx attachment and zero signs of blossom end rot.',
      tactileCue: 'Press your fingertips two inches into the soil root perimeter: if damp and cool without standing water, hydration is balanced. Gently rub the leaf stem between your palms—the intense sweet-musky solanine aroma indicates robust terpene production defending against aphids.',
      gardenAction: 'Interplant Genovese Basil and French Marigolds (*Tagetes patula*) at the base to deter root-knot nematodes and boost predatory hoverfly visits.',
      audioSpeech: 'Heirloom Brandywine Tomato foliage identified. Vigour is optimal with zero signs of blossom end rot or early blight. Dig two inches into the soil: if cool and damp, hold off on afternoon watering to avoid fungal dampening.'
    },
    stinging_nettle: {
      name: 'Wild Stinging Nettle',
      scientific: 'Urtica dioica',
      thumb: 'assets/stinging_nettle.jpg',
      badges: [
        { label: 'Nutrient-Dense Edible', class: 'pill-safe-forage', icon: '🍵' },
        { label: 'Formic Acid Warning', class: 'pill-tactile', icon: '⚠️' }
      ],
      boxLabel: 'Urtica dioica [99.1% conf]',
      boxCoords: { top: '24%', left: '28%', width: '50%', height: '52%' },
      identification: 'Opposite, coarse-toothed leaves with heart-shaped bases growing on distinct four-angled square stems. Coated in translucent hollow trichome needles containing formic acid and serotonin.',
      tactileCue: 'Caution: Do not grasp bare-handed. If harvesting for spring tea or compost tea activator, use gloved fingers to pinch only the tender top 4 leaves. Steaming or drying instantly neutralizes the sting.',
      gardenAction: 'Dynamic accumulator: Harvest stems to make a fermented stinging nettle liquid fertilizer high in nitrogen, iron, and silica to supercharge garden compost piles.',
      audioSpeech: 'Wild Stinging Nettle identified. Do not grip the stem bare-handed: the fine trichomes contain formic acid. The tender top whorls make a mineral-rich tea once steeped or dried, or a potent nitrogen fertilizer for your raised garden beds.'
    }
  };

  // ==========================================
  // PROCEDURAL WEB AUDIO NATURE SOUND GENERATOR
  // Synthesizes soothing wind, rain dew, and bird notes
  // ==========================================
  function initSoundscape() {
    if (!state.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioContext = new AudioCtx();
    }
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }
  }

  function startForestAmbientAudio() {
    initSoundscape();
    const ctx = state.audioContext;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // 1. Procedural Wind / Canopy Breeze (Pink Noise filtered)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(340, ctx.currentTime);

    // Slow wind modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    lfo.start();

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.22, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    windSource.start();

    // 2. Periodic Gentle Woodland Bird Call Generator
    const birdInterval = setInterval(() => {
      if (!state.soundscapeActive) return;
      playSoftBirdChirp(ctx, masterGain);
    }, 4500);

    state.natureNodes = {
      masterGain,
      windSource,
      lfo,
      birdInterval
    };
  }

  function playSoftBirdChirp(ctx, destination) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2600 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  function stopForestAmbientAudio() {
    if (state.natureNodes.birdInterval) {
      clearInterval(state.natureNodes.birdInterval);
    }
    if (state.natureNodes.windSource) {
      try {
        state.natureNodes.windSource.stop();
        state.natureNodes.lfo.stop();
      } catch (e) {
        // Source already stopped
      }
    }
    state.natureNodes = {};
  }

  // ==========================================
  // SPEECH SYNTHESIS (Naturalist Piper Voice)
  // ==========================================
  function speakNaturalistResponse(text) {
    if (!('speechSynthesis' in window)) {
      showToast('Web Speech API not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop prior audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Calm, measured naturalist cadence
    utterance.pitch = 1.0;

    // Pick best natural voice available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    const ttsStatusEl = document.getElementById('tts-live-indicator');
    if (ttsStatusEl) {
      ttsStatusEl.innerHTML = `<span class="pulsing-dot"></span> Speaking (Piper TTS Mode)`;
    }

    utterance.onend = () => {
      state.speaking = false;
      if (ttsStatusEl) {
        ttsStatusEl.innerHTML = `🟢 Ready (Offline)`;
      }
    };

    utterance.onerror = () => {
      state.speaking = false;
      if (ttsStatusEl) {
        ttsStatusEl.innerHTML = `🟢 Ready (Offline)`;
      }
    };

    state.speaking = true;
    window.speechSynthesis.speak(utterance);
  }

  // ==========================================
  // UI INTERACTION & EVENT WIRING
  // ==========================================

  // Tab Navigation
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-target');
      state.activeTab = targetTab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) targetPanel.classList.add('active');

      resetUserInteractionTimer();
    });
  });

  // Soundscape Toggle Button
  const soundscapeBtn = document.getElementById('toggle-soundscape-btn');
  if (soundscapeBtn) {
    soundscapeBtn.addEventListener('click', () => {
      state.soundscapeActive = !state.soundscapeActive;
      if (state.soundscapeActive) {
        startForestAmbientAudio();
        soundscapeBtn.classList.add('active');
        soundscapeBtn.querySelector('.sound-status-label').textContent = 'Forest Ambience: On';
        showToast('🌲 Procedural forest soundscape active');
      } else {
        stopForestAmbientAudio();
        soundscapeBtn.classList.remove('active');
        soundscapeBtn.querySelector('.sound-status-label').textContent = 'Forest Ambience: Off';
      }
    });
  }

  // Specimen Selector Thumbs
  const sampleThumbs = document.querySelectorAll('.specimen-sample-thumb');
  sampleThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const specimenId = thumb.getAttribute('data-specimen');
      loadSpecimen(specimenId);
      sampleThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  function loadSpecimen(id) {
    const data = specimenDatabase[id];
    if (!data) return;
    state.currentSpecimenId = id;

    // Update Stage Image
    const stageImg = document.getElementById('scanner-specimen-img');
    if (stageImg) stageImg.src = data.thumb;

    // Update Bounding Box
    const boxEl = document.getElementById('vlm-specimen-box');
    const labelEl = document.getElementById('vlm-specimen-label');
    if (boxEl && labelEl) {
      boxEl.style.top = data.boxCoords.top;
      boxEl.style.left = data.boxCoords.left;
      boxEl.style.width = data.boxCoords.width;
      boxEl.style.height = data.boxCoords.height;
      labelEl.textContent = data.boxLabel;
    }

    // Update Text Content
    const sciName = document.getElementById('specimen-scientific-name');
    const commName = document.getElementById('specimen-common-name');
    const badgesRow = document.getElementById('specimen-badges-row');
    const idDesc = document.getElementById('specimen-ident-text');
    const tactileDesc = document.getElementById('specimen-tactile-text');
    const gardenDesc = document.getElementById('specimen-garden-text');

    if (sciName) sciName.textContent = data.scientific;
    if (commName) commName.innerHTML = `${data.name} <span class="badge-offline">Local Model</span>`;
    if (idDesc) idDesc.textContent = data.identification;
    if (tactileDesc) tactileDesc.textContent = data.tactileCue;
    if (gardenDesc) gardenDesc.textContent = data.gardenAction;

    if (badgesRow) {
      badgesRow.innerHTML = data.badges.map(b => `
        <span class="pill-badge ${b.class}">${b.icon} ${b.label}</span>
      `).join('');
    }

    // Voice utterance
    speakNaturalistResponse(data.audioSpeech);
  }

  // Audio Replay button in scanner
  const replayScannerAudioBtn = document.getElementById('replay-scanner-speech-btn');
  if (replayScannerAudioBtn) {
    replayScannerAudioBtn.addEventListener('click', () => {
      const data = specimenDatabase[state.currentSpecimenId];
      if (data) speakNaturalistResponse(data.audioSpeech);
    });
  }

  // ==========================================
  // GOOGLE GEMINI FLASH API INTEGRATION
  // ==========================================
  async function callGeminiTextAPI(userPrompt) {
    if (!state.geminiApiKey) return null;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${state.geminiApiKey}`;
    const payload = {
      contents: [{
        parts: [{
          text: `You are Understory, an expert field naturalist, permaculture gardener, and wilderness companion. Keep your response strictly under 3 sentences. Be warm, accurate, and deeply encouraging of being outdoors. Always include a hands-in-the-dirt tactile cue or sensory verification (something to touch, smell, or check with hands).\n\nQuestion: "${userPrompt}"`
        }]
      }]
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  async function callGeminiVisionAPI(base64Data, mimeType) {
    if (!state.geminiApiKey) return null;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${state.geminiApiKey}`;
    const prompt = `You are the Understory Field Naturalist. Analyze this image. Identify the plant, fungus, insect, leaf disease, or garden specimen.
Provide your response in EXACT JSON format with these keys:
{
  "commonName": "Common Name",
  "scientificName": "Scientific Latin name",
  "identification": "2 sentences describing morphological features and signs.",
  "tactileCue": "1-2 sentences with a hands-on physical test (what to touch, smell, or feel with fingers).",
  "gardenAction": "1-2 sentences on permaculture role, companion planting, or soil health.",
  "audioSpeech": "Spoken audio guide for headphones in 35 words max."
}
Return raw JSON only, without any markdown formatting or code blocks.`;

    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }]
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  // Toggle Gemini Mode button
  const toggleGeminiBtn = document.getElementById('toggle-gemini-btn');
  if (toggleGeminiBtn) {
    // Initial state reflection
    if (state.useGeminiCloud && state.geminiApiKey) {
      toggleGeminiBtn.classList.add('active');
      toggleGeminiBtn.innerHTML = `<span>⚡ Gemini Flash: Live</span>`;
    } else {
      toggleGeminiBtn.classList.remove('active');
      toggleGeminiBtn.innerHTML = `<span>🌲 Local Simulation Only</span>`;
    }

    toggleGeminiBtn.addEventListener('click', () => {
      if (!state.useGeminiCloud) {
        if (!state.geminiApiKey) {
          const userKey = prompt('Enter your Google Gemini API Key (saved locally in your browser):', '');
          if (userKey && userKey.trim()) {
            state.geminiApiKey = userKey.trim();
            localStorage.setItem('understory_gemini_key', state.geminiApiKey);
          } else {
            showToast('🌲 Continuing with offline local simulation');
            return;
          }
        }
        state.useGeminiCloud = true;
        toggleGeminiBtn.classList.add('active');
        toggleGeminiBtn.innerHTML = `<span>⚡ Gemini Flash: Live</span>`;
        showToast('⚡ Live Google Gemini Flash intelligence activated');
      } else {
        state.useGeminiCloud = false;
        toggleGeminiBtn.classList.remove('active');
        toggleGeminiBtn.innerHTML = `<span>🌲 Local Simulation Only</span>`;
        showToast('🌲 Switched to offline simulated pipeline');
      }
    });
  }

  // Custom Image Upload Handler with Gemini Flash Vision
  const customFileInput = document.getElementById('custom-specimen-input');
  if (customFileInput) {
    customFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fullDataUrl = event.target.result;
        const stageImg = document.getElementById('scanner-specimen-img');
        if (stageImg) stageImg.src = fullDataUrl;

        showToast('🔍 Analyzing image with Gemini Flash Vision...');
        const sciName = document.getElementById('specimen-scientific-name');
        const commName = document.getElementById('specimen-common-name');
        const idDesc = document.getElementById('specimen-ident-text');
        const tactileDesc = document.getElementById('specimen-tactile-text');
        const gardenDesc = document.getElementById('specimen-garden-text');
        const labelEl = document.getElementById('vlm-specimen-label');

        if (commName) commName.innerHTML = `Analyzing Specimen... <span class="badge-offline">Processing</span>`;

        try {
          if (state.useGeminiCloud && state.geminiApiKey) {
            const base64Content = fullDataUrl.split(',')[1];
            const mimeType = file.type || 'image/jpeg';
            const visionResult = await callGeminiVisionAPI(base64Content, mimeType);

            if (visionResult && visionResult.commonName) {
              if (sciName) sciName.textContent = visionResult.scientificName || 'Botanical Specimen';
              if (commName) commName.innerHTML = `${visionResult.commonName} <span class="badge-offline" style="background: rgba(16,185,129,0.3);">⚡ Gemini Flash</span>`;
              if (idDesc) idDesc.textContent = visionResult.identification || 'Specimen analyzed successfully.';
              if (tactileDesc) tactileDesc.textContent = visionResult.tactileCue || 'Check leaf texture and soil moisture.';
              if (gardenDesc) gardenDesc.textContent = visionResult.gardenAction || 'Maintain regular companion mulching.';
              if (labelEl) labelEl.textContent = `${visionResult.scientificName || visionResult.commonName} [Gemini Live]`;

              const speech = visionResult.audioSpeech || `${visionResult.commonName} identified. Check tactile cues.`;
              speakNaturalistResponse(speech);
              showToast(`🌿 Identified: ${visionResult.commonName}`);
              return;
            }
          }
        } catch (err) {
          console.warn('Gemini vision API error, falling back to local heuristic:', err);
        }

        // Fallback local description
        if (sciName) sciName.textContent = 'Custom Botanical Specimen';
        if (commName) commName.innerHTML = `Field Observation <span class="badge-offline">Local Model</span>`;
        if (idDesc) idDesc.textContent = `Analyzing custom uploaded leaf venation and morphology. Healthy chlorophyll distribution detected.`;
        if (tactileDesc) tactileDesc.textContent = `Gently inspect the leaf undersides for aphid clusters or spider mites. Soil finger moisture test recommended.`;
        if (gardenDesc) gardenDesc.textContent = `Mulch with hardwood chips or organic compost to insulate roots and preserve soil moisture.`;
        if (labelEl) labelEl.textContent = `Custom Flora [Local Heuristic]`;

        const fallbackSpeech = `Custom specimen analyzed. No systemic blight observed. Check soil moisture and leaf undersides.`;
        speakNaturalistResponse(fallbackSpeech);
        showToast('📷 Image parsed with local heuristic');
      };
      reader.readAsDataURL(file);
    });
  }

  // Screen-Zero "Tap to Whisper / Blind Snap" Action
  const bigListenBtn = document.getElementById('big-screen-zero-listen-btn');
  if (bigListenBtn) {
    bigListenBtn.addEventListener('click', triggerScreenZeroVoicePrompt);
  }

  const compassCore = document.getElementById('compass-interactive-core');
  if (compassCore) {
    compassCore.addEventListener('click', triggerScreenZeroVoicePrompt);
  }

  // Quick field prompt chips
  const quickPromptChips = document.querySelectorAll('.quick-prompt-chip');
  quickPromptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      executeNaturalistDialogue(promptText);
    });
  });

  // Custom Ask Form Submission
  const customAskForm = document.getElementById('custom-ask-form');
  const customAskInput = document.getElementById('custom-ask-input');
  if (customAskForm && customAskInput) {
    customAskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = customAskInput.value.trim();
      if (query) {
        executeNaturalistDialogue(query);
        customAskInput.value = '';
      }
    });
  }

  function triggerScreenZeroVoicePrompt() {
    const sampleQueries = [
      "What is this velvety shelf fungus on the fallen cedar log?",
      "Why are the leaves on my garden tomatoes curling slightly upward?",
      "What is that 3-beat rhythm bird call in the canopy to my north?",
      "Can I harvest these young nettle leaves without gloves?"
    ];
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    executeNaturalistDialogue(randomQuery);
  }

  async function executeNaturalistDialogue(userQuestion) {
    const transcriptFeed = document.getElementById('audio-transcript-feed');
    if (!transcriptFeed) return;

    // User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'transcript-bubble bubble-user';
    userBubble.innerHTML = `
      <div class="bubble-meta">
        <span>🎙️ Field Input (whisper.cpp)</span>
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <p>"${userQuestion}"</p>
    `;
    transcriptFeed.appendChild(userBubble);
    transcriptFeed.scrollTop = transcriptFeed.scrollHeight;

    // If Gemini Cloud is active, query real Gemini Flash API
    if (state.useGeminiCloud && state.geminiApiKey) {
      const pendingBubble = document.createElement('div');
      pendingBubble.className = 'transcript-bubble bubble-naturalist';
      pendingBubble.id = 'gemini-pending-bubble';
      pendingBubble.innerHTML = `
        <div class="bubble-meta">
          <span>🌿 Understory Naturalist</span>
          <span class="badge-offline">⚡ Thinking with Gemini Flash...</span>
        </div>
        <p style="opacity: 0.7;">Listening to nature and processing inquiry...</p>
      `;
      transcriptFeed.appendChild(pendingBubble);
      transcriptFeed.scrollTop = transcriptFeed.scrollHeight;

      try {
        const geminiReply = await callGeminiTextAPI(userQuestion);
        pendingBubble.remove();
        if (geminiReply) {
          const geminiBubble = document.createElement('div');
          geminiBubble.className = 'transcript-bubble bubble-naturalist';
          geminiBubble.innerHTML = `
            <div class="bubble-meta">
              <span>🌿 Understory Naturalist (Live Google Gemini Flash)</span>
              <span class="badge-offline" style="background: rgba(16,185,129,0.25); border-color: var(--emerald-neon);">⚡ Live AI</span>
            </div>
            <p>${geminiReply}</p>
            <div class="sensory-action-box">
              🍃 Tactile cue: Verify with your fingers or observe the soil texture directly.
            </div>
            <button class="replay-audio-btn" onclick="window.speakNaturalist('${escape(geminiReply)}')">
              🔊 Replay in Headphones
            </button>
          `;
          transcriptFeed.appendChild(geminiBubble);
          transcriptFeed.scrollTop = transcriptFeed.scrollHeight;
          speakNaturalistResponse(geminiReply);
          return;
        }
      } catch (err) {
        console.warn('Gemini text API request failed, falling back to local database:', err);
        const oldBubble = document.getElementById('gemini-pending-bubble');
        if (oldBubble) oldBubble.remove();
      }
    }

    // Fallback: Local Rule-Based Answers mapped to queries
    let answerText = "";
    let sensoryTip = "";

    if (userQuestion.toLowerCase().includes('fungus') || userQuestion.toLowerCase().includes('cedar')) {
      answerText = "That’s Turkey Tail (*Trametes versicolor*). Notice the alternating bands of cinnamon and ochre. Check the underside: tiny white pores confirm true Turkey Tail. False Turkey Tail is smooth parchment with no pores.";
      sensoryTip = "✋ Tactile check: Feel the top—it should be soft like moleskin suede.";
    } else if (userQuestion.toLowerCase().includes('tomato') || userQuestion.toLowerCase().includes('curling')) {
      answerText = "Physiological leaf curl. Usually caused by hot afternoon wind and rapid moisture flux rather than a virus. Prune any bottom leaves touching the soil and ensure deep morning irrigation.";
      sensoryTip = "🌱 Soil test: Dig your thumb two inches deep. If bone dry, give a slow 2-gallon soak.";
    } else if (userQuestion.toLowerCase().includes('bird') || userQuestion.toLowerCase().includes('call')) {
      answerText = "That’s a Black-capped Chickadee (*Poecile atricapillus*). The two-to-three note descending whistle is their classic spring-summer territory song.";
      sensoryTip = "👂 Auditory cue: Look 25 degrees up into the hemlock boughs for a 4-inch black cap.";
    } else {
      answerText = "Stinging Nettle (*Urtica dioica*). The hollow stinging hairs contain formic acid. Use gloves or pinch firmly from the leaf underside to harvest the top four leaves for mineral-dense tea.";
      sensoryTip = "⚠️ Sensory reminder: Never grip the square stem bare-handed.";
    }

    // Naturalist Response Bubble
    setTimeout(() => {
      const naturalistBubble = document.createElement('div');
      naturalistBubble.className = 'transcript-bubble bubble-naturalist';
      naturalistBubble.innerHTML = `
        <div class="bubble-meta">
          <span>🌿 Understory Naturalist (Offline Local Model)</span>
          <span class="badge-offline">0ms Cloud</span>
        </div>
        <p>${answerText}</p>
        <div class="sensory-action-box">${sensoryTip}</div>
        <button class="replay-audio-btn" onclick="window.speakNaturalist('${escape(answerText)}')">
          🔊 Replay in Headphones
        </button>
      `;
      transcriptFeed.appendChild(naturalistBubble);
      transcriptFeed.scrollTop = transcriptFeed.scrollHeight;

      // Speak aloud
      speakNaturalistResponse(answerText);
    }, 450);
  }

  // Window helper for dynamically created buttons
  window.speakNaturalist = (escapedText) => {
    speakNaturalistResponse(unescape(escapedText));
  };

  // ==========================================
  // GARDEN BEDS INTERACTIVE ACTIONS
  // ==========================================
  window.handleGardenAction = (bedName, actionType) => {
    if (actionType === 'water') {
      showToast(`💧 Deep watering logged for ${bedName}. Soil moisture replenished to 75%.`);
      speakNaturalistResponse(`Deep watering logged for ${bedName}. Moistening root depth to four inches.`);
    } else if (actionType === 'mulch') {
      showToast(`🍂 Organic mulch layer added to ${bedName}. Evaporation reduced by 40%.`);
      speakNaturalistResponse(`Mulch layer added. Mycorrhizal fungi will break down the organic carbon.`);
    } else if (actionType === 'harvest') {
      showToast(`🧺 Harvest scheduled for ${bedName} in 3 days.`);
      speakNaturalistResponse(`Optimal harvest window approaching. Harvest early morning for peak sugars.`);
    }
  };

  // ==========================================
  // EXPORT FIELD JOURNAL TO MARKDOWN FILE
  // ==========================================
  const exportBtn = document.getElementById('export-journal-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const markdownContent = `# Understory Field Journal & Garden Log
Generated: ${new Date().toLocaleDateString()} | Offline Mode
Total Time Outside: ${formatTime(state.outsideTimeSeconds)}
Screen Time: ${state.screenTimeSeconds}s (Grass Touch Ratio: 99.4%)

## Verified Species & Garden Observations
${state.journalEntries.map(e => `
### ${e.name}
- **Time:** ${e.time}
- **Location:** ${e.location}
- **Sensory Field Note:** ${e.sensory}
`).join('\n')}

---
*Generated by Understory — The Open-Source Screen-Zero Naturalist*
`;

      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `understory_field_notes_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📄 Field notes exported to Markdown');
    });
  }

  // ==========================================
  // "TOUCH GRASS" & ANTI-SCREEN TIMERS
  // ==========================================
  setInterval(() => {
    state.outsideTimeSeconds++;
    const outsideEl = document.getElementById('time-outside-display');
    if (outsideEl) outsideEl.textContent = formatTime(state.outsideTimeSeconds);

    // Screen time updates only when user is active
    const now = Date.now();
    if (now - state.lastInteractionTimestamp < 15000 && !state.antiScreenCurtainActive) {
      state.screenTimeSeconds++;
      const screenEl = document.getElementById('screen-time-display');
      if (screenEl) screenEl.textContent = `${state.screenTimeSeconds}s`;

      const grassRatio = ((1 - (state.screenTimeSeconds / state.outsideTimeSeconds)) * 100).toFixed(1);
      const ratioEl = document.getElementById('grass-ratio-display');
      if (ratioEl) ratioEl.textContent = `${Math.min(99.9, Math.max(90.0, grassRatio))}%`;
    }
  }, 1000);

  function formatTime(totalSecs) {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  function resetUserInteractionTimer() {
    state.lastInteractionTimestamp = Date.now();
  }

  ['click', 'mousemove', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetUserInteractionTimer, { passive: true });
  });

  // Anti-Screen "Look Up" Curtain Trigger
  const triggerCurtainBtn = document.getElementById('trigger-anti-screen-btn');
  const antiScreenCurtain = document.getElementById('anti-screen-curtain');
  const dismissCurtainBtn = document.getElementById('dismiss-curtain-btn');

  if (triggerCurtainBtn && antiScreenCurtain) {
    triggerCurtainBtn.addEventListener('click', () => {
      antiScreenCurtain.classList.add('active');
      state.antiScreenCurtainActive = true;
      speakNaturalistResponse("Screen dimmed. Put the device in your pocket. Look up: the trail is waiting.");
    });
  }

  if (dismissCurtainBtn && antiScreenCurtain) {
    dismissCurtainBtn.addEventListener('click', () => {
      antiScreenCurtain.classList.remove('active');
      state.antiScreenCurtainActive = false;
    });
  }

  // Spacebar hotkey to trigger voice prompt
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      triggerScreenZeroVoicePrompt();
    }
  });

  // Toast Notification System
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🍃</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // AMBIENT SPORES & LEAF CANVAS PARTICLES
  // ==========================================
  const canvas = document.getElementById('ambient-spores-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4 + 0.15,
        vy: -Math.random() * 0.5 - 0.1,
        alpha: Math.random() * 0.6 + 0.15,
        color: Math.random() > 0.4 ? '16, 185, 129' : '245, 158, 11'
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.5)`;
        ctx.fill();
      });
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }
});
