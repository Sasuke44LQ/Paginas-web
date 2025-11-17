// Lógica principal de la web: operaciones y historial
(function(){
  // --- Utilidades ---
  function now(){ return new Date().toISOString(); }
  function parseVector(str){
    if(!str) return [];
    return str.split(',').map(s=>parseFloat(s.trim())).filter(x=>!Number.isNaN(x));
  }
  function getDecimals(){ const d = parseInt(localStorage.getItem('decimals')); return Number.isNaN(d)? 6 : d; }
  function fmt(x){ if(x===null||x===undefined||Number.isNaN(+x)) return String(x); return Number(x).toFixed(getDecimals()); }
  function vecToStr(v){ return '['+v.map(x=>fmt(x)).join(', ')+']'; }

  function parseMatrix(str){
    // filas separadas por ;, elementos por ,
    if(!str) return [];
    return str.split(';').map(r => parseVector(r));
  }
  function matToStr(M){ return '['+M.map(r=>'['+r.map(x=>fmt(x)).join(', ')+']').join(',\n ')+']'; }

  function logOperacion(tipo, entradas, resultado){
    const item = {timestamp: now(), tipo, entradas, resultado};
    const hist = JSON.parse(localStorage.getItem('historial') || '[]');
    hist.push(item);
    localStorage.setItem('historial', JSON.stringify(hist));
    return item;
  }

  // --- Render helpers (visual) ---
  function clearNode(n){ while(n && n.firstChild) n.removeChild(n.firstChild); }
  function renderVector(container, v){
    if(!container) return;
    clearNode(container);
    if(!v || v.length===0){ container.textContent = '(vacío)'; return; }
    v.forEach(x=>{
      const span = document.createElement('span'); span.className='vector-chip'; span.textContent = fmt(x); container.appendChild(span);
    });
  }

  function renderMatrix(container, M){
    if(!container) return;
    clearNode(container);
    if(!M || M.length===0){ container.textContent='(vacío)'; return; }
    const table = document.createElement('table'); table.className='matrix-table';
    for(let i=0;i<M.length;i++){
      const tr = document.createElement('tr');
      for(let j=0;j<(M[i]||[]).length;j++){
        const td = document.createElement('td'); td.textContent = fmt(M[i][j]); tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  }

  function renderScalar(container, k){ if(!container) return; container.textContent = isNaN(k)? '(no válido)': fmt(k); }

  // --- Steps generators and renderer ---
  function renderSteps(container, steps){
    if(!container) return; clearNode(container);
    if(!steps || steps.length===0){ container.textContent='(sin pasos)'; return; }
    const ol = document.createElement('ol');
    steps.forEach(s => {
      const li = document.createElement('li'); li.className='step-item';
      if(typeof s === 'string') li.textContent = s;
      else li.appendChild(s);
      ol.appendChild(li);
    });
    container.appendChild(ol);
  }

  // Interactive steps state and helpers
  const stepsState = {
    vectores: { steps: [], idx: 0, showAll: false },
    matrices: { steps: [], idx: 0, showAll: false }
  };

  function renderCurrentStep(section){
    const st = stepsState[section];
    const container = $( 'steps-' + section );
    const controls = $( 'step-controls-' + section );
    const counter = $( 'step-counter-' + section );
    if(!container) return;
    clearNode(container);
    if(!st.steps || st.steps.length===0){ container.textContent='(sin pasos)'; if(controls) controls.style.display='none'; if(counter) counter.textContent=''; return; }
    if(st.showAll){ renderSteps(container, st.steps); if(controls) controls.style.display='flex'; if(counter) counter.textContent='Mostrando todos los pasos'; return; }
    // show single step
    const idx = Math.max(0, Math.min(st.idx, st.steps.length-1));
    const div = document.createElement('div'); div.className='step-item'; div.textContent = st.steps[idx]; container.appendChild(div);
    if(controls) controls.style.display='flex'; if(counter) counter.textContent = 'Paso '+(idx+1)+' / '+st.steps.length;
  }

  function enterStepsMode(section, stepsArray){
    const st = stepsState[section]; st.steps = stepsArray || []; st.idx = 0; st.showAll = false; renderCurrentStep(section);
  }

  function stepNext(section){ const st=stepsState[section]; if(!st.steps || st.steps.length===0) return; st.idx = Math.min(st.idx+1, st.steps.length-1); renderCurrentStep(section); }
  function stepPrev(section){ const st=stepsState[section]; if(!st.steps || st.steps.length===0) return; st.idx = Math.max(st.idx-1, 0); renderCurrentStep(section); }
  function stepToggleAll(section){ const st=stepsState[section]; st.showAll = !st.showAll; renderCurrentStep(section); }

  // Wire controls for steps (prev/next/show-all)
  const wireStepControls = ()=>{
    const mappings = [ ['vectores','prev-step-vectores','next-step-vectores','show-all-steps-vectores'], ['matrices','prev-step-matrices','next-step-matrices','show-all-steps-matrices'] ];
    mappings.forEach(([section,prevId,nextId,allId])=>{
      const prev = $(prevId), next = $(nextId), all = $(allId), showCb = $('show-steps-'+section);
      if(prev) prev.addEventListener('click', ()=> stepPrev(section));
      if(next) next.addEventListener('click', ()=> stepNext(section));
      if(all) all.addEventListener('click', ()=> { stepToggleAll(section); all.textContent = stepsState[section].showAll? 'Ocultar todo':'Mostrar todo'; });
      if(showCb) showCb.addEventListener('change', ()=>{ const stepsContainer = $('steps-'+section); if(showCb.checked){ renderCurrentStep(section); } else { if(stepsContainer) clearNode(stepsContainer); const controls = $('step-controls-'+section); if(controls) controls.style.display='none'; } });
    });
  };

  // Previews refresh (used when decimals change or inputs change)
  function refreshPreviews(){
    const pA=$('preview-vecA'), pB=$('preview-vecB'), pe=$('preview-escalar');
    if(pA) renderVector(pA, parseVector($('vecA').value));
    if(pB) renderVector(pB, parseVector($('vecB').value));
    if(pe) renderScalar(pe, parseFloat($('escalar').value) );
    const pmA=$('preview-matA'), pmB=$('preview-matB'), pvb=$('preview-vecBmat');
    if(pmA) renderMatrix(pmA, parseMatrix($('matA').value));
    if(pmB) renderMatrix(pmB, parseMatrix($('matB').value));
    if(pvb) renderVector(pvb, parseVector($('vecBmat').value));
  }

  function steps_vector_sum(A,B){
    const steps=[];
    steps.push('Vector A = '+vecToStr(A));
    steps.push('Vector B = '+vecToStr(B));
    const res = [];
    for(let i=0;i<A.length;i++){
      const a=A[i], b=B[i], r=a+b; res.push(r);
      steps.push(`Paso ${i+1}: ${fmt(a)} + ${fmt(b)} = ${fmt(r)}`);
    }
    steps.push('Resultado = '+vecToStr(res));
    return steps;
  }

  function steps_vector_sub(A,B){
    const steps=[];
    steps.push('Vector A = '+vecToStr(A));
    steps.push('Vector B = '+vecToStr(B));
    const res=[];
    for(let i=0;i<A.length;i++){ const r=A[i]-B[i]; res.push(r); steps.push(`Paso ${i+1}: ${fmt(A[i])} - ${fmt(B[i])} = ${fmt(r)}`); }
    steps.push('Resultado = '+vecToStr(res));
    return steps;
  }

  function steps_scalar_mul(A,k){
    const steps=[]; steps.push('Vector A = '+vecToStr(A)); steps.push('Escalar k = '+fmt(k));
    const res=[]; for(let i=0;i<A.length;i++){ const r=A[i]*k; res.push(r); steps.push(`Paso ${i+1}: ${fmt(A[i])} * ${fmt(k)} = ${fmt(r)}`); }
    steps.push('Resultado = '+vecToStr(res)); return steps;
  }

  function steps_dot(A,B){
    const steps=[]; steps.push('Vector A = '+vecToStr(A)); steps.push('Vector B = '+vecToStr(B));
    let parts=[]; let sum=0; for(let i=0;i<A.length;i++){ const p=A[i]*B[i]; parts.push(`${fmt(A[i])}*${fmt(B[i])}=${fmt(p)}`); sum+=p; }
    steps.push('Multiplicaciones: '+parts.join(' , ')); steps.push('Suma de productos = '+fmt(sum)); return steps;
  }

  function steps_norm(A){
    const steps=[]; steps.push('Vector A = '+vecToStr(A)); const parts=[]; let s=0; for(let i=0;i<A.length;i++){ const p=A[i]*A[i]; parts.push(`${fmt(A[i])}^2=${fmt(p)}`); s+=p; }
    steps.push('Cuadrados: '+parts.join(' , ')); steps.push('Suma = '+fmt(s)); steps.push('Norma = sqrt('+fmt(s)+') = '+fmt(Math.sqrt(s))); return steps;
  }

  function steps_matrix_sum(A,B){
    const steps=[]; steps.push('Matriz A = '+matToStr(A)); steps.push('Matriz B = '+matToStr(B));
    const C = A.map((r,i)=>r.map((v,j)=>v+B[i][j]));
    for(let i=0;i<C.length;i++) for(let j=0;j<(C[i]||[]).length;j++) steps.push(`c[${i+1},${j+1}] = ${fmt(A[i][j])} + ${fmt(B[i][j])} = ${fmt(C[i][j])}`);
    steps.push('Resultado = '+matToStr(C)); return steps;
  }

  function steps_matrix_mul(A,B){
    const steps=[]; steps.push('Matriz A = '+matToStr(A)); steps.push('Matriz B = '+matToStr(B));
    const n=A.length,m=B[0].length,p=A[0].length;
    for(let i=0;i<n;i++){
      for(let j=0;j<m;j++){
        const prods=[]; let sum=0; for(let k=0;k<p;k++){ const pr=A[i][k]*B[k][j]; prods.push(`${fmt(A[i][k])}*${fmt(B[k][j])}=${fmt(pr)}`); sum+=pr; }
        steps.push(`c[${i+1},${j+1}] = ${prods.join(' + ')} = ${fmt(sum)}`);
      }
    }
    const C = multiplicarMatrices(A,B);
    steps.push('Resultado = '+matToStr(C)); return steps;
  }

  function steps_transpose(A){
    const steps=[]; steps.push('Matriz A = '+matToStr(A)); const T = transponer(A);
    for(let i=0;i<T.length;i++) for(let j=0;j<(T[i]||[]).length;j++) steps.push(`t[${i+1},${j+1}] = a[${j+1},${i+1}] = ${fmt(T[i][j])}`);
    steps.push('Resultado = '+matToStr(T)); return steps;
  }

  function gaussSolveWithSteps(Ain,bin){
    const steps=[];
    const n = Ain.length;
    const A = Ain.map(r=>r.slice());
    const b = bin.slice();
    steps.push('Sistema inicial: A = '+matToStr(A)+' , b = '+vecToStr(b));
    for(let i=0;i<n;i++){
      // pivote parcial
      let maxRow=i; for(let k=i+1;k<n;k++) if(Math.abs(A[k][i])>Math.abs(A[maxRow][i])) maxRow=k;
      if(maxRow!==i){ steps.push(`Swap fila ${i+1} con fila ${maxRow+1}`); [A[i],A[maxRow]]=[A[maxRow],A[i]]; [b[i],b[maxRow]]=[b[maxRow],b[i]]; steps.push('A = '+matToStr(A)+' , b = '+vecToStr(b)); }
      if(Math.abs(A[i][i])<1e-12) throw 'Matriz singular o sistema mal condicionado (pivote cero)';
      for(let k=i+1;k<n;k++){
        const c = A[k][i]/A[i][i];
        steps.push(`Eliminar fila ${k+1} usando fila ${i+1} (factor ${fmt(c)})`);
        for(let j=i;j<n;j++) A[k][j]-=c*A[i][j];
        b[k]-=c*b[i];
        steps.push('Paso intermedio A = '+matToStr(A)+' , b = '+vecToStr(b));
      }
    }
    steps.push('Triangular superior alcanzada: A = '+matToStr(A)+' , b = '+vecToStr(b));
    const x=Array(n).fill(0);
    for(let i=n-1;i>=0;i--){ let s=b[i]; for(let j=i+1;j<n;j++) s-=A[i][j]*x[j]; x[i]=s/A[i][i]; steps.push(`Sustitución regresiva: x[${i+1}] = ${fmt(x[i])}`); }
    steps.push('Solución x = '+vecToStr(x));
    return {x, steps};
  }

  // --- Operaciones vectores ---
  function sumarVectores(a,b){ if(a.length!==b.length) throw 'Dimensiones distintas'; return a.map((v,i)=>v+b[i]); }
  function restarVectores(a,b){ if(a.length!==b.length) throw 'Dimensiones distintas'; return a.map((v,i)=>v-b[i]); }
  function escalarVector(a,k){ return a.map(v=>v*k); }
  function productoPunto(a,b){ if(a.length!==b.length) throw 'Dimensiones distintas'; return a.reduce((s,v,i)=>s+v*b[i],0); }
  function norma(a){ return Math.sqrt(a.reduce((s,v)=>s+v*v,0)); }

  // --- Operaciones matrices ---
  function sumarMatrices(A,B){ if(A.length!==B.length || (A[0]||[]).length!==(B[0]||[]).length) throw 'Dimensiones distintas'; return A.map((r,i)=>r.map((v,j)=>v + B[i][j])); }
  function multiplicarMatrices(A,B){ const n=A.length,m=B[0].length,p=A[0].length; if(p!==B.length) throw 'Dimensiones incompatibles'; const C=Array.from({length:n},()=>Array(m).fill(0)); for(let i=0;i<n;i++)for(let j=0;j<m;j++)for(let k=0;k<p;k++)C[i][j]+=A[i][k]*B[k][j]; return C; }
  function transponer(A){ return A[0]?A[0].map((_,j)=>A.map(r=>r[j])):[]; }

  // Resolver sistema Ax=b por Eliminación Gauss (retorna x)
  function gaussSolve(Ain,bin){
    // copia
    const n = Ain.length;
    const A = Ain.map(r=>r.slice());
    const b = bin.slice();
    for(let i=0;i<n;i++){
      // pivote parcial
      let maxRow=i; for(let k=i+1;k<n;k++) if(Math.abs(A[k][i])>Math.abs(A[maxRow][i])) maxRow=k;
      if(Math.abs(A[maxRow][i])<1e-12) throw 'Matriz singular o sistema mal condicionado (pivote cero)';
      [A[i],A[maxRow]]=[A[maxRow],A[i]];
      [b[i],b[maxRow]]=[b[maxRow],b[i]];
      // eliminar
      for(let k=i+1;k<n;k++){
        const c = A[k][i]/A[i][i];
        for(let j=i;j<n;j++) A[k][j]-=c*A[i][j];
        b[k]-=c*b[i];
      }
    }
    // sustitución regresiva
    const x=Array(n).fill(0);
    for(let i=n-1;i>=0;i--){
      let s=b[i];
      for(let j=i+1;j<n;j++) s-=A[i][j]*x[j];
      x[i]=s/A[i][i];
    }
    return x;
  }

  // Jacobi iterativo
  function jacobi(A,b,{tol=1e-8,maxIter=1000}={}){
    const n=A.length;
    let x = Array(n).fill(0);
    for(let iter=0;iter<maxIter;iter++){
      const xnew = Array(n).fill(0);
      for(let i=0;i<n;i++){
        let s=0; for(let j=0;j<n;j++) if(j!==i) s+=A[i][j]*x[j];
        if(Math.abs(A[i][i])<1e-12) throw 'Pivote nulo en Jacobi';
        xnew[i] = (b[i]-s)/A[i][i];
      }
      const err = Math.max(...x.map((v,i)=>Math.abs(v-xnew[i])));
      x = xnew;
      if(err<tol) return {x, iterations: iter+1, tolReached:true};
    }
    return {x, iterations: maxIter, tolReached:false};
  }

  // --- UI wiring ---
  function $(id){return document.getElementById(id)}
  function showSection(id){ ['sect-vectores','sect-matrices','sect-historial'].forEach(s=>$(s).classList.add('hidden')); $(id).classList.remove('hidden'); }

  // hooks
  $('btn-vectores').addEventListener('click',()=>showSection('sect-vectores'));
  $('btn-matrices').addEventListener('click',()=>showSection('sect-matrices'));
  $('btn-historial').addEventListener('click',()=>{ showSection('sect-historial'); fillHist(); });

  // Vectores actions
  $('btn-sumar').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value), B=parseVector($('vecB').value);
      const r=sumarVectores(A,B);
      renderVector($('out-vectores'), r);
      logOperacion('suma_vectores',{A,B},r);
      // pasos
      const stepsContainer = $('steps-vectores'); if($('show-steps-vectores') && $('show-steps-vectores').checked){ const steps = steps_vector_sum(A,B); enterStepsMode('vectores', steps); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-vectores').textContent = 'Error: '+e}
  });
  $('btn-restar').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value), B=parseVector($('vecB').value);
      const r=restarVectores(A,B);
      renderVector($('out-vectores'), r);
      logOperacion('resta_vectores',{A,B},r);
      const stepsContainer = $('steps-vectores'); if($('show-steps-vectores') && $('show-steps-vectores').checked){ enterStepsMode('vectores', steps_vector_sub(A,B)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-punto').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value), B=parseVector($('vecB').value);
      const r=productoPunto(A,B);
      const out = $('out-vectores'); clearNode(out);
      const txt = document.createElement('div'); txt.textContent = 'A · B = '+r; out.appendChild(txt);
      logOperacion('producto_punto',{A,B},r);
      const stepsContainer = $('steps-vectores'); if($('show-steps-vectores') && $('show-steps-vectores').checked){ enterStepsMode('vectores', steps_dot(A,B)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-escalar').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value), k=parseFloat($('escalar').value);
      if(Number.isNaN(k)) throw 'Escalar inválido';
      const r=escalarVector(A,k);
      renderVector($('out-vectores'), r);
      logOperacion('escalar_vector',{A,k},r);
      const stepsContainer = $('steps-vectores'); if($('show-steps-vectores') && $('show-steps-vectores').checked){ enterStepsMode('vectores', steps_scalar_mul(A,k)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-norma').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value); const r=norma(A);
      const out = $('out-vectores'); clearNode(out); const txt = document.createElement('div'); txt.textContent = '||A|| = '+r; out.appendChild(txt);
      logOperacion('norma',{A},r);
      const stepsContainer = $('steps-vectores'); if($('show-steps-vectores') && $('show-steps-vectores').checked){ enterStepsMode('vectores', steps_norm(A)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-vectores').textContent='Error: '+e}
  });

  // Matrices actions
  $('btn-m-sum').addEventListener('click',()=>{
    try{
      const A=parseMatrix($('matA').value), B=parseMatrix($('matB').value);
      const r=sumarMatrices(A,B);
      renderMatrix($('out-matrices'), r);
      logOperacion('suma_matrices',{A,B},r);
      const stepsContainer = $('steps-matrices'); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', steps_matrix_sum(A,B)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-m-mul').addEventListener('click',()=>{
    try{
      const A=parseMatrix($('matA').value), B=parseMatrix($('matB').value);
      const r=multiplicarMatrices(A,B);
      renderMatrix($('out-matrices'), r);
      logOperacion('mul_matrices',{A,B},r);
      const stepsContainer = $('steps-matrices'); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', steps_matrix_mul(A,B)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-transp').addEventListener('click',()=>{
    try{
      const A=parseMatrix($('matA').value); const r=transponer(A);
      renderMatrix($('out-matrices'), r);
      logOperacion('transponer',{A},r);
      const stepsContainer = $('steps-matrices'); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', steps_transpose(A)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-gauss').addEventListener('click',()=>{
    try{
      const A=parseMatrix($('matA').value), b=parseVector($('vecBmat').value);
      const res = gaussSolveWithSteps(A,b);
      const r = res.x;
      const out=$('out-matrices'); clearNode(out);
      const lbl=document.createElement('div'); lbl.className='result-label'; lbl.textContent='Solución (Gauss):'; out.appendChild(lbl);
      const solDiv=document.createElement('div'); out.appendChild(solDiv);
      renderVector(solDiv, r);
      logOperacion('resolver_gauss',{A,b},r);
      const stepsContainer = $('steps-matrices'); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', res.steps); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-jacobi').addEventListener('click',()=>{
    try{const A=parseMatrix($('matA').value), b=parseVector($('vecBmat').value);
      const opts = {tol:1e-8,maxIter:1000};
      const res=jacobi(A,b,opts);
      const out = $('out-matrices'); clearNode(out);
      const lbl = document.createElement('div'); lbl.className='result-label'; lbl.textContent='Solución (Jacobi):'; out.appendChild(lbl);
      const solDiv = document.createElement('div'); out.appendChild(solDiv); renderVector(solDiv, res.x);
      const info = document.createElement('div'); info.textContent = 'Iter: '+res.iterations+'  Converged: '+res.tolReached; out.appendChild(info);
      logOperacion('resolver_jacobi',{A,b,opts},res);
      const stepsContainer = $('steps-matrices'); if($('show-steps-matrices') && $('show-steps-matrices').checked){ const st = ['Algoritmo Jacobi iterativo. Parámetros: tol='+opts.tol+' maxIter='+opts.maxIter, 'Resultado final: '+vecToStr(res.x), 'Iteraciones: '+res.iterations]; enterStepsMode('matrices', st); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-matrices').textContent='Error: '+e}
  });

  // Historial UI
  function fillHist(){
    const ul = $('list-hist'); ul.innerHTML='';
    const hist = JSON.parse(localStorage.getItem('historial')||'[]');
    hist.slice().reverse().forEach(item =>{
      const li=document.createElement('li');
      li.textContent = item.timestamp + ' | ' + item.tipo + ' | ' + (typeof item.resultado==='object'? JSON.stringify(item.resultado): String(item.resultado));
      ul.appendChild(li);
    });
  }
  $('btn-refresh').addEventListener('click', fillHist);
  $('btn-clear').addEventListener('click', ()=>{ if(confirm('Borrar historial?')){ localStorage.removeItem('historial'); fillHist(); }});
  $('btn-export').addEventListener('click', ()=>{
    const hist = JSON.parse(localStorage.getItem('historial')||'[]');
    const blob = new Blob(hist.map(it=>JSON.stringify(it)+"\n"),{type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='historial.jsonl'; a.click(); URL.revokeObjectURL(url);
  });
  $('file-import').addEventListener('change', (ev)=>{
    const f = ev.target.files[0]; if(!f) return; const r=new FileReader(); r.onload = ()=>{
      const lines = r.result.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      const hist = JSON.parse(localStorage.getItem('historial')||'[]');
      for(const L of lines){ try{ const obj=JSON.parse(L); hist.push(obj);}catch(e){console.warn('Linea no JSON:',L);} }
      localStorage.setItem('historial', JSON.stringify(hist)); alert('Importado '+lines.length+' lineas'); fillHist();
    }; r.readAsText(f);
  });

  // Init
  // --- Theme / Configuración ---
  function applyTheme(isDark){
    document.documentElement.classList.toggle('dark', !!isDark);
  }

  function setThemePreference(pref){
    // pref: 'system' | 'light' | 'dark'
    localStorage.setItem('theme', pref);
    if(pref === 'system'){
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);
      else applyTheme(false);
    }else{
      applyTheme(pref === 'dark');
    }
  }

  function initTheme(){
    const stored = localStorage.getItem('theme');
    if(stored === 'dark') applyTheme(true);
    else if(stored === 'light') applyTheme(false);
    else {
      // system or unset
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);
      else applyTheme(false);
    }
    // set radios state if present
    const rSystem = $('theme-system'), rLight = $('theme-light'), rDark = $('theme-dark');
    if(rSystem && rLight && rDark){
      if(stored === 'dark') rDark.checked = true;
      else if(stored === 'light') rLight.checked = true;
      else rSystem.checked = true;
    }
  }

  // Abrir/cerrar panel configuración
  const btnSettings = $('btn-settings');
  const settingsPanel = $('settings-panel');
  if(btnSettings && settingsPanel){
    btnSettings.addEventListener('click', ()=>{
      settingsPanel.classList.remove('hidden');
      const stored = localStorage.getItem('theme');
      const rSystem = $('theme-system'), rLight = $('theme-light'), rDark = $('theme-dark');
      if(rSystem && rLight && rDark){
        if(stored === 'dark') rDark.checked = true;
        else if(stored === 'light') rLight.checked = true;
        else rSystem.checked = true;
      }
    });
    $('settings-close').addEventListener('click', ()=> settingsPanel.classList.add('hidden'));
    // cerrar al clickear fuera del contenido
    settingsPanel.addEventListener('click', (ev)=>{ if(ev.target===settingsPanel) settingsPanel.classList.add('hidden'); });

    // listeners for radio buttons
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(r => r.addEventListener('change', (e)=>{ setThemePreference(e.target.value); }));
  }

  initTheme();
  showSection('sect-vectores');
  // Wire interactive step controls
  wireStepControls();

  // Decimals control
  const decInput = $('decimals');
  if(decInput){
    const stored = parseInt(localStorage.getItem('decimals'));
    decInput.value = Number.isNaN(stored)? 6 : stored;
    decInput.addEventListener('change', ()=>{
      const v = parseInt(decInput.value);
      if(Number.isNaN(v) || v<0) return;
      localStorage.setItem('decimals', String(v));
      // refresh previews and current visible steps/out
      refreshPreviews();
      // re-render current step displays so formatting updates
      renderCurrentStep('vectores'); renderCurrentStep('matrices');
    });
  }

  // Input previews
  ['vecA','vecB','escalar','matA','matB','vecBmat'].forEach(id=>{ const el=$(id); if(el) el.addEventListener('input', refreshPreviews); });
  // initial previews
  refreshPreviews();
})();
