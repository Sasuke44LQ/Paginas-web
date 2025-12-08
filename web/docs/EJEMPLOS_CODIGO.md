# Ejemplos de Código y Patrones Recomendados

Este archivo contiene fragmentos y patrones que conviene seguir al añadir funcionalidades.

1) Formato de funciones matemáticas (puras)

```javascript
// Buen ejemplo: función pura sin efectos secundarios
function addVectors(v1, v2) {
  if (v1.length !== v2.length) throw new Error('Dimensiones incompatibles');
  return v1.map((val, i) => val + v2[i]);
}
```

2) Manejo de parseo robusto

```javascript
function parseVector(str) {
  if (!str) return null;
  const parts = str.trim().split(/\s*,\s*/);
  const nums = parts.map(p => {
    const n = Number(p.trim());
    if (Number.isNaN(n)) throw new Error('Vector inválido: ' + str);
    return n;
  });
  return nums;
}
```

3) Renderizar matriz en DOM

```javascript
function renderMatrix(container, m) {
  // container es un elemento DOM
  container.innerHTML = '';
  const table = document.createElement('table');
  m.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = formatNumber(cell);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  container.appendChild(table);
}

8) Crear / Leer una grilla de entrada para matrices

```javascript
// Construye una grilla de inputs (container puede ser selector o elemento DOM)
buildMatrixGrid('#matA-grid', 3, 3, 'matA', [[1,2,3],[4,5,6],[7,8,9]]);

// Leer la grilla a una matriz de números (o null si hay celdas inválidas)
const m = readMatrixGrid('#matA-grid');
if (!m) alert('Matrices inválidas en la grilla');

// Poblado desde código, usando setMatrixGridValues
setMatrixGridValues('#matA-grid', [[1,2],[3,4]]);
```
```

4) Guardar en historial (ejemplo de formato)

```javascript
function logOperation(operation, input, output) {
  const hist = getHistory();
  hist.unshift({ operation, input, output, ts: Date.now() });
  localStorage.setItem(APP_CONFIG.HISTORY_KEY, JSON.stringify(hist));
}
```

5) Validaciones recomendadas

- Validar dimensiones antes de operar.
- En matrices, verificar que las filas tengan la misma longitud.
- Lanzar excepciones solo en el core; manejar mensajes de usuario en `ui.js`.

6) Estilos y clases

- Evitar manejo directo de estilos en JS; cambiar clases CSS cuando sea necesario.

7) Migración a módulos ES6 (futuro)

- Si se decide migrar, usar `rollup`, `vite` o `webpack` y convertir archivos a `export function ...`.

---

Mantén este documento actualizado con patrones que el equipo prefiera seguir.
