# 🔄 Guía de Migración - Del Código Antiguo al Nuevo

Si estabas usando `app.js` (el archivo monolítico), esta guía te ayuda a entender cómo se ha reorganizado el código.

## 📍 Localización de Funciones

### Parsing y Conversión

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `parseVector(str)` | `utils.js` | Mismo comportamiento |
| `parseMatrix(str)` | `utils.js` | Mismo comportamiento |
| `fmt(x)` | `formatNumber(x)` en `utils.js` | Nombre más claro |
| `vecToStr(v)` | `vectorToString(v)` en `utils.js` | Nombre más claro |
| `matToStr(M)` | `matrixToString(M)` en `utils.js` | Nombre más claro |

### Operaciones con Vectores

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `sumarVectores(a,b)` | `addVectors()` en `vectorOperations.js` | Nombre en inglés |
| `restarVectores(a,b)` | `subtractVectors()` en `vectorOperations.js` | Nombre en inglés |
| `escalarVector(a,k)` | `scalarMultiply()` en `vectorOperations.js` | Nombre más claro |
| `productoPunto(a,b)` | `dotProduct()` en `vectorOperations.js` | Nombre en inglés |
| `norma(a)` | `norm()` en `vectorOperations.js` | Nombre más corto |

### Operaciones con Matrices

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `sumarMatrices(A,B)` | `addMatrices()` en `matrixOperations.js` | Nombre en inglés |
| `multiplicarMatrices(A,B)` | `multiplyMatrices()` en `matrixOperations.js` | Nombre en inglés |
| `transponer(A)` | `transpose()` en `matrixOperations.js` | Nombre en inglés |
| `determinant(A)` | `determinant()` en `matrixOperations.js` | Sin cambios |
| `inverseMatrix(A)` | `inverseMatrix()` en `matrixOperations.js` | Sin cambios |
| `luDecompose(A)` | `luDecomposition()` en `matrixOperations.js` | Nombre más claro |
| `gaussSolve(A,b)` | `gaussSolve()` en `matrixOperations.js` | Sin cambios |
| `jacobi(A,b,opts)` | `jacobi()` en `matrixOperations.js` | Sin cambios |

### Generadores de Pasos

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `steps_vector_sum()` | `stepsVectorSum()` en `vectorOperations.js` | Nombre camelCase |
| `steps_vector_sub()` | `stepsVectorSubtract()` en `vectorOperations.js` | Nombre más claro |
| `steps_scalar_mul()` | `stepsScalarMultiply()` en `vectorOperations.js` | Nombre más claro |
| `steps_dot()` | `stepsDotProduct()` en `vectorOperations.js` | Nombre más claro |
| `steps_norm()` | `stepsNorm()` en `vectorOperations.js` | Nombre camelCase |
| `steps_matrix_sum()` | `stepsMatrixSum()` en `matrixOperations.js` | Nombre camelCase |
| `steps_matrix_mul()` | `stepsMatrixMultiply()` en `matrixOperations.js` | Nombre camelCase |
| `steps_transpose()` | `stepsTranspose()` en `matrixOperations.js` | Nombre camelCase |
| `gaussSolveWithSteps()` | `gaussSolveWithSteps()` en `matrixOperations.js` | Sin cambios |

### Utilidades de DOM

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `$(id)` | `$()` en `utils.js` | Sin cambios |
| `clearNode(n)` | `clearNode()` en `utils.js` | Sin cambios |
| `renderVector()` | `renderVector()` en `utils.js` | Sin cambios |
| `renderMatrix()` | `renderMatrix()` en `utils.js` | Sin cambios |
| `renderScalar()` | `renderScalar()` en `utils.js` | Sin cambios |
| `renderSteps()` | `renderSteps()` en `utils.js` | Sin cambios |

### Validación

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `validateVectors(A,B)` | `validateVectors()` en `utils.js` | Sin cambios |
| `validateMatricesMul(A,B)` | `validateMatricesForMultiplication()` en `utils.js` | Nombre más claro |

### Almacenamiento

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `logOperacion()` | `logOperation()` en `utils.js` | Nombre en inglés |
| `localStorage.getItem('historial')` | `getHistory()` en `utils.js` | Función helper |
| `localStorage.removeItem('historial')` | `clearHistory()` en `utils.js` | Función helper |

### Gestión de Pasos

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `renderCurrentStep()` | `renderCurrentStep()` en `stepsManager.js` | Sin cambios |
| `enterStepsMode()` | `enterStepsMode()` en `stepsManager.js` | Sin cambios |
| `stepNext()` | `stepNext()` en `stepsManager.js` | Sin cambios |
| `stepPrev()` | `stepPrev()` en `stepsManager.js` | Sin cambios |
| `stepToggleAll()` | `stepToggleAll()` en `stepsManager.js` | Sin cambios |
| `wireStepControls()` | `wireStepControls()` en `stepsManager.js` | Sin cambios |
| `printSteps()` | `printSteps()` en `stepsManager.js` | Sin cambios |

### Ejercicios

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `genExercise()` | `generateExercise()` en `exercises.js` | Nombre más claro |
| `checkExercise()` | `checkExercise()` en `exercises.js` | Sin cambios |

### Visualizador

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `drawVectors()` | `drawVectors()` en `ui.js` | Sin cambios |

### Tema

