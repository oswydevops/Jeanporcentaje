// Panel Principal
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
/**
 * Sistema de traducción para la aplicación
 * Define los textos en diferentes idiomas
 */
const translations = {
    es: {
        // Notificaciones
        'Please enter a valid number greater than 0': 'Por favor ingresa un número válido mayor a 0',
        'Points added successfully': 'Puntos agregados correctamente',
        'Error adding points': 'Error al agregar puntos',
        'Connection error': 'Error de conexión',
        'Configuration updated successfully': 'Configuración actualizada correctamente',
        'Error updating configuration': 'Error al actualizar la configuración',
        'Progress reset successfully': 'Progreso reiniciado correctamente',
        'Error resetting progress': 'Error al reiniciar el progreso',
        'Points per click must be greater than or equal to 0.01': 'Los puntos por clic deben ser mayor o igual a 0.01',
        'Error subtracting points': 'Error al restar puntos',
        
        // Niveles y logros
        'No levels configured': 'Aún no hay niveles configurados',
        'The administrator can add levels from the control panel': 'El administrador puede agregar niveles desde el panel de control',
        'Error loading levels': 'No se pudieron cargar los niveles',
        'Error loading progress': 'Error al cargar el progreso',
        'This level has no reward configured': 'Este nivel no tiene recompensa configurada',
        'Error opening achievement': 'Error al abrir el logro',
        'Error connecting to open achievement': 'Error de conexión al abrir el logro',
        'Claimed': 'Reclamado',
        'Tap to open!': '¡Toca para abrir!',
        'To reach': 'Por alcanzar',
        'Current progress': 'Progreso actual',
        'of total': 'del total',
        'Level': 'Nivel',
        'unlocked': 'desbloqueado',
        
        // Confirmaciones
        'Are you sure you want to reset progress to 0?': '¿Estás seguro de que quieres reiniciar el progreso a 0?',

        // === INICIO NUEVAS TRADUCCIONES PARA HTML ===
        'Current Points': 'Puntos Actuales',
        'of': 'de',
        'Add Points': 'Sumar Puntos',
        'Levels': 'Niveles y Logros',
        'Admin Panel': 'Panel de Administración',
        'View Main Panel': 'Ver Panel Principal',
        'Statistics': 'Estadísticas',
        'Progress Visualization': 'Visualización del Progreso',
        'System Configuration': 'Configuración del Sistema',
        'Quick Actions': 'Acciones Rápidas',
        'Reset Progress to 0': 'Reiniciar Progreso a 0',
        'Points to add': 'Puntos a agregar',
        'Points to subtract': 'Puntos a restar',
        'Subtract Points': 'Restar Puntos'
        // === FIN NUEVAS TRADUCCIONES PARA HTML ===
    },
    fr: {
        // Notifications
        'Please enter a valid number greater than 0': 'Veuillez entrer un nombre valide supérieur à 0',
        'Points added successfully': 'Points ajoutés avec succès',
        'Error adding points': 'Erreur lors de l\'ajout de points',
        'Connection error': 'Erreur de connexion',
        'Configuration updated successfully': 'Configuration mise à jour avec succès',
        'Error updating configuration': 'Erreur lors de la mise à jour de la configuration',
        'Progress reset successfully': 'Progression réinitialisée avec succès',
        'Error resetting progress': 'Erreur lors de la réinitialisation de la progression',
        'Points per click must be greater than or equal to 0.01': 'Les points par clic doivent être supérieurs ou égaux à 0.01',
        'Error subtracting points': 'Erreur lors de la soustraction de points',
        
        // Niveaux et succès
        'No levels configured': 'Aucun niveau configuré',
        'The administrator can add levels from the control panel': 'L\'administrateur peut ajouter des niveaux depuis le panneau de contrôle',
        'Error loading levels': 'Impossible de charger les niveaux',
        'Error loading progress': 'Erreur lors du chargement de la progression',
        'This level has no reward configured': 'Ce niveau n\'a pas de récompense configurée',
        'Error opening achievement': 'Erreur lors de l\'ouverture du succès',
        'Error connecting to open achievement': 'Erreur de connexion lors de l\'ouverture du succès',
        'Claimed': 'Réclamé',
        'Tap to open!': 'Touchez pour ouvrir !',
        'To reach': 'À atteindre',
        'Current progress': 'Progression actuelle',
        'of total': 'du total',
        'Level': 'Niveau',
        'unlocked': 'débloqué',
        
        // Confirmations
        'Are you sure you want to reset progress to 0?': 'Êtes-vous sûr de vouloir réinitialiser la progression à 0 ?',

        // === INICIO NUEVAS TRADUCCIONES PARA HTML ===
        'Current Points': 'Points Actuels',
        'of': 'de',
        'Add Points': 'Ajouter des Points',
        'Levels': 'Niveaux et Succès',
        'Admin Panel': 'Panneau d\'Administration',
        'View Main Panel': 'Voir le Panneau Principal',
        'Statistics': 'Statistiques',
        'Progress Visualization': 'Visualisation de la Progression',
        'System Configuration': 'Configuration du Système',
        'Quick Actions': 'Actions Rapides',
        'Reset Progress to 0': 'Réinitialiser la Progression à 0',
        'Points to add': 'Points à ajouter',
        'Points to subtract': 'Points à soustraire',
        'Subtract Points': 'Soustraire des Points'
        // === FIN NUEVAS TRADUCCIONES PARA HTML ===
    }
};

