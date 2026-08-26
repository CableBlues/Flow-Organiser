// app-weather-news.js: Lokales Wetter (Open-Meteo API) & Kuratiertes Nachrichten-Briefing

// ============================================================================
// 1. LOKALES WETTER (WEATHER ENGINE)
// ============================================================================

let currentWeatherLocation = JSON.parse(localStorage.getItem('flow_weather_loc') || 'null') || {
  name: 'Berlin',
  country: 'Deutschland',
  lat: 52.52,
  lon: 13.41
};
let cachedWeatherData = typeof AppStorage !== 'undefined' ? AppStorage.get('flow_weather_cache', null) : (typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('flow_weather_cache') || 'null') : null);
let weatherUnit = localStorage.getItem('flow_weather_unit') || 'c';

const WEATHER_CODES = {
  0: { label: { de: 'Klarer Himmel', en: 'Clear sky', fr: 'Ciel dégagé', it: 'Cielo sereno', es: 'Cielo despejado', el: 'Καθαρός ουρανός' }, icon: 'sun', emoji: '☀️' },
  1: { label: { de: 'Überwiegend klar', en: 'Mainly clear', fr: 'Plutôt dégagé', it: 'Prevalentemente sereno', es: 'Mayormente despejado', el: 'Κυρίως αίθριος' }, icon: 'sun-medium', emoji: '🌤️' },
  2: { label: { de: 'Teilweise bewölkt', en: 'Partly cloudy', fr: 'Partiellement nuageux', it: 'Parzialmente nuvoloso', es: 'Parcialmente nublado', el: 'Μερικώς συννεφιασμένος' }, icon: 'cloud-sun', emoji: '⛅' },
  3: { label: { de: 'Bedeckt', en: 'Overcast', fr: 'Couvert', it: 'Coperto', es: 'Nublado', el: 'Συννεφιασμένος' }, icon: 'cloud', emoji: '☁️' },
  45: { label: { de: 'Nebel', en: 'Fog', fr: 'Brouillard', it: 'Nebbia', es: 'Niebla', el: 'Ομίχλη' }, icon: 'cloud-fog', emoji: '🌫️' },
  48: { label: { de: 'Reifnebel', en: 'Depositing rime fog', fr: 'Brouillard givrant', it: 'Nebbia con brina', es: 'Niebla con escarcha', el: 'Παγωμένη ομίχλη' }, icon: 'cloud-fog', emoji: '🌫️' },
  51: { label: { de: 'Leichter Nieselregen', en: 'Light drizzle', fr: 'Bruine légère', it: 'Pioggerella leggera', es: 'Llovizna ligera', el: 'Ελαφρύ ψιχάλισμα' }, icon: 'cloud-drizzle', emoji: '🌦️' },
  53: { label: { de: 'Nieselregen', en: 'Moderate drizzle', fr: 'Bruine modérée', it: 'Pioggerella', es: 'Llovizna moderada', el: 'Μέτριο ψιχάλισμα' }, icon: 'cloud-drizzle', emoji: '🌧️' },
  55: { label: { de: 'Starker Nieselregen', en: 'Dense drizzle', fr: 'Bruine dense', it: 'Pioggerella fitta', es: 'Llovizna densa', el: 'Πυκνό ψιχάλισμα' }, icon: 'cloud-rain', emoji: '🌧️' },
  61: { label: { de: 'Leichter Regen', en: 'Slight rain', fr: 'Pluie faible', it: 'Pioggia debole', es: 'Lluvia débil', el: 'Ελαφριά βροχή' }, icon: 'cloud-rain', emoji: '🌦️' },
  63: { label: { de: 'Mäßiger Regen', en: 'Moderate rain', fr: 'Pluie modérée', it: 'Pioggia moderata', es: 'Lluvia moderada', el: 'Μέτρια βροχή' }, icon: 'cloud-rain', emoji: '🌧️' },
  65: { label: { de: 'Starker Regen', en: 'Heavy rain', fr: 'Forte pluie', it: 'Pioggia forte', es: 'Lluvia fuerte', el: 'Δυνατή βροχή' }, icon: 'cloud-rain', emoji: '🌧️' },
  71: { label: { de: 'Leichter Schneefall', en: 'Slight snowfall', fr: 'Faible chute de neige', it: 'Nevicata debole', es: 'Nevada ligera', el: 'Ελαφριά χιονόπτωση' }, icon: 'snowflake', emoji: '🌨️' },
  73: { label: { de: 'Mäßiger Schneefall', en: 'Moderate snowfall', fr: 'Chute de neige modérée', it: 'Nevicata moderata', es: 'Nevada moderada', el: 'Μέτρια χιονόπτωση' }, icon: 'snowflake', emoji: '❄️' },
  75: { label: { de: 'Starker Schneefall', en: 'Heavy snowfall', fr: 'Forte chute de neige', it: 'Nevicata intensa', es: 'Nevada intensa', el: 'Πυκνή χιονόπτωση' }, icon: 'snowflake', emoji: '❄️' },
  80: { label: { de: 'Regenschauer', en: 'Rain showers', fr: 'Averses de pluie', it: 'Rovescio di pioggia', es: 'Chubascos de lluvia', el: 'Μπόρες βροχής' }, icon: 'cloud-rain', emoji: '🌦️' },
  81: { label: { de: 'Kräftige Schauer', en: 'Heavy showers', fr: 'Fortes averses', it: 'Forti rovesci', es: 'Fuertes chubascos', el: 'Έντονες μπόρες' }, icon: 'cloud-rain', emoji: '🌧️' },
  82: { label: { de: 'Sintflutartige Schauer', en: 'Violent showers', fr: 'Averses violentes', it: 'Nubifragio', es: 'Chubascos violentos', el: 'Καταρρακτώδης βροχή' }, icon: 'cloud-lightning', emoji: '⛈️' },
  95: { label: { de: 'Gewitter', en: 'Thunderstorm', fr: 'Orage', it: 'Temporale', es: 'Tormenta', el: 'Καταιγίδα' }, icon: 'cloud-lightning', emoji: '⚡' }
};

function getWeatherInfo(code) {
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'de';
  const item = WEATHER_CODES[code] || {
    label: { de: 'Heiter', en: 'Fair', fr: 'Clair', it: 'Sereno', es: 'Despejado', el: 'Αίθριος' },
    icon: 'sun',
    emoji: '☀️'
  };
  return {
    text: item.label[lang] || item.label.en || 'Clear',
    icon: item.icon,
    emoji: item.emoji
  };
}

