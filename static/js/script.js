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

async function loadClasses() {
  const classes = await api("/api/classes");
  const list = document.getElementById("classes-list");
  const cards = await Promise.all(classes.map(async (c) => {
    let elevesHtml = "";
    try {
      const eleves = await api(`/api/eleves?classe_id=${c.id}`);
      if (eleves.length) {
        elevesHtml = `
          <ul class="mt-3 border-t pt-3 text-sm text-gray-500 space-y-1 ml-8 italic hidden">
            ${eleves.map((e) => `<li>${e.nom} ${e.prenom}</li>`).join("")}
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
    li.textContent = `${created.nom} ${created.prenom}`;
    ul.appendChild(li);
    [...ul.children].sort((a, b) => a.textContent.localeCompare(b.textContent, "fr")).forEach(el => ul.appendChild(el));
  } catch (err) { toast(err.message, "error"); }
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
  loadClasses();
  document.getElementById("classes-list").addEventListener("click", (e) => {
    const h3 = e.target.closest("h3.classe-name");
    if (!h3) return;
    if (h3._clickTimer) {
      clearTimeout(h3._clickTimer);
      h3._clickTimer = null;
      return;
    }
    h3._clickTimer = setTimeout(() => {
      h3._clickTimer = null;
      const card = h3.closest("[data-id]");
      const ul = card.querySelector("ul");
      if (ul) ul.classList.toggle("hidden");
      const form = card.querySelector(".classe-form");
      if (form) form.classList.toggle("hidden");
    }, 250);
  });
  document.getElementById("classes-list").addEventListener("dblclick", (e) => {
    const h3 = e.target.closest("h3.classe-name");
    const prof = e.target.closest("p.classe-prof");
    if (!h3 && !prof) return;
    if (h3 && h3._clickTimer) {
      clearTimeout(h3._clickTimer);
      h3._clickTimer = null;
    }
    const card = (h3 || prof).closest("[data-id]");
    renameClasse(card);
  });
}

// --- Projets page ---
async function loadClassesIntoProjetSelect() {
  const classes = await api("/api/classes");
  const select = document.querySelector("#classe-filter");
  if (!select) return;
  classes.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nom;
    select.appendChild(opt);
  });
}

if (document.getElementById("create-projet")) {
  loadClassesIntoProjetSelect();
  document.getElementById("classe-filter").addEventListener("change", (e) => {
    if (e.target.value) {
      loadProjets(parseInt(e.target.value));
    } else {
      document.getElementById("projets-list").innerHTML = "";
    }
  });
  document.getElementById("create-projet").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    if (!data.classe_id) return toast("Veuillez choisir une classe", "error");
    data.classe_id = parseInt(data.classe_id);
    try {
      await api("/api/projets", { method: "POST", body: JSON.stringify(data) });
      e.target.reset();
      toast("Projet créé !");
      if (document.getElementById("groupsContainer")) {
        if (typeof resetGroups === "function") resetGroups();
      } else {
        loadProjets(data.classe_id);
      }
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadProjets(classeId) {
  const params = classeId ? `?classe_id=${classeId}` : "";
  const projets = await api("/api/projets" + params);
  const list = document.getElementById("projets-list");
  list.innerHTML = projets.map((p) => `
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${p.nom}</h3>
        <p class="text-sm text-gray-500">Classe #${p.classe_id}</p>
      </div>
      <button onclick="deleteProjet(${p.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`).join("");
}

async function deleteProjet(id) {
  if (!confirm("Supprimer ce projet ?")) return;
  try {
    await api(`/api/projets/${id}`, { method: "DELETE" });
    toast("Projet supprimé.");
    const select = document.getElementById("classe-filter");
    if (select && select.value) {
      loadProjets(parseInt(select.value));
    }
  } catch (err) { toast(err.message, "error"); }
}

// --- Groupes page ---
async function loadProjetsIntoGroupeSelect() {
  const projets = await api("/api/projets");
  const select = document.querySelector("#create-groupe select[name=projet_id]");
  if (!select) return;
  projets.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nom;
    select.appendChild(opt);
  });
}

if (document.getElementById("create-groupe")) {
  loadProjetsIntoGroupeSelect();
  document.getElementById("create-groupe").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    if (!data.projet_id) return toast("Veuillez choisir un projet", "error");
    data.projet_id = parseInt(data.projet_id);
    try {
      await api("/api/groupes", { method: "POST", body: JSON.stringify(data) });
      e.target.reset();
      toast("Groupe créé !");
      loadGroupes();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadGroupes() {
  const groupes = await api("/api/groupes");
  const list = document.getElementById("groupes-list");
  list.innerHTML = groupes.map((g) => `
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${g.nom}</h3>
        <p class="text-sm text-gray-500">Projet #${g.projet_id}</p>
      </div>
      <button onclick="deleteGroupe(${g.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`).join("");
}

async function deleteGroupe(id) {
  if (!confirm("Supprimer ce groupe ?")) return;
  try {
    await api(`/api/groupes/${id}`, { method: "DELETE" });
    toast("Groupe supprimé.");
    loadGroupes();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("groupes-list")) loadGroupes();

// --- Eleves page ---
async function loadClassesIntoEleveSelect() {
  const classes = await api("/api/classes");
  const select = document.querySelector("#create-eleve select[name=classe_id]");
  if (!select) return;
  classes.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nom;
    select.appendChild(opt);
  });
}

if (document.getElementById("create-eleve")) {
  loadClassesIntoEleveSelect();
  document.getElementById("create-eleve").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    if (!data.classe_id) return toast("Veuillez choisir une classe", "error");
    data.classe_id = parseInt(data.classe_id);
    try {
      await api("/api/eleves", { method: "POST", body: JSON.stringify(data) });
      e.target.reset();
      toast("Élève créé !");
      loadEleves();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadEleves() {
  const eleves = await api("/api/eleves");
  const list = document.getElementById("eleves-list");
  list.innerHTML = eleves.map((e) => `
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${e.prenom} ${e.nom}</h3>
        <p class="text-sm text-gray-500">
          Classe #${e.classe_id}
        </p>
      </div>
      <button onclick="deleteEleve(${e.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`).join("");
}

async function deleteEleve(id) {
  if (!confirm("Supprimer cet élève ?")) return;
  try {
    await api(`/api/eleves/${id}`, { method: "DELETE" });
    toast("Élève supprimé.");
    loadEleves();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("eleves-list")) loadEleves();
