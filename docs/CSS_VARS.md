# Guía rápida: Variables y tokens CSS

Este documento explica cómo está organizada la hoja de estilos y cómo cambiar colores/temas de forma segura.

## ¿Dónde están las variables?

Las variables principales están en `web/styles.css` dentro de `:root` y el tema oscuro bajo la clase `.dark`.

Principales tokens (ejemplo):

- `--bg` : color de fondo de la página
- `--panel-bg` : fondo de tarjetas/paneles
- `--text` : color del texto principal
- `--muted` : color de texto secundario / labels
- `--header-bg` : color del header
- `--accent` : color principal de botones / acciones
- `--card-shadow` : sombra de tarjetas
- `--radius`, `--radius-sm` : radios de borde
- `--transition-fast` : tiempo de transición para temas

## Cómo cambiar el tema

1. Edita los valores en `:root` para cambiar el tema claro.
2. Edita los valores en la regla `.dark` para cambiar el tema oscuro.

Ejemplo: para cambiar el acento global, modifica `--accent` en `:root` y en `.dark`.

## Aplicar tema oscuro automáticamente

Actualmente el tema se aplica cuando el código JS añade la clase `.dark` al `body` o `html`.

Si quieres soporte nativo por preferencia del sistema, puedes añadir en `styles.css`:

```css
@media (prefers-color-scheme: dark) {
  :root { /* valores alternos */ }
}
```

Pero ten en cuenta que la app usa `localStorage` y un toggle en la UI para sobreescribir la preferencia del sistema.

## Ejemplo: cambiar el color del header

En `web/styles.css` busca `--header-bg` y modifica su valor:

```css
:root{ --header-bg: #0b5ed7; }
```

En `.dark` también puedes cambiarlo:

```css
.dark{ --header-bg: #0082fc; }
```

## Recomendaciones de equipo

- Cambia solo tokens; evita modificar reglas concretas (por ejemplo `.buttons button`) salvo que necesites un ajuste global.
- Para componentes reutilizables (botones, badges, cards) añade clases utilitarias en `styles.css` para evitar duplicación.
- Documenta cambios de tokens en `web/docs/README_MODULAR.md` si afectan la identidad visual.

## Ejemplo: Toggle de tema (JS mínimo)

```javascript
// toggleTheme.js (ejemplo)
function toggleTheme(theme) {
  const root = document.documentElement; // o document.body
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem('theme', theme);
}

// al cargar
const saved = localStorage.getItem('theme');
if (saved) toggleTheme(saved);
```

## Preguntas frecuentes

- ¿Puedo añadir más tokens? Sí — sigue el patrón `--token-name` y documenta su uso.
- ¿Debo usar variables en JS? Sí, puedes leer tokens CSS desde JS con `getComputedStyle(document.documentElement).getPropertyValue('--accent')`.

---

Si quieres, puedo:
- Añadir ejemplos concretos de paletas (light/dark) al final del archivo.
- Añadir un pequeño script `toggleTheme.js` en `web/js/` y referenciarlo en `index.html`.
