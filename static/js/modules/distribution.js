// --- Distribution / Placement page ---
// Uses _apiClient (api.js), ClassesApi, ElevesApi, AnnotationsApi, toast (script.js)

var container = document.getElementById("groupsContainer");
var unassigned = document.getElementById("unassigned");
var classSelect = document.getElementById("classSelect");
var newProjetName = document.getElementById("newProjetName");
var createProjetBtn = document.getElementById("createProjetBtn");
var projetsList = document.getElementById("projets-list");
var currentProjetId = null;
var currentClasseId = null;
var groupCount = 0;
var draggedStudent = null;
var currentEleves = [];

// --- Chargement des classes ---
async function loadClasses() {
    var classes = await ClassesApi.list();
    classSelect.innerHTML = '<option value="">-- Choisir une classe --</option>';
    classes.forEach(function(c) {
        var opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nom;
        classSelect.appendChild(opt);
    });
}

// --- Chargement des projets ---
async function loadProjets(classeId) {
    var projets = await _apiClient.get("/api/projets?classe_id=" + classeId);
    projetsList.innerHTML = projets.map(function(p) {
        return '<div class="bg-white rounded-lg shadow p-4 projet-card flex justify-between items-center' + (currentProjetId === p.id ? " selected" : "") + '" data-id="' + p.id + '">' +
            '<h3 class="font-semibold text-gray-900 projet-name">' + p.nom + '</h3>' +
            (p.created_at ? '<p class="text-[10px] text-gray-400 italic">' + new Date(p.created_at).toLocaleDateString("fr-FR") + '</p>' : '') +
            '<div class="flex items-center gap-3">' +
                '<button onclick="deleteProjet(' + p.id + ')" class="text-red-500 hover:text-red-700 text-sm leading-none" title="Supprimer ce projet">&#128465;</button>' +
            '</div>' +
        '</div>';
    }).join("") || '<p class="text-gray-400 italic">Aucun projet pour cette classe.</p>';

    projetsList.querySelectorAll(".projet-card").forEach(function(card) {
        var clickTimer = null;
        card.addEventListener("click", function() {
            if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; return; }
            var id = parseInt(card.dataset.id);
            clickTimer = setTimeout(function() { clickTimer = null; selectProjet(id); }, 250);
        });
        card.addEventListener("dblclick", function() {
            if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
            var id = parseInt(card.dataset.id);
            renameProjet(id, card);
        });
    });
}

// --- Sélection d'un projet ---
async function selectProjet(projetId) {
    currentProjetId = projetId;
    await loadPlacement(currentClasseId, projetId);
    loadProjets(currentClasseId);
}

// --- Suppression d'un projet ---
async function deleteProjet(id) {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
        await _apiClient.del("/api/projets/" + id);
        if (currentProjetId === id) {
            currentProjetId = null;
            document.getElementById("placementZone").style.display = "none";
        }
        loadProjets(currentClasseId);
    } catch (err) { alert("Erreur : " + err.message); }
}

// --- Renommer un projet ---
function renameProjet(id, btn) {
    var card = btn.closest(".projet-card");
    var h3 = card.querySelector(".projet-name");
    var current = h3.textContent.trim();
    var input = document.createElement("input");
    input.type = "text";
    input.value = current;
    input.className = "border rounded px-2 py-1 text-sm w-48 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
    h3.replaceWith(input);
    input.focus();
    input.select();
    async function save() {
        var val = input.value.trim() || current;
        var newH3 = document.createElement("h3");
        newH3.className = "font-semibold text-gray-900 projet-name";
        newH3.textContent = val;
        input.replaceWith(newH3);
        if (val !== current) {
            try { await _apiClient.put("/api/projets/" + id, { nom: val }); }
            catch (err) { alert("Erreur : " + err.message); newH3.textContent = current; }
        }
    }
    input.addEventListener("keydown", function(e) { if (e.key === "Enter") save(); });
    input.addEventListener("blur", save);
}

// --- Changement de classe ---
classSelect.addEventListener("change", async function(e) {
    currentClasseId = e.target.value ? parseInt(e.target.value) : null;
    currentProjetId = null;
    resetGroups();
    unassigned.innerHTML = "";
    projetsList.innerHTML = "";
    document.getElementById("placementZone").style.display = "none";

    if (!currentClasseId) { createProjetBtn.disabled = true; return; }
    createProjetBtn.disabled = false;
    loadProjets(currentClasseId);
});

// --- Création projet ---
createProjetBtn.addEventListener("click", async function() {
    if (!currentClasseId) return;
    var nom = newProjetName.value.trim();
    if (!nom) { alert("Veuillez saisir un nom de projet."); return; }
    try {
        var p = await _apiClient.post("/api/projets", { nom: nom, classe_id: currentClasseId });
        newProjetName.value = "";
        await loadProjets(currentClasseId);
        selectProjet(p.id);
    } catch (err) { alert("Erreur : " + err.message); }
});

