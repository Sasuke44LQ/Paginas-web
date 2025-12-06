/**
 * matrixOperations.js - Operaciones con matrices
 * 
 * Contiene todas las operaciones matemáticas relacionadas con matrices:
 * - Suma, multiplicación
 * - Transposición
 * - Determinante, Inversa
 * - Descomposición LU
 * - Resolución de sistemas: Gauss, Jacobi
 * 
 * También incluye generadores de pasos detallados para cada operación.
 */

import { formatNumber, matrixToString, vectorToString } from './utils.js';
import Config from './config.js';

// ============================================================================
// OPERACIONES BÁSICAS CON MATRICES
// ============================================================================

/**
 * Suma dos matrices componente a componente
 */
export function addMatrices(A, B) {
  const aRows = A.length;
  const aCol = (A[0] || []).length;
  const bRows = B.length;
  const bCol = (B[0] || []).length;
  
  if (aRows !== bRows || aCol !== bCol) {
    throw Config.MESSAGES.DIMENSION_MISMATCH;
  }
  
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

/**
 * Multiplica dos matrices
 */
export function multiplyMatrices(A, B) {
  const n = A.length;           // filas de A
  const m = B[0].length;        // columnas de B
  const p = A[0].length;        // columnas de A
  
  if (p !== B.length) {
    throw Config.MESSAGES.INCOMPATIBLE_DIMENSIONS;
  }
  
  const C = Array.from({ length: n }, () => Array(m).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < p; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  
  return C;
}

/**
 * Transpone una matriz (intercambia filas y columnas)
 */
export function transpose(A) {
  if (!A[0]) return [];
  return A[0].map((_, j) => A.map(row => row[j]));
}

// ============================================================================
// OPERACIONES AVANZADAS
// ============================================================================

/**
 * Calcula el determinante de una matriz usando eliminación Gaussiana
 */
export function determinant(Ain) {
  const A = Ain.map(row => row.slice());
  const n = A.length;
  
  if (n === 0) return 0;
  
  let det = 1;
  
  for (let i = 0; i < n; i++) {
    // Buscar pivote
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[pivot][i])) {
        pivot = k;
      }
    }
    
    // Si pivote es cero, determinante es cero
    if (Math.abs(A[pivot][i]) < Config.ALGORITHMS.GAUSS_TOLERANCE) {
      return 0;
    }
    
    // Intercambiar filas cambia el signo del determinante
    if (pivot !== i) {
      [A[i], A[pivot]] = [A[pivot], A[i]];
      det *= -1;
    }
    
    // Acumular el producto de la diagonal
    det *= A[i][i];
    
    // Eliminación hacia adelante
    for (let k = i + 1; k < n; k++) {
      const c = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= c * A[i][j];
      }
    }
  }
  
  return det;
}

/**
 * Calcula la matriz inversa usando eliminación de Gauss-Jordan
 */
export function inverseMatrix(Ain) {
  const n = Ain.length;
  const A = Ain.map(row => row.slice());
  
  // Crear matriz identidad
  const I = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
  
  for (let i = 0; i < n; i++) {
    // Buscar pivote
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[pivot][i])) {
        pivot = k;
      }
    }
    
    if (Math.abs(A[pivot][i]) < Config.ALGORITHMS.GAUSS_TOLERANCE) {
      throw Config.MESSAGES.SINGULAR_NO_INVERSE;
    }
    
    // Intercambiar filas en A e I
    if (pivot !== i) {
      [A[i], A[pivot]] = [A[pivot], A[i]];
      [I[i], I[pivot]] = [I[pivot], I[i]];
    }
    
    // Normalizar fila i
    const div = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= div;
      I[i][j] /= div;
    }
    
    // Eliminar columna i en otras filas
    for (let row = 0; row < n; row++) {
      if (row !== i) {
        const mult = A[row][i];
        for (let col = 0; col < n; col++) {
          A[row][col] -= mult * A[i][col];
          I[row][col] -= mult * I[i][col];
        }
      }
    }
  }
  
  return I;
}

