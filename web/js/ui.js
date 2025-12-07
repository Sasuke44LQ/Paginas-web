/**
 * js/ui.js - Interfaz de usuario e inicialización
 *
 * Responsabilidades:
 * - Inicializar todo (main init function)
 * - Manejar navegación entre secciones
 * - Manejar historial
 * - Error handling
 */

// ============ NAVEGACIÓN ============

function showSection(sectionId) {
  // Ocultar todas las secciones
  document.querySelectorAll('.panel').forEach(section => {
    section.style.display = 'none';
    section.classList.remove('active');
  });

  // Mostrar la sección solicitada
  const section = $(`#${sectionId}`);
  if (section) {
    section.style.display = 'block';
    section.classList.add('active');
  }
}

// ============ INICIALIZACIÓN DE NAVEGACIÓN ============

function initNavigation() {
  try {
    $('#btn-vectores')?.addEventListener('click', () => {
      showSection('sect-vectores');
    });

    $('#btn-matrices')?.addEventListener('click', () => {
      showSection('sect-matrices');
    });

    $('#btn-historial')?.addEventListener('click', () => {
      showSection('sect-historial');
      fillHistory();
    });

    // Mostrar la primera sección por defecto
    showSection('sect-vectores');

  } catch (error) {
    console.error('Error inicializando navegación:', error);
  }
}

// ============ INICIALIZACIÓN DE HISTORIAL ============

function initHistory() {
  try {
    // Botón refrescar
    $('#btn-refresh')?.addEventListener('click', () => {
      fillHistory();
    });

    // Botón limpiar historial
    $('#btn-clear')?.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas limpiar el historial?')) {
        clearHistory();
        fillHistory();
      }
    });

    // Exportar historial (.jsonl)
    $('#btn-export')?.addEventListener('click', () => {
      const hist = getHistory();
      if (!hist || hist.length === 0) {
        alert('No hay entradas para exportar');
        return;
      }
      const blob = new Blob(hist.map(h => JSON.stringify(h) + '\n'), { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'historial.jsonl';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    // Importar archivo
    $('#file-import')?.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const lines = reader.result.split(/\r?\n/).filter(l => l.trim());
          const parsed = lines.map(l => JSON.parse(l));
          localStorage.setItem(APP_CONFIG.HISTORY_KEY, JSON.stringify(parsed));
          fillHistory();
          alert('Historial importado correctamente');
        } catch (err) {
          alert('Error importando archivo: ' + err.message);
        }
      };
      reader.readAsText(f);
    });

    // Filtrado y búsqueda
    $('#hist-tipo-filter')?.addEventListener('change', fillHistory);
    $('#hist-search')?.addEventListener('input', fillHistory);

    // Decimales control
    const decInput = $('#decimals');
    if (decInput) {
      decInput.value = getDecimals();
      decInput.addEventListener('change', (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 12) {
          setDecimals(value);
          fillHistory();
        }
      });
    }

  } catch (error) {
    console.error('Error inicializando historial:', error);
  }
}

function fillHistory() {
  // Llenar la tabla de historial
  const tbody = $('#hist-tbody');
  if (!tbody) return;
  
  clearNode(tbody);
  const history = getHistory();
  // aplicar filtros
  const tipoFilter = ($('#hist-tipo-filter') && $('#hist-tipo-filter').value) || '';
  const q = ($('#hist-search') && $('#hist-search').value || '').toLowerCase();

  const rows = history.filter(h => {
    if (tipoFilter && h.type && h.type !== tipoFilter) return false;
    const text = JSON.stringify(h).toLowerCase();
    if (q && !text.includes(q)) return false;
    return true;
  });

  if (rows.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.textContent = 'No hay operaciones registradas';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.reverse().forEach(entry => {
    const tr = document.createElement('tr');
    const tdTime = document.createElement('td');
    tdTime.textContent = entry.timestamp || '';
    const tdType = document.createElement('td');
    tdType.textContent = entry.type || entry.tipo || '';
    const tdIn = document.createElement('td');
    tdIn.textContent = entry.input || entry.operandos || '';
    const tdOut = document.createElement('td');
    tdOut.textContent = entry.output || entry.resultado || '';
    tr.appendChild(tdTime);
    tr.appendChild(tdType);
    tr.appendChild(tdIn);
    tr.appendChild(tdOut);
    tbody.appendChild(tr);
  });
}

// ============ PANEL DE CONFIGURACIÓN (THEME) ============

function applyTheme(theme) {
  document.body.classList.remove('dark');
  if (theme === 'dark') document.body.classList.add('dark');
  localStorage.setItem(APP_CONFIG.THEME_KEY, theme);
}

function loadTheme() {
  const t = localStorage.getItem(APP_CONFIG.THEME_KEY) || 'system';
  if (t === 'dark') applyTheme('dark');
  else if (t === 'light') applyTheme('light');
  else {
    // system - try to match prefers-color-scheme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function initSettingsPanel() {
  // Abrir/cerrar panel
  $('#btn-settings')?.addEventListener('click', () => {
    const panel = $('#settings-panel');
    if (panel) panel.classList.remove('hidden');
  });
  $('#settings-close')?.addEventListener('click', () => {
    const panel = $('#settings-panel');
    if (panel) panel.classList.add('hidden');
  });

  // Radio buttons tema
  document.querySelectorAll('input[name="theme"]').forEach(r => {
    r.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  });

  // Inicializar valor de decimales en settings
  const di = $('#decimals');
  if (di) di.value = getDecimals();
}

// ============ FUNCIÓN DE INICIALIZACIÓN PRINCIPAL ============

function init() {
  try {
    console.log('✓ Inicializando aplicación modular...');

    // Inicializar navegación
    initNavigation();

    // Inicializar operaciones de vectores
    initVectorOperations();

    // Inicializar operaciones de matrices
    initMatrixOperations();

    // Inicializar historial
    initHistory();

    // Inicializar settings (tema)
    initSettingsPanel();
    loadTheme();

    console.log('✓ Aplicación inicializada correctamente');

  } catch (error) {
    console.error('✗ Error fatal:', error);
    alert('Error al inicializar la aplicación. Revisa la consola.');
  }
}

// ============ EJECUTAR CUANDO EL DOM ESTÉ LISTO ============

document.addEventListener('DOMContentLoaded', init);
