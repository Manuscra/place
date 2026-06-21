var apiClient = (function () {
  "use strict";

  var API_BASE = window.API_BASE || "";

  function ApiClient() {}

  ApiClient.prototype._request = async function (url, options) {
    options = options || {};
    var res = await fetch(API_BASE + url, {
      headers: Object.assign({ "Content-Type": "application/json" }, options.headers || {}),
      body: options.body,
      method: options.method || "GET",
    });
    if (!res.ok) {
      var err = await res.json().catch(function () { return {}; });
      throw new Error(err.error || "HTTP " + res.status);
    }
    var text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Réponse invalide du serveur");
    }
  };

  ApiClient.prototype.get = function (url) { return this._request(url, { method: "GET" }); };
  ApiClient.prototype.post = function (url, data) { return this._request(url, { method: "POST", body: JSON.stringify(data) }); };
  ApiClient.prototype.put = function (url, data) { return this._request(url, { method: "PUT", body: JSON.stringify(data) }); };
  ApiClient.prototype.del = function (url) { return this._request(url, { method: "DELETE" }); };

  var client = new ApiClient();

  /* =========================== Classes =========================== */

  window.ClassesApi = {
    list: function ()           { return client.get("/api/classes"); },
    get: function (id)          { return client.get("/api/classes/" + id); },
    create: function (data)     { return client.post("/api/classes", data); },
    update: function (id, data) { return client.put("/api/classes/" + id, data); },
    delete: function (id)       { return client.del("/api/classes/" + id); },
    reset: function ()          { return client.post("/api/reset"); },
    importCsv: function (file)  {
      var formData = new FormData();
      formData.append("file", file);
      return fetch(API_BASE + "/api/import-csv", { method: "POST", body: formData }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "HTTP " + res.status);
          return data;
        });
      });
    },
  };

  /* =========================== Élèves =========================== */

  window.ElevesApi = {
    list: function (classeId)   { return client.get(classeId ? "/api/eleves?classe_id=" + classeId : "/api/eleves"); },
    listAll: function ()        { return client.get("/api/eleves"); },
    get: function (id)          { return client.get("/api/eleves/" + id); },
    create: function (data)     { return client.post("/api/eleves", data); },
    update: function (id, data) { return client.put("/api/eleves/" + id, data); },
    delete: function (id)       { return client.del("/api/eleves/" + id); },
    togglePresent: function (id, present) { return client.put("/api/eleves/" + id, { present: present }); },
  };

  /* =========================== Annotations =========================== */

  window.AnnotationsApi = {
    listByEleve: function (eleveId) { return client.get("/api/annotations?eleve_id=" + eleveId); },
    create: function (data)         { return client.post("/api/annotations", data); },
    delete: function (id)           { return client.del("/api/annotations/" + id); },
  };

  /* =========================== Activités =========================== */

  window.ActivitesApi = {
    list: function ()                 { return client.get("/api/activites"); },
    create: function (data)           { return client.post("/api/activites", data); },
    update: function (id, data)       { return client.put("/api/activites/" + id, data); },
    delete: function (id)             { return client.del("/api/activites/" + id); },
    assocType: function (data)        { return client.post("/api/activites/assoc-type", data); },

    listChapitres: function ()        { return client.get("/api/activites/chapitres"); },
    createChapitre: function (data)   { return client.post("/api/activites/chapitres", data); },
    updateChapitre: function (id, d)  { return client.put("/api/activites/chapitres/" + id, d); },
    deleteChapitre: function (id)     { return client.del("/api/activites/chapitres/" + id); },

    listNiveaux: function ()          { return client.get("/api/activites/niveaux"); },
    createNiveau: function (data)     { return client.post("/api/activites/niveaux", data); },
    updateNiveau: function (id, d)    { return client.put("/api/activites/niveaux/" + id, d); },
    deleteNiveau: function (id)       { return client.del("/api/activites/niveaux/" + id); },

    listImages: function ()           { return client.get("/api/activites/images"); },
    createImage: function (data)      { return client.post("/api/activites/images", data); },
    updateImage: function (id, d)     { return client.put("/api/activites/images/" + id, d); },
    deleteImage: function (id)        { return client.del("/api/activites/images/" + id); },

    listLiens: function ()            { return client.get("/api/activites/liens"); },
    createLien: function (data)       { return client.post("/api/activites/liens", data); },
    updateLien: function (id, d)      { return client.put("/api/activites/liens/" + id, d); },
    deleteLien: function (id)         { return client.del("/api/activites/liens/" + id); },

    listReponses: function ()         { return client.get("/api/activites/reponses"); },
    createReponse: function (data)    { return client.post("/api/activites/reponses", data); },
    updateReponse: function (id, d)   { return client.put("/api/activites/reponses/" + id, d); },
    deleteReponse: function (id)      { return client.del("/api/activites/reponses/" + id); },

    listAttribChapNiv: function ()    { return client.get("/api/activites/attrib/chap-niv"); },
    getAttribChap: function ()        { return client.get("/api/activites/attrib/chap"); },
    setAttribChap: function (data)    { return client.post("/api/activites/attrib/chap", data); },
    getAttribNiveau: function ()      { return client.get("/api/activites/attrib/niveau"); },
    setAttribNiveau: function (data)  { return client.post("/api/activites/attrib/niveau", data); },
    updateAttribChapNiv: function (d) { return client.post("/api/activites/attrib/chap-niv", d); },

    getPositionnementActivities: function () { return client.get("/api/activites/positionnement/activities"); },
    getListes: function (actId)              { return client.get("/api/activites/listes/" + actId); },
    saveListes: function (data)              { return client.post("/api/activites/listes", data); },
    deleteListes: function (actId)           { return client.del("/api/activites/listes/" + actId); },
  };

  /* =========================== Legacy compat =========================== */

  window._apiClient = client;
  return client;
})();
