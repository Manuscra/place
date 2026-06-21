// --- Eleves page ---
var allClasses = [];

async function loadClassesIntoFilterSelect() {
  const classes = await ClassesApi.list();
  allClasses = classes.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const select = document.getElementById("filter-classe");
  if (!select) return;
  allClasses.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nom;
    select.appendChild(opt);
  });
}

async function loadElevesIntoFilterSelect() {
  const eleves = await ElevesApi.listAll();
  const select = document.getElementById("filter-eleve");
  if (!select) return;
  eleves.sort((a, b) => (a.nom + a.prenom).localeCompare(b.nom + b.prenom, "fr"));
  eleves.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = `${e.nom} ${e.prenom}`;
    select.appendChild(opt);
  });
}

async function loadPrenomsIntoFilterSelect() {
  const select = document.getElementById("filter-prenom");
  if (!select) return;
  const eleves = await ElevesApi.listAll();
  const prenoms = [...new Set(eleves.map(e => e.prenom))].sort((a, b) => a.localeCompare(b, "fr"));
  prenoms.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}

function getActiveFilters() {
  const classeId = parseInt(document.getElementById("filter-classe")?.value) || null;
  const eleveId = parseInt(document.getElementById("filter-eleve")?.value) || null;
  const prenom = document.getElementById("filter-prenom")?.value || null;
  return { classeId, eleveId, prenom };
}

function renderEleveCard(e) {
  return `
    <div class="eleve-card" data-id="${e.id}" data-classe-id="${e.classe_id}">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold text-gray-900">${e.prenom} ${e.nom}</h3>
          <p class="text-sm text-gray-500 eleve-classe">${e.classe_nom || "Sans classe"}</p>
        </div>
        <div class="flex items-center gap-3">
          <label class="present-toggle${e.present !== false ? ' on' : ''}" title="${e.present !== false ? 'Inscrit' : 'Désinscrit'}"><input type="checkbox" onchange="togglePresent(${e.id}, this)"${e.present !== false ? ' checked' : ''}></label>
          <button onclick="deleteEleve(${e.id})" class="text-indigo-400 hover:text-indigo-600 text-sm" title="Supprimer">&#128465;</button>
        </div>
      </div>
      <div class="annotations-container hidden mt-3 border-t pt-3">
        <div class="annotations-list space-y-2 mb-3"></div>
        <form class="annotation-form flex gap-2" onsubmit="event.preventDefault(); addEleveAnnotation(${e.id}, this)">
          <textarea name="texte" placeholder="Nouvelle annotation…" rows="2" required
                   class="annotation-new-input border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 resize-none"></textarea>
          <button type="submit" class="bg-indigo-600 text-white text-sm rounded px-3 py-1 hover:bg-indigo-700 transition self-end">Ajouter</button>
        </form>
      </div>
    </div>`;
}

async function renameEleve(card) {
  const id = parseInt(card.dataset.id);
  const currentClasseId = parseInt(card.dataset.classeId);
  const h3 = card.querySelector("h3");
  const currentText = h3.textContent.trim();
  const parts = currentText.split(" ");
  const currentPrenom = parts.slice(0, -1).join(" ") || "";
  const currentNom = parts[parts.length - 1] || "";
  const pClasse = card.querySelector(".eleve-classe");
  const currentClasseNom = pClasse ? pClasse.textContent.trim() : "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center gap-2";

  const inputPrenom = document.createElement("input");
  inputPrenom.type = "text";
  inputPrenom.value = currentPrenom;
  inputPrenom.placeholder = "Prénom";
  inputPrenom.className = "border rounded px-2 py-1 text-sm w-56 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold";

  const inputNom = document.createElement("input");
  inputNom.type = "text";
  inputNom.value = currentNom;
  inputNom.placeholder = "Nom";
  inputNom.className = "border rounded px-2 py-1 text-sm w-56 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold";

  wrapper.appendChild(inputPrenom);
  wrapper.appendChild(inputNom);
  h3.replaceWith(wrapper);

  let selectClasse = null;
  if (pClasse) {
    selectClasse = document.createElement("select");
    selectClasse.className = "border rounded px-2 py-1 text-xs text-gray-500 w-44 mt-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    allClasses.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nom;
      if (c.id === currentClasseId) opt.selected = true;
      selectClasse.appendChild(opt);
    });
    pClasse.replaceWith(selectClasse);
  }

  inputPrenom.focus();
  inputPrenom.select();

  async function doSave() {
    if (wrapper._saving) return;
    wrapper._saving = true;
    const valPrenom = inputPrenom.value.trim() || currentPrenom;
    const valNom = inputNom.value.trim() || currentNom;
    const valClasseId = selectClasse ? parseInt(selectClasse.value) : currentClasseId;
    const valClasseNom = selectClasse ? selectClasse.selectedOptions[0].textContent : currentClasseNom;

    const newH3 = document.createElement("h3");
    newH3.className = "font-semibold text-gray-900";
    newH3.textContent = `${valPrenom} ${valNom}`;
    wrapper.replaceWith(newH3);

    if (selectClasse) {
      const newP = document.createElement("p");
      newP.className = "text-sm text-gray-500 eleve-classe";
      newP.textContent = valClasseNom || "Sans classe";
      selectClasse.replaceWith(newP);
    }

    const body = {};
    if (valPrenom !== currentPrenom) body.prenom = valPrenom;
    if (valNom !== currentNom) body.nom = valNom;
    if (valClasseId !== currentClasseId) body.classe_id = valClasseId;

    if (Object.keys(body).length) {
      try {
        await ElevesApi.update(id, body);
        if (valClasseId !== currentClasseId) card.dataset.classeId = valClasseId;
      } catch (err) {
        newH3.textContent = currentText;
        if (selectClasse) {
          const revertP = document.createElement("p");
          revertP.className = "text-sm text-gray-500 eleve-classe";
          revertP.textContent = currentClasseNom;
          newH3.parentElement.querySelector(".eleve-classe")?.replaceWith(revertP);
        }
        toast(err.message, "error");
      }
    }
  }

  function saveWithDelay(sourceInput) {
    if (wrapper._saving) return;
    clearTimeout(wrapper._saveTimer);
    wrapper._saveTimer = setTimeout(() => doSave(), 150);
  }

  inputPrenom.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inputNom.focus(); } });
  inputPrenom.addEventListener("blur", () => saveWithDelay(inputPrenom));
  inputNom.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); selectClasse ? selectClasse.focus() : doSave(); } });
  inputNom.addEventListener("focus", () => { clearTimeout(wrapper._saveTimer); });
  inputNom.addEventListener("blur", () => saveWithDelay(inputNom));
  if (selectClasse) {
    selectClasse.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
    selectClasse.addEventListener("focus", () => { clearTimeout(wrapper._saveTimer); });
    selectClasse.addEventListener("blur", () => saveWithDelay(selectClasse));
  }
}

