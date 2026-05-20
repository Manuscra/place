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
  list.innerHTML = classes.map((c) => `
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${c.nom}</h3>
        <p class="text-sm text-gray-500">${c.description || ""}</p>
      </div>
      <button onclick="deleteClasse(${c.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`).join("");
}

async function deleteClasse(id) {
  if (!confirm("Supprimer cette classe ?")) return;
  try {
    await api(`/api/classes/${id}`, { method: "DELETE" });
    toast("Classe supprimée.");
    loadClasses();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("classes-list")) loadClasses();

// --- Projets page ---
async function loadClassesIntoProjetSelect() {
  const classes = await api("/api/classes");
  const select = document.querySelector("#create-projet select[name=classe_id]");
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
      loadProjets();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadProjets() {
  const projets = await api("/api/projets");
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
    loadProjets();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("projets-list")) loadProjets();

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

async function loadGroupesIntoEleveSelect() {
  const groupes = await api("/api/groupes");
  const select = document.querySelector("#create-eleve select[name=groupe_id]");
  if (!select) return;
  groupes.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.nom;
    select.appendChild(opt);
  });
}

if (document.getElementById("create-eleve")) {
  loadClassesIntoEleveSelect();
  loadGroupesIntoEleveSelect();
  document.getElementById("create-eleve").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    if (!data.classe_id) return toast("Veuillez choisir une classe", "error");
    data.classe_id = parseInt(data.classe_id);
    if (data.groupe_id) data.groupe_id = parseInt(data.groupe_id);
    else delete data.groupe_id;
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
          ${e.groupe_id ? " — Groupe #" + e.groupe_id : " — Non affecté"}
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
