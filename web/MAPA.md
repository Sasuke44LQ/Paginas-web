# 🗺️ Mapa del Proyecto

Visualización completa de la estructura y relaciones del proyecto.

## 📦 Estructura General

```
Páginas-web/
│
├── 📄 RESUMEN_EJECUTIVO.md          ← Lee esto primero
│
└── web/
    ├── 📖 INDEX.md                   ← Índice y guía rápida
    ├── 📖 RESUMEN.md                 ← Antes/Después
    ├── 📖 QUICK_REFERENCE.md         ← Referencia rápida
    ├── 📖 DESARROLLO.md              ← Arquitectura completa
    ├── 📖 EQUIPO.md                  ← Flujo de trabajo
    ├── 📖 MIGRACION.md               ← Si usabas app.js
    ├── 📖 TESTING.md                 ← Cómo testear
    ├── 📖 README_WEB.md              ← Documentación original
    │
    ├── 📄 index.html                 ← Página principal
    ├── 🎨 styles.css                 ← Estilos
    ├── 📜 app.js                     ← (Archivo antiguo, para referencia)
    │
    └── 📁 js/                        ← Módulos modernos
        ├── main.js                   ← Inicialización
        ├── config.js                 ← Configuración
        ├── utils.js                  ← Utilidades
        ├── vectorOperations.js       ← Operaciones vectores
        ├── matrixOperations.js       ← Operaciones matrices
        ├── stepsManager.js           ← Gestión de pasos
        ├── exercises.js              ← Sistema de ejercicios
        └── ui.js                     ← Interfaz
```

---

## 🔄 Flujo de Módulos

```
┌─────────────────────────────────────────────────────────┐
│                    index.html + styles.css               │
│                    (estructura y estilos)               │
└──────────────────────────┬────────────────────────────┘
                           │
                  ┌────────▼────────┐
                  │   main.js       │
                  │ (inicialización)│
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼───┐      ┌──────▼──────┐    ┌─────▼──────┐
    │config │      │   utils.js  │    │  stepsManager
    │(valores)     │(helpers)    │    │  (pasos)
    └───────┘      └─────────────┘    └────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼──────────┐  ┌──▼───────────┐
│vectorOps     │  │matrixOps         │  │exercises     │
│(lógica vec)  │  │(lógica matrices) │  │(ejercicios)  │
└──────────────┘  └──────────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  ui.js      │
                    │ (interfaz)  │
                    │ (eventos)   │
                    └─────────────┘
                           │
                    ┌──────▼──────┐
                    │ Navegador   │
                    │ (usuario)   │
                    └─────────────┘
```

---

## 📊 Responsabilidades de Cada Módulo

### config.js (85 líneas)
```
├─ UI
│  ├─ DECIMALS_DEFAULT
│  ├─ CANVAS_WIDTH / HEIGHT
│  └─ MODAL_TIMEOUT
├─ ALGORITHMS
│  ├─ GAUSS_TOLERANCE
│  ├─ JACOBI_TOLERANCE
│  └─ JACOBI_MAX_ITERATIONS
├─ STORAGE
│  ├─ HISTORY_KEY
│  ├─ DECIMALS_KEY
│  └─ THEME_KEY
├─ THEMES
├─ OPERATIONS (lista de todas las operaciones)
└─ MESSAGES (todos los textos)
```

### utils.js (250 líneas)
```
├─ Parsing
│  ├─ parseVector()
│  ├─ parseMatrix()
│  ├─ formatNumber()
│  ├─ vectorToString()
│  └─ matrixToString()
├─ DOM
│  ├─ $()
│  ├─ clearNode()
│  ├─ renderVector()
│  ├─ renderMatrix()
│  ├─ renderScalar()
│  └─ renderSteps()
├─ Validación
│  ├─ validateVectors()
│  └─ validateMatricesForMultiplication()
├─ Storage
│  ├─ logOperation()
│  ├─ getHistory()
│  └─ clearHistory()
└─ Tema
   ├─ setTheme()
   ├─ getThemePreference()
   ├─ saveThemePreference()
   └─ refreshPreviews()
```

### vectorOperations.js (180 líneas)
```
├─ Operaciones Básicas
│  ├─ addVectors()
│  ├─ subtractVectors()
│  ├─ scalarMultiply()
│  ├─ dotProduct()
│  └─ norm()
└─ Generadores de Pasos
   ├─ stepsVectorSum()
   ├─ stepsVectorSubtract()
   ├─ stepsScalarMultiply()
   ├─ stepsDotProduct()
   └─ stepsNorm()
```

### matrixOperations.js (380 líneas)
```
├─ Operaciones Básicas
│  ├─ addMatrices()
│  ├─ multiplyMatrices()
│  └─ transpose()
├─ Avanzadas
│  ├─ determinant()
│  ├─ inverseMatrix()
│  └─ luDecomposition()
├─ Resolución de Sistemas
│  ├─ gaussSolveWithSteps()
│  ├─ gaussSolve()
│  └─ jacobi()
└─ Generadores de Pasos
   ├─ stepsMatrixSum()
   ├─ stepsMatrixMultiply()
   └─ stepsTranspose()
```

### stepsManager.js (140 líneas)
```
├─ Estado
│  └─ stepsState { vectores, matrices }
├─ Rendering
│  ├─ renderCurrentStep()
│  └─ enterStepsMode()
├─ Navegación
│  ├─ stepNext()
│  ├─ stepPrev()
│  └─ stepToggleAll()
├─ Utilidades
│  ├─ wireStepControls()
│  ├─ printSteps()
│  └─ getStepsState()
```

