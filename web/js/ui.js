/**
 * ui.js - Gestión de la interfaz de usuario
 * 
 * Centraliza toda la lógica de navegación, renderizado y manejo de eventos
 * de la interfaz gráfica.
 */

import {
  $,
  clearNode,
  getHistory,
  clearHistory,
  logOperation,
  parseVector,
  parseMatrix,
  renderVector,
  renderMatrix,
  renderScalar,
  refreshPreviews,
  validateVectors,
  validateMatricesForMultiplication
} from './utils.js';

import * as vectorOps from './vectorOperations.js';
import * as matrixOps from './matrixOperations.js';
import * as stepsManager from './stepsManager.js';
import * as exercises from './exercises.js';
import Config from './config.js';

// ============================================================================
// GESTIÓN DE SECCIONES
// ============================================================================

/**
 * Muestra una sección y oculta las demás
 */
export function showSection(id) {
  const sections = [
    'sect-vectores',
    'sect-matrices',
    'sect-historial',
    'sect-practice'
  ];
  
  sections.forEach(sectionId => {
    const el = $(sectionId);
    if (el) el.classList.add('hidden');
  });
  
  const target = $(id);
  if (target) target.classList.remove('hidden');
}

/**
 * Inicializa los navegadores de sección
 */
export function initSectionNavigation() {
  const btnVectores = $('btn-vectores');
  const btnMatrices = $('btn-matrices');
  const btnHistorial = $('btn-historial');
  const btnPractice = $('btn-practice');
  
  if (btnVectores) btnVectores.addEventListener('click', () => showSection('sect-vectores'));
  if (btnMatrices) btnMatrices.addEventListener('click', () => showSection('sect-matrices'));
  if (btnHistorial) {
    btnHistorial.addEventListener('click', () => {
      showSection('sect-historial');
      fillHistory();
    });
  }
  if (btnPractice) btnPractice.addEventListener('click', () => showSection('sect-practice'));
}

// ============================================================================
// OPERACIONES CON VECTORES
// ============================================================================

export function initVectorOperations() {
  $('btn-sumar').addEventListener('click', () => performVectorOperation(
    Config.OPERATIONS.VECTOR_SUM,
    vectorOps.addVectors,
    vectorOps.stepsVectorSum,
    'vectores'
  ));
  
  $('btn-restar').addEventListener('click', () => performVectorOperation(
    Config.OPERATIONS.VECTOR_SUB,
    vectorOps.subtractVectors,
    vectorOps.stepsVectorSubtract,
    'vectores'
  ));
  
  $('btn-punto').addEventListener('click', () => {
    try {
      const A = parseVector($('vecA').value);
      const B = parseVector($('vecB').value);
      
      const vOk = validateVectors(A, B);
      if (!vOk.ok) {
        showError($('out-vectores'), vOk);
        return;
      }
      
      const result = vectorOps.dotProduct(A, B);
      const out = $('out-vectores');
      clearNode(out);
      const txt = document.createElement('div');
      txt.textContent = `A · B = ${result}`;
      out.appendChild(txt);
      
      logOperation(Config.OPERATIONS.DOT_PRODUCT, { A, B }, result);
      
      if ($('show-steps-vectores') && $('show-steps-vectores').checked) {
        const steps = vectorOps.stepsDotProduct(A, B);
        stepsManager.enterStepsMode('vectores', steps);
      } else {
        clearNode($('steps-vectores'));
      }
    } catch (e) {
      $('out-vectores').textContent = `Error: ${e}`;
    }
  });
  
  $('btn-escalar').addEventListener('click', () => {
    try {
      const A = parseVector($('vecA').value);
      const k = parseFloat($('escalar').value);
      
      if (Number.isNaN(k)) throw 'Escalar inválido';
      
      const result = vectorOps.scalarMultiply(A, k);
      renderVector($('out-vectores'), result);
      
      logOperation(Config.OPERATIONS.SCALAR_MUL, { A, k }, result);
      
      if ($('show-steps-vectores') && $('show-steps-vectores').checked) {
        const steps = vectorOps.stepsScalarMultiply(A, k);
        stepsManager.enterStepsMode('vectores', steps);
      } else {
        clearNode($('steps-vectores'));
      }
    } catch (e) {
      $('out-vectores').textContent = `Error: ${e}`;
    }
  });
  
  $('btn-norma').addEventListener('click', () => {
    try {
      const A = parseVector($('vecA').value);
      const result = vectorOps.norm(A);
      
      const out = $('out-vectores');
      clearNode(out);
      const txt = document.createElement('div');
      txt.textContent = `||A|| = ${result}`;
      out.appendChild(txt);
      
      logOperation(Config.OPERATIONS.NORM, { A }, result);
      
      if ($('show-steps-vectores') && $('show-steps-vectores').checked) {
        const steps = vectorOps.stepsNorm(A);
        stepsManager.enterStepsMode('vectores', steps);
      } else {
        clearNode($('steps-vectores'));
      }
    } catch (e) {
      $('out-vectores').textContent = `Error: ${e}`;
    }
  });
}

