// Fetch wrapper
async function api(url, options = {}) {
  const res = await fetch(url, {
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

// --- Teams page ---
if (document.getElementById("create-team")) {
  document.getElementById("create-team").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    try {
      await api("/api/teams", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
      });
      e.target.reset();
      toast("Équipe créée !");
      loadTeams();
    } catch (err) {
      toast(err.message, "error");
    }
  });
}

async function loadTeams() {
  const teams = await api("/api/teams");
  const list = document.getElementById("teams-list");
  list.innerHTML = teams
    .map(
      (t) => `
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${t.name}</h3>
        <p class="text-sm text-gray-500">${t.description || ""} — ${t.members.length} membre(s)</p>
      </div>
      <button onclick="deleteTeam(${t.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`
    )
    .join("");
}

async function deleteTeam(id) {
  if (!confirm("Supprimer cette équipe ?")) return;
  try {
    await api(`/api/teams/${id}`, { method: "DELETE" });
    toast("Équipe supprimée.");
    loadTeams();
  } catch (err) {
    toast(err.message, "error");
  }
}

if (document.getElementById("teams-list")) loadTeams();

// --- Members page ---
async function loadTeamsIntoSelect() {
  const teams = await api("/api/teams");
  const select = document.querySelector("#create-member select[name=team_id]");
  teams.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    select.appendChild(opt);
  });
}

if (document.getElementById("create-member")) {
  loadTeamsIntoSelect();

  document.getElementById("create-member").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    if (!data.team_id) delete data.team_id;
    else data.team_id = parseInt(data.team_id);
    try {
      await api("/api/members", { method: "POST", body: JSON.stringify(data) });
      e.target.reset();
      toast("Membre créé !");
      loadMembers();
    } catch (err) {
      toast(err.message, "error");
    }
  });
}

async function loadMembers() {
  const members = await api("/api/members");
  const list = document.getElementById("members-list");
  list.innerHTML = members
    .map(
      (m) => `
    <div class="bg-white rounded-lg shadow p-4 flex justify-between items-center">
      <div>
        <h3 class="font-semibold text-gray-900">${m.name} <span class="text-sm text-gray-400 font-normal">${m.email}</span></h3>
        <p class="text-sm text-gray-500">${m.role}${m.team_id ? " — Équipe #" + m.team_id : ""}</p>
      </div>
      <button onclick="deleteMember(${m.id})" class="text-red-500 hover:text-red-700 text-sm">Supprimer</button>
    </div>`
    )
    .join("");
}

async function deleteMember(id) {
  if (!confirm("Supprimer ce membre ?")) return;
  try {
    await api(`/api/members/${id}`, { method: "DELETE" });
    toast("Membre supprimé.");
    loadMembers();
  } catch (err) {
    toast(err.message, "error");
  }
}

if (document.getElementById("members-list")) loadMembers();
