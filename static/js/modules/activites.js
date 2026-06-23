// --- Activites page (CRUD, attributions, listes, positionnement) ---

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
  allImgs = await ActivitesApi.listImages();
  allLiens = await ActivitesApi.listLiens();
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
      var created = await ActivitesApi.create(data);
      if (data.Type_Act === 2 && data.No_Lien) {
        await ActivitesApi.assocType({ No_Act: created.No_Act, Type_Act: 2, No_Lien: parseInt(data.No_Lien) });
      }
      e.target.reset();
      document.getElementById("new-act-img-select").classList.remove("hidden");
      document.getElementById("new-act-lien-select").classList.add("hidden");
      toast("Activité créée !");
      loadActivites();
    } catch (err) { toast(err.message, "error"); }
  });
  })();
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
  var activites = await ActivitesApi.list();
  var list = document.getElementById("activites-list");
  if (!list) return;
  list.innerHTML = activites.map(function(a) {
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

    var cardBg = a.Type_Act === 1 ? 'bg-blue-50' : 'bg-green-50';
    return '<div class="' + cardBg + ' rounded-lg shadow p-4 border ' + (a.Type_Act === 1 ? 'border-blue-100' : 'border-green-100') + '" data-id="' + a.No_Act + '">' +
      '<div class="card-row">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-2 mb-1">' +
            '<h3 class="font-semibold text-gray-900 activite-name cursor-pointer hover:text-indigo-600 truncate"' + (a.lien_url ? ' data-lien="' + a.lien_url + '"' : '') + '>' + a.Name_Act + '</h3>' +
          '</div>' +
          '<div class="flex items-center gap-2 text-xs text-gray-500">' +
            '<select onchange="changeActType(' + a.No_Act + ', this)" class="border rounded px-1 py-0 text-xs">' +
              '<option value="1"' + (a.Type_Act === 1 ? ' selected' : '') + '>Quizz</option>' +
              '<option value="2"' + (a.Type_Act === 2 ? ' selected' : '') + '>Lien</option>' +
            '</select>' +
            resSelector +
            chaps + nivs +
          '</div>' +
        '</div>' +
        '<button onclick="deleteActivite(' + a.No_Act + ')" class="text-red-500 hover:text-red-700 text-sm ml-2 shrink-0" title="Supprimer">&#128465;</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

async function changeActType(id, select) {
  var newType = parseInt(select.value);
  try {
    await ActivitesApi.update(id, { Type_Act: newType });
    loadActivites();
  } catch (err) { toast(err.message, "error"); loadActivites(); }
}

async function changeActImg(id, imgId) {
  try {
    await ActivitesApi.assocType({ No_Act: id, Type_Act: 1, No_dImg: parseInt(imgId) || 0 });
    loadActivites();
  } catch (err) { toast(err.message, "error"); }
}

async function changeActLien(id, lienId) {
  try {
    await ActivitesApi.assocType({ No_Act: id, Type_Act: 2, No_Lien: parseInt(lienId) || 0 });
    loadActivites();
  } catch (err) { toast(err.message, "error"); }
}

async function deleteActivite(id) {
  if (!confirm("Supprimer cette activité ?")) return;
  try {
    await ActivitesApi.delete(id);
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
    if (h3.dataset.lien) newH3.dataset.lien = h3.dataset.lien;
    input.replaceWith(newH3);
    if (val !== currentName) {
      try {
        await ActivitesApi.update(id, { Name_Act: val });
      } catch (err) {
        newH3.textContent = currentName;
      }
    }
  }

  input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
  input.addEventListener("blur", doSave);
}

if (document.getElementById("activites-list")) {
  loadNiveaux();
  document.getElementById("activites-list").addEventListener("click", function(e) {
    if (e.target.closest("button, input, form, textarea, select, a")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) { clearTimeout(card._clickTimer); card._clickTimer = null; return; }
    card._clickTimer = setTimeout(function() {
      card._clickTimer = null;
      var h3 = card.querySelector("h3.activite-name");
      if (h3 && h3.dataset.lien) {
        window.open(h3.dataset.lien, "_blank");
      }
    }, 250);
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
      await ActivitesApi.createChapitre(Object.fromEntries(form));
      e.target.reset();
      toast("Chapitre créé !");
      loadChapitres();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadChapitres() {
  var chaps = await ActivitesApi.listChapitres();
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
    await ActivitesApi.deleteChapitre(id);
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
        try { await ActivitesApi.updateChapitre(id, { Name_Chap: val }); }
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
      await ActivitesApi.createNiveau(Object.fromEntries(form));
      e.target.reset();
      toast("Niveau créé !");
      loadNiveaux();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadNiveaux() {
  var nivs = await ActivitesApi.listNiveaux();
  var list = document.getElementById("niveaux-list");
  if (!list) return;
  list.innerHTML = nivs.map(function(n) {
    var qcmInfo = [];
    if (n.qcm_bg) qcmInfo.push('bg: ' + n.qcm_bg + '.jpg');
    if (n.qcm_theme) qcmInfo.push('<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:' + n.qcm_theme + ';"></span> ' + n.qcm_theme);
    var qcmMeta = qcmInfo.length ? ' <span class="text-xs text-gray-400">(' + qcmInfo.join(', ') + ')</span>' : '';

    var activeVal = n.qcm_active ? 1 : 0;
    var activeLabel = n.qcm_active ? 'Actif' : 'Inactif';
    var activeClass = n.qcm_active ? 'text-green-600' : 'text-red-400';

    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + n.No_Niv + '">' +
      '<div class="flex-1 min-w-0">' +
        '<h3 class="font-semibold text-gray-900 niv-name cursor-pointer hover:text-indigo-600">' + n.Name_Niv + qcmMeta + '</h3>' +
      '</div>' +
      '<span class="flex items-center gap-1 text-xs ' + activeClass + ' cursor-pointer ml-3 shrink-0 qcm-active-tog" onclick="toggleQcmActive(' + n.No_Niv + ', this)" data-active="' + activeVal + '">' +
        '<span class="qcm-toggle' + (n.qcm_active ? ' active' : '') + '"></span>' +
        activeLabel +
      '</span>' +
      '<button onclick="deleteNiv(' + n.No_Niv + ')" class="text-red-500 hover:text-red-700 text-sm ml-2 shrink-0">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function toggleQcmActive(id, el) {
  var newVal = el.dataset.active === '1' ? 0 : 1;
  try {
    await ActivitesApi.updateNiveau(id, { qcm_active: newVal });
    el.dataset.active = String(newVal);
    var tog = el.querySelector('.qcm-toggle');
    if (newVal) {
      el.className = el.className.replace('text-red-400', 'text-green-600');
      tog.classList.add('active');
      el.lastChild.textContent = 'Actif';
    } else {
      el.className = el.className.replace('text-green-600', 'text-red-400');
      tog.classList.remove('active');
      el.lastChild.textContent = 'Inactif';
    }
  } catch (err) { toast(err.message, 'error'); }
}

async function deleteNiv(id) {
  if (!confirm("Supprimer ce niveau ?")) return;
  try {
    await ActivitesApi.deleteNiveau(id);
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
    var currentName = h3.childNodes[0] ? h3.childNodes[0].textContent.trim() : '';

    ActivitesApi.listNiveaux().then(function(nivs) {
      var niv = nivs.filter(function(x) { return x.No_Niv === id; })[0];
      if (!niv) return;
      var container = h3.parentElement;

      var form = document.createElement("div");
      form.className = "flex flex-wrap items-center gap-2";
      form.innerHTML =
        '<input type="text" class="border rounded px-2 py-1 text-sm w-40 font-semibold" value="' + currentName + '" placeholder="Nom">' +
        '<input type="text" class="border rounded px-2 py-1 text-sm w-24" value="' + (niv.qcm_bg || '') + '" placeholder="Fond">' +
        '<input type="text" class="border rounded px-2 py-1 text-sm w-28" value="' + (niv.qcm_theme || '') + '" placeholder="Couleur">';

      container.innerHTML = "";
      container.appendChild(form);

      var inputs = form.querySelectorAll("input");
      var nameInput = inputs[0];
      var bgInput = inputs[1];
      var themeInput = inputs[2];
      nameInput.focus();
      nameInput.select();

      async function doSave() {
        var val = nameInput.value.trim() || currentName;
        var bgVal = bgInput.value.trim() || null;
        var themeVal = themeInput.value.trim() || null;

        var newContent = document.createElement("div");
        newContent.className = "flex-1 min-w-0";

        var qcmInfo = [];
        if (bgVal) qcmInfo.push('bg: ' + bgVal + '.jpg');
        if (themeVal) qcmInfo.push('<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background:' + themeVal + ';"></span> ' + themeVal);
        var qcmMeta = qcmInfo.length ? ' <span class="text-xs text-gray-400">(' + qcmInfo.join(', ') + ')</span>' : '';

        var newH3 = document.createElement("h3");
        newH3.className = "font-semibold text-gray-900 niv-name cursor-pointer hover:text-indigo-600";
        newH3.innerHTML = val + qcmMeta;
        newContent.appendChild(newH3);
        container.replaceWith(newContent);

        if (val !== currentName || bgVal !== (niv.qcm_bg || null) || themeVal !== (niv.qcm_theme || null)) {
          try {
            await ActivitesApi.updateNiveau(id, { Name_Niv: val, qcm_bg: bgVal, qcm_theme: themeVal });
          } catch (err) {
            newH3.innerHTML = currentName + (qcmInfo.length ? ' <span class="text-xs text-gray-400">(' + qcmInfo.join(', ') + ')</span>' : '');
          }
        }
      }

      function setupInlineInput(input) {
        input.addEventListener("keydown", function(e) { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
        input.addEventListener("blur", function() {
          setTimeout(function() {
            if (!form.contains(document.activeElement)) { doSave(); }
          }, 150);
        });
      }
      setupInlineInput(nameInput);
      setupInlineInput(bgInput);
      setupInlineInput(themeInput);
    });
  });
}

// ======================== IMAGES ========================
if (document.getElementById("create-image")) {
  document.getElementById("create-image").addEventListener("submit", async function(e) {
    e.preventDefault();
    var form = new FormData(e.target);
    try {
      await ActivitesApi.createImage(Object.fromEntries(form));
      e.target.reset();
      toast("Image créée !");
      loadImages();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadImages() {
  var imgs = await ActivitesApi.listImages();
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
    await ActivitesApi.deleteImage(id);
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
        try { await ActivitesApi.updateImage(id, { N_Img: val }); }
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
      await ActivitesApi.createLien(Object.fromEntries(form));
      e.target.reset();
      toast("Lien créé !");
      loadLiens();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadLiens() {
  var liens = await ActivitesApi.listLiens();
  var list = document.getElementById("liens-list");
  if (!list) return;
  list.innerHTML = liens.map(function(l) {
    return '<div class="bg-white rounded-lg shadow p-3 flex justify-between items-center" data-id="' + l.No_Lien + '">' +
      '<div class="flex-1 min-w-0">' +
        '<h3 class="font-semibold text-gray-900 lien-url cursor-pointer hover:text-indigo-600 truncate">' + l.Link + '</h3>' +
        '<div class="text-xs text-gray-400 mt-1">Activité : ' + (l.act_name || '—') + '</div>' +
      '</div>' +
      '<button onclick="deleteLien(' + l.No_Lien + ')" class="text-red-500 hover:text-red-700 text-sm ml-3 shrink-0">&#128465;</button>' +
    '</div>';
  }).join("");
}

async function deleteLien(id) {
  if (!confirm("Supprimer ce lien ?")) return;
  try {
    await ActivitesApi.deleteLien(id);
    toast("Lien supprimé.");
    loadLiens();
  } catch (err) { toast(err.message, "error"); }
}

if (document.getElementById("liens-list")) {
  document.getElementById("liens-list").addEventListener("click", function(e) {
    if (e.target.closest("button, input, form, textarea")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) { clearTimeout(card._clickTimer); card._clickTimer = null; return; }
    var h3 = card.querySelector("h3.lien-url");
    card._clickTimer = setTimeout(function() {
      card._clickTimer = null;
      if (h3) {
        window.open(h3.textContent.trim(), "_blank");
      }
    }, 250);
  });

  document.getElementById("liens-list").addEventListener("dblclick", function(e) {
    if (e.target.closest("button")) return;
    var card = e.target.closest("[data-id]");
    if (!card) return;
    if (card._clickTimer) { clearTimeout(card._clickTimer); card._clickTimer = null; }
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
        try { await ActivitesApi.updateLien(id, { Link: val }); }
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
      await ActivitesApi.createReponse(Object.fromEntries(form));
      e.target.reset();
      toast("Réponse créée !");
      loadReponses();
    } catch (err) { toast(err.message, "error"); }
  });
}

async function loadReponses() {
  var reps = await ActivitesApi.listReponses();
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
    await ActivitesApi.deleteReponse(id);
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
        try { await ActivitesApi.updateReponse(id, { Reponse: val }); }
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
  allAttribActivites = await ActivitesApi.list();
  allAttribChapitres = await ActivitesApi.listChapitres();
  allAttribNiveaux = await ActivitesApi.listNiveaux();
  allAttribNivRows = await ActivitesApi.listAttribChapNiv();
  setupAttribAC();
}

function setupAttribAC() {
  renderAttribAC();
}

function renderAttribAC() {
  var table = document.getElementById("ac-matrix-table");
  if (!table || table._loading) return;
  table._loading = true;

  ActivitesApi.getAttribChap().then(function(chapLinks) {
    table._loading = false;
    var links = {};
    chapLinks.forEach(function(l) { links[l.No_dAct + "-" + l.No_dChap] = true; });

    var html = "<thead><tr><th style=\"min-width:200px\"></th>";
    allAttribChapitres.forEach(function(c) {
      html += "<th>" + c.Name_Chap + "</th>";
    });
    html += "</tr></thead><tbody>";

    allAttribActivites.forEach(function(a) {
      var rowClass = a.Type_Act === 1 ? 'act-quizz' : 'act-lien';
      html += "<tr class=\"" + rowClass + "\"><td class=\"chap-name\">" + a.Name_Act + "</td>";
      allAttribChapitres.forEach(function(c) {
        var checked = links[a.No_Act + "-" + c.No_chap] || false;
        html += "<td><input type=\"checkbox\" data-act=\"" + a.No_Act + "\" data-chap=\"" + c.No_chap + "\"" + (checked ? " checked" : "") + "></td>";
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
          checked.push(parseInt(c.dataset.chap));
        });
        ActivitesApi.setAttribChap({ activite_id: actId, chapitre_ids: checked }).catch(function() { toast("Erreur attribution", "error"); });
      });
    });
  });
}

function setupAttribAN() {
  renderAttribAN();
}

function renderAttribAN() {
  var table = document.getElementById("an-matrix-table");
  if (!table || table._loading) return;
  table._loading = true;

  ActivitesApi.getAttribNiveau().then(function(actLinks) {
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
      var rowClass = a.Type_Act === 1 ? 'act-quizz' : 'act-lien';
      html += "<tr class=\"" + rowClass + "\"><td class=\"chap-name\">" + a.Name_Act + "</td>";
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
        ActivitesApi.setAttribNiveau({ activite_id: actId, attrib_niv_ids: checked }).catch(function() { toast("Erreur attribution", "error"); });
      });
    });
  });
}

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
      ActivitesApi.updateAttribChapNiv({ chapitre_id: chapId, niveau_ids: checked }).then(function() {
        ActivitesApi.listAttribChapNiv().then(function(rows) { allAttribNivRows = rows; });
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

  ActivitesApi.getPositionnementActivities().then(function(acts) {
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
    ActivitesApi.getListes(actId).then(function(data) {
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

  ActivitesApi.listReponses().then(function(reps) {
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
  ActivitesApi.listReponses().then(function(reps) { renderListeReps(idx, reps); });
}

function removeRepFromListe(idx, ri) {
  listesData.lists[idx].reponses.splice(ri, 1);
  ActivitesApi.listReponses().then(function(reps) { renderListeReps(idx, reps); });
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
    ActivitesApi.saveListes({ act_id: listesData.act_id, lists: cleanLists })
      .then(function() { toast("Listes enregistrées."); })
      .catch(function(err) { toast(err.message, "error"); });
  });
}

if (document.getElementById("listes-delete-btn")) {
  document.getElementById("listes-delete-btn").addEventListener("click", function() {
    if (!listesData.act_id || !confirm("Supprimer toutes les listes de cette activité ?")) return;
    ActivitesApi.deleteListes(listesData.act_id)
      .then(function() {
        listesData.lists = [];
        listesCount = 0;
        renderListes();
        toast("Listes supprimées.");
      }).catch(function(err) { toast(err.message, "error"); });
  });
}