/**
 * Descomposición LU usando método Doolittle
 */
export function luDecomposition(Ain) {
  const n = Ain.length;
  const A = Ain.map(row => row.slice());
  
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const U = Array.from({ length: n }, () => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    // Calcular U
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * U[j][k];
      }
      U[i][k] = A[i][k] - sum;
    }
    
    // Calcular L
    L[i][i] = 1;
    for (let k = i + 1; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[k][j] * U[j][i];
      }
      
      if (Math.abs(U[i][i]) < Config.ALGORITHMS.GAUSS_TOLERANCE) {
        throw Config.MESSAGES.LU_ZERO_PIVOT;
      }
      
      L[k][i] = (A[k][i] - sum) / U[i][i];
    }
  }
  
  return { L, U };
}

// ============================================================================
// RESOLUCIÓN DE SISTEMAS LINEALES
// ============================================================================

/**
 * Resuelve un sistema Ax=b usando eliminación Gaussiana
 * Retorna {x, steps} donde steps contiene el procedimiento detallado
 */
export function gaussSolveWithSteps(Ain, bin) {
  const steps = [];
  const n = Ain.length;
  const A = Ain.map(row => row.slice());
  const b = bin.slice();
  
  steps.push(`Sistema inicial: A = ${matrixToString(A)} , b = ${vectorToString(b)}`);
  
  // Eliminación hacia adelante con pivote parcial
  for (let i = 0; i < n; i++) {
    // Buscar pivote máximo
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    
    // Intercambiar filas si es necesario
    if (maxRow !== i) {
      steps.push(`Intercambiar fila ${i + 1} con fila ${maxRow + 1}`);
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [b[i], b[maxRow]] = [b[maxRow], b[i]];
      steps.push(`A = ${matrixToString(A)} , b = ${vectorToString(b)}`);
    }
    
    // Verificar pivote no cero
    if (Math.abs(A[i][i]) < Config.ALGORITHMS.GAUSS_TOLERANCE) {
      throw Config.MESSAGES.SINGULAR_MATRIX;
    }
    
    // Eliminar elementos debajo del pivote
    for (let k = i + 1; k < n; k++) {
      const c = A[k][i] / A[i][i];
      steps.push(`Eliminar fila ${k + 1} usando fila ${i + 1} (factor ${formatNumber(c)})`);
      
      for (let j = i; j < n; j++) {
        A[k][j] -= c * A[i][j];
      }
      b[k] -= c * b[i];
      
      steps.push(`Paso intermedio A = ${matrixToString(A)} , b = ${vectorToString(b)}`);
    }
  }
  
  steps.push(`Triangular superior alcanzada: A = ${matrixToString(A)} , b = ${vectorToString(b)}`);
  
  // Sustitución regresiva
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i + 1; j < n; j++) {
      sum -= A[i][j] * x[j];
    }
    x[i] = sum / A[i][i];
    steps.push(`Sustitución regresiva: x[${i + 1}] = ${formatNumber(x[i])}`);
  }
  
  steps.push(`Solución x = ${vectorToString(x)}`);
  
  return { x, steps };
}

/**
 * Resuelve un sistema Ax=b usando eliminación Gaussiana (sin pasos)
 */
export function gaussSolve(Ain, bin) {
  const n = Ain.length;
  const A = Ain.map(row => row.slice());
  const b = bin.slice();
  
  for (let i = 0; i < n; i++) {
    // Pivote parcial
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    
    if (Math.abs(A[maxRow][i]) < Config.ALGORITHMS.GAUSS_TOLERANCE) {
      throw Config.MESSAGES.SINGULAR_MATRIX;
    }
    
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];
    
    // Eliminación
    for (let k = i + 1; k < n; k++) {
      const c = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= c * A[i][j];
      }
      b[k] -= c * b[i];
    }
  }
  
  // Sustitución regresiva
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i + 1; j < n; j++) {
      sum -= A[i][j] * x[j];
    }
    x[i] = sum / A[i][i];
  }
  
  return x;
}

