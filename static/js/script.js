var API_BASE = window.API_BASE || "";

// Fetch wrapper
async function api(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Réponse invalide du serveur");
  }
}

// Toast notification
function toast(message, type = "success") {
  const el = document.createElement("div");
  el.className = `fixed bottom-4 right-4 px-4 py-2 rounded text-white text-sm shadow-lg z-50 transition ${
    type === "success" ? "bg-green-600" : "bg-red-600"
  }`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => { el.remove(); }, 3000);
}

// --- Classes page ---
if (document.getElementById("create-classe")) {
  document.getElementById("create-classe").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await api("/api/classes", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
      e.target.reset();
      toast("Classe créée !");
      loadClasses();
    } catch (err) { toast(err.message, "error"); }
  });
}

if (document.getElementById("reset-db")) {
  document.getElementById("reset-db").addEventListener("click", async () => {
    if (!confirm("Vider complètement la base de données ? Cette action est irréversible.")) return;
    try {
      await api("/api/reset", { method: "POST" });
      toast("Base de données vidée.");
      loadClasses();
    } catch (err) { toast(err.message, "error"); }
  });
}

if (document.getElementById("import-csv")) {
  document.getElementById("import-csv").addEventListener("click", () => {
    document.getElementById("csv-file").click();
  });
  document.getElementById("csv-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!confirm(`Importer le fichier "${file.name}" ?`)) {
      e.target.value = "";
      return;
    }
    const btn = document.getElementById("import-csv");
    btn.disabled = true;
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Importation...`;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(API_BASE + "/api/import-csv", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      toast(data.message || "Import réussi !");
      loadClasses();
    } catch (err) { toast(err.message, "error"); }
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    e.target.value = "";
  });
}

async function loadClasses() {
  const classes = await api("/api/classes");
  const list = document.getElementById("classes-list");
  const cards = await Promise.all(classes.map(async (c) => {
    let elevesHtml = "";
    try {
      const eleves = await api(`/api/eleves?classe_id=${c.id}`);
      if (eleves.length) {
        elevesHtml = `
          <ul class="mt-3 border-t pt-3 text-sm text-gray-500 space-y-1 ml-8 hidden">
            ${eleves.map((e) => `<li class="flex justify-between items-center" data-name="${e.nom} ${e.prenom}"><span>${e.nom} ${e.prenom}</span><div class="flex items-center gap-3"><label class="present-toggle${e.present !== false ? ' on' : ''}" title="${e.present !== false ? 'Inscrit' : 'Désinscrit'}"><input type="checkbox" onchange="togglePresent(${e.id}, this)"${e.present !== false ? ' checked' : ''}></label> <button onclick="event.stopPropagation(); deleteClasseEleve(${e.id}, this)" class="text-indigo-400 hover:text-indigo-600 text-[10px] leading-none" title="Supprimer">&#128465;</button></div></li>`).join("")}
          </ul>`;
      }
    } catch (e) { /* ignore */ }
    return `
      <div class="bg-white rounded-lg shadow p-4" data-id="${c.id}">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 classe-name">${c.nom}</h3>
          <p class="text-[10px] text-gray-400 italic classe-prof">Prof. Principal: ${c.description || ''}</p>
          <button onclick="deleteClasse(${c.id})" class="text-red-500 hover:text-red-700 text-sm leading-none ml-4" title="Supprimer cette classe">&#128465;</button>
        </div>
        <div class="flex-1">
          ${elevesHtml}
          <form onsubmit="event.preventDefault(); addEleveToClasse(${c.id}, this)" class="mt-3 border-t pt-3 hidden classe-form">
            <span class="text-sm font-semibold text-gray-700 block mb-2">Ajout d'un élève :</span>
            <div class="flex items-center gap-3">
            <input type="text" name="nom" placeholder="Nom" required
                   class="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-28">
            <input type="text" name="prenom" placeholder="Prénom" required
                   class="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-28">
            <button type="submit" class="bg-indigo-600 text-white text-sm rounded px-3 py-1 hover:bg-indigo-700 transition">Créer</button>
            </div>
          </form>
        </div>
      </div>`;
  }));
  list.innerHTML = cards.join("");
}

async function deleteClasse(id) {
  if (!confirm("Supprimer cette classe ?")) return;
  try {
    await api(`/api/classes/${id}`, { method: "DELETE" });
    toast("Classe supprimée.");
    loadClasses();
  } catch (err) { toast(err.message, "error"); }
}

async function addEleveToClasse(classeId, form) {
  const data = Object.fromEntries(new FormData(form));
  data.classe_id = classeId;
  try {
    const created = await api("/api/eleves", { method: "POST", body: JSON.stringify(data) });
    form.reset();
    toast("Élève créé !");
    const card = form.closest(".bg-white");
    let ul = card.querySelector("ul");
    if (!ul) {
      ul = document.createElement("ul");
      ul.className = "mt-3 border-t pt-3 text-sm text-gray-500 space-y-1 ml-8 italic";
      form.before(ul);
    }
    ul.classList.remove("hidden");
    const li = document.createElement("li");
    li.className = "flex justify-between items-center";
    li.dataset.name = `${created.nom} ${created.prenom}`;
    li.innerHTML = `<span>${created.nom} ${created.prenom}</span><div class="flex items-center gap-3"><label class="present-toggle on" title="Inscrit"><input type="checkbox" checked onchange="togglePresent(${created.id}, this)"></label> <button onclick="event.stopPropagation(); deleteClasseEleve(${created.id}, this)" class="text-indigo-400 hover:text-indigo-600 text-[10px] leading-none" title="Supprimer">&#128465;</button></div>`;
    ul.appendChild(li);
    [...ul.children].sort((a, b) => (a.dataset.name || a.textContent).localeCompare(b.dataset.name || b.textContent, "fr")).forEach(el => ul.appendChild(el));
  } catch (err) { toast(err.message, "error"); }
}

