/**
 * js/config.js - Configuración centralizada
 * 
 * Define todas las constantes de la aplicación en un único lugar
 */

const APP_CONFIG = {
  DECIMALS_DEFAULT: 6,
  GAUSS_TOLERANCE: 1e-12,
  JACOBI_TOLERANCE: 1e-8,
  JACOBI_MAX_ITERATIONS: 1000,
  HISTORY_KEY: 'historial',
  DECIMALS_KEY: 'decimals',
  THEME_KEY: 'theme',
  STEPS_MODE_KEY: 'steps_mode',
  STEPS_MODE_DEFAULT: 'detailed', // 'detailed' | 'concise'
};

// Estado global
const APP_STATE = {
  currentExercise: null,
  stepsState: {
    vectores: { steps: [], idx: 0, showAll: false },
    matrices: { steps: [], idx: 0, showAll: false }
  }
};
