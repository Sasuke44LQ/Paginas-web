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


## Configuración y Modo oscuro

La web incluye ahora un apartado de `Configuración` (icono de engranaje en la cabecera).
- **Tema**: puedes elegir entre `Sistema`, `Claro` u `Oscuro`. La preferencia se guarda en `localStorage` (`system`/`light`/`dark`) y se aplica automáticamente en futuras visitas.
- Para abrir el panel, haz clic en el botón ⚙️ en la esquina superior derecha; para cerrar, usa el botón "Cerrar" o haz clic fuera del cuadro.

