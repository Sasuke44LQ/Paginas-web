// Archivo eliminado: el contenido fue movido a módulos en `web/js/`.
// Este archivo se ha limpiado como parte de la reorganización del proyecto.
// Si necesitas restaurarlo, encontrarás la lógica activa en:
//   - web/js/config.js
//   - web/js/utils.js
//   - web/js/vectors.js
//   - web/js/matrices.js
//   - web/js/ui.js

// Nota: Eliminar el archivo físicamente es seguro, pero por precaución
// este placeholder permanece. Puedes borrarlo manualmente si prefieres.
  if (btnPractice) {
    btnPractice.addEventListener('click', () => showSection('sect-practice'));
  }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

function init() {
  console.log('Inicializando aplicación...');
  
  try {
    initNavigation();
    console.log('✓ Navegación OK');
    
    initVectorOperations();
    console.log('✓ Operaciones con vectores OK');
    
    initMatrixOperations();
    console.log('✓ Operaciones con matrices OK');
    
    initHistory();
    console.log('✓ Historial OK');
    
    showSection('sect-vectores');
    console.log('✓ Sección inicial OK');
    
    console.log('✅ Aplicación lista');
  } catch (e) {
    console.error('❌ Error durante inicialización:', e);
  }
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
