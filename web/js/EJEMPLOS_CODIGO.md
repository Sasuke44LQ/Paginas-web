
Nota: este archivo fue movido a `../docs/EJEMPLOS_CODIGO.md`.

Consulta `web/docs/EJEMPLOS_CODIGO.md` para los ejemplos completos y patrones recomendados.

function esMatrizCuadrada(matriz) {
  return matriz.length === matriz[0].length;
}

function esSimetrica(matriz) {
  if (!esMatrizCuadrada(matriz)) return false;
  const transpuesta = transpose(matriz);
  // Comparar elemento por elemento
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[0].length; j++) {
      if (Math.abs(matriz[i][j] - transpuesta[i][j]) > APP_CONFIG.GAUSS_TOLERANCE) {
        return false;
      }
    }
  }
  return true;
}
```

Luego úsalas en matrices.js:

```javascript
// En js/matrices.js

if (!esMatrizCuadrada(m)) {
  alert('Debe ser matriz cuadrada');
  return;
}

if (esSimetrica(m)) {
  console.log('¡La matriz es simétrica!');
}
```

---

## Ejemplo 7: Estructura Recomendada para Módulo Nuevo

Si necesitas un nuevo módulo (ej: `operaciones-avanzadas.js`):

```javascript
/**
 * js/operaciones-avanzadas.js - Operaciones matemáticas avanzadas
 * 
 * Funciones complejas:
 * - Descomposición QR
 * - Valores propios
 * - Normas especiales
 */

// ============ DESCOMPOSICIÓN QR ============

function qrDecomposition(matriz) {
  // Implementación QR
  return { Q, R };
}

// ============ VALORES PROPIOS ============

function eigenvalues(matriz) {
  // Implementación eigenvalues
  return valores;
}

// ============ NORMAS ESPECIALES ============

function normaFrobenius(matriz) {
  let suma = 0;
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[0].length; j++) {
      suma += matriz[i][j] ** 2;
    }
  }
  return Math.sqrt(suma);
}

// ============ INICIALIZACIÓN UI ============

function initAdvancedOperations() {
  try {
    // Tus botones aquí
  } catch (error) {
    console.error('Error en operaciones avanzadas:', error);
  }
}
```

Luego actualizar `js/ui.js`:

```javascript
// Agregar en init()
initAdvancedOperations();

// Agregar script en index.html ANTES de ui.js
<script src="js/operaciones-avanzadas.js"></script>
```

---

## Ejemplo 8: Testing en Consola

### Antes de confirmar cambios, prueba en consola del navegador:

```javascript
// Test parseVector
parseVector("1, 2, 3")
// Esperado: [1, 2, 3]

// Test función nueva
promedio([1, 2, 3])
// Esperado: 2

// Test con matriz
const m = parseMatrix("1,2;3,4");
traza(m)
// Esperado: 5 (1+4)

// Test historial
logOperation('Test', '[1,2,3]', '6')
getHistory()
// Debe mostrar la operación
```

---

## Ejemplo 9: Patrón de Error Handling

```javascript
// ============ PATRÓN CORRECTO ============

$('#btn-operacion')?.addEventListener('click', () => {
  try {
    // 1. Validar entrada
    const entrada = parseVector($('#vecA').value);
    if (!entrada) {
      alert('Entrada inválida');
      return;
    }
    
    // 2. Validar precondiciones
    if (entrada.length === 0) {
      alert('Vector vacío');
      return;
    }
    
    // 3. Ejecutar operación
    const resultado = miOperacion(entrada);
    
    // 4. Validar resultado
    if (!isFinite(resultado)) {
      alert('Resultado no válido (infinito o NaN)');
      return;
    }
    
    // 5. Mostrar
    renderVector($('#out-vectores'), resultado);
    logOperation('Mi Op', vectorToString(entrada), vectorToString(resultado));
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
});
```

---

## Ejemplo 10: Actualizar Documentación

Cuando agregues una nueva función, actualiza `js/README_MODULAR.md`:

```markdown
### Mi Nueva Función

**Ubicación:** `js/vectors.js`

**Firma:**
```javascript
promedio(vector)  // vector: Array<number> → number
```

**Descripción:** Calcula el promedio aritmético de los elementos.

**Ejemplo:**
```javascript
promedio([1, 2, 3])  // → 2
```

**Dependencias:** Ninguna
```

---

## 📋 Checklist de Código

Antes de hacer commit:

- [ ] Código formateado y legible
- [ ] Comentarios en funciones complejas
- [ ] Validación de entradas
- [ ] Manejo de errores con try/catch
- [ ] Reutilización de funciones existentes
- [ ] Probado en navegador (F12 sin errores)
- [ ] Historial actualizado si es necesario
- [ ] README actualizado si es necesario

---

## 🎯 Resumen Rápido

1. **Agregar botón** → `index.html`
2. **Escribir lógica** → `js/mi-modulo.js`
3. **Conectar UI** → `initMiOperacion()`
4. **Probar** → Abrir navegador y hacer clic
5. **Documentar** → Actualizar README

**¡Listo a colaborar!** 🚀
