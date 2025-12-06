# 🧪 Guía de Testing - Verificar Funcionalidad

Este documento describe cómo testear manualmente que la refactorización no ha roto nada.

## 🚀 Preparación

### 1. Servir la aplicación
```bash
cd web/
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx http-server

# Abrir navegador
http://localhost:8000
```

### 2. Abrir consola de desarrollador
```
F12 o Ctrl+Shift+I
```

---

## ✅ Checklist de Funcionalidad

### 1. Carga y Estructura (5 min)

- [ ] La página carga sin errores
- [ ] No hay errores en la consola
- [ ] Estructura HTML visible
- [ ] Estilos CSS aplicados correctamente
- [ ] Tema claro aplica por defecto

**Verificar en consola:**
```javascript
// Debería estar la aplicación cargada
document.body.dataset.app  // "matrices-vectores-calculator"
```

### 2. Navegación (5 min)

- [ ] Click en "Vectores" → muestra sección vectores
- [ ] Click en "Matrices" → muestra sección matrices
- [ ] Click en "Práctica" → muestra sección práctica
- [ ] Click en "Historial" → muestra sección historial
- [ ] Click en ⚙️ → abre panel de configuración
- [ ] Todas las secciones se ocultan/muestran correctamente

### 3. Operaciones con Vectores (10 min)

Entrada de prueba: `A = [1,2,3]` y `B = [4,5,6]`

- [ ] **Suma:** A + B = `[5, 7, 9]` ✅
- [ ] **Resta:** A - B = `[-3, -3, -3]` ✅
- [ ] **Producto punto:** A · B = `32` ✅
- [ ] **Escalar:** [1,2,3] * 2 = `[2, 4, 6]` ✅
- [ ] **Norma:** ||[3,4]|| = `5` ✅

**Verificar en consola:**
```javascript
import * as v from './js/vectorOperations.js';
v.addVectors([1,2,3], [4,5,6])      // [5, 7, 9]
v.dotProduct([1,2,3], [4,5,6])      // 32
v.norm([3,4])                        // 5
```

### 4. Operaciones con Matrices (10 min)

Entrada de prueba: `A = [[1,2],[3,4]]` y `B = [[5,6],[7,8]]`

Formato: `1,2;3,4`

- [ ] **Suma:** A + B = resultado correcto ✅
- [ ] **Multiplicación:** A * B = `[[19,22],[43,50]]` ✅
- [ ] **Transposición:** T(A) = `[[1,3],[2,4]]` ✅
- [ ] **Determinante:** det([[1,2],[3,4]]) = `-2` ✅

**Verificar en consola:**
```javascript
import * as m from './js/matrixOperations.js';
m.multiplyMatrices([[1,2],[3,4]], [[5,6],[7,8]])
// [[19, 22], [43, 50]]

m.transpose([[1,2],[3,4]])
// [[1, 3], [2, 4]]

m.determinant([[1,2],[3,4]])
// -2
```

### 5. Pasos Detallados (5 min)

- [ ] Marcar "Mostrar pasos" en vectores
- [ ] Hacer suma de vectores
- [ ] Verificar que aparecen pasos
- [ ] Botón "Anterior" funciona
- [ ] Botón "Siguiente" funciona
- [ ] Botón "Mostrar todo" expande todos
- [ ] Botón "Imprimir pasos" abre ventana (probar cancel)

### 6. Visualizador (5 min)

En sección Vectores:
- [ ] Ingresa A = [1,0,0] y B = [0,1,0]
- [ ] Click "Dibujar"
- [ ] Aparecen dos flechas (azul y celeste)
- [ ] Radio 2D: muestra en 2D
- [ ] Radio 3D: muestra en 3D
- [ ] Sliders Rot X/Y: rotación funciona
- [ ] Slider Zoom: zoom funciona

### 7. Configuración (5 min)

- [ ] Click en ⚙️ abre panel
- [ ] **Tema:** 
  - Selecciona "Oscuro" → aplica tema oscuro
  - Selecciona "Claro" → aplica tema claro
  - Selecciona "Sistema" → sigue sistema
- [ ] **Decimales:**
  - Cambia a 2 → resultados muestran 2 decimales
  - Cambia a 10 → resultados muestran 10 decimales
- [ ] Click fuera del panel → se cierra

### 8. Historial (5 min)

- [ ] Hacer una operación (ej: suma vectores)
- [ ] Click en "Historial"
- [ ] Aparece entrada en la tabla
- [ ] Click "Actualizar" → refresca
- [ ] Click "Exportar" → descarga archivo JSON
- [ ] Archivo descargado es válido

### 9. Ejercicios (5 min)

- [ ] Selecciona "Suma de Vectores"
- [ ] Click "Generar"
- [ ] Aparece ejercicio
- [ ] Ingresa respuesta
- [ ] Click "Comprobar"
- [ ] Mensaje "Correcto" si es correcto
- [ ] Mensaje "Incorrecto" si es incorrecto

### 10. Previsualizaciones (5 min)

