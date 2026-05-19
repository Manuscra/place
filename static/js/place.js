/**
 * Script pour gestion dynamique des élèves et groupes
 * Gère les interactions AJAX et mises à jour en temps réel
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE = '/place/api';
const ANIMATION_DURATION = 300;

// ============================================================================
// UTILITAIRES
// ============================================================================

/**
 * Affiche un message de notification
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('global');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Insérer après le header
    const header = document.querySelector('header');
    if (header && header.nextSibling) {
        header.parentNode.insertBefore(alert, header.nextSibling);
    } else {
        container.insertBefore(alert, container.firstChild);
    }

    // Disparaître après 4 secondes
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

/**
 * Effectue une requête AJAX
 */
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(API_BASE + endpoint, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        showNotification('Erreur lors de la communication avec le serveur', 'danger');
        return null;
    }
}

/**
 * Crée un élément de groupe dynamiquement
 */
function createGroupElement(groupName, students = []) {
    const groupBox = document.createElement('div');
    groupBox.className = 'group-box';
    groupBox.id = `group-${groupName}`;

    const studentCount = students.length;

    groupBox.innerHTML = `
        <div class="group-header">
            <h3>Groupe ${groupName}</h3>
            <span class="group-count">${studentCount} élève(s)</span>
        </div>
        <div class="group-content">
            ${studentCount > 0 ? `
                <ul class="students-list">
                    ${students.map(eleve => `
                        <li class="student-item" data-id="${eleve.id}">
                            <span class="student-name">${eleve.nom} ${eleve.prenom}</span>
                            <button type="button" class="btn-remove" 
                                    onclick="removeStudent(${eleve.id}, '${groupName}')"
                                    title="Retirer de ce groupe">
                                ✕
                            </button>
                        </li>
                    `).join('')}
                </ul>
            ` : `
                <p class="empty-group"><em>Aucun élève</em></p>
            `}
        </div>
    `;

    return groupBox;
}

/**
 * Met à jour le compte d'élèves d'un groupe
 */
function updateGroupCount(groupName, count) {
    const groupBox = document.getElementById(`group-${groupName}`);
    if (groupBox) {
        const countSpan = groupBox.querySelector('.group-count');
        if (countSpan) {
            countSpan.textContent = `${count} élève(s)`;
        }
    }
}

/**
 * Ajoute un élève à la vue d'un groupe
 */
function addStudentToGroup(groupName, studentId, studentName) {
    const groupBox = document.getElementById(`group-${groupName}`);

    if (!groupBox) return;

    const groupContent = groupBox.querySelector('.group-content');
    let studentsList = groupBox.querySelector('.students-list');

    // S'il n'y a pas de liste, créer une
    if (!studentsList) {
        studentsList = document.createElement('ul');
        studentsList.className = 'students-list';
        groupContent.innerHTML = '';
        groupContent.appendChild(studentsList);
    }

    // Créer l'élément de l'élève
    const studentItem = document.createElement('li');
    studentItem.className = 'student-item';
    studentItem.setAttribute('data-id', studentId);
    studentItem.innerHTML = `
        <span class="student-name">${studentName}</span>
        <button type="button" class="btn-remove" 
                onclick="removeStudent(${studentId}, '${groupName}')"
                title="Retirer de ce groupe">
            ✕
        </button>
    `;

    // Ajouter avec animation
    studentsList.appendChild(studentItem);
    studentItem.style.opacity = '0';
    studentItem.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        studentItem.style.transition = 'all 0.3s ease';
        studentItem.style.opacity = '1';
        studentItem.style.transform = 'translateY(0)';
    }, 10);

    // Mettre à jour le compte
    const count = studentsList.querySelectorAll('li').length;
    updateGroupCount(groupName, count);
}

/**
 * Retire un élève de la vue d'un groupe
 */
function removeStudentFromView(studentId, groupName) {
    const groupBox = document.getElementById(`group-${groupName}`);

    if (!groupBox) return;

    const studentItem = groupBox.querySelector(`li[data-id="${studentId}"]`);

    if (studentItem) {
        // Animation de disparition
        studentItem.style.transition = 'all 0.3s ease';
        studentItem.style.opacity = '0';
        studentItem.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            studentItem.remove();

            // Vérifier s'il y a encore des élèves
            const studentsList = groupBox.querySelector('.students-list');
            if (studentsList && studentsList.querySelectorAll('li').length === 0) {
                const groupContent = groupBox.querySelector('.group-content');
                groupContent.innerHTML = '<p class="empty-group"><em>Aucun élève</em></p>';
            }

            // Mettre à jour le compte
            const remaining = studentsList ? studentsList.querySelectorAll('li').length : 0;
            updateGroupCount(groupName, remaining);
        }, 300);
    }
}

// ============================================================================
// FONCTIONS PRINCIPALES
// ============================================================================

/**
 * Retire un élève d'un groupe
 */
async function removeStudent(studentId, groupName) {
    if (!confirm('Êtes-vous sûr de vouloir retirer cet élève du groupe ?')) {
        return;
    }

    const result = await fetchAPI('/unassign', 'POST', {
        eleve_id: studentId,
        groupe: groupName
    });

    if (result && result.success) {
        removeStudentFromView(studentId, groupName);
        showNotification('Élève retiré du groupe', 'success');
    }
}

/**
 * Assigne rapidement un élève depuis la liste des non-affectés
 */
async function quickAssign(selectElement, studentId, classe) {
    const groupName = selectElement.value;

    if (!groupName) {
        return;
    }

    const result = await fetchAPI('/assign', 'POST', {
        eleve_id: studentId,
        groupe: groupName,
        classe: classe
    });

    if (result && result.success) {
        // Récupérer le nom de l'élève
        const liElement = selectElement.closest('li');
        const studentName = liElement.textContent.split('\n')[0];

        // Ajouter à la vue du groupe
        addStudentToGroup(groupName, studentId, studentName);

        // Retirer de la liste des non-affectés
        liElement.style.transition = 'all 0.3s ease';
        liElement.style.opacity = '0';
        liElement.style.height = '0';
        liElement.style.margin = '0';

        setTimeout(() => {
            liElement.remove();

            // Vérifier s'il reste des élèves non-affectés
            const unassignedList = document.querySelector('.unassigned-list');
            if (unassignedList && unassignedList.querySelectorAll('li').length === 0) {
                const container = document.getElementById('unassigned-container');
                if (container) {
                    container.style.display = 'none';
                }
            }
        }, 300);

        showNotification('Élève affecté au groupe', 'success');
    }
}

/**
 * Recharge les élèves non affectés
 */
async function reloadUnassignedStudents() {
    const classe = document.querySelector('select[name="classe"]')?.value;

    if (!classe) return;

    const result = await fetchAPI(`/students/${classe}`);

    if (result) {
        console.log('Élèves non affectés rechargés:', result);
        // Mettre à jour la liste (implémentation selon votre besoin)
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Script de gestion des groupes initialisé');

    // Ajouter des raccourcis clavier si nécessaire
    document.addEventListener('keydown', (event) => {
        // Ctrl+R pour rafraîchir
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            location.reload();
        }
    });
});

// ============================================================================
// EXPORT POUR DEBUGGING
// ============================================================================

// Exposer les fonctions au contexte global pour les tests
window.groupManager = {
    showNotification,
    fetchAPI,
    createGroupElement,
    removeStudent,
    quickAssign,
    reloadUnassignedStudents,
    addStudentToGroup,
    removeStudentFromView
};