// --- Chargement complet du placement ---
async function loadPlacement(classeId, projetId) {
    resetGroups();
    unassigned.innerHTML = "";
    if (!classeId || !projetId) return;

    document.getElementById("placementZone").style.display = "";
    var groupes = await _apiClient.get("/api/groupes?projet_id=" + projetId);
    groupCount = 0;
    container.innerHTML = "";

    for (var gi = 0; gi < groupes.length; gi++) {
        var g = groupes[gi];
        var eleves = await _apiClient.get("/api/eleves?groupe_id=" + g.id);
        var div = document.createElement("div");
        div.className = "bg-white rounded-lg shadow group-box overflow-hidden";
        div.dataset.groupeId = g.id;
        div.innerHTML =
            '<div class="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white px-4 py-3 flex justify-between items-center gap-3">' +
                '<h3 class="group-title font-semibold text-sm cursor-pointer select-none hover:text-indigo-200">' + g.nom + '</h3>' +
                '<div class="flex items-center gap-3">' +
                    '<span class="badge">' + eleves.length + ' élève' + (eleves.length > 1 ? 's' : '') + '</span>' +
                    '<button class="annotation-toggle-btn text-white hover:text-indigo-200 text-sm leading-none" title="Annotation">&#9998;</button>' +
                    '<button class="delete-group-btn text-white hover:text-red-300 font-bold text-sm leading-none" title="Supprimer ce groupe">&#128465;</button>' +
                '</div>' +
            '</div>' +
            '<div class="p-3">' +
                '<div class="students-zone"></div>' +
                '<div class="annotations-container hidden mt-3 border-t pt-3 border-gray-200">' +
                    '<div class="annotations-list space-y-2 mb-3"></div>' +
                    '<form class="annotation-form flex gap-2" onsubmit="event.preventDefault(); addGroupeAnnotation(this)">' +
                        '<textarea name="texte" placeholder="Nouvelle annotation…" rows="2" required class="annotation-new-input border rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 resize-none"></textarea>' +
                        '<button type="submit" class="bg-indigo-600 text-white text-xs rounded px-2 py-1 hover:bg-indigo-700 transition self-end">Ajouter</button>' +
                    '</form>' +
                '</div>' +
            '</div>';
        var zone = div.querySelector(".students-zone");
        eleves.forEach(function(e) { zone.appendChild(createStudentCard(e)); });
        container.appendChild(div);
        div.querySelector(".delete-group-btn").addEventListener("click", function(ev) { ev.stopPropagation(); deleteGroup(div); });
        groupCount++;
    }

    if (groupes.length === 0) { addGroup(); addGroup(); renderAddButton(); }

    enableDropZones();
    enableRenameGroups();
    renderAddButton();
    enableDragStudents();

    var unassignedEleves = await _apiClient.get("/api/eleves?classe_id=" + classeId + "&projet_id=" + projetId + "&groupe_id=0&present=true");
    currentEleves = unassignedEleves;
    unassignedEleves.forEach(function(e) { unassigned.appendChild(createStudentCard(e)); });
    enableDragStudents();
    updateCounters();
}

// --- Carte élève ---
function createStudentCard(eleve) {
    var div = document.createElement("div");
    div.className = "student-card";
    div.draggable = true;
    div.dataset.id = eleve.id;
    div.textContent = eleve.prenom + " " + eleve.nom;
    return div;
}

// --- Reset ---
function resetGroups() {
    container.innerHTML = "";
    groupCount = 0;
    addGroup();
    addGroup();
    renderAddButton();
}

// --- Ajout groupe ---
function addGroup() {
    if (groupCount >= 26) return;
    var letter = String.fromCharCode(65 + groupCount);
    var div = document.createElement("div");
    div.className = "bg-white rounded-lg shadow group-box overflow-hidden";
    div.innerHTML =
        '<div class="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white px-4 py-3 flex justify-between items-center gap-3">' +
            '<h3 class="group-title font-semibold text-sm cursor-pointer select-none hover:text-indigo-200">Groupe ' + letter + '</h3>' +
            '<div class="flex items-center gap-3">' +
                '<span class="badge">0 élève</span>' +
                '<button class="annotation-toggle-btn text-white hover:text-indigo-200 text-sm leading-none" title="Annotation">&#9998;</button>' +
                '<button class="delete-group-btn text-white hover:text-red-300 font-bold text-sm leading-none" title="Supprimer ce groupe">&#128465;</button>' +
            '</div>' +
        '</div>' +
        '<div class="p-3">' +
            '<div class="students-zone"></div>' +
            '<div class="annotations-container hidden mt-3 border-t pt-3 border-gray-200">' +
                '<div class="annotations-list space-y-2 mb-3"></div>' +
                '<form class="annotation-form flex gap-2" onsubmit="return addGroupeAnnotation(this)">' +
                    '<textarea name="texte" placeholder="Nouvelle annotation…" rows="2" required class="annotation-new-input border rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 resize-none"></textarea>' +
                    '<button type="submit" class="bg-indigo-600 text-white text-xs rounded px-2 py-1 hover:bg-indigo-700 transition self-end">Ajouter</button>' +
                '</form>' +
            '</div>' +
        '</div>';
    container.appendChild(div);
    div.querySelector(".delete-group-btn").addEventListener("click", function(ev) { ev.stopPropagation(); deleteGroup(div); });
    enableDropZones();
    enableRenameGroups();
    updateCounters();
    groupCount++;
    renderAddButton();
}

