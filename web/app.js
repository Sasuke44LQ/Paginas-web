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

  // ------ Nuevas utilidades: validación, impresión, visualización, operaciones avanzadas, práctica ------

  function validateVectors(A,B){
    if(!Array.isArray(A) || !Array.isArray(B)) return {ok:false, msg:'Entrada no es un vector válido', suggestion:'Usa formato: 1,2,3'};
    if(A.length===0 || B.length===0) return {ok:false, msg:'Uno de los vectores está vacío', suggestion:'Introduce valores separados por comas'};
    if(A.length !== B.length) return {ok:false, msg:'Dimensiones distintas: vectores de longitudes distintas', suggestion:`A tiene ${A.length} elementos, B tiene ${B.length}. Asegúrate de igualar longitudes.`};
    return {ok:true};
  }

  function validateMatricesMul(A,B){
    if(!Array.isArray(A) || !Array.isArray(B)) return {ok:false, msg:'Entrada no es una matriz válida', suggestion:'Usa formato fila1;fila2 con elementos separados por comas'};
    if(A.length===0 || B.length===0) return {ok:false, msg:'Una de las matrices está vacía', suggestion:'Introduce matrices con al menos una fila'};
    const aCols = (A[0]||[]).length; const bRows = B.length;
    if(aCols !== bRows) return {ok:false, msg:`Dimensiones incompatibles: columnas A (${aCols}) ≠ filas B (${bRows})`, suggestion:'Revisa las dimensiones o transpón una de las matrices'};
    return {ok:true};
  }

  function printSteps(section){
    const st = stepsState[section];
    if(!st || !st.steps || st.steps.length===0){ alert('No hay pasos para imprimir.'); return; }
    const w = window.open('','_blank');
    const title = section==='vectores'? 'Pasos - Vectores' : 'Pasos - Matrices';
    let html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Segoe UI,Arial;padding:16px} .step{margin-bottom:8px}</style></head><body><h2>${title}</h2>`;
    if(st.showAll){ html += '<ol>'; st.steps.forEach(s=>{ html += `<li class="step">${String(s)}</li>` }); html += '</ol>'; }
    else { html += `<div>Resumen: <ol>`; html += `<li>${String(st.steps[Math.max(0,st.idx)])}</li>`; html += `</ol></div>`; }
    html += `<script>window.onload=function(){window.print();}</script></body></html>`;
    w.document.open(); w.document.write(html); w.document.close();
  }

  // Visualizador simple 2D/3D para vectores A y B
  function drawVectors(){
    const canvas = $('canvas-vec'); if(!canvas) return; const ctx = canvas.getContext('2d');
    const A = parseVector($('vecA').value), B = parseVector($('vecB').value);
    const dim = document.querySelector('input[name="viz-dim"]:checked').value;
    const rotX = parseFloat($('rotX').value) * Math.PI/180; const rotY = parseFloat($('rotY').value) * Math.PI/180; const zoom = parseFloat($('zoom').value);
    // clear
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save(); ctx.translate(canvas.width/2, canvas.height/2);
    // axes
    ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-canvas.width/2,0); ctx.lineTo(canvas.width/2,0); ctx.moveTo(0,-canvas.height/2); ctx.lineTo(0,canvas.height/2); ctx.stroke();
    function proj2(p){ return {x: p[0]*zoom, y: -p[1]*zoom}; }
    function proj3(p){ // rotate then project
      let [x,y,z] = p;
      // rotate X
      let y2 = y*Math.cos(rotX) - z*Math.sin(rotX);
      let z2 = y*Math.sin(rotX) + z*Math.cos(rotX);
      // rotate Y
      let x2 = x*Math.cos(rotY) + z2*Math.sin(rotY);
      let z3 = -x*Math.sin(rotY) + z2*Math.cos(rotY);
      // simple perspective
      const f = 1/(1 + z3*0.2);
      return {x: x2 * f * zoom, y: -y2 * f * zoom};
    }
    function drawArrow(p, color){ ctx.beginPath(); ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=2; ctx.moveTo(0,0); ctx.lineTo(p.x,p.y); ctx.stroke(); // head
      const ang = Math.atan2(p.y,p.x); const h = 8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - h*Math.cos(ang-0.3), p.y - h*Math.sin(ang-0.3)); ctx.lineTo(p.x - h*Math.cos(ang+0.3), p.y - h*Math.sin(ang+0.3)); ctx.closePath(); ctx.fill(); }
    if(dim==='2d'){
      if(A.length>=2) drawArrow(proj2([A[0], A[1]]), '#0b5ed7');
      if(B.length>=2) drawArrow(proj2([B[0], B[1]]), '#3aa0ff');
    } else {
      if(A.length>=3) drawArrow(proj3([A[0],A[1],A[2]]), '#0b5ed7');
      else if(A.length>=2) drawArrow(proj3([A[0],A[1],0]), '#0b5ed7');
      if(B.length>=3) drawArrow(proj3([B[0],B[1],B[2]]), '#3aa0ff');
      else if(B.length>=2) drawArrow(proj3([B[0],B[1],0]), '#3aa0ff');
    }
    ctx.restore();
  }

  // Determinante mediante eliminación Gaussian
  function determinant(Ain){
    const A = Ain.map(r=>r.slice()); const n=A.length; if(n===0) return 0; let det = 1; for(let i=0;i<n;i++){
      // pivot
      let pivot = i; for(let k=i+1;k<n;k++) if(Math.abs(A[k][i])>Math.abs(A[pivot][i])) pivot=k;
      if(Math.abs(A[pivot][i])<1e-12) return 0;
      if(pivot!==i){ [A[i],A[pivot]]=[A[pivot],A[i]]; det *= -1; }
      det *= A[i][i];
      for(let k=i+1;k<n;k++){ const c = A[k][i]/A[i][i]; for(let j=i;j<n;j++) A[k][j]-=c*A[i][j]; }
    }
    return det;
  }

  function inverseMatrix(Ain){
    const n = Ain.length; const A = Ain.map(r=>r.slice()); const I = Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=> i===j?1:0));
    for(let i=0;i<n;i++){
      // pivot
      let pivot=i; for(let k=i+1;k<n;k++) if(Math.abs(A[k][i])>Math.abs(A[pivot][i])) pivot=k;
      if(Math.abs(A[pivot][i])<1e-12) throw 'Matriz singular, no tiene inversa';
      if(pivot!==i){ [A[i],A[pivot]]=[A[pivot],A[i]]; [I[i],I[pivot]]=[I[pivot],I[i]]; }
      const div = A[i][i]; for(let j=0;j<n;j++){ A[i][j]/=div; I[i][j]/=div; }
      for(let r=0;r<n;r++) if(r!==i){ const mult = A[r][i]; for(let c=0;c<n;c++){ A[r][c]-=mult*A[i][c]; I[r][c]-=mult*I[i][c]; } }
    }
    return I;
  }

  function luDecompose(Ain){
    const n = Ain.length; const A = Ain.map(r=>r.slice()); const L = Array.from({length:n},()=>Array(n).fill(0)); const U = Array.from({length:n},()=>Array(n).fill(0));
    for(let i=0;i<n;i++){
      // U
      for(let k=i;k<n;k++){ let s=0; for(let j=0;j<i;j++) s+=L[i][j]*U[j][k]; U[i][k]=A[i][k]-s; }
      // L
      L[i][i]=1;
      for(let k=i+1;k<n;k++){ let s=0; for(let j=0;j<i;j++) s+=L[k][j]*U[j][i]; if(Math.abs(U[i][i])<1e-12) throw 'LU failed: pivot cero'; L[k][i]=(A[k][i]-s)/U[i][i]; }
    }
    return {L,U};
  }

  // Modo práctica: generar/chequear ejercicios simples
  let currentExercise = null;
  function genExercise(type){
    const area = $('exercise-area'); clearNode(area); $('exercise-feedback').textContent='';
    if(type==='vect_sum'){
      const n = 2 + Math.floor(Math.random()*3);
      const A = Array.from({length:n},()=>Math.round((Math.random()*10-5))*1);
      const B = Array.from({length:n},()=>Math.round((Math.random()*10-5))*1);
      currentExercise = {type, A, B, expected: A.map((v,i)=>v+B[i])};
      area.innerHTML = `<div>Vector A: ${vecToStr(A)}</div><div>Vector B: ${vecToStr(B)}</div><label>Tu respuesta (formato: a,b,c):</label><input id="exercise-answer" style="width:100%" />`;
    } else if(type==='mat_mul'){
      const n = 2 + Math.floor(Math.random()*2);
      const A = Array.from({length:n},()=>Array.from({length:n},()=>Math.floor(Math.random()*5)));
      const B = Array.from({length:n},()=>Array.from({length:n},()=>Math.floor(Math.random()*5)));
      currentExercise = {type, A, B, expected: multiplicarMatrices(A,B)};
      area.innerHTML = `<div>Matriz A:<pre>${matToStr(A)}</pre></div><div>Matriz B:<pre>${matToStr(B)}</pre></div><label>Tu respuesta (filas separadas por ;):</label><input id="exercise-answer" style="width:100%" />`;
    } else if(type==='gauss'){
      const n = 2 + Math.floor(Math.random()*2);
      const A = Array.from({length:n},()=>Array.from({length:n},()=>Math.floor(Math.random()*6)));
      const b = Array.from({length:n},()=>Math.floor(Math.random()*6));
      try{ const x = gaussSolve(A,b); currentExercise={type,A,b,expected:x}; area.innerHTML = `<div>Sistema A x = b</div><div>A:<pre>${matToStr(A)}</pre></div><div>b: ${vecToStr(b)}</div><label>Tu respuesta (a1,a2,..):</label><input id="exercise-answer" style="width:100%" />`; }catch(e){ area.textContent='No se pudo generar sistema estable, inténtalo de nuevo.'; currentExercise=null; }
    }
  }

  function checkExercise(){
    if(!currentExercise){ alert('Genera un ejercicio primero'); return; }
    const ansStr = $('exercise-answer')? $('exercise-answer').value.trim():''; if(!ansStr){ $('exercise-feedback').textContent='Introduce una respuesta para comprobar.'; return; }
    try{
      let ok=false; if(currentExercise.type==='vect_sum' || currentExercise.type==='gauss'){
        const usr = parseVector(ansStr);
        const exp = currentExercise.expected.map(x=>Number(fmt(x)));
        const u = usr.map(x=>Number(fmt(x)));
        ok = (u.length===exp.length && u.every((v,i)=>Math.abs(v-exp[i])<Math.pow(10,-getDecimals())));
      } else if(currentExercise.type==='mat_mul'){
        const usr = parseMatrix(ansStr);
        const exp = currentExercise.expected;
        // compare dimensions and values
        if(usr.length!==exp.length) ok=false; else{
          ok = usr.every((r,i)=> r.length===exp[i].length && r.every((v,j)=> Math.abs(Number(fmt(v))-Number(fmt(exp[i][j])))<Math.pow(10,-getDecimals())));
        }
      }
      $('exercise-feedback').textContent = ok? 'Correcto ✅' : 'Incorrecto ❌ — Revisa los pasos y vuelve a intentar.';
    }catch(e){ $('exercise-feedback').textContent = 'Error comprobando respuesta: '+e }
  }

  // wire new listeners for visualization and practice will be done in UI wiring


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
  function showSection(id){ ['sect-vectores','sect-matrices','sect-historial','sect-practice'].forEach(s=>{ const el=$(s); if(el) el.classList.add('hidden'); }); const target=$(id); if(target) target.classList.remove('hidden'); }

  // hooks
  $('btn-vectores').addEventListener('click',()=>showSection('sect-vectores'));
  $('btn-matrices').addEventListener('click',()=>showSection('sect-matrices'));
  $('btn-historial').addEventListener('click',()=>{ showSection('sect-historial'); fillHist(); });
  // Práctica
  const btnPractice = $('btn-practice'); if(btnPractice) btnPractice.addEventListener('click', ()=> showSection('sect-practice'));

  // Vectores actions
  $('btn-sumar').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value), B=parseVector($('vecB').value);
      const vOk = validateVectors(A,B);
      if(!vOk.ok){ const out=$('out-vectores'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent = vOk.msg + (vOk.suggestion?(' — '+vOk.suggestion):''); out.appendChild(err); return; }
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
      const vOk = validateVectors(A,B);
      if(!vOk.ok){ const out=$('out-vectores'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent = vOk.msg + (vOk.suggestion?(' — '+vOk.suggestion):''); out.appendChild(err); return; }
      const r=restarVectores(A,B);
      renderVector($('out-vectores'), r);
      logOperacion('resta_vectores',{A,B},r);
      const stepsContainer = $('steps-vectores'); if($('show-steps-vectores') && $('show-steps-vectores').checked){ enterStepsMode('vectores', steps_vector_sub(A,B)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-punto').addEventListener('click',()=>{
    try{
      const A=parseVector($('vecA').value), B=parseVector($('vecB').value);
      const vOk = validateVectors(A,B);
      if(!vOk.ok){ const out=$('out-vectores'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent = vOk.msg + (vOk.suggestion?(' — '+vOk.suggestion):''); out.appendChild(err); return; }
      const r=productoPunto(A,B);
      const out = $('out-vectores'); clearNode(out);
      const txt = document.createElement('div'); txt.textContent = 'A · B = '+fmt(r); out.appendChild(txt);
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
      if(!A.length || !B.length){ const out=$('out-matrices'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent='Una de las matrices está vacía'; out.appendChild(err); return; }
      const r=sumarMatrices(A,B);
      renderMatrix($('out-matrices'), r);
      logOperacion('suma_matrices',{A,B},r);
      const stepsContainer = $('steps-matrices'); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', steps_matrix_sum(A,B)); } else if(stepsContainer) clearNode(stepsContainer);
    }catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-m-mul').addEventListener('click',()=>{
    try{
      const A=parseMatrix($('matA').value), B=parseMatrix($('matB').value);
      const vOk = validateMatricesMul(A,B);
      if(!vOk.ok){ const out=$('out-matrices'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent = vOk.msg + (vOk.suggestion?(' — '+vOk.suggestion):''); out.appendChild(err); return; }
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

  // Print steps buttons
  const psv = $('print-steps-vectores'); if(psv) psv.addEventListener('click', ()=> printSteps('vectores'));
  const psm = $('print-steps-matrices'); if(psm) psm.addEventListener('click', ()=> printSteps('matrices'));

  // Operaciones avanzadas: det / inv / lu
  const btnDet = $('btn-det'); if(btnDet) btnDet.addEventListener('click', ()=>{
    try{ const A=parseMatrix($('matA').value); const out=$('out-matrices'); clearNode(out); const det = determinant(A); const div=document.createElement('div'); div.textContent='Determinante = '+fmt(det); out.appendChild(div); logOperacion('determinante',{A},det); }catch(e){const out=$('out-matrices'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent='Error: '+e; out.appendChild(err);} });

  const btnInv = $('btn-inv'); if(btnInv) btnInv.addEventListener('click', ()=>{
    try{ const A=parseMatrix($('matA').value); const inv = inverseMatrix(A); const out=$('out-matrices'); clearNode(out); renderMatrix(out, inv); logOperacion('inversa',{A},inv); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', ['Inversa calculada mediante Gauss-Jordan.']); } }catch(e){ const out=$('out-matrices'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent = 'Error: '+e; out.appendChild(err); } });

  const btnLU = $('btn-lu'); if(btnLU) btnLU.addEventListener('click', ()=>{
    try{ const A=parseMatrix($('matA').value); const res = luDecompose(A); const out=$('out-matrices'); clearNode(out); const h=document.createElement('div'); h.innerHTML='<strong>L:</strong>'; out.appendChild(h); renderMatrix(out, res.L); const h2=document.createElement('div'); h2.innerHTML='<strong>U:</strong>'; out.appendChild(h2); renderMatrix(out, res.U); logOperacion('lu',{A},res); if($('show-steps-matrices') && $('show-steps-matrices').checked){ enterStepsMode('matrices', ['Descomposición LU (Doolittle) realizada.']); } }catch(e){ const out=$('out-matrices'); clearNode(out); const err=document.createElement('div'); err.className='msg-error'; err.textContent='Error: '+e; out.appendChild(err);} });

  // Visualizador: dibujar y re-dibujar al cambiar controles
  const btnDraw = $('btn-draw-viz'); if(btnDraw) btnDraw.addEventListener('click', drawVectors);
  const rotX = $('rotX'), rotY = $('rotY'), zoom = $('zoom');
  if(rotX) rotX.addEventListener('input', drawVectors);
  if(rotY) rotY.addEventListener('input', drawVectors);
  if(zoom) zoom.addEventListener('input', drawVectors);

  // Práctica: generar y comprobar
  const btnGen = $('btn-gen-exercise'); if(btnGen) btnGen.addEventListener('click', ()=>{ const t=$('practice-type').value; genExercise(t); });
  const btnCheck = $('btn-check-exercise'); if(btnCheck) btnCheck.addEventListener('click', ()=> checkExercise());

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
  // redibujar visualizador cuando cambian los vectores
  const vA = $('vecA'), vB = $('vecB'); if(vA) vA.addEventListener('input', drawVectors); if(vB) vB.addEventListener('input', drawVectors);
  // initial previews
  refreshPreviews();
  // initial draw
  try{ drawVectors(); }catch(e){}
})();
