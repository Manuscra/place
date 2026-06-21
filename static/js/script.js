// Point d'entrée — utilitaires partagés chargés en dernier
// Les modules (api.js, annotations.js, classes.js, eleves.js, activites.js) sont chargés avant

var API_BASE = window.API_BASE || "";

// Fetch wrapper — delegates to apiClient module
function api(url, options) {
  options = options || {};
  return _apiClient._request(url, options);
}

// Toast notification
function toast(message, type) {
  type = type || "success";
  var el = document.createElement("div");
  el.className = "fixed bottom-4 right-4 px-4 py-2 rounded text-white text-sm shadow-lg z-50 transition " +
    (type === "success" ? "bg-green-600" : "bg-red-600");
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

// TogglePresent — shared between classes and eleves pages
function togglePresent(id, checkbox) {
  var label = checkbox.closest("label");
  var present = checkbox.checked;
  label.classList.toggle("on", present);
  label.title = present ? "Inscrit" : "Désinscrit";
  try {
    ElevesApi.togglePresent(id, present);
  } catch (e) {
    checkbox.checked = !present;
    label.classList.toggle("on", !present);
    label.title = !present ? "Inscrit" : "Désinscrit";
    toast(e.message, "error");
  }
}