// --- Suppression groupe ---
async function deleteGroup(groupBox) {
    if (!confirm("Supprimer ce groupe ? Les élèves seront replacés dans la liste des non affectés.")) return;
    var groupeId = groupBox.dataset.groupeId;
    var cards = groupBox.querySelectorAll(".student-card");
    cards.forEach(function(card) { unassigned.appendChild(card); });
    groupBox.remove();
    groupCount--;
    reletterGroups();
    updateCounters();
    renderAddButton();
    await saveAssignments();
    if (groupeId) {
        try { await _apiClient.del("/api/groupes/" + groupeId); } catch (e) { /* ignore */ }
    }
}

function reletterGroups() {
    container.querySelectorAll(".group-box").forEach(function(box, i) {
        var title = box.querySelector(".group-title");
        if (title) title.textContent = "Groupe " + String.fromCharCode(65 + i);
    });
}

function renderAddButton() {
    var existing = container.querySelector(".add-group-btn");
    if (existing) existing.remove();
    if (groupCount >= 26) return;
    var div = document.createElement("div");
    div.className = "add-group-btn";
    div.innerHTML = "<span>+</span>";
    div.addEventListener("click", addGroup);
    container.appendChild(div);
}

// --- Drag & drop ---
function enableDragStudents() {
    document.querySelectorAll(".student-card").forEach(function(card) {
        if (card.dataset.dragEnabled) return;
        card.dataset.dragEnabled = "1";
        card.addEventListener("dragstart", function() {
            draggedStudent = card;
            setTimeout(function() { card.style.display = "none"; }, 0);
        });
        card.addEventListener("dragend", function() {
            setTimeout(function() { card.style.display = "block"; draggedStudent = null; updateCounters(); }, 0);
        });
        card.addEventListener("dblclick", function(e) {
            if (card.closest(".students-zone") !== unassigned) {
                unassigned.appendChild(card);
                updateCounters();
                saveAssignments();
            }
        });
    });
}

function enableDropZones() {
    document.querySelectorAll(".students-zone").forEach(function(zone) {
        if (zone.dataset.dropEnabled) return;
        zone.dataset.dropEnabled = "1";
        zone.addEventListener("dragover", function(e) { e.preventDefault(); zone.classList.add("drag-over"); });
        zone.addEventListener("dragleave", function() { zone.classList.remove("drag-over"); });
        zone.addEventListener("drop", function(e) {
            e.preventDefault();
            zone.classList.remove("drag-over");
            if (draggedStudent) { zone.appendChild(draggedStudent); updateCounters(); saveAssignments(); }
        });
    });
}

// --- Renommage ---
function enableRenameGroups() {
    document.querySelectorAll(".group-title").forEach(function(title) {
        if (title.dataset.renameEnabled) return;
        title.dataset.renameEnabled = "1";
        title.addEventListener("dblclick", function() {
            var current = title.textContent.trim();
            var input = document.createElement("input");
            input.type = "text";
            input.value = current;
            input.className = "rename-input";
            title.replaceWith(input);
            input.focus();
            input.select();
            function save() {
                var val = input.value.trim() || current;
                var h3 = document.createElement("h3");
                h3.className = "group-title font-semibold text-sm cursor-pointer select-none hover:text-indigo-200";
                h3.textContent = val;
                var groupBox = input.closest(".group-box");
                var groupeId = groupBox ? groupBox.dataset.groupeId : null;
                input.replaceWith(h3);
                enableRenameGroups();
                if (groupeId && val !== current) {
                    _apiClient.put("/api/groupes/" + groupeId, { nom: val }).then(function() { saveAssignments(); }).catch(function() {});
                } else {
                    saveAssignments();
                }
            }
            input.addEventListener("keydown", function(e) { if (e.key === "Enter") save(); });
            input.addEventListener("blur", save);
        });
    });
}

