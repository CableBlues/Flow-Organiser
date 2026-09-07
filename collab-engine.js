// collab-engine.js - Real-time Team Collaboration & Live Chat for Noodle Studio (GitHub Pages Safe)
// ============================================================================

const CollabEngine = (function() {
  let activeRoom = 'team-space';
  let realtimeChannel = null;
  let broadcastChannel = null;
  let localUser = null;
  let activeMembers = new Map();
  let chatHistory = [];
  let unreadCount = 0;
  let isChatOpen = false;
  let typingTimer = null;
  let audioContext = null;

  // Farbschema für zufällige Avatar-Farben
  const AVATAR_COLORS = [
    { bg: 'from-purple-600 to-indigo-600', text: '#c084fc', border: 'border-purple-400/50' },
    { bg: 'from-emerald-600 to-teal-600', text: '#34d399', border: 'border-emerald-400/50' },
    { bg: 'from-cyan-600 to-blue-600', text: '#38bdf8', border: 'border-cyan-400/50' },
    { bg: 'from-amber-600 to-orange-600', text: '#fbbf24', border: 'border-amber-400/50' },
    { bg: 'from-rose-600 to-pink-600', text: '#fb7185', border: 'border-rose-400/50' },
    { bg: 'from-violet-600 to-fuchsia-600', text: '#e879f9', border: 'border-fuchsia-400/50' }
  ];

  function getLocalUser() {
    if (localUser) return localUser;

    // 1. Wenn über FlowAuth angemeldet
    if (typeof FlowAuth !== 'undefined' && FlowAuth.isLoggedIn()) {
      const u = FlowAuth.getUser();
      const email = (u && u.email) || 'user@example.com';
      const name = email.split('@')[0];
      const colorIdx = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % AVATAR_COLORS.length;
      localUser = {
        id: (u && u.id) || `user_${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        avatar: name.slice(0, 2).toUpperCase(),
        color: AVATAR_COLORS[colorIdx]
      };
      return localUser;
    }

    // 2. Aus LocalStorage oder Zufall
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('flow_collab_user');
        if (stored) {
          localUser = JSON.parse(stored);
          return localUser;
        }
      }
    } catch (e) {}

    const randomId = 'guest_' + Math.random().toString(36).substring(2, 8);
    const names = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Morgan', 'Casey', 'Robin', 'Charlie'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const colorIdx = Math.floor(Math.random() * AVATAR_COLORS.length);

    localUser = {
      id: randomId,
      name: randomName,
      email: `${randomName.toLowerCase()}@noodle.local`,
      avatar: randomName.slice(0, 2).toUpperCase(),
      color: AVATAR_COLORS[colorIdx]
    };

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('flow_collab_user', JSON.stringify(localUser));
      }
    } catch (e) {}

    return localUser;
  }

  function playSound(type = 'message') {
    try {
      if (typeof window === 'undefined' || !(window.AudioContext || window.webkitAudioContext)) return;
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      const now = audioContext.currentTime;
      if (type === 'message') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'send') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      // Audio optional
    }
  }

  function initRoomFromUrl() {
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room') || urlParams.get('team') || urlParams.get('board');
      if (roomParam) {
        activeRoom = roomParam.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      } else {
        try {
          if (typeof localStorage !== 'undefined') {
            const savedRoom = localStorage.getItem('flow_collab_active_room');
            if (savedRoom) activeRoom = savedRoom;
          }
        } catch (e) {}
      }
    }
  }

  function loadChatHistory() {
    try {
      if (typeof localStorage !== 'undefined') {
        const key = `flow_chat_${activeRoom}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          chatHistory = JSON.parse(raw);
          if (!Array.isArray(chatHistory)) chatHistory = [];
        } else {
          chatHistory = [
            {
              id: 'sys_welcome',
              isSystem: true,
              text: `🎉 Willkommen im Team-Room #${activeRoom}! Teile den Link mit deinen Teammitgliedern.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
      }
    } catch (e) {
      chatHistory = [];
    }
  }

  function saveChatHistory() {
    try {
      if (typeof localStorage !== 'undefined') {
        const key = `flow_chat_${activeRoom}`;
        localStorage.setItem(key, JSON.stringify(chatHistory.slice(-100)));
      }
    } catch (e) {}
  }

  // ==========================================================================
  // REALTIME VERBINDUNG (Supabase Channels & Local Broadcast Fallback)
  // ==========================================================================
  function connect() {
    initRoomFromUrl();
    loadChatHistory();
    const user = getLocalUser();

    // 1. BroadcastChannel (Lokale Multi-Tab Kommunikation)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        if (broadcastChannel) broadcastChannel.close();
        broadcastChannel = new BroadcastChannel(`noodle_collab_${activeRoom}`);
        broadcastChannel.onmessage = (event) => {
          handleIncomingEvent(event.data);
        };
      } catch (e) {
        console.warn('[CollabEngine] BroadcastChannel error:', e);
      }
    }

    // 2. Supabase Realtime Channel (Globales Live-WebSockets)
    if (typeof FlowAuth !== 'undefined' && FlowAuth.getSupabaseClient) {
      const supa = FlowAuth.getSupabaseClient();
      if (supa && typeof supa.channel === 'function') {
        try {
          if (realtimeChannel) {
            supa.removeChannel(realtimeChannel);
          }

          realtimeChannel = supa.channel(`room_${activeRoom}`, {
            config: {
              broadcast: { self: false },
              presence: { key: user.id }
            }
          });

          // A. Broadcast Nachricht empfangen
          realtimeChannel.on('broadcast', { event: 'collab_event' }, ({ payload }) => {
            handleIncomingEvent(payload);
          });

          // B. Presence Tracking (Aktive Teammitglieder)
          realtimeChannel.on('presence', { event: 'sync' }, () => {
            const state = realtimeChannel.presenceState();
            activeMembers.clear();
            activeMembers.set(user.id, { ...user, isSelf: true, onlineAt: Date.now() });

            for (const key in state) {
              const presences = state[key];
              if (Array.isArray(presences) && presences.length > 0) {
                const p = presences[0];
                if (p && p.user && p.user.id !== user.id) {
                  activeMembers.set(p.user.id, { ...p.user, isSelf: false, onlineAt: Date.now() });
                }
              }
            }
            renderPresenceUI();
          });

          realtimeChannel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await realtimeChannel.track({
                user: user,
                online_at: new Date().toISOString()
              });
            }
          });
        } catch (err) {
          console.warn('[CollabEngine] Supabase Realtime setup warning:', err);
        }
      }
    }

    activeMembers.set(user.id, { ...user, isSelf: true, onlineAt: Date.now() });
    renderPresenceUI();
    renderChatMessages();
  }

  // ==========================================================================
  // EVENT-HANDLING (Chat, Reaktionen, Board-Aktionen)
  // ==========================================================================
  function handleIncomingEvent(event) {
    if (!event || !event.type) return;

    const myUser = getLocalUser();
    if (event.sender && event.sender.id === myUser.id) return;

    switch (event.type) {
      case 'chat_message':
        chatHistory.push(event.message);
        saveChatHistory();
        renderChatMessages();
        if (!isChatOpen) {
          unreadCount++;
          updateUnreadBadge();
          playSound('message');
          if (typeof showToast === 'function') {
            showToast(`💬 ${event.sender.name}: ${event.message.text.substring(0, 40)}`);
          }
        } else {
          playSound('message');
        }
        break;

      case 'board_action':
        if (event.actionText) {
          const sysMsg = {
            id: `sys_${Date.now()}`,
            isSystem: true,
            text: `📌 ${event.sender.name} ${event.actionText}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          chatHistory.push(sysMsg);
          saveChatHistory();
          renderChatMessages();

          if (typeof showToast === 'function') {
            showToast(`⚡ ${event.sender.name} ${event.actionText}`);
          }
        }
        if (typeof cloudSyncEngine !== 'undefined' && FlowAuth.isLoggedIn()) {
          cloudSyncEngine.pullState();
        }
        break;

      case 'reaction':
        if (event.messageId && event.emoji) {
          const target = chatHistory.find(m => m.id === event.messageId);
          if (target) {
            target.reactions = target.reactions || {};
            target.reactions[event.emoji] = (target.reactions[event.emoji] || 0) + 1;
            saveChatHistory();
            renderChatMessages();
          }
        }
        break;

      case 'typing':
        showTypingIndicator(event.sender.name);
        break;
    }
  }

  function broadcastEvent(payload) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage(payload);
      } catch (e) {}
    }

    if (realtimeChannel && typeof realtimeChannel.send === 'function') {
      try {
        realtimeChannel.send({
          type: 'broadcast',
          event: 'collab_event',
          payload: payload
        });
      } catch (e) {}
    }
  }

  // ==========================================================================
  // PUBLIC ACTIONS (Nachricht senden, Raum wechseln, Board-Event broadcasten)
  // ==========================================================================
  function sendMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();
    const user = getLocalUser();

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sender: user,
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };

    chatHistory.push(newMsg);
    saveChatHistory();
    renderChatMessages();
    playSound('send');

    broadcastEvent({
      type: 'chat_message',
      sender: user,
      message: newMsg
    });
  }

  function broadcastBoardEvent(actionText) {
    const user = getLocalUser();
    const sysMsg = {
      id: `sys_${Date.now()}`,
      isSystem: true,
      text: `📌 Du ${actionText}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chatHistory.push(sysMsg);
    saveChatHistory();
    renderChatMessages();

    broadcastEvent({
      type: 'board_action',
      sender: user,
      actionText: actionText
    });
  }

  function addReaction(messageId, emoji) {
    const msg = chatHistory.find(m => m.id === messageId);
    if (!msg) return;

    msg.reactions = msg.reactions || {};
    msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
    saveChatHistory();
    renderChatMessages();

    const user = getLocalUser();
    broadcastEvent({
      type: 'reaction',
      sender: user,
      messageId: messageId,
      emoji: emoji
    });
  }

  function sendTyping() {
    const user = getLocalUser();
    broadcastEvent({
      type: 'typing',
      sender: user
    });
  }

  function setRoom(newRoom) {
    if (!newRoom || !newRoom.trim()) return;
    const clean = newRoom.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (clean === activeRoom) return;

    activeRoom = clean;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('flow_collab_active_room', clean);
      }
      if (typeof window !== 'undefined' && window.history) {
        const url = new URL(window.location);
        url.searchParams.set('room', clean);
        window.history.replaceState({}, '', url);
      }
    } catch (e) {}

    connect();
    if (typeof showToast === 'function') {
      showToast(`🚀 Raum gewechselt: #${clean}`);
    }
  }

  function getShareLink() {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('room', activeRoom);
    return url.toString();
  }

  function copyShareLink() {
    const link = getShareLink();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        if (typeof showToast === 'function') {
          showToast('✓ Team-Link in Zwischenablage kopiert! 📋');
        }
      });
    } else {
      prompt('Kopiere diesen Team-Link:', link);
    }
  }

  // ==========================================================================
  // UI RENDERING & INTERACTION
  // ==========================================================================
  function renderPresenceUI() {
    const container = document.getElementById('header-collab-avatars');
    const memberCountLabel = document.getElementById('collab-member-count');
    const roomTitleDisplay = document.getElementById('collab-current-room-name');

    if (roomTitleDisplay) {
      roomTitleDisplay.innerText = `#${activeRoom}`;
    }

    if (memberCountLabel) {
      const count = activeMembers.size || 1;
      memberCountLabel.innerText = `${count} online`;
    }

    if (!container) return;

    const members = Array.from(activeMembers.values()).slice(0, 4);
    let html = '';

    members.forEach((m, idx) => {
      const col = m.color || AVATAR_COLORS[0];
      const zIndex = 10 - idx;
      html += `
        <div class="relative -ml-1.5 first:ml-0 rounded-full border-2 border-[#12121a] shadow-sm cursor-pointer group" style="z-index: ${zIndex};" title="${m.name} (${m.isSelf ? 'Du' : 'Online'})">
          <div class="w-6 h-6 rounded-full bg-gradient-to-tr ${col.bg} flex items-center justify-center text-[9px] font-black text-white uppercase select-none">
            ${m.avatar || m.name.slice(0, 2)}
          </div>
          <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse"></span>
        </div>
      `;
    });

    if (activeMembers.size > 4) {
      html += `
        <div class="relative -ml-1.5 rounded-full border-2 border-[#12121a] bg-zinc-800 w-6 h-6 flex items-center justify-center text-[9px] font-bold text-gray-300 shadow-sm" style="z-index: 5;">
          +${activeMembers.size - 4}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  function renderChatMessages() {
    const container = document.getElementById('collab-chat-messages-container');
    if (!container) return;

    const myUser = getLocalUser();

    if (chatHistory.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center text-gray-400 py-8 space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 text-xl">
            💬
          </div>
          <p class="text-xs font-bold text-white">Noch keine Nachrichten</p>
          <p class="text-[10px] text-gray-400 max-w-[200px]">Schreibe eine Nachricht an dein Team oder teile den Link.</p>
        </div>
      `;
      return;
    }

    let html = '';
    chatHistory.forEach((msg) => {
      if (msg.isSystem) {
        html += `
          <div class="flex justify-center my-1.5">
            <div class="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-purple-200 font-mono flex items-center gap-1.5 max-w-[90%] text-center">
              <span>${escapeHtml(msg.text)}</span>
              <span class="text-[8px] text-gray-400 font-mono">${escapeHtml(msg.time || '')}</span>
            </div>
          </div>
        `;
      } else {
        const isSelf = (msg.sender && msg.sender.id === myUser.id);
        const col = (msg.sender && msg.sender.color) || AVATAR_COLORS[0];
        const safeMsgId = escapeHtml(msg.id || '');
        const senderName = isSelf ? 'Du' : escapeHtml((msg.sender && msg.sender.name) || 'Teammate');
        const safeAvatar = escapeHtml((msg.sender && msg.sender.avatar) || 'U');
        const safeTime = escapeHtml(msg.time || '');

        let reactionsHtml = '';
        if (msg.reactions && Object.keys(msg.reactions).length > 0) {
          reactionsHtml = '<div class="flex flex-wrap gap-1 mt-1">';
          for (const [em, count] of Object.entries(msg.reactions)) {
            const safeEm = escapeHtml(em);
            reactionsHtml += `
              <button onclick="CollabEngine.addReaction('${safeMsgId}', '${safeEm}')" class="px-1.5 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] flex items-center gap-1 hover:border-purple-400 transition cursor-pointer">
                <span>${safeEm}</span>
                <span class="text-[9px] font-bold text-gray-300">${Number(count) || 0}</span>
              </button>
            `;
          }
          reactionsHtml += '</div>';
        }

        html += `
          <div class="flex gap-2 my-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'} group">
            <div class="w-7 h-7 rounded-full bg-gradient-to-tr ${col.bg} flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm self-end mb-1">
              ${safeAvatar}
            </div>

            <div class="flex flex-col max-w-[78%] ${isSelf ? 'items-end' : 'items-start'}">
              <div class="flex items-center gap-1.5 px-1 mb-0.5 text-[9px] text-gray-400 font-mono">
                <span class="font-bold ${isSelf ? 'text-purple-300' : 'text-gray-300'}">${senderName}</span>
                <span>${safeTime}</span>
              </div>

              <div class="relative p-2.5 rounded-2xl text-xs leading-relaxed ${isSelf ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-xs shadow-md' : 'bg-[#181824] border border-white/10 text-gray-100 rounded-bl-xs shadow-sm'}">
                <p class="break-words select-text">${escapeHtml(msg.text)}</p>

                <!-- Quick Reaction Hover Toolbar -->
                <div class="hidden group-hover:flex items-center gap-1 absolute ${isSelf ? 'left-0 -top-6' : 'right-0 -top-6'} bg-[#101018] border border-white/15 px-1.5 py-0.5 rounded-full shadow-lg z-10 animate-fade-in">
                  <button onclick="CollabEngine.addReaction('${safeMsgId}', '👍')" class="hover:scale-125 transition-transform text-xs cursor-pointer">👍</button>
                  <button onclick="CollabEngine.addReaction('${safeMsgId}', '❤️')" class="hover:scale-125 transition-transform text-xs cursor-pointer">❤️</button>
                  <button onclick="CollabEngine.addReaction('${safeMsgId}', '🚀')" class="hover:scale-125 transition-transform text-xs cursor-pointer">🚀</button>
                  <button onclick="CollabEngine.addReaction('${safeMsgId}', '🎯')" class="hover:scale-125 transition-transform text-xs cursor-pointer">🎯</button>
                </div>
              </div>

              ${reactionsHtml}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }

  function escapeHtml(str) {
    if (typeof window !== 'undefined' && typeof window.escapeHtml === 'function') {
      return window.escapeHtml(str);
    }
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/`/g, '&#96;');
  }

  function showTypingIndicator(name) {
    const indicator = document.getElementById('collab-typing-indicator');
    if (!indicator) return;

    indicator.innerText = `✍️ ${name} schreibt...`;
    indicator.classList.remove('hidden');

    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      indicator.classList.add('hidden');
    }, 2500);
  }

  function updateUnreadBadge() {
    const badge = document.getElementById('collab-unread-badge');
    const headerBadge = document.getElementById('header-collab-unread-badge');

    if (unreadCount > 0) {
      if (badge) {
        badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
        badge.classList.remove('hidden');
      }
      if (headerBadge) {
        headerBadge.innerText = unreadCount > 9 ? '9+' : unreadCount;
        headerBadge.classList.remove('hidden');
      }
    } else {
      if (badge) badge.classList.add('hidden');
      if (headerBadge) headerBadge.classList.add('hidden');
    }
  }

  function toggleChat() {
    const panel = document.getElementById('panel-collab-chat');
    if (!panel) return;

    isChatOpen = !panel.classList.contains('hidden');
    if (isChatOpen) {
      panel.classList.add('hidden');
      isChatOpen = false;
    } else {
      panel.classList.remove('hidden');
      isChatOpen = true;
      unreadCount = 0;
      updateUnreadBadge();
      renderChatMessages();

      const input = document.getElementById('collab-chat-input');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function openRoomModal() {
    const newRoom = prompt('Gib den Namen oder die ID des Team-Rooms ein:', activeRoom);
    if (newRoom && newRoom.trim()) {
      setRoom(newRoom);
    }
  }

  function init() {
    connect();
  }

  return {
    init,
    connect,
    getLocalUser,
    sendMessage,
    broadcastBoardEvent,
    addReaction,
    sendTyping,
    setRoom,
    getRoom: () => activeRoom,
    getShareLink,
    copyShareLink,
    toggleChat,
    openRoomModal,
    renderChatMessages,
    renderPresenceUI
  };
})();

if (typeof window !== 'undefined') {
  window.CollabEngine = CollabEngine;
  window.toggleCollabChat = () => CollabEngine.toggleChat();
  window.addEventListener('DOMContentLoaded', () => {
    CollabEngine.init();
  });
}
if (typeof globalThis !== 'undefined') {
  globalThis.CollabEngine = CollabEngine;
}
