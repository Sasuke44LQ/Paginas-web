# CHANGES — Resumen de cambios recientes

Este documento recoge los cambios más relevantes hechos en la rama de desarrollo local.

## Fecha
- Actualizado: 2025-12-08

## Cambios principales

- Modularización
  - Se dividió la lógica en módulos sin bundler: `config.js`, `utils.js`, `vectors.js`, `matrices.js`, `exercises.js`, `ui.js`.
  - Orden de carga obligatorio (sin módulos ES): `config.js` → `utils.js` → `vectors.js` → `matrices.js` → `exercises.js` → `ui.js`.

- Interfaz y estilos
  - Añadido soporte de tema oscuro (`.dark`) y variables CSS.
  - Nuevo renderizado de matrices usando tablas (`.matrix-table`) y chips visuales para vectores (`.vector-chip`).
  - Controles para mostrar pasos y contador de pasos.

- Sistema de pasos (pedagogía)
  - Las operaciones generan ahora un array de pasos estructurados: cada paso tiene `detailed`, `concise` y `html`.
  - `utils.js` contiene funciones para almacenar, renderizar y navegar por pasos.
  - Persistencia del modo de pasos (`detailed` / `concise`) en `localStorage`.

- Práctica y comprobación automática
  - Nuevo módulo `exercises.js` que genera ejercicios aleatorios, rellena los `textarea` de entrada y guarda el ejercicio activo en `APP_STATE.currentExercise`.
  - `checkExerciseAnswer()` compara la respuesta del usuario con la solución (acepta vectores y matrices en formatos habituales) y guarda resultados en el historial.
  - UI: sección `Práctica` con botones `#btn-gen-ex`, `#btn-check-answer`, `#btn-show-solution` y `#practice-feedback`.

- Mejoras en el parseo de entrada
  - `parseVector` acepta listas separadas por comas o espacios y tolera corchetes.
  - `parseMatrix` acepta filas separadas por salto de línea o `;`; elementos separados por comas o espacios.
  - Validación básica: mismas longitudes de fila y entradas numéricas.

## Archivos añadidos/actualizados

- Añadido: `web/js/exercises.js` (generación y comprobación de ejercicios).
- Actualizado: `web/js/utils.js` (parseo tolerante, renderizado de matrices como tabla, renderVector mejorado, pasos).
- Actualizado: `web/docs/QUICK_START.md` (instrucciones sobre nuevo formato de entrada y práctica).

## Notas de uso

- Inicia un servidor estático desde la carpeta `web` (por ejemplo, `python -m http.server 8000`) y abre `http://localhost:8000`.
- Para evitar errores por variables/funciones no definidas, respeta el orden de inclusión de scripts indicado arriba.
- Si modificas IDs en `index.html` (por ejemplo `#matA`, `#vecA`, `#btn-gen-ex`), actualiza los selectores en los módulos correspondientes.

## Pendientes / Recomendaciones

- Mejorar tolerancia del parser para soportar formatos mixtos más complejos (p.ej. punto decimal con coma, notación científica localizada).
- Añadir pruebas automatizadas unitarias para parseo y comparación de matrices/vectores.
- Mejorar la representación de pasos largos (colapsables / paginados) y exportación a PDF o impresión.

---

Si necesitas que añada más detalles técnicos o ejemplos concretos en la documentación, dime qué formato prefieres (README, ejemplos paso a paso, GIFs) y lo preparo.