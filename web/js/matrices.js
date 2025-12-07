/**
 * js/matrices.js - Operaciones con matrices
 * 
 * Funciones matemáticas para trabajar con matrices:
 * - Suma
 * - Multiplicación
 * - Transpuesta
 * - Determinante
 * - Resolución por Gauss
 */

function addMatrices(m1, m2) {
  return m1.map((row, i) =>
    row.map((val, j) => val + m2[i][j])
  );
}

function multiplyMatrices(m1, m2) {
  const result = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function transpose(matrix) {
  return matrix[0].map((_, col) =>
    matrix.map(row => row[col])
  );
}

function determinant(matrix) {
  const n = matrix.length;
  
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  
  let det = 0;
  const mat = matrix.map(row => [...row]); // copia
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(mat[i][i]) < APP_CONFIG.GAUSS_TOLERANCE) {
        for (let k = j; k < n; k++) {
          if (Math.abs(mat[k][i]) >= APP_CONFIG.GAUSS_TOLERANCE) {
            [mat[i], mat[k]] = [mat[k], mat[i]];
            det *= -1;
            break;
          }
        }
      }
      
      if (Math.abs(mat[i][i]) < APP_CONFIG.GAUSS_TOLERANCE) continue;
      
      const factor = mat[j][i] / mat[i][i];
      for (let k = i; k < n; k++) {
        mat[j][k] -= factor * mat[i][k];
      }
    }
  }
  
  det *= 1;
  for (let i = 0; i < n; i++) {
    det *= mat[i][i];
  }
  
  return det;
}

function gaussSolve(A, b) {
  const n = A.length;
  const mat = A.map((row, i) => [...row, b[i]]);
  
  // Eliminación hacia adelante
  for (let i = 0; i < n; i++) {
    // Búsqueda del pivote
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) {
        maxRow = k;
      }
    }
    
    if (Math.abs(mat[maxRow][i]) < APP_CONFIG.GAUSS_TOLERANCE) {
      throw new Error('Matriz singular o casi singular');
    }
    
    // Intercambiar filas
    if (maxRow !== i) {
      [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
    }
    
    // Eliminación
    for (let k = i + 1; k < n; k++) {
      const factor = mat[k][i] / mat[i][i];
      for (let j = i; j <= n; j++) {
        mat[k][j] -= factor * mat[i][j];
      }
    }
  }
  
  // Sustitución hacia atrás
  const x = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = mat[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= mat[i][j] * x[j];
    }
    x[i] /= mat[i][i];
  }
  
  return x;
}

// ============ INICIALIZACIÓN DE UI PARA MATRICES ============

