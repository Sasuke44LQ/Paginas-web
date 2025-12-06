/**
 * utils.js - Funciones utilidades comunes
 * 
 * Contiene funciones de propósito general como:
 * - Parsing y formatting
 * - Operaciones de DOM
 * - Manejo de localStorage
 * - Helpers matemáticos
 */

import Config from './config.js';

// ============================================================================
// FUNCIONES DE UTILIDAD - Parsing y Conversión
// ============================================================================

/**
 * Obtiene la hora actual en formato ISO
 */
export function now() {
  return new Date().toISOString();
}

/**
 * Obtiene el número de decimales configurado
 */
export function getDecimals() {
  const d = parseInt(localStorage.getItem(Config.STORAGE.DECIMALS_KEY));
  return Number.isNaN(d) ? Config.UI.DECIMALS_DEFAULT : d;
}

/**
 * Formatea un número según los decimales configurados
 */
export function formatNumber(x) {
  if (x === null || x === undefined || Number.isNaN(+x)) return String(x);
  return Number(x).toFixed(getDecimals());
}

/**
 * Convierte un vector a string representativo
 */
export function vectorToString(v) {
  return '[' + v.map(x => formatNumber(x)).join(', ') + ']';
}

/**
 * Convierte una matriz a string representativo
 */
export function matrixToString(M) {
  return '[' + M.map(r => '[' + r.map(x => formatNumber(x)).join(', ') + ']').join(',\n ') + ']';
}

/**
 * Parsea un string con formato "1,2,3" a un vector
 */
export function parseVector(str) {
  if (!str) return [];
  return str.split(',').map(s => parseFloat(s.trim())).filter(x => !Number.isNaN(x));
}

/**
 * Parsea un string con formato "1,2;3,4" a una matriz
 */
export function parseMatrix(str) {
  if (!str) return [];
  return str.split(';').map(r => parseVector(r));
}

// ============================================================================
// FUNCIONES DE UTILIDAD - Manipulación del DOM
// ============================================================================

/**
 * Alias para document.getElementById para código más legible
 */
export function $(id) {
  return document.getElementById(id);
}

/**
 * Limpia todos los hijos de un nodo
 */
export function clearNode(node) {
  while (node && node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * Renderiza un vector en un contenedor
 */
export function renderVector(container, v) {
  if (!container) return;
  clearNode(container);
  
  if (!v || v.length === 0) {
    container.textContent = Config.MESSAGES.EMPTY_VECTOR;
    return;
  }
  
  v.forEach(x => {
    const span = document.createElement('span');
    span.className = 'vector-chip';
    span.textContent = formatNumber(x);
    container.appendChild(span);
  });
}

/**
 * Renderiza una matriz en un contenedor como tabla HTML
 */
export function renderMatrix(container, M) {
  if (!container) return;
  clearNode(container);
  
  if (!M || M.length === 0) {
    container.textContent = Config.MESSAGES.EMPTY_MATRIX;
    return;
  }
  
  const table = document.createElement('table');
  table.className = 'matrix-table';
  
  for (let i = 0; i < M.length; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < (M[i] || []).length; j++) {
      const td = document.createElement('td');
      td.textContent = formatNumber(M[i][j]);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  
  container.appendChild(table);
}

/**
 * Renderiza un escalar en un contenedor
 */
export function renderScalar(container, k) {
  if (!container) return;
  container.textContent = isNaN(k) ? Config.MESSAGES.INVALID_INPUT : formatNumber(k);
}

/**
 * Renderiza una lista de pasos
 */
export function renderSteps(container, steps) {
  if (!container) return;
  clearNode(container);
  
  if (!steps || steps.length === 0) {
    container.textContent = Config.MESSAGES.NO_STEPS;
    return;
  }
  
  const ol = document.createElement('ol');
  steps.forEach(s => {
    const li = document.createElement('li');
    li.className = 'step-item';
    if (typeof s === 'string') {
      li.textContent = s;
    } else {
      li.appendChild(s);
    }
    ol.appendChild(li);
  });
  
  container.appendChild(ol);
}

// ============================================================================
// FUNCIONES DE UTILIDAD - Validación
// ============================================================================

/**
 * Valida que dos vectores sean compatibles para operaciones
 */
export function validateVectors(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    return {
      ok: false,
      msg: 'Entrada no es un vector válido',
      suggestion: 'Usa formato: 1,2,3'
    };
  }
  
  if (A.length === 0 || B.length === 0) {
    return {
      ok: false,
      msg: 'Uno de los vectores está vacío',
      suggestion: 'Introduce valores separados por comas'
    };
  }
  
  if (A.length !== B.length) {
    return {
      ok: false,
      msg: 'Dimensiones distintas: vectores de longitudes distintas',
      suggestion: `A tiene ${A.length} elementos, B tiene ${B.length}. Asegúrate de igualar longitudes.`
    };
  }
  
  return { ok: true };
}

/**
 * Valida que dos matrices sean compatibles para multiplicación
 */
export function validateMatricesForMultiplication(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B)) {
    return {
      ok: false,
      msg: 'Entrada no es una matriz válida',
      suggestion: 'Usa formato fila1;fila2 con elementos separados por comas'
    };
  }
  
  if (A.length === 0 || B.length === 0) {
    return {
      ok: false,
      msg: 'Una de las matrices está vacía',
      suggestion: 'Introduce matrices con al menos una fila'
    };
  }
  
  const aCols = (A[0] || []).length;
  const bRows = B.length;
  
  if (aCols !== bRows) {
    return {
      ok: false,
      msg: `Dimensiones incompatibles: columnas A (${aCols}) ≠ filas B (${bRows})`,
      suggestion: 'Revisa las dimensiones o transpón una de las matrices'
    };
  }
  
  return { ok: true };
}

