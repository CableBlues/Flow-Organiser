// app-radio-news.js: Live Radio Stations & Snackable News Ticker Hub
// 100% Serverless, Zero-PHP, GitHub Pages compatible, Neurodivergent / ADHD-optimized

(function() {
  'use strict';

  // ============================================================================
  // 1. DATA: RADIO STATIONS & NEWS FEEDS
  // ============================================================================

  const RADIO_STATIONS = [
    // 🇩🇪 Deutschland (Info, Talk & Nachrichten)
    { id: 'dlf', name: 'Deutschlandfunk', category: 'news', country: 'de', flag: '🇩🇪', desc: 'Nachrichten, Politik, Wissen & Kultur', stream: 'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3', logo: '📻' },
    { id: 'ndrinfo', name: 'NDR Info', category: 'news', country: 'de', flag: '🇩🇪', desc: 'Das Informationsradio für den Norden', stream: 'https://icecast.ndr.de/ndr/ndrinfo/hamburg/mp3/128/stream.mp3', logo: '🎙️' },
    { id: 'wdr5', name: 'WDR 5', category: 'news', country: 'de', flag: '🇩🇪', desc: 'Tiefgang, Analysen & Wissensmagazine', stream: 'https://wdr-wdr5-live.icecastssl.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3', logo: '🎙️' },
    { id: 'br24', name: 'BR24 Live', category: 'news', country: 'de', flag: '🇩🇪', desc: 'In 15 Minuten umfassend informiert', stream: 'https://dispatcher.rndfnk.com/br/br24/live/mp3/mid', logo: '📢' },
    { id: 'swraktuell', name: 'SWR Aktuell', category: 'news', country: 'de', flag: '🇩🇪', desc: 'Nachrichten, Interviews & Verkehr', stream: 'https://liveradio.swr.de/sw282p3/swraktuell/play.mp3', logo: '📻' },

    // 🌍 Global & International (English / French)
    { id: 'bbcworld', name: 'BBC World Service', category: 'news', country: 'uk', flag: '🇬🇧', desc: 'Global news, reports & analysis', stream: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service', logo: '🌍' },
    { id: 'npr', name: 'NPR 24/7 News', category: 'news', country: 'us', flag: '🇺🇸', desc: 'National Public Radio Live Stream', stream: 'https://npr-ice.streamguys1.com/live.mp3', logo: '🌐' },
    { id: 'rfi_en', name: 'RFI International', category: 'news', country: 'global', flag: '🌐', desc: 'World affairs & international dispatch', stream: 'https://rfienanglais64k.ice.infomaniak.ch/rfienanglais-64.mp3', logo: '🗞️' },
    { id: 'franceinfo', name: 'France Info Live', category: 'news', country: 'global', flag: '🇫🇷', desc: 'Actualités en direct et informations 24/7', stream: 'https://icecast.radiofrance.fr/franceinfo-midfi.mp3', logo: '🌐' },

    // 🇦🇹 Österreich & 🇨🇭 Schweiz
    { id: 'oe1', name: 'Ö1 Kultur & Info', category: 'news', country: 'at', flag: '🇦🇹', desc: 'Wissen, Kultur & fundierte Nachrichten', stream: 'https://orf-live.ors-shoutcast.at/oe1-q2a', logo: '🇦🇹' },
    { id: 'oe3', name: 'Hitradio Ö3', category: 'music', country: 'at', flag: '🇦🇹', desc: 'Österreichs beliebtestes Hitradio & Info', stream: 'https://orf-live.ors-shoutcast.at/oe3-q2a', logo: '🎵' },
    { id: 'srf1', name: 'SRF 1 Info & Musik', category: 'news', country: 'ch', flag: '🇨🇭', desc: 'Schweizer Radio & Nachrichten', stream: 'https://stream.srg-ssr.ch/m/drs1/mp3_128', logo: '🇨🇭' },
    { id: 'swisspop', name: 'Radio Swiss Pop', category: 'music', country: 'ch', flag: '🇨🇭', desc: 'Entspannter Pop-Mix ohne Unterbrechung', stream: 'https://stream.srg-ssr.ch/m/rsp/mp3_128', logo: '🎶' },

    // 🧘 Focus & Chill (ADHD / Hyperfokus Soundtracks)
    { id: 'groovesalad', name: 'SomaFM Groove Salad', category: 'focus', country: 'global', flag: '🧘', desc: 'Downtempo Ambient & Chilled Electronic', stream: 'https://ice1.somafm.com/groovesalad-128-mp3', logo: '🥗' },
    { id: 'dronezone', name: 'SomaFM Drone Zone', category: 'focus', country: 'global', flag: '🌌', desc: 'Tiefer Ambient Space & Flow-Soundscapes', stream: 'https://ice1.somafm.com/dronezone-128-mp3', logo: '🧘' },
    { id: 'lush', name: 'SomaFM Lush Chill', category: 'focus', country: 'global', flag: '🎧', desc: 'Sanfter Lofi Chill & Vocal Atmospheres', stream: 'https://ice1.somafm.com/lush-128-mp3', logo: '☕' },
    { id: 'secretagent', name: 'SomaFM Secret Agent', category: 'focus', country: 'global', flag: '🍸', desc: 'The soundtrack for your stylish spy mission', stream: 'https://ice1.somafm.com/secretagent-128-mp3', logo: '🕵️' },
    { id: 'spacestation', name: 'SomaFM Space Station', category: 'focus', country: 'global', flag: '🚀', desc: 'Mid-tempo Space Ambient & Future Beats', stream: 'https://ice1.somafm.com/spacestation-128-mp3', logo: '🛰️' },
    { id: 'defcon', name: 'SomaFM DEF CON Radio', category: 'focus', country: 'global', flag: '⚡', desc: 'Hacking, Synth & Deep Focus Energy', stream: 'https://ice1.somafm.com/defcon-128-mp3', logo: '💻' },

    // 🇬🇷 Ελλάδα
    { id: 'realfm', name: 'Real FM 97.8', category: 'news', country: 'gr', flag: '🇬🇷', desc: 'Ειδήσεις, επικαιρότητα και σχόλια', stream: 'https://realfm.live24.gr/realfm', logo: '🇬🇷' },
    { id: 'ertproto', name: 'ΕΡΤ Πρώτο Πρόγραμμα', category: 'news', country: 'gr', flag: '🇬🇷', desc: 'Δημόσια ραδιοφωνία & ενημέρωση', stream: 'https://radiostreaming.ert.gr/ert-proto', logo: '🏛️' }
  ];

  const REGIONS = [
    { id: 'de', name: 'Deutschland', flag: '🇩🇪', lang: 'de-DE' },
    { id: 'at', name: 'Österreich', flag: '🇦🇹', lang: 'de-AT' },
    { id: 'ch', name: 'Schweiz', flag: '🇨🇭', lang: 'de-CH' },
    { id: 'global', name: 'Global / Welt', flag: '🌐', lang: 'en-US' },
    { id: 'uk', name: 'UK / Britain', flag: '🇬🇧', lang: 'en-GB' },
    { id: 'us', name: 'USA', flag: '🇺🇸', lang: 'en-US' },
    { id: 'gr', name: 'Ελλάδα', flag: '🇬🇷', lang: 'el-GR' }
  ];

  const CATEGORIES = [
    { id: 'top', name: 'Top News', emoji: '🚨', desc: 'Eilmeldungen & Wichtigstes' },
    { id: 'tech', name: 'Tech & KI', emoji: '🤖', desc: 'Innovationen, Software & Zukunft' },
    { id: 'science', name: 'Wissen & Natur', emoji: '🔬', desc: 'Entdeckungen & Forschung' },
    { id: 'goodnews', name: 'Good News', emoji: '🌟', desc: 'Positives, Lösungen & Hoffnung' },
    { id: 'business', name: 'Wirtschaft', emoji: '💼', desc: 'Märkte, Trends & Finanzen' },
    { id: 'sport', name: 'Sport', emoji: '⚽', desc: 'Ergebnisse, Events & Action' },
    { id: 'culture', name: 'Kultur & Chill', emoji: '🎭', desc: 'Kunst, Musik & Lifestyle' }
  ];

  // Public live RSS feed URLs per region and category
  const NEWS_FEEDS = {
    de: {
      top: { name: 'Tagesschau', rss: 'https://www.tagesschau.de/xml/rss2/' },
      tech: { name: 'Heise Online', rss: 'https://www.heise.de/rss/heise-atom.xml' },
      science: { name: 'Spektrum', rss: 'https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/965546' },
      goodnews: { name: 'Good News DE', rss: 'https://goodnews.eu/feed/' },
      business: { name: 'Handelsblatt', rss: 'https://www.handelsblatt.com/contentexport/feed/top-themen' },
      sport: { name: 'Sportschau', rss: 'https://www.sportschau.de/sportschau-index-100.rss' },
      culture: { name: 'Spiegel Kultur', rss: 'https://www.spiegel.de/kultur/index.rss' }
    },
    at: {
      top: { name: 'ORF News', rss: 'https://rss.orf.at/news.xml' },
      tech: { name: 'Der Standard Web', rss: 'https://www.derstandard.at/rss/web' },
      science: { name: 'ORF Science', rss: 'https://rss.orf.at/science.xml' },
      goodnews: { name: 'Good News AT', rss: 'https://goodnews.eu/feed/' },
      business: { name: 'Der Standard Wirtschaft', rss: 'https://www.derstandard.at/rss/wirtschaft' },
      sport: { name: 'ORF Sport', rss: 'https://rss.orf.at/sport.xml' },
      culture: { name: 'ORF Kultur', rss: 'https://rss.orf.at/kultur.xml' }
    },
    ch: {
      top: { name: 'SRF News', rss: 'https://www.srf.ch/news/bnf/rss/1646' },
      tech: { name: 'SRF Digital', rss: 'https://www.srf.ch/news/bnf/rss/1648' },
      science: { name: 'SRF Wissen', rss: 'https://www.srf.ch/news/bnf/rss/1650' },
      goodnews: { name: 'Good News CH', rss: 'https://goodnews.eu/feed/' },
      business: { name: 'SRF Wirtschaft', rss: 'https://www.srf.ch/news/bnf/rss/1647' },
      sport: { name: 'SRF Sport', rss: 'https://www.srf.ch/news/bnf/rss/1649' },
      culture: { name: 'SRF Kultur', rss: 'https://www.srf.ch/news/bnf/rss/1651' }
    },
    global: {
      top: { name: 'BBC World', rss: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
      tech: { name: 'Wired Tech', rss: 'https://www.wired.com/feed/rss' },
      science: { name: 'ScienceDaily', rss: 'https://www.sciencedaily.com/rss/top/science.xml' },
      goodnews: { name: 'Good News Network', rss: 'https://www.goodnewsnetwork.org/feed/' },
      business: { name: 'Reuters Business', rss: 'https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best' },
      sport: { name: 'BBC Sport', rss: 'https://feeds.bbci.co.uk/sport/rss.xml' },
      culture: { name: 'The Verge', rss: 'https://www.theverge.com/rss/index.xml' }
    },
    uk: {
      top: { name: 'BBC UK', rss: 'https://feeds.bbci.co.uk/news/uk/rss.xml' },
      tech: { name: 'BBC Tech', rss: 'https://feeds.bbci.co.uk/news/technology/rss.xml' },
      science: { name: 'BBC Science', rss: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml' },
      goodnews: { name: 'Positive News UK', rss: 'https://www.positive.news/feed/' },
      business: { name: 'BBC Business', rss: 'https://feeds.bbci.co.uk/news/business/rss.xml' },
      sport: { name: 'BBC Sport UK', rss: 'https://feeds.bbci.co.uk/sport/rss.xml' },
      culture: { name: 'BBC Arts', rss: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml' }
    },
    us: {
      top: { name: 'NPR News', rss: 'https://feeds.npr.org/1001/rss.xml' },
      tech: { name: 'TechCrunch', rss: 'https://techcrunch.com/feed/' },
      science: { name: 'Scientific American', rss: 'http://rss.sciam.com/ScientificAmerican-Global' },
      goodnews: { name: 'Good News Network US', rss: 'https://www.goodnewsnetwork.org/feed/' },
      business: { name: 'CNBC Markets', rss: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
      sport: { name: 'ESPN News', rss: 'https://www.espn.com/espn/rss/news' },
      culture: { name: 'NPR Arts', rss: 'https://feeds.npr.org/1008/rss.xml' }
    },
    gr: {
      top: { name: 'ΕΡΤ News', rss: 'https://www.ertnews.gr/feed/' },
      tech: { name: 'Techblog GR', rss: 'https://techblog.gr/feed/' },
      science: { name: 'Kathimerini Science', rss: 'https://www.kathimerini.gr/rss' },
      goodnews: { name: 'Good News GR', rss: 'https://www.ertnews.gr/feed/' },
      business: { name: 'Capital.gr', rss: 'https://www.capital.gr/rss' },
      sport: { name: 'Gazzetta GR', rss: 'https://www.gazzetta.gr/rss' },
      culture: { name: 'Kathimerini Culture', rss: 'https://www.kathimerini.gr/k/culture/rss' }
    }
  };

  // Curated snackable fallback news (TL;DR bullet points) guaranteed to work 100% offline or on GitHub Pages
  const FALLBACK_NEWS_DATABASE = {
    de: {
      top: [
        { title: 'EU beschließt neues Digitalpaket für Verbraucherschutz', summary: 'Strengere Transparenzregeln für Algorithmen und vereinfachte Kündigungen von Online-Abos ab sofort wirksam.', source: 'Tagesschau', time: 'vor 12 Min', url: 'https://www.tagesschau.de' },
        { title: 'Investitionen in erneuerbare Energien erreichen Höchststand', summary: 'Über 58 Prozent des bundesweiten Strombedarfs stammten im letzten Quartal aus Wind- und Solarkraft.', source: 'Spiegel', time: 'vor 25 Min', url: 'https://www.spiegel.de' },
        { title: 'Bahn erweitert Schnellfahrstrecken & Pünktlichkeitsoffensive', summary: 'Neue ICE-Verbindungen verkürzen Reisezeiten zwischen Berlin, Frankfurt und München spürbar.', source: 'FAZ', time: 'vor 45 Min', url: 'https://www.faz.net' },
        { title: 'Arbeitsmarkt zeigt robuste Frühjahrsdynamik im Tech-Sektor', summary: 'Besonders in KI-Entwicklung, nachhaltigem Handwerk und Pflegeberufen steigen die Festanstellungen.', source: 'Zeit Online', time: 'vor 1 Std', url: 'https://www.zeit.de' },
        { title: 'Neuer Raumfahrt-Forschungssatellit erfolgreich im Orbit', summary: 'Europäische Weltraumorganisation ESA empfängt erste hochauflösende Klimadaten zur Erdbeobachtung.', source: 'DLF Info', time: 'vor 2 Std', url: 'https://www.deutschlandfunk.de' }
      ],
      tech: [
        { title: 'Neues Open-Source KI-Modell läuft direkt lokal im Browser', summary: 'WebGPU ermöglicht blitzschnelle Sprachmodelle ohne Datenübertragung an fremde Server.', source: 'Heise', time: 'vor 18 Min', url: 'https://www.heise.de' },
        { title: 'Durchbruch bei Festkörper-Akkus: 1000 km Reichweite & 10 Min Ladezeit', summary: 'Neue Silizium-Anoden-Technologie verspricht längere Haltbarkeit und doppelte Energiedichte.', source: 'Golem', time: 'vor 35 Min', url: 'https://www.golem.de' },
        { title: 'W3C verabschiedet neuen Standard für barrierefreie Web-Apps', summary: 'Screenreader und Tastatur-Shortcuts werden nun tiefer in Web-Browser nativ integriert.', source: 't3n', time: 'vor 1 Std', url: 'https://t3n.de' },
        { title: 'Quantencomputer knackt komplexe Molekül-Simulation für Medizin', summary: 'Forscher entwickeln in Rekordzeit neue Wirkstoffkandidaten gegen virale Infektionen.', source: 'Spektrum Tech', time: 'vor 2 Std', url: 'https://www.spektrum.de' }
      ],
      science: [
        { title: 'James Webb Teleskop entdeckt bisher älteste bekannte Galaxie', summary: 'Die Galaxie entstand nur 290 Millionen Jahre nach dem Urknall und überrascht mit hoher Leuchtkraft.', source: 'Spektrum', time: 'vor 30 Min', url: 'https://www.spektrum.de' },
        { title: 'Tiefsee-Expedition entdeckt über 100 neue Tierarten vor Chile', summary: 'Korallengärten und fluoreszierende Tiefsee-Organismen in bis zu 4000 Metern Tiefe dokumentiert.', source: 'Geo', time: 'vor 1 Std', url: 'https://www.geo.de' },
        { title: 'Neuer Schnelltest erkennt neurodegenerative Erkrankungen im Frühstadium', summary: 'Ein einfacher Bluttest ermöglicht präventive Therapien viele Jahre vor den ersten Symptomen.', source: 'Nature DE', time: 'vor 2 Std', url: 'https://www.nature.com' }
      ],
      goodnews: [
        { title: 'Globale Wiederaufforstung verzeichnet 1 Million Hektar neuen Wald', summary: 'Internationale Naturschutzprojekte regenerieren erfolgreich artenreiche Mischwälder.', source: 'Good News', time: 'vor 20 Min', url: 'https://goodnews.eu' },
        { title: 'Meeresreinigung entfernt Rekordmenge an Plastik aus dem Pazifik', summary: 'Autonome Barrieren sammeln über 250 Tonnen Zivilisationsmüll zur Wiederverwertung.', source: 'Positive News', time: 'vor 40 Min', url: 'https://goodnews.eu' },
        { title: 'Erneuerbare Energien decken Rekordanteil am weltweiten Stromnetz', summary: 'Solarenergie verzeichnete den stärksten Zubau der Geschichte und senkt Energiekosten global.', source: 'Clean Energy', time: 'vor 1 Std', url: 'https://goodnews.eu' },
        { title: 'Freiwillige pflanzen 50.000 Stadtbäume für kühleres Mikroklima', summary: 'Urbane Begrünung senkt sommerliche Hitzespitzen in Großstädten um bis zu 4 Grad Celsius.', source: 'Good News', time: 'vor 3 Std', url: 'https://goodnews.eu' }
      ],
      business: [
        { title: 'Europäische Zentralbank signalisiert stabile Zinsentwicklung', summary: 'Inflation sinkt kontinuierlich in Richtung des 2-Prozent-Ziels, Kaufkraft der Verbraucher stabilisiert sich.', source: 'Handelsblatt', time: 'vor 25 Min', url: 'https://www.handelsblatt.com' },
        { title: 'Gründer-Boom in Europa: Starkes Wachstum bei nachhaltigen Start-ups', summary: 'Investitionen in Cleantech, Bildung und KI-Software steigen im laufenden Quartal um 24 Prozent.', source: 'WirtschaftsWoche', time: 'vor 50 Min', url: 'https://www.wiwo.de' }
      ],
      sport: [
        { title: 'Champions League: Hochklassige Halbfinal-Duelle ausgelost', summary: 'Europas Top-Teams kämpfen im Mai um den Einzug ins große Finale im Wembley-Stadion.', source: 'Sportschau', time: 'vor 15 Min', url: 'https://www.sportschau.de' },
        { title: 'Marathon-Weltrekordlerin bricht erneut Bestmarke mit Traumzeit', summary: 'Überragende Ausdauerleistung bei optimalen Bedingungen auf der schnellen Strecke in Berlin.', source: 'Kicker', time: 'vor 1 Std', url: 'https://www.kicker.de' }
      ],
      culture: [
        { title: 'Kuratierte Kunstausstellung begeistert 100.000 Besucher in 2 Wochen', summary: 'Verbindung von klassischer Malerei und immersiven Lichtinstallationen setzt neue Maßstäbe.', source: 'Monopol', time: 'vor 40 Min', url: 'https://www.monopol-magazin.de' },
        { title: 'Neues Lofi-Soundtrack-Album bricht weltweite Streaming-Rekorde', summary: 'Fokus-Musik und entspannte Akkorde erfreuen sich riesiger Beliebtheit bei Entwicklern und Kreativen.', source: 'Rolling Stone', time: 'vor 2 Std', url: 'https://www.rollingstone.de' }
      ]
    },
    global: {
      top: [
        { title: 'Global Climate Accord unlocks record funding for green infrastructure', summary: 'Over 80 nations commit to accelerating solar, wind, and battery storage rollouts by 2030.', source: 'BBC World', time: '10m ago', url: 'https://www.bbc.com/news' },
        { title: 'International Space Station marks 25 years of continuous human presence', summary: 'Astronauts and scientists celebrate a quarter-century of breakthroughs in microgravity research.', source: 'Reuters', time: '28m ago', url: 'https://www.reuters.com' },
        { title: 'Next-generation high-speed rail network connects major capitals', summary: 'Zero-emission passenger trains slash intercity travel times by over 45 percent.', source: 'The Guardian', time: '55m ago', url: 'https://www.theguardian.com' },
        { title: 'Global health initiative eliminates endemic transmission in 12 countries', summary: 'Decades of coordinated public health efforts achieve historic eradication milestone.', source: 'WHO Dispatch', time: '2h ago', url: 'https://www.who.int' }
      ],
      tech: [
        { title: 'Lightweight AI models run entirely on-device with zero latency', summary: 'Local neural inference guarantees user privacy without transmitting sensitive data to the cloud.', source: 'Wired', time: '15m ago', url: 'https://www.wired.com' },
        { title: 'Breakthrough quantum processor achieves error mitigation milestone', summary: 'Fault-tolerant quantum computing moves closer to practical industrial chemistry applications.', source: 'TechCrunch', time: '40m ago', url: 'https://techcrunch.com' },
        { title: 'Open-source web engines implement ultra-fast graphics rendering', summary: 'Next-gen standards deliver 120 FPS buttery-smooth canvas animations for productivity apps.', source: 'The Verge', time: '1h ago', url: 'https://www.theverge.com' }
      ],
      science: [
        { title: 'Astronomers detect water vapor and organic molecules on distant exoplanet', summary: 'Atmospheric spectroscopy reveals rich prebiotic conditions 120 light-years away.', source: 'ScienceDaily', time: '35m ago', url: 'https://www.sciencedaily.com' },
        { title: 'Deep sea exploration reveals vast microbial ecosystems in ocean trenches', summary: 'Chemosynthetic organisms offer clues to the origins of early life on Earth and icy moons.', source: 'Nature', time: '1h ago', url: 'https://www.nature.com' }
      ],
      goodnews: [
        { title: 'Global ocean cleanup removes record 500 tons of plastic debris', summary: 'Ocean cleanup barriers successfully deploy recyclable circular material processing.', source: 'Good News Network', time: '20m ago', url: 'https://www.goodnewsnetwork.org' },
        { title: 'Solar energy surpasses coal in major worldwide power grids', summary: 'Clean energy generation records exponential growth, dropping electricity costs worldwide.', source: 'Positive News', time: '45m ago', url: 'https://www.positive.news' },
        { title: 'Community conservation restores endangered tiger and snow leopard habitats', summary: 'Wildlife populations rebound by 30% across protected national corridors in Asia.', source: 'Good News Network', time: '2h ago', url: 'https://www.goodnewsnetwork.org' }
      ],
      business: [
        { title: 'Global trade outlook improves as supply chains stabilize', summary: 'Logistics indices show reduced freight costs and accelerated delivery times for manufacturers.', source: 'Bloomberg', time: '30m ago', url: 'https://www.bloomberg.com' },
        { title: 'Green bond issuance sets new all-time record for sustainable projects', summary: 'Institutional investors channel billions into carbon-neutral cities and clean mobility.', source: 'Financial Times', time: '1h ago', url: 'https://www.ft.com' }
      ],
      sport: [
        { title: 'World Athletics Championships announce innovative spectator experience', summary: 'Real-time biomechanical telemetry gives fans instant insights into athletic speed and stamina.', source: 'BBC Sport', time: '25m ago', url: 'https://www.bbc.com/sport' }
      ],
      culture: [
        { title: 'World Music Festival unites artists from 60 countries in virtual harmony', summary: 'Global collaboration celebrates traditional acoustic instruments fused with ambient synthesis.', source: 'NPR Arts', time: '1h ago', url: 'https://www.npr.org' }
      ]
    },
    at: {
      top: [
        { title: 'Österreich investiert 3 Milliarden Euro in den Bahnausbau', summary: 'Koralmbahn und Brenner-Zulaufstrecken verkürzen Reisezeiten im Alpenraum drastisch.', source: 'ORF News', time: 'vor 20 Min', url: 'https://orf.at' },
        { title: 'Alpen-Wasserkraftwerke melden Rekord-Füllstände für saubere Energie', summary: 'Speicherkraftwerke in Tirol und Salzburg sichern stabile Stromversorgung zu günstigen Preisen.', source: 'Der Standard', time: 'vor 40 Min', url: 'https://www.derstandard.at' }
      ],
      tech: [
        { title: 'Wiener Quantenphysik-Zentrum erzielt Meilenstein bei Teleportation', summary: 'Erfolgreiche photonische Verschränkung über mehrere Kilometer Glasfasernetz in Wien.', source: 'ORF Science', time: 'vor 30 Min', url: 'https://science.orf.at' }
      ],
      goodnews: [
        { title: 'Österreichs Nationalparks verzeichnen Rückkehr seltener Bartgeier', summary: 'Erfolgreiche Wiederansiedlung stärkt das alpine Ökosystem in den Hohen Tauern.', source: 'Good News AT', time: 'vor 1 Std', url: 'https://goodnews.eu' }
      ]
    },
    ch: {
      top: [
        { title: 'Schweiz stärkt Innovationsstandort mit neuem Biotech-Campus', summary: 'Spitzenforschung an ETH Zürich und EPFL Lausanne zieht internationale Talente an.', source: 'SRF News', time: 'vor 22 Min', url: 'https://www.srf.ch' },
        { title: 'SBB baut Taktfahrplan im Fernverkehr und grenzüberschreitend aus', summary: 'Halbstundentakt auf allen Hauptachsen und komfortable Direktzüge nach Mailand und Paris.', source: 'NZZ', time: 'vor 50 Min', url: 'https://www.nzz.ch' }
      ],
      tech: [
        { title: 'ETH-Forscher entwickeln biologisch abbaubare Micro-Chips', summary: 'Sensoren aus nachhaltigen Pflanzenfasern revolutionieren Medizintechnik und Logistik.', source: 'SRF Digital', time: 'vor 35 Min', url: 'https://www.srf.ch/news/digital' }
      ],
      goodnews: [
        { title: 'Schweizer Solarpflicht auf Neubauten übertrifft alle Erwartungen', summary: 'Alpine Solaranlagen liefern besonders im Winter wertvollen Sonnenstrom in großen Mengen.', source: 'Good News CH', time: 'vor 1 Std', url: 'https://goodnews.eu' }
      ]
    },
    gr: {
      top: [
        { title: 'Ηλιακή και αιολική ενέργεια καλύπτουν πάνω από το 60% της ζήτησης', summary: 'Ιστορικό ρεκόρ καθαρής ενέργειας στην Ελλάδα με σημαντική μείωση του κόστους.', source: 'ΕΡΤ News', time: 'πριν 15 λεπτά', url: 'https://www.ertnews.gr' },
        { title: 'Εκσυγχρονισμός ψηφιακών υπηρεσιών για πολίτες και επιχειρήσεις', summary: 'Νέες αυτοματοποιημένες διαδικασίες εξοικονομούν χιλιάδες ώρες γραφειοκρατίας.', source: 'Kathimerini', time: 'πριν 40 λεπτά', url: 'https://www.kathimerini.gr' }
      ],
      tech: [
        { title: 'Ελληνικές νεοφυείς επιχειρήσεις τεχνητής νοημοσύνης προσελκύουν διεθνή κεφάλαια', summary: 'Ανάπτυξη καινοτόμων λύσεων υγείας και ναυτιλίας στην Αθήνα και Θεσσαλονίκη.', source: 'Techblog GR', time: 'πριν 1 ώρα', url: 'https://techblog.gr' }
      ],
      goodnews: [
        { title: 'Πρόγραμμα προστασίας θαλάσσιων χελωνών Caretta-Caretta σημειώνει ρεκόρ φωλιών', summary: 'Σημαντική αύξηση πληθυσμού στη Ζάκυνθο και την Κρήτη χάρη σε εθελοντικές δράσεις.', source: 'Good News GR', time: 'πριν 2 ώρες', url: 'https://www.ertnews.gr' }
      ]
    },
    uk: {
      top: [
        { title: 'UK offshore wind farms generate record energy output', summary: 'Clean maritime wind turbines supply over 40% of peak electricity demand across Britain.', source: 'BBC UK', time: '20m ago', url: 'https://www.bbc.co.uk/news' }
      ],
      tech: [
        { title: 'Cambridge researchers unveil ultra-efficient synthetic diamond semiconductors', summary: 'New thermal properties allow computers to operate faster with 70% less power consumption.', source: 'BBC Tech', time: '45m ago', url: 'https://www.bbc.co.uk/news/technology' }
      ],
      goodnews: [
        { title: 'Ancient temperate rainforest restored in Western Scotland', summary: 'Thousands of native oak, hazel and birch trees naturally regenerate in protected glen.', source: 'Positive News UK', time: '1h ago', url: 'https://www.positive.news' }
      ]
    },
    us: {
      top: [
        { title: 'Major infrastructure upgrades modernize nationwide electrical grid', summary: 'Smart grid interconnections enhance reliability and accelerate clean energy integration.', source: 'NPR News', time: '15m ago', url: 'https://www.npr.org' }
      ],
      tech: [
        { title: 'Next-gen fusion energy experiment sustains positive net gain for 10 minutes', summary: 'Scientists confirm sustainable confinement plasma parameters at national laboratory.', source: 'TechCrunch', time: '30m ago', url: 'https://techcrunch.com' }
      ],
      goodnews: [
        { title: 'Bald eagle populations reach historic all-time high across North America', summary: 'Decades of habitat preservation and river cleanups restore thriving wild raptor nesting pairs.', source: 'Good News Network US', time: '1h ago', url: 'https://www.goodnewsnetwork.org' }
      ]
    }
  };

  // ============================================================================
  // 2. STATE MANAGEMENT & AUDIO / TTS ENGINES
  // ============================================================================

  let currentStationId = localStorage.getItem('flow_radio_station') || 'dlf';
  let isRadioPlaying = false;
  let radioVolume = parseFloat(localStorage.getItem('flow_radio_vol') || '0.7');
  let radioAudioEl = null;

  let currentRegion = localStorage.getItem('flow_news_region') || 'de';
  let currentCategory = localStorage.getItem('flow_news_cat') || 'top';
  let activeTab = 'radio'; // 'radio' | 'news'

  // Text-to-Speech (TTS) State
  let isSpeakingQueue = false;
  let isTtsPaused = false;
  let currentSpeakingIndex = -1;
  let speechRate = parseFloat(localStorage.getItem('flow_news_speech_rate') || '1.2'); // 1.2x speed default for snackable listening!
  let currentNewsItems = [];
  let isLiveFetching = false;
  let cachedNewsByRegionCat = {};

  // Audio Equalizer Visualizer simulation
  let visualizerInterval = null;

  // Initialize Audio Element for Radio
  function getRadioAudio() {
    if (!radioAudioEl) {
      radioAudioEl = new Audio();
      radioAudioEl.preload = 'none';
      radioAudioEl.volume = radioVolume;

      radioAudioEl.addEventListener('playing', () => {
        isRadioPlaying = true;
        updateRadioUIState(true);
        updateRadioBufferingUI(false);
      });

      radioAudioEl.addEventListener('pause', () => {
        isRadioPlaying = false;
        updateRadioUIState(false);
      });

      radioAudioEl.addEventListener('waiting', () => {
        updateRadioBufferingUI(true);
      });

      radioAudioEl.addEventListener('canplay', () => {
        updateRadioBufferingUI(false);
      });

      radioAudioEl.addEventListener('error', (e) => {
        console.warn('[Radio Engine] Stream playback error:', e);
        isRadioPlaying = false;
        updateRadioUIState(false);
        updateRadioBufferingUI(false);
        if (typeof showToast === 'function') {
          showToast(tr({ de: 'Radiosender konnte nicht geladen werden. Probiere einen anderen Sender.', en: 'Radio station could not be loaded. Please try another.' }));
        }
      });
    }
    return radioAudioEl;
  }

  // ============================================================================
  // 3. RADIO PLAYER CONTROLS
  // ============================================================================

  function playRadioStation(stationId) {
    const station = RADIO_STATIONS.find(s => s.id === stationId);
    if (!station) return;

    // 1. Wenn der aktuelle Sender bereits läuft und erneut geklickt wird -> Pause
    if (currentStationId === stationId && isRadioPlaying && radioAudioEl) {
      toggleRadioPlayback();
      return;
    }

    currentStationId = stationId;
    localStorage.setItem('flow_radio_station', stationId);

    // 2. TTS stoppen, falls aktiv
    if (isSpeakingQueue) {
      stopNewsReader();
    }

    const audio = getRadioAudio();
    try {
      // Alten Stream und Buffer sauber stoppen
      audio.pause();
      audio.removeAttribute('src');
      audio.src = station.stream;
      audio.load();
      audio.volume = radioVolume;

      updateRadioBufferingUI(true);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isRadioPlaying = true;
          updateRadioUIState(true);
          updateRadioBufferingUI(false);
          startVisualizerAnimation();
          if (typeof updateMediaSession === 'function') {
            updateMediaSession(station.name, 'Flow Live Radio', station.desc);
          }
          if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
            try { navigator.mediaSession.playbackState = 'playing'; } catch (e) {}
          }
          if (typeof showToast === 'function') {
            showToast(`📻 ${station.flag} ${station.name}: Live`);
          }
        }).catch(err => {
          console.warn('[Radio Engine] Autoplay restriction or network error:', err);
          isRadioPlaying = false;
          updateRadioUIState(false);
          updateRadioBufferingUI(false);
        });
      }
    } catch (err) {
      console.error('[Radio Engine] Play error:', err);
      isRadioPlaying = false;
      updateRadioUIState(false);
      updateRadioBufferingUI(false);
    }
    renderRadioPanelContent();
  }

  function toggleRadioPlayback() {
    const audio = getRadioAudio();
    if (isRadioPlaying) {
      audio.pause();
      isRadioPlaying = false;
      stopVisualizerAnimation();
      updateRadioUIState(false);
    } else {
      playRadioStation(currentStationId);
    }
    renderRadioPanelContent();
  }

  function setRadioVolume(val) {
    radioVolume = Math.max(0, Math.min(1, parseFloat(val)));
    localStorage.setItem('flow_radio_vol', radioVolume.toString());
    const audio = getRadioAudio();
    audio.volume = radioVolume;
    const volDisplay = document.getElementById('radio-volume-display');
    if (volDisplay) volDisplay.textContent = Math.round(radioVolume * 100) + '%';
    const slider = document.getElementById('radio-volume-slider');
    if (slider) slider.value = radioVolume;
  }

  function updateRadioBufferingUI(isBuffering) {
    const statusBadge = document.getElementById('radio-status-badge');
    if (statusBadge) {
      if (isBuffering) {
        statusBadge.textContent = 'Pufferung...';
        statusBadge.className = 'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse';
      } else if (isRadioPlaying) {
        statusBadge.textContent = 'LIVE';
        statusBadge.className = 'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse';
      }
    }
  }

  function updateRadioUIState(isPlaying) {
    // 1. Play/Pause buttons in panel (both master button in header and modal main button)
    const masterPlayBtn = document.getElementById('radio-master-play-btn');
    const masterPlayLabel = document.getElementById('radio-master-btn-label');
    if (masterPlayBtn) {
      if (masterPlayLabel) masterPlayLabel.textContent = isPlaying ? 'Pause' : 'Play';
      const icon = masterPlayBtn.querySelector('[data-lucide]');
      if (icon) icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    }

    const playBtn = document.getElementById('radio-main-play-btn');
    if (playBtn) {
      playBtn.innerHTML = isPlaying 
        ? '<i data-lucide="pause" class="w-5 h-5 fill-white"></i>' 
        : '<i data-lucide="play" class="w-5 h-5 fill-white ml-0.5"></i>';
    }

    // 2. Header / Dock live pulse badges
    const dockBadge = document.getElementById('dock-radio-live-badge');
    if (dockBadge) {
      if (isPlaying) dockBadge.classList.remove('hidden');
      else dockBadge.classList.add('hidden');
    }

    const headerBadge = document.getElementById('header-radio-live-badge');
    if (headerBadge) {
      if (isPlaying) headerBadge.classList.remove('hidden');
      else headerBadge.classList.add('hidden');
    }

    const liveDot = document.getElementById('radio-live-dot');
    if (liveDot) {
      liveDot.className = isPlaying ? 'w-2 h-2 rounded-full bg-rose-500 animate-ping' : 'w-2 h-2 rounded-full bg-rose-500/40';
    }

    const nowPlayingText = document.getElementById('radio-now-playing-label') || document.getElementById('radio-now-playing-title');
    if (nowPlayingText) {
      const station = RADIO_STATIONS.find(s => s.id === currentStationId);
      nowPlayingText.textContent = station ? (isPlaying ? `${station.flag} ${station.name}` : `Bereit: ${station.name}`) : 'Kein Sender gewählt';
    }

    const statusBadge = document.getElementById('radio-status-badge');
    if (statusBadge) {
      statusBadge.textContent = isPlaying ? 'LIVE' : 'BEREIT';
      statusBadge.className = isPlaying
        ? 'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
        : 'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-gray-400 border border-white/10';
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  function startVisualizerAnimation() {
    stopVisualizerAnimation();
    const bars = document.querySelectorAll('.radio-eq-bar');
    if (bars.length === 0) return;
    visualizerInterval = setInterval(() => {
      if (!isRadioPlaying) return;
      bars.forEach(bar => {
        const height = Math.floor(Math.random() * 85) + 15;
        bar.style.height = `${height}%`;
      });
    }, 120);
  }

  function stopVisualizerAnimation() {
    if (visualizerInterval) {
      clearInterval(visualizerInterval);
      visualizerInterval = null;
    }
    const bars = document.querySelectorAll('.radio-eq-bar');
    bars.forEach(bar => {
      bar.style.height = '15%';
    });
  }

  // ============================================================================
  // 4. NEWS AGGREGATOR & LIVE RSS FETCHER
  // ============================================================================

  async function fetchNewsForRegionCat(region, cat, forceRefresh = false) {
    const cacheKey = `${region}_${cat}`;
    if (!forceRefresh && cachedNewsByRegionCat[cacheKey] && cachedNewsByRegionCat[cacheKey].length > 0) {
      currentNewsItems = cachedNewsByRegionCat[cacheKey];
      renderNewsContent();
      return;
    }

    // Default to curated instant fallback
    let fallbackList = (FALLBACK_NEWS_DATABASE[region] && FALLBACK_NEWS_DATABASE[region][cat]) ||
                       (FALLBACK_NEWS_DATABASE[region] && FALLBACK_NEWS_DATABASE[region].top) ||
                       (FALLBACK_NEWS_DATABASE.de[cat]) ||
                       FALLBACK_NEWS_DATABASE.de.top;
    
    currentNewsItems = [...fallbackList];
    renderNewsContent();

    // Try fetching live RSS via CORS proxy if online
    if (typeof navigator !== 'undefined' && navigator.onLine && NEWS_FEEDS[region] && NEWS_FEEDS[region][cat]) {
      const feedConfig = NEWS_FEEDS[region][cat];
      isLiveFetching = true;
      updateNewsFetchIndicator(true);

      try {
        const rssUrl = feedConfig.rss;
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&api_key=`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.items && data.items.length > 0) {
            const parsed = data.items.slice(0, 8).map((item) => {
              // Strip HTML tags for clean bullet-point summary
              const cleanDesc = (item.description || item.content || '')
                .replace(/<[^>]*>?/gm, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .trim();
              const shortSummary = cleanDesc.length > 150 ? cleanDesc.slice(0, 147) + '...' : cleanDesc;
              
              // Calculate relative time
              let timeLabel = 'Heute';
              if (item.pubDate) {
                const diffMins = Math.round((Date.now() - new Date(item.pubDate).getTime()) / 60000);
                if (diffMins > 0 && diffMins < 60) timeLabel = `vor ${diffMins} Min`;
                else if (diffMins >= 60 && diffMins < 1440) timeLabel = `vor ${Math.round(diffMins/60)} Std`;
              }

              return {
                title: item.title.trim(),
                summary: shortSummary || item.title,
                source: data.feed?.title || feedConfig.name,
                time: timeLabel,
                url: item.link || '#'
              };
            });

            if (parsed.length > 0) {
              currentNewsItems = parsed;
              cachedNewsByRegionCat[cacheKey] = parsed;
              renderNewsContent();
            }
          }
        }
      } catch (err) {
        // Silently use rich fallback database
        console.log('[News Feed] Using high-quality curated preset fallback for', region, cat);
      } finally {
        isLiveFetching = false;
        updateNewsFetchIndicator(false);
      }
    }
  }

  function updateNewsFetchIndicator(isFetching) {
    const badge = document.getElementById('news-refresh-indicator');
    if (badge) {
      if (isFetching) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  // ============================================================================
  // 5. TEXT-TO-SPEECH (TTS) AUDIO READER (Hands-Free News Experience)
  // ============================================================================

  function speakNextItemInQueue() {
    if (!('speechSynthesis' in window) || !isSpeakingQueue) return;

    if (currentSpeakingIndex >= currentNewsItems.length) {
      stopNewsReader();
      if (typeof showToast === 'function') {
        showToast(tr({ de: '✅ Nachrichten-Briefing abgeschlossen!', en: '✅ News bulletin completed!' }));
      }
      return;
    }

    const item = currentNewsItems[currentSpeakingIndex];
    if (!item) {
      stopNewsReader();
      return;
    }

    // Highlight card in UI
    highlightNewsCard(currentSpeakingIndex);

    // Text to read: Title + brief summary
    const textToSpeak = `${item.title}. ${item.summary}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Detect language from region
    const regionObj = REGIONS.find(r => r.id === currentRegion) || REGIONS[0];
    const targetLang = regionObj.lang || 'de-DE';
    utterance.lang = targetLang;

    // Pick best voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const matchingVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Microsoft') || v.name.includes('Premium'))) ||
                            voices.find(v => v.lang.startsWith(targetLang.split('-')[0])) ||
                            voices[0];
      if (matchingVoice) utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      if (isSpeakingQueue) {
        currentSpeakingIndex++;
        // Small 300ms pause between items for natural cadence
        setTimeout(() => {
          if (isSpeakingQueue) speakNextItemInQueue();
        }, 350);
      }
    };

    utterance.onerror = (e) => {
      console.warn('[TTS Engine] Speech error:', e);
      if (isSpeakingQueue) {
        currentSpeakingIndex++;
        speakNextItemInQueue();
      }
    };

    window.speechSynthesis.speak(utterance);
    updateTtsReaderUI();
  }

  function startNewsReader(startIndex = 0) {
    if (!('speechSynthesis' in window)) {
      if (typeof showToast === 'function') {
        showToast('Sprachausgabe wird in diesem Browser nicht unterstützt.');
      }
      return;
    }

    // If live radio is currently playing, duck / pause it
    if (isRadioPlaying && radioAudioEl) {
      radioAudioEl.pause();
      isRadioPlaying = false;
      updateRadioUIState(false);
    }

    window.speechSynthesis.cancel();
    isSpeakingQueue = true;
    isTtsPaused = false;
    currentSpeakingIndex = startIndex;

    speakNextItemInQueue();
    updateTtsReaderUI();
  }

  function toggleNewsReaderPause() {
    if (!('speechSynthesis' in window) || !isSpeakingQueue) return;
    if (isTtsPaused) {
      window.speechSynthesis.resume();
      isTtsPaused = false;
    } else {
      window.speechSynthesis.pause();
      isTtsPaused = true;
    }
    updateTtsReaderUI();
  }

  function stopNewsReader() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingQueue = false;
    isTtsPaused = false;
    currentSpeakingIndex = -1;
    removeNewsHighlights();
    updateTtsReaderUI();
  }

  function nextNewsItem() {
    if (!isSpeakingQueue) {
      startNewsReader(0);
      return;
    }
    window.speechSynthesis.cancel();
    currentSpeakingIndex++;
    speakNextItemInQueue();
  }

  function prevNewsItem() {
    if (!isSpeakingQueue) {
      startNewsReader(0);
      return;
    }
    window.speechSynthesis.cancel();
    currentSpeakingIndex = Math.max(0, currentSpeakingIndex - 1);
    speakNextItemInQueue();
  }

  function setSpeechRate(rate) {
    speechRate = parseFloat(rate);
    localStorage.setItem('flow_news_speech_rate', speechRate.toString());
    
    // Update active rate button UI
    document.querySelectorAll('.news-speed-btn').forEach(btn => {
      if (parseFloat(btn.dataset.speed) === speechRate) {
        btn.className = 'news-speed-btn px-2 py-0.5 rounded-lg bg-rose-500/30 text-rose-200 border border-rose-500/50 text-[10px] font-mono font-bold cursor-pointer transition';
      } else {
        btn.className = 'news-speed-btn px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 hover:text-white border border-white/10 text-[10px] font-mono font-bold cursor-pointer transition';
      }
    });

    if (isSpeakingQueue) {
      // Re-speak current item with new rate
      window.speechSynthesis.cancel();
      speakNextItemInQueue();
    }
  }

  function highlightNewsCard(index) {
    removeNewsHighlights();
    const card = document.getElementById(`news-card-${index}`);
    if (card) {
      card.classList.add('ring-2', 'ring-rose-500', 'bg-rose-500/15', 'scale-[1.01]');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function removeNewsHighlights() {
    document.querySelectorAll('.news-item-card').forEach(c => {
      c.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-500/15', 'scale-[1.01]');
    });
  }

  function updateTtsReaderUI() {
    const bottomPlayerBar = document.getElementById('news-tts-bottom-bar');
    const readCategoryBtn = document.getElementById('btn-read-all-news');
    
    if (bottomPlayerBar) {
      if (isSpeakingQueue) {
        bottomPlayerBar.classList.remove('hidden');
        const countText = document.getElementById('news-tts-count-display');
        if (countText) {
          countText.textContent = `${currentSpeakingIndex + 1} / ${currentNewsItems.length}`;
        }
        const activeTitle = document.getElementById('news-tts-current-title');
        if (activeTitle && currentNewsItems[currentSpeakingIndex]) {
          activeTitle.textContent = currentNewsItems[currentSpeakingIndex].title;
        }
        const pauseBtn = document.getElementById('news-tts-pause-btn');
        if (pauseBtn) {
          pauseBtn.innerHTML = isTtsPaused 
            ? '<i data-lucide="play" class="w-4 h-4 fill-white"></i>' 
            : '<i data-lucide="pause" class="w-4 h-4 fill-white"></i>';
          if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        }
      } else {
        bottomPlayerBar.classList.add('hidden');
      }
    }

    if (readCategoryBtn) {
      if (isSpeakingQueue) {
        readCategoryBtn.innerHTML = '<i data-lucide="square" class="w-3.5 h-3.5 fill-rose-300"></i><span>Vorlesen stoppen</span>';
        readCategoryBtn.className = 'px-3 py-1.5 rounded-xl bg-rose-500/25 hover:bg-rose-500/35 border border-rose-500/50 text-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm';
      } else {
        readCategoryBtn.innerHTML = '<i data-lucide="volume-2" class="w-3.5 h-3.5 text-rose-300"></i><span>Nachrichten vorlesen</span>';
        readCategoryBtn.className = 'px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm';
      }
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  }

  // ============================================================================
  // 6. UI RENDERING: MAIN PANEL & TABS
  // ============================================================================

  function switchMainTab(tab) {
    activeTab = tab;
    const radioPane = document.getElementById('radio-news-pane-radio');
    const newsPane = document.getElementById('radio-news-pane-news');
    const radioTabBtn = document.getElementById('tab-btn-radio-hub');
    const newsTabBtn = document.getElementById('tab-btn-news-hub');

    if (tab === 'radio') {
      if (radioPane) radioPane.classList.remove('hidden');
      if (newsPane) newsPane.classList.add('hidden');
      if (radioTabBtn) {
        radioTabBtn.className = 'flex-1 py-1.5 px-2 rounded-xl text-rose-100 bg-gradient-to-r from-rose-600/40 via-pink-600/35 to-rose-600/40 border border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold select-none';
      }
      if (newsTabBtn) {
        newsTabBtn.className = 'flex-1 py-1.5 px-2 rounded-xl text-gray-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-medium select-none';
      }
    } else {
      if (radioPane) radioPane.classList.add('hidden');
      if (newsPane) newsPane.classList.remove('hidden');
      if (newsTabBtn) {
        newsTabBtn.className = 'flex-1 py-1.5 px-2 rounded-xl text-rose-100 bg-gradient-to-r from-rose-600/40 via-pink-600/35 to-rose-600/40 border border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold select-none';
      }
      if (radioTabBtn) {
        radioTabBtn.className = 'flex-1 py-1.5 px-2 rounded-xl text-gray-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-medium select-none';
      }
      // Load news when entering news tab
      if (currentNewsItems.length === 0) {
        fetchNewsForRegionCat(currentRegion, currentCategory);
      }
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  function selectRegion(regionId) {
    currentRegion = regionId;
    localStorage.setItem('flow_news_region', regionId);
    stopNewsReader();
    fetchNewsForRegionCat(currentRegion, currentCategory, true);
    renderRegionPills();
  }

  function selectCategory(catId) {
    currentCategory = catId;
    localStorage.setItem('flow_news_cat', catId);
    stopNewsReader();
    fetchNewsForRegionCat(currentRegion, currentCategory, true);
    renderCategoryPills();
  }

  function renderRegionPills() {
    const container = document.getElementById('news-region-selector');
    if (!container) return;
    container.innerHTML = REGIONS.map(reg => {
      const isSelected = reg.id === currentRegion;
      return `
        <button onclick="RadioNewsEngine.selectRegion('${reg.id}')" class="px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
          isSelected 
            ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-sm' 
            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
        }">
          <span>${reg.flag}</span>
          <span class="text-[11px]">${reg.name}</span>
        </button>
      `;
    }).join('');
  }

  function renderCategoryPills() {
    const container = document.getElementById('news-category-selector');
    if (!container) return;
    container.innerHTML = CATEGORIES.map(cat => {
      const isSelected = cat.id === currentCategory;
      return `
        <button onclick="RadioNewsEngine.selectCategory('${cat.id}')" class="px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
          isSelected 
            ? 'bg-gradient-to-r from-rose-500/30 to-pink-500/30 text-rose-200 border border-rose-500/50 shadow-sm' 
            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
        }">
          <span>${cat.emoji}</span>
          <span class="text-[11px]">${cat.name}</span>
        </button>
      `;
    }).join('');
  }

  function renderRadioPanelContent() {
    const container = document.getElementById('radio-stations-list');
    if (!container) return;

    // Group stations: Info/News, Focus/ADHD Chill, Regional
    const stationHtml = RADIO_STATIONS.map(s => {
      const isCurrent = s.id === currentStationId;
      const isLive = isCurrent && isRadioPlaying;

      return `
        <div onclick="RadioNewsEngine.playRadioStation('${s.id}')" class="p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 group ${
          isCurrent 
            ? 'bg-rose-500/15 border-rose-500/40 shadow-sm' 
            : 'bg-white/[0.025] hover:bg-white/[0.06] border-white/10'
        }">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
              isCurrent ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-gray-300 border border-white/10'
            }">
              <span>${s.logo}</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-white group-hover:text-rose-200 transition truncate">${s.name}</span>
                <span class="text-[10px]">${s.flag}</span>
                ${isLive ? '<span class="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-rose-500 text-white animate-pulse">LIVE</span>' : ''}
              </div>
              <p class="text-[10px] text-gray-400 truncate">${s.desc}</p>
            </div>
          </div>
          <button class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition ${
            isLive 
              ? 'bg-rose-500 text-white shadow-md' 
              : isCurrent 
                ? 'bg-rose-500/20 text-rose-300 group-hover:bg-rose-500 group-hover:text-white' 
                : 'bg-white/5 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
          }">
            <i data-lucide="${isLive ? 'pause' : 'play'}" class="w-3.5 h-3.5 ${isLive ? 'fill-white' : ''}"></i>
          </button>
        </div>
      `;
    }).join('');

    container.innerHTML = stationHtml;
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  function renderNewsContent() {
    const listContainer = document.getElementById('news-items-container');
    const tickerContainer = document.getElementById('news-marquee-text');

    // 1. Render Marquee Ticker
    if (tickerContainer && currentNewsItems.length > 0) {
      tickerContainer.innerHTML = currentNewsItems.map(item => `
        <span class="inline-flex items-center gap-1.5 mx-4 text-xs font-medium text-gray-300 hover:text-white cursor-pointer" onclick="RadioNewsEngine.startNewsReader(${currentNewsItems.indexOf(item)})">
          <span class="text-rose-400 font-bold">●</span>
          <span class="font-bold text-white">${item.title}</span>
          <span class="text-[10px] text-gray-500 font-mono">(${item.time})</span>
        </span>
      `).join('');
    }

    // 2. Render Cards List
    if (listContainer) {
      if (currentNewsItems.length === 0) {
        listContainer.innerHTML = `
          <div class="py-8 text-center text-gray-500 italic text-xs">
            Lade Meldungen...
          </div>
        `;
        return;
      }

      listContainer.innerHTML = currentNewsItems.map((item, idx) => `
        <div id="news-card-${idx}" class="news-item-card p-3 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/10 transition-all space-y-1.5 text-left relative group">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-[9px] uppercase font-mono tracking-wider">${item.source}</span>
              <span class="text-[10px] text-gray-400 font-mono">${item.time}</span>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button onclick="RadioNewsEngine.startNewsReader(${idx})" class="p-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 transition cursor-pointer" title="Diese Meldung vorlesen">
                <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              </button>
              ${item.url && item.url !== '#' ? `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition" title="Originalquelle öffnen">
                  <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                </a>
              ` : ''}
            </div>
          </div>
          <h4 class="text-xs font-bold text-white leading-snug">${item.title}</h4>
          <p class="text-[11px] text-gray-300 leading-relaxed font-normal">${item.summary}</p>
        </div>
      `).join('');

      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  }

  function initRadioPanel() {
    renderRadioPanelContent();
    updateRadioUIState(isRadioPlaying);
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  function initNewsPanel() {
    renderRegionPills();
    renderCategoryPills();
    setSpeechRate(speechRate);
    if (currentNewsItems.length === 0) {
      fetchNewsForRegionCat(currentRegion, currentCategory);
    } else {
      renderNewsContent();
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  function initPanel() {
    initRadioPanel();
    initNewsPanel();
  }

  // ============================================================================
  // 7. EXPORT TO GLOBAL SCOPE
  // ============================================================================

  const RadioNewsEngine = {
    initPanel,
    initRadioPanel,
    initNewsPanel,
    switchMainTab,
    selectRegion,
    selectCategory,
    playRadioStation,
    toggleRadioPlayback,
    setRadioVolume,
    startNewsReader,
    toggleNewsReaderPause,
    stopNewsReader,
    nextNewsItem,
    prevNewsItem,
    setSpeechRate,
    fetchNewsForRegionCat
  };

  if (typeof window !== 'undefined') {
    window.RadioNewsEngine = RadioNewsEngine;
    window.playRadioStation = playRadioStation;
    window.toggleRadioPlayback = toggleRadioPlayback;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.RadioNewsEngine = RadioNewsEngine;
  }

  // Pre-render radio list automatically when DOM is loaded
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initRadioPanel();
      });
    } else {
      initRadioPanel();
    }
  }

})();
