# Estructura Modular - Calculadora de Matrices y Vectores

## Descripción

La aplicación ha sido refactorizada a una **arquitectura modular limpia y mantenible**, separando la lógica en módulos independientes que facilitan el trabajo en equipo.

## Estructura de Módulos

### 📦 Orden de Carga (Crítico)

Los módulos se cargan en este orden específico en `index.html`:

```html
<script src="js/config.js"></script>    <!-- 1. Configuración -->
<script src="js/utils.js"></script>     <!-- 2. Utilidades -->
<script src="js/vectors.js"></script>   <!-- 3. Operaciones vectoriales -->
<script src="js/matrices.js"></script>  <!-- 4. Operaciones matriciales -->
<script src="js/ui.js"></script>        <!-- 5. UI e Inicialización -->
```

**Importante:** El orden es crítico porque cada módulo depende de los anteriores.

---

## 📄 Descripción de Módulos

### 1. `js/config.js` - Configuración
**Responsabilidad:** Definir todas las constantes y estado global

**Contenido:**
```javascript
APP_CONFIG = {
  DECIMALS_DEFAULT: 6,          // Decimales por defecto
  GAUSS_TOLERANCE: 1e-12,       // Tolerancia para eliminación Gauss
  JACOBI_TOLERANCE: 1e-8,       // Tolerancia para método Jacobi
  JACOBI_MAX_ITERATIONS: 1000,  // Máximo de iteraciones
  HISTORY_KEY: 'historial',     // Clave localStorage para historial
  DECIMALS_KEY: 'decimals',     // Clave localStorage para decimales
  THEME_KEY: 'theme'            // Clave localStorage para tema
}

APP_STATE = {
  currentExercise: null,
  stepsState: { ... }
}
```

**Dependencias:** Ninguna

---

### 2. `js/utils.js` - Utilidades Compartidas
**Responsabilidad:** Funciones comunes usadas por todos los módulos

**Funciones principales:**

#### Parsing y Conversión
- `parseVector(str)` → Array de números
- `parseMatrix(str)` → Array 2D de números
- `formatNumber(num)` → String formateado
- `vectorToString(v)` → "[1, 2, 3]"
- `matrixToString(m)` → Multi-línea

#### DOM
- `$(selector)` → Shortcut de `querySelector`
- `clearNode(node)` → Vacía un elemento
- `renderVector(container, v)` → Dibuja vector
- `renderMatrix(container, m)` → Dibuja matriz

#### Validación
- `validateVectors(str1, str2)` → Verifica dimensiones iguales
- `validateMatricesForMultiplication(str1, str2)` → Verifica compatibilidad

#### Historial (localStorage)
- `logOperation(op, input, output, type)` → Guarda en historial
- `getHistory()` → Lee historial
- `clearHistory()` → Borra historial

**Dependencias:** `config.js`

---

### 3. `js/vectors.js` - Operaciones con Vectores
**Responsabilidad:** Lógica matemática y UI para vectores

**Funciones matemáticas:**
```javascript
addVectors(v1, v2)        → v1 + v2
subtractVectors(v1, v2)   → v1 - v2
scalarMultiply(v, k)      → k * v
dotProduct(v1, v2)        → v1 · v2 (escalar)
norm(v)                   → ||v||
```

**Funciones UI:**
```javascript
initVectorOperations()     // Inicializa 5 botones de operaciones
```

Maneja eventos de:
- `#btn-sumar` → Suma vectores de `#vecA` y `#vecB`
- `#btn-restar` → Resta
- `#btn-punto` → Producto punto
- `#btn-escalar` → Multiplicación escalar (usa `#escalar`)
- `#btn-norma` → Norma de `#vecA`

Salida → `#out-vectores`

**Dependencias:** `config.js`, `utils.js`

---

### 4. `js/matrices.js` - Operaciones con Matrices
**Responsabilidad:** Lógica matemática y UI para matrices

**Funciones matemáticas:**
```javascript
addMatrices(m1, m2)       → m1 + m2
multiplyMatrices(m1, m2)  → m1 × m2
transpose(m)              → m^T
determinant(m)            → det(m)
gaussSolve(A, b)          → Resuelve Ax = b
```

**Funciones UI:**
```javascript
initMatrixOperations()     // Inicializa botones de matriz
```

Maneja eventos de:
- `#btn-m-sum` → Suma matrices de `#matA` y `#matB`
- `#btn-m-mul` → Multiplica
- `#btn-transp` → Transpuesta de `#matA`
- `#btn-det` → Determinante de `#matA`
- `#btn-gauss` → Resuelve Ax=b usando `#matA` y `#vecBmat`

Salida → `#out-matrices`

