// Panel Principal
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

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

    if (configForm) {
        configForm.addEventListener('submit', updateConfig);
    }

    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', resetProgress);
    }

    if (addManualPointsBtn && manualPointsInput) {
        addManualPointsBtn.addEventListener('click', addManualPoints);
    }

    // Actualizar progreso cada 5 segundos
    setInterval(loadProgress, 5000);
}

async function loadProgress() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        
        updateProgressDisplay(data);
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

    // Actualizar panel principal
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const currentPoints = document.getElementById('current-points');
    const maxPoints = document.getElementById('max-points');
    
    if (progressFill && progressPercentage && currentPoints && maxPoints) {
        // Solo actualizar si los datos existen
        if (data.percentage !== undefined) {
            progressFill.style.width = `${data.percentage}%`;
            progressPercentage.textContent = `${data.percentage.toFixed(2)}%`;
        }
        
        if (data.current_points !== undefined) {
            currentPoints.textContent = data.current_points.toFixed(2);
        }
        
        if (data.max_points !== undefined) {
            maxPoints.textContent = data.max_points.toFixed(2);
        }
    }

    // Actualizar panel admin si existe
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

async function addPoints() {
    try {
        console.log("Intentando sumar puntos...");
        const response = await fetch('/add_points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log("Respuesta recibida:", response.status);
        const data = await response.json();
        console.log("Datos recibidos:", data);
        
        // MANEJO CORREGIDO DE ERRORES
        if (!response.ok) {
            console.log("Error en respuesta:", data);
            if (data.message) {
                showNotification(data.message, 'error');
            } else {
                showNotification('Debes esperar para sumar puntos nuevamente', 'error');
            }
            return; // IMPORTANTE: Salir de la función aquí
        }
        
        // SI LLEGA AQUÍ, ES ÉXITO
        console.log("Éxito - actualizando display");
        updateProgressDisplay(data);
        
        // Efecto visual
        const button = document.getElementById('add-points-btn');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
    } catch (error) {
        console.error('Error adding points:', error);
        showNotification('Error de conexión', 'error');
    }
}

async function updateConfig(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const config = {
        max_points: parseFloat(formData.get('max_points')),
        points_per_click: parseFloat(formData.get('points_per_click'))
    };

    // NUEVA VALIDACIÓN PARA PUNTOS POR CLIC
    if (config.points_per_click < 0.01) {
        showNotification('Los puntos por clic deben ser mayor o igual a 0.01', 'error');
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
            showNotification('Configuración actualizada correctamente', 'success');
            loadProgress(); // Recargar datos
        } else {
            showNotification('Error al actualizar la configuración', 'error');
        }
    } catch (error) {
        console.error('Error updating config:', error);
        showNotification('Error al actualizar la configuración', 'error');
    }
}

async function resetProgress() {
    if (!confirm('¿Estás seguro de que quieres reiniciar el progreso a 0?')) {
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
            showNotification('Progreso reiniciado correctamente', 'success');
            loadProgress(); // Recargar datos
        } else {
            showNotification('Error al reiniciar el progreso', 'error');
        }
    } catch (error) {
        console.error('Error resetting progress:', error);
        showNotification('Error al reiniciar el progreso', 'error');
    }
}

async function addManualPoints() {
    const pointsInput = document.getElementById('manual-points');
    const points = parseFloat(pointsInput.value);
    
    if (isNaN(points) || points <= 0) {
        showNotification('Por favor ingresa un número válido mayor a 0', 'error');
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
            showNotification(`Se agregaron ${points} puntos correctamente`, 'success');
            pointsInput.value = '';
            updateProgressDisplay(result);
        } else {
            showNotification('Error al agregar puntos', 'error');
        }
    } catch (error) {
        console.error('Error adding manual points:', error);
        showNotification('Error al agregar puntos', 'error');
    }
}

async function subtractManualPoints() {
    const pointsInput = document.getElementById('subtract-points');
    const points = parseFloat(pointsInput.value);
    
    if (isNaN(points) || points <= 0) {
        showNotification('Por favor ingresa un número válido mayor a 0', 'error');
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
            showNotification(`Se restaron ${points} puntos correctamente`, 'success');
            pointsInput.value = '';
            updateProgressDisplay(result);
        } else {
            showNotification('Error al restar puntos', 'error');
        }
    } catch (error) {
        console.error('Error subtracting manual points:', error);
        showNotification('Error al restar puntos', 'error');
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