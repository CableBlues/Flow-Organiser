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
let cachedWeatherTimestamp = parseInt(localStorage.getItem('flow_weather_timestamp') || '0', 10);
let weatherUnit = localStorage.getItem('flow_weather_unit') || 'c';
const WEATHER_CACHE_TTL = 10 * 60 * 1000; // 10 Minuten Cache-Gültigkeit (häufige Aktualisierung)
let isWeatherFetching = false;

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
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
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
  const now = Date.now();
  const isStale = (now - cachedWeatherTimestamp) > WEATHER_CACHE_TTL;

  // 1. Sofort vorhandene Daten anzeigen, damit nichts flackert
  if (cachedWeatherData) {
    updateDateWeatherWidget(cachedWeatherData);
    if (container && !force && !isStale) {
      renderWeatherData(cachedWeatherData);
      return;
    }
  }

  // 2. Wenn weder Cache vorhanden noch force/stale nötig ist, beenden
  if (!force && !isStale && cachedWeatherData) {
    return;
  }

  if (isWeatherFetching) return;

  // Offline Check
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (cachedWeatherData) {
      renderWeatherData(cachedWeatherData);
    } else if (container) {
      renderWeatherFallback();
    }
    return;
  }

  // Ladeanzeige nur wenn kein Cache da ist oder im Modal aktiv gerendert wird
  if (container && !cachedWeatherData) {
    container.innerHTML = `
      <div class="py-10 text-center text-gray-400 space-y-2">
        <div class="w-8 h-8 mx-auto border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-xs font-semibold">${tr({ de: 'Lade aktuelles Wetter...', en: 'Fetching live weather...', fr: 'Chargement météo...', it: 'Caricamento meteo...', es: 'Cargando clima...', el: 'Φόρτωση καιρού...' })}</div>
      </div>
    `;
  }

  isWeatherFetching = true;

  try {
    const lat = currentWeatherLocation.lat || 52.52;
    const lon = currentWeatherLocation.lon || 13.41;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    cachedWeatherData = data;
    cachedWeatherTimestamp = Date.now();
    localStorage.setItem('flow_weather_timestamp', String(cachedWeatherTimestamp));

    if (typeof AppStorage !== 'undefined') {
      AppStorage.set('flow_weather_cache', data);
    } else {
      localStorage.setItem('flow_weather_cache', JSON.stringify(data));
    }

    updateDateWeatherWidget(data);
    if (container) {
      renderWeatherData(data);
    }
  } catch (err) {
    console.warn("Wetter-Ladefehler (Offline oder Timeout):", err.message);
    if (cachedWeatherData) {
      updateDateWeatherWidget(cachedWeatherData);
      if (container) renderWeatherData(cachedWeatherData);
    } else if (container) {
      renderWeatherFallback();
    }
  } finally {
    isWeatherFetching = false;
  }
}

function updateDateWeatherWidget(data) {
  if (!data || !data.current) return;
  const current = data.current;
  let temp = Math.round(current.temperature_2m);
  if (weatherUnit === 'f') {
    temp = Math.round((temp * 9/5) + 32);
  }
  const unitSymbol = weatherUnit === 'f' ? '°F' : '°';
  const info = getWeatherInfo(current.weather_code);

  const badgeEl = document.getElementById('date-weather-badge');
  const emojiEl = document.getElementById('date-weather-emoji');
  const tempEl = document.getElementById('date-weather-temp');

  if (badgeEl && emojiEl && tempEl) {
    emojiEl.innerText = info.emoji || '☀️';
    tempEl.innerText = `${temp}${unitSymbol}`;
    badgeEl.title = `${currentWeatherLocation.name}: ${temp}${unitSymbol} • ${info.text}`;
    badgeEl.classList.remove('hidden');
    badgeEl.classList.add('flex');
  }
}
window.updateDateWeatherWidget = updateDateWeatherWidget;

let weatherHoverTimeout = null;

function openWeatherHover() {
  if (weatherHoverTimeout) {
    clearTimeout(weatherHoverTimeout);
    weatherHoverTimeout = null;
  }
  const calEl = document.getElementById('panel-calendar-dropdown');
  if (calEl) calEl.classList.add('hidden');

  const el = document.getElementById('panel-weather');
  if (el) {
    el.classList.remove('hidden');
    if (typeof fetchLocalWeather === 'function') fetchLocalWeather();
  }
}
window.openWeatherHover = openWeatherHover;

