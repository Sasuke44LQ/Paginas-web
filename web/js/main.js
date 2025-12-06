/**
 * main.js - Punto de entrada de la aplicación
 * 
 * Este archivo orquesta la inicialización de todos los módulos
 * y configura la aplicación de acuerdo a las preferencias del usuario.
 */

import Config from './config.js';
import {
  $,
  getDecimals,
  setTheme,
  getThemePreference,
  saveThemePreference,
  refreshPreviews
} from './utils.js';
import * as ui from './ui.js';
import * as stepsManager from './stepsManager.js';
import * as stepsManagerModule from './stepsManager.js';

// ============================================================================
// INICIALIZACIÓN DEL TEMA
// ============================================================================

/**
 * Obtiene la preferencia de tema del usuario y la aplica
 */
function initTheme() {
  const stored = getThemePreference();
  
  if (stored === 'dark') {
    setTheme(true);
  } else if (stored === 'light') {
    setTheme(false);
  } else {
    // Usar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(true);
    } else {
      setTheme(false);
    }
  }
  
  // Actualizar radios si existen
  const rSystem = $('theme-system');
  const rLight = $('theme-light');
  const rDark = $('theme-dark');
  
  if (rSystem && rLight && rDark) {
    if (stored === 'dark') {
      rDark.checked = true;
    } else if (stored === 'light') {
      rLight.checked = true;
    } else {
      rSystem.checked = true;
    }
  }
}

/**
 * Configura los listeners para cambiar el tema
 */
function initThemeControls() {
  const btnSettings = $('btn-settings');
  const settingsPanel = $('settings-panel');
  
  if (btnSettings && settingsPanel) {
    btnSettings.addEventListener('click', () => {
      settingsPanel.classList.remove('hidden');
    });
    
    const closeBtn = $('settings-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
      });
    }
    
    // Cerrar al hacer clic fuera
    settingsPanel.addEventListener('click', (ev) => {
      if (ev.target === settingsPanel) {
        settingsPanel.classList.add('hidden');
      }
    });
  }
  
  // Listeners para los radios de tema
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const preference = e.target.value;
      saveThemePreference(preference);
      
      if (preference === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme(true);
        } else {
          setTheme(false);
        }
      } else {
        setTheme(preference === 'dark');
      }
    });
  });
}

// ============================================================================
// INICIALIZACIÓN DE DECIMALES
// ============================================================================

/**
 * Configura el control de decimales
 */
function initDecimals() {
  const decInput = $('decimals');
  
  if (decInput) {
    const stored = parseInt(localStorage.getItem(Config.STORAGE.DECIMALS_KEY));
    decInput.value = Number.isNaN(stored) ? Config.UI.DECIMALS_DEFAULT : stored;
    
    decInput.addEventListener('change', () => {
      const value = parseInt(decInput.value);
      
      if (Number.isNaN(value) || value < 0) {
        return;
      }
      
      localStorage.setItem(Config.STORAGE.DECIMALS_KEY, String(value));
      
      // Actualizar vistas
      refreshPreviews();
      stepsManagerModule.renderCurrentStep('vectores');
      stepsManagerModule.renderCurrentStep('matrices');
    });
  }
}

// ============================================================================
// INICIALIZACIÓN PRINCIPAL
// ============================================================================

/**
 * Inicializa la aplicación completa
 */
export function initializeApp() {
  console.log('🚀 Inicializando aplicación...');
  
  // Tema
  initTheme();
  initThemeControls();
  
  // Decimales
  initDecimals();
  
  // Navegación
  ui.initSectionNavigation();
  
  // Operaciones
  ui.initVectorOperations();
  ui.initMatrixOperations();
  ui.initHistory();
  ui.initExercises();
  ui.initVisualizer();
  ui.initInputPreviews();
  
  // Pasos
  stepsManager.wireStepControls();
  
  // Imprimir pasos
  const printStepsVectorBtn = $('print-steps-vectores');
  if (printStepsVectorBtn) {
    printStepsVectorBtn.addEventListener('click', () => stepsManager.printSteps('vectores'));
  }
  
  const printStepsMatrixBtn = $('print-steps-matrices');
  if (printStepsMatrixBtn) {
    printStepsMatrixBtn.addEventListener('click', () => stepsManager.printSteps('matrices'));
  }
  
  // Mostrar sección inicial
  ui.showSection('sect-vectores');
  
  console.log('✅ Aplicación inicializada exitosamente');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

export default { initializeApp };