// ============================================================================
// FUNCIONES DE UTILIDAD - Almacenamiento
// ============================================================================

/**
 * Registra una operación en el historial
 */
export function logOperation(type, inputs, result) {
  const item = {
    timestamp: now(),
    tipo: type,
    entradas: inputs,
    resultado: result
  };
  
  const history = JSON.parse(localStorage.getItem(Config.STORAGE.HISTORY_KEY) || '[]');
  history.push(item);
  localStorage.setItem(Config.STORAGE.HISTORY_KEY, JSON.stringify(history));
  
  return item;
}

/**
 * Obtiene el historial completo
 */
export function getHistory() {
  return JSON.parse(localStorage.getItem(Config.STORAGE.HISTORY_KEY) || '[]');
}

/**
 * Limpia el historial
 */
export function clearHistory() {
  localStorage.removeItem(Config.STORAGE.HISTORY_KEY);
}

/**
 * Establece el tema de la aplicación
 */
export function setTheme(isDark) {
  document.documentElement.classList.toggle('dark', !!isDark);
}

/**
 * Obtiene la preferencia de tema guardada
 */
export function getThemePreference() {
  return localStorage.getItem(Config.STORAGE.THEME_KEY);
}

/**
 * Guarda la preferencia de tema
 */
export function saveThemePreference(preference) {
  localStorage.setItem(Config.STORAGE.THEME_KEY, preference);
}

/**
 * Refresca todas las vistas previas de entrada
 */
export function refreshPreviews() {
  const pA = $('preview-vecA');
  const pB = $('preview-vecB');
  const pe = $('preview-escalar');
  
  if (pA) renderVector(pA, parseVector($('vecA').value));
  if (pB) renderVector(pB, parseVector($('vecB').value));
  if (pe) renderScalar(pe, parseFloat($('escalar').value));
  
  const pmA = $('preview-matA');
  const pmB = $('preview-matB');
  const pvb = $('preview-vecBmat');
  
  if (pmA) renderMatrix(pmA, parseMatrix($('matA').value));
  if (pmB) renderMatrix(pmB, parseMatrix($('matB').value));
  if (pvb) renderVector(pvb, parseVector($('vecBmat').value));
}

export default {
  now,
  getDecimals,
  formatNumber,
  vectorToString,
  matrixToString,
  parseVector,
  parseMatrix,
  $,
  clearNode,
  renderVector,
  renderMatrix,
  renderScalar,
  renderSteps,
  validateVectors,
  validateMatricesForMultiplication,
  logOperation,
  getHistory,
  clearHistory,
  setTheme,
  getThemePreference,
  saveThemePreference,
  refreshPreviews
};