/**
 * Obtiene la traducción de un texto según el idioma actual
 * @param {string} key - Clave del texto a traducir
 * @returns {string} Texto traducido
 */
function getTranslation(key) {
    const language = document.documentElement.lang || 'es';
    return translations[language]?.[key] || key;
}

/**
 * Detecta el idioma actual del documento
 * @returns {string} Código del idioma (es, fr, etc.)
 */
function getCurrentLanguage() {
    return document.documentElement.lang || 'es';
}

/**
 * Traduce los textos estáticos del HTML según el idioma actual
 */
function translateStaticTexts() {
    const language = getCurrentLanguage();
    const texts = translations[language];
    
    if (!texts) return;
    
    // Elementos a traducir con sus IDs y claves de traducción
    const elementsToTranslate = {
        'current-points-text': 'Current Points',
        'max-points-text': 'of',
        'add-points-btn': 'Add Points',
        'levels-title': 'Levels',
        'admin-panel-title': 'Admin Panel',
        'view-main-panel': 'View Main Panel',
        'statistics-title': 'Statistics',
        'progress-visualization': 'Progress Visualization',
        'system-configuration': 'System Configuration',
        'quick-actions': 'Quick Actions',
        'reset-progress-btn': 'Reset Progress to 0',
        'add-points-label': 'Points to add',
        'add-manual-points-btn': 'Add Points',
        'subtract-points-label': 'Points to subtract',
        'subtract-manual-points-btn': 'Subtract Points'
    };
    
    Object.entries(elementsToTranslate).forEach(([elementId, translationKey]) => {
        const element = document.getElementById(elementId);
        if (element && texts[translationKey]) {
            element.textContent = texts[translationKey];
        }
    });
}

/**
 * Actualiza todas las traducciones cuando cambia el idioma
 */
function updateAllTranslations() {
    translateStaticTexts();
    // Si hay niveles cargados, recargarlos para actualizar textos
    if (document.getElementById('levels-container')) {
        loadLevels();
    }
}

/**
 * Cambia el idioma sin recargar la página completa
 */
function changeLanguage(language) {
    fetch(`/set_language/${language}`)
        .then(response => {
            if (response.ok) {
                // Actualizar traducciones sin recargar la página completa
                document.documentElement.lang = language;
                updateAllTranslations();
                
                // Actualizar botones activos
                document.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`.lang-btn[onclick="changeLanguage('${language}')"]`).classList.add('active');
                
                // Mostrar notificación de cambio
                showNotification(
                    language === 'es' ? 'Idioma cambiado a Español' : 'Langue changée en Français', 
                    'success'
                );
            } else {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error changing language:', error);
            location.reload();
        });
}

// Ejecutar traducciones cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateAllTranslations, 100);
});
// === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===

