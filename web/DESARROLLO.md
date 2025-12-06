# Calculadora de Matrices y Vectores - Web

Una aplicación web interactiva para cálculos con matrices y vectores, diseñada con arquitectura modular para facilitar el mantenimiento, colaboración en equipo y comprensión del código.

## 🎯 Características

### Operaciones con Vectores
- ✅ Suma y resta
- ✅ Producto punto (escalar)
- ✅ Multiplicación por escalar
- ✅ Cálculo de norma
- ✅ Visualizador 2D/3D con rotación

### Operaciones con Matrices
- ✅ Suma y multiplicación
- ✅ Transposición
- ✅ Determinante
- ✅ Matriz inversa
- ✅ Descomposición LU
- ✅ Resolución de sistemas: Gauss y Jacobi

### Características Educativas
- 📚 Visualización paso a paso de operaciones
- 🎓 Modo de práctica con ejercicios generados aleatoriamente
- 📊 Historial completo de operaciones
- 🖨️ Impresión de procedimientos
- 📥 Importación/exportación de datos

### Configuración
- 🌙 Tema claro/oscuro
- 🔢 Control de decimales mostrados
- 💾 Almacenamiento automático en el navegador

---

## 📁 Estructura del Proyecto

```
web/
├── js/                          # Módulos JavaScript (ES6)
│   ├── main.js                 # Punto de entrada, inicialización
│   ├── config.js               # Configuración centralizada
│   ├── utils.js                # Funciones de utilidad generales
│   ├── vectorOperations.js     # Operaciones con vectores
│   ├── matrixOperations.js     # Operaciones con matrices
│   ├── stepsManager.js         # Gestión de pasos detallados
│   ├── exercises.js            # Sistema de ejercicios
│   └── ui.js                   # Gestión de interfaz y eventos
│
├── index.html                  # Estructura HTML
├── styles.css                  # Estilos CSS
└── README.md                   # Este archivo
```

---

## 🏗️ Arquitectura Modular

La aplicación se divide en módulos independientes, cada uno con responsabilidades claras:

### `config.js` - Configuración Centralizada
Contiene todas las constantes y configuraciones:
- Valores por defecto de UI
- Parámetros de algoritmos
- Claves de almacenamiento
- Mensajes de la aplicación

**Ventaja:** Cambiar configuración es trivial, se hace en un único lugar.

```javascript
// Ejemplo de uso
import Config from './config.js';
console.log(Config.UI.DECIMALS_DEFAULT); // 6
```

---

### `utils.js` - Utilidades Generales
Funciones de propósito general reutilizables:
- Parsing y conversión de datos (vectores, matrices)
- Operaciones de DOM
- Almacenamiento (localStorage)
- Validación de entrada

**Ventaja:** Código común centralizado, fácil de reutilizar y mantener.

```javascript
import { parseVector, formatNumber, renderMatrix } from './utils.js';
```

---

### `vectorOperations.js` - Operaciones con Vectores
Contiene la lógica matemática pura para vectores:
- `addVectors(a, b)` - Suma
- `dotProduct(a, b)` - Producto punto
- `norm(a)` - Norma
- `stepsVectorSum(A, B)` - Pasos detallados

**Ventaja:** Lógica matemática pura, sin dependencias de UI, fácil de testear.

```javascript
import * as vectorOps from './vectorOperations.js';
const result = vectorOps.addVectors([1,2,3], [4,5,6]);
```

---

### `matrixOperations.js` - Operaciones con Matrices
Contiene la lógica matemática pura para matrices:
- `addMatrices(A, B)` - Suma
- `multiplyMatrices(A, B)` - Multiplicación
- `determinant(A)` - Determinante
- `inverseMatrix(A)` - Inversa
- `luDecomposition(A)` - Descomposición LU
- `gaussSolve(A, b)` - Resolver Ax=b
- `jacobi(A, b, opts)` - Método iterativo

**Ventaja:** Algoritmos robustos y testeables, separados de la UI.

---

### `stepsManager.js` - Gestión de Pasos
Maneja la presentación paso a paso:
- `enterStepsMode(section, stepsArray)` - Entra en modo pasos
- `stepNext(section)` - Siguiente paso
- `stepPrev(section)` - Paso anterior
- `printSteps(section)` - Imprime los pasos

**Ventaja:** Lógica de presentación centralizada, fácil de mantener.

---

### `exercises.js` - Sistema de Ejercicios
Genera y califica ejercicios:
- `generateExercise(type)` - Genera ejercicio aleatorio
- `checkExercise()` - Verifica la respuesta
- Soporta: suma de vectores, multiplicación de matrices, Gauss

**Ventaja:** Fácil agregar nuevos tipos de ejercicios.

---

### `ui.js` - Gestión de Interfaz
Conecta la lógica con la UI:
- `showSection(id)` - Navega entre secciones
- `initVectorOperations()` - Configura botones de vectores
- `initMatrixOperations()` - Configura botones de matrices
- `initHistory()` - Configura historial
- `drawVectors()` - Visualizador

**Ventaja:** Separación clara entre lógica y presentación.

---

### `main.js` - Punto de Entrada
Orquesta la inicialización de todos los módulos:
- Importa todos los módulos
- Inicializa tema, decimales, listeners
- Configura la aplicación

**Ventaja:** Flujo de inicialización claro y fácil de mantener.

---

## 🔧 Guía de Desarrollo

### Agregar una Nueva Operación

1. **Implementar la lógica** en `vectorOperations.js` o `matrixOperations.js`:

```javascript
// En vectorOperations.js
export function crossProduct(a, b) {
  if (a.length !== 3 || b.length !== 3) {
    throw 'Los vectores deben tener 3 componentes';
  }
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0]
  ];
}

export function stepsCrossProduct(a, b) {
  const steps = [];
  steps.push(`a × b = ...`);
  // Más pasos
  return steps;
}
```

2. **Agregar configuración** en `config.js`:

```javascript
// En Config.OPERATIONS
CROSS_PRODUCT: 'producto_cruz',
```

3. **Agregar botón** en `index.html`:

```html
<button id="btn-cross">Producto Vectorial</button>
```

4. **Conectar en UI** (`ui.js`):

```javascript
export function initVectorOperations() {
  // ... código existente ...
  
  $('btn-cross').addEventListener('click', () => {
    try {
      const A = parseVector($('vecA').value);
      const B = parseVector($('vecB').value);
      
      const result = vectorOps.crossProduct(A, B);
      renderVector($('out-vectores'), result);
      logOperation(Config.OPERATIONS.CROSS_PRODUCT, { A, B }, result);
      
      if ($('show-steps-vectores') && $('show-steps-vectores').checked) {
        const steps = vectorOps.stepsCrossProduct(A, B);
        stepsManager.enterStepsMode('vectores', steps);
      }
    } catch (e) {
      $('out-vectores').textContent = `Error: ${e}`;
    }
  });
}
```

### Agregar un Nuevo Tipo de Ejercicio

1. **Agregar configuración** en `config.js`:

```javascript
CROSS_PRODUCT_EXERCISE: 'cross_product',
```

2. **Implementar generador** en `exercises.js`:

```javascript
function generateCrossProductExercise() {
  // Generar ejercicio
}
```

3. **Agregar opción** en `index.html`:

```html
<option value="cross_product">Producto Vectorial</option>
```

### Debugging

La aplicación registra inicialización en la consola:

```javascript
console.log('🚀 Inicializando aplicación...');
console.log('✅ Aplicación inicializada exitosamente');
```

Para debugging de operaciones, todos los módulos usan `logOperation()`:

```javascript
logOperation(Config.OPERATIONS.SUM, { A, B }, result);
```

---

## 📚 Convenciones de Código

### Nombres
- **Variables:** `camelCase` → `vectorA`, `matrixResult`
- **Funciones:** `camelCase` → `addVectors()`, `formatNumber()`
- **Constantes:** `UPPER_CASE` → `DECIMALS_DEFAULT`, `TOLERANCE`
- **Clases/Módulos:** `PascalCase` → `Config`

### Organización
- Cada módulo tiene máximo 300 líneas
- Funciones agrupadas por categoría
- Comentarios de sección con `// ========`

### Documentación
- JSDoc en funciones públicas
- Comentarios explicativos en lógica compleja
- README para cambios importantes

---

## 🚀 Cómo Empezar

### Desarrollo Local

```bash
# Navegar a la carpeta del proyecto
cd web/

# Servir con un servidor local (Python 3)
python -m http.server 8000

# O con Node.js
npx http-server

# Abrir en navegador
http://localhost:8000
```

### Estructura de Commits

```
[tipo]: descripción breve

Descripción más detallada si es necesario.

Tipo: feat, fix, docs, style, refactor, test, chore
```

Ejemplos:
```
feat: agregar operación producto vectorial
fix: corregir error en cálculo de determinante
docs: actualizar README con nuevos módulos
refactor: separar lógica de validación en utils.js
```

---

## 🤝 Colaboración en Equipo

### Estructura para Múltiples Desarrolladores

```
Tarea: Agregar resolución Gauss-Seidel

1. David: Implementa en matrixOperations.js
   - `gaussSeidel(A, b, opts)` función principal
   - `stepsGaussSeidel()` para pasos detallados
   - Commits: feat: agregar algoritmo Gauss-Seidel

2. María: Conecta en la UI (ui.js)
   - Agrega button listener en initMatrixOperations()
   - Maneja errores y validación
   - Commits: feat: UI para Gauss-Seidel

3. Carlos: Prueba y documentación
   - Prueba con diferentes matrices
   - Actualiza README
   - Commits: test: verificar Gauss-Seidel, docs: agregar Gauss-Seidel
```

### Flujo de Trabajo Recomendado

1. **Crear rama:** `git checkout -b feat/nueva-operacion`
2. **Desarrollar:** Hacer pequeños commits
3. **Testear:** Verificar en navegador
4. **PR:** Push y pull request
5. **Review:** Al menos un compañero revisa
6. **Merge:** Fusionar a `main`

---

## 📋 Lista de Verificación para PRs

- ✅ Código sigue convenciones
- ✅ Funciona en Chrome, Firefox, Safari
- ✅ Sin errores en consola
- ✅ Historial se guarda correctamente
- ✅ Tema oscuro/claro funciona
- ✅ Pasos detallados funcionan
- ✅ Comentarios y docstring agregados
- ✅ README actualizado si hay cambios significativos

---

## 🐛 Troubleshooting

### "Módulo no encontrado"
- Verificar que la ruta es relativa desde `js/main.js`
- Los módulos deben tener extensión `.js`

### "Operación no aparece"
- Verificar que se agregó en `config.js`
- Verificar que el listener está en `ui.js`
- Verificar que el botón tiene id correcto en HTML

### "Pasos no se muestran"
- Verificar que el checkbox `show-steps-*` existe en HTML
- Verificar que se llama a `stepsManager.enterStepsMode()`

---

## 📞 Contacto y Preguntas

Para preguntas sobre la arquitectura o cómo extender la aplicación:
1. Revisar este README
2. Consultar comentarios en el código
3. Revisar ejemplos en módulos similares
4. Preguntar en discusiones del proyecto

---

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

---

**Última actualización:** Diciembre 2025  
**Versión:** 2.0 (Refactorización modular)
