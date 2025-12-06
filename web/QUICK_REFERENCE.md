# 🚀 Guía Rápida - Matrices & Vectores Web

Una referencia rápida para desarrolladores que trabajan en el proyecto.

## 📂 Archivos Clave

| Archivo | Propósito | Cuándo Editarlo |
|---------|-----------|----------------|
| `config.js` | Constantes globales | Cambiar valores por defecto, mensajes |
| `utils.js` | Funciones comunes | Agregar helpers de uso general |
| `vectorOperations.js` | Lógica de vectores | Agregar operación con vectores |
| `matrixOperations.js` | Lógica de matrices | Agregar operación con matrices |
| `ui.js` | Interfaz y eventos | Conectar nuevo botón con lógica |
| `stepsManager.js` | Visualización paso a paso | Cambiar cómo se muestran los pasos |
| `exercises.js` | Ejercicios | Agregar nuevo tipo de ejercicio |
| `main.js` | Inicialización | Cambiar orden de carga |
| `index.html` | Estructura | Agregar nuevo botón o input |
| `styles.css` | Estilos | Cambiar apariencia |

## 🔄 Flujos Comunes

### Agregar una operación vectorial

```javascript
// 1. En vectorOperations.js
export function myOperation(a, b) {
  // Lógica aquí
  return result;
}

// 2. En config.js (agregar a Config.OPERATIONS)
MY_OPERATION: 'mi_operacion',

// 3. En index.html (agregar botón)
<button id="btn-my-op">Mi Operación</button>

// 4. En ui.js (agregar listener)
$('btn-my-op').addEventListener('click', () => {
  const a = parseVector($('vecA').value);
  const b = parseVector($('vecB').value);
  const result = vectorOps.myOperation(a, b);
  renderVector($('out-vectores'), result);
  logOperation(Config.OPERATIONS.MY_OPERATION, {a, b}, result);
});
```

### Agregar una operación matricial

```javascript
// 1. En matrixOperations.js
export function myMatrixOp(A, B) {
  // Lógica aquí
  return result;
}

// 2. Igual que arriba pero en sección de matrices
```

### Agregar pasos detallados

```javascript
// En vectorOperations.js o matrixOperations.js
export function stepsMyOperation(a, b) {
  const steps = [];
  steps.push(`Inicio: a=${vectorToString(a)}`);
  steps.push(`Paso 1: ...`);
  steps.push(`Resultado: ...`);
  return steps;
}

// En ui.js, agregar antes del renderizado final:
if ($('show-steps-vectores') && $('show-steps-vectores').checked) {
  const steps = vectorOps.stepsMyOperation(a, b);
  stepsManager.enterStepsMode('vectores', steps);
}
```

## 🎯 Puntos de Extensión

### Para nuevos tipos de datos
- Agregar funciones de parsing en `utils.js`
- Agregar funciones de renderizado en `utils.js`
- Actualizar `config.js` si es necesario

### Para nuevos algoritmos
- Implementar en `vectorOperations.js` o `matrixOperations.js`
- Crear función `steps*` para visualización
- Registrar en `config.js` si es una operación importante

### Para cambios de UI
- Agregar HTML en `index.html`
- Agregar evento en `ui.js`
- Agregar estilos en `styles.css` si es necesario

### Para nuevos temas o configuraciones
- Agregar en `config.js`
- Implementar lógica en módulos correspondientes
- Documentar en `DESARROLLO.md`

## 💡 Tips de Desarrollo

### Debug rápido
```javascript
// En la consola del navegador
// Ver la configuración
import Config from './js/config.js';
Config

// Ver el historial
localStorage.getItem('historial')

// Limpiar historial
localStorage.removeItem('historial')

// Ver tema actual
localStorage.getItem('theme')
```

### Testear cambios
```javascript
// En la consola
import * as vectorOps from './js/vectorOperations.js';
vectorOps.addVectors([1,2,3], [4,5,6])
// Debería retornar [5, 7, 9]
```

### Ver estructura de módulos
```
// En VS Code, abrir explorador de símbolos (Ctrl+Shift+O)
// Para ver todas las funciones del módulo actual
```

## 📌 Estándares de Código

### Nombres de Variables
```javascript
// Vectores: minúsculas
const a = [1, 2, 3];
const vectorA = [1, 2, 3];

// Matrices: mayúscula inicial o "Matrix"
const A = [[1, 2], [3, 4]];
const matrix = [[1, 2], [3, 4]];

// Booleanos: "is", "can", "has"
const isValid = true;
const canUpdate = false;
```

### Funciones
```javascript
// Operaciones: verbos acción
export function addVectors(a, b) { }
export function multiplyMatrices(A, B) { }

// Rendering: prefijo "render"
export function renderVector(container, v) { }
export function renderMatrix(container, M) { }

// Pasos: prefijo "steps"
export function stepsVectorSum(a, b) { }

// Getters: prefijo "get"
export function getHistory() { }
export function getDecimals() { }
```

### Comentarios
```javascript
// ============ Sección mayor ============

// Comentario de línea antes de código complejo

/**
 * Documentación JSDoc para funciones públicas
 * @param {Array} vector - El vector de entrada
 * @returns {number} La norma del vector
 */
export function norm(vector) { }
```

## 🔍 Validación Rápida

Antes de hacer commit, verificar:

```javascript
// ✅ La función está documentada
// ✅ Sigue el estándar de nombres
// ✅ No hay console.log de debug
// ✅ No hay código duplicado
// ✅ Las importaciones son correctas
// ✅ No hay typos en los mensajes
// ✅ Funciona en tema claro y oscuro
```

## 📞 Preguntas Frecuentes

**P: ¿Dónde agrego una constante nueva?**  
R: En `config.js` dentro del objeto `Config` correspondiente.

**P: ¿Cómo hago que un botón ejecute una operación?**  
R: Agregalo en HTML con un `id`, luego en `ui.js` haz `$('mi-id').addEventListener('click', ...)`

**P: ¿Cómo muestro pasos detallados?**  
R: Llama a `stepsManager.enterStepsMode('vectores', stepsArray)`

**P: ¿Cómo guardo datos?**  
R: Usa `localStorage.setItem(key, JSON.stringify(data))` o `logOperation()`

**P: ¿Dónde reporto errores?**  
R: En las issues del repositorio con detalles y pasos para reproducir.

---

**Última actualización:** Diciembre 2025
