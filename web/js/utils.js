/**
 * js/utils.js - Funciones de utilidad compartida
 * 
 * Incluye funciones para:
 * - Parsing y conversión de datos
 * - Manipulación del DOM
 * - Validación de entradas
 * - Gestión de historial
 */

// ============ PARSING Y CONVERSIÓN ============

function getDecimals() {
  const d = localStorage.getItem(APP_CONFIG.DECIMALS_KEY);
  return d ? parseInt(d) : APP_CONFIG.DECIMALS_DEFAULT;
}

function setDecimals(d) {
  localStorage.setItem(APP_CONFIG.DECIMALS_KEY, d);
}

function formatNumber(num) {
  if (typeof num !== 'number') return num;
  if (isNaN(num)) return 'NaN';
  if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
  
  const decimals = getDecimals();
  const rounded = Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  
  // Eliminar trailing zeros
  return parseFloat(rounded.toFixed(decimals)).toString();
}

function parseVector(str) {
  if (!str) return null;
  
  const cleaned = str.replace(/[\[\]]/g, '').trim();
  if (!cleaned) return null;
  
  const parts = cleaned.split(/[,\s]+/).filter(p => p);
  const numbers = parts.map(p => {
    const num = parseFloat(p);
    return isNaN(num) ? null : num;
  });
  
  if (numbers.includes(null)) return null;
  return numbers;
}

function parseMatrix(str) {
  if (!str) return null;
  
  const cleaned = str.replace(/[\[\]]/g, '').trim();
  if (!cleaned) return null;
  
  const rows = cleaned.split(';').map(row => row.trim());
  const matrix = rows.map(row => {
    const parts = row.split(/[,\s]+/).filter(p => p);
    const numbers = parts.map(p => {
      const num = parseFloat(p);
      return isNaN(num) ? null : num;
    });
    
    if (numbers.includes(null)) return null;
    return numbers;
  });
  
  if (matrix.includes(null)) return null;
  return matrix;
}

function vectorToString(vector) {
  return '[' + vector.map(formatNumber).join(', ') + ']';
}

function matrixToString(matrix) {
  return matrix.map(row => 
    '[' + row.map(formatNumber).join(', ') + ']'
  ).join('\n');
}

// ============ MANIPULACIÓN DEL DOM ============

function $(selector) {
  return document.querySelector(selector);
}

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function renderVector(container, vector) {
  clearNode(container);
  const text = document.createElement('p');
  text.textContent = vectorToString(vector);
  container.appendChild(text);
}

function renderMatrix(container, matrix) {
  clearNode(container);
  matrix.forEach((row, i) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'matrix-row';
    row.forEach(val => {
      const cell = document.createElement('span');
      cell.className = 'matrix-cell';
      cell.textContent = formatNumber(val);
      rowDiv.appendChild(cell);
    });
    container.appendChild(rowDiv);
  });
}

// ============ VALIDACIÓN ============

function validateVectors(input1, input2) {
  const v1 = parseVector(input1);
  const v2 = parseVector(input2);
  
  if (!v1 || !v2) {
    alert('Ingresa dos vectores válidos');
    return null;
  }
  
  if (v1.length !== v2.length) {
    alert('Los vectores deben tener la misma dimensión');
    return null;
  }
  
  return { v1, v2 };
}

function validateMatricesForMultiplication(m1Str, m2Str) {
  const m1 = parseMatrix(m1Str);
  const m2 = parseMatrix(m2Str);
  
  if (!m1 || !m2) {
    alert('Ingresa dos matrices válidas');
    return null;
  }
  
  if (m1[0].length !== m2.length) {
    alert('Las matrices son incompatibles para multiplicación');
    return null;
  }
  
  return { m1, m2 };
}

// ============ HISTORIAL (localStorage) ============

function logOperation(operation, input, output, type = 'vector') {
  const history = getHistory();
  const timestamp = new Date().toLocaleString();
  
  history.unshift({
    operation,
    input,
    output,
    type,
    timestamp
  });
  
  if (history.length > 50) {
    history.pop();
  }
  
  localStorage.setItem(APP_CONFIG.HISTORY_KEY, JSON.stringify(history));
}

function getHistory() {
  const stored = localStorage.getItem(APP_CONFIG.HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

function clearHistory() {
  localStorage.removeItem(APP_CONFIG.HISTORY_KEY);
}
