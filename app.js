import { data } from './data.js';

const app = document.getElementById('app');

// Estado simple para navegación
let currentView = 'home'; // 'home' | 'details'
let activeSubjectId = null;

/**
 * Renderiza la vista principal (Grid de Materias)
 */
function renderHome() {
    currentView = 'home';
    activeSubjectId = null;
    
    app.innerHTML = `
        <header>
            <h1>Mis Recursos</h1>
            <p class="subtitle">Repositorio centralizado de presentaciones y materiales</p>
        </header>
        <div class="grid-container">
            ${data.map(subject => `
                <div class="card" onclick="window.openSubject('${subject.id}')">
                    <div>
                        <div class="card-icon">${subject.icon}</div>
                        <h2 class="card-title">${subject.title}</h2>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">${subject.description || ''}</p>
                    </div>
                    <div class="card-count">
                        <span>${subject.resources.length} recursos</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Renderiza la vista de detalles (Lista de links de una materia)
 * @param {string} id - ID de la materia
 */
function renderSubject(id) {
    const subject = data.find(item => item.id === id);
    if (!subject) return;

    currentView = 'details';
    activeSubjectId = id;

    // Animación de salida (opcional, simplificada aquí con re-render directo)
    app.innerHTML = `
        <div class="detail-view">
            <button class="back-btn" onclick="window.goBack()">
                ← Volver a materias
            </button>
            
            <header style="text-align: left; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${subject.icon}</div>
                <h1>${subject.title}</h1>
                <p class="subtitle">${subject.description || 'Lista de recursos disponibles'}</p>
            </header>

            <div class="link-list">
                ${subject.resources.length > 0 ? subject.resources.map(res => `
                    <a href="${res.url}" class="link-item" target="_blank" rel="noopener noreferrer">
                        <div class="link-info">
                            <h3>${res.title}</h3>
                            <span>${res.type}</span>
                        </div>
                        <div class="link-icon">↗</div>
                    </a>
                `).join('') : '<p style="color: var(--text-secondary)">No hay recursos publicados aún.</p>'}
            </div>
        </div>
    `;
}

// Exponer funciones al objeto window para que funcionen en el HTML string
window.openSubject = (id) => {
    // Pequeño hack para transición visual
    renderSubject(id);
    window.scrollTo(0,0);
};

window.goBack = () => {
    renderHome();
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
});