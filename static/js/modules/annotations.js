// --- Annotations (shared across eleves page) ---

async function loadEleveAnnotations(card) {
  const eleveId = card.dataset.id;
  const list = card.querySelector(".annotations-list");
  try {
    const annotations = await AnnotationsApi.listByEleve(eleveId);
    list.innerHTML = annotations.length
      ? annotations.map(a => {
          const groupespan = a.groupe_nom
            ? ` - ${a.groupe_nom.replace(/</g, "&lt;")}`
            : "";
          const dateStr = new Date(a.date_saisie).toLocaleDateString("fr-FR");
          const hasLink = a.projet_id && a.classe_id;
          const metaContent = `${dateStr}${a.projet_nom ? " · " + a.projet_nom : ""}${groupespan}`;
          const metaHtml = hasLink
            ? `<a href="${API_BASE}/distribution?classe_id=${a.classe_id}&projet_id=${a.projet_id}" class="text-xs text-gray-400 hover:text-indigo-600">${metaContent}</a>`
            : `<span class="text-xs text-gray-400">${metaContent}</span>`;
          return `
        <div class="annotation-entry flex justify-between items-start gap-2 text-sm">
          <div>
            ${metaHtml}
            <p class="text-gray-700 whitespace-pre-wrap">${a.texte.replace(/</g, "&lt;")}</p>
          </div>
          <button onclick="deleteAnnotation(${a.id}, this)" class="text-red-400 hover:text-red-600 text-xs leading-none shrink-0" title="Supprimer">&#128465;</button>
        </div>`;
        }).join("")
      : '<p class="text-gray-400 italic text-sm">Aucune annotation.</p>';
  } catch (e) { /* ignore */ }
}

async function addEleveAnnotation(eleveId, form) {
  const texte = form.querySelector("textarea").value.trim();
  if (!texte) return;
  try {
    await AnnotationsApi.create({ eleve_id: eleveId, texte });
    form.reset();
    form.querySelector("textarea").focus();
    const card = form.closest(".eleve-card");
    if (card) await loadEleveAnnotations(card);
  } catch (err) { toast(err.message, "error"); }
}

async function deleteAnnotation(id, btn) {
  if (!confirm("Supprimer cette annotation ?")) return;
  try {
    await AnnotationsApi.delete(id);
    const entry = btn.closest(".annotation-entry");
    if (entry) {
      const list = entry.parentElement;
      entry.remove();
      if (!list.querySelector(".annotation-entry")) {
        list.innerHTML = '<p class="text-gray-400 italic text-sm">Aucune annotation.</p>';
      }
    }
  } catch (err) { toast(err.message, "error"); }
}
