/**
 * vectorOperations.js - Operaciones con vectores
 * 
 * Contiene todas las operaciones matemáticas relacionadas con vectores:
 * - Suma, resta
 * - Producto punto
 * - Multiplicación por escalar
 * - Norma
 * 
 * También incluye generadores de pasos detallados para cada operación.
 */

import { formatNumber, vectorToString } from './utils.js';
import Config from './config.js';

// ============================================================================
// OPERACIONES BÁSICAS CON VECTORES
// ============================================================================

/**
 * Suma dos vectores componente a componente
 */
export function addVectors(a, b) {
  if (a.length !== b.length) throw Config.MESSAGES.DIMENSION_MISMATCH;
  return a.map((v, i) => v + b[i]);
}

/**
 * Resta dos vectores componente a componente
 */
export function subtractVectors(a, b) {
  if (a.length !== b.length) throw Config.MESSAGES.DIMENSION_MISMATCH;
  return a.map((v, i) => v - b[i]);
}

/**
 * Multiplica un vector por un escalar
 */
export function scalarMultiply(a, k) {
  return a.map(v => v * k);
}

/**
 * Calcula el producto punto entre dos vectores
 */
export function dotProduct(a, b) {
  if (a.length !== b.length) throw Config.MESSAGES.DIMENSION_MISMATCH;
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

/**
 * Calcula la norma (magnitud) de un vector
 */
export function norm(a) {
  return Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
}

// ============================================================================
// GENERADORES DE PASOS DETALLADOS
// ============================================================================

/**
 * Genera pasos detallados para la suma de vectores
 */
export function stepsVectorSum(A, B) {
  const steps = [];
  steps.push(`Vector A = ${vectorToString(A)}`);
  steps.push(`Vector B = ${vectorToString(B)}`);
  
  const result = [];
  for (let i = 0; i < A.length; i++) {
    const a = A[i];
    const b = B[i];
    const r = a + b;
    result.push(r);
    steps.push(`Paso ${i + 1}: ${formatNumber(a)} + ${formatNumber(b)} = ${formatNumber(r)}`);
  }
  
  steps.push(`Resultado = ${vectorToString(result)}`);
  return steps;
}

/**
 * Genera pasos detallados para la resta de vectores
 */
export function stepsVectorSubtract(A, B) {
  const steps = [];
  steps.push(`Vector A = ${vectorToString(A)}`);
  steps.push(`Vector B = ${vectorToString(B)}`);
  
  const result = [];
  for (let i = 0; i < A.length; i++) {
    const a = A[i];
    const b = B[i];
    const r = a - b;
    result.push(r);
    steps.push(`Paso ${i + 1}: ${formatNumber(a)} - ${formatNumber(b)} = ${formatNumber(r)}`);
  }
  
  steps.push(`Resultado = ${vectorToString(result)}`);
  return steps;
}

/**
 * Genera pasos detallados para la multiplicación por escalar
 */
export function stepsScalarMultiply(A, k) {
  const steps = [];
  steps.push(`Vector A = ${vectorToString(A)}`);
  steps.push(`Escalar k = ${formatNumber(k)}`);
  
  const result = [];
  for (let i = 0; i < A.length; i++) {
    const r = A[i] * k;
    result.push(r);
    steps.push(`Paso ${i + 1}: ${formatNumber(A[i])} * ${formatNumber(k)} = ${formatNumber(r)}`);
  }
  
  steps.push(`Resultado = ${vectorToString(result)}`);
  return steps;
}

/**
 * Genera pasos detallados para el producto punto
 */
export function stepsDotProduct(A, B) {
  const steps = [];
  steps.push(`Vector A = ${vectorToString(A)}`);
  steps.push(`Vector B = ${vectorToString(B)}`);
  
  const products = [];
  let sum = 0;
  for (let i = 0; i < A.length; i++) {
    const p = A[i] * B[i];
    products.push(`${formatNumber(A[i])}*${formatNumber(B[i])}=${formatNumber(p)}`);
    sum += p;
  }
  
  steps.push(`Multiplicaciones: ${products.join(' , ')}`);
  steps.push(`Suma de productos = ${formatNumber(sum)}`);
  
  return steps;
}

/**
 * Genera pasos detallados para la norma de un vector
 */
export function stepsNorm(A) {
  const steps = [];
  steps.push(`Vector A = ${vectorToString(A)}`);
  
  const squares = [];
  let sum = 0;
  for (let i = 0; i < A.length; i++) {
    const p = A[i] * A[i];
    squares.push(`${formatNumber(A[i])}^2=${formatNumber(p)}`);
    sum += p;
  }
  
  steps.push(`Cuadrados: ${squares.join(' , ')}`);
  steps.push(`Suma = ${formatNumber(sum)}`);
  steps.push(`Norma = sqrt(${formatNumber(sum)}) = ${formatNumber(Math.sqrt(sum))}`);
  
  return steps;
}

export default {
  addVectors,
  subtractVectors,
  scalarMultiply,
  dotProduct,
  norm,
  stepsVectorSum,
  stepsVectorSubtract,
  stepsScalarMultiply,
  stepsDotProduct,
  stepsNorm
};