async function fetchLocalWeather(force = false) {
  const container = document.getElementById('weather-content-area');
  if (!container) return;

  if (cachedWeatherData && !force) {
    renderWeatherData(cachedWeatherData);
    return;
  }

  // Offline Check
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (cachedWeatherData) {
      renderWeatherData(cachedWeatherData);
    } else {
      renderWeatherFallback();
    }
    return;
  }

  container.innerHTML = `
    <div class="py-10 text-center text-gray-400 space-y-2">
      <div class="w-8 h-8 mx-auto border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      <div class="text-xs font-semibold">${tr({ de: 'Lade lokales Wetter...', en: 'Fetching local weather...', fr: 'Chargement météo...', it: 'Caricamento meteo...', es: 'Cargando clima...', el: 'Φόρτωση καιρού...' })}</div>
    </div>
  `;

  try {
    const lat = currentWeatherLocation.lat;
    const lon = currentWeatherLocation.lon;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    cachedWeatherData = data;
    if (typeof AppStorage !== 'undefined') {
      AppStorage.set('flow_weather_cache', data);
    } else {
      localStorage.setItem('flow_weather_cache', JSON.stringify(data));
    }
    renderWeatherData(data);
  } catch (err) {
    console.warn("Wetter-Ladefehler (Offline oder Timeout):", err.message);
    if (cachedWeatherData) {
      renderWeatherData(cachedWeatherData);
    } else {
      renderWeatherFallback();
    }
  }
}