function initializeApp() {
    // Elementos del panel principal
    const addPointsBtn = document.getElementById('add-points-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const currentPoints = document.getElementById('current-points');
    const maxPoints = document.getElementById('max-points');

    // Elementos del panel admin (si existen)
    const configForm = document.getElementById('config-form');
    const resetProgressBtn = document.getElementById('reset-progress-btn');
    const addManualPointsBtn = document.getElementById('add-manual-points-btn');
    const manualPointsInput = document.getElementById('manual-points');
    const subtractManualPointsBtn = document.getElementById('subtract-manual-points-btn');
    const subtractPointsInput = document.getElementById('subtract-points');
    
    if (subtractManualPointsBtn && subtractPointsInput) {
        subtractManualPointsBtn.addEventListener('click', subtractManualPoints);
    }

    // Cargar progreso inicial
    loadProgress();

    // Event listeners para panel principal
    if (addPointsBtn) {
        addPointsBtn.addEventListener('click', addPoints);
    }

    // Event listeners para panel admin
    if (configForm) {
        configForm.addEventListener('submit', updateConfig);
    }

    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', resetProgress);
    }

    if (addManualPointsBtn && manualPointsInput) {
        addManualPointsBtn.addEventListener('click', addManualPoints);
    }

    // === INICIO MODIFICACIÓN SISTEMA NIVELES Y LOGROS ===
    // Cargar niveles y logros al inicializar la aplicación
    loadLevels();
    
    // Configurar event listeners para el modal de logros
    setupAchievementModal();
    // === FIN MODIFICACIÓN SISTEMA NIVELES Y LOGROS ===

    // Actualizar progreso cada 5 segundos
    setInterval(loadProgress, 5000);
}

// === INICIO MODIFICACIÓN SISTEMA NIVELES Y LOGROS ===
// Funciones para gestionar el sistema de niveles y logros

/**
 * Carga los niveles y logros desde el servidor
 */
function loadLevels() {
    fetch('/api/levels')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error cargando niveles');
            }
            return response.json();
        })
        .then(data => {
            displayLevels(data.levels, data.achievements);
        })
        .catch(error => {
            console.error('Error loading levels:', error);
            // Ocultar mensaje de carga
            const container = document.getElementById('levels-container');
            if (container) {
                // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
                container.innerHTML = `<p class="error-message">${getTranslation('Error loading levels')}</p>`;
                // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
            }
        });
}

/**
 * Muestra los niveles en la interfaz
 */
