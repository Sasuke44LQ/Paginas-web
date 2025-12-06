/**
 * stepsManager.js - Gestión de pasos y modos paso a paso
 * 
 * Maneja la visualización, navegación y control de los pasos detallados
 * de cada operación matemática.
 */

import { $, clearNode, renderSteps } from './utils.js';
import Config from './config.js';

/**
 * Estado global para los pasos de cada sección
 */
const stepsState = {
  vectores: { steps: [], idx: 0, showAll: false },
  matrices: { steps: [], idx: 0, showAll: false }
};

/**
 * Renderiza el paso actual o todos los pasos
 */
export function renderCurrentStep(section) {
  const st = stepsState[section];
  const container = $('steps-' + section);
  const controls = $('step-controls-' + section);
  const counter = $('step-counter-' + section);
  
  if (!container) return;
  
  clearNode(container);
  
  if (!st.steps || st.steps.length === 0) {
    container.textContent = Config.MESSAGES.NO_STEPS;
    if (controls) controls.style.display = 'none';
    if (counter) counter.textContent = '';
    return;
  }
  
  if (st.showAll) {
    // Mostrar todos los pasos
    renderSteps(container, st.steps);
    if (controls) controls.style.display = 'flex';
    if (counter) counter.textContent = 'Mostrando todos los pasos';
    return;
  }
  
  // Mostrar paso individual
  const idx = Math.max(0, Math.min(st.idx, st.steps.length - 1));
  const div = document.createElement('div');
  div.className = 'step-item';
  div.textContent = st.steps[idx];
  container.appendChild(div);
  
  if (controls) controls.style.display = 'flex';
  if (counter) counter.textContent = `Paso ${idx + 1} / ${st.steps.length}`;
}

/**
 * Entra en modo pasos para una sección
 */
export function enterStepsMode(section, stepsArray) {
  const st = stepsState[section];
  st.steps = stepsArray || [];
  st.idx = 0;
  st.showAll = false;
  renderCurrentStep(section);
}

/**
 * Avanza al siguiente paso
 */
export function stepNext(section) {
  const st = stepsState[section];
  if (!st.steps || st.steps.length === 0) return;
  st.idx = Math.min(st.idx + 1, st.steps.length - 1);
  renderCurrentStep(section);
}

/**
 * Retrocede al paso anterior
 */
export function stepPrev(section) {
  const st = stepsState[section];
  if (!st.steps || st.steps.length === 0) return;
  st.idx = Math.max(st.idx - 1, 0);
  renderCurrentStep(section);
}

/**
 * Alterna entre mostrar todos los pasos o paso a paso
 */
export function stepToggleAll(section) {
  const st = stepsState[section];
  st.showAll = !st.showAll;
  renderCurrentStep(section);
}

/**
 * Configura los event listeners para los controles de pasos
 */
export function wireStepControls() {
  const mappings = [
    ['vectores', 'prev-step-vectores', 'next-step-vectores', 'show-all-steps-vectores'],
    ['matrices', 'prev-step-matrices', 'next-step-matrices', 'show-all-steps-matrices']
  ];
  
  mappings.forEach(([section, prevId, nextId, allId]) => {
    const prev = $(prevId);
    const next = $(nextId);
    const all = $(allId);
    const showCb = $('show-steps-' + section);
    
    if (prev) prev.addEventListener('click', () => stepPrev(section));
    if (next) next.addEventListener('click', () => stepNext(section));
    
    if (all) {
      all.addEventListener('click', () => {
        stepToggleAll(section);
        all.textContent = stepsState[section].showAll ? 'Ocultar todo' : 'Mostrar todo';
      });
    }
    
    if (showCb) {
      showCb.addEventListener('change', () => {
        const stepsContainer = $('steps-' + section);
        if (showCb.checked) {
          renderCurrentStep(section);
        } else {
          if (stepsContainer) clearNode(stepsContainer);
          const controls = $('step-controls-' + section);
          if (controls) controls.style.display = 'none';
        }
      });
    }
  });
}

/**
 * Imprime los pasos en una ventana nueva
 */
export function printSteps(section) {
  const st = stepsState[section];
  
  if (!st || !st.steps || st.steps.length === 0) {
    alert(Config.MESSAGES.NO_STEPS);
    return;
  }
  
  const w = window.open('', '_blank');
  const title = section === 'vectores' ? 'Pasos - Vectores' : 'Pasos - Matrices';
  
  let html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Segoe UI, Arial; padding: 16px; }
    .step { margin-bottom: 8px; }
    h2 { margin-top: 0; }
  </style>
</head>
<body>
  <h2>${title}</h2>`;
  
  if (st.showAll) {
    html += '<ol>';
    st.steps.forEach(s => {
      html += `<li class="step">${String(s)}</li>`;
    });
    html += '</ol>';
  } else {
    html += '<div>Resumen:</div><ol>';
    html += `<li>${String(st.steps[Math.max(0, st.idx)])}</li>`;
    html += '</ol>';
  }
  
  html += `<script>window.onload=function(){window.print();}</script>
</body>
</html>`;
  
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/**
 * Obtiene el estado actual de los pasos
 */
export function getStepsState() {
  return stepsState;
}

export default {
  renderCurrentStep,
  enterStepsMode,
  stepNext,
  stepPrev,
  stepToggleAll,
  wireStepControls,
  printSteps,
  getStepsState
};