function renderWeatherData(data) {
  const container = document.getElementById('weather-content-area');
  if (!container || !data || !data.current) return;

  const current = data.current;
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  let temp = current.temperature_2m;
  let feels = current.apparent_temperature;
  let maxTemp = daily.temperature_2m_max ? daily.temperature_2m_max[0] : temp + 3;
  let minTemp = daily.temperature_2m_min ? daily.temperature_2m_min[0] : temp - 4;

  if (weatherUnit === 'f') {
    temp = (temp * 9/5) + 32;
    feels = (feels * 9/5) + 32;
    maxTemp = (maxTemp * 9/5) + 32;
    minTemp = (minTemp * 9/5) + 32;
  }

  const unitSymbol = weatherUnit === 'f' ? '°F' : '°C';
  const info = getWeatherInfo(current.weather_code);

  // Smarter Flow-Tipp basierend auf Wetter
  let flowTip = {
    de: 'Angenehmes Wetter für fokussiertes Arbeiten. Vergiss nicht, regelmäßig zu lüften! 🌿',
    en: 'Great conditions for deep work. Remember to open the window for fresh air! 🌿',
    fr: 'Conditions agréables pour travailler. Aère ta pièce de temps en temps ! 🌿',
    it: 'Ottimo clima per concentrarsi. Ricordati di arieggiare la stanza! 🌿',
    es: 'Buen clima para concentrarse. ¡Acuérdate de ventilar la habitación! 🌿',
    el: 'Ιδανικές συνθήκες για εστίαση. Θυμήσου να αερίσεις τον χώρο! 🌿'
  };

  if (current.precipitation > 0 || [51,53,55,61,63,65,80,81,82,95].includes(current.weather_code)) {
    flowTip = {
      de: 'Draußen regnet es 🌧️ Perfektes Gemütlichkeitswetter, um eine Aufgabe von der Liste zu streichen!',
      en: 'Rainy outside 🌧️ Perfect cozy vibe to check off high-focus tasks from your board!',
      fr: 'Il pleut dehors 🌧️ Ambiance idéale pour rayer des tâches de ta liste !',
      it: 'Piove fuori 🌧️ Atmosfera perfetta per completare le tue attività con calma!',
      es: 'Llueve afuera 🌧️ ¡Ambiente acogedor para tachar tareas pendientes!',
      el: 'Βρέχει έξω 🌧️ Ιδανική στιγμή για συγκέντρωση και ολοκλήρωση εργασιών!'
    };
  } else if (temp > 27) {
    flowTip = {
      de: 'Es ist warm! ☀️ Trinke genug Wasser und halte deine Konzentrationsphasen kurz & knackig.',
      en: 'Warm day! ☀️ Stay hydrated and keep your focus sprints short & energetic.',
      fr: 'Il fait chaud ! ☀️ Bois de l\'eau et garde tes sessions de travail courtes et dynamiques.',
      it: 'Fa caldo! ☀️ Bevi molta acqua e mantieni le tue sessioni di lavoro brevi e fresche.',
      es: '¡Hace calor! ☀️ Mantente hidratado y haz sesiones de trabajo breves y enfocadas.',
      el: 'Κάνει ζέστη! ☀️ Πιες άφθονο νερό και κάνε σύντομα διαλείμματα.'
    };
  }

  // 24h Verlauf (nächste 6 Stunden)
  let hourlyPills = '';
  if (hourly.time && hourly.temperature_2m) {
    const currentHour = new Date().getHours();
    for (let i = currentHour; i < currentHour + 6 && i < hourly.time.length; i++) {
      const timeStr = `${String(i % 24).padStart(2, '0')}:00`;
      let hTemp = hourly.temperature_2m[i];
      if (weatherUnit === 'f') hTemp = (hTemp * 9/5) + 32;
      const hInfo = getWeatherInfo(hourly.weather_code[i]);
      hourlyPills += `
        <div class="flex flex-col items-center gap-1 p-2 bg-white/5 rounded-xl min-w-[52px] border border-white/5 shrink-0">
          <span class="text-[9px] text-gray-400 font-mono">${timeStr}</span>
          <span class="text-sm">${hInfo.emoji}</span>
          <span class="text-[10px] font-bold text-white">${Math.round(hTemp)}°</span>
        </div>
      `;
    }
  }

  // 5-Tage Vorschau
  let dailyCards = '';
  if (daily.time && daily.temperature_2m_max) {
    const daysDE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const daysEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'de';
    const dayNames = lang === 'en' ? daysEN : daysDE;

    for (let i = 1; i < 5 && i < daily.time.length; i++) {
      const dDate = new Date(daily.time[i]);
      const dName = dayNames[dDate.getDay()];
      let dMax = daily.temperature_2m_max[i];
      let dMin = daily.temperature_2m_min[i];
      if (weatherUnit === 'f') {
        dMax = (dMax * 9/5) + 32;
        dMin = (dMin * 9/5) + 32;
      }
      const dInfo = getWeatherInfo(daily.weather_code[i]);
      dailyCards += `
        <div class="flex items-center justify-between p-2 bg-black/30 rounded-xl border border-white/5 text-xs">
          <span class="font-bold text-gray-300 w-8 font-mono">${dName}</span>
          <div class="flex items-center gap-1.5 text-gray-200">
            <span>${dInfo.emoji}</span>
            <span class="text-[10px] text-gray-400 truncate max-w-[90px]">${dInfo.text}</span>
          </div>
          <div class="font-mono text-[10px] space-x-1">
            <span class="text-white font-bold">${Math.round(dMax)}°</span>
            <span class="text-gray-500">${Math.round(dMin)}°</span>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <!-- Haupt-Wetterkarte -->
    <div class="bg-gradient-to-br from-sky-500/20 via-indigo-950/40 to-black/60 border border-sky-500/30 rounded-2xl p-3.5 flex flex-col gap-3 shadow-lg">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-1.5 text-white font-bold text-sm">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-400"></i>
            <span>${currentWeatherLocation.name}</span>
            <span class="text-[10px] text-gray-400 font-normal">(${currentWeatherLocation.country || ''})</span>
          </div>
          <div class="text-[11px] text-sky-300 font-medium mt-0.5 flex items-center gap-1">
            <span>${info.emoji}</span>
            <span>${info.text}</span>
          </div>
        </div>

        <div class="text-right">
          <div class="text-3xl font-display font-black text-white leading-none">${Math.round(temp)}${unitSymbol}</div>
          <div class="text-[9px] text-gray-400 font-mono mt-1">
            H: ${Math.round(maxTemp)}° · T: ${Math.round(minTemp)}°
          </div>
        </div>
      </div>

      <!-- Details (Wind, Feuchte, Gefühlt) -->
      <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
        <div class="p-1.5 bg-black/40 rounded-xl border border-white/5">
          <div class="text-[8px] text-gray-400 uppercase font-mono">${tr({ de: 'Gefühlt', en: 'Feels like', fr: 'Ressenti', it: 'Percepita', es: 'Sensación', el: 'Αίσθηση' })}</div>
          <div class="text-xs font-bold text-white font-mono mt-0.5">${Math.round(feels)}${unitSymbol}</div>
        </div>
        <div class="p-1.5 bg-black/40 rounded-xl border border-white/5">
          <div class="text-[8px] text-gray-400 uppercase font-mono">${tr({ de: 'Wind', en: 'Wind', fr: 'Vent', it: 'Vento', es: 'Viento', el: 'Άνεμος' })}</div>
          <div class="text-xs font-bold text-white font-mono mt-0.5">${Math.round(current.wind_speed_10m)} km/h</div>
        </div>
        <div class="p-1.5 bg-black/40 rounded-xl border border-white/5">
          <div class="text-[8px] text-gray-400 uppercase font-mono">${tr({ de: 'Feuchte', en: 'Humidity', fr: 'Humidité', it: 'Umidità', es: 'Humedad', el: 'Υγρασία' })}</div>
          <div class="text-xs font-bold text-white font-mono mt-0.5">${current.relative_humidity_2m}%</div>
        </div>
      </div>
    </div>

    <!-- Smarter Flow-Tipp -->
    <div class="p-2.5 bg-sky-500/10 border border-sky-500/25 rounded-xl flex items-center gap-2 text-sky-200 text-xs leading-normal">
      <i data-lucide="sparkles" class="w-4 h-4 text-sky-400 shrink-0"></i>
      <span>${tr(flowTip)}</span>
    </div>

    <!-- Stündlicher Verlauf -->
    <div class="space-y-1.5">
      <div class="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">${tr({ de: 'Stündliche Vorschau', en: 'Hourly Forecast', fr: 'Prévisions par heure', it: 'Previsioni orarie', es: 'Pronóstico por hora', el: 'Ωριαία πρόγνωση' })}</div>
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">${hourlyPills}</div>
    </div>

    <!-- 5-Tage-Vorschau -->
    <div class="space-y-1.5">
      <div class="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">${tr({ de: 'Kommende Tage', en: 'Next Days', fr: 'Prochains jours', it: 'Prossimi giorni', es: 'Próximos días', el: 'Επόμενες ημέρες' })}</div>
      <div class="flex flex-col gap-1.5">${dailyCards}</div>
    </div>
  `;

  renderLucideIcons();
}

function renderWeatherFallback() {
  const container = document.getElementById('weather-content-area');
  if (!container) return;
  container.innerHTML = `
    <div class="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-center space-y-3">
      <span class="text-3xl">🌤️</span>
      <div class="text-xs font-bold text-white">${currentWeatherLocation.name} · 21°C</div>
      <p class="text-[11px] text-gray-300">${tr({ de: 'Überwiegend heiter & angenehme 21°C. Perfekte Bedingungen für deinen Arbeitstag!', en: 'Mostly pleasant & 21°C. Great conditions for your productivity!', fr: 'Agréable et 21°C. Parfait pour ta journée !', it: 'Sereno e 21°C. Ottimo per la tua giornata!', es: 'Agradable y 21°C. ¡Ideal para tu jornada!', el: 'Ευχάριστος καιρός στους 21°C.' })}</p>
      <button onclick="fetchLocalWeather(true)" class="px-3 py-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-bold transition cursor-pointer">
        ${tr({ de: 'Erneut versuchen 🔄', en: 'Retry 🔄', fr: 'Réessayer 🔄', it: 'Riprova 🔄', es: 'Reintentar 🔄', el: 'Δοκίμασε ξανά 🔄' })}
      </button>
    </div>
  `;
}

async function searchWeatherCity(query) {
  if (!query || query.trim().length < 2) return;
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=de&format=json`);
    const data = await res.json();
    const resultsContainer = document.getElementById('weather-search-results');
    if (!resultsContainer) return;

    if (!data.results || data.results.length === 0) {
      resultsContainer.innerHTML = `<div class="p-2 text-xs text-gray-500 italic">${tr({ de: 'Keine Stadt gefunden.', en: 'No city found.', fr: 'Aucune ville trouvée.', it: 'Nessuna città trovata.', es: 'No se encontró la ciudad.', el: 'Δεν βρέθηκε πόλη.' })}</div>`;
      resultsContainer.classList.remove('hidden');
      return;
    }

    resultsContainer.innerHTML = data.results.map(r => `
      <button onclick="selectWeatherCity('${r.name.replace(/'/g, "\\'")}', '${(r.country || '').replace(/'/g, "\\'")}', ${r.latitude}, ${r.longitude})" class="w-full p-2 text-left text-xs text-gray-200 hover:text-white hover:bg-sky-500/20 rounded-lg transition flex items-center justify-between cursor-pointer">
        <span class="font-bold">${r.name}</span>
        <span class="text-[10px] text-gray-400">${r.admin1 ? r.admin1 + ', ' : ''}${r.country || ''}</span>
      </button>
    `).join('');
    resultsContainer.classList.remove('hidden');
  } catch (e) {
    console.error("Geocoding-Suche fehlgeschlagen:", e);
  }
}

async function searchWeatherCityInstant(cityName) {
  if (!cityName || cityName.trim().length < 2) return;
  const clean = cityName.split(',')[0].trim();
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=1&language=de&format=json`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const top = data.results[0];
      selectWeatherCity(top.name, top.country || '', top.latitude, top.longitude);
      const searchInput = document.getElementById('weather-city-input');
      if (searchInput) searchInput.value = `${top.name}${top.country ? ' (' + top.country + ')' : ''}`;
    }
  } catch (e) {
    console.error("Sofortsuche Fehler:", e);
  }
}