function performVectorOperation(operationType, operation, stepsGenerator, section) {
  try {
    const A = parseVector($('vecA').value);
    const B = parseVector($('vecB').value);
    
    const vOk = validateVectors(A, B);
    if (!vOk.ok) {
      showError($('out-vectores'), vOk);
      return;
    }
    
    const result = operation(A, B);
    renderVector($('out-vectores'), result);
    
    logOperation(operationType, { A, B }, result);
    
    if ($('show-steps-vectores') && $('show-steps-vectores').checked) {
      const steps = stepsGenerator(A, B);
      stepsManager.enterStepsMode(section, steps);
    } else {
      clearNode($('steps-vectores'));
    }
  } catch (e) {
    $('out-vectores').textContent = `Error: ${e}`;
  }
}

// ============================================================================
// OPERACIONES CON MATRICES
// ============================================================================

export function initMatrixOperations() {
  $('btn-m-sum').addEventListener('click', () => performMatrixOperation(
    Config.OPERATIONS.MATRIX_SUM,
    matrixOps.addMatrices,
    matrixOps.stepsMatrixSum,
    'matrices'
  ));
  
  $('btn-m-mul').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const B = parseMatrix($('matB').value);
      
      const vOk = validateMatricesForMultiplication(A, B);
      if (!vOk.ok) {
        showError($('out-matrices'), vOk);
        return;
      }
      
      const result = matrixOps.multiplyMatrices(A, B);
      renderMatrix($('out-matrices'), result);
      
      logOperation(Config.OPERATIONS.MATRIX_MUL, { A, B }, result);
      
      if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
        const steps = matrixOps.stepsMatrixMultiply(A, B);
        stepsManager.enterStepsMode('matrices', steps);
      } else {
        clearNode($('steps-matrices'));
      }
    } catch (e) {
      $('out-matrices').textContent = `Error: ${e}`;
    }
  });
  
  $('btn-transp').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const result = matrixOps.transpose(A);
      
      renderMatrix($('out-matrices'), result);
      logOperation(Config.OPERATIONS.TRANSPOSE, { A }, result);
      
      if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
        const steps = matrixOps.stepsTranspose(A);
        stepsManager.enterStepsMode('matrices', steps);
      } else {
        clearNode($('steps-matrices'));
      }
    } catch (e) {
      $('out-matrices').textContent = `Error: ${e}`;
    }
  });
  
  $('btn-det').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const det = matrixOps.determinant(A);
      
      const out = $('out-matrices');
      clearNode(out);
      const div = document.createElement('div');
      div.textContent = `Determinante = ${det}`;
      out.appendChild(div);
      
      logOperation(Config.OPERATIONS.DETERMINANT, { A }, det);
    } catch (e) {
      showError($('out-matrices'), { msg: e });
    }
  });
  
  $('btn-inv').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const inv = matrixOps.inverseMatrix(A);
      
      renderMatrix($('out-matrices'), inv);
      logOperation(Config.OPERATIONS.INVERSE, { A }, inv);
      
      if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
        stepsManager.enterStepsMode('matrices', [
          'Inversa calculada mediante Gauss-Jordan.'
        ]);
      }
    } catch (e) {
      showError($('out-matrices'), { msg: e });
    }
  });
  
  $('btn-lu').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const { L, U } = matrixOps.luDecomposition(A);
      
      const out = $('out-matrices');
      clearNode(out);
      
      const h = document.createElement('div');
      h.innerHTML = '<strong>L:</strong>';
      out.appendChild(h);
      renderMatrix(out, L);
      
      const h2 = document.createElement('div');
      h2.innerHTML = '<strong>U:</strong>';
      out.appendChild(h2);
      renderMatrix(out, U);
      
      logOperation(Config.OPERATIONS.LU_DECOMPOSITION, { A }, { L, U });
      
      if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
        stepsManager.enterStepsMode('matrices', [
          'Descomposición LU (Doolittle) realizada.'
        ]);
      }
    } catch (e) {
      showError($('out-matrices'), { msg: e });
    }
  });
  
  $('btn-gauss').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const b = parseVector($('vecBmat').value);
      
      const res = matrixOps.gaussSolveWithSteps(A, b);
      
      const out = $('out-matrices');
      clearNode(out);
      
      const lbl = document.createElement('div');
      lbl.className = 'result-label';
      lbl.textContent = 'Solución (Gauss):';
      out.appendChild(lbl);
      
      const solDiv = document.createElement('div');
      out.appendChild(solDiv);
      renderVector(solDiv, res.x);
      
      logOperation(Config.OPERATIONS.GAUSS_SOLVE, { A, b }, res.x);
      
      if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
        stepsManager.enterStepsMode('matrices', res.steps);
      } else {
        clearNode($('steps-matrices'));
      }
    } catch (e) {
      showError($('out-matrices'), { msg: e });
    }
  });
  
  $('btn-jacobi').addEventListener('click', () => {
    try {
      const A = parseMatrix($('matA').value);
      const b = parseVector($('vecBmat').value);
      const opts = { tol: 1e-8, maxIter: 1000 };
      
      const res = matrixOps.jacobi(A, b, opts);
      
      const out = $('out-matrices');
      clearNode(out);
      
      const lbl = document.createElement('div');
      lbl.className = 'result-label';
      lbl.textContent = 'Solución (Jacobi):';
      out.appendChild(lbl);
      
      const solDiv = document.createElement('div');
      out.appendChild(solDiv);
      renderVector(solDiv, res.x);
      
      const info = document.createElement('div');
      info.textContent = `Iteraciones: ${res.iterations}  Convergió: ${res.tolReached}`;
      out.appendChild(info);
      
      logOperation(Config.OPERATIONS.JACOBI_SOLVE, { A, b, opts }, res);
      
      if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
        const steps = [
          `Algoritmo Jacobi iterativo. Parámetros: tol=${opts.tol} maxIter=${opts.maxIter}`,
          `Resultado final: x (después de ${res.iterations} iteraciones)`,
          `Converged: ${res.tolReached}`
        ];
        stepsManager.enterStepsMode('matrices', steps);
      }
    } catch (e) {
      showError($('out-matrices'), { msg: e });
    }
  });
}

