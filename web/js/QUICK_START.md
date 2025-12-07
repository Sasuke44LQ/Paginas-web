
Nota: este archivo fue movido a `../docs/QUICK_START.md`.

Consulta `web/docs/QUICK_START.md` para la guía completa de arranque rápido.

### Inputs/Outputs
```
#vecA, #vecB        ← Inputs de vector
#matA, #matB        ← Inputs de matriz
#out-vectores       ← Output de operación
#out-matrices       ← Output de operación
```

### Funciones
```
parseVector()       ← Parsing
formatNumber()      ← Formateo
validateVectors()   ← Validación
addVectors()        ← Operación
initVectorOps()     ← Inicialización UI
```

---

## 🔟 Errores Comunes

### ❌ No funciona el botón
- ¿El ID en HTML es `#btn-id`?
- ¿El selector en JS es `$('#btn-id')`?
- ¿El script cargó sin errores? (Abre F12)

### ❌ Undefined is not a function
- ¿Cargaron todos los módulos? (Verifica orden en `index.html`)
- ¿La función está en el scope global?

### ❌ Resultado incorrecto
- ¿Parseaste correctamente la entrada?
- ¿La validación pasó?
- ¿Probaste la función en consola?

---

## 📚 Recursos

- **Documentación detallada:** `js/README_MODULAR.md`
- **HTML estructura:** `index.html`
- **Estilos:** `styles.css`
- **Referencia app.js:** `app.js` (legacy, para entender la lógica)

---

## 💡 Pro Tips

1. **Usa DevTools mientras desarrollas** (F12)
2. **Agrupa funciones relacionadas** en el mismo módulo
3. **Reutiliza funciones de utils.js** - no reinventes la rueda
4. **Prueba incremental** - agrega poco, prueba, luego agrega más
5. **Usa nombres descriptivos** - `btn-sumar` es mejor que `btn-op1`

---

¡A codificar! 🎉
