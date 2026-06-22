/* =========================================================================
   QCM Alert — custom modal alert replacing browser alert()
   Ported from exemple/js/new_alert.js
   ========================================================================= */

(function () {
  var _origAlert = window.alert;

  window.alert = function (text, title) {
    if (typeof title === "undefined") {
      title = "R&eacute;sultat";
    }

    var box = document.createElement("div");
    box.className = "qcm-alert-box";

    // Title
    var titleEl = document.createElement("span");
    titleEl.className = "qcm-alert-title";
    titleEl.innerHTML = title;
    box.appendChild(titleEl);

    // Close button
    var closeBtn = document.createElement("button");
    closeBtn.className = "qcm-alert-close";
    closeBtn.textContent = "\u2715";
    closeBtn.onclick = function () {
      if (box.parentNode) {
        box.parentNode.removeChild(box);
      }
    };
    box.appendChild(closeBtn);

    // Content
    var content = document.createElement("span");
    content.className = "qcm-alert-content";
    content.innerHTML = text.replace(/\n/g, "<br>");
    box.appendChild(content);

    document.body.appendChild(box);

    // Center vertically
    function reposition() {
      box.style.marginTop = -(box.offsetHeight / 2) + "px";
    }
    reposition();
    setInterval(reposition, 200);
  };
})();