| Función Antigua | Nueva Ubicación | Cambios |
|-----------------|-----------------|---------|
| `applyTheme()` | `setTheme()` en `utils.js` | Nombre más claro |
| `setThemePreference()` | `saveThemePreference()` en `utils.js` | Nombre más claro |
| `initTheme()` | (en `main.js`) | Inicialización centralizada |

---

## 🔍 Ejemplos de Migración

### Ejemplo 1: Usar suma de vectores

**Antes:**
```javascript
// En app.js (dentro del IIFE)
const resultado = sumarVectores([1,2,3], [4,5,6]);
```

**Después:**
```javascript
// En nuevo código modular
import * as vectorOps from './vectorOperations.js';

const resultado = vectorOps.addVectors([1,2,3], [4,5,6]);
```

### Ejemplo 2: Renderizar un vector

**Antes:**
```javascript
// En app.js
renderVector($('out-vectores'), [1,2,3]);
```

**Después:**
```javascript
// En nuevo código
import { renderVector, $ } from './utils.js';

renderVector($('out-vectores'), [1,2,3]);
```

### Ejemplo 3: Formatear número

**Antes:**
```javascript
// En app.js
const formatted = fmt(3.14159);
```

**Después:**
```javascript
// En nuevo código
import { formatNumber } from './utils.js';

const formatted = formatNumber(3.14159);
```

### Ejemplo 4: Registrar operación

**Antes:**
```javascript
// En app.js
logOperacion('suma_vectores', {A, B}, resultado);
```

**Después:**
```javascript
// En nuevo código
import { logOperation } from './utils.js';
import Config from './config.js';

logOperation(Config.OPERATIONS.VECTOR_SUM, { A, B }, resultado);
```

### Ejemplo 5: Mostrar pasos

**Antes:**
```javascript
// En app.js
enterStepsMode('vectores', steps_vector_sum(A, B));
```

**Después:**
```javascript
// En nuevo código
import * as stepsManager from './stepsManager.js';
import * as vectorOps from './vectorOperations.js';

stepsManager.enterStepsMode('vectores', vectorOps.stepsVectorSum(A, B));
```

---

## 🔧 Cambios de Comportamiento

### Variables Globales

**Antes:**
```javascript
// Todas las funciones en scope global del IIFE
const stepsState = { ... };
const currentExercise = null;
```

**Después:**
```javascript
// Módulos privados - no accesibles desde consola
// Acceso via funciones públicas
stepsManager.getStepsState();
exercises.getCurrentExercise();
```

### Configuración

**Antes:**
```javascript
// Esparcida en el código
const DECIMALS = 6;
const GAUSS_TOL = 1e-12;
```

**Después:**
```javascript
import Config from './config.js';
Config.UI.DECIMALS_DEFAULT;
Config.ALGORITHMS.GAUSS_TOLERANCE;
```

### localStorage

**Antes:**
```javascript
localStorage.getItem('historial')
localStorage.getItem('decimals')
localStorage.getItem('theme')
```

**Después:**
```javascript
import { getHistory } from './utils.js';
import Config from './config.js';

// O acceso directo con claves
localStorage.getItem(Config.STORAGE.HISTORY_KEY);
localStorage.getItem(Config.STORAGE.DECIMALS_KEY);
localStorage.getItem(Config.STORAGE.THEME_KEY);
```

---

## 📝 Hoja de Trucos para Migración

Si tienes código antiguo que quieres portar:

### 1. Si es **lógica matemática pura**
→ Va en `vectorOperations.js` o `matrixOperations.js`

### 2. Si es **utilidad reutilizable**
→ Va en `utils.js`

### 3. Si es **configuración**
→ Va en `config.js`

### 4. Si es **gestión de eventos/UI**
→ Va en `ui.js`

### 5. Si es **visualización de pasos**
→ Va en `stepsManager.js`

### 6. Si es **inicialización de app**
→ Va en `main.js`

---

## ✅ Checklist de Migración

Si migras código antiguo:

- [ ] Separar lógica de presentación
- [ ] Mover a archivo correcto
- [ ] Cambiar nombre si es necesario (camelCase)
- [ ] Agregar importaciones en el inicio del archivo
- [ ] Exportar función si es pública
- [ ] Actualizar referencias en otros archivos
- [ ] Testear en navegador
- [ ] Actualizar documentación
- [ ] Commit con mensaje claro

---

## 🔗 Referencias Rápidas

### Desde la consola del navegador

```javascript
// Ver configuración
import Config from './js/config.js';
Config

// Ver historial
import { getHistory } from './js/utils.js';
getHistory()

// Testear vector sum
import * as v from './js/vectorOperations.js';
v.addVectors([1,2], [3,4])  // [4, 6]

// Testear matriz sum
import * as m from './js/matrixOperations.js';
m.addMatrices([[1,2],[3,4]], [[5,6],[7,8]])
```

---

## 📞 Preguntas Frecuentes

**P: ¿Dónde encontré una función?**  
R: Usa Ctrl+F en la tabla de "Localización de Funciones"

**P: ¿Cambió la API de alguna función?**  
R: No (salvo nombres). La lógica sigue igual.

**P: ¿Puedo importar del viejo app.js?**  
R: No, ya no existe. Las funciones están en módulos.

**P: ¿Cómo debuggeo ahora?**  
R: Igual que antes, pero importa el módulo:
```javascript
import * as vectorOps from './js/vectorOperations.js';
console.log(vectorOps.addVectors(...));
```

---

**Última actualización:** Diciembre 2025

¿Preguntas? Consulta DESARROLLO.md o QUICK_REFERENCE.md 🚀