async function deleteClasseEleve(id, btn) {
  if (!confirm("Supprimer cet élève ?")) return;
  try {
    await api(`/api/eleves/${id}`, { method: "DELETE" });
    btn.closest("li").remove();
    toast("Élève supprimé.");
  } catch (err) { toast(err.message, "error"); }
}

async function togglePresent(id, checkbox) {
  const label = checkbox.closest("label");
  const present = checkbox.checked;
  label.classList.toggle("on", present);
  label.title = present ? "Inscrit" : "Désinscrit";
  try {
    await api(`/api/eleves/${id}`, { method: "PUT", body: JSON.stringify({ present }) });
  } catch (err) {
    checkbox.checked = !present;
    label.classList.toggle("on", !present);
    label.title = !present ? "Inscrit" : "Désinscrit";
    toast(err.message, "error");
  }
}

async function renameClasse(card) {
  const id = parseInt(card.dataset.id);
  const h3 = card.querySelector("h3.classe-name");
  const profP = card.querySelector("p.classe-prof");
  const currentName = h3.textContent.trim();
  const currentDesc = profP ? profP.textContent.replace("Prof. Principal: ", "").trim() : "";

  const inputName = document.createElement("input");
  inputName.type = "text";
  inputName.value = currentName;
  inputName.placeholder = currentName;
  inputName.className = "border rounded px-2 py-1 text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-semibold";
  h3.replaceWith(inputName);

  let inputDesc = null;
  if (profP) {
    inputDesc = document.createElement("input");
    inputDesc.type = "text";
    inputDesc.value = currentDesc;
    inputDesc.placeholder = currentDesc || "Prof. Principal";
    inputDesc.className = "border rounded px-2 py-1 text-[10px] text-gray-400 italic w-32 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    profP.replaceWith(inputDesc);
  }

  inputName.focus();
  inputName.select();

  async function doSave() {
    if (inputName._saving) return;
    inputName._saving = true;
    const valName = inputName.value.trim() || currentName;
    const valDesc = inputDesc ? (inputDesc.value.trim() || currentDesc) : currentDesc;
    const newH3 = document.createElement("h3");
    newH3.className = "font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 classe-name";
    newH3.textContent = valName;
    inputName.replaceWith(newH3);
    if (inputDesc) {
      const newP = document.createElement("p");
      newP.className = "text-[10px] text-gray-400 italic classe-prof";
      newP.textContent = "Prof. Principal: " + valDesc;
      inputDesc.replaceWith(newP);
    }
    if (valName !== currentName || valDesc !== currentDesc) {
      try {
        const body = { nom: valName };
        body.description = valDesc || null;
        await api("/api/classes/" + id, {
          method: "PUT",
          body: JSON.stringify(body)
        });
      } catch (err) {
        alert("Erreur : " + err.message);
        newH3.textContent = currentName;
        if (inputDesc) {
          const revertP = document.createElement("p");
          revertP.className = "text-[10px] text-gray-400 italic classe-prof";
          revertP.textContent = "Prof. Principal: " + currentDesc;
          newH3.parentElement.querySelector("p.classe-prof")?.replaceWith(revertP);
        }
      }
    }
  }

  function saveWithDelay(sourceInput) {
    if (inputName._saving) return;
    clearTimeout(inputName._saveTimer);
    inputName._saveTimer = setTimeout(() => doSave(), 150);
  }

  inputName.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); inputDesc ? inputDesc.focus() : doSave(); } });
  inputName.addEventListener("blur", () => saveWithDelay(inputName));
  if (inputDesc) {
    inputDesc.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
    inputDesc.addEventListener("focus", () => { clearTimeout(inputName._saveTimer); });
    inputDesc.addEventListener("blur", () => saveWithDelay(inputDesc));
  }
}

if (document.getElementById("classes-list")) {
  const style = document.createElement("style");
  style.textContent = `.present-toggle{position:relative;display:inline-flex;align-items:center;cursor:pointer;width:22px;height:12px;background:#d1d5db;border-radius:999px;transition:background .2s}.present-toggle input{position:absolute;opacity:0;width:0;height:0}.present-toggle.on{background:#6366f1}.present-toggle::after{content:'';position:absolute;top:1px;left:1px;width:10px;height:10px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 2px rgba(0,0,0,.15)}.present-toggle.on::after{transform:translateX(10px)}`;
  document.head.appendChild(style);
  loadClasses();
  document.getElementById("classes-list").addEventListener("click", (e) => {
    if (e.target.closest("button, input, form, textarea, label")) return;
    const card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) {
      clearTimeout(card._clickTimer);
      card._clickTimer = null;
      return;
    }
    card._clickTimer = setTimeout(() => {
      card._clickTimer = null;
      const ul = card.querySelector("ul");
      if (ul) ul.classList.toggle("hidden");
      const form = card.querySelector(".classe-form");
      if (form) form.classList.toggle("hidden");
    }, 250);
  });
  document.getElementById("classes-list").addEventListener("dblclick", (e) => {
    if (e.target.closest("button, input, form, textarea")) return;
    const card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) {
      clearTimeout(card._clickTimer);
      card._clickTimer = null;
    }
    renameClasse(card);
  });
}

// --- Eleves page ---
let allClasses = [];

