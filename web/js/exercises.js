/**
 * exercises.js - Sistema de generación y evaluación de ejercicios
 * 
 * Maneja:
 * - Generación de ejercicios aleatorios
 * - Verificación de respuestas
 * - Calificación y feedback
 */

import {
  $,
  clearNode,
  formatNumber,
  getDecimals,
  parseVector,
  parseMatrix,
  vectorToString,
  matrixToString
} from './utils.js';
import {
  addVectors,
  multiplyMatrices
} from './matrixOperations.js';
import { gaussSolve } from './matrixOperations.js';
import Config from './config.js';

let currentExercise = null;

/**
 * Genera un ejercicio aleatorio del tipo especificado
 */
export function generateExercise(type) {
  const area = $('exercise-area');
  clearNode(area);
  $('exercise-feedback').textContent = '';
  
  try {
    if (type === Config.EXERCISE_TYPES.VECTOR_SUM) {
      generateVectorSumExercise();
    } else if (type === Config.EXERCISE_TYPES.MATRIX_MUL) {
      generateMatrixMultiplicationExercise();
    } else if (type === Config.EXERCISE_TYPES.GAUSS) {
      generateGaussExercise();
    }
  } catch (e) {
    area.textContent = `Error generando ejercicio: ${e}`;
    currentExercise = null;
  }
}

/**
 * Genera un ejercicio de suma de vectores
 */
function generateVectorSumExercise() {
  const area = $('exercise-area');
  const n = 2 + Math.floor(Math.random() * 3);
  
  const A = Array.from({ length: n }, () => Math.round((Math.random() * 10 - 5)) * 1);
  const B = Array.from({ length: n }, () => Math.round((Math.random() * 10 - 5)) * 1);
  
  currentExercise = {
    type: Config.EXERCISE_TYPES.VECTOR_SUM,
    A,
    B,
    expected: A.map((v, i) => v + B[i])
  };
  
  area.innerHTML = `
    <div>Vector A: ${vectorToString(A)}</div>
    <div>Vector B: ${vectorToString(B)}</div>
    <label>Tu respuesta (formato: a,b,c):</label>
    <input id="exercise-answer" style="width:100%" placeholder="Ejemplo: 1,2,3" />
  `;
}

/**
 * Genera un ejercicio de multiplicación de matrices
 */
function generateMatrixMultiplicationExercise() {
  const area = $('exercise-area');
  const n = 2 + Math.floor(Math.random() * 2);
  
  const A = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 5))
  );
  const B = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 5))
  );
  
  currentExercise = {
    type: Config.EXERCISE_TYPES.MATRIX_MUL,
    A,
    B,
    expected: multiplyMatrices(A, B)
  };
  
  area.innerHTML = `
    <div>Matriz A:<pre>${matrixToString(A)}</pre></div>
    <div>Matriz B:<pre>${matrixToString(B)}</pre></div>
    <label>Tu respuesta (filas separadas por ;):</label>
    <input id="exercise-answer" style="width:100%" placeholder="Ejemplo: 1,2;3,4" />
  `;
}

/**
 * Genera un ejercicio de resolución de sistemas (Gauss)
 */
function generateGaussExercise() {
  const area = $('exercise-area');
  const n = 2 + Math.floor(Math.random() * 2);
  
  const A = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 6))
  );
  const b = Array.from({ length: n }, () => Math.floor(Math.random() * 6));
  
  // Verificar que el sistema sea estable
  const x = gaussSolve(A, b);
  
  currentExercise = {
    type: Config.EXERCISE_TYPES.GAUSS,
    A,
    b,
    expected: x
  };
  
  area.innerHTML = `
    <div>Sistema A x = b</div>
    <div>A:<pre>${matrixToString(A)}</pre></div>
    <div>b: ${vectorToString(b)}</div>
    <label>Tu respuesta (a1,a2,..):</label>
    <input id="exercise-answer" style="width:100%" placeholder="Ejemplo: 1,2,3" />
  `;
}

/**
 * Verifica la respuesta del usuario
 */
export function checkExercise() {
  if (!currentExercise) {
    alert(Config.MESSAGES.GENERATE_EXERCISE);
    return;
  }
  
  const answerInput = $('exercise-answer');
  const answerStr = answerInput ? answerInput.value.trim() : '';
  
  if (!answerStr) {
    $('exercise-feedback').textContent = Config.MESSAGES.ENTER_ANSWER;
    return;
  }
  
  try {
    const isCorrect = compareAnswers(currentExercise, answerStr);
    const feedbackEl = $('exercise-feedback');
    
    if (isCorrect) {
      feedbackEl.textContent = Config.MESSAGES.CORRECT;
      feedbackEl.className = 'msg-success';
    } else {
      feedbackEl.textContent = Config.MESSAGES.INCORRECT;
      feedbackEl.className = 'msg-error';
    }
  } catch (e) {
    $('exercise-feedback').textContent = `Error comprobando respuesta: ${e}`;
    $('exercise-feedback').className = 'msg-error';
  }
}

/**
 * Compara la respuesta del usuario con la respuesta esperada
 */
function compareAnswers(exercise, answerStr) {
  const tolerance = Math.pow(10, -getDecimals());
  
  if (exercise.type === Config.EXERCISE_TYPES.VECTOR_SUM) {
    const userAnswer = parseVector(answerStr);
    const expected = exercise.expected.map(x => Number(formatNumber(x)));
    const userFormatted = userAnswer.map(x => Number(formatNumber(x)));
    
    return (
      userFormatted.length === expected.length &&
      userFormatted.every((v, i) => Math.abs(v - expected[i]) < tolerance)
    );
  } else if (exercise.type === Config.EXERCISE_TYPES.GAUSS) {
    const userAnswer = parseVector(answerStr);
    const expected = exercise.expected.map(x => Number(formatNumber(x)));
    const userFormatted = userAnswer.map(x => Number(formatNumber(x)));
    
    return (
      userFormatted.length === expected.length &&
      userFormatted.every((v, i) => Math.abs(v - expected[i]) < tolerance)
    );
  } else if (exercise.type === Config.EXERCISE_TYPES.MATRIX_MUL) {
    const userAnswer = parseMatrix(answerStr);
    const expected = exercise.expected;
    
    if (userAnswer.length !== expected.length) return false;
    
    return userAnswer.every((row, i) =>
      row.length === expected[i].length &&
      row.every((v, j) => {
        const userVal = Number(formatNumber(v));
        const expVal = Number(formatNumber(expected[i][j]));
        return Math.abs(userVal - expVal) < tolerance;
      })
    );
  }
  
  return false;
}

/**
 * Obtiene el ejercicio actual
 */
export function getCurrentExercise() {
  return currentExercise;
}

/**
 * Limpia el ejercicio actual
 */
export function clearCurrentExercise() {
  currentExercise = null;
}

export default {
  generateExercise,
  checkExercise,
  getCurrentExercise,
  clearCurrentExercise
};