function selectWeatherCity(name, country, lat, lon) {
  currentWeatherLocation = { name, country, lat, lon };
  localStorage.setItem('flow_weather_loc', JSON.stringify(currentWeatherLocation));
  const resultsContainer = document.getElementById('weather-search-results');
  if (resultsContainer) resultsContainer.classList.add('hidden');
  const searchInput = document.getElementById('weather-city-input');
  if (searchInput) searchInput.value = `${name}${country ? ' (' + country + ')' : ''}`;
  fetchLocalWeather(true);
}

function useDeviceLocationWeather() {
  if (!navigator.geolocation) {
    showToast(tr({ de: 'GPS wird von diesem Browser nicht unterstützt.', en: 'GPS not supported by browser.' }));
    return;
  }
  showToast(tr({ de: 'Ermittle Standort... 📍', en: 'Detecting location... 📍' }));
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      currentWeatherLocation = { name: 'Mein Standort', country: 'Lokal', lat, lon };
      localStorage.setItem('flow_weather_loc', JSON.stringify(currentWeatherLocation));
      fetchLocalWeather(true);
      showToast(tr({ de: 'Wetter auf deinen Standort aktualisiert! ☀️', en: 'Weather updated to your location! ☀️' }));
    },
    (err) => {
      console.warn("Geolocation error:", err);
      showToast(tr({ de: 'Standortzugriff nicht erlaubt. Bitte Stadt manuell suchen.', en: 'Location access denied. Please search city manually.' }));
    }
  );
}

function toggleWeatherUnit() {
  weatherUnit = weatherUnit === 'c' ? 'f' : 'c';
  localStorage.setItem('flow_weather_unit', weatherUnit);
  if (cachedWeatherData) renderWeatherData(cachedWeatherData);
}


// ============================================================================
// 2. NACHRICHTEN & DAILY DIGEST ENGINE (LOCAL & TOPICAL NEWS BRIEFING)
// ============================================================================

let currentNewsLocation = localStorage.getItem('flow_news_loc') || 'de_all';
let currentNewsCategory = 'all'; // 'all' | 'local' | 'positive' | 'economy' | 'tech' | 'life' | 'science' | 'bookmarked'
let newsSearchKeyword = '';
let bookmarkedNews = JSON.parse(localStorage.getItem('flow_bookmarked_news') || '[]');

// Regionen-Listen je nach Sprache
const NEWS_LOCATIONS = {
  de: [
    { id: 'de_all', name: '🇩🇪 Deutschlandweit (D-A-CH)' },
    { id: 'de_berlin', name: '🏛️ Berlin & Brandenburg' },
    { id: 'de_munich', name: '🥨 München & Bayern' },
    { id: 'de_hamburg', name: '⚓ Hamburg & Norddeutschland' },
    { id: 'de_nrw', name: '🏰 Köln, Düsseldorf & NRW' },
    { id: 'de_frankfurt', name: '💼 Frankfurt & Hessen' },
    { id: 'de_stuttgart', name: '⚙️ Stuttgart & Baden-Württemberg' },
    { id: 'de_leipzig', name: '🎨 Leipzig & Dresden' },
    { id: 'at_vienna', name: '🇦🇹 Wien & Österreich' },
    { id: 'ch_zurich', name: '🇨🇭 Zürich & Schweiz' },
    { id: 'global', name: '🌍 International & Global' }
  ],
  en: [
    { id: 'global', name: '🌍 Global & Worldwide' },
    { id: 'en_london', name: '🇬🇧 London & UK' },
    { id: 'en_ny', name: '🇺🇸 New York & East Coast' },
    { id: 'en_sf', name: '🌉 San Francisco & Silicon Valley' },
    { id: 'en_eu', name: '🇪🇺 Europe & International' }
  ],
  fr: [
    { id: 'fr_all', name: '🇫🇷 France Nationale' },
    { id: 'fr_paris', name: '🗼 Paris & Île-de-France' },
    { id: 'fr_lyon', name: '🦁 Lyon & Auvergne-Rhône-Alpes' },
    { id: 'global', name: '🌍 International & Monde' }
  ],
  it: [
    { id: 'it_all', name: '🇮🇹 Italia Nazionale' },
    { id: 'it_rome', name: '🏛️ Roma & Centro' },
    { id: 'it_milan', name: '🏙️ Milano & Lombardia' },
    { id: 'global', name: '🌍 Internazionale & Mondo' }
  ],
  es: [
    { id: 'es_all', name: '🇪🇸 España Nacional' },
    { id: 'es_madrid', name: '🏛️ Madrid & Centro' },
    { id: 'es_barcelona', name: '🏖️ Barcelona & Cataluña' },
    { id: 'global', name: '🌍 Internacional & Global' }
  ],
  el: [
    { id: 'el_all', name: '🇬🇷 Ελλάδα Πανελλαδικά' },
    { id: 'el_athens', name: '🏛️ Αθήνα & Αττική' },
    { id: 'el_thessaloniki', name: '🌊 Θεσσαλονίκη & Βόρεια Ελλάδα' },
    { id: 'global', name: '🌍 Διεθνή & Κόσμος' }
  ]
};