async function loadClassesIntoFilterSelect() {
  const classes = await api("/api/classes");
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
  const eleves = await api("/api/eleves");
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
  const eleves = await api("/api/eleves");
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
        await api(`/api/eleves/${id}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });
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
      const e = await api(`/api/eleves/${eleveId}`);
      list.innerHTML = renderEleveCard(e);
    } catch (err) {
      list.innerHTML = `<p class="text-red-400 italic">Élève introuvable.</p>`;
    }
    return;
  }
  const url = classeId ? `/api/eleves?classe_id=${classeId}` : "/api/eleves";
  let eleves = await api(url);
  if (prenom) {
    eleves = eleves.filter(e => e.prenom === prenom);
  }
  if (!eleves.length) {
    list.innerHTML = `<p class="text-gray-400 italic">Aucun élève trouvé.</p>`;
    return;
  }
  list.innerHTML = eleves.map(renderEleveCard).join("");
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

async function loadEleveAnnotations(card) {
  const eleveId = card.dataset.id;
  const list = card.querySelector(".annotations-list");
  try {
    const annotations = await api(`/api/annotations?eleve_id=${eleveId}`);
    list.innerHTML = annotations.length
      ? annotations.map(a => {
          const groupespan = a.groupe_nom
            ? ` - ${a.groupe_nom.replace(/</g, "&lt;")}`
            : "";
          const dateStr = new Date(a.date_saisie).toLocaleDateString("fr-FR");
          const hasLink = a.projet_id && a.classe_id;
          const metaContent = `${dateStr}${a.projet_nom ? " · " + a.projet_nom : ""}${groupespan}`;
          const metaHtml = hasLink
            ? `<a href="${API_BASE}/distribution?classe_id=${a.classe_id}&projet_id=${a.projet_id}" class="text-xs text-gray-400 hover:text-indigo-600">${metaContent}</a>`
            : `<span class="text-xs text-gray-400">${metaContent}</span>`;
          return `
        <div class="annotation-entry flex justify-between items-start gap-2 text-sm">
          <div>
            ${metaHtml}
            <p class="text-gray-700 whitespace-pre-wrap">${a.texte.replace(/</g, "&lt;")}</p>
          </div>
          <button onclick="deleteAnnotation(${a.id}, this)" class="text-red-400 hover:text-red-600 text-xs leading-none shrink-0" title="Supprimer">&#128465;</button>
        </div>`;
        }).join("")
      : '<p class="text-gray-400 italic text-sm">Aucune annotation.</p>';
  } catch (e) { /* ignore */ }
}

async function addEleveAnnotation(eleveId, form) {
  const texte = form.querySelector("textarea").value.trim();
  if (!texte) return;
  try {
    await api("/api/annotations", {
      method: "POST",
      body: JSON.stringify({ eleve_id: eleveId, texte })
    });
    form.reset();
    form.querySelector("textarea").focus();
    const card = form.closest(".eleve-card");
    if (card) await loadEleveAnnotations(card);
  } catch (err) { toast(err.message, "error"); }
}

async function deleteAnnotation(id, btn) {
  if (!confirm("Supprimer cette annotation ?")) return;
  try {
    await api(`/api/annotations/${id}`, { method: "DELETE" });
    const entry = btn.closest(".annotation-entry");
    if (entry) {
      const list = entry.parentElement;
      entry.remove();
      if (!list.querySelector(".annotation-entry")) {
        list.innerHTML = '<p class="text-gray-400 italic text-sm">Aucune annotation.</p>';
      }
    }
  } catch (err) { toast(err.message, "error"); }
}

// --- Activites page ---
// Sub-tab switching
if (document.querySelector(".subtab")) {
  document.querySelectorAll(".subtab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      var name = this.dataset.tab;
      document.querySelectorAll(".subtab").forEach(function(t) { t.classList.remove("subtab-active"); });
      this.classList.add("subtab-active");
      document.querySelectorAll(".tab-content").forEach(function(c) { c.classList.add("hidden"); });
      var panel = document.getElementById("tab-" + name);
      if (panel) panel.classList.remove("hidden");
      if (name === "activites") loadActivites();
      if (name === "chapitres") loadChapitres();
      if (name === "niveaux") loadNiveaux();
      if (name === "images") loadImages();
      if (name === "liens") loadLiens();
      if (name === "reponses") loadReponses();
      if (name === "attributions") loadAttributions();
      if (name === "positionnement") { window.open(API_BASE + "/positionnement", "_blank"); return; }
      if (name === "listes") setupListes();
    });
  });
}

// ======================== ACTIVITES ========================
var allImgs = [];
var allLiens = [];
var resourcesReady = false;

async function preloadResources() {
  if (resourcesReady) return;
  allImgs = await api("/api/activites/images");
  allLiens = await api("/api/activites/liens");
  resourcesReady = true;
}

if (document.getElementById("create-activite")) {
  (async function initActivites() {
    await preloadResources();
    loadImagesForSelect(document.getElementById("new-act-img-select"));
    loadLiensForSelect(document.getElementById("new-act-lien-select"));

  var typeSel = document.getElementById("new-act-type");
  typeSel.addEventListener("change", function() {
    var imgSel = document.getElementById("new-act-img-select");
    var lienSel = document.getElementById("new-act-lien-select");
    if (this.value === "1") { imgSel.classList.remove("hidden"); lienSel.classList.add("hidden"); lienSel.value = ""; }
    else { imgSel.classList.add("hidden"); imgSel.value = "0"; lienSel.classList.remove("hidden"); }
  });

  document.getElementById("create-activite").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    var data = Object.fromEntries(form);
    data.Type_Act = parseInt(data.Type_Act);
    data.No_dImg = parseInt(data.No_dImg) || 0;
    try {
      var created = await api("/api/activites", { method: "POST", body: JSON.stringify(data) });
      // Associate lien if type is Lien
      if (data.Type_Act === 2 && data.No_Lien) {
        await api("/api/activites/assoc-type", { method: "POST", body: JSON.stringify({ No_Act: created.No_Act, Type_Act: 2, No_Lien: parseInt(data.No_Lien) }) });
      }
      e.target.reset();
      document.getElementById("new-act-img-select").classList.remove("hidden");
      document.getElementById("new-act-lien-select").classList.add("hidden");
      toast("Activité créée !");
      loadActivites();
    } catch (err) { toast(err.message, "error"); }
  });
  })();  // end initActivites IIFE
}

function loadLiensForSelect(select) {
  if (!select) return;
  select.innerHTML = '<option value="">-- Choisir un lien --</option>' +
    allLiens.map(function(l) { return '<option value="' + l.No_Lien + '">' + l.Link.substring(0, 60) + '</option>'; }).join("");
}

async function loadImagesForSelect(select) {
  if (!select) return;
  select.innerHTML = '<option value="0">-- Aucune image --</option>' +
    allImgs.map(function(i) { return '<option value="' + i.No_Img + '">' + i.N_Img + '</option>'; }).join("");
}

async function loadActivites() {
  if (!resourcesReady) await preloadResources();
  var activites = await api("/api/activites");
  var list = document.getElementById("activites-list");
  if (!list) return;
  list.innerHTML = activites.map(function(a) {
    var imgName = a.img_name ? 'Img: ' + a.img_name : '';
    var lienDisplay = a.lien_url ? '<a href="' + a.lien_url.replace(/"/g, "&quot;") + '" target="_blank" class="text-xs text-indigo-500 hover:underline">' + (a.lien_url.length > 40 ? a.lien_url.substring(0, 40) + "..." : a.lien_url) + '</a>' : '';
    var chaps = (a.chapitre_names && a.chapitre_names.length) ? '<div class="text-xs text-gray-400 mt-1">Chapitres: ' + a.chapitre_names.join(", ") + '</div>' : '';
    var nivs = (a.niveau_names && a.niveau_names.length) ? '<div class="text-xs text-gray-400">Niveaux: ' + a.niveau_names.join(", ") + '</div>' : '';

    var resSelector = '';
    if (a.Type_Act === 1) {
      resSelector = '<select onchange="changeActImg(' + a.No_Act + ', this.value)" class="border rounded px-1 py-0 text-xs">' +
        '<option value="0"' + (!a.No_dImg ? ' selected' : '') + '>--</option>';
      allImgs.forEach(function(i) {
        resSelector += '<option value="' + i.No_Img + '"' + (a.No_dImg === i.No_Img ? ' selected' : '') + '>' + i.N_Img + '</option>';
      });
      resSelector += '</select>';
    } else {
      resSelector = '<select onchange="changeActLien(' + a.No_Act + ', this.value)" class="border rounded px-1 py-0 text-xs">' +
        '<option value="0"' + (!a.lien_url ? ' selected' : '') + '>--</option>';
      var linkedId = 0;
      if (a.lien_url) {
        for (var li = 0; li < allLiens.length; li++) {
          if (allLiens[li].Link === a.lien_url) { linkedId = allLiens[li].No_Lien; break; }
        }
      }
      allLiens.forEach(function(l) {
        resSelector += '<option value="' + l.No_Lien + '"' + (linkedId === l.No_Lien ? ' selected' : '') + '>' + l.Link.substring(0, 50) + '</option>';
      });
      resSelector += '</select>';
    }

    return '<div class="bg-white rounded-lg shadow p-4" data-id="' + a.No_Act + '">' +
      '<div class="card-row">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-2 mb-1">' +
            '<h3 class="font-semibold text-gray-900 activite-name cursor-pointer hover:text-indigo-600 truncate">' + a.Name_Act + '</h3>' +
          '</div>' +
          '<div class="flex items-center gap-2 text-xs text-gray-500">' +
            '<select onchange="changeActType(' + a.No_Act + ', this)" class="border rounded px-1 py-0 text-xs">' +
              '<option value="1"' + (a.Type_Act === 1 ? ' selected' : '') + '>Quizz</option>' +
              '<option value="2"' + (a.Type_Act === 2 ? ' selected' : '') + '>Lien</option>' +
            '</select>' +
            resSelector +
            (a.Type_Act === 1 ? '<span>' + imgName + '</span>' : lienDisplay) +
          '</div>' +
          chaps + nivs +
        '</div>' +
        '<button onclick="deleteActivite(' + a.No_Act + ')" class="text-red-500 hover:text-red-700 text-sm ml-2 shrink-0" title="Supprimer">&#128465;</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

async function changeActType(id, select) {
  var newType = parseInt(select.value);
  try {
    await api("/api/activites/" + id, { method: "PUT", body: JSON.stringify({ Type_Act: newType }) });
    loadActivites();
  } catch (err) { toast(err.message, "error"); loadActivites(); }
}

async function changeActImg(id, imgId) {
  try {
    await api("/api/activites/assoc-type", { method: "POST", body: JSON.stringify({ No_Act: id, Type_Act: 1, No_dImg: parseInt(imgId) || 0 }) });
    loadActivites();
  } catch (err) { toast(err.message, "error"); }
}

async function changeActLien(id, lienId) {
  try {
    await api("/api/activites/assoc-type", { method: "POST", body: JSON.stringify({ No_Act: id, Type_Act: 2, No_Lien: parseInt(lienId) || 0 }) });
    loadActivites();
  } catch (err) { toast(err.message, "error"); }
}

async function deleteActivite(id) {
  if (!confirm("Supprimer cette activité ?")) return;
  try {
    await api("/api/activites/" + id, { method: "DELETE" });
    toast("Activité supprimée.");
    loadActivites();
  } catch (err) { toast(err.message, "error"); }
}

async function renameActivite(card) {
  var id = parseInt(card.dataset.id);
  var h3 = card.querySelector("h3.activite-name");
  var currentName = h3.textContent.trim();

  var input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.className = "border rounded px-2 py-1 text-sm font-semibold w-full focus:ring-2 focus:ring-indigo-500";
  h3.replaceWith(input);
  input.focus();
  input.select();

  async function doSave() {
    if (input._saving) return;
    input._saving = true;
    var val = input.value.trim() || currentName;
    var newH3 = document.createElement("h3");
    newH3.className = "font-semibold text-gray-900 activite-name cursor-pointer hover:text-indigo-600";
    newH3.textContent = val;
    input.replaceWith(newH3);
    if (val !== currentName) {
      try {
        await api("/api/activites/" + id, { method: "PUT", body: JSON.stringify({ Name_Act: val }) });
      } catch (err) {
        newH3.textContent = currentName;
      }
    }
  }

  input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
  input.addEventListener("blur", doSave);
}

if (document.getElementById("activites-list")) {
  loadActivites();
  document.getElementById("activites-list").addEventListener("click", function(e) {
    if (e.target.closest("button, input, form, textarea, select, a")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) { clearTimeout(card._clickTimer); card._clickTimer = null; return; }
    card._clickTimer = setTimeout(function() { card._clickTimer = null; }, 250);
  });
  document.getElementById("activites-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button, input, form, textarea, select, a")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) { clearTimeout(card._clickTimer); card._clickTimer = null; }
    renameActivite(card);
  });
}

// ======================== CHAPITRES ========================
if (document.getElementById("create-chapitre")) {
  document.getElementById("create-chapitre").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    try {
      await api("/api/activites/chapitres", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
      e.target.reset();
      toast("Chapitre créé !");
      loadChapitres();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadChapitres() {
  var chaps = await api("/api/activites/chapitres");
  var list = document.getElementById("chapitres-list");
  if (!list) return;
  list.innerHTML = chaps.map(function(c) {
    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + c.No_chap + '">' +
      '<h3 class="font-semibold text-gray-900 chap-name cursor-pointer hover:text-indigo-600">' + c.Name_Chap + '</h3>' +
      '<button onclick="deleteChap(' + c.No_chap + ')" class="text-red-500 hover:text-red-700 text-sm">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function deleteChap(id) {
  if (!confirm("Supprimer ce chapitre ?")) return;
  try {
    await api("/api/activites/chapitres/" + id, { method: "DELETE" });
    toast("Chapitre supprimé.");
    loadChapitres();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("chapitres-list")) {
  document.getElementById("chapitres-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    var id = parseInt(card.dataset.id);
    var h3 = card.querySelector("h3.chap-name");
    var current = h3.textContent.trim();
    var input = document.createElement("input");
    input.type = "text";
    input.value = current;
    input.className = "border rounded px-2 py-1 text-sm w-full font-semibold";
    h3.replaceWith(input);
    input.focus();
    input.select();
    async function save() {
      var val = input.value.trim() || current;
      var newH3 = document.createElement("h3");
      newH3.className = "font-semibold text-gray-900 chap-name cursor-pointer hover:text-indigo-600";
      newH3.textContent = val;
      input.replaceWith(newH3);
      if (val !== current) {
        try { await api("/api/activites/chapitres/" + id, { method: "PUT", body: JSON.stringify({ Name_Chap: val }) }); }
        catch (err) { newH3.textContent = current; }
      }
    }
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); save(); } });
    input.addEventListener("blur", save);
  });
}

// ======================== NIVEAUX ========================
if (document.getElementById("create-niveau")) {
  document.getElementById("create-niveau").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    try {
      await api("/api/activites/niveaux", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
      e.target.reset();
      toast("Niveau créé !");
      loadNiveaux();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadNiveaux() {
  var nivs = await api("/api/activites/niveaux");
  var list = document.getElementById("niveaux-list");
  if (!list) return;
  list.innerHTML = nivs.map(function(n) {
    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + n.No_Niv + '">' +
      '<h3 class="font-semibold text-gray-900 niv-name cursor-pointer hover:text-indigo-600">' + n.Name_Niv + '</h3>' +
      '<button onclick="deleteNiv(' + n.No_Niv + ')" class="text-red-500 hover:text-red-700 text-sm">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function deleteNiv(id) {
  if (!confirm("Supprimer ce niveau ?")) return;
  try {
    await api("/api/activites/niveaux/" + id, { method: "DELETE" });
    toast("Niveau supprimé.");
    loadNiveaux();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("niveaux-list")) {
  document.getElementById("niveaux-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    var id = parseInt(card.dataset.id);
    var h3 = card.querySelector("h3.niv-name");
    var current = h3.textContent.trim();
    var input = document.createElement("input");
    input.type = "text";
    input.value = current;
    input.className = "border rounded px-2 py-1 text-sm w-full font-semibold";
    h3.replaceWith(input);
    input.focus();
    input.select();
    async function save() {
      var val = input.value.trim() || current;
      var newH3 = document.createElement("h3");
      newH3.className = "font-semibold text-gray-900 niv-name cursor-pointer hover:text-indigo-600";
      newH3.textContent = val;
      input.replaceWith(newH3);
      if (val !== current) {
        try { await api("/api/activites/niveaux/" + id, { method: "PUT", body: JSON.stringify({ Name_Niv: val }) }); }
        catch (err) { newH3.textContent = current; }
      }
    }
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); save(); } });
    input.addEventListener("blur", save);
  });
}

// ======================== IMAGES ========================
if (document.getElementById("create-image")) {
  document.getElementById("create-image").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    try {
      await api("/api/activites/images", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
      e.target.reset();
      toast("Image créée !");
      loadImages();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadImages() {
  var imgs = await api("/api/activites/images");
  var list = document.getElementById("images-list");
  if (!list) return;
  list.innerHTML = imgs.map(function(i) {
    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + i.No_Img + '">' +
      '<h3 class="font-semibold text-gray-900 img-name cursor-pointer hover:text-indigo-600">' + i.N_Img + '</h3>' +
      '<button onclick="deleteImg(' + i.No_Img + ')" class="text-red-500 hover:text-red-700 text-sm">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function deleteImg(id) {
  if (!confirm("Supprimer cette image ?")) return;
  try {
    await api("/api/activites/images/" + id, { method: "DELETE" });
    toast("Image supprimée.");
    loadImages();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("images-list")) {
  document.getElementById("images-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    var id = parseInt(card.dataset.id);
    var h3 = card.querySelector("h3.img-name");
    var current = h3.textContent.trim();
    var input = document.createElement("input");
    input.type = "text";
    input.value = current;
    input.className = "border rounded px-2 py-1 text-sm w-full font-semibold";
    h3.replaceWith(input);
    input.focus();
    input.select();
    async function save() {
      var val = input.value.trim() || current;
      var newH3 = document.createElement("h3");
      newH3.className = "font-semibold text-gray-900 img-name cursor-pointer hover:text-indigo-600";
      newH3.textContent = val;
      input.replaceWith(newH3);
      if (val !== current) {
        try { await api("/api/activites/images/" + id, { method: "PUT", body: JSON.stringify({ N_Img: val }) }); }
        catch (err) { newH3.textContent = current; }
      }
    }
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); save(); } });
    input.addEventListener("blur", save);
  });
}

// ======================== LIENS ========================
if (document.getElementById("create-lien")) {
  document.getElementById("create-lien").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    try {
      await api("/api/activites/liens", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
      e.target.reset();
      toast("Lien créé !");
      loadLiens();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadLiens() {
  var liens = await api("/api/activites/liens");
  var list = document.getElementById("liens-list");
  if (!list) return;
  list.innerHTML = liens.map(function(l) {
    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + l.No_Lien + '">' +
      '<div class="flex-1 min-w-0">' +
        '<h3 class="font-semibold text-gray-900 lien-url cursor-pointer hover:text-indigo-600 truncate">' + l.Link + '</h3>' +
      '</div>' +
      '<button onclick="deleteLien(' + l.No_Lien + ')" class="text-red-500 hover:text-red-700 text-sm ml-3 shrink-0">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function deleteLien(id) {
  if (!confirm("Supprimer ce lien ?")) return;
  try {
    await api("/api/activites/liens/" + id, { method: "DELETE" });
    toast("Lien supprimé.");
    loadLiens();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("liens-list")) {
  document.getElementById("liens-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    var id = parseInt(card.dataset.id);
    var h3 = card.querySelector("h3.lien-url");
    var current = h3.textContent.trim();
    var input = document.createElement("input");
    input.type = "text";
    input.value = current;
    input.className = "border rounded px-2 py-1 text-sm w-full font-semibold";
    h3.replaceWith(input);
    input.focus();
    input.select();
    async function save() {
      var val = input.value.trim() || current;
      var newH3 = document.createElement("h3");
      newH3.className = "font-semibold text-gray-900 lien-url cursor-pointer hover:text-indigo-600 truncate";
      newH3.textContent = val;
      input.replaceWith(newH3);
      if (val !== current) {
        try { await api("/api/activites/liens/" + id, { method: "PUT", body: JSON.stringify({ Link: val }) }); }
        catch (err) { newH3.textContent = current; }
      }
    }
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); save(); } });
    input.addEventListener("blur", save);
  });
}

// ======================== REPONSES ========================
if (document.getElementById("create-reponse")) {
  document.getElementById("create-reponse").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    try {
      await api("/api/activites/reponses", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
      e.target.reset();
      toast("Réponse créée !");
      loadReponses();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadReponses() {
  var reps = await api("/api/activites/reponses");
  var list = document.getElementById("reponses-list");
  if (!list) return;
  list.innerHTML = reps.map(function(r) {
    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + r.No_Rep + '">' +
      '<h3 class="font-semibold text-gray-900 rep-text cursor-pointer hover:text-indigo-600">' + r.Reponse + '</h3>' +
      '<button onclick="deleteReponse(' + r.No_Rep + ')" class="text-red-500 hover:text-red-700 text-sm">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function deleteReponse(id) {
  if (!confirm("Supprimer cette réponse ?")) return;
  try {
    await api("/api/activites/reponses/" + id, { method: "DELETE" });
    toast("Réponse supprimée.");
    loadReponses();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("reponses-list")) {
  document.getElementById("reponses-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    var id = parseInt(card.dataset.id);
    var h3 = card.querySelector("h3.rep-text");
    var current = h3.textContent.trim();
    var input = document.createElement("input");
    input.type = "text";
    input.value = current;
    input.className = "border rounded px-2 py-1 text-sm w-full font-semibold";
    h3.replaceWith(input);
    input.focus();
    input.select();
    async function save() {
      var val = input.value.trim() || current;
      var newH3 = document.createElement("h3");
      newH3.className = "font-semibold text-gray-900 rep-text cursor-pointer hover:text-indigo-600";
      newH3.textContent = val;
      input.replaceWith(newH3);
      if (val !== current) {
        try { await api("/api/activites/reponses/" + id, { method: "PUT", body: JSON.stringify({ Reponse: val }) }); }
        catch (err) { newH3.textContent = current; }
      }
    }
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); save(); } });
    input.addEventListener("blur", save);
  });
}

// ======================== ATTRIBUTIONS ========================
var allAttribActivites = [];
var allAttribChapitres = [];
var allAttribNiveaux = [];
var allAttribNivRows = [];

if (document.querySelector(".attrib-btn")) {
  document.querySelectorAll(".attrib-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".attrib-btn").forEach(function(b) { b.className = "attrib-btn bg-white border rounded px-4 py-2 text-sm"; });
      this.className = "attrib-btn bg-indigo-100 text-indigo-700 rounded px-4 py-2 text-sm font-medium";
      var name = this.dataset.attrib;
      document.querySelectorAll(".attrib-panel").forEach(function(p) { p.classList.add("hidden"); });
      document.getElementById("attrib-" + name).classList.remove("hidden");
      if (name === "act-chap") setupAttribAC();
      if (name === "act-niv") setupAttribAN();
      if (name === "chap-niv") setupAttribCN();
    });
  });
}

async function loadAttributions() {
  allAttribActivites = await api("/api/activites");
  allAttribChapitres = await api("/api/activites/chapitres");
  allAttribNiveaux = await api("/api/activites/niveaux");
  allAttribNivRows = await api("/api/activites/attrib/chap-niv");
  setupAttribAC();
}

// Activite <-> Chapitre (matrix: activities = rows, chapters = columns)
function setupAttribAC() {
  renderAttribAC();
}

function renderAttribAC() {
  var table = document.getElementById("ac-matrix-table");
  if (!table || table._loading) return;
  table._loading = true;

  api("/api/activites/attrib/chap").then(function(chapLinks) {
    table._loading = false;
    var links = {};
    chapLinks.forEach(function(l) { links[l.No_dAct + "-" + l.No_dChap] = true; });

    var html = "<thead><tr><th style=\"min-width:200px\"></th>";
    allAttribChapitres.forEach(function(c) {
      html += "<th>" + c.Name_Chap + "</th>";
    });
    html += "</tr></thead><tbody>";

    allAttribActivites.forEach(function(a) {
      html += "<tr><td class=\"chap-name\">" + a.Name_Act + "</td>";
      allAttribChapitres.forEach(function(c) {
        var checked = links[a.No_Act + "-" + c.No_chap] || false;
        html += "<td><input type=\"checkbox\" data-act=\"" + a.No_Act + "\" data-chap=\"" + c.No_chap + "\"" + (checked ? " checked" : "") + "></td>";
      });
      html += "</tr>";
    });
    html += "</tbody>";
    table.innerHTML = html;

    // Auto-save on checkbox change
    table.querySelectorAll("input[type=checkbox]").forEach(function(cb) {
      cb.addEventListener("change", function() {
        var actId = parseInt(this.dataset.act);
        var checked = [];
        table.querySelectorAll("input[type=checkbox][data-act=\"" + actId + "\"]:checked").forEach(function(c) {
          checked.push(parseInt(c.dataset.chap));
        });
        api("/api/activites/attrib/chap", {
          method: "POST",
          body: JSON.stringify({ activite_id: actId, chapitre_ids: checked })
        }).catch(function() { toast("Erreur attribution", "error"); });
      });
    });
  });
}

// Activite <-> Niveau (matrix: activities = rows, levels = columns)
function setupAttribAN() {
  renderAttribAN();
}

function renderAttribAN() {
  var table = document.getElementById("an-matrix-table");
  if (!table || table._loading) return;
  table._loading = true;

  api("/api/activites/attrib/niveau").then(function(actLinks) {
    table._loading = false;
    var links = {};
    actLinks.forEach(function(al) {
      if (al.No_dNiv !== undefined) {
        links[al.No_Act_Attrib + "-" + al.No_dNiv] = true;
      }
    });

    var html = "<thead><tr><th style=\"min-width:200px\"></th>";
    allAttribNiveaux.forEach(function(n) {
      html += "<th>" + n.Name_Niv + "</th>";
    });
    html += "</tr></thead><tbody>";

    allAttribActivites.forEach(function(a) {
      html += "<tr><td class=\"chap-name\">" + a.Name_Act + "</td>";
      allAttribNiveaux.forEach(function(n) {
        var checked = links[a.No_Act + "-" + n.No_Niv] || false;
        html += "<td><input type=\"checkbox\" data-act=\"" + a.No_Act + "\" data-niv=\"" + n.No_Niv + "\"" + (checked ? " checked" : "") + "></td>";
      });
      html += "</tr>";
    });
    html += "</tbody>";
    table.innerHTML = html;

    table.querySelectorAll("input[type=checkbox]").forEach(function(cb) {
      cb.addEventListener("change", function() {
        var actId = parseInt(this.dataset.act);
        var checked = [];
        table.querySelectorAll("input[type=checkbox][data-act=\"" + actId + "\"]:checked").forEach(function(c) {
          checked.push(parseInt(c.dataset.niv));
        });
        api("/api/activites/attrib/niveau", {
          method: "POST",
          body: JSON.stringify({ activite_id: actId, attrib_niv_ids: checked })
        }).catch(function() { toast("Erreur attribution", "error"); });
      });
    });
  });
}

// Chapitre <-> Niveau (matrix: chapters = rows, levels = columns)
function setupAttribCN() {
  renderAttribCN();
}

function renderAttribCN() {
  var table = document.getElementById("cn-matrix-table");
  if (!table || table._loading) return;
  table._loading = true;

  var html = "<thead><tr><th></th>";
  allAttribNiveaux.forEach(function(n) {
    html += "<th>" + n.Name_Niv + "</th>";
  });
  html += "</tr></thead><tbody>";

  var assign = {};
  allAttribNivRows.forEach(function(r) {
    if (!assign[r.No_dChap]) assign[r.No_dChap] = [];
    assign[r.No_dChap].push(r.No_dNiv);
  });

  allAttribChapitres.forEach(function(c) {
    html += "<tr><td class=\"chap-name\">" + c.Name_Chap + "</td>";
    var chapAssign = assign[c.No_chap] || [];
    allAttribNiveaux.forEach(function(n) {
      var checked = chapAssign.indexOf(n.No_Niv) !== -1;
      html += "<td><input type=\"checkbox\" data-chap=\"" + c.No_chap + "\" data-niv=\"" + n.No_Niv + "\"" + (checked ? " checked" : "") + "></td>";
    });
    html += "</tr>";
  });
  html += "</tbody>";
  table.innerHTML = html;
  table._loading = false;

  table.querySelectorAll("input[type=checkbox]").forEach(function(cb) {
    cb.addEventListener("change", function() {
      var chapId = parseInt(this.dataset.chap);
      var checked = [];
      table.querySelectorAll("input[type=checkbox][data-chap=\"" + chapId + "\"]:checked").forEach(function(c) {
        checked.push(parseInt(c.dataset.niv));
      });
      api("/api/activites/attrib/chap-niv", {
        method: "POST",
        body: JSON.stringify({ chapitre_id: chapId, niveau_ids: checked })
      }).then(function() {
        api("/api/activites/attrib/chap-niv").then(function(rows) { allAttribNivRows = rows; });
      }).catch(function() { toast("Erreur attribution", "error"); });
    });
  });
}




// ======================== LISTES ========================
var listesData = { act_id: 0, lists: [] };
var listesCount = 0;

function setupListes() {
  var sel = document.getElementById("listes-act-select");
  if (!sel || sel._loaded) return;
  sel._loaded = true;

  api("/api/activites/positionnement/activities").then(function(acts) {
    acts.forEach(function(a) {
      var opt = document.createElement("option");
      opt.value = a.No_Act;
      opt.textContent = a.Name_Act;
      sel.appendChild(opt);
    });
  });

  sel.addEventListener("change", function() {
    var actId = parseInt(this.value);
    listesData.act_id = actId;
    listesData.lists = [];
    listesCount = 0;
    if (!actId || isNaN(actId)) {
      document.getElementById("listes-toolbar").classList.add("hidden");
      document.getElementById("listes-area").innerHTML = "";
      return;
    }
    document.getElementById("listes-toolbar").classList.remove("hidden");
    api("/api/activites/listes/" + actId).then(function(data) {
      listesCount = data.lists.length;
      listesData.lists = data.lists.map(function(lst) {
        return { reponses: lst.reponses.map(function(r) { return { No_Rep: r.No_Rep, nb_etiq: r.nb_etiq }; }) };
      });
      renderListes();
    }).catch(function(err) {
      listesCount = 0;
      listesData.lists = [];
      renderListes();
    });
  });
}

function renderListes() {
  var area = document.getElementById("listes-area");
  if (listesCount === 0) {
    area.innerHTML = '<p class="text-gray-400 italic text-center p-4">Aucune liste. Cliquez "+ Nouvelle liste".</p>';
    return;
  }
  var html = "";
  for (var i = 0; i < listesCount; i++) {
    html += '<div class="bg-white rounded-lg shadow p-4 mb-3" data-liste="' + i + '">' +
      '<div class="flex items-center justify-between mb-2">' +
        '<h4 class="font-semibold text-gray-700">Liste n°' + (i + 1) + '</h4>' +
        '<button onclick="deleteListe(' + i + ')" class="text-red-500 hover:text-red-700 text-xs">Supprimer</button>' +
      '</div>' +
      '<div id="liste-' + i + '-reps" class="space-y-2 mb-3"></div>' +
      '<select onchange="addRepToListe(' + i + ', this)" class="border rounded px-2 py-1 text-sm w-full">' +
        '<option value="">+ Ajouter une réponse</option>' +
      '</select>' +
    '</div>';
  }
  area.innerHTML = html;

  api("/api/activites/reponses").then(function(reps) {
    for (var i = 0; i < listesCount; i++) {
      var sel = document.querySelector('#liste-' + i + '-reps').nextElementSibling;
      if (!sel) continue;
      reps.forEach(function(r) {
        var opt = document.createElement("option");
        opt.value = r.No_Rep;
        opt.textContent = r.Reponse;
        sel.appendChild(opt);
      });
      renderListeReps(i, reps);
    }
  });
}

function renderListeReps(idx, allReps) {
  var container = document.getElementById("liste-" + idx + "-reps");
  if (!container) return;
  var reps = (listesData.lists[idx] && listesData.lists[idx].reponses) ? listesData.lists[idx].reponses : [];
  var html = "";
  reps.forEach(function(r, ri) {
    var text = "?";
    if (allReps) {
      var found = allReps.filter(function(x) { return x.No_Rep === r.No_Rep; });
      if (found.length) text = found[0].Reponse;
    }
    html += '<div class="flex items-center gap-2 bg-gray-50 rounded px-3 py-1">' +
      '<span class="text-sm flex-1">' + text + '</span>' +
      '<label class="text-xs text-gray-500">Nb: <input type="number" min="1" max="25" value="' + (r.nb_etiq || 1) + '" onchange="updateEtiq(' + idx + ',' + ri + ', this.value)" class="border rounded px-1 py-0 w-14 text-xs"></label>' +
      '<button onclick="removeRepFromListe(' + idx + ',' + ri + ')" class="text-red-400 hover:text-red-600 text-xs">×</button>' +
    '</div>';
  });
  container.innerHTML = html || '<p class="text-gray-400 italic text-xs">Aucune réponse.</p>';
}

function addRepToListe(idx, sel) {
  var repId = parseInt(sel.value);
  if (!repId || isNaN(repId)) return;
  if (!listesData.lists[idx]) listesData.lists[idx] = { reponses: [] };
  if (listesData.lists[idx].reponses.some(function(r) { return r.No_Rep === repId; })) {
    sel.value = "";
    return;
  }
  listesData.lists[idx].reponses.push({ No_Rep: repId, nb_etiq: 1 });
  sel.value = "";
  api("/api/activites/reponses").then(function(reps) { renderListeReps(idx, reps); });
}

function removeRepFromListe(idx, ri) {
  listesData.lists[idx].reponses.splice(ri, 1);
  api("/api/activites/reponses").then(function(reps) { renderListeReps(idx, reps); });
}

function updateEtiq(idx, ri, val) {
  var v = parseInt(val);
  if (v > 0) listesData.lists[idx].reponses[ri].nb_etiq = v;
}

function deleteListe(idx) {
  if (!confirm("Supprimer cette liste ?")) return;
  listesData.lists.splice(idx, 1);
  listesCount = listesData.lists.length;
  renderListes();
}

if (document.getElementById("listes-add-btn")) {
  document.getElementById("listes-add-btn").addEventListener("click", function() {
    listesData.lists.push({ reponses: [] });
    listesCount = listesData.lists.length;
    renderListes();
  });
}

if (document.getElementById("listes-save-btn")) {
  document.getElementById("listes-save-btn").addEventListener("click", function() {
    if (!listesData.act_id) return;
    var cleanLists = listesData.lists.filter(function(l) { return l.reponses && l.reponses.length > 0; });
    api("/api/activites/listes", { method: "POST", body: JSON.stringify({ act_id: listesData.act_id, lists: cleanLists }) })
      .then(function() { toast("Listes enregistrées."); })
      .catch(function(err) { toast(err.message, "error"); });
  });
}

if (document.getElementById("listes-delete-btn")) {
  document.getElementById("listes-delete-btn").addEventListener("click", function() {
    if (!listesData.act_id || !confirm("Supprimer toutes les listes de cette activité ?")) return;
    api("/api/activites/listes/" + listesData.act_id, { method: "DELETE" })
      .then(function() {
        listesData.lists = [];
        listesCount = 0;
        renderListes();
        toast("Listes supprimées.");
      }).catch(function(err) { toast(err.message, "error"); });
  });
}


async function deleteEleve(id) {
  if (!confirm("Supprimer cet élève ?")) return;
  try {
    await api(`/api/eleves/${id}`, { method: "DELETE" });
    toast("Élève supprimé.");
    loadFilteredEleves();
  } catch (err) { toast(err.message, "error"); }
}