function initMatrixOperations() {
  try {
    // Suma de matrices
    $('#btn-m-sum')?.addEventListener('click', () => {
      const m1 = parseMatrix($('#matA').value);
      const m2 = parseMatrix($('#matB').value);
      
      if (!m1 || !m2) {
        alert('Ingresa dos matrices válidas');
        return;
      }
      
      if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
        alert('Las matrices deben tener las mismas dimensiones');
        return;
      }
      
      const res = addMatrices(m1, m2);
      renderMatrix($('#out-matrices'), res);
      // Pasos detallados: mostrar A, B y suma componente a componente
      const steps = [];
      steps.push({
        detailed: `<p><strong>Paso 1 — Entradas</strong></p><pre>${matrixToString(m1)}</pre><p>+</p><pre>${matrixToString(m2)}</pre>`,
        concise: `A + B` ,
        html: `<p><strong>Matriz A:</strong></p><pre>${matrixToString(m1)}</pre><p><strong>Matriz B:</strong></p><pre>${matrixToString(m2)}</pre>`
      });

      for (let i=0;i<m1.length;i++){
        for (let j=0;j<m1[0].length;j++){
          const a = formatNumber(m1[i][j]);
          const b = formatNumber(m2[i][j]);
          const r = formatNumber(res[i][j]);
          steps.push({
            detailed: `<p>Calcular elemento [${i+1},${j+1}]: ${a} + ${b} = <strong>${r}</strong></p>`,
            concise: `${a}+${b}=${r}`,
            html: `<div class="step-calc">${a} + ${b} = <strong>${r}</strong></div>`
          });
        }
      }

      steps.push({
        detailed: `<p><strong>Resultado final</strong></p><pre>${matrixToString(res)}</pre>`,
        concise: `Resultado matriz` ,
        html: `<p><strong>Resultado:</strong></p><pre>${matrixToString(res)}</pre>`
      });

      setSteps('matrices', steps);
      logOperation('Suma de matrices', `${matrixToString(m1)} + ${matrixToString(m2)}`, matrixToString(res), 'matrix', steps);
    });

    // Multiplicación de matrices
    $('#btn-m-mul')?.addEventListener('click', () => {
      const m1 = parseMatrix($('#matA').value);
      const m2 = parseMatrix($('#matB').value);
      
      if (!m1 || !m2) {
        alert('Ingresa dos matrices válidas');
        return;
      }
      
      if (m1[0].length !== m2.length) {
        alert('Las matrices son incompatibles para multiplicación');
        return;
      }
      
      const res = multiplyMatrices(m1, m2);
      renderMatrix($('#out-matrices'), res);
      // Pasos detallados para multiplicación: mostrar A, B y calcular entradas (ejemplo)
      const steps = [];
      steps.push({
        detailed: `<p><strong>Paso 1 — Entradas</strong></p><pre>${matrixToString(m1)}</pre><p>×</p><pre>${matrixToString(m2)}</pre>`,
        concise: `A × B`,
        html: `<p><strong>Matriz A:</strong></p><pre>${matrixToString(m1)}</pre><p><strong>Matriz B:</strong></p><pre>${matrixToString(m2)}</pre>`
      });

      // generar ejemplos de cálculo para las primeras filas/columnas (hasta 4 entradas)
      for (let i=0;i<Math.min(2,m1.length);i++){
        for (let j=0;j<Math.min(2,m2[0].length);j++){
          const terms = [];
          for (let k=0;k<m1[0].length;k++) terms.push(`${formatNumber(m1[i][k])}×${formatNumber(m2[k][j])}`);
          steps.push({
            detailed: `<p>Calcular C[${i+1},${j+1}]: ${terms.join(' + ')} = <strong>${formatNumber(res[i][j])}</strong></p>`,
            concise: `C[${i+1},${j+1}] = ${formatNumber(res[i][j])}`,
            html: `<div class="step-calc">C[${i+1},${j+1}] = ${terms.join(' + ')} = <strong>${formatNumber(res[i][j])}</strong></div>`
          });
        }
      }

      steps.push({
        detailed: `<p><strong>Resultado (matriz completa)</strong></p><pre>${matrixToString(res)}</pre>`,
        concise: `Resultado matriz`,
        html: `<p><strong>Resultado:</strong></p><pre>${matrixToString(res)}</pre>`
      });

      setSteps('matrices', steps);
      logOperation('Multiplicación de matrices', `${matrixToString(m1)} × ${matrixToString(m2)}`, matrixToString(res), 'matrix', steps);
    });

    // Transpuesta de A
    $('#btn-transp')?.addEventListener('click', () => {
      const m = parseMatrix($('#matA').value);
      if (!m) {
        alert('Ingresa una matriz válida');
        return;
      }
      
      const res = transpose(m);
      renderMatrix($('#out-matrices'), res);
      const steps = [];
      steps.push({
        detailed: `<p><strong>Paso 1 — Entrada</strong></p><pre>${matrixToString(m)}</pre>`,
        concise: `Transponer A`,
        html: `<p><strong>Matriz A:</strong></p><pre>${matrixToString(m)}</pre>`
      });

      steps.push({
        detailed: `<p><strong>Paso 2 — Transpuesta</strong></p><pre>${matrixToString(res)}</pre>`,
        concise: `Aᵀ = matriz transpuesta`,
        html: `<p><strong>Transpuesta:</strong></p><pre>${matrixToString(res)}</pre>`
      });

      setSteps('matrices', steps);
      logOperation('Transpuesta', matrixToString(m), matrixToString(res), 'matrix', steps);
    });

    // Determinante de A
    $('#btn-det')?.addEventListener('click', () => {
      const m = parseMatrix($('#matA').value);
      
      if (!m) {
        alert('Ingresa una matriz válida');
        return;
      }
      
      if (m.length !== m[0].length) {
        alert('La matriz debe ser cuadrada');
        return;
      }
      
      try {
        const det = determinant(m);
        $('#out-matrices').innerHTML = '<p><strong>Determinante:</strong> ' + formatNumber(det) + '</p>';
        const steps = [];
        steps.push({
          detailed: `<p><strong>Paso 1 — Entrada</strong></p><pre>${matrixToString(m)}</pre>`,
          concise: `Determinante de A`,
          html: `<p><strong>Matriz A:</strong></p><pre>${matrixToString(m)}</pre>`
        });

        steps.push({
          detailed: `<p><strong>Paso 2 — Cálculo</strong></p><p>Se aplica eliminación por filas (Gauss) o expansión según el caso; el valor calculado es <strong>${formatNumber(det)}</strong></p>`,
          concise: `det(A) = ${formatNumber(det)}`,
          html: `<p><strong>Determinante calculado:</strong> ${formatNumber(det)}</p>`
        });

        setSteps('matrices', steps);
        logOperation('Determinante', matrixToString(m), formatNumber(det), 'matrix', steps);
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });

    // Resolver por Gauss (Ax = b)
    $('#btn-gauss')?.addEventListener('click', () => {
      const A = parseMatrix($('#matA').value);
      const b = parseVector($('#vecBmat').value);
      
      if (!A || !b) {
        alert('Ingresa una matriz A y un vector b válidos');
        return;
      }
      
      if (A.length !== b.length || A.length !== A[0].length) {
        alert('Dimensiones incompatibles: A debe ser n×n y b de n elementos');
        return;
      }
      
      try {
        const x = gaussSolve(A, b);
        renderVector($('#out-matrices'), x);
        // Construir pasos detallados de eliminación y sustitución hacia atrás
        const steps = [];
        steps.push({
          detailed: `<p><strong>Paso 0 — Entradas</strong></p><pre>A =\n${matrixToString(A)}</pre><p>b = ${vectorToString(b)}</p>`,
          concise: `Resolver Ax=b`,
          html: `<p><strong>Matriz A:</strong></p><pre>${matrixToString(A)}</pre><p><strong>Vector b:</strong> ${vectorToString(b)}</p>`
        });

        // Generar una representación intermedia de la matriz aumentada en cada paso
        try {
          const n = A.length;
          const mat = A.map((row, i) => [...row, b[i]]);
          // Eliminación hacia delante (no mutar el mat original en la UI)
          for (let i = 0; i < n; i++) {
            // Buscar pivote
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
              if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
            }
            if (maxRow !== i) {
              [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
              steps.push({ detailed: `<p>Intercambiar fila ${i+1} con fila ${maxRow+1} (pivote)</p><pre>${matrixToString(mat)}</pre>`, concise: `Intercambiar filas ${i+1}↔${maxRow+1}`, html: `<div class="step-calc">Intercambiar fila ${i+1} con fila ${maxRow+1}</div><pre>${matrixToString(mat)}</pre>` });
            }
            if (Math.abs(mat[i][i]) < APP_CONFIG.GAUSS_TOLERANCE) {
              steps.push({ detailed: `<p>Pivote cercano a cero en fila ${i+1}, detener eliminación</p>`, concise: `Pivote ≈ 0`, html: `<div class="step-calc">Pivote cercano a cero en fila ${i+1}</div>` });
              continue;
            }
            for (let k = i + 1; k < n; k++) {
              const factor = mat[k][i] / mat[i][i];
              for (let j = i; j <= n; j++) mat[k][j] -= factor * mat[i][j];
              steps.push({ detailed: `<p>Eliminar entrada en fila ${k+1}, columna ${i+1} usando factor ${formatNumber(factor)}</p><pre>${matrixToString(mat)}</pre>`, concise: `Eliminación fila ${k+1}`, html: `<div class="step-calc">Eliminar fila ${k+1} col ${i+1} (factor ${formatNumber(factor)})</div><pre>${matrixToString(mat)}</pre>` });
            }
          }

          // Sustitución hacia atrás
          const xSteps = [];
          const xSol = new Array(n);
          for (let i = n - 1; i >= 0; i--) {
            let s = mat[i][n];
            for (let j = i + 1; j < n; j++) s -= mat[i][j] * xSol[j];
            xSol[i] = s / mat[i][i];
            xSteps.push({ detailed: `<p>Sustitución: resolver x[${i+1}] = (${formatNumber(s)}) / ${formatNumber(mat[i][i])} = <strong>${formatNumber(xSol[i])}</strong></p>`, concise: `x[${i+1}] = ${formatNumber(xSol[i])}`, html: `<div class="step-calc">x[${i+1}] = <strong>${formatNumber(xSol[i])}</strong></div>` });
          }

          // anexar pasos de sustitución en orden lógico
          xSteps.reverse().forEach(s => steps.push(s));

        } catch (err) {
          steps.push({ detailed: `<p>Error al construir pasos de Gauss: ${err.message}</p>`, concise: `Error Gauss`, html: `<div class="step-calc">Error: ${err.message}</div>` });
        }

        steps.push({ detailed: `<p><strong>Solución</strong></p><p>x = ${vectorToString(x)}</p>`, concise: `x = ${vectorToString(x)}`, html: `<p><strong>Solución (Gauss):</strong> ${vectorToString(x)}</p>` });

        setSteps('matrices', steps);
        logOperation('Solución Gauss', `A=${matrixToString(A)}, b=${vectorToString(b)}`, vectorToString(x), 'matrix', steps);
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });

  } catch (error) {
    console.error('Error inicializando operaciones de matrices:', error);
  }
}