function closeWeatherHover() {
  if (weatherHoverTimeout) clearTimeout(weatherHoverTimeout);
  weatherHoverTimeout = setTimeout(() => {
    const el = document.getElementById('panel-weather');
    const badge = document.getElementById('date-weather-badge');
    const isOverEl = el && el.matches(':hover');
    const isOverBadge = badge && badge.matches(':hover');
    if (el && !isOverEl && !isOverBadge) {
      el.classList.add('hidden');
    }
  }, 250);
}
window.closeWeatherHover = closeWeatherHover;

function renderWeatherData(data) {
  updateDateWeatherWidget(data);
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

  // Smarter Fokus-Tipp basierend auf Wetter
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
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
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

    <!-- Smarter Fokus-Tipp -->
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

// Initialer Auto-Start beim Laden & Regelmäßige Hintergrund-Aktualisierung
function initWeatherSystem() {
  if (cachedWeatherData) {
    updateDateWeatherWidget(cachedWeatherData);
  }
  // Sofort frisches Wetter abrufen
  fetchLocalWeather(false);

  // 1. Regelmäßige automatische Aktualisierung alle 10 Minuten
  if (typeof window !== 'undefined' && !window._weatherPollingInterval) {
    window._weatherPollingInterval = setInterval(() => {
      fetchLocalWeather(true);
    }, 10 * 60 * 1000);
  }

  // 2. Sofortige Aktualisierung beim Wechseln zurück zum Tab (falls >10 Min vergangen)
  if (typeof document !== 'undefined' && !window._weatherVisibilityListenerBound) {
    window._weatherVisibilityListenerBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchLocalWeather(false);
      }
    });
  }

  // 3. Sofortige Aktualisierung bei Wiederherstellung der Internetverbindung
  if (typeof window !== 'undefined' && !window._weatherOnlineListenerBound) {
    window._weatherOnlineListenerBound = true;
    window.addEventListener('online', () => {
      fetchLocalWeather(true);
    });
  }
}

if (typeof window !== 'undefined') {
  window.initWeatherSystem = initWeatherSystem;
  window.fetchLocalWeather = fetchLocalWeather;
  window.toggleWeatherDropdown = typeof toggleWeatherDropdown !== 'undefined' ? toggleWeatherDropdown : undefined;
  window.toggleWeatherUnit = typeof toggleWeatherUnit !== 'undefined' ? toggleWeatherUnit : undefined;
  window.useDeviceLocationWeather = typeof useDeviceLocationWeather !== 'undefined' ? useDeviceLocationWeather : undefined;
  window.handleWeatherSearchInput = typeof handleWeatherSearchInput !== 'undefined' ? handleWeatherSearchInput : undefined;
  window.searchWeatherCityInstant = typeof searchWeatherCityInstant !== 'undefined' ? searchWeatherCityInstant : undefined;
  window.selectWeatherCity = typeof selectWeatherCity !== 'undefined' ? selectWeatherCity : undefined;
  window.updateDateWeatherWidget = typeof updateDateWeatherWidget !== 'undefined' ? updateDateWeatherWidget : undefined;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initWeatherSystem());
  } else {
    initWeatherSystem();
  }
}

if (typeof globalThis !== 'undefined') {
  globalThis.initWeatherSystem = initWeatherSystem;
  globalThis.fetchLocalWeather = fetchLocalWeather;
  globalThis.toggleWeatherDropdown = typeof toggleWeatherDropdown !== 'undefined' ? toggleWeatherDropdown : undefined;
  globalThis.toggleWeatherUnit = typeof toggleWeatherUnit !== 'undefined' ? toggleWeatherUnit : undefined;
  globalThis.useDeviceLocationWeather = typeof useDeviceLocationWeather !== 'undefined' ? useDeviceLocationWeather : undefined;
  globalThis.handleWeatherSearchInput = typeof handleWeatherSearchInput !== 'undefined' ? handleWeatherSearchInput : undefined;
  globalThis.searchWeatherCityInstant = typeof searchWeatherCityInstant !== 'undefined' ? searchWeatherCityInstant : undefined;
  globalThis.selectWeatherCity = typeof selectWeatherCity !== 'undefined' ? selectWeatherCity : undefined;
  globalThis.updateDateWeatherWidget = typeof updateDateWeatherWidget !== 'undefined' ? updateDateWeatherWidget : undefined;
}