// Lokale & thematische Nachrichtendaten
const COMPREHENSIVE_NEWS_DATABASE = [
  // --- DEUTSCHLANDWEIT & THEMEN ---
  { id: 'de_n1', loc: 'de_all', category: 'positive', tag: '🌱 Nachhaltigkeit', time: 'Vor 1 Std.', title: 'Rekord: Über 56% des Stroms im Bundesnetz aus erneuerbaren Quellen', summary: 'Sonne und Windkraft erzielten im aktuellen Monat einen neuen Spitzenwert bei der sauberen Stromversorgung in Deutschland.', source: 'Bundesnetz Monitor', lang: 'de' },
  { id: 'de_n2', loc: 'de_all', category: 'economy', tag: '💼 Wirtschaft', time: 'Vor 2 Std.', title: '4-Tage-Woche-Studie in Deutschland zeigt: Höhere Produktivität und Zufriedenheit', summary: 'Nach 6 Monaten Pilotphase berichten 85% der teilnehmenden Firmen von stabilen Umsätzen bei signifikant geringerem Krankenstand.', source: 'WirtschaftsWoche' },
  { id: 'de_n3', loc: 'de_all', category: 'tech', tag: '💡 Innovation', time: 'Vor 3 Std.', title: 'Europäisches KI-Modell für Medizin erreicht Weltklasse-Diagnostik', summary: 'Ein Forschungsverbund stellt ein Open-Source-Modell vor, das MRT-Scans doppelt so schnell und präzise auswertet.', source: 'Tech Germany' },
  { id: 'de_n4', loc: 'de_all', category: 'life', tag: '⚡ Fokus & Alltag', time: 'Vor 4 Std.', title: 'Die 90-Minuten-Regel: Warum Arbeitsblöcke den Flow revolutionieren', summary: 'Kognitionswissenschaftler empfehlen, Konzentrationsphasen an biologische Ultradian-Rhythmen anzupassen.', source: 'Mind & Focus' },
  { id: 'de_n5', loc: 'de_all', category: 'science', tag: '🔭 Wissenschaft', time: 'Vor 5 Std.', title: 'Durchbruch bei Feststoff-Batterien: Doppelte Reichweite in Sicht', summary: 'Materialforscher entwickeln eine keramische Schutzschicht, die Ladezeiten auf unter 10 Minuten verkürzt.', source: 'Science Journal' },

  // --- BERLIN & BRANDENBURG ---
  { id: 'ber_1', loc: 'de_berlin', category: 'local', tag: '📍 Berlin Lokal', time: 'Vor 45 Min.', title: 'Berlin baut 35 neue Fahrradstraßen und grüne Quartiere aus', summary: 'Der Senat beschließt den beschleunigten Ausbau verkehrsberuhigter Zonen in Mitte, Kreuzberg und Charlottenburg.', source: 'Berlin Tagesspiegel' },
  { id: 'ber_2', loc: 'de_berlin', category: 'local', tag: '🎭 Kultur & Stadt', time: 'Vor 2 Std.', title: 'Lange Nacht der Museen & Open-Air-Konzerte auf der Museumsinsel', summary: 'Über 75 Museen und historische Stätten öffnen am Wochenende mit Sonderführungen und Lichtinstallationen.', source: 'RBB News' },
  { id: 'ber_3', loc: 'de_berlin', category: 'economy', tag: '💼 Startup Hub', time: 'Vor 4 Std.', title: 'Berliner Startup-Ökosystem verzeichnet Rekord-Investitionen in Greentech', summary: 'Über 1,2 Milliarden Euro flossen in den letzten Monaten in nachhaltige Berliner Klimatechnologie-Unternehmen.', source: 'Gründerszene Berlin' },

  // --- MÜNCHEN & BAYERN ---
  { id: 'muc_1', loc: 'de_munich', category: 'local', tag: '📍 München Lokal', time: 'Vor 1 Std.', title: 'Neues 365-Euro-Ticket für Azubis und Ausbau der U9-Stammstrecke', summary: 'München investiert massiv in den öffentlichen Nahverkehr und beschleunigt die Entlastung des Hauptbahnhofs.', source: 'Süddeutsche Zeitung' },
  { id: 'muc_2', loc: 'de_munich', category: 'economy', tag: '💼 Tech & Forschung', time: 'Vor 3 Std.', title: 'Münchner Quantencomputing-Campus eröffnet internationales Exzellenzzentrum', summary: 'Die TU München und Partnerunternehmen weihen eines der fortschrittlichsten Quantenlabore Europas in Garching ein.', source: 'Bayern Innovativ' },
  { id: 'muc_3', loc: 'de_munich', category: 'positive', tag: '🌲 Natur & Isar', time: 'Vor 5 Std.', title: 'Isar-Renaturierung erfolgreich: Seltene Tier- und Pflanzenarten kehren zurück', summary: 'Der Abschluss der Flussbett-Sanierung südlich von München sorgt für kristallklares Wasser und neue Naherholungsräume.', source: 'Münchner Merkur' },

  // --- HAMBURG & NORDDEUTSCHLAND ---
  { id: 'ham_1', loc: 'de_hamburg', category: 'local', tag: '📍 Hamburg Lokal', time: 'Vor 1 Std.', title: 'Hamburger Hafen startet vollautomatisierte, emissionsfreie Wasserstoff-Schuten', summary: 'Die Hansestadt setzt weltweit neue Maßstäbe für klimaneutrale Binnenschifffahrt und saubere Hafenbecken.', source: 'Hamburger Abendblatt' },
  { id: 'ham_2', loc: 'de_hamburg', category: 'local', tag: '⚓ Elbphilharmonie', time: 'Vor 3 Std.', title: 'Kostenlose Akustik-Konzerte auf dem Elbphilharmonie-Vorplatz begeistern Tausende', summary: 'Ein neues Kulturprogramm verbindet klassische Orchesterklänge mit modernen Ambient-Klängen direkt an der Elbe.', source: 'NDR Kultur' },

  // --- NRW (KÖLN, DÜSSELDORF, RUHRGEBIET) ---
  { id: 'nrw_1', loc: 'de_nrw', category: 'local', tag: '📍 NRW Lokal', time: 'Vor 2 Std.', title: 'Radschnellweg Ruhr (RS1) erhält 20 neue Kilometer durchs Ruhrgebiet', summary: 'Die direkte, kreuzungsfreie Verbindung zwischen Dortmund, Bochum und Essen wird für Pendler weiter freigegeben.', source: 'WDR Aktuell' },
  { id: 'nrw_2', loc: 'de_nrw', category: 'economy', tag: '🏭 Transformation', time: 'Vor 4 Std.', title: 'Duisburg weiht erste Direktreduktionsanlage für grünen Stahl ein', summary: 'Ein historischer Schritt für NRW: Industrieproduktion ohne CO2-Ausstoß geht in den regulären Testbetrieb.', source: 'Rheinische Post' },

  // --- FRANKFURT & HESSEN ---
  { id: 'fra_1', loc: 'de_frankfurt', category: 'local', tag: '📍 Frankfurt Lokal', time: 'Vor 1 Std.', title: 'Frankfurter Grüngürtel wird um neue Uferpromenaden am Main erweitert', summary: 'Mehr schattige Parkflächen, Brunnen und Erholungszonen für heiße Sommertage in der Innenstadt beschlossen.', source: 'Frankfurter Allgemeine' },
  { id: 'fra_2', loc: 'de_frankfurt', category: 'tech', tag: '🌐 Data Capital', time: 'Vor 3 Std.', title: 'DE-CIX Frankfurt bricht weltweiten Datendurchsatz-Rekord bei 17 Tbit/s', summary: 'Der weltgrößte Internetknoten in Frankfurt meldet stabilen Höchstbetrieb bei sinkendem Energieverbrauch.', source: 'Hessen Digital' },

  // --- STUTTGART & BAWÜ ---
  { id: 'str_1', loc: 'de_stuttgart', category: 'local', tag: '📍 Stuttgart Lokal', time: 'Vor 2 Std.', title: 'Stuttgarts neue Stadtbegrünung senkt Temperatur im Talkessel messbar', summary: 'Vertikale Gärten und bepflanzte Dächer reduzieren Hitzestaus und verbessern das Mikroklima spürbar.', source: 'Stuttgarter Zeitung' },

  // --- LEIPZIG & DRESDEN ---
  { id: 'lei_1', loc: 'de_leipzig', category: 'local', tag: '📍 Leipzig & Dresden', time: 'Vor 2 Std.', title: 'Silicon Saxony: Drei neue Halbleiter-Chipwerke sichern Tausende Zukunftsjobs', summary: 'Der Raum Dresden-Leipzig baut seine Spitzenposition als Europas wichtigste Mikrochip-Region weiter aus.', source: 'MDR Sachsen' },

  // --- WIEN & ÖSTERREICH ---
  { id: 'vie_1', loc: 'at_vienna', category: 'local', tag: '📍 Wien Lokal', time: 'Vor 1 Std.', title: 'Wien erneut zur lebenswertesten Stadt der Welt gewählt', summary: 'Öffentlicher Nahverkehr, soziale Wohnbauprojekte und großflächige Grünzonen sichern Wien die weltweite Spitzenposition.', source: 'Der Standard Wien' },
  { id: 'vie_2', loc: 'at_vienna', category: 'positive', tag: '🇦🇹 Alpen & Natur', time: 'Vor 3 Std.', title: 'Österreichischer Klimaticket-Erfolg: 300.000 aktive Nutzer im gesamten Bundesgebiet', summary: 'Immer mehr Pendler steigen dauerhaft vom Auto auf die Bahn um – CO2-Einsparungen übertreffen alle Prognosen.', source: 'ORF News' },

  // --- ZÜRICH & SCHWEIZ ---
  { id: 'zrh_1', loc: 'ch_zurich', category: 'local', tag: '📍 Zürich Lokal', time: 'Vor 1 Std.', title: 'ETH Zürich entwickelt ultraleichte Solarzellen mit 32% Wirkungsgrad', summary: 'Die neue Technologie kann flexibel auf Fassaden und Fenstern angebracht werden und liefert doppelte Energie.', source: 'NZZ Zürich' },
  { id: 'zrh_2', loc: 'ch_zurich', category: 'local', tag: '🇨🇭 Zürichsee', time: 'Vor 3 Std.', title: 'Erweiterung des Seeuferwegs und neue solarbetriebene Fähren auf dem Zürichsee', summary: 'Zürich treibt die CO2-freie Seeschifffahrt voran und schafft durchgehende Fußgänger- und Fahrradwege.', source: 'Tages-Anzeiger' },

  // --- GLOBAL (ENGLISH & INTERNATIONAL) ---
  { id: 'gl_1', loc: 'global', category: 'positive', tag: '🌱 Global Eco', time: '1h ago', title: 'Global Milestone: Over 40% of World Electricity Now Powered by Renewables', summary: 'Clean energy generation achieved a historic quarterly milestone across major international grids.', source: 'Global Green Monitor', lang: 'en' },
  { id: 'gl_2', loc: 'global', category: 'tech', tag: '💡 AI & Tech', time: '2h ago', title: 'New Optical Microchips Process Data at the Speed of Light with 90% Less Energy', summary: 'Photonic computing reaches commercial testing, promising massive breakthroughs for everyday computers.', source: 'Tech Frontiers', lang: 'en' },
  { id: 'gl_3', loc: 'global', category: 'life', tag: '⚡ Productivity', time: '3h ago', title: 'Deep Work Research: How Calmer Workspaces Double Creative Problem Solving', summary: 'Limiting continuous notifications and establishing rhythmic focus sprints protects long-term cognitive health.', source: 'Harvard Productivity Review', lang: 'en' },
  { id: 'gl_4', loc: 'global', category: 'science', tag: '🔭 Astronomy', time: '4h ago', title: 'James Webb Telescope Maps Potential Ocean World in Nearby Star System', summary: 'Atmospheric spectroscopy reveals signatures of deep liquid water beneath protective cloud layers.', source: 'Astro Journal', lang: 'en' },

  // --- LONDON & UK ---
  { id: 'lon_1', loc: 'en_london', category: 'local', tag: '📍 London Local', time: '1h ago', title: 'London Expands Ultra-Low Emission Zones and Green Bus Fleets', summary: 'Air quality in central London hits its highest cleanliness scores in over four decades.', source: 'Evening Standard', lang: 'en' },
  { id: 'lon_2', loc: 'en_london', category: 'economy', tag: '💼 FinTech', time: '3h ago', title: 'Tech City Hub Welcomes 120 Sustainable AI Startups in East London', summary: 'New venture incubator launches to support ethical computing and green technology.', source: 'London Tech Daily', lang: 'en' },

  // --- NEW YORK & US ---
  { id: 'ny_1', loc: 'en_ny', category: 'local', tag: '📍 NYC Local', time: '1h ago', title: 'High Line Expansion: New Elevated Green Corridor Opens to the Public', summary: 'The iconic park connects Hudson Yards directly with Manhattan West with native flora and seating.', source: 'NY Times Local', lang: 'en' },
  { id: 'ny_2', loc: 'en_ny', category: 'tech', tag: '💡 Innovation', time: '3h ago', title: 'Brooklyn Tech Triangle Launches Urban Farming and Solar Roof Network', summary: 'Rooftop gardens across DUMBO and Downtown Brooklyn will supply local community markets.', source: 'NYC Daily News', lang: 'en' },

  // --- PARIS & FRANCE ---
  { id: 'par_1', loc: 'fr_paris', category: 'local', tag: '📍 Paris Local', time: 'Il y a 1h', title: 'Paris pérennise 60 km de nouvelles pistes cyclables et espaces piétons', summary: 'La capitale poursuit sa transformation urbaine avec de nouvelles rues végétalisées.', source: 'Le Parisien', lang: 'fr' },
  { id: 'fr_1', loc: 'fr_all', category: 'positive', tag: '🌱 Écologie', time: 'Il y a 2h', title: 'Production d\'énergie propre record en France grâce aux parcs éoliens et solaires', summary: 'Les énergies renouvelables couvrent désormais une part historique des besoins nationaux.', source: 'Le Figaro', lang: 'fr' },

  // --- ROMA & MILANO (ITALIA) ---
  { id: 'it_1', loc: 'it_all', category: 'positive', tag: '🌱 Sostenibilità', time: '1 ora fa', title: 'Italia: raddoppiano gli investimenti nei treni ad alta velocità ecologici', summary: 'Nuovi collegamenti veloci riducono l\'uso di aerei e automobili in tutta la penisola.', source: 'Corriere della Sera', lang: 'it' },
  { id: 'rom_1', loc: 'it_rome', category: 'local', tag: '📍 Roma Locale', time: '2 ore fa', title: 'Roma inaugura il nuovo anello verde ciclabile attorno ai Fori Imperiali', summary: 'Nuovi percorsi dedicati alla mobilità dolce valorizzano il patrimonio storico.', source: 'La Repubblica Roma', lang: 'it' },

  // --- MADRID & BARCELONA (ESPAÑA) ---
  { id: 'es_1', loc: 'es_all', category: 'positive', tag: '🌱 Sostenibilidad', time: 'Hace 1h', title: 'España lidera la producción de energía solar en el sur de Europa', summary: 'Las plantas solares proporcionan más del 50% de la demanda en las horas centrales del día.', source: 'El País', lang: 'es' },
  { id: 'mad_1', loc: 'es_madrid', category: 'local', tag: '📍 Madrid Local', time: 'Hace 2h', title: 'Madrid Río amplía sus zonas arboladas y fuentes de agua pública', summary: 'Nuevos espacios de sombra y recreo se incorporan a lo largo del curso del río Manzanares.', source: 'El Mundo Madrid', lang: 'es' },

  // --- ATHENS & THESSALONIKI (GREECE) ---
  { id: 'el_1', loc: 'el_all', category: 'positive', tag: '🌱 Βιωσιμότητα', time: 'Πριν 1 ώρα', title: 'Ιστορικό ρεκόρ πράσινης ενέργειας στην Ελλάδα από αιολικά και φωτοβολταϊκά', summary: 'Οι ανανεώσιμες πηγές κάλυψαν πάνω από το 60% των αναγκών σε ώρες αιχμής.', source: 'Η Καθημερινή', lang: 'el' },
  { id: 'ath_1', loc: 'el_athens', category: 'local', tag: '📍 Αθήνα Τοπικά', time: 'Πριν 2 ώρες', title: 'Ανάπλαση και δημιουργία νέων πάρκων τσέπης στο κέντρο της Αθήνας', summary: 'Περισσότερο πράσινο και δροσιά σε γειτονιές της πόλης.', source: 'Athens Voice', lang: 'el' }
];