function displayLevels(levels, achievements) {
    const container = document.getElementById('levels-container');
    if (!container) return;
    
    // Obtener el progreso actual para determinar qué niveles están desbloqueados
    fetch('/api/progress')
        .then(response => response.json())
        .then(progressData => {
            const currentPercentage = progressData.percentage;
            
            // Ordenar niveles por porcentaje requerido
            levels.sort((a, b) => a.percentage_required - b.percentage_required);
            
            if (levels.length === 0) {
                container.innerHTML = `
                    <div class="no-levels-message">
                        <p>🎯 ${getTranslation('No levels configured')}</p>
                        <small>${getTranslation('The administrator can add levels from the control panel')}</small>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = levels.map(level => {
                const achievement = achievements.find(a => a.level_id === level.id);
                const isUnlocked = achievement && achievement.is_opened;
                // CORRECCIÓN: Solo puede abrirse si tiene achievement, no está abierto Y el porcentaje actual es >= al requerido
                const canOpen = achievement && !achievement.is_opened && currentPercentage >= level.percentage_required;
                // CORRECCIÓN: Está bloqueado si no hay achievement O el porcentaje actual es menor al requerido
                const isLocked = !achievement || currentPercentage < level.percentage_required;
                
                return `
                    <div class="level-card ${isUnlocked ? 'unlocked' : ''} ${canOpen ? 'can-open' : ''} ${isLocked ? 'locked' : ''}" 
                         data-level-id="${level.id}" 
                         data-achievement-id="${achievement ? achievement.id : ''}"
                         data-level-name="${level.name}"
                         data-percentage-required="${level.percentage_required}">
                        <div class="level-icon" style="color: ${level.color}">
                            ${isUnlocked ? '🎁' : (canOpen ? '🎯' : '🔒')}
                        </div>
                        <div class="level-info">
                            <h3>${level.name}</h3>
                            <p class="level-requirement">${level.percentage_required}% ${getTranslation('of total')}</p>
                            <p class="current-progress">${getTranslation('Current progress')}: ${currentPercentage.toFixed(1)}%</p>
                            <div class="level-status">
                                ${isUnlocked ? 
                                    `<span class="status-badge unlocked">✅ ${getTranslation('Claimed')}</span>` : 
                                  canOpen ? 
                                    `<span class="status-badge can-open">💝 ${getTranslation('Tap to open!')}</span>` :
                                    `<span class="status-badge locked">🔒 ${getTranslation('To reach')}</span>`
                                }
                            </div>
                        </div>
                        <div class="level-number">${getTranslation('Level')} ${level.level_number}</div>
                    </div>
                `;
            }).join('');
            
            // Agregar event listeners para los niveles que se pueden abrir
            document.querySelectorAll('.level-card.can-open').forEach(card => {
                card.addEventListener('click', openAchievement);
            });
        })
        .catch(error => {
            console.error('Error loading progress for levels:', error);
            // Mostrar mensaje de error
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            container.innerHTML = `<p class="error-message">${getTranslation('Error loading progress')}</p>`;
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        });
}

/**
 * Abre un logro/baúl cuando el usuario hace click
 */
async function openAchievement(event) {
    const card = event.currentTarget;
    const achievementId = card.dataset.achievementId;
    const levelName = card.dataset.levelName;
    const percentageRequired = card.dataset.percentageRequired;
    
    if (!achievementId) {
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('This level has no reward configured'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        return;
    }
    
    try {
        const response = await fetch(`/api/achievements/${achievementId}/open`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            // Mostrar confeti de celebración
            showConfetti();
            
            // Obtener detalles actualizados del achievement
            const levelsResponse = await fetch('/api/levels');
            const data = await levelsResponse.json();
            const achievement = data.achievements.find(a => a.id == achievementId);
            const level = data.levels.find(l => l.id == card.dataset.levelId);
            
            if (achievement && level) {
                // Mostrar modal con el mensaje de recompensa
                showAchievementModal(level, achievement);
                
                // Actualizar la visualización de niveles
                loadLevels();
                
                // Mostrar notificación de éxito
                // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
                showNotification(`¡${level.name} ${getTranslation('unlocked')}!`, 'success');
                // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
            }
        } else {
            const errorData = await response.json();
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(errorData.error || getTranslation('Error opening achievement'), 'error');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        }
    } catch (error) {
        console.error('Error opening achievement:', error);
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Error connecting to open achievement'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
    }
}

/**
 * Configura los event listeners del modal de logros
 */
function setupAchievementModal() {
    const modal = document.getElementById('achievement-modal');
    const closeBtn = document.querySelector('.close-modal');
    const closeMessageBtn = document.querySelector('.close-message-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            resetChestAnimation();
        });
    }
    
    if (closeMessageBtn) {
        closeMessageBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            resetChestAnimation();
        });
    }
    
    // Cerrar modal al hacer click fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetChestAnimation();
        }
    });
}

/**
 * Muestra el modal con la recompensa del logro
 */
function showAchievementModal(level, achievement) {
    const modal = document.getElementById('achievement-modal');
    const title = document.getElementById('achievement-title');
    const text = document.getElementById('achievement-text');
    
    if (!modal || !title || !text) return;
    
    // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
    title.textContent = `¡${level.name} ${getTranslation('unlocked')}!`;
    // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
    text.textContent = achievement.message;
    
    modal.style.display = 'block';
    
    // Iniciar animación del baúl después de un breve delay
    setTimeout(() => {
        const chest = document.getElementById('chest');
        if (chest) {
            chest.classList.add('open');
        }
    }, 500);
}

/**
 * Reinicia la animación del baúl
 */
function resetChestAnimation() {
    const chest = document.getElementById('chest');
    if (chest) {
        chest.classList.remove('open');
    }
}

/**
 * Muestra animación de confeti
 */
function showConfetti() {
    // Crear partículas de confeti
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            createConfettiParticle(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 20);
    }
}

/**
 * Crea una partícula individual de confeti
 */
function createConfettiParticle(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${color};
        top: -20px;
        left: ${Math.random() * 100}vw;
        opacity: 0;
        z-index: 9999;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    // Remover el confeti después de la animación
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 5000);
}
// === FIN MODIFICACIÓN SISTEMA NIVELES Y LOGROS ===

async function loadProgress() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        
        updateProgressDisplay(data);
        
        // ACTUALIZACIÓN: Recargar niveles cuando se actualice el progreso
        // para reflejar cambios en el estado de desbloqueo
        loadLevels();
        
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function updateProgressDisplay(data) {
    console.log("Actualizando display con datos:", data);
    
    // Validar que los datos existen
    if (!data) {
        console.error("Datos no definidos en updateProgressDisplay");
        return;
    }

    // ✅ CORRECCIÓN: ACTUALIZAR ELEMENTOS CORRECTOS SEGÚN TU HTML ACTUAL
    
    // 1. Actualizar puntos actuales (buscar por ID correcto)
    const currentPointsValue = document.getElementById('current-points-value');
    if (currentPointsValue && data.current_points !== undefined) {
        currentPointsValue.textContent = data.current_points.toFixed(2);
        console.log("Puntos actuales actualizados:", data.current_points.toFixed(2));
    }
    
    // 2. Actualizar puntos máximos (buscar por ID correcto)  
    const maxPointsValue = document.getElementById('max-points-value');
    if (maxPointsValue && data.max_points !== undefined) {
        maxPointsValue.textContent = data.max_points.toFixed(2);
    }
    
    // 3. Actualizar barra de progreso
    const progressFill = document.getElementById('progress-fill');
    if (progressFill && data.percentage !== undefined) {
        progressFill.style.width = `${data.percentage}%`;
        console.log("Barra actualizada:", data.percentage + "%");
    }
    
    // 4. Actualizar porcentaje (buscar por ID correcto)
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressPercentage && data.percentage !== undefined) {
        progressPercentage.textContent = `${data.percentage.toFixed(2)}%`;
        console.log("Porcentaje actualizado:", data.percentage.toFixed(2) + "%");
    }

    // 5. Actualizar puntos por clic si existe
    const pointsPerClick = document.getElementById('points-per-click');
    if (pointsPerClick && data.points_per_click !== undefined) {
        pointsPerClick.textContent = `(+${data.points_per_click.toFixed(2)})`;
    }

    // ✅ VERIFICACIÓN: Mostrar en consola qué elementos se encontraron
    console.log("Elementos encontrados:", {
        currentPointsValue: !!currentPointsValue,
        maxPointsValue: !!maxPointsValue, 
        progressFill: !!progressFill,
        progressPercentage: !!progressPercentage,
        pointsPerClick: !!pointsPerClick
    });

    // Actualizar panel admin si existe (mantener tu código existente)
    const adminProgressFill = document.getElementById('admin-progress-fill');
    const adminCurrentPoints = document.getElementById('admin-current-points');
    const adminMaxPoints = document.getElementById('admin-max-points');
    const statCurrentPoints = document.getElementById('stat-current-points');
    const statMaxPoints = document.getElementById('stat-max-points');
    const statPointsPerClick = document.getElementById('stat-points-per-click');
    const statPercentage = document.getElementById('stat-percentage');
    
    if (adminProgressFill && data.percentage !== undefined) {
        adminProgressFill.style.width = `${data.percentage}%`;
    }
    if (adminCurrentPoints && data.current_points !== undefined) {
        adminCurrentPoints.textContent = data.current_points.toFixed(2);
    }
    if (adminMaxPoints && data.max_points !== undefined) {
        adminMaxPoints.textContent = data.max_points.toFixed(2);
    }
    if (statCurrentPoints && data.current_points !== undefined) {
        statCurrentPoints.textContent = data.current_points.toFixed(2);
    }
    if (statMaxPoints && data.max_points !== undefined) {
        statMaxPoints.textContent = data.max_points.toFixed(2);
    }
    if (statPointsPerClick && data.points_per_click !== undefined) {
        statPointsPerClick.textContent = data.points_per_click.toFixed(2);
    }
    if (statPercentage && data.percentage !== undefined) {
        statPercentage.textContent = `${data.percentage.toFixed(2)}%`;
    }
}

// === INICIO CORRECCIÓN FUNCIÓN ADD POINTS ===
async function addPoints() {
    try {
        console.log("Sumando puntos...");
        const response = await fetch('/add_points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        console.log("Datos del servidor:", data);
        
        if (!response.ok) {
            showNotification(data.message || getTranslation('Error adding points'), 'error');
            return;
        }
        
        // ✅ ACTUALIZAR INTERFAZ CON DATOS DEL SERVIDOR
        updateProgressDisplay(data);
        
        // Actualizar niveles por si se desbloquea alguno
        loadLevels();
        
        // Efecto visual en el botón
        const button = document.getElementById('add-points-btn');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        showNotification(getTranslation('Points added successfully'), 'success');
        
    } catch (error) {
        console.error('Error adding points:', error);
        showNotification(getTranslation('Connection error'), 'error');
    }
}
// === FIN CORRECCIÓN FUNCIÓN ADD POINTS ===

async function updateConfig(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const config = {
        max_points: parseFloat(formData.get('max_points')),
        points_per_click: parseFloat(formData.get('points_per_click'))
    };

    // NUEVA VALIDACIÓN PARA PUNTOS POR CLIC
    if (config.points_per_click < 0.01) {
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Points per click must be greater than or equal to 0.01'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        return;
    }
    
    try {
        const response = await fetch('/admin/update_config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(getTranslation('Configuration updated successfully'), 'success');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
            loadProgress(); // Recargar datos
        } else {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(getTranslation('Error updating configuration'), 'error');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        }
    } catch (error) {
        console.error('Error updating config:', error);
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Error updating configuration'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
    }
}

async function resetProgress() {
    // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
    if (!confirm(getTranslation('Are you sure you want to reset progress to 0?'))) {
    // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        return;
    }
    
    try {
        const response = await fetch('/admin/reset_progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(getTranslation('Progress reset successfully'), 'success');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
            loadProgress(); // Recargar datos
        } else {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(getTranslation('Error resetting progress'), 'error');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        }
    } catch (error) {
        console.error('Error resetting progress:', error);
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Error resetting progress'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
    }
}

async function addManualPoints() {
    const pointsInput = document.getElementById('manual-points');
    const points = parseFloat(pointsInput.value);
    
    if (isNaN(points) || points <= 0) {
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Please enter a valid number greater than 0'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        return;
    }
    
    try {
        const response = await fetch('/admin/add_manual_points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: points })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(`${points} ${getTranslation('Points added successfully')}`, 'success');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
            pointsInput.value = '';
            updateProgressDisplay(result);
            // ACTUALIZACIÓN: Recargar niveles después de agregar puntos manuales
            loadLevels();
        } else {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(getTranslation('Error adding points'), 'error');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        }
    } catch (error) {
        console.error('Error adding manual points:', error);
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Error adding points'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
    }
}

async function subtractManualPoints() {
    const pointsInput = document.getElementById('subtract-points');
    const points = parseFloat(pointsInput.value);
    
    if (isNaN(points) || points <= 0) {
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Please enter a valid number greater than 0'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        return;
    }
    
    try {
        const response = await fetch('/admin/subtract_manual_points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: points })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(`${points} ${getTranslation('Points added successfully').replace('agregados', 'restados').replace('ajoutés', 'soustraits')}`, 'success');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
            pointsInput.value = '';
            updateProgressDisplay(result);
            // ACTUALIZACIÓN: Recargar niveles después de restar puntos manuales
            loadLevels();
        } else {
            // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
            showNotification(getTranslation('Error subtracting points'), 'error');
            // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
        }
    } catch (error) {
        console.error('Error subtracting manual points:', error);
        // === INICIO MODIFICACIÓN SISTEMA DE IDIOMAS ===
        showNotification(getTranslation('Error subtracting points'), 'error');
        // === FIN MODIFICACIÓN SISTEMA DE IDIOMAS ===
    }
}

function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}