# 👥 Organización del Equipo de Desarrollo

Este documento describe cómo se organiza el trabajo en equipo para mantener el código limpio y evitar conflictos.

## 📋 Responsabilidades por Rol

### Frontend Lead
- **Responsable de:** Estructura HTML, CSS, UI general
- **Archivos:** `index.html`, `styles.css`, `ui.js`
- **Tareas:**
  - Revisión de cambios UI
  - Asegurar consistencia de diseño
  - Coordinación de cambios de layouts

### Backend/Lógica Lead
- **Responsable de:** Operaciones matemáticas, algoritmos
- **Archivos:** `vectorOperations.js`, `matrixOperations.js`, `exercises.js`
- **Tareas:**
  - Validar correctitud de algoritmos
  - Optimización de cálculos
  - Pruebas de casos especiales

### Arquitectura Lead
- **Responsable de:** Estructura general, módulos, config
- **Archivos:** `main.js`, `config.js`, `utils.js`, `stepsManager.js`
- **Tareas:**
  - Mantener modularidad
  - Revisar nuevas características
  - Documentación

---

## 🔀 Flujo de Trabajo Git

### 1. Crear Feature Branch

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear rama de feature
git checkout -b feature/descripcion-corta

# Ejemplo
git checkout -b feature/agregar-producto-cruz
```

### 2. Nombrado de Ramas

Usar prefijo según tipo:
- `feature/` - Nueva característica
- `fix/` - Corrección de bug
- `refactor/` - Mejora de código
- `docs/` - Actualización de documentación
- `test/` - Pruebas

Ejemplos:
```
feature/producto-cruz-vectorial
fix/error-determinante-singular
refactor/separar-validaciones
docs/actualizar-readme
```

### 3. Hacer Commits

Mensaje coherente y descriptivo:

```
[Tipo] Descripción corta

Descripción más detallada si es necesario.
- Cambio 1
- Cambio 2

Cierra: #123 (si está asociado a issue)
```

Tipos:
- `feat:` Nueva feature
- `fix:` Corrección
- `refactor:` Mejora de código
- `docs:` Documentación
- `style:` Formato
- `test:` Pruebas

Ejemplos:
```
feat: agregar operación producto vectorial

- Implementar función crossProduct en vectorOperations.js
- Agregar pasos detallados
- Conectar en UI

docs: actualizar DESARROLLO.md con ejemplo de producto vectorial

fix: corregir error en cálculo de determinante para matrices singulares

- Agregar tolerancia de pivote
- Actualizar mensaje de error
```

### 4. Push y Pull Request

```bash
# Push a la rama
git push origin feature/mi-feature

# Crear PR en GitHub/GitLab
# En la web, crear PR con descripción clara
```

**Descripción de PR:**
```markdown
## Descripción
Agregar operación de producto vectorial para vectores 3D.

## Cambios
- Nueva función `crossProduct()` en `vectorOperations.js`
- Pasos detallados con `stepsCrossProduct()`
- Botón y event listener en UI
- Configuración en `config.js`

## Testing
- ✅ Probado con vectores [1,0,0] × [0,1,0] = [0,0,1]
- ✅ Manejo de error para vectores 2D
- ✅ Tema oscuro/claro funciona

## Checklist
- [x] Código sigue convenciones
- [x] Sin errores en consola
- [x] Comentarios agregados
- [x] DESARROLLO.md actualizado
```

### 5. Review y Merge

- Al menos 1 review requerido
- Reviewer revisa:
  - Lógica correcta
  - Sigue convenciones
  - No introduce bugs
  - Documentación clara
- Si todo está bien: ✅ Approve
- Merge a `main` con "Squash and merge"

---

## 📊 Asignación de Tareas

### Ejemplo: Agregar Resolución por Gauss-Seidel

```
┌─────────────────────────────────────────────────┐
│ Tarea Principal: Agregar Gauss-Seidel          │
├─────────────────────────────────────────────────┤
│                                                 │
│ ├─ [David] Subtarea 1: Algoritmo (3 días)     │
│ │  └─ matrixOperations.js                     │
│ │     - gaussSeidel(A, b, opts)              │
│ │     - stepsGaussSeidel()                   │
│ │     - Tests básicos                        │
│ │                                             │
│ ├─ [María] Subtarea 2: UI (2 días)            │
│ │  └─ Esperar PR de David                     │
│ │     - Botón en index.html                  │
│ │     - Listener en ui.js                    │
│ │     - Validaciones                         │
│ │                                             │
│ └─ [Carlos] Subtarea 3: Testing (1 día)      │
│    └─ Esperar PR de María                     │
│       - Pruebas exhaustivas                  │
│       - Documentación                        │
│       - Update DESARROLLO.md                 │
│                                             │
└─────────────────────────────────────────────────┘

