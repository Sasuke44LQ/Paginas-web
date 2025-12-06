/**
 * config.js - Configuración centralizada de la aplicación
 * 
 * Este archivo contiene todas las constantes y configuraciones globales
 * que se utilizan en toda la aplicación. Facilita cambios rápidos sin
 * necesidad de buscar en múltiples archivos.
 */

export const Config = {
  // Configuración de visualización
  UI: {
    DECIMALS_DEFAULT: 6,
    CANVAS_WIDTH: 540,
    CANVAS_HEIGHT: 260,
    MODAL_TIMEOUT: 300,
  },
  
  // Configuración de algoritmos
  ALGORITHMS: {
    GAUSS_TOLERANCE: 1e-12,
    JACOBI_TOLERANCE: 1e-8,
    JACOBI_MAX_ITERATIONS: 1000,
  },
  
  // Claves de localStorage
  STORAGE: {
    HISTORY_KEY: 'historial',
    DECIMALS_KEY: 'decimals',
    THEME_KEY: 'theme',
  },
  
  // Temas disponibles
  THEMES: {
    SYSTEM: 'system',
    LIGHT: 'light',
    DARK: 'dark',
  },
  
  // Tipos de ejercicios
  EXERCISE_TYPES: {
    VECTOR_SUM: 'vect_sum',
    MATRIX_MUL: 'mat_mul',
    GAUSS: 'gauss',
  },
  
  // Operaciones disponibles
  OPERATIONS: {
    // Vectores
    VECTOR_SUM: 'suma_vectores',
    VECTOR_SUB: 'resta_vectores',
    SCALAR_MUL: 'escalar_vector',
    DOT_PRODUCT: 'producto_punto',
    NORM: 'norma',
    
    // Matrices
    MATRIX_SUM: 'suma_matrices',
    MATRIX_MUL: 'mul_matrices',
    TRANSPOSE: 'transponer',
    GAUSS_SOLVE: 'resolver_gauss',
    JACOBI_SOLVE: 'resolver_jacobi',
    DETERMINANT: 'determinante',
    INVERSE: 'inversa',
    LU_DECOMPOSITION: 'lu',
  },
  
  // Mensajes y etiquetas
  MESSAGES: {
    EMPTY_VECTOR: '(vacío)',
    EMPTY_MATRIX: '(vacío)',
    NO_STEPS: '(sin pasos)',
    INVALID_INPUT: '(no válido)',
    GENERATE_EXERCISE: 'Genera un ejercicio primero',
    ENTER_ANSWER: 'Introduce una respuesta para comprobar.',
    CORRECT: 'Correcto ✅',
    INCORRECT: 'Incorrecto ❌ — Revisa los pasos y vuelve a intentar.',
    SINGULAR_MATRIX: 'Matriz singular o sistema mal condicionado (pivote cero)',
    DIMENSION_MISMATCH: 'Dimensiones distintas',
    INCOMPATIBLE_DIMENSIONS: 'Dimensiones incompatibles',
    SINGULAR_NO_INVERSE: 'Matriz singular, no tiene inversa',
    LU_ZERO_PIVOT: 'LU falló: pivote cero',
  },
};

// Validación de que la configuración es correcta
if (!Config.UI.DECIMALS_DEFAULT || Config.UI.DECIMALS_DEFAULT < 0) {
  console.warn('⚠️ Configuración de DECIMALS_DEFAULT inválida');
}

export default Config;