function performMatrixOperation(operationType, operation, stepsGenerator, section) {
  try {
    const A = parseMatrix($('matA').value);
    const B = parseMatrix($('matB').value);
    
    if (!A.length || !B.length) {
      showError($('out-matrices'), {
        msg: 'Una de las matrices está vacía'
      });
      return;
    }
    
    const result = operation(A, B);
    renderMatrix($('out-matrices'), result);
    
    logOperation(operationType, { A, B }, result);
    
    if ($('show-steps-matrices') && $('show-steps-matrices').checked) {
      const steps = stepsGenerator(A, B);
      stepsManager.enterStepsMode(section, steps);
    } else {
      clearNode($('steps-matrices'));
    }
  } catch (e) {
    $('out-matrices').textContent = `Error: ${e}`;
  }
}

// ============================================================================
// HISTORIAL
// ============================================================================

function fillHistory() {
  const ul = $('list-hist');
  if (!ul) return;
  
  ul.innerHTML = '';
  const hist = getHistory();
  
  hist.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.timestamp} | ${item.tipo} | ${
      typeof item.resultado === 'object' ? JSON.stringify(item.resultado) : String(item.resultado)
    }`;
    ul.appendChild(li);
  });
}

export function initHistory() {
  const btnRefresh = $('btn-refresh');
  const btnClear = $('btn-clear');
  const btnExport = $('btn-export');
  const fileImport = $('file-import');
  
  if (btnRefresh) {
    btnRefresh.addEventListener('click', fillHistory);
  }
  
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('¿Borrar historial?')) {
        clearHistory();
        fillHistory();
      }
    });
  }
  
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const hist = getHistory();
      const blob = new Blob(
        hist.map(it => JSON.stringify(it) + '\n'),
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historial.jsonl';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  
  if (fileImport) {
    fileImport.addEventListener('change', (ev) => {
      const f = ev.target.files[0];
      if (!f) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        const lines = reader.result
          .split(/\r?\n/)
          .map(s => s.trim())
          .filter(Boolean);
        
        const hist = getHistory();
        let imported = 0;
        
        for (const line of lines) {
          try {
            const obj = JSON.parse(line);
            hist.push(obj);
            imported++;
          } catch (e) {
            console.warn('Línea no JSON:', line);
          }
        }
        
        localStorage.setItem(Config.STORAGE.HISTORY_KEY, JSON.stringify(hist));
        alert(`Importadas ${imported} líneas`);
        fillHistory();
      };
      
      reader.readAsText(f);
    });
  }
}

// ============================================================================
// EJERCICIOS
// ============================================================================

export function initExercises() {
  const btnGen = $('btn-gen-exercise');
  const btnCheck = $('btn-check-exercise');
  
  if (btnGen) {
    btnGen.addEventListener('click', () => {
      const type = $('practice-type').value;
      exercises.generateExercise(type);
    });
  }
  
  if (btnCheck) {
    btnCheck.addEventListener('click', () => {
      exercises.checkExercise();
    });
  }
}

// ============================================================================
// VISUALIZADOR DE VECTORES
// ============================================================================

export function drawVectors() {
  const canvas = $('canvas-vec');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const A = parseVector($('vecA').value);
  const B = parseVector($('vecB').value);
  
  const dim = document.querySelector('input[name="viz-dim"]:checked')?.value || '2d';
  const rotX = (parseFloat($('rotX')?.value) || 0) * Math.PI / 180;
  const rotY = (parseFloat($('rotY')?.value) || 0) * Math.PI / 180;
  const zoom = parseFloat($('zoom')?.value) || 1;
  
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  // Dibujar ejes
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, 0);
  ctx.moveTo(0, -canvas.height / 2);
  ctx.lineTo(0, canvas.height / 2);
  ctx.stroke();
  
  function proj2(p) {
    return { x: p[0] * zoom, y: -p[1] * zoom };
  }
  
  function proj3(p) {
    let [x, y, z] = p;
    
    // Rotación X
    let y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
    let z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
    
    // Rotación Y
    let x2 = x * Math.cos(rotY) + z2 * Math.sin(rotY);
    let z3 = -x * Math.sin(rotY) + z2 * Math.cos(rotY);
    
    // Perspectiva simple
    const f = 1 / (1 + z3 * 0.2);
    return { x: x2 * f * zoom, y: -y2 * f * zoom };
  }
  
  function drawArrow(p, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    
    // Cabeza de la flecha
    const ang = Math.atan2(p.y, p.x);
    const h = 8;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - h * Math.cos(ang - 0.3), p.y - h * Math.sin(ang - 0.3));
    ctx.lineTo(p.x - h * Math.cos(ang + 0.3), p.y - h * Math.sin(ang + 0.3));
    ctx.closePath();
    ctx.fill();
  }
  
  if (dim === '2d') {
    if (A.length >= 2) drawArrow(proj2([A[0], A[1]]), '#0b5ed7');
    if (B.length >= 2) drawArrow(proj2([B[0], B[1]]), '#3aa0ff');
  } else {
    if (A.length >= 3) drawArrow(proj3([A[0], A[1], A[2]]), '#0b5ed7');
    else if (A.length >= 2) drawArrow(proj3([A[0], A[1], 0]), '#0b5ed7');
    
    if (B.length >= 3) drawArrow(proj3([B[0], B[1], B[2]]), '#3aa0ff');
    else if (B.length >= 2) drawArrow(proj3([B[0], B[1], 0]), '#3aa0ff');
  }
  
  ctx.restore();
}

export function initVisualizer() {
  const btnDraw = $('btn-draw-viz');
  if (btnDraw) btnDraw.addEventListener('click', drawVectors);
  
  const rotX = $('rotX');
  const rotY = $('rotY');
  const zoom = $('zoom');
  
  if (rotX) rotX.addEventListener('input', drawVectors);
  if (rotY) rotY.addEventListener('input', drawVectors);
  if (zoom) zoom.addEventListener('input', drawVectors);
}

export function initInputPreviews() {
  ['vecA', 'vecB', 'escalar', 'matA', 'matB', 'vecBmat'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', refreshPreviews);
  });
  
  const vA = $('vecA');
  const vB = $('vecB');
  if (vA) vA.addEventListener('input', drawVectors);
  if (vB) vB.addEventListener('input', drawVectors);
  
  refreshPreviews();
  try {
    drawVectors();
  } catch (e) {
    // Ignorar errores iniciales
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

function showError(container, error) {
  clearNode(container);
  const err = document.createElement('div');
  err.className = 'msg-error';
  err.textContent = error.msg + (error.suggestion ? ` — ${error.suggestion}` : '');
  container.appendChild(err);
}

export default {
  showSection,
  initSectionNavigation,
  initVectorOperations,
  initMatrixOperations,
  initHistory,
  initExercises,
  initVisualizer,
  initInputPreviews
};
