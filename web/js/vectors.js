/**
 * js/vectors.js - Operaciones con vectores
 * 
 * Funciones matemáticas para trabajar con vectores:
 * - Suma
 * - Resta
 * - Multiplicación escalar
 * - Producto punto
 * - Norma
 */

function addVectors(v1, v2) {
  return v1.map((val, i) => val + v2[i]);
}

function subtractVectors(v1, v2) {
  return v1.map((val, i) => val - v2[i]);
}

function scalarMultiply(vector, scalar) {
  return vector.map(val => val * scalar);
}

function dotProduct(v1, v2) {
  return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
}

function norm(vector) {
  const sum = vector.reduce((acc, val) => acc + val * val, 0);
  return Math.sqrt(sum);
}

// ============ INICIALIZACIÓN DE UI PARA VECTORES ============

function initVectorOperations() {
  try {
    // Suma (usa inputs #vecA y #vecB, salida en #out-vectores)
    $('#btn-sumar')?.addEventListener('click', () => {
      const result = validateVectors($('#vecA').value, $('#vecB').value);
      if (result) {
        const res = addVectors(result.v1, result.v2);
        renderVector($('#out-vectores'), res);
        logOperation('Suma de vectores', `${vectorToString(result.v1)} + ${vectorToString(result.v2)}`, vectorToString(res));
      }
    });

    // Resta
    $('#btn-restar')?.addEventListener('click', () => {
      const result = validateVectors($('#vecA').value, $('#vecB').value);
      if (result) {
        const res = subtractVectors(result.v1, result.v2);
        renderVector($('#out-vectores'), res);
        logOperation('Resta de vectores', `${vectorToString(result.v1)} - ${vectorToString(result.v2)}`, vectorToString(res));
      }
    });

    // Producto punto
    $('#btn-punto')?.addEventListener('click', () => {
      const result = validateVectors($('#vecA').value, $('#vecB').value);
      if (result) {
        const res = dotProduct(result.v1, result.v2);
        $('#out-vectores').innerHTML = '<p>' + formatNumber(res) + '</p>';
        logOperation('Producto punto', `${vectorToString(result.v1)} · ${vectorToString(result.v2)}`, formatNumber(res));
      }
    });

    // Multiplicación escalar (usa #vecA y #escalar)
    $('#btn-escalar')?.addEventListener('click', () => {
      const v = parseVector($('#vecA').value);
      const scalar = parseFloat($('#escalar').value);
      if (!v || isNaN(scalar)) {
        alert('Ingresa un vector y un escalar válidos');
        return;
      }
      const res = scalarMultiply(v, scalar);
      renderVector($('#out-vectores'), res);
      logOperation('Multiplicación escalar', `${formatNumber(scalar)} * ${vectorToString(v)}`, vectorToString(res));
    });

    // Norma de A
    $('#btn-norma')?.addEventListener('click', () => {
      const v = parseVector($('#vecA').value);
      if (!v) {
        alert('Ingresa un vector válido');
        return;
      }
      const res = norm(v);
      $('#out-vectores').innerHTML = '<p>' + formatNumber(res) + '</p>';
      logOperation('Norma de vector', vectorToString(v), formatNumber(res));
    });

  } catch (error) {
    console.error('Error inicializando operaciones de vectores:', error);
  }
}
