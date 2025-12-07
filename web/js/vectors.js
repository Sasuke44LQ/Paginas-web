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
        // construir pasos detallados y concisos
        const steps = [];
        // paso 1: mostrar vectores de entrada
        steps.push({
          detailed: `<p><strong>Paso 1 — Entradas</strong></p><p>Vector A = ${vectorToString(result.v1)}<br>Vector B = ${vectorToString(result.v2)}</p><p class="explanation">Explicación: La suma de vectores combina las componentes correspondientes. Es decir, sumamos las primeras componentes entre sí, las segundas entre sí, y así sucesivamente. Esto mantiene la dimensión del vector.</p>` ,
          concise: `A = ${vectorToString(result.v1)}, B = ${vectorToString(result.v2)}`,
          html: `<p><strong>Vector A:</strong> ${vectorToString(result.v1)}</p><p><strong>Vector B:</strong> ${vectorToString(result.v2)}</p>`
        });

        // paso 2: sumar componente a componente con explicación
        const elementSteps = result.v1.map((v,i) => {
          return {
            detailed: `<p>Calcular componente ${i+1}: ${formatNumber(v)} + ${formatNumber(result.v2[i])} = <strong>${formatNumber(res[i])}</strong></p><p class="explanation">Por qué: sumamos las componentes individuales porque un vector es una colección ordenada de valores; la operación respeta la posición de cada componente.</p>` ,
            concise: `${formatNumber(v)}+${formatNumber(result.v2[i])}=${formatNumber(res[i])}` ,
            html: `<div class="step-calc">${formatNumber(v)} + ${formatNumber(result.v2[i])} = <strong>${formatNumber(res[i])}</strong></div>`
          };
        });

        elementSteps.forEach(es => steps.push(es));

        // paso final: resultado
        steps.push({
          detailed: `<p><strong>Resultado final</strong></p><p>Vector resultado = ${vectorToString(res)}</p><p class="explanation">Interpretación: El vector resultante contiene las sumas de cada par de componentes. Visualmente, si los vectores representan desplazamientos, el resultado es el desplazamiento combinado.</p>`,
          concise: `Resultado = ${vectorToString(res)}` ,
          html: `<p><strong>Resultado:</strong> ${vectorToString(res)}</p>`
        });

        setSteps('vectores', steps);
        logOperation('Suma de vectores', `${vectorToString(result.v1)} + ${vectorToString(result.v2)}`, vectorToString(res), 'vector', steps);
      }
    });

    // Resta
    $('#btn-restar')?.addEventListener('click', () => {
      const result = validateVectors($('#vecA').value, $('#vecB').value);
      if (result) {
        const res = subtractVectors(result.v1, result.v2);
        renderVector($('#out-vectores'), res);
        const steps = [];
        steps.push({
          detailed: `<p><strong>Paso 1 — Entradas</strong></p><p>Vector A = ${vectorToString(result.v1)}<br>Vector B = ${vectorToString(result.v2)}</p><p class="explanation">Explicación: La resta se hace componente a componente; es equivalente a sumar el vector A con el negativo de B.</p>`,
          concise: `A = ${vectorToString(result.v1)}, B = ${vectorToString(result.v2)}`,
          html: `<p><strong>Vector A:</strong> ${vectorToString(result.v1)}</p><p><strong>Vector B:</strong> ${vectorToString(result.v2)}</p>`
        });

        const elementSteps = result.v1.map((v,i) => ({
          detailed: `<p>Calcular componente ${i+1}: ${formatNumber(v)} - ${formatNumber(result.v2[i])} = <strong>${formatNumber(res[i])}</strong></p><p class="explanation">Por qué: restar componentes corresponde a desplazar en sentido opuesto las componentes de B respecto a A.</p>`,
          concise: `${formatNumber(v)}-${formatNumber(result.v2[i])}=${formatNumber(res[i])}`,
          html: `<div class="step-calc">${formatNumber(v)} - ${formatNumber(result.v2[i])} = <strong>${formatNumber(res[i])}</strong></div>`
        }));

        elementSteps.forEach(es => steps.push(es));

        steps.push({
          detailed: `<p><strong>Resultado final</strong></p><p>Vector resultado = ${vectorToString(res)}</p><p class="explanation">Interpretación: la resta representa la diferencia componente a componente; útil para calcular desplazamientos relativos.</p>`,
          concise: `Resultado = ${vectorToString(res)}`,
          html: `<p><strong>Resultado:</strong> ${vectorToString(res)}</p>`
        });

        setSteps('vectores', steps);
        logOperation('Resta de vectores', `${vectorToString(result.v1)} - ${vectorToString(result.v2)}`, vectorToString(res), 'vector', steps);
      }
    });

    // Producto punto
    $('#btn-punto')?.addEventListener('click', () => {
      const result = validateVectors($('#vecA').value, $('#vecB').value);
      if (result) {
        const products = result.v1.map((v,i) => v * result.v2[i]);
        const res = dotProduct(result.v1, result.v2);
        $('#out-vectores').innerHTML = '<p>' + formatNumber(res) + '</p>';
        const steps = [];
        steps.push({
          detailed: `<p><strong>Paso 1 — Multiplicaciones por componente</strong></p><p>${result.v1.map((v,i) => `${formatNumber(v)} × ${formatNumber(result.v2[i])} = ${formatNumber(products[i])}`).join('<br>')}</p><p class="explanation">Explicación: el producto punto suma los productos de las componentes correspondientes; es la proyección escalar de un vector sobre otro cuando se normaliza.</p>`,
          concise: `Productos: ${products.map(formatNumber).join(', ')}`,
          html: `<p>${result.v1.map((v,i) => `<div class="step-calc">${formatNumber(v)} × ${formatNumber(result.v2[i])} = <strong>${formatNumber(products[i])}</strong></div>`).join('')}</p>`
        });

        steps.push({
          detailed: `<p><strong>Paso 2 — Sumar los productos</strong></p><p>${products.map(formatNumber).join(' + ')} = <strong>${formatNumber(res)}</strong></p><p class="explanation">Interpretación: el resultado es un escalar; si ambos vectores son unitarios, el producto punto es el coseno del ángulo entre ellos.</p>`,
          concise: `Suma = ${formatNumber(res)}`,
          html: `<p><strong>Resultado:</strong> ${formatNumber(res)}</p>`
        });

        setSteps('vectores', steps);
        logOperation('Producto punto', `${vectorToString(result.v1)} · ${vectorToString(result.v2)}`, formatNumber(res), 'vector', steps);
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
      const steps = [];
      steps.push({
        detailed: `<p><strong>Paso 1 — Entrada</strong></p><p>Vector = ${vectorToString(v)}<br>Escalar = ${formatNumber(scalar)}</p><p class="explanation">Explicación: multiplicar un vector por un escalar cambia la magnitud de sus componentes; si el escalar es negativo, además invierte la dirección.</p>`,
        concise: `Escalar ${formatNumber(scalar)} · ${vectorToString(v)}`,
        html: `<p><strong>Vector:</strong> ${vectorToString(v)}</p><p><strong>Escalar:</strong> ${formatNumber(scalar)}</p>`
      });

      v.forEach((val, i) => steps.push({
        detailed: `<p>Componente ${i+1}: ${formatNumber(val)} × ${formatNumber(scalar)} = <strong>${formatNumber(res[i])}</strong></p><p class="explanation">Nota: cada componente se escala independientemente.</p>`,
        concise: `${formatNumber(val)}×${formatNumber(scalar)}=${formatNumber(res[i])}`,
        html: `<div class="step-calc">${formatNumber(val)} × ${formatNumber(scalar)} = <strong>${formatNumber(res[i])}</div>`
      }));

      steps.push({
        detailed: `<p><strong>Resultado final</strong></p><p>${vectorToString(res)}</p><p class="explanation">Interpretación final: el vector resultante es el original estirado/encogido según el escalar. En geometría, todos los puntos se alejan o acercan al origen proporcionalmente.</p>`,
        concise: `Resultado = ${vectorToString(res)}`,
        html: `<p><strong>Resultado:</strong> ${vectorToString(res)}</p>`
      });

      setSteps('vectores', steps);
      logOperation('Multiplicación escalar', `${formatNumber(scalar)} * ${vectorToString(v)}`, vectorToString(res), 'vector', steps);
    });

    // Norma de A
    $('#btn-norma')?.addEventListener('click', () => {
      const v = parseVector($('#vecA').value);
      if (!v) {
        alert('Ingresa un vector válido');
        return;
      }
      const squares = v.map(val => val * val);
      const sum = squares.reduce((a,b) => a+b, 0);
      const res = norm(v);
      $('#out-vectores').innerHTML = '<p>' + formatNumber(res) + '</p>';
      const steps = [];
      steps.push({
        detailed: `<p><strong>Paso 1 — Cuadrar cada componente</strong></p><p>${v.map((val,i) => `${formatNumber(val)}² = ${formatNumber(squares[i])}`).join('<br>')}</p><p class="explanation">Explicación: elevar al cuadrado elimina signos y concentra la magnitud; es el primer paso para calcular la distancia euclidiana.</p>`,
        concise: `Cuadrados: ${squares.map(formatNumber).join(', ')}`,
        html: `<p>${v.map((val,i) => `<div class="step-calc">${formatNumber(val)}² = ${formatNumber(squares[i])}</div>`).join('')}</p>`
      });

      steps.push({
        detailed: `<p><strong>Paso 2 — Sumar los cuadrados</strong></p><p>${squares.map(formatNumber).join(' + ')} = <strong>${formatNumber(sum)}</strong></p><p class="explanation">Por qué: sumar cuadrados da una medida acumulada de energía/magnitud; la raíz devuelve la unidad original.</p>`,
        concise: `Suma = ${formatNumber(sum)}`,
        html: `<p><strong>Suma de cuadrados:</strong> ${formatNumber(sum)}</p>`
      });

      steps.push({
        detailed: `<p><strong>Paso 3 — Raíz cuadrada</strong></p><p>sqrt(${formatNumber(sum)}) = <strong>${formatNumber(res)}</strong></p><p class="explanation">Interpretación: la norma euclidiana representa la distancia del vector al origen en el espacio; es la longitud del vector.</p>`,
        concise: `Norma = ${formatNumber(res)}`,
        html: `<p><strong>Norma:</strong> ${formatNumber(res)}</p>`
      });

      setSteps('vectores', steps);
      logOperation('Norma de vector', vectorToString(v), formatNumber(res), 'vector', steps);
    });

  } catch (error) {
    console.error('Error inicializando operaciones de vectores:', error);
  }
}