- [ ] Ingresa vector A: `1,2,3`
- [ ] Debajo aparece preview con chips
- [ ] Ingresa matriz A: `1,2;3,4`
- [ ] Debajo aparece tabla
- [ ] Al cambiar valor, preview se actualiza

### 11. Resolución de Sistemas (5 min)

Sistema simple: A = [[2,1],[1,2]], b = [3,3]

- [ ] Click "Resolver (Gauss)"
- [ ] Solución: x ≈ [1, 1]
- [ ] Verificar: 2*1 + 1*1 = 3 ✅, 1*1 + 2*1 = 3 ✅

### 12. Jacobi Iterativo (5 min)

Mismo sistema que arriba:

- [ ] Click "Resolver (Jacobi)"
- [ ] Muestra solución y número de iteraciones
- [ ] Converged: true/false

---

## 🔧 Tests en Consola

### Tests Rápidos

```javascript
// Vectores
import * as v from './js/vectorOperations.js';
console.assert(JSON.stringify(v.addVectors([1,2], [3,4])) === JSON.stringify([4,6]));
console.assert(v.dotProduct([1,2,3], [4,5,6]) === 32);
console.assert(v.norm([3,4]) === 5);

// Matrices
import * as m from './js/matrixOperations.js';
console.assert(m.determinant([[1,2],[3,4]]) === -2);

// Utils
import { parseVector, parseMatrix } from './js/utils.js';
console.assert(JSON.stringify(parseVector('1,2,3')) === JSON.stringify([1,2,3]));
console.assert(parseMatrix('1,2;3,4').length === 2);

console.log('✅ Todos los tests pasaron');
```

---

## 📊 Testing de Rendimiento

### Operaciones Grandes

```javascript
import * as m from './js/matrixOperations.js';

// Matrices 100x100
const A = Array(100).fill().map(() => Array(100).fill(Math.random()));
const B = Array(100).fill().map(() => Array(100).fill(Math.random()));

console.time('Multiplicación 100x100');
m.multiplyMatrices(A, B);
console.timeEnd('Multiplicación 100x100');

// Debería tomar < 100ms
```

---

## 🌍 Testing Cross-Browser

Verificar en cada navegador:

### Chrome
- [ ] Carga correctamente
- [ ] Temas funcionan
- [ ] Operaciones correctas

### Firefox
- [ ] Carga correctamente
- [ ] Estilos aplican
- [ ] Sin warnings

### Safari
- [ ] Funcionalidad completa
- [ ] Tema oscuro funciona

---

## 🐛 Debugging

### Si hay errores en consola

```javascript
// Ver si los módulos cargan
import Config from './js/config.js';
console.log('Config:', Config);

// Ver si las funciones están disponibles
import * as vectorOps from './js/vectorOperations.js';
console.log('Vector operations:', vectorOps);

// Ver historial
import { getHistory } from './js/utils.js';
console.log('History:', getHistory());
```

### Si falta función

```javascript
// Búsqueda en todos los módulos
for (const mod of ['config', 'utils', 'vectorOperations', 'matrixOperations', 'stepsManager', 'exercises', 'ui', 'main']) {
  import(`./js/${mod}.js`).then(m => {
    if ('miFunction' in m) console.log(`Encontrada en ${mod}.js`);
  });
}
```

---

## ✅ Checklist Final

Antes de considerar todo completo:

- [ ] Todas las operaciones funcionan
- [ ] Pasos detallados funcionan
- [ ] Visualizador funciona
- [ ] Historial se guarda
- [ ] Temas cambian correctamente
- [ ] Configuración de decimales funciona
- [ ] Ejercicios generan y califican
- [ ] Importación/exportación funciona
- [ ] Sin errores en consola
- [ ] Funciona en múltiples navegadores

---

## 📝 Reporte de Testing

Si encuentras problemas, reportar:

```
## Problema
[Descripción clara]

## Pasos para Reproducir
1. Hacer esto
2. Luego esto
3. Ocurre error X

## Resultado Esperado
[Lo que debería pasar]

## Resultado Actual
[Lo que pasó]

## Entorno
- Navegador: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Consola: [Error específico si hay]

## Archivos Afectados
- [Module 1]
- [Module 2]
```

---

## 🎓 Técnicas de Testing

### Testear Lógica Aislada
```javascript
// Sin UI, solo lógica
import * as m from './js/matrixOperations.js';
const result = m.addMatrices([[1,2]], [[3,4]]);
console.log(result);  // [[4, 6]]
```

### Testear UI
```javascript
// Ver si elemento existe
const btn = document.getElementById('btn-sumar');
console.log(btn);  // HTMLElement

// Simular click
btn.click();

// Ver resultado
console.log(document.getElementById('out-vectores').textContent);
```

### Testear Storage
```javascript
// Verificar que se guarda
localStorage.setItem('test', 'value');
console.log(localStorage.getItem('test'));  // 'value'

// Limpiar después
localStorage.removeItem('test');
```

---

**Última actualización:** Diciembre 2025

¿Algo no funciona? Consulta el troubleshooting en DESARROLLO.md 🔧
