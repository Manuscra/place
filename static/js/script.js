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
  return res.json();
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
            ${eleves.map((e) => `<li class="flex justify-between items-center" data-name="${e.nom} ${e.prenom}"><span>${e.nom} ${e.prenom}</span><div class="flex items-center gap-3"><label class="present-toggle${e.present !== false ? ' on' : ''}" title="${e.present !== false ? 'Présent' : 'Absent'}"><input type="checkbox" onchange="togglePresent(${e.id}, this)"${e.present !== false ? ' checked' : ''}></label> <button onclick="event.stopPropagation(); deleteClasseEleve(${e.id}, this)" class="text-indigo-400 hover:text-indigo-600 text-[10px] leading-none" title="Supprimer">&#128465;</button></div></li>`).join("")}
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
    li.innerHTML = `<span>${created.nom} ${created.prenom}</span><div class="flex items-center gap-3"><label class="present-toggle on" title="Présent"><input type="checkbox" checked onchange="togglePresent(${created.id}, this)"></label> <button onclick="event.stopPropagation(); deleteClasseEleve(${created.id}, this)" class="text-indigo-400 hover:text-indigo-600 text-[10px] leading-none" title="Supprimer">&#128465;</button></div>`;
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
  label.title = present ? "Présent" : "Absent";
  try {
    await api(`/api/eleves/${id}`, { method: "PUT", body: JSON.stringify({ present }) });
  } catch (err) {
    checkbox.checked = !present;
    label.classList.toggle("on", !present);
    label.title = !present ? "Présent" : "Absent";
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
async function loadClassesIntoFilterSelect() {
  const classes = await api("/api/classes");
  const select = document.getElementById("filter-classe");
  if (!select) return;
  classes.forEach((c) => {
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
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${e.prenom} ${e.nom}</h3>
        <p class="text-sm text-gray-500">Classe #${e.classe_id}</p>
      </div>
      <button onclick="deleteEleve(${e.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`;
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
  loadClassesIntoFilterSelect();
  loadElevesIntoFilterSelect();
  loadPrenomsIntoFilterSelect();
  ["filter-classe", "filter-eleve", "filter-prenom"].forEach((id) => {
    document.getElementById(id).addEventListener("change", loadFilteredEleves);
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