### exercises.js (200 líneas)
```
├─ Generación
│  ├─ generateExercise()
│  ├─ generateVectorSumExercise()
│  ├─ generateMatrixMultiplicationExercise()
│  └─ generateGaussExercise()
├─ Evaluación
│  ├─ checkExercise()
│  └─ compareAnswers()
└─ Estado
   ├─ getCurrentExercise()
   └─ clearCurrentExercise()
```

### ui.js (450 líneas)
```
├─ Navegación
│  ├─ showSection()
│  └─ initSectionNavigation()
├─ Vectores
│  └─ initVectorOperations()
│     ├─ sumar, restar, punto, escalar, norma
│     └─ performVectorOperation()
├─ Matrices
│  └─ initMatrixOperations()
│     ├─ suma, multiplicación, transposición
│     ├─ determinante, inversa, LU
│     ├─ Gauss, Jacobi
│     └─ performMatrixOperation()
├─ Historial
│  ├─ fillHistory()
│  └─ initHistory()
├─ Ejercicios
│  └─ initExercises()
├─ Visualizador
│  ├─ drawVectors()
│  └─ initVisualizer()
└─ Previsualizaciones
   └─ initInputPreviews()
```

### main.js (120 líneas)
```
├─ Tema
│  ├─ initTheme()
│  └─ initThemeControls()
├─ Decimales
│  └─ initDecimals()
└─ Inicialización Principal
   ├─ Orquesta todos los módulos
   ├─ Configura listeners
   └─ Muestra sección inicial
```

---

## 🔗 Relaciones Entre Módulos

```
main.js (ENTRADA)
    ↓
    ├─→ ui.js (INTERFAZ)
    │    ├─→ vectorOperations.js (LÓGICA)
    │    ├─→ matrixOperations.js (LÓGICA)
    │    ├─→ stepsManager.js (VISUALIZACIÓN)
    │    ├─→ exercises.js (EJERCICIOS)
    │    └─→ utils.js (UTILIDADES)
    │
    ├─→ stepsManager.js (PASOS)
    │    └─→ utils.js (UTILIDADES)
    │
    ├─→ exercises.js (EJERCICIOS)
    │    ├─→ matrixOperations.js (LÓGICA)
    │    └─→ utils.js (UTILIDADES)
    │
    └─→ config.js (CONFIGURACIÓN - accesible desde todos)
         (Importado por: main, ui, utils, exercises, stepsManager)
```

---

## 📥 Importaciones Típicas

### En ui.js
```javascript
import Config from './config.js';
import * as vectorOps from './vectorOperations.js';
import * as matrixOps from './matrixOperations.js';
import * as stepsManager from './stepsManager.js';
import * as exercises from './exercises.js';
import {
  $,
  parseVector,
  renderVector,
  logOperation,
  // ... más utilidades
} from './utils.js';
```

### En exercises.js
```javascript
import { formatNumber, parseVector, $ } from './utils.js';
import { multiplyMatrices, gaussSolve } from './matrixOperations.js';
import Config from './config.js';
```

### En vectorOperations.js
```javascript
import { formatNumber, vectorToString } from './utils.js';
import Config from './config.js';
```

---

## 📈 Escalabilidad: Agregar Nueva Operación

```
1. Implementar en operaciones.js
   └─ export function newOp(a, b) { ... }
   └─ export function stepsNewOp(a, b) { ... }

2. Agregar config en config.js
   └─ NEW_OP: 'new_op' (en OPERATIONS)

3. Agregar HTML en index.html
   └─ <button id="btn-new-op">Nueva Operación</button>

4. Conectar en ui.js
   └─ $('btn-new-op').addEventListener('click', ...)
```

Sin afectar a otros módulos ✅

---

## 🎯 Punto de Entrada del Usuario

```
Usuario abre página
        │
        ▼
┌───────────────────────┐
│ Navegador carga:      │
│ - index.html          │
│ - styles.css          │
│ - main.js (module)    │
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│ main.js ejecuta:      │
│ - Import módulos      │
│ - initTheme()         │
│ - initDecimals()      │
│ - ui.init*()          │
│ - wireStepControls()  │
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│ Aplicación lista      │
│ para interacción      │
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│ Usuario hace click    │
│ → ui.js escucha       │
│ → llama operación     │
│ → renderiza resultado │
└───────────────────────┘
```

---

## 📚 Guía de Navegación Rápida

```
¿Quiero...?                          ¿Dónde voy?
─────────────────────────────────────────────────────
Entender todo de nuevo               → INDEX.md
Ver cambios                          → RESUMEN.md
Referencia rápida                    → QUICK_REFERENCE.md
Agregar nueva operación              → QUICK_REFERENCE.md (flujos)
Entender arquitectura                → DESARROLLO.md
Trabajar en equipo                   → EQUIPO.md
Migrar de código antiguo             → MIGRACION.md
Testear funcionalidad                → TESTING.md
Ver estructura                       → Este archivo
```

---

## 🚀 Flujo Completo de Uso

```
1. Usuario ingresa vector A = [1,2,3]
                              ↓
2. utils.js parseVector() convierte a array
                              ↓
3. Usuario ingresa vector B = [4,5,6]
                              ↓
4. Usuario hace click en "Sumar"
                              ↓
5. ui.js escucha el evento
                              ↓
6. Valida con validateVectors() en utils.js
                              ↓
7. Llama addVectors() en vectorOperations.js
                              ↓
8. Obtiene resultado [5,7,9]
                              ↓
9. Renderiza con renderVector() en utils.js
                              ↓
10. Registra con logOperation() en utils.js
                              ↓
11. Si "mostrar pasos":
    - Llama stepsVectorSum()
    - Pasa a stepsManager.enterStepsMode()
    - Renderiza pasos
                              ↓
12. Usuario ve resultado y pasos
```

---

**Última actualización:** Diciembre 2025

¿Necesitas encontrar algo específico? Usa Ctrl+F en este documento 🔍