// --- Annotations ---
async function loadGroupeAnnotations(box) {
    var groupeId = box.dataset.groupeId;
    if (!groupeId) return;
    var list = box.querySelector(".annotations-list");
    if (!list) return;
    try {
        var annotations = await _apiClient.get("/api/annotations?groupe_id=" + groupeId);
        list.innerHTML = annotations.length
            ? annotations.map(function(a) {
                return '<div class="annotation-entry flex justify-between items-start gap-2 text-sm">' +
                    '<div>' +
                        '<span class="text-xs text-gray-400">' + new Date(a.date_saisie).toLocaleDateString("fr-FR") + '</span>' +
                        '<p class="text-gray-700 whitespace-pre-wrap">' + a.texte.replace(/</g, "&lt;") + '</p>' +
                    '</div>' +
                    '<button onclick="deleteGroupeAnnotation(' + a.id + ', this)" class="text-red-400 hover:text-red-600 text-xs leading-none shrink-0" title="Supprimer">&#128465;</button>' +
                '</div>';
            }).join("")
            : '<p class="text-gray-400 italic text-sm">Aucune annotation.</p>';
    } catch (e) { /* ignore */ }
}

async function addGroupeAnnotation(form) {
    var box = form.closest(".group-box");
    var groupeId = box ? box.dataset.groupeId : null;
    if (!groupeId) { alert("Sauvegardez d'abord le groupe."); return; }
    var texte = form.querySelector("textarea").value.trim();
    if (!texte) return;
    try {
        await AnnotationsApi.create({ groupe_id: parseInt(groupeId), texte: texte });
        form.reset();
        form.querySelector("textarea").focus();
        await loadGroupeAnnotations(box);
    } catch (e) { /* ignore */ }
}

async function deleteGroupeAnnotation(id, btn) {
    if (!confirm("Supprimer cette annotation ?")) return;
    try {
        await AnnotationsApi.delete(id);
        var entry = btn.closest(".annotation-entry");
        if (entry) {
            var list = entry.parentElement;
            entry.remove();
            if (!list.querySelector(".annotation-entry")) {
                list.innerHTML = '<p class="text-gray-400 italic text-sm">Aucune annotation.</p>';
            }
        }
    } catch (e) { /* ignore */ }
}

// --- Compteurs ---
function updateCounters() {
    document.querySelectorAll(".group-box").forEach(function(group) {
        var count = group.querySelectorAll(".student-card").length;
        var badge = group.querySelector(".badge");
        if (badge) badge.textContent = count + (count > 1 ? " élèves" : " élève");
    });
}

// --- Sauvegarde ---
async function saveAssignments() {
    if (!currentProjetId) return;
    var groupMap = {};
    document.querySelectorAll(".group-box").forEach(function(box) {
        var name = (box.querySelector(".group-title") || {}).textContent || "";
        if (name) groupMap[name] = box;
    });

    document.querySelectorAll(".group-box").forEach(function(group) {
        var groupName = (group.querySelector(".group-title") || {}).textContent || "";
        var cards = group.querySelectorAll(".student-card");
        cards.forEach(function(card) {
            _apiClient.post("/api/assign", { eleve_id: parseInt(card.dataset.id), groupe: groupName, projet_id: currentProjetId }).then(function(data) {
                if (data.groupe_id && groupMap[groupName]) groupMap[groupName].dataset.groupeId = data.groupe_id;
            }).catch(function() {});
        });
    });

    var unassignedIds = Array.from(unassigned.querySelectorAll(".student-card")).map(function(card) { return parseInt(card.dataset.id); });
    for (var i = 0; i < unassignedIds.length; i++) {
        _apiClient.post("/api/unassign", { eleve_id: unassignedIds[i], projet_id: currentProjetId }).catch(function() {});
    }
}

// --- Init ---
(async function() {
    await loadClasses();

    var params = new URLSearchParams(location.search);
    var urlClasseId = params.get("classe_id");
    var urlProjetId = params.get("projet_id");

    if (urlClasseId) {
        classSelect.value = urlClasseId;
        currentClasseId = parseInt(urlClasseId);
        createProjetBtn.disabled = false;
        await loadProjets(currentClasseId);
        if (urlProjetId) selectProjet(parseInt(urlProjetId));
    }

    resetGroups();
    enableDropZones();
    enableRenameGroups();
})();

container.addEventListener("click", function(e) {
    var btn = e.target.closest(".annotation-toggle-btn");
    if (!btn) return;
    var box = btn.closest(".group-box");
    if (!box) return;
    var container_el = box.querySelector(".annotations-container");
    if (container_el) {
        var isHidden = container_el.classList.toggle("hidden");
        if (!isHidden) loadGroupeAnnotations(box);
    }
});
