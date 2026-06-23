/* =========================================================================
   QCM Menu — builds the chapter/activity dropdown navigation
   Replaces exemple/js/general.js menu() function
   ========================================================================= */

var QcmMenu = (function () {
  function build(chapitres, container, nivName) {
    container.innerHTML = "";
    if (!chapitres || !chapitres.length) {
      container.innerHTML = "<p>Aucune activit&eacute; pour ce niveau.</p>";
      return;
    }

    var ul = document.createElement("ul");
    ul.className = "qcm-menu-bar";

    // Level name
    if (nivName) {
      var nivLi = document.createElement("li");
      nivLi.className = "qcm-niv-name";
      var nivSpan = document.createElement("span");
      nivSpan.textContent = nivName;
      nivLi.appendChild(nivSpan);
      ul.appendChild(nivLi);
    }

    // Home link
    var homeLi = document.createElement("li");
    homeLi.className = "qcm-home";
    var homeA = document.createElement("a");
    homeA.href = window.location.pathname;
    homeA.textContent = "Accueil";
    homeLi.appendChild(homeA);
    ul.appendChild(homeLi);

    for (var i = 0; i < chapitres.length; i++) {
      var chap = chapitres[i];
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#";
      a.textContent = chap.Chap_Name;
      li.appendChild(a);

      var subUl = document.createElement("ul");
      for (var j = 0; j < chap.Activites.length; j++) {
        var act = chap.Activites[j];
        var subLi = document.createElement("li");
        var subA = document.createElement("a");

        if (act.Type_Act === "quizz") {
          subA.href = "?chap=" + i + "&exo=" + j;
          subA.textContent = act.Act_Name;
        } else if (act.Type_Act === "video") {
          subA.href = "?chap=" + i + "&mv=" + j;
          subA.textContent = act.Act_Name;
        } else {
          // lien
          subA.href = act.Lnk_Act || "#";
          subA.target = "_blank";
          subA.textContent = act.Act_Name;
        }

        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      }

      li.appendChild(subUl);
      ul.appendChild(li);
    }

    container.innerHTML = "";
    container.appendChild(ul);
  }

  return { build: build };
})();
