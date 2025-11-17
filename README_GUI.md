Historial GUI - Instrucciones

Este repositorio incluye:
- `HistorialGUI.cpp`: pequeña aplicación Win32 que muestra `historial.log` en una ventana con ListBox.

Requisitos
- Windows (el código usa la API Win32).
- Compilador: MinGW (g++) o MSVC.

Compilar con MinGW (PowerShell):

```powershell
# Compilar con g++ (MinGW). Asegúrate de usar el comando correcto a tu instalación.
# Ejemplo (MinGW-w64):
g++ -static -municode -O2 "HistorialGUI.cpp" -o "HistorialGUI.exe" -mwindows

# Ejecutar
.\HistorialGUI.exe
```

Compilar con MSVC (Developer Command Prompt):

```cmd
cl /EHsc /W4 HistorialGUI.cpp user32.lib gdi32.lib
```

Uso
- Ejecuta primero tu programa `Vectores.exe` para que genere/actualice `historial.log`.
- Ejecuta `HistorialGUI.exe` para ver el historial.
- Usa el botón "Actualizar" para recargar el archivo.
- "Limpiar historial" trunca `historial.log`.

Notas
- El GUI muestra cada línea tal como está en `historial.log` (actualmente JSON por línea).
- Si quieres parsear y mostrar campos separados (timestamp, tipo, entradas, resultado), puedo actualizar la ventana para parsear JSON simple.