Timeline:
├─ Día 1: David comienza
├─ Día 3: PR David → Review → Merge
├─ Día 3: María comienza
├─ Día 5: PR María → Review → Merge
├─ Día 5: Carlos comienza
└─ Día 6: PR Carlos → Final release
```

### Matriz de Responsabilidades

| Módulo | Responsable | Backup |
|--------|-------------|--------|
| config.js | Carlos | - |
| utils.js | Carlos | David |
| vectorOperations.js | David | Carlos |
| matrixOperations.js | David | Carlos |
| stepsManager.js | María | Carlos |
| exercises.js | María | David |
| ui.js | María | David |
| index.html | María | - |
| styles.css | María | - |
| main.js | Carlos | María |
| DESARROLLO.md | Carlos | - |

---

## 🔄 Requisitos para PR

✅ **Obligatorio:**
- [ ] Rama creada desde `main` actualizado
- [ ] Sigue convenciones de código
- [ ] Al menos 1 review aprobado
- [ ] Sin conflictos de merge
- [ ] Tests pass (si existen)
- [ ] Mensaje de commit claro
- [ ] Sin código comentado
- [ ] Sin console.log de debug

⚠️ **Fuerte Recomendación:**
- [ ] Funciona en Chrome, Firefox, Safari
- [ ] Tema claro y oscuro funcionan
- [ ] Pasos detallados funcionan (si aplica)
- [ ] Historial se guarda correctamente
- [ ] Documentación actualizada
- [ ] Sin warnings en consola

❌ **No permitido:**
- Commits en rama main directamente
- PRs sin descripción
- Merged sin review
- Código duplicado
- Variables sin inicializar
- Operaciones sin validación

---

## 📞 Comunicación

### Canal de Issues
Usar issues de GitHub para:
- Reportar bugs
- Discutir features
- Asignar tareas

### Estructura de Issue

```markdown
## Descripción
Qué es el problema o feature.

## Pasos para Reproducir (si es bug)
1. Hacer esto
2. Luego esto
3. Entonces pasa X

## Comportamiento Esperado
Qué debería pasar.

## Contexto
- Navegador: Chrome 120
- SO: Windows 11
- Otro contexto relevante

## Archivos Afectados
- vectorOperations.js
- ui.js
```

### Reuniones

- **Daily Standup:** 10min, problema/bloqueador del día
- **Weekly Review:** Código, PRs pendientes, roadmap
- **Planning:** Nuevas tareas, estimaciones

---

## 🎓 Onboarding Nuevo Desarrollador

### Día 1
1. Clonar repo
2. Leer `README.md` y `QUICK_REFERENCE.md`
3. Entender estructura con `DESARROLLO.md`
4. Hacer un pequeño cambio (ej: cambiar color de botón)
5. Hacer PR con este cambio
6. Recibir feedback y mergear

### Día 2-3
1. Ver un PR de otro compañero
2. Revisar y comentar
3. Hacer primer feature pequeño
4. Recibir mentoring

### Semana 1
1. Familiarizarse con git workflow
2. Entender módulos principales
3. Hacer bug fix pequeño
4. Hacer feature pequeño

### Semana 2+
- Participar en features medianas
- Hacer reviews de PRs
- Sugerir mejoras
- Mentorear futuros nuevos

---

## 📈 Métricas de Calidad

Se monitoreará:
- **Cobertura de código:** Mínimo 70% funciones documentadas
- **Bugs por release:** Máximo 1 bug crítico por 100 PRs
- **Tiempo de review:** Máximo 24h para PR
- **Tests:** Todos funcionan antes de merge
- **Documentación:** Actualizada para cambios significativos

---

## 🚨 Resolución de Conflictos

Si dos personas editan lo mismo:

```bash
# Actualizar rama local
git fetch origin
git rebase origin/main

# Resolver conflictos
# - Abrir archivos en VS Code
# - Elegir cambios correctos
# - Guardar

git add .
git rebase --continue
git push origin feature/mi-feature --force-with-lease
```

**Evitar conflictos:**
- Comunicarse antes de editar mismo archivo
- Commits pequeños y frecuentes
- Mergear regularmente cambios de main

---

## 💡 Best Practices

1. **Una feature por PR** - Evita PRs gigantes
2. **Commits atómicos** - Cada commit es un cambio completo
3. **Comunicación clara** - Describir bien en commits y PRs
4. **Testing temprano** - Probar mientras se desarrolla
5. **Documentación junto al código** - No dejar para después
6. **Code review constructivo** - Ser respetuoso y sugerente
7. **Entregar valor** - Cada tarea debe ser completable

---

**Última actualización:** Diciembre 2025

Para dudas sobre el proceso, preguntar en el canal de comunicación del equipo. 🚀
