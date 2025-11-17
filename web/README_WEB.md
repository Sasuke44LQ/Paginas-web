# Web UI para Matrices & Vectores

Esta carpeta contiene una interfaz web ligera que replica las operaciones principales de los programas C++ del repo.

Archivos:
- `index.html` : interfaz y formularios.
- `app.js` : lógica en JavaScript (operaciones, solvers, historial).
- `styles.css` : estilos.

Características:
- Operaciones con vectores: suma, resta, producto punto, multiplicación por escalar y norma.
- Operaciones con matrices: suma, multiplicación, transposición y resolución de sistemas por Eliminación Gauss y Jacobi.
- Historial guardado en `localStorage` como array JSON; permite exportar a `.jsonl` y importar JSON/JSONL para compatibilidad con `historial.log` del proyecto C++.

Cómo usar:
1. Abrir `web/index.html` en un navegador moderno (no requiere servidor). Si quieres usar desde archivos locales en Chrome, habilita carga local o usa un servidor simple:

   PowerShell (servidor simple):

```powershell
# desde la carpeta web
python -m http.server 8000
# o con PowerShell 5.1 si no tienes python, puedes usar PowerShell web server rápido:
# Start-Process "powershell" -ArgumentList "-NoExit -Command \"cd .; python -m http.server 8000\""
```

2. Navega a `http://localhost:8000` y usa las pestañas para elegir Vectores, Matrices o Historial.

Integración con `historial.log` (C++):
- Exporta el historial desde la web con el botón `Exportar` (genera `historial.jsonl`). Puedes renombrarlo a `historial.log` o concatenarlo con el `historial.log` del proyecto para centralizar.
- Para importar el `historial.log` existente, usa el control `file import` en la pestaña Historial.

Notas técnicas:
- La implementación prioriza simplicidad y compatibilidad (cliente puro, sin servidor).
- Si quieres persistencia central en disco o integración directa con los ejecutables C++, necesitarás un servidor (por ejemplo Node.js o un pequeño servicio Python) que reciba POST y escriba en `historial.log`. Puedo añadirlo si lo deseas.

Si quieres, implemento:
- Parseo más rico en la UI (mostrar campos separados) o
- Un pequeño servidor Node.js para almacenar el historial en `historial.log` del repo.