function getAvailableLocationsForLang() {
  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'de';
  return NEWS_LOCATIONS[lang] || NEWS_LOCATIONS.de;
}

function renderNewsBriefing() {
  const container = document.getElementById('news-content-area');
  const locSelect = document.getElementById('news-location-select');
  if (!container) return;

  const lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'de';

  // Location-Dropdown synchronisieren falls nötig
  if (locSelect) {
    const locOptions = getAvailableLocationsForLang();
    const currentLocExists = locOptions.some(l => l.id === currentNewsLocation);
    if (!currentLocExists) {
      currentNewsLocation = locOptions[0].id;
      localStorage.setItem('flow_news_loc', currentNewsLocation);
    }

    locSelect.innerHTML = locOptions.map(l => `
      <option value="${l.id}" ${l.id === currentNewsLocation ? 'selected' : ''}>${l.name}</option>
    `).join('');
  }

  // Filterung anwenden
  let articles = COMPREHENSIVE_NEWS_DATABASE.filter(item => {
    // Falls Lesezeichen-Modus aktiv
    if (currentNewsCategory === 'bookmarked') {
      return bookmarkedNews.includes(item.id);
    }

    // Sprach- und Ortsfilter
    const matchesLoc = (currentNewsLocation === 'global') 
      ? true 
      : (item.loc === currentNewsLocation || (currentNewsLocation.startsWith('de_') && item.loc === 'de_all') || (item.loc === 'global'));

    // Kategorie
    const matchesCat = (currentNewsCategory === 'all') 
      ? true 
      : (item.category === currentNewsCategory);

    // Suchbegriff
    const matchesSearch = !newsSearchKeyword 
      || item.title.toLowerCase().includes(newsSearchKeyword.toLowerCase()) 
      || item.summary.toLowerCase().includes(newsSearchKeyword.toLowerCase())
      || item.tag.toLowerCase().includes(newsSearchKeyword.toLowerCase());

    return matchesLoc && matchesCat && matchesSearch;
  });

  if (articles.length === 0) {
    // Fallback falls die Kombination aus Ort & Thema noch keine spezifischen Daten hat
    const isBookmarkedView = currentNewsCategory === 'bookmarked';
    container.innerHTML = `
      <div class="py-10 text-center text-gray-400 space-y-2">
        <div class="text-2xl">${isBookmarkedView ? '🔖' : '🔍'}</div>
        <div class="text-xs font-semibold text-gray-300">
          ${isBookmarkedView 
            ? tr({ de: 'Noch keine gemerkten Artikel vorhanden.', en: 'No bookmarked articles yet.', fr: 'Aucun article enregistré.', it: 'Nessun articolo salvato.', es: 'Sin artículos guardados.', el: 'Δεν υπάρχουν αποθηκευμένα άρθρα.' }) 
            : tr({ de: 'Keine Nachrichten für diesen Filter gefunden.', en: 'No news found for this filter.', fr: 'Aucune actualité trouvée.', it: 'Nessuna notizia trovata.', es: 'No se encontraron noticias.', el: 'Δεν βρέθηκαν ειδήσεις.' })}
        </div>
        <p class="text-[10px] text-gray-500">
          ${isBookmarkedView 
            ? tr({ de: 'Tippe auf das Lesezeichen-Symbol bei Artikeln, um sie hier zu speichern.', en: 'Click the bookmark icon on any article to save it here.' }) 
            : tr({ de: 'Wähle eine andere Kategorie oder setze den Suchbegriff zurück.', en: 'Try selecting another category or clear your search query.' })}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = articles.map(item => {
    const isBookmarked = bookmarkedNews.includes(item.id);
    return `
      <article class="p-3 bg-black/40 hover:bg-white/[0.04] border border-white/5 hover:border-amber-500/30 rounded-2xl transition flex flex-col gap-1.5 group">
        <div class="flex items-center justify-between text-[9px] font-mono text-gray-400">
          <span class="px-2 py-0.5 rounded-md bg-white/5 text-amber-300 font-semibold border border-white/5 flex items-center gap-1">
            ${item.tag}
          </span>
          <div class="flex items-center gap-2">
            <span>${item.time}</span>
            <button onclick="toggleBookmarkNews('${item.id}', event)" class="hover:text-amber-400 transition cursor-pointer p-1" title="Artikel merken">
              <i data-lucide="${isBookmarked ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5 ${isBookmarked ? 'text-amber-400 fill-amber-400/20' : 'text-gray-500'}"></i>
            </button>
          </div>
        </div>
        <h5 class="text-xs font-bold text-white group-hover:text-amber-200 transition leading-snug">${item.title}</h5>
        <p class="text-[11px] text-gray-300 leading-relaxed">${item.summary}</p>
        <div class="flex items-center justify-between text-[8px] text-gray-500 font-mono pt-1 border-t border-white/5">
          <span>Quelle: ${item.source}</span>
          <span class="text-gray-600">${item.loc.replace('de_', '').replace('en_', '').toUpperCase()}</span>
        </div>
      </article>
    `;
  }).join('');

  renderLucideIcons();
}

function setNewsLocation(locId) {
  currentNewsLocation = locId;
  localStorage.setItem('flow_news_loc', locId);
  renderNewsBriefing();
}

function setNewsCategory(cat) {
  currentNewsCategory = cat;
  document.querySelectorAll('.news-category-pill').forEach(pill => {
    if (pill.getAttribute('data-category') === cat) {
      pill.className = 'news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/25 text-amber-300 border border-amber-500/40 cursor-pointer transition shrink-0 shadow-sm';
    } else {
      pill.className = 'news-category-pill px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white border border-white/5 cursor-pointer transition shrink-0';
    }
  });
  renderNewsBriefing();
}

function searchNewsKeywords(query) {
  newsSearchKeyword = (query || '').trim();
  renderNewsBriefing();
}

function handleNewsLocationInput(val) {
  if (!val) return;
  handleNewsLocationSelect(val);
}

function handleNewsLocationSelect(val) {
  if (!val) return;
  const v = val.toLowerCase().trim();
  let targetLoc = 'de_all';
  if (v.includes('berlin') || v.includes('brandenburg')) targetLoc = 'de_berlin';
  else if (v.includes('münchen') || v.includes('munich') || v.includes('bayern')) targetLoc = 'de_munich';
  else if (v.includes('hamburg') || v.includes('nord')) targetLoc = 'de_hamburg';
  else if (v.includes('köln') || v.includes('cologne') || v.includes('düsseldorf') || v.includes('nrw') || v.includes('ruhr')) targetLoc = 'de_nrw';
  else if (v.includes('frankfurt') || v.includes('hessen')) targetLoc = 'de_frankfurt';
  else if (v.includes('stuttgart') || v.includes('baden') || v.includes('bawü')) targetLoc = 'de_stuttgart';
  else if (v.includes('leipzig') || v.includes('dresden') || v.includes('sachsen')) targetLoc = 'de_leipzig';
  else if (v.includes('wien') || v.includes('vienna') || v.includes('österreich') || v.includes('austria')) targetLoc = 'at_vienna';
  else if (v.includes('zürich') || v.includes('zurich') || v.includes('schweiz') || v.includes('swiss')) targetLoc = 'ch_zurich';
  else if (v.includes('london') || v.includes('uk') || v.includes('england')) targetLoc = 'en_london';
  else if (v.includes('new york') || v.includes('nyc') || v.includes('us')) targetLoc = 'en_ny';
  else if (v.includes('paris') || v.includes('france')) targetLoc = 'fr_paris';
  else if (v.includes('rom') || v.includes('milan') || v.includes('italia')) targetLoc = 'it_rome';
  else if (v.includes('madrid') || v.includes('barcelona') || v.includes('españa')) targetLoc = 'es_madrid';
  else if (v.includes('athen') || v.includes('thessaloniki') || v.includes('ελλάδα')) targetLoc = 'el_athens';
  else if (v.includes('global') || v.includes('international') || v.includes('welt')) targetLoc = 'global';
  else targetLoc = 'de_all';

  currentNewsLocation = targetLoc;
  localStorage.setItem('flow_news_loc', targetLoc);
  renderNewsBriefing();
}

function toggleBookmarkNews(id, event) {
  if (event) event.stopPropagation();
  if (bookmarkedNews.includes(id)) {
    bookmarkedNews = bookmarkedNews.filter(x => x !== id);
  } else {
    bookmarkedNews.push(id);
  }
  localStorage.setItem('flow_bookmarked_news', JSON.stringify(bookmarkedNews));
  renderNewsBriefing();
}

function refreshNewsFeed() {
  const container = document.getElementById('news-content-area');
  if (container) {
    container.innerHTML = `
      <div class="py-8 text-center text-gray-400 space-y-2">
        <div class="w-6 h-6 mx-auto border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-[11px] font-semibold">${tr({ de: 'Aktualisiere regionale Nachrichten...', en: 'Refreshing regional news briefing...' })}</div>
      </div>
    `;
  }
  setTimeout(() => {
    renderNewsBriefing();
    showToast(tr({ de: 'Nachrichten & Region aktualisiert! 📰', en: 'News & region updated! 📰', fr: 'Actualités régionales mises à jour ! 📰', it: 'Notizie aggiornate! 📰', es: '¡Noticias actualizadas! 📰', el: 'Ειδήσεις ενημερώθηκαν! 📰' }));
  }, 400);
}

// Initialer Auto-Start beim Laden
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('weather-content-area')) {
      fetchLocalWeather();
    }
    if (document.getElementById('news-content-area')) {
      renderNewsBriefing();
    }
  }, 1000);
});