async function loadFilteredEleves() {
  const { classeId, eleveId, prenom } = getActiveFilters();
  const list = document.getElementById("eleves-list");
  if (eleveId) {
    try {
      const e = await ElevesApi.get(eleveId);
      list.innerHTML = renderEleveCard(e);
    } catch (err) {
      list.innerHTML = `<p class="text-red-400 italic">Élève introuvable.</p>`;
    }
    return;
  }
  let eleves = await ElevesApi.list(classeId);
  if (prenom) {
    eleves = eleves.filter(e => e.prenom === prenom);
  }
  if (!eleves.length) {
    list.innerHTML = `<p class="text-gray-400 italic">Aucun élève trouvé.</p>`;
    return;
  }
  list.innerHTML = eleves.map(renderEleveCard).join("");
}

async function deleteEleve(id) {
  if (!confirm("Supprimer cet élève ?")) return;
  try {
    await ElevesApi.delete(id);
    toast("Élève supprimé.");
    loadFilteredEleves();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("eleves-list")) {
  const style = document.createElement("style");
  style.textContent = `.present-toggle{position:relative;display:inline-flex;align-items:center;cursor:pointer;width:22px;height:12px;background:#d1d5db;border-radius:999px;transition:background .2s}.present-toggle input{position:absolute;opacity:0;width:0;height:0}.present-toggle.on{background:#6366f1}.present-toggle::after{content:'';position:absolute;top:1px;left:1px;width:10px;height:10px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 2px rgba(0,0,0,.15)}.present-toggle.on::after{transform:translateX(10px)}`;
  document.head.appendChild(style);
  loadClassesIntoFilterSelect();
  loadElevesIntoFilterSelect();
  loadPrenomsIntoFilterSelect();
  document.getElementById("filter-classe").addEventListener("change", () => {
    document.getElementById("filter-eleve").value = "";
    document.getElementById("filter-prenom").value = "";
    loadFilteredEleves();
  });
  document.getElementById("filter-eleve").addEventListener("change", () => {
    document.getElementById("filter-classe").value = "";
    document.getElementById("filter-prenom").value = "";
    loadFilteredEleves();
  });
  document.getElementById("filter-prenom").addEventListener("change", () => {
    document.getElementById("filter-classe").value = "";
    document.getElementById("filter-eleve").value = "";
    loadFilteredEleves();
  });
  document.getElementById("eleves-list").addEventListener("click", (e) => {
    if (e.target.closest("button, input, form, textarea, label")) return;
    const card = e.target.closest(".eleve-card");
    if (!card) return;
    if (card._clickTimer) {
      clearTimeout(card._clickTimer);
      card._clickTimer = null;
      return;
    }
    card._clickTimer = setTimeout(() => {
      card._clickTimer = null;
      const container = card.querySelector(".annotations-container");
      if (container) {
        const isHidden = container.classList.toggle("hidden");
        if (!isHidden) loadEleveAnnotations(card);
      }
    }, 250);
  });
  document.getElementById("eleves-list").addEventListener("dblclick", (e) => {
    if (e.target.closest("button, input, form, textarea, label")) return;
    const card = e.target.closest(".eleve-card");
    if (!card) return;
    if (card._clickTimer) {
      clearTimeout(card._clickTimer);
      card._clickTimer = null;
    }
    renameEleve(card);
  });
}
