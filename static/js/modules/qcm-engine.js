/* =========================================================================
   QCM Engine — renders quiz activities and checks answers
   Replaces exemple/js/general.js action() + exemple/js/quiz.js
   ========================================================================= */

var QcmEngine = (function () {
  var etiquettes = [];
  var ctrlCheck = [];

  // --- Shuffle array (Fisher-Yates) ---
  function shuffle(tab) {
    var arr = tab.slice();
    var i = arr.length, j, tmp;
    while (i) {
      j = Math.floor(Math.random() * i);
      i--;
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  // --- Build option tags from array ---
  function buildOptions(tab) {
    var html = "";
    for (var m = 0; m < tab.length; m++) {
      html += '<option value="' + (m + 1) + '">' + tab[m] + "</option>";
    }
    return html;
  }

  // --- Reset verification array ---
  function raz(n) {
    ctrlCheck = [];
    for (var i = 0; i < n; i++) {
      ctrlCheck[i] = 0;
    }
  }

  // --- Check single answer ---
  function check(val, numEtiqu) {
    var idx = parseInt(val, 10);
    if (!isNaN(idx) && idx > 0 && etiquettes[numEtiqu].possible[idx - 1] === etiquettes[numEtiqu].correct) {
      ctrlCheck[numEtiqu] = 1;
    } else {
      ctrlCheck[numEtiqu] = 0;
    }
  }

  // --- Verify all answers ---
  function teste(nbQuest) {
    var sum = 0;
    for (var i = 0; i < nbQuest; i++) {
      sum += ctrlCheck[i] || 0;
    }
    if (sum === nbQuest) {
      window.alert("BRAVO !\nVous avez trouv&eacute; toutes les r&eacute;ponses");
    } else {
      window.alert("Ce n'est pas juste.\nEssayez encore !");
    }
  }

  // --- Build quiz selectors ---
  function buildSelecteurs(chapIdx, exoIdx, chapitres, contentArea) {
    var act = chapitres[chapIdx].Activites[exoIdx];
    var listes = act.Listes || [];
    var etiqsData = act.Etiquettes || [];
    etiquettes = [];
    ctrlCheck = [];

    // Build randomized response arrays per liste
    var reponsesAlea = [];
    for (var n = 0; n < listes.length; n++) {
      reponsesAlea[n] = shuffle(listes[n].Reponses);
    }

    // Instantiate etiquettes
    for (var k = 0; k < etiqsData.length; k++) {
      var e = etiqsData[k];
      var listeNum = e.Liste_Num !== undefined ? e.Liste_Num : 0;
      var correct = listes[listeNum].Reponses[e.Rep_good];
      var possible = reponsesAlea[listeNum];
      etiquettes[k] = {
        correct: correct,
        x: e.X,
        y: e.Y,
        possible: possible,
      };
    }

    raz(etiqsData.length);

    // Build styles and select elements
    var html = "";
    for (var i = 0; i < etiquettes.length; i++) {
      html +=
        '<div id="qcm-case' +
        i +
        '" class="qcm-label" style="left:' +
        etiquettes[i].x +
        "px;top:" +
        etiquettes[i].y +
        'px">' +
        '<select class="qcm-select" onchange="QcmEngine._check(this.options[this.selectedIndex].value,' +
        i +
        ')">' +
        '<option value="?" selected>Votre choix...</option>' +
        buildOptions(etiquettes[i].possible) +
        "</select></div>";
    }

    // Verify button
    html +=
      '<div id="qcm-check-area">' +
      '<p class="qcm-what">Trouvez les bons mots de vocabulaire<br>puis ... <br><br>' +
      '<button class="qcm-check-btn" onclick="QcmEngine._teste(' +
      etiqsData.length +
      ')">V&eacute;rifier</button></p>' +
      "</div>";

    // Close button
    html +=
      '<div id="qcm-close">' +
      '<button class="qcm-close-btn" onclick="QcmEngine._close()">X</button>' +
      "</div>";

    // Background image — N_Img is directly the image URL
    var imgUrl = act.N_Img;
    if (/^https?:\/\//.test(imgUrl)) {
      imgSrc = imgUrl;
    } else {
      imgSrc = API_BASE + "/api/activites/image-proxy/" + encodeURIComponent(imgUrl);
    }
    html =
      '<div id="qcm-img-container"><img src="' +
      imgSrc +
      '" alt="quiz" /></div>' +
      html;

    contentArea.innerHTML = html;
    contentArea.classList.remove("hidden");
  }

  // --- Close quiz, return to menu ---
  function close() {
    window.location.href = window.location.pathname;
  }

  // --- Main action dispatcher ---
  function load(chapitres, contentArea) {
    var url = new URL(window.location.href);
    var chapIdx = url.searchParams.get("chap");
    var exoIdx = url.searchParams.get("exo");
    var mvIdx = url.searchParams.get("mv");

    if (chapIdx !== null) {
      chapIdx = parseInt(chapIdx, 10);
      var chap = chapitres[chapIdx];
      if (!chap) {
        contentArea.innerHTML = "<p>Chapitre introuvable.</p>";
        return;
      }

      if (exoIdx !== null) {
        exoIdx = parseInt(exoIdx, 10);
        var act = chap.Activites[exoIdx];
        if (!act) {
          contentArea.innerHTML = "<p>Activit&eacute; introuvable.</p>";
          return;
        }
        buildSelecteurs(chapIdx, exoIdx, chapitres, contentArea);
      } else if (mvIdx !== null) {
        mvIdx = parseInt(mvIdx, 10);
        var mv = chap.Activites[mvIdx];
        if (!mv || !mv.Lnk_Act) {
          contentArea.innerHTML = "<p>Vid&eacute;o introuvable.</p>";
          return;
        }
        contentArea.innerHTML =
          '<div class="qcm-player"><video controls>' +
          '<source src="' +
          mv.Lnk_Act +
          '" type="video/mp4">' +
          "<p>Votre navigateur ne supporte pas la vid&eacute;o HTML5.</p>" +
          "</video></div>" +
          '<div id="qcm-close"><button class="qcm-close-btn" onclick="QcmEngine._close()">X</button></div>';
        contentArea.classList.remove("hidden");
      }
    } else {
      contentArea.classList.add("hidden");
    }
  }

  return {
    _check: check,
    _teste: teste,
    _close: close,
    load: load,
  };
})();
