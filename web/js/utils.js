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

// ============ STEPS (mostrar pasos de cálculo) ============

// Estado global para pasos (por sección: 'vectores' | 'matrices')
const STEP_STATE = {
  vectores: { steps: [], idx: 0 },
  matrices: { steps: [], idx: 0 }
};

function getStepsMode() {
  const m = localStorage.getItem(APP_CONFIG.STEPS_MODE_KEY);
  return m || APP_CONFIG.STEPS_MODE_DEFAULT || 'detailed';
}

function setStepsMode(mode) {
  if (!mode) return;
  localStorage.setItem(APP_CONFIG.STEPS_MODE_KEY, mode);
}

function setSteps(section, stepsArray) {
  if (!STEP_STATE[section]) return;
  STEP_STATE[section].steps = Array.isArray(stepsArray) ? stepsArray : [];
  STEP_STATE[section].idx = 0;
  renderStep(section, 0);
}

function clearSteps(section) {
  if (!STEP_STATE[section]) return;
  STEP_STATE[section].steps = [];
  STEP_STATE[section].idx = 0;
  const container = $(`#steps-${section}`);
  if (container) clearNode(container);
  const controls = $(`#step-controls-${section}`);
  if (controls) controls.classList.add('hidden');
}

function renderStep(section, index) {
  if (!STEP_STATE[section]) return;
  const state = STEP_STATE[section];
  const container = $(`#steps-${section}`);
  const controls = $(`#step-controls-${section}`);
  if (!container) return;

  clearNode(container);

  if (!state.steps || state.steps.length === 0) {
    if (controls) controls.classList.add('hidden');
    return;
  }

  // Mostrar controles si están habilitados por checkbox
  const checkbox = $(`#show-steps-${section}`);
  const showControls = checkbox && checkbox.checked;
  if (controls) {
    if (showControls) controls.classList.remove('hidden');
    else controls.classList.add('hidden');
  }

  const idx = Math.max(0, Math.min(index, state.steps.length - 1));
  state.idx = idx;

  // Render paso actual
  const step = state.steps[idx];
  const item = document.createElement('div');
  item.className = 'step-item step-active';
  const mode = getStepsMode();
  if (typeof step === 'string') item.innerHTML = step;
  else if (step && typeof step === 'object') {
    if (mode === 'concise' && step.concise) item.innerHTML = step.concise;
    else if (mode === 'detailed' && step.detailed) item.innerHTML = step.detailed;
    else if (step.html) item.innerHTML = step.html;
    else item.textContent = JSON.stringify(step);
  } else item.textContent = String(step);
  container.appendChild(item);

  // Actualizar contador
  const counter = $(`#step-counter-${section}`);
  if (counter) counter.textContent = `${idx + 1} / ${state.steps.length}`;
}

function showNextStep(section) {
  if (!STEP_STATE[section]) return;
  const state = STEP_STATE[section];
  if (state.idx < state.steps.length - 1) {
    renderStep(section, state.idx + 1);
  }
}

function showPrevStep(section) {
  if (!STEP_STATE[section]) return;
  const state = STEP_STATE[section];
  if (state.idx > 0) {
    renderStep(section, state.idx - 1);
  }
}

function showAllSteps(section) {
  if (!STEP_STATE[section]) return;
  const state = STEP_STATE[section];
  const container = $(`#steps-${section}`);
  const controls = $(`#step-controls-${section}`);
  if (!container) return;
  clearNode(container);
  const mode = getStepsMode();
  state.steps.forEach(s => {
    const item = document.createElement('div');
    item.className = 'step-item';
    if (typeof s === 'string') item.innerHTML = s;
    else if (s && typeof s === 'object') {
      if (mode === 'concise' && s.concise) item.innerHTML = s.concise;
      else if (mode === 'detailed' && s.detailed) item.innerHTML = s.detailed;
      else if (s.html) item.innerHTML = s.html;
      else item.textContent = JSON.stringify(s);
    } else item.textContent = String(s);
    container.appendChild(item);
  });
  if (controls) controls.classList.add('hidden');
}

function printSteps(section) {
  const state = STEP_STATE[section];
  if (!state || !state.steps || state.steps.length === 0) return;
  const win = window.open('', '_blank');
  win.document.write('<html><head><title>Pasos - ' + section + '</title>');
  win.document.write('<style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} .step-item{margin-bottom:12px;padding:10px;border-radius:6px;border:1px solid #ddd}</style></head><body>');
  const mode = getStepsMode();
  state.steps.forEach((s, i) => {
    let content = '';
    if (typeof s === 'string') content = s;
    else if (s && typeof s === 'object') {
      if (mode === 'concise' && s.concise) content = s.concise;
      else if (mode === 'detailed' && s.detailed) content = s.detailed;
      else content = (s.html || JSON.stringify(s));
    } else content = String(s);
    win.document.write('<div class="step-item"><strong>Paso ' + (i+1) + ':</strong><div>' + content + '</div></div>');
  });
  win.document.write('</body></html>');
  win.document.close();
  win.focus();
  win.print();
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

  const entry = {
    operation,
    input,
    output,
    type,
    timestamp
  };

  // Opcional: si se pasan pasos como quinto argumento, guardarlos
  if (arguments.length >= 5 && arguments[4]) {
    entry.steps = arguments[4];
  }

  history.unshift(entry);

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
