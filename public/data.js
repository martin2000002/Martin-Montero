/**
 * CONFIGURACIÓN CENTRALIZADA
 * Simplemente agrega objetos a este arreglo para crear nuevas materias.
 * 
 * Estructura:
 * {
 *   id: 'identificador-unico',
 *   title: 'Nombre de la Materia',
 *   icon: 'Emoji o URL de icono',
 *   description: 'Breve descripción (opcional)',
 *   resources: [
 *     { title: 'Título del Link', url: 'https://...', type: 'Slides/Video/Doc' }
 *   ]
 * }
 */

export const data = [
    {
        id: 'con',
        title: 'Contabilidad Financiera',
        icon: '📊',
        description: '',
        resources: [
            { title: 'Presentación 1: Tipos de Empresas', url: 'https://docs.google.com/presentation/d/1cYXryVkhbyKzt_F8r8wjua_62JcmkP-McyHjCflTk94/edit?usp=sharing', type: 'Google Slides' },
        ]
    },
    {
        id: 'web',
        title: 'Desarrollo Web',
        icon: '🌐',
        description: 'Frontend moderno y arquitecturas escalables.',
        resources: [
            { title: 'Clase 1: HTML Semántico', url: '#', type: 'Diapositivas' },
            { title: 'Demo: CSS Grid', url: '#', type: 'CodePen' }
        ]
    },
    {
        id: 'db',
        title: 'Bases de Datos',
        icon: '💾',
        description: 'SQL, NoSQL y optimización de queries.',
        resources: [
            { title: 'Modelo Entidad Relación', url: '#', type: 'Miro Board' },
            { title: 'Scripts de prueba', url: '#', type: 'GitHub Gist' }
        ]
    },
    {
        id: 'ux',
        title: 'Diseño UX/UI',
        icon: '🎨',
        description: 'Psicología del color y prototipado.',
        resources: [
            { title: 'Figma System', url: '#', type: 'Figma' }
        ]
    }
];