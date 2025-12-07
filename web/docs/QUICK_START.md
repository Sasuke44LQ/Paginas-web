# Quick Start — Proyecto Calculadora (Modular)

Rápida guía para poner en marcha el proyecto en desarrollo local.

Requisitos:
- Navegador moderno (Chrome/Edge/Firefox)
- Python 3 (opcional, para servidor local) o cualquier servidor estático

Pasos:

1. Clonar / Abrir el repositorio

2. Iniciar servidor local desde la carpeta `web` (ejemplo con Python 3):

PowerShell (Windows):

```powershell
cd path\to\repo\web; python -m http.server 8000
```

Abre en tu navegador:

```
http://localhost:8000
```

3. Estructura de archivos importantes

```
web/
  index.html        # Página principal (carga scripts en orden)
  styles.css        # Estilos globales
  js/
    config.js       # Constantes y estado global
    utils.js        # Utilidades (parseo, render, localStorage)
    vectors.js      # Operaciones de vectores + handlers
    matrices.js     # Operaciones de matrices + handlers
    ui.js           # Inicialización, navegación, historial
  docs/             # Documentación (mover a raíz si se desea)
```

4. Correr la app y probar

- Abre la URL en el navegador y prueba operaciones simples:
  - Vectores: `#vecA`, `#vecB` y botones `#btn-sumar`, `#btn-restar`...
  - Matrices: `#matA`, `#matB` y botones `#btn-m-sum`, `#btn-m-mul`...

5. Hacer cambios

- Edita los módulos en `js/`.
- No uses `import/export` ni `type="module"` sin migrar todo el proyecto a bundler.

6. Guardar historial

- Las operaciones se guardan en `localStorage` bajo la clave `historial`.

7. Buenas prácticas

- Mantén funciones puras en `vectors.js` y `matrices.js`.
- Toda manipulación del DOM debe centralizarse (preferiblemente en `ui.js` o `utils.js`).

8. Si necesitas ayuda

- Busca en `web/docs/README_MODULAR.md` para entender la arquitectura.