**Dependencias:** `config.js`, `utils.js`

---

### 5. `js/ui.js` - Interfaz de Usuario
**Responsabilidad:** Inicialización, navegación e historial

**Funciones principales:**

```javascript
showSection(sectionId)         // Oculta/muestra secciones
initNavigation()               // Conecta botones de navegación
initHistory()                  // Conecta historial y decimales
fillHistory()                  // Llena lista de historial
init()                         // Función principal (se ejecuta al cargar)
```

Maneja:
- Botones de navegación: `#btn-vectores`, `#btn-matrices`, `#btn-historial`, `#btn-practice`
- Secciones: `#sect-vectores`, `#sect-matrices`, `#sect-historial`, `#sect-practice`
- Historial: `#btn-clear-history`, `#decimals`, `#history-list`

**Dependencias:** Todos los módulos anteriores

---

## 🔄 Flujo de Inicialización

```
DOMContentLoaded event
        ↓
    init() en ui.js
        ↓
    ├─→ initNavigation()           (carga config.js)
    ├─→ initVectorOperations()     (conecta botones de vectores)
    ├─→ initMatrixOperations()     (conecta botones de matrices)
    └─→ initHistory()              (conecta historial)
        ↓
    Aplicación lista para usar
```

---

## 💾 Almacenamiento Local

La aplicación usa `localStorage` para guardar:

| Clave | Contenido | Ejemplo |
|-------|-----------|---------|
| `historial` | Array JSON de operaciones | `[{operation, input, output, timestamp}]` |
| `decimals` | Número de decimales a mostrar | `6` |
| `theme` | Tema (light/dark) - futuro | `"light"` |

---

## 🧪 Cómo Agregar una Nueva Operación

### Ejemplo: Agregar "Máximo de vector"

1. **En `js/vectors.js`**, agrega la función matemática:
```javascript
function maxVector(v) {
  return Math.max(...v);
}
```

2. **En `js/vectors.js`**, en `initVectorOperations()`, agrega el evento:
```javascript
$('#btn-max')?.addEventListener('click', () => {
  const v = parseVector($('#vecA').value);
  if (!v) {
    alert('Ingresa un vector válido');
    return;
  }
  const res = maxVector(v);
  $('#out-vectores').innerHTML = '<p>' + formatNumber(res) + '</p>';
  logOperation('Máximo', vectorToString(v), formatNumber(res));
});
```

3. **En `index.html`**, agrega el botón en la sección de vectores:
```html
<button id="btn-max">Máximo</button>
```

4. **Listo.** El resto ocurre automáticamente al cargar.

---

## 🐛 Debugging

### Consola del Navegador

Al iniciar, deberías ver:
```
✓ Inicializando aplicación modular...
✓ Aplicación inicializada correctamente
```

Si hay errores:
```
✗ Error fatal: [error message]
```

### Verificar módulos cargados

En consola:
```javascript
console.log(APP_CONFIG)        // Debe mostrar configuración
console.log(APP_STATE)         // Debe mostrar estado
// Funciones deben estar en scope global:
typeof parseVector              // "function"
typeof addVectors               // "function"
typeof showSection              // "function"
```

---

## 📝 Notas Importantes

### ⚠️ NO usar ES6 modules (`import/export`)
Esta arquitectura usa **funciones globales** por simplicidad. NO agregaremos módulos ES6 porque:
- Necesitaría un bundler (webpack/vite)
- Mayor complejidad para el flujo de trabajo
- Los navegadores requieren `type="module"` en HTML

### ✅ Ventajas de esta arquitectura
- ✅ Modular y separada por concerns
- ✅ Fácil de entender y mantener
- ✅ Funciona sin build tools
- ✅ Perfecto para equipo colaborativo
- ✅ Cada módulo tiene responsabilidad clara
- ✅ Fácil de extender

### 🚀 Si en el futuro necesitas ES6 modules
Se puede migrar fácilmente a webpack/vite sin cambiar mucha lógica.

---

## 📖 Para Nuevos Miembros del Equipo

1. **Lee primero:** Este README
2. **Entiende:** El flujo de inicialización (sección "Flujo")
3. **Explora:** Abre DevTools (F12) y ve la consola
4. **Experimenta:** Abre `js/config.js` y cambia `DECIMALS_DEFAULT` a `2`
5. **Agrega:** Tu primera operación siguiendo "Cómo Agregar"

---

## 📞 Contacto / Dudas

Si algún módulo no carga:
1. Verifica orden en `index.html` (debe ser config → utils → vectors → matrices → ui)
2. Abre consola del navegador (F12)
3. Verifica que no haya errores de sintaxis

¡A trabajar en equipo! 🚀