/**
 * Resuelve un sistema Ax=b usando método iterativo de Jacobi
 */
export function jacobi(A, b, options = {}) {
  const tol = options.tol || Config.ALGORITHMS.JACOBI_TOLERANCE;
  const maxIter = options.maxIter || Config.ALGORITHMS.JACOBI_MAX_ITERATIONS;
  
  const n = A.length;
  let x = Array(n).fill(0);
  
  for (let iter = 0; iter < maxIter; iter++) {
    const xnew = Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      
      if (Math.abs(A[i][i]) < Config.ALGORITHMS.GAUSS_TOLERANCE) {
        throw 'Pivote nulo en Jacobi';
      }
      
      xnew[i] = (b[i] - sum) / A[i][i];
    }
    
    // Calcular error
    const error = Math.max(...x.map((v, i) => Math.abs(v - xnew[i])));
    x = xnew;
    
    if (error < tol) {
      return { x, iterations: iter + 1, tolReached: true };
    }
  }
  
  return { x, iterations: maxIter, tolReached: false };
}

// ============================================================================
// GENERADORES DE PASOS DETALLADOS
// ============================================================================

/**
 * Genera pasos para suma de matrices
 */
export function stepsMatrixSum(A, B) {
  const steps = [];
  steps.push(`Matriz A = ${matrixToString(A)}`);
  steps.push(`Matriz B = ${matrixToString(B)}`);
  
  const C = A.map((row, i) => row.map((val, j) => val + B[i][j]));
  
  for (let i = 0; i < C.length; i++) {
    for (let j = 0; j < (C[i] || []).length; j++) {
      steps.push(`c[${i + 1},${j + 1}] = ${formatNumber(A[i][j])} + ${formatNumber(B[i][j])} = ${formatNumber(C[i][j])}`);
    }
  }
  
  steps.push(`Resultado = ${matrixToString(C)}`);
  return steps;
}

/**
 * Genera pasos para multiplicación de matrices
 */
export function stepsMatrixMultiply(A, B) {
  const steps = [];
  steps.push(`Matriz A = ${matrixToString(A)}`);
  steps.push(`Matriz B = ${matrixToString(B)}`);
  
  const n = A.length;
  const m = B[0].length;
  const p = A[0].length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const products = [];
      let sum = 0;
      
      for (let k = 0; k < p; k++) {
        const pr = A[i][k] * B[k][j];
        products.push(`${formatNumber(A[i][k])}*${formatNumber(B[k][j])}=${formatNumber(pr)}`);
        sum += pr;
      }
      
      steps.push(`c[${i + 1},${j + 1}] = ${products.join(' + ')} = ${formatNumber(sum)}`);
    }
  }
  
  const C = multiplyMatrices(A, B);
  steps.push(`Resultado = ${matrixToString(C)}`);
  
  return steps;
}

/**
 * Genera pasos para transposición
 */
export function stepsTranspose(A) {
  const steps = [];
  steps.push(`Matriz A = ${matrixToString(A)}`);
  
  const T = transpose(A);
  
  for (let i = 0; i < T.length; i++) {
    for (let j = 0; j < (T[i] || []).length; j++) {
      steps.push(`t[${i + 1},${j + 1}] = a[${j + 1},${i + 1}] = ${formatNumber(T[i][j])}`);
    }
  }
  
  steps.push(`Resultado = ${matrixToString(T)}`);
  return steps;
}

export default {
  addMatrices,
  multiplyMatrices,
  transpose,
  determinant,
  inverseMatrix,
  luDecomposition,
  gaussSolveWithSteps,
  gaussSolve,
  jacobi,
  stepsMatrixSum,
  stepsMatrixMultiply,
  stepsTranspose
};
