function getCookingState() {
  if (!state.cooking) state.cooking = createDefaultCookingState();
  return state.cooking;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addCookingIngredient(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  const cooking = getCookingState();
  const normalized = text.toLowerCase();
  const exists = (cooking.pantryItems || []).some(item => String(item).trim().toLowerCase() === normalized);
  if (exists) return false;
  if (!Array.isArray(cooking.pantryItems)) cooking.pantryItems = [];
  cooking.pantryItems.push(text);
  saveState();
  return true;
}

function removeCookingIngredient(index) {
  const cooking = getCookingState();
  if (!Array.isArray(cooking.pantryItems) || index < 0 || index >= cooking.pantryItems.length) return;
  cooking.pantryItems.splice(index, 1);
  saveState();
  suggestCookingRecipe();
}

function buildDynamicRecipeFromPantry(pantry) {
  const items = pantry.map(i => i.trim().toLowerCase()).filter(Boolean);
  if (items.length === 0) return null;

  const carbs = items.filter(i => /(pasta|nudel|reis|kartoffel|brot|wrap|toast|fladen|grieß|hafer|baguette)/i.test(i));
  const proteins = items.filter(i => /(hähnchen|huhn|fleisch|rind|schwein|fisch|lachs|tuna|thunfisch|ei|tofu|bohnen|linsen|kichererbsen|quark)/i.test(i));
  const veggies = items.filter(i => /(tomate|gurke|paprika|zucchini|aubergine|spinat|pilz|champignon|zwiebel|knoblauch|karotte|möhre|brokkoli)/i.test(i));
  const dairy = items.filter(i => /(käse|feta|parmesan|mozzarella|butter|sahne|joghurt|frischkäse|schmand)/i.test(i));

  let title = "Kreative Restepfanne";
  let steps = [];
  let duration = "15 Min";

  const primaryCarb = carbs[0] || null;
  const primaryProtein = proteins[0] || null;
  const primaryVeggie = veggies[0] || null;
  const primaryDairy = dairy[0] || null;

  if (primaryCarb && primaryProtein && primaryVeggie) {
    title = `Herzhafte ${capitalize(primaryCarb)}-Pfanne mit ${capitalize(primaryProtein)} und ${capitalize(primaryVeggie)}`;
  } else if (primaryCarb && primaryDairy) {
    title = `Cremiges ${capitalize(primaryCarb)}-Gericht mit geschmolzenem ${capitalize(primaryDairy)}`;
  } else if (primaryProtein && primaryVeggie) {
    title = `Pfannengerührtes ${capitalize(primaryProtein)} mit frischem ${capitalize(primaryVeggie)}`;
  } else if (primaryCarb && primaryVeggie) {
    title = `${capitalize(primaryCarb)} mit gedünstetem ${capitalize(primaryVeggie)}`;
  } else if (primaryProtein && primaryDairy) {
    title = `Herzhaftes ${capitalize(primaryProtein)} überbacken mit ${capitalize(primaryDairy)}`;
  } else if (primaryProtein) {
    title = `Schnelles Protein-Gericht (${capitalize(primaryProtein)})`;
  } else if (primaryCarb) {
    title = `Sättigende ${capitalize(primaryCarb)}-Kreation`;
  } else if (primaryVeggie) {
    title = `Bunte ${capitalize(primaryVeggie)}-Pfanne`;
  } else {
    title = `Zutaten-Kombination: ${items.map(capitalize).join(' & ')}`;
  }

  steps.push("Vorbereitung: Reinige deine Arbeitsfläche und wasche frische Zutaten gründlich ab.");

  let prepIngredients = [...veggies, ...proteins].filter(i => !/(ei|linsen|bohnen)/i.test(i));
  if (prepIngredients.length > 0) {
    steps.push(`Schneide ${prepIngredients.map(i => `${capitalize(i)}`).join(', ')} in gleichmäßige, mundgerechte Stücke.`);
  }

  if (primaryCarb) {
    if (/(pasta|nudel|reis|grieß|linsen)/i.test(primaryCarb)) {
      steps.push(`Bringe gesalzenes Wasser zum Kochen und bereite ${capitalize(primaryCarb)} bissfest nach Packungsanleitung zu.`);
    } else if (/(kartoffel)/i.test(primaryCarb)) {
      steps.push(`Vorkoche die ${capitalize(primaryCarb)} kurz oder brate sie direkt in feinen Spalten mit etwas Öl goldgelb an.`);
    } else if (/(brot|wrap|toast|fladen|baguette)/i.test(primaryCarb)) {
      steps.push(`Erwärme ${capitalize(primaryCarb)} kurz in einer trockenen Pfanne oder im Toaster für das beste Aroma.`);
    }
  }

  let panItems = [...proteins, ...veggies].filter(i => !/(pasta|nudel|reis|brot|wrap|toast|fladen|baguette)/i.test(i));
  if (panItems.length > 0) {
    let verb = proteins.length > 0 ? "Brate zuerst die Proteinquelle scharf an und füge kurz darauf das Gemüse hinzu" : "Dünste das Gemüse mit etwas gutem Öl in einer heißen Pfanne an";
    steps.push(`${verb} (${panItems.map(capitalize).join(', ')}).`);
  }

  if (primaryCarb && panItems.length > 0) {
    steps.push(`Vermenge das Gekochte (${capitalize(primaryCarb)}) direkt in der warmen Pfanne mit den übrigen Zutaten.`);
  }

  if (primaryDairy) {
    steps.push(`Füge ${capitalize(primaryDairy)} hinzu. Lasse ihn kurz mitschmelzen oder ziehe ihn sanft unter die heiße Masse.`);
  }

  steps.push("Abschluss: Schmecke dein Gericht mit Salz, Pfeffer und Kräutern ab. Frisch servieren!");

  return {
    id: 'dynamic-generated',
    title,
    duration,
    ingredients: items.map(capitalize),
    steps
  };
}

function suggestCookingRecipe() {
  const cooking = getCookingState();
  const pantry = (cooking.pantryItems || []).map(item => String(item).trim().toLowerCase()).filter(Boolean);
  const recipes = Array.isArray(cooking.recipes) && cooking.recipes.length ? cooking.recipes : createDefaultCookingState().recipes;

  cooking.activeRecipe = null;
  cooking.activeRecipeId = null;

  if (!pantry.length) {
    saveState();
    return null;
  }

  const ranked = recipes.map(recipe => {
    let score = 0;
    let directMatches = 0;
    const recipeIngredients = (recipe.ingredients || []).map(item => String(item).trim().toLowerCase());
    
    recipeIngredients.forEach(ingredient => {
      if (pantry.includes(ingredient)) {
        score += 10;
        directMatches += 1;
      } else if (pantry.some(item => item.includes(ingredient) || ingredient.includes(item))) {
        score += 4;
      }
    });
    
    return { ...recipe, score, directMatches, recipeIngredients };
  }).sort((a, b) => b.score - a.score);

  const bestPredefined = ranked[0];
  const best = (bestPredefined && bestPredefined.directMatches >= 2) ? bestPredefined : buildDynamicRecipeFromPantry(pantry);

  if (best) {
    cooking.activeRecipeId = best.id;
    cooking.activeRecipe = best;
  }
  
  saveState();
  return best;
}

function handleCookingAddIngredient() {
  const input = document.getElementById('cooking-ingredient-input');
  if (!input) return;
  const added = addCookingIngredient(input.value);
  if (added) {
    input.value = '';
    suggestCookingRecipe();
    renderCookingPanel(true);
    if (typeof playProceduralSound === 'function') playProceduralSound(3);
  }
}

function handleQuickAddStaple(name) {
  const added = addCookingIngredient(name);
  if (added) {
    suggestCookingRecipe();
    renderCookingPanel(true);
    if (typeof playProceduralSound === 'function') playProceduralSound(3);
  }
}

function handleCookingSuggest() {
  const recipe = suggestCookingRecipe();
  if (recipe) {
    renderCookingPanel(true);
    if (typeof playProceduralSound === 'function') playProceduralSound(0);
  }
}

function toggleCookingStepCheckbox(stepIndex) {
  if (typeof playProceduralSound === 'function') playProceduralSound(6);
  const checkbox = document.getElementById(`cook-step-${stepIndex}`);
  const label = document.getElementById(`cook-step-label-${stepIndex}`);
  if (checkbox && label) {
    if (checkbox.checked) {
      label.classList.add('line-through', 'text-gray-500', 'opacity-60');
    } else {
      label.classList.remove('line-through', 'text-gray-500', 'opacity-60');
    }
  }
}

function renderCookingPanel(skipLucide = false) {
  const panel = document.getElementById('panel-cooking');
  if (!panel) return;

  panel.style.width = "380px";
  panel.style.maxWidth = "95vw";

  const cooking = getCookingState();
  const activeRecipe = cooking.activeRecipe;
  const pantry = cooking.pantryItems || [];

  const staples = [
    { label: 'Pasta 🍝', val: 'Pasta' },
    { label: 'Reis 🍚', val: 'Reis' },
    { label: 'Ei 🥚', val: 'Eier' },
    { label: 'Käse 🧀', val: 'Käse' },
    { label: 'Hähnchen 🍗', val: 'Hähnchen' },
    { label: 'Tomate 🍅', val: 'Tomaten' },
    { label: 'Zwiebel 🧅', val: 'Zwiebeln' },
    { label: 'Gemüse 🥦', val: 'Gemüse' }
  ];

  panel.innerHTML = `
    <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
      <h4 class="font-bold text-sm font-display text-white flex items-center gap-2">
        <i data-lucide="cooking-pot" class="w-4 h-4 text-orange-400"></i>
        <span data-i18n="cooking">Kochen</span>
      </h4>
      <button onclick="togglePanel('cooking')" class="text-gray-400 hover:text-white text-xs font-bold p-1 cursor-pointer">✕</button>
    </div>

    <div class="space-y-4 pt-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
      
      <div class="flex gap-2">
        <input id="cooking-ingredient-input" type="text" placeholder="${t('cook_add_ingredient_placeholder')}" class="flex-1 min-h-[36px] rounded-xl border border-white/10 bg-[#0a0a0f] px-3 text-xs text-gray-200 placeholder:text-gray-500 outline-none focus:border-orange-500 font-semibold" />
        <button onclick="handleCookingAddIngredient()" class="min-h-[36px] rounded-xl bg-orange-600 px-4 text-xs font-bold text-white transition hover:bg-orange-500 cursor-pointer shadow-md">${t('cook_add_ingredient')}</button>
      </div>

      <div class="space-y-1">
        <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Schnellauswahl</div>
        <div class="flex flex-wrap gap-1.5">
          ${staples.map(s => `
            <button onclick="handleQuickAddStaple('${s.val}')" class="px-2 py-1 bg-white/[0.03] hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 rounded-lg text-[10px] text-gray-300 transition cursor-pointer font-medium hover:scale-105 active:scale-95">
              ${s.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="rounded-2xl border border-white/5 bg-[#0a0a0e]/40 p-3 shadow-inner">
        <div class="mb-2 text-[9px] font-bold uppercase tracking-wider text-gray-400">${t('cook_ingredients')}</div>
        ${pantry.length ? `
          <div class="flex flex-wrap gap-1.5">
            ${pantry.map((item, index) => `
              <span class="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/10 bg-orange-500/5 px-2.5 py-1 text-[11px] text-orange-200 font-semibold">
                ${capitalize(item)}
                <button type="button" onclick="removeCookingIngredient(${index}); renderCookingPanel(true);" class="ml-1 text-orange-400/60 hover:text-red-400 font-bold transition cursor-pointer text-xs">×</button>
              </span>
            `).join('')}
          </div>
        ` : `
          <div class="text-[11px] text-gray-500 italic py-1">${t('cook_pantry_empty')}</div>
        `}
      </div>

      <div class="flex gap-2">
        <button onclick="handleCookingSuggest()" class="flex-1 min-h-[36px] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5">
          <i data-lucide="cooking-pot" class="w-4 h-4"></i>
          <span>${t('cook_suggest')}</span>
        </button>
        <button onclick="resetCookingPantry()" class="px-3 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer">
          Leeren
        </button>
      </div>

      <div class="rounded-2xl border border-orange-500/20 bg-orange-950/5 p-3.5 shadow-inner">
        <div class="mb-2.5 flex items-center justify-between">
          <span class="text-[9px] font-bold uppercase tracking-widest text-orange-400">${t('cook_suggestion_title')}</span>
          ${activeRecipe ? `
            <span class="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 font-bold border border-orange-500/20">${activeRecipe.duration}</span>
          ` : ''}
        </div>

        ${activeRecipe ? `
          <div class="text-sm font-black text-white leading-tight font-display mb-2">${activeRecipe.title}</div>
          
          <div class="mb-3 space-y-1">
            <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Rezept-Zutaten</div>
            <div class="flex flex-wrap gap-1.5 text-[10px]">
              ${(activeRecipe.ingredients || []).map(ing => {
                const normalized = ing.toLowerCase();
                const matched = pantry.some(p => p.toLowerCase().includes(normalized) || normalized.includes(p.toLowerCase()));
                return `
                  <span class="px-2 py-0.5 rounded-md ${matched ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'} font-semibold">
                    ${matched ? '✔️' : '❌'} ${capitalize(ing)}
                  </span>
                `;
              }).join('')}
            </div>
          </div>

          <div class="space-y-1.5 border-t border-white/5 pt-3">
            <div class="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">${t('cook_steps')}</div>
            <div class="space-y-2">
              ${(activeRecipe.steps || []).map((step, idx) => `
                <label class="flex items-start gap-2.5 cursor-pointer select-none group/step">
                  <input type="checkbox" id="cook-step-${idx}" onchange="toggleCookingStepCheckbox(${idx})" class="w-4 h-4 rounded border-white/10 bg-[#0a0a0f] text-orange-500 focus:ring-0 accent-orange-500 shrink-0 mt-0.5 cursor-pointer" />
                  <span id="cook-step-label-${idx}" class="text-[11px] text-gray-300 group-hover/step:text-white leading-normal font-medium transition duration-150">
                    ${step}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="text-xs text-gray-400 italic text-center py-4">Gib deine Zutaten ein, um eine passende Anleitung zu erhalten.</div>
        `}
      </div>

    </div>
  `;

  const input = panel.querySelector('#cooking-ingredient-input');
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCookingAddIngredient();
      }
    };
  }

  if (!skipLucide && typeof lucide !== 'undefined') lucide.createIcons();
}

function resetCookingPantry() {
  const cooking = getCookingState();
  cooking.pantryItems = [];
  cooking.activeRecipeId = null;
  cooking.activeRecipe = null;
  saveState();
  renderCookingPanel(true);
  if (typeof playProceduralSound === 'function') playProceduralSound(11);
}

