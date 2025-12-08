/* js/exercises.js - Generador de ejercicios educativos
 *
 * Provee funciones para generar ejercicios aleatorios de vectores y matrices,
 * rellenar campos en la UI y producir pasos/soluciones usando las funciones
 * matemáticas ya presentes en el proyecto.
 */

function randInt(min, max, seed) {
  if (typeof seed === 'number') {
    // simple LCG
    seed = (seed * 9301 + 49297) % 233280;
    return min + Math.floor((seed / 233280) * (max - min + 1));
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomVector(d, min=-5, max=5, seeded) {
  const arr = [];
  for (let i=0;i<d;i++) arr.push(randInt(min, max, seeded));
  return arr;
}

function randomMatrix(r, c, min=-5, max=5, seeded) {
  const m = [];
  for (let i=0;i<r;i++) m.push(randomVector(c, min, max, seeded && (seeded + i)));
  return m;
}

function formatMatrixInput(matrix) {
  // formato: rows separated by ; elements by ,
  return matrix.map(row => row.join(',')).join(';');
}

function generateExercise() {
  const type = $('#ex-type').value;
  const diff = $('#ex-difficulty').value;
  const seedVal = $('#ex-seed').value ? parseInt($('#ex-seed').value) : null;

  // Difficulty mapping
  let size = 2;
  if (diff === 'easy') size = 2;
  else if (diff === 'medium') size = 3;
  else if (diff === 'hard') size = 4;

  // clear previous
  $('#out-exercise').textContent = '';
  $('#answer-input').value = '';

  if (type.startsWith('vector')) {
    if (type === 'vector-sum') {
      const v1 = randomVector(size, -5, 5, seedVal);
      const v2 = randomVector(size, -5, 5, seedVal && seedVal+1);
      // colocar en inputs de vectores para aprovechar handlers
      $('#vecA').value = v1.join(',');
      $('#vecB').value = v2.join(',');
      $('#out-exercise').innerHTML = `Suma: A = ${vectorToString(v1)}, B = ${vectorToString(v2)}`;
      // calcular solución y pasos
      const res = addVectors(v1, v2);
      // guardar ejercicio actual para comprobación
      APP_STATE.currentExercise = { type: 'vector-sum', solution: res, solutionType: 'vector' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><p>A = ${vectorToString(v1)}<br>B = ${vectorToString(v2)}</p><p class="explanation">Generado automáticamente</p>`, concise: `A+B`, html: `<p>A = ${vectorToString(v1)}; B = ${vectorToString(v2)}</p>` });
      v1.forEach((val,i) => steps.push({ detailed: `<p>Componente ${i+1}: ${formatNumber(val)} + ${formatNumber(v2[i])} = <strong>${formatNumber(res[i])}</strong></p>`, concise: `${formatNumber(res[i])}`, html: `<div class="step-calc">${formatNumber(val)} + ${formatNumber(v2[i])} = <strong>${formatNumber(res[i])}</strong></div>` }));
      steps.push({ detailed: `<p><strong>Resultado</strong></p><p>${vectorToString(res)}</p>`, concise: `Resultado = ${vectorToString(res)}`, html: `<p>${vectorToString(res)}</p>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: suma de vectores', `${vectorToString(v1)} + ${vectorToString(v2)}`, vectorToString(res), 'practice', steps);
    }
    else if (type === 'vector-dot') {
      const v1 = randomVector(size, -5,5, seedVal);
      const v2 = randomVector(size, -5,5, seedVal && seedVal+2);
      $('#vecA').value = v1.join(',');
      $('#vecB').value = v2.join(',');
      $('#out-exercise').textContent = `Producto punto entre A y B`;
      const products = v1.map((v,i) => v * v2[i]);
      const res = dotProduct(v1,v2);
      APP_STATE.currentExercise = { type: 'vector-dot', solution: res, solutionType: 'scalar' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><p>A=${vectorToString(v1)}<br>B=${vectorToString(v2)}</p>`, concise: `A·B`, html: `<p>A·B</p>` });
      products.forEach((p,i) => steps.push({ detailed: `<p>Multiplicar componente ${i+1}: ${formatNumber(v1[i])} × ${formatNumber(v2[i])} = ${formatNumber(p)}</p>`, concise: `${formatNumber(p)}`, html: `<div class="step-calc">${formatNumber(v1[i])} × ${formatNumber(v2[i])} = <strong>${formatNumber(p)}</strong></div>` }));
      steps.push({ detailed: `<p><strong>Suma</strong> ${products.map(formatNumber).join(' + ')} = <strong>${formatNumber(res)}</strong></p>`, concise: `Resultado = ${formatNumber(res)}`, html: `<p><strong>Resultado:</strong> ${formatNumber(res)}</p>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: producto punto', `${vectorToString(v1)}·${vectorToString(v2)}`, formatNumber(res), 'practice', steps);
    }
    else if (type === 'vector-scalar') {
      const v = randomVector(size, -5,5, seedVal);
      const scalar = randInt(-5,5, seedVal && seedVal+3);
      $('#vecA').value = v.join(',');
      $('#escalar').value = scalar;
      $('#out-exercise').textContent = `Multiplicar vector por escalar`;
      const res = scalarMultiply(v, scalar);
      APP_STATE.currentExercise = { type: 'vector-scalar', solution: res, solutionType: 'vector' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><p>Vector = ${vectorToString(v)}<br>Escalar = ${formatNumber(scalar)}</p>`, concise: `× ${formatNumber(scalar)}`, html: `<p>Escalar ${formatNumber(scalar)}</p>` });
      v.forEach((val,i) => steps.push({ detailed: `<p>Componente ${i+1}: ${formatNumber(val)} × ${formatNumber(scalar)} = <strong>${formatNumber(res[i])}</strong></p>`, concise: `${formatNumber(res[i])}`, html: `<div class="step-calc">${formatNumber(val)} × ${formatNumber(scalar)} = <strong>${formatNumber(res[i])}</strong></div>` }));
      steps.push({ detailed: `<p><strong>Resultado</strong></p><p>${vectorToString(res)}</p>`, concise: `Resultado = ${vectorToString(res)}`, html: `<p>${vectorToString(res)}</p>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: multiplicación escalar', `${formatNumber(scalar)}*${vectorToString(v)}`, vectorToString(res), 'practice', steps);
    }
    else if (type === 'vector-norm') {
      const v = randomVector(size, -5,5, seedVal);
      $('#vecA').value = v.join(',');
      $('#out-exercise').textContent = `Calcular norma de un vector`;
      const squares = v.map(val => val*val);
      const sum = squares.reduce((a,b)=>a+b,0);
      const res = norm(v);
      APP_STATE.currentExercise = { type: 'vector-norm', solution: res, solutionType: 'scalar' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><p>Vector = ${vectorToString(v)}</p>`, concise: `Norma`, html: `<p>Norma</p>` });
      steps.push({ detailed: `<p>Cuadrados: ${squares.map(formatNumber).join(', ')}</p>`, concise: `Cuadrados`, html: `<p>${squares.map(formatNumber).join(', ')}</p>` });
      steps.push({ detailed: `<p>Suma = ${formatNumber(sum)}</p><p>sqrt(${formatNumber(sum)}) = <strong>${formatNumber(res)}</strong></p>`, concise: `Norma = ${formatNumber(res)}`, html: `<p><strong>Norma:</strong> ${formatNumber(res)}</p>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: norma', `${vectorToString(v)}`, formatNumber(res), 'practice', steps);
    }
  } else if (type.startsWith('matrix')) {
    if (type === 'matrix-sum') {
      const A = randomMatrix(size, size, -5,5, seedVal);
      const B = randomMatrix(size, size, -5,5, seedVal && seedVal+1);
      if ($('#matA-grid')) buildMatrixGrid('#matA-grid', A.length, A[0].length, 'matA', A);
      else if ($('#matA')) $('#matA').value = formatMatrixInput(A);
      if ($('#matB-grid')) buildMatrixGrid('#matB-grid', B.length, B[0].length, 'matB', B);
      else if ($('#matB')) $('#matB').value = formatMatrixInput(B);
      $('#out-exercise').textContent = `Suma de matrices A + B`;
      const res = addMatrices(A,B);
      APP_STATE.currentExercise = { type: 'matrix-sum', solution: res, solutionType: 'matrix' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><pre>${matrixToString(A)}</pre><pre>+</pre><pre>${matrixToString(B)}</pre>`, concise: `A+B`, html: `<pre>${matrixToString(A)}</pre><pre>+</pre><pre>${matrixToString(B)}</pre>` });
      for (let i=0;i<size;i++) for (let j=0;j<size;j++) steps.push({ detailed: `<p>Elemento [${i+1},${j+1}]: ${formatNumber(A[i][j])} + ${formatNumber(B[i][j])} = <strong>${formatNumber(res[i][j])}</strong></p>`, concise: `${formatNumber(res[i][j])}`, html: `<div class="step-calc">${formatNumber(A[i][j])} + ${formatNumber(B[i][j])} = <strong>${formatNumber(res[i][j])}</strong></div>` });
      steps.push({ detailed: `<p><strong>Resultado</strong></p><pre>${matrixToString(res)}</pre>`, concise: `Resultado matriz`, html: `<pre>${matrixToString(res)}</pre>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: suma de matrices', `${matrixToString(A)}+${matrixToString(B)}`, matrixToString(res), 'practice', steps);
    }
    else if (type === 'matrix-mul') {
      const A = randomMatrix(size, size, -3,3, seedVal);
      const B = randomMatrix(size, size, -3,3, seedVal && seedVal+1);
      if ($('#matA-grid')) buildMatrixGrid('#matA-grid', A.length, A[0].length, 'matA', A);
      else if ($('#matA')) $('#matA').value = formatMatrixInput(A);
      if ($('#matB-grid')) buildMatrixGrid('#matB-grid', B.length, B[0].length, 'matB', B);
      else if ($('#matB')) $('#matB').value = formatMatrixInput(B);
      $('#out-exercise').textContent = `Multiplicación A × B (ejemplo de entradas)`;
      const res = multiplyMatrices(A,B);
      APP_STATE.currentExercise = { type: 'matrix-mul', solution: res, solutionType: 'matrix' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><pre>${matrixToString(A)}</pre><pre>×</pre><pre>${matrixToString(B)}</pre>`, concise: `A×B`, html: `<pre>${matrixToString(A)}</pre><pre>×</pre><pre>${matrixToString(B)}</pre>` });
      for (let i=0;i<Math.min(2,size);i++) for (let j=0;j<Math.min(2,size);j++) {
        const terms = [];
        for (let k=0;k<size;k++) terms.push(`${formatNumber(A[i][k])}×${formatNumber(B[k][j])}`);
        steps.push({ detailed: `<p>Calcular C[${i+1},${j+1}]: ${terms.join(' + ')} = <strong>${formatNumber(res[i][j])}</strong></p>`, concise: `C[${i+1},${j+1}] = ${formatNumber(res[i][j])}`, html: `<div class="step-calc">C[${i+1},${j+1}] = ${terms.join(' + ')} = <strong>${formatNumber(res[i][j])}</strong></div>` });
      }
      steps.push({ detailed: `<p><strong>Resultado (matriz completa)</strong></p><pre>${matrixToString(res)}</pre>`, concise: `Resultado`, html: `<pre>${matrixToString(res)}</pre>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: multiplicación matrices', `${matrixToString(A)}×${matrixToString(B)}`, matrixToString(res), 'practice', steps);
    }
    else if (type === 'matrix-det') {
      const A = randomMatrix(size, size, -4,4, seedVal);
      if ($('#matA-grid')) buildMatrixGrid('#matA-grid', A.length, A[0].length, 'matA', A);
      else if ($('#matA')) $('#matA').value = formatMatrixInput(A);
      $('#out-exercise').textContent = `Calcular determinante de A`;
      const det = determinant(A);
      APP_STATE.currentExercise = { type: 'matrix-det', solution: det, solutionType: 'scalar' };
      const steps = [];
      steps.push({ detailed: `<p><strong>Entrada</strong></p><pre>${matrixToString(A)}</pre>`, concise: `det(A)`, html: `<pre>${matrixToString(A)}</pre>` });
      steps.push({ detailed: `<p><strong>Resultado</strong> det(A) = <strong>${formatNumber(det)}</strong></p>`, concise: `det = ${formatNumber(det)}`, html: `<p><strong>Determinante:</strong> ${formatNumber(det)}</p>` });
      setSteps('practice', steps);
      logOperation('Ejercicio: determinante', `${matrixToString(A)}`, formatNumber(det), 'practice', steps);
    }
    else if (type === 'matrix-gauss') {
      const A = randomMatrix(size, size, -4,4, seedVal);
      const b = randomVector(size, -4,4, seedVal && seedVal+1);
      if ($('#matA-grid')) buildMatrixGrid('#matA-grid', A.length, A[0].length, 'matA', A);
      else if ($('#matA')) $('#matA').value = formatMatrixInput(A);
      $('#vecBmat').value = b.join(',');
      $('#out-exercise').textContent = `Resolver Ax=b por Gauss`;
      try {
        const x = gaussSolve(A,b);
        APP_STATE.currentExercise = { type: 'matrix-gauss', solution: x, solutionType: 'vector' };
        const steps = [];
        steps.push({ detailed: `<p><strong>Entrada</strong></p><pre>${matrixToString(A)}</pre><p>b = ${vectorToString(b)}</p>`, concise: `Ax=b`, html: `<pre>${matrixToString(A)}</pre><p>b=${vectorToString(b)}</p>` });
        // Reuse previous gauss step generator? For now, append solution
        steps.push({ detailed: `<p><strong>Solución</strong></p><p>x = ${vectorToString(x)}</p>`, concise: `x=${vectorToString(x)}`, html: `<p>x = ${vectorToString(x)}</p>` });
        setSteps('practice', steps);
        logOperation('Ejercicio: Gauss', `A=${matrixToString(A)}, b=${vectorToString(b)}`, vectorToString(x), 'practice', steps);
      } catch (err) {
        $('#out-exercise').textContent = 'No es posible resolver (matriz singular)';
      }
    }
  }

  // mostrar primer paso inmediatamente
  renderStep('practice', 0);
}

function initExercises() {
  try {
    $('#btn-gen-ex')?.addEventListener('click', generateExercise);
    $('#btn-show-solution')?.addEventListener('click', () => {
      // mostrar todos los pasos de practice
      showAllSteps('practice');
    });
    $('#btn-check-answer')?.addEventListener('click', () => {
      checkExerciseAnswer();
    });
  } catch (err) {
    console.error('Error inicializando ejercicios:', err);
  }
}

// export initExercises para que UI lo llame
window.initExercises = initExercises;

function compareVectors(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i=0;i<a.length;i++) {
    const na = Number(a[i]);
    const nb = Number(b[i]);
    if (isNaN(na) || isNaN(nb)) return false;
    if (Math.abs(na - nb) > Math.pow(10, -Math.min(getDecimals(), 6))) return false;
  }
  return true;
}

function compareMatrices(m1, m2) {
  if (!Array.isArray(m1) || !Array.isArray(m2)) return false;
  if (m1.length !== m2.length) return false;
  for (let i=0;i<m1.length;i++) {
    if (!compareVectors(m1[i], m2[i])) return false;
  }
  return true;
}

function parseAnswerAsMatrixOrVector(str) {
  // intentar vector primero
  const v = parseVector(str);
  if (v) return { kind: 'vector', value: v };
  const m = parseMatrix(str);
  if (m) return { kind: 'matrix', value: m };
  const n = parseFloat(str);
  if (!isNaN(n)) return { kind: 'scalar', value: n };
  return null;
}

function setPracticeFeedback(text, ok) {
  const el = $('#practice-feedback');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('msg-error','msg-success','msg-info');
  el.classList.add(ok ? 'msg-success' : 'msg-error');
}

function checkExerciseAnswer() {
  const current = APP_STATE.currentExercise;
  if (!current) {
    alert('No hay ejercicio activo. Genera uno primero.');
    return;
  }
  const raw = ($('#answer-input') && $('#answer-input').value) || '';
  const parsed = parseAnswerAsMatrixOrVector(raw);
  let correct = false;
  try {
    if (current.solutionType === 'vector') {
      if (parsed && parsed.kind === 'vector') {
        correct = compareVectors(parsed.value, current.solution);
      }
    } else if (current.solutionType === 'matrix') {
      if (parsed && parsed.kind === 'matrix') {
        correct = compareMatrices(parsed.value, current.solution);
      }
    } else if (current.solutionType === 'scalar') {
      const n = parseFloat(raw);
      if (!isNaN(n)) {
        correct = Math.abs(n - Number(current.solution)) <= Math.pow(10, -Math.min(getDecimals(), 6));
      }
    }
  } catch (err) {
    console.error('Error comparando respuesta:', err);
  }

  if (correct) {
    setPracticeFeedback('Respuesta correcta ✅', true);
    // registrar en historial que el usuario respondió correctamente
    logOperation('Práctica - respuesta correcta', current.type, current.solution, 'practice', current.steps || []);
  } else {
    setPracticeFeedback('Respuesta incorrecta. Revisa los pasos o muestra la solución.', false);
    logOperation('Práctica - respuesta incorrecta', current.type, raw, 'practice', current.steps || []);
  }
}
