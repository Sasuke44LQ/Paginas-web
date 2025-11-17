// Lógica principal de la web: operaciones y historial
(function(){
  // --- Utilidades ---
  function now(){ return new Date().toISOString(); }
  function parseVector(str){
    if(!str) return [];
    return str.split(',').map(s=>parseFloat(s.trim())).filter(x=>!Number.isNaN(x));
  }
  function vecToStr(v){ return '['+v.map(x=>+(+x).toFixed(6)).join(', ')+']'; }

  function parseMatrix(str){
    // filas separadas por ;, elementos por ,
    if(!str) return [];
    return str.split(';').map(r => parseVector(r));
  }
  function matToStr(M){ return '['+M.map(r=>'['+r.map(x=>+(+x).toFixed(6)).join(', ')+']').join(',\n ')+']'; }

  function logOperacion(tipo, entradas, resultado){
    const item = {timestamp: now(), tipo, entradas, resultado};
    const hist = JSON.parse(localStorage.getItem('historial')||'[]');
    hist.push(item);
    localStorage.setItem('historial', JSON.stringify(hist));
    return item;
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
      $('out-vectores').textContent = 'A + B = '+vecToStr(r);
      logOperacion('suma_vectores',{A,B},r);
    }catch(e){$('out-vectores').textContent = 'Error: '+e}
  });
  $('btn-restar').addEventListener('click',()=>{
    try{const A=parseVector($('vecA').value), B=parseVector($('vecB').value); const r=restarVectores(A,B); $('out-vectores').textContent='A - B = '+vecToStr(r); logOperacion('resta_vectores',{A,B},r);}catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-punto').addEventListener('click',()=>{
    try{const A=parseVector($('vecA').value), B=parseVector($('vecB').value); const r=productoPunto(A,B); $('out-vectores').textContent='A · B = '+r; logOperacion('producto_punto',{A,B},r);}catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-escalar').addEventListener('click',()=>{
    try{const A=parseVector($('vecA').value), k=parseFloat($('escalar').value); if(Number.isNaN(k)) throw 'Escalar inválido'; const r=escalarVector(A,k); $('out-vectores').textContent='k * A = '+vecToStr(r); logOperacion('escalar_vector',{A,k},r);}catch(e){$('out-vectores').textContent='Error: '+e}
  });
  $('btn-norma').addEventListener('click',()=>{
    try{const A=parseVector($('vecA').value); const r=norma(A); $('out-vectores').textContent='||A|| = '+r; logOperacion('norma',{A},r);}catch(e){$('out-vectores').textContent='Error: '+e}
  });

  // Matrices actions
  $('btn-m-sum').addEventListener('click',()=>{
    try{const A=parseMatrix($('matA').value), B=parseMatrix($('matB').value); const r=sumarMatrices(A,B); $('out-matrices').textContent='A + B =\n'+matToStr(r); logOperacion('suma_matrices',{A,B},r);}catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-m-mul').addEventListener('click',()=>{
    try{const A=parseMatrix($('matA').value), B=parseMatrix($('matB').value); const r=multiplicarMatrices(A,B); $('out-matrices').textContent='A * B =\n'+matToStr(r); logOperacion('mul_matrices',{A,B},r);}catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-transp').addEventListener('click',()=>{
    try{const A=parseMatrix($('matA').value); const r=transponer(A); $('out-matrices').textContent='A^T =\n'+matToStr(r); logOperacion('transponer',{A},r);}catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-gauss').addEventListener('click',()=>{
    try{const A=parseMatrix($('matA').value), b=parseVector($('vecBmat').value); const r=gaussSolve(A,b); $('out-matrices').textContent='Solución (Gauss): '+vecToStr(r); logOperacion('resolver_gauss',{A,b},r);}catch(e){$('out-matrices').textContent='Error: '+e}
  });

  $('btn-jacobi').addEventListener('click',()=>{
    try{const A=parseMatrix($('matA').value), b=parseVector($('vecBmat').value);
      const opts = {tol:1e-8,maxIter:1000};
      const res=jacobi(A,b,opts);
      $('out-matrices').textContent = 'Solución (Jacobi): '+vecToStr(res.x)+'\nIter: '+res.iterations+' Converged: '+res.tolReached;
      logOperacion('resolver_jacobi',{A,b,opts},res);
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
  showSection('sect-vectores');
})();
