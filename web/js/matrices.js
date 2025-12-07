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
      logOperation('Suma de matrices', `${matrixToString(m1)} + ${matrixToString(m2)}`, matrixToString(res), 'matrix');
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
      logOperation('Multiplicación de matrices', `${matrixToString(m1)} × ${matrixToString(m2)}`, matrixToString(res), 'matrix');
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
      logOperation('Transpuesta', matrixToString(m), matrixToString(res), 'matrix');
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
        logOperation('Determinante', matrixToString(m), formatNumber(det), 'matrix');
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
        logOperation('Solución Gauss', `A=${matrixToString(A)}, b=${vectorToString(b)}`, vectorToString(x), 'matrix');
      } catch (error) {
        alert('Error: ' + error.message);
      }
    });

  } catch (error) {
    console.error('Error inicializando operaciones de matrices:', error);
  }
}
