// Basic SPA with hash routing, selections, particles, and theme toggle
(function(){
  const appEl = document.getElementById('app');
  const totalEl = document.getElementById('totalPrice');
  const viewSummaryBtn = document.getElementById('viewSummaryBtn');
  // Dark theme only; removed toggle

  // ---- State ----
  // Clear localStorage to force refresh pricing
  localStorage.clear();
  let build = loadState();
  function defaultState(){
    return { cpu:null, motherboard:null, gpu:null, memory:null, ssd:null, hdd:null, psu:null, case:null, cooler:null, setup:[] };
  }

  function renderAuth(){
    appEl.innerHTML = '';
    const authContainer = el('div', {class: 'auth-container'});
    
    const header = el('div', {class: 'section'}, [ el('h2', {}, ['Login / Sign Up']) ]);
    authContainer.appendChild(header);
    
    const tabs = el('div', {class:'row', style:'gap:8px'});
    const content = el('div', {class: 'auth-form'});
    const signInBtn = el('button', {class:'ghost'}, ['Sign In']);
    const signUpBtn = el('button', {class:'primary'}, ['Sign Up']);
    tabs.appendChild(signInBtn); tabs.appendChild(signUpBtn);
    authContainer.appendChild(tabs);

    function showSignIn(){
      signInBtn.className = 'primary'; signUpBtn.className = 'ghost';
      content.innerHTML = '';
      
      // Google Sign-In Button
      const googleBtn = el('button', {class: 'google-btn', type: 'button'}, ['Continue with Google']);
      googleBtn.addEventListener('click', async () => {
        const result = await signInWithGoogle();
        if(result.success){ 
          setUserSession(result.user); 
          renderHome(); 
        } else { 
          alert('Google sign-in failed: ' + result.error); 
        }
      });
      content.appendChild(googleBtn);
      
      const form = el('form', {class: 'auth-form-inner'});
      const emailRow = el('div', {class: 'form-row single'});
      const email = el('input', {type:'email', placeholder:'Email', required: true});
      emailRow.appendChild(email);
      
      const credentialsRow = el('div', {class: 'form-row'});
      const pass = el('input', {type:'password', placeholder:'Password', required: true});
      credentialsRow.appendChild(pass);
      
      const submit = el('button', {type:'submit', class:'primary'}, ['Sign In']);
      credentialsRow.appendChild(submit);
      
      form.appendChild(emailRow);
      form.appendChild(credentialsRow);
      
      form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const result = await signInUser(email.value.trim(), pass.value);
        if(result.success){ 
          setUserSession(result.user); 
          renderHome(); 
        } else { 
          alert('Invalid credentials: ' + result.error); 
        }
      });
      content.appendChild(form);
    }
    
    function showSignUp(){
      signInBtn.className = 'ghost'; signUpBtn.className = 'primary';
      content.innerHTML = '';
      
      // Google Sign-Up Button
      const googleBtn = el('button', {class: 'google-btn', type: 'button'}, ['Continue with Google']);
      googleBtn.addEventListener('click', async () => {
        const result = await signInWithGoogle();
        if(result.success){ 
          setUserSession(result.user); 
          renderHome(); 
        } else { 
          alert('Google sign-up failed: ' + result.error); 
        }
      });
      content.appendChild(googleBtn);
      
      const form = el('form', {class: 'auth-form-inner'});
      const usernameRow = el('div', {class: 'form-row single'});
      const username = el('input', {type:'text', placeholder:'Username', required: true});
      usernameRow.appendChild(username);
      
      const emailRow = el('div', {class: 'form-row single'});
      const email = el('input', {type:'email', placeholder:'Email', required: true});
      emailRow.appendChild(email);
      
      const credentialsRow = el('div', {class: 'form-row'});
      const pass = el('input', {type:'password', placeholder:'Password', required: true});
      credentialsRow.appendChild(pass);
      
      const submit = el('button', {type:'submit', class:'primary'}, ['Create Account']);
      credentialsRow.appendChild(submit);
      
      form.appendChild(usernameRow);
      form.appendChild(emailRow);
      form.appendChild(credentialsRow);
      
      form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const u = username.value.trim(); const em = email.value.trim(); const pw = pass.value;
        if(!u || !em || !pw){ alert('Please fill all fields'); return; }
        const result = await signUpUser(em, pw, u);
        if(result.success){
          setUserSession(result.user);
          renderHome();
        } else {
          alert('Registration failed: ' + result.error);
        }
      });
      content.appendChild(form);
    }
    
    signInBtn.addEventListener('click', showSignIn);
    signUpBtn.addEventListener('click', showSignUp);
    authContainer.appendChild(content);
    appEl.appendChild(authContainer);
    
    showSignUp();
    
    const nav = el('div', {class:'row', style:'margin-top:10px'});
    const backBtn = el('button', {class:'ghost', type:'button'}, ['Back']);
    backBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      location.hash = '#/'
      renderHome();
    });
    nav.appendChild(backBtn);
    appEl.appendChild(nav);
  }
  function storageKey(){
    const u = currentUser();
    return `pcbuild_state_v1_${u?.email || 'guest'}`;
  }
  function loadState(){
    try{
      const q = parseSharedFromHash();
      if(q) { localStorage.setItem(storageKey(), JSON.stringify(q)); location.hash = '#/'; return q; }
      const raw = localStorage.getItem(storageKey());
      if(!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // migrations: if prior merged storage exists, split back to ssd/hdd
      if(parsed.storage && (parsed.storage.ssd || parsed.storage.hdd)){
        parsed.ssd = parsed.ssd ?? parsed.storage.ssd ?? null;
        parsed.hdd = parsed.hdd ?? parsed.storage.hdd ?? null;
        delete parsed.storage;
      }
      // ensure setup array
      if(!Array.isArray(parsed.setup)) parsed.setup = [];
      return { ...defaultState(), ...parsed };
    }catch{ return defaultState(); }
  }
  function saveState(){
    localStorage.setItem(storageKey(), JSON.stringify(build));
    updateTotal();
  }

  // ---- Firebase Authentication ----
  let currentUserData = null;

  function waitForFirebase(){
    return new Promise((resolve)=>{
      if(window.firebaseAuth){
        resolve();
      } else {
        setTimeout(()=> waitForFirebase().then(resolve), 100);
      }
    });
  }

  async function signUpUser(email, password, username){
    try{
      await waitForFirebase();
      const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await window.setDoc(window.doc(window.firebaseDB, 'users', user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      });
      
      return { success: true, user: { uid: user.uid, email: user.email, username: username } };
    } catch(error){
      return { success: false, error: error.message };
    }
  }

  async function signInUser(email, password){
    try{
      await waitForFirebase();
      const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await window.getDoc(window.doc(window.firebaseDB, 'users', user.uid));
      const userData = userDoc.data();
      
      return { success: true, user: { uid: user.uid, email: user.email, username: userData?.username || email.split('@')[0] } };
    } catch(error){
      return { success: false, error: error.message };
    }
  }

  async function signInWithGoogle(){
    try{
      await waitForFirebase();
      const provider = new window.GoogleAuthProvider();
      const userCredential = await window.signInWithPopup(window.firebaseAuth, provider);
      const user = userCredential.user;
      
      // Check if user exists in Firestore, if not create a new document
      const userDoc = await window.getDoc(window.doc(window.firebaseDB, 'users', user.uid));
      if (!userDoc.exists()) {
        await window.setDoc(window.doc(window.firebaseDB, 'users', user.uid), {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
      
      const userData = userDoc.data();
      return { success: true, user: { uid: user.uid, email: user.email, username: userData?.username || user.displayName || user.email.split('@')[0] } };
    } catch(error){
      return { success: false, error: error.message };
    }
  }

  async function logOutUser(){
    try{
      await waitForFirebase();
      await window.signOut(window.firebaseAuth);
      return { success: true };
    } catch(error){
      return { success: false, error: error.message };
    }
  }

  function currentUser(){
    return currentUserData;
  }

  function setUserSession(user){
    currentUserData = user;
    // reload per-user state when session changes
    build = loadState();
    updateTotal();
  }

  // ---- Firestore Database Functions ----
  async function saveBuildToFirestore(userId, buildData){
    try{
      await waitForFirebase();
      console.log('Firebase ready, attempting to save build...');
      const buildRef = await window.addDoc(window.collection(window.firebaseDB, 'builds'), {
        userId: userId,
        build: buildData,
        total: calcTotal(buildData),
        createdAt: new Date().toISOString()
      });
      console.log('Build saved successfully with ID:', buildRef.id);
      return { success: true, id: buildRef.id };
    } catch(error){
      console.error('Firestore save error:', error);
      return { success: false, error: error.message };
    }
  }

  async function getBuildsFromFirestore(userId){
    try{
      await waitForFirebase();
      const q = window.query(
        window.collection(window.firebaseDB, 'builds'),
        window.where('userId', '==', userId)
      );
      const querySnapshot = await window.getDocs(q);
      const builds = [];
      querySnapshot.forEach((doc) => {
        builds.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return { success: true, builds: builds };
    } catch(error){
      return { success: false, error: error.message };
    }
  }

  async function deleteBuildFromFirestore(buildId){
    try{
      await waitForFirebase();
      await window.deleteDoc(window.doc(window.firebaseDB, 'builds', buildId));
      return { success: true };
    } catch(error){
      return { success: false, error: error.message };
    }
  }

  // ---- Catalog Database Functions ----
  async function saveCatalogToFirestore(){
    try{
      await waitForFirebase();
      console.log('Saving catalog to Firestore...');
      
      // Save each component category as a separate document
      for(const [componentKey, componentData] of Object.entries(Catalog)){
        const catalogRef = window.doc(window.firebaseDB, 'catalog', componentKey);
        await window.setDoc(catalogRef, {
          title: componentData.title,
          desc: componentData.desc,
          options: componentData.options,
          updatedAt: new Date().toISOString()
        });
      }
      
      console.log('Catalog saved successfully to Firestore');
      return { success: true };
    } catch(error){
      console.error('Error saving catalog to Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  async function loadCatalogFromFirestore(){
    try{
      await waitForFirebase();
      console.log('Loading catalog from Firestore...');
      
      // Load each component category from Firestore
      for(const componentKey of Object.keys(Catalog)){
        const catalogRef = window.doc(window.firebaseDB, 'catalog', componentKey);
        const catalogDoc = await window.getDoc(catalogRef);
        
        if(catalogDoc.exists()){
          const data = catalogDoc.data();
          if(data.options){
            // Update the local Catalog with database data
            Catalog[componentKey].options = data.options;
            console.log(`Loaded ${componentKey} with ${data.options.length} items`);
          }
        } else {
          console.log(`No catalog data found for ${componentKey}, using local data`);
        }
      }
      
      console.log('Catalog loaded successfully from Firestore');
      return { success: true };
    } catch(error){
      console.error('Error loading catalog from Firestore:', error);
      return { success: false, error: error.message };
    }
  }

  // Listen for auth state changes
  setTimeout(async()=>{
    await waitForFirebase();
    window.onAuthStateChanged(window.firebaseAuth, async(user)=>{
      if(user){
        const userDoc = await window.getDoc(window.doc(window.firebaseDB, 'users', user.uid));
        const userData = userDoc.data();
        currentUserData = { uid: user.uid, email: user.email, username: userData?.username || user.email.split('@')[0] };
      } else {
        currentUserData = null;
      }
      // Re-render if app is ready
      if(typeof router === 'function') router();
    });
  }, 1000);

  // ---- Routing ----
  const routes = {
    '/': renderHome,
    '/select': renderSelect,
    '/summary': renderSummary,
    '/admin': renderAdminPortal,
  };
  function parseRoute(){
    const h = location.hash || '#/';
    const raw = h.startsWith('#') ? h.slice(1) : h; // remove '#'
    const parts = raw.split('/').filter(Boolean);   // remove leading '' from '/'
    if(parts.length === 0) return { path:'/' };
    if(parts[0] === 'select') return { path:'/_select', comp: parts[1] };
    if(parts[0] === 'summary' || parts[0] === 'cart') return { path:'/summary' };
    if(parts[0] === 'admin') return { path:'/admin' };
    return { path:'/' };
  }

  window.addEventListener('hashchange', () => router());
  viewSummaryBtn.addEventListener('click', () => { location.hash = '#/summary'; });

  function router(){
    const r = parseRoute();
    if(r.path === '/') return renderHome();
    if(r.path === '/_select') return renderSelect(r.comp);
    if(r.path === '/summary') return renderSummary();
    if(r.path === '/admin') return renderAdminPortal();
    renderHome();
  }

  // ---- Utilities ----
  function el(tag, attrs={}, children=[]) {
    const e = document.createElement(tag);
    for(const [k,v] of Object.entries(attrs)){
      if(k === 'class') e.className = v;
      else if(k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if(k === 'html') e.innerHTML = v;
      else e.setAttribute(k, v);
    }
    for(const c of [].concat(children)){
      if(c == null) continue;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return e;
  }

  function updateTotal(){
    totalEl.textContent = formatPrice(calcTotal(build));
  }

  function nextComponent(current){
    const idx = ComponentOrder.indexOf(current);
    for(let i=idx+1;i<ComponentOrder.length;i++){
      if(true) return ComponentOrder[i];
    }
    return null;
  }

  function selectionBadge(key){
    const val = build[key];
    if(key === 'setup'){
      const list = (val||[]).map(id => Catalog.setup.options.find(o=>o.id===id)?.name).filter(Boolean);
      return list.length ? list.join(', ') : '';
    } else if(val){
      const opt = Catalog[key].options.find(o=>o.id===val);
      return opt ? `${opt.name} — ${formatPrice(opt.price)}` : '';
    }
    return '';
  }

  // ---- Views ----
  function renderHome(){
    appEl.innerHTML = '';
    const header = el('div', {class:'section'}, []);
    const top = el('div', {class:'row', style:'justify-content:space-between; align-items:center'});
    const left = el('div', {});
    left.appendChild(el('h2', {class:'app-title'}, ['Build Your Own PC']));
    left.appendChild(el('div', {class:'desc app-title'}, ['Pick parts directly or click Build Now to follow the guided steps.']));
    const right = el('div', {class:'row', style:'gap:8px'});
    const u = currentUser();
    
    // Admin button (always visible)
    const adminBtn = el('button', {class:'ghost'}, ['Admin']);
    adminBtn.addEventListener('click', ()=> {
      location.hash = '#/admin';
    });
    right.appendChild(adminBtn);
    
    if(u){
      right.appendChild(el('span', {}, [`Hello, ${u.username}`]));
      const myBuildsBtn = el('button', {class:'ghost'}, ['My Builds']);
      myBuildsBtn.addEventListener('click', ()=> renderMyBuilds());
      right.appendChild(myBuildsBtn);
      const lo = el('button', {class:'flat'}, ['Logout']);
      lo.addEventListener('click', async ()=>{ 
        await logOutUser();
        setUserSession(null); 
        renderHome(); 
      });
      right.appendChild(lo);
    } else {
      const li = el('button', {class:'ghost'}, ['Login / Sign Up']);
      li.addEventListener('click', ()=> renderAuth());
      right.appendChild(li);
    }
    const buildNowBtn = el('button', {class:'primary', onClick: ()=> location.hash = `#/select/${ComponentOrder[0]}`}, ['Build Now']);
    right.appendChild(buildNowBtn);
    top.appendChild(left); top.appendChild(right);
    header.appendChild(top);
    appEl.appendChild(header);

    const grid = el('div', {class:'grid'});
    for(const key of ComponentOrder){
      const meta = Catalog[key];
      const card = el('div', {class:'card'});
      // name
      card.appendChild(el('h3', {}, [meta.title]));
      // selection summary
      const selText = selectionBadge(key);
      card.appendChild(el('div', {class:'desc'}, [selText]));
      // actions row
      const actionsRow = el('div', {class:'row', style:'gap:8px; justify-content:flex-end; margin-top:6px'});
      const selectBtn = el('button', {class:'ghost'}, ['Select']);
      selectBtn.addEventListener('click', (e)=>{
        card.classList.add('glow');
        setTimeout(()=> card.classList.remove('glow'), 350);
        location.hash = `#/select/${key}`;
      });
      actionsRow.appendChild(selectBtn);
      if(selText && selText.length){
        const updateBtn = el('button', {class:'flat', type:'button'}, ['Update']);
        updateBtn.addEventListener('click', (e)=>{
          e.preventDefault();
          e.stopPropagation();
          location.hash = `#/select/${key}`;
        });
        actionsRow.appendChild(updateBtn);
      }
      card.appendChild(actionsRow);
      grid.appendChild(card);
    }

    const actions = el('div', {class:'row', style:'margin-top:8px'});
    actions.appendChild(el('button', {class:'primary', onClick:()=> location.hash = '#/summary'}, ['Go to Summary']));

    appEl.appendChild(grid);
    appEl.appendChild(actions);
    updateTotal();
  }

  function renderSelect(component){
    if(!Catalog[component]){ location.hash = '#/'; return; }
    appEl.innerHTML = '';
    const meta = Catalog[component];

    // Progress and top controls
    const stepIndex = Math.max(0, ComponentOrder.indexOf(component));
    const totalSteps = ComponentOrder.length;
    const pct = Math.round(((stepIndex) / totalSteps) * 100);

    const header = el('div', {class:'section'}, []);
    const titleRow = el('div', {class:'row', style:'justify-content:space-between; align-items:center'});
    const leftTitle = el('div', {}, [ el('h2', {}, [meta.title]), el('div', {class:'desc'}, [meta.desc]) ]);
    const rightNav = el('div', {class:'row'});
    const prevKey = ComponentOrder[stepIndex-1];
    const nextKey = ComponentOrder[stepIndex+1];
    const backBtn = el('button', {class:'ghost', onClick: ()=> { if(prevKey) location.hash = `#/select/${prevKey}`; else location.hash = '#/'; }}, ['Back']);
    const nextBtn = el('button', {class:'primary', onClick: ()=> { if(nextKey) location.hash = `#/select/${nextKey}`; else location.hash = '#/summary'; }}, [nextKey? 'Next' : 'Finish']);
    rightNav.appendChild(backBtn);
    rightNav.appendChild(nextBtn);
    titleRow.appendChild(leftTitle);
    titleRow.appendChild(rightNav);
    const prog = el('div', {style:'height:6px; background:var(--border); border-radius:999px; overflow:hidden; margin-top:8px'});
    const bar = el('div', {style:`height:100%; width:${pct}%; background:linear-gradient(90deg, var(--accent), var(--accent-2));`});
    prog.appendChild(bar);
    header.appendChild(titleRow);
    header.appendChild(prog);

    const list = el('div', {class:'grid'});

    if(component === 'setup'){
      // multi-select by grouped sections: OS, MS Office, Antivirus
      const groups = ['OS','MS Office','Antivirus'];
      const byGroup = new Map(groups.map(g => [g, []]));
      const sorted = [...meta.options].sort((a,b)=> (a.price||0) - (b.price||0));
      for(const opt of sorted){
        const g = groups.includes(opt.group) ? opt.group : 'OS';
        byGroup.get(g).push(opt);
      }
      for(const g of groups){
        const section = el('div', {class:'section'});
        section.appendChild(el('h3', {}, [g]));
        if(g === 'Antivirus'){
          // Render as table with rows for device counts and columns for durations
          const tbl = el('table', {class:'table'});
          const head = el('thead');
          head.appendChild(el('tr', {}, [
            el('th', {}, ['Devices']),
            el('th', {}, ['3 Months']),
            el('th', {}, ['6 Months']),
            el('th', {}, ['1 Year']),
            el('th', {}, ['2 Years']),
            el('th', {}, ['3 Years'])
          ]));
          tbl.appendChild(head);
          const durations = ['3m','6m','1y','2y','3y'];
          const body = el('tbody');
          for(const devices of [1,2,3]){
            const tr = el('tr');
            tr.appendChild(el('td', {}, [`${devices} Device${devices>1?'s':''}`]));
            for(const d of durations){
              const opt = byGroup.get(g).find(o=>o.device===devices && o.duration===d);
              const active = opt ? build.setup.includes(opt.id) : false;
              const btn = el('button', {class: active? 'flat':'primary'}, [opt? formatPrice(opt.price): '—']);
              if(opt){
                btn.addEventListener('click', ()=>{
                  const isActive = (build.setup||[]).includes(opt.id);
                  if(isActive){
                    build.setup = (build.setup||[]).filter(id => id !== opt.id);
                  } else {
                    build.setup = (build.setup||[]).filter(id => {
                      const o = Catalog.setup.options.find(x=>x.id===id);
                      return o && o.group !== 'Antivirus';
                    });
                    build.setup.push(opt.id);
                  }
                  saveState();
                  renderSelect('setup');
                });
              } else {
                btn.setAttribute('disabled','');
              }
              const td = el('td'); td.appendChild(btn); tr.appendChild(td);
            }
            body.appendChild(tr);
          }
          tbl.appendChild(body);
          section.appendChild(tbl);
        } else {
          const grid = el('div', {class:'grid'});
          for(const opt of byGroup.get(g)){
            const active = build.setup.includes(opt.id);
            const card = el('div', {class:'card'});
            card.appendChild(el('div', {class:'row'}, [
              el('h3', {}, [opt.name]),
              el('span', {class:'badge'}, [formatPrice(opt.price)])
            ]));
            const btn = el('button', {class: active? 'flat' : 'primary'} , [active? 'Selected' : 'Select']);
            btn.addEventListener('click', ()=>{
              const groupName = opt.group;
              const isActive = (build.setup||[]).includes(opt.id);
              if(isActive){
                // unselect just this one
                build.setup = (build.setup||[]).filter(id => id !== opt.id);
              } else {
                // replace any from same group, then select this one
                build.setup = (build.setup||[]).filter(id => {
                  const o = Catalog.setup.options.find(x=>x.id===id);
                  return o && o.group !== groupName;
                });
                build.setup.push(opt.id);
              }
              saveState();
              renderSelect('setup');
            });
            card.appendChild(btn);
            grid.appendChild(card);
          }
          section.appendChild(grid);
        }
        appEl.appendChild(section);
      }
    } else {
      // Special rendering for merged storage (two sections SSD/HDD)
      if(component === 'storage'){
        const groups = ['SSD','HDD'];
        const byGroup = new Map(groups.map(g => [g, []]));
        const sorted = [...meta.options].sort((a,b)=> (a.price||0) - (b.price||0));
        for(const opt of sorted){ byGroup.get(opt.group).push(opt); }
        for(const g of groups){
          const section = el('div', {class:'section'});
          section.appendChild(el('h3', {}, [g]));
          const grid2 = el('div', {class:'grid'});
          for(const opt of byGroup.get(g)){
            const keySel = g.toLowerCase();
            const selected = (build.storage && build.storage[keySel]) === opt.id;
            const card = el('div', {class:'card'});
            card.appendChild(el('div', {class:'row'}, [
              el('h3', {}, [opt.name || opt.id]),
              el('span', {class:'badge'}, [formatPrice(opt.price)])
            ]));
            const kv = el('div', {class:'kv'});
            for(const [k,v] of Object.entries(opt)){
              if(['id','name','price'].includes(k)) continue;
              kv.appendChild(el('div', {class:'k'}, [k]));
              kv.appendChild(el('div', {class:'v'}, [String(v)]));
            }
            card.appendChild(kv);
            const btn = el('button', {class: selected? 'flat':'primary'}, [selected? 'Selected':'Choose']);
            btn.addEventListener('click', ()=>{
              build.storage = build.storage || { ssd:null, hdd:null };
              build.storage[keySel] = opt.id;
              saveState();
              // do not auto-advance to allow choosing both SSD and HDD; provide Next in header
              renderSelect('storage');
            });
            card.appendChild(btn);
            grid2.appendChild(card);
          }
          section.appendChild(grid2);
          appEl.appendChild(section);
        }
        // Append header and early return
        appEl.insertBefore(header, appEl.firstChild);
        const actions = el('div', {class:'row', style:'margin-top:10px'});
        actions.appendChild(el('button', {class:'ghost', onClick: ()=> history.back()}, ['Back']));
        actions.appendChild(el('button', {class:'flat', onClick: ()=> location.hash = '#/'}, ['Home']));
        actions.appendChild(el('button', {class:'primary', onClick: downloadTxt}, ['Download TXT Bill']));
        actions.appendChild(el('button', {class:'primary', onClick: saveBuildForUser}, ['Save Build']));
        appEl.appendChild(actions);
        updateTotal();
        return;
      }
      const options = [...meta.options].sort((a,b)=> (a.price||0) - (b.price||0));
      for(const opt of options){
        const selected = build[component] === opt.id;
        const card = el('div', {class:'card'});
        card.appendChild(el('div', {class:'row'}, [
          el('h3', {}, [opt.name || opt.id]),
          el('span', {class:'badge'}, [formatPrice(opt.price)])
        ]));
        // extra lines
        const kv = el('div', {class:'kv'});
        for(const [k,v] of Object.entries(opt)){
          if(['id','name','price'].includes(k)) continue;
          kv.appendChild(el('div', {class:'k'}, [k]));
          kv.appendChild(el('div', {class:'v'}, [String(v)]));
        }
        card.appendChild(kv);

        const btn = el('button', {class: selected? 'flat':'primary'}, [selected? 'Selected':'Choose']);
        btn.addEventListener('click', ()=>{
          // toggle: if already selected, unselect, else select
          if(build[component] === opt.id){
            build[component] = null;
          } else {
            build[component] = opt.id;
          }
          saveState();
          // stay on page; Next button controls navigation
          renderSelect(component);
        });
        card.appendChild(btn);
        list.appendChild(card);
      }
      appEl.appendChild(header);
      appEl.appendChild(list);
    }

    const nav = el('div', {class:'row', style:'margin-top:10px'});
    nav.appendChild(el('button', {class:'ghost', onClick: ()=> history.back()}, ['Back']));
    nav.appendChild(el('button', {class:'flat', onClick: ()=> location.hash = '#/'}, ['Home']));
    nav.appendChild(el('button', {class:'primary', onClick: ()=> location.hash = '#/summary'}, ['Go to Summary']));

    if(component !== 'setup'){
      // header and list already appended above; for software, header appended earlier per group
    } else {
      appEl.insertBefore(header, appEl.firstChild);
    }
    appEl.appendChild(nav);
    updateTotal();
  }

  function compatibilityWarnings(b){
    const notes = [];
    // Memory type vs CPU platform assumptions
    const cpu = Catalog.cpu.options.find(o=>o.id===b.cpu);
    const mem = Catalog.memory.options.find(o=>o.id===b.memory);
    const mobo = Catalog.motherboard.options.find(o=>o.id===b.motherboard);
    if(cpu && mem){
      const intelLga1700 = cpu.socket === 'LGA1700'; // can be DDR4 or DDR5, warn softly
      if(cpu.socket === 'AM4' && mem.type === 'DDR5'){
        notes.push({severity:'error', text:'AM4 platform does not support DDR5 RAM. Choose a DDR4 kit.'});
      }
      if(cpu.socket === 'AM5' && mem.type === 'DDR4'){
        notes.push({severity:'error', text:'AM5 platform requires DDR5 RAM. Choose a DDR5 kit.'});
      }
      if(intelLga1700){
        notes.push({severity:'warn', text:'LGA1700 motherboards can be DDR4 or DDR5. Ensure your board matches the RAM type.'});
      }
    }
    // CPU vs Motherboard socket check
    if(cpu && mobo){
      if(cpu.socket && mobo.socket && cpu.socket !== mobo.socket){
        notes.push({
          severity: 'error',
          text: `CPU (${cpu.name}) uses ${cpu.socket} but Motherboard (${mobo.name}) uses ${mobo.socket}. Sockets must match.`
        });
      }
    }
    // PSU watt guidance
    const est = estimatePower(b);
    const psu = Catalog.psu.options.find(o=>o.id===b.psu);
    if(psu){
      if(psu.watt < est){
        notes.push({severity:'error', text:`Selected PSU (${psu.watt}W) is below estimated requirement (~${est}W). Consider higher wattage.`});
      } else if(psu.watt < est + 100){
        notes.push({severity:'warn', text:`PSU headroom may be low. Estimated ~${est}W, PSU ${psu.watt}W.`});
      } else {
        notes.push({severity:'ok', text:`PSU wattage looks sufficient. Estimated ~${est}W.`});
      }
    }
    return notes;
  }

  function renderSummary(){
    appEl.innerHTML = '';

    const header = el('div', {class:'section'}, [
      el('h2', {}, ['Build Summary']),
      el('div', {class:'desc'}, ['Review selections, see compatibility notes, and download your bill.'])
    ]);

    const table = el('table', {class:'table'});
    const thead = el('thead');
    thead.appendChild(el('tr', {}, [
      el('th', {}, ['Component']),
      el('th', {}, ['Selection']),
      el('th', {}, ['Price'])
    ]));
    table.appendChild(thead);

    const tbody = el('tbody');
    for(const key of ComponentOrder){
      const tr = el('tr');
      const label = Catalog[key].title;
      let name = '—'; let price = 0;
      if(key === 'setup'){
        const sw = build.setup || [];
        name = sw.map(id => Catalog.setup.options.find(o=>o.id===id)?.name).filter(Boolean).join(', ') || '—';
        price = sw.reduce((s,id)=>{
          const o = Catalog.setup.options.find(x=>x.id===id); return s + (o?o.price:0);
        }, 0);
      } else if(build[key]){
        const opt = Catalog[key].options.find(o=>o.id===build[key]);
        name = opt?.name || build[key];
        price = opt?.price || 0;
      }
      tr.appendChild(el('td', {}, [label]));
      tr.appendChild(el('td', {}, [name]));
      tr.appendChild(el('td', {}, [formatPrice(price)]));
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    const tfoot = el('tfoot');
    const trf = el('tr');
    trf.appendChild(el('td', {colspan:'2'}, ['Total']));
    trf.appendChild(el('td', {}, [formatPrice(calcTotal(build))]));
    tfoot.appendChild(trf);
    table.appendChild(tfoot);

    const notes = compatibilityWarnings(build);
    const notesBox = el('div', {class:'section'});
    for(const n of notes){
      const klass = n.severity==='error' ? 'badge warn' : n.severity==='warn' ? 'badge warn' : 'badge ok';
      notesBox.appendChild(el('div', {class:'row'}, [ el('span', {class:klass}, [n.severity.toUpperCase()]), el('span', {}, [n.text]) ]));
    }

    const actions = el('div', {class:'row', style:'margin-top:12px'});
    actions.appendChild(el('button', {class:'ghost', onClick: ()=> location.hash = '#/'}, ['Home']));
    actions.appendChild(el('button', {class:'flat', onClick: downloadTxt}, ['Download TXT Bill']));
    actions.appendChild(el('button', {class:'primary', onClick: saveBuildForUser}, ['Save Build']));

    const shareBtn = el('button', {class:'primary'}, ['Copy Shareable Link']);
    shareBtn.addEventListener('click', ()=>{
      const link = location.origin + location.pathname + '#/share=' + encodeState(build);
      navigator.clipboard?.writeText(link);
      shareBtn.textContent = 'Link Copied!';
      setTimeout(()=> shareBtn.textContent='Copy Shareable Link', 1500);
    });
    actions.appendChild(shareBtn);

    appEl.appendChild(header);
    appEl.appendChild(table);
    appEl.appendChild(notesBox);
    appEl.appendChild(actions);
    updateTotal();
  }

  function downloadTxt(){
    const blob = new Blob([buildSummaryText()], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pc_build_summary.txt'; a.click();
    URL.revokeObjectURL(url);
  }

  function buildSummaryText(){
    const lines = [];
    lines.push('Build Your Own PC - Bill');
    lines.push('================================');
    for(const key of ComponentOrder){
      const title = Catalog[key].title;
      if(key === 'setup'){
        const sw = build.setup || [];
        if(sw.length===0){ lines.push(`${title}: (none)`); continue; }
        for(const id of sw){
          const o = Catalog.setup.options.find(x=>x.id===id);
          if(o) lines.push(`${title}: ${o.name} - ${formatPrice(o.price)}`);
        }
      } else {
        const id = build[key];
        if(!id){ lines.push(`${title}: (none)`); continue; }
        const o = Catalog[key].options.find(x=>x.id===id);
        if(o) lines.push(`${title}: ${o.name} - ${formatPrice(o.price)}`);
      }
    }
    lines.push('--------------------------------');
    lines.push(`Total: ${formatPrice(calcTotal(build))}`);
    return lines.join('\n');
  }

  async function saveBuildForUser(){
    const u = currentUser();
    if(!u){ alert('Login required to save your build'); return; }
    console.log('Saving build for user:', u.uid);
    console.log('Build data:', build);
    const result = await saveBuildToFirestore(u.uid, JSON.parse(JSON.stringify(build)));
    console.log('Save result:', result);
    if(result.success){
      alert('Build saved to your profile');
    } else {
      alert('Failed to save build: ' + result.error);
    }
  }

  async function renderMyBuilds(){
    const u = currentUser();
    if(!u){ alert('Please login to view your builds'); return; }
    appEl.innerHTML = '';
    const header = el('div', {class:'section'}, [ el('h2', {}, ['My Saved Builds']) ]);
    appEl.appendChild(header);
    
    const result = await getBuildsFromFirestore(u.uid);
    if(!result.success){
      appEl.appendChild(el('div', {class:'desc'}, ['Error loading builds: ' + result.error]));
      return;
    }
    
    const builds = result.builds;
    if(builds.length === 0){ 
      appEl.appendChild(el('div', {class:'desc'}, ['No builds saved yet.'])); 
    }
    
    const list = el('div', {class:'section'});
    for(const it of builds){
      const row = el('div', {class:'card'});
      row.appendChild(el('div', {class:'row'}, [
        el('div', {}, [new Date(it.createdAt).toLocaleString()]),
        el('span', {class:'badge'}, [formatPrice(it.total)])
      ]));
      const actions = el('div', {class:'row', style:'gap:8px; justify-content:flex-end; margin-top:6px'});
      const loadBtn = el('button', {class:'ghost'}, ['Load Build']);
      loadBtn.addEventListener('click', ()=>{
        build = it.build;
        saveState();
        location.hash = '#/summary';
      });
      const delBtn = el('button', {class:'flat'}, ['Delete']);
      delBtn.addEventListener('click', async ()=>{
        const deleteResult = await deleteBuildFromFirestore(it.id);
        if(deleteResult.success){
          renderMyBuilds();
        } else {
          alert('Failed to delete build: ' + deleteResult.error);
        }
      });
      actions.appendChild(loadBtn);
      actions.appendChild(delBtn);
      row.appendChild(actions);
      list.appendChild(row);
    }
    appEl.appendChild(list);
    const nav = el('div', {class:'row', style:'margin-top:10px'});
    const backBtn = el('button', {class:'ghost', type:'button'}, ['Back']);
    backBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      location.hash = '#/'
      renderHome();
    });
    nav.appendChild(backBtn);
    appEl.appendChild(nav);
  }

  // ---- Shareable link helpers ----
  function encodeState(s){
    try{ return btoa(unescape(encodeURIComponent(JSON.stringify(s)))); }catch{ return ''; }
  }
  function decodeState(str){
    try{ return JSON.parse(decodeURIComponent(escape(atob(str)))); }catch{ return null; }
  }
  function parseSharedFromHash(){
    const h = location.hash;
    if(h.startsWith('#/share=')){
      const encoded = h.split('=#/share=').pop(); // fallback
      const enc = h.replace('#/share=','');
      return decodeState(enc || encoded);
    }
    return null;
  }

  // ---- Particles background with gyro/mouse ----
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W=0,H=0; let particles=[]; let tiltX=0, tiltY=0; let mouseX=0, mouseY=0;

  function resize(){
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W*dpr; canvas.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    spawnParticles();
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnParticles(){
    const count = Math.round(Math.sqrt(W*H)/3);
    particles = new Array(count).fill(0).map(()=>({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*2 + 0.5,
      vx: (Math.random()-0.5)*0.2,
      vy: (Math.random()-0.5)*0.2,
      hue: Math.random()<0.5? 190 : 265,
    }));
  }

  function anim(){
    requestAnimationFrame(anim);
    ctx.clearRect(0,0,W,H);
    const gx = tiltX*0.4 + (mouseX/W - 0.5)*0.6;
    const gy = tiltY*0.4 + (mouseY/H - 0.5)*0.6;
    for(const p of particles){
      p.vx += gx*0.002; p.vy += gy*0.002;
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, 0.5)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
  }
  anim();

  if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', (e)=>{
      const maxTilt = 30;
      const x = Math.max(-maxTilt, Math.min(maxTilt, e.beta||0));
      const y = Math.max(-maxTilt, Math.min(maxTilt, e.gamma||0));
      tiltX = y/maxTilt; tiltY = x/maxTilt;
    }, true);
  }
  window.addEventListener('mousemove', (e)=>{ mouseX = e.clientX; mouseY = e.clientY; });

  // ---- Admin Portal ----
  function renderAdminPortal(){
    appEl.innerHTML = '';
    
    // Check if user is logged in
    const u = currentUser();
    if(!u) {
      // Show admin login page
      renderAdminLogin();
      return;
    }
    
    // Check if user has admin access (only mondayproject30@gmail.com)
    if(u.email !== 'mondayproject30@gmail.com') {
      const authError = el('div', {class:'section'}, [
        el('h2', {}, ['Access Denied']),
        el('div', {class:'desc'}, ['Admin access restricted to mondayproject30@gmail.com']),
        el('button', {class:'primary', onClick: async () => {
          await logOutUser();
          renderAdminLogin();
        }}, ['Login as Admin'])
      ]);
      appEl.appendChild(authError);
      return;
    }
    
    // User is admin, show admin portal
    renderAdminDashboard();
  }

  function renderAdminLogin(){
    appEl.innerHTML = '';
    
    const loginContainer = el('div', {class:'auth-container'});
    
    const header = el('div', {class:'section'}, [ el('h2', {}, ['Admin Login']) ]);
    loginContainer.appendChild(header);
    
    const content = el('div', {class: 'auth-form'});
    
    // Google Sign-In Button
    const googleBtn = el('button', {class: 'google-btn', type: 'button'}, ['Sign in with Google']);
    googleBtn.addEventListener('click', async () => {
      const result = await signInWithGoogle();
      if(result.success){ 
        setUserSession(result.user); 
        // Check if this user is admin
        if(result.user.email === 'mondayproject30@gmail.com') {
          renderAdminDashboard();
        } else {
          renderAdminPortal(); // Will show access denied
        }
      } else { 
        alert('Google sign-in failed: ' + result.error); 
      }
    });
    content.appendChild(googleBtn);
    
    // Admin info
    const adminInfo = el('div', {class:'section'}, [
      el('div', {class:'desc'}, ['Admin access is restricted to mondayproject30@gmail.com']),
      el('div', {class:'desc'}, ['Please use Google authentication to access the admin portal.'])
    ]);
    
    // Back to home button
    const backBtn = el('button', {class:'ghost', onClick: () => location.hash = '#/'}, ['Back to Home']);
    
    loginContainer.appendChild(content);
    appEl.appendChild(adminInfo);
    appEl.appendChild(loginContainer);
    appEl.appendChild(backBtn);
  }

  function renderAdminDashboard(){
    // Clear everything first
    appEl.innerHTML = '';
    
    // Load latest catalog data from database before rendering
    loadCatalogFromFirestore().then(result => {
      if(result.success){
        console.log('Catalog loaded from database successfully');
      } else {
        console.error('Failed to load catalog from database:', result.error);
      }
      
      // Continue with rendering the dashboard
      renderAdminDashboardContent();
    });
  }

  function renderAdminDashboardContent(){
    // Admin header
    const header = el('div', {class:'section'}, [
      el('h2', {}, ['Admin Portal']),
      el('div', {class:'desc'}, ['Manage PC components and inventory'])
    ]);

    // Main container with sidebar and content
    const mainContainer = el('div', {class:'admin-container'});
    
    // Left sidebar
    const sidebar = el('div', {class:'admin-sidebar'});
    sidebar.appendChild(el('h3', {}, ['Components']));
    
    // Component list
    const componentList = el('div', {class:'component-list'});
    const components = [
      { key: 'cpu', name: 'CPU', icon: '🔷' },
      { key: 'motherboard', name: 'Motherboard', icon: '🔷' },
      { key: 'gpu', name: 'GPU', icon: '🔷' },
      { key: 'memory', name: 'Memory (RAM)', icon: '🔷' },
      { key: 'ssd', name: 'SSD Storage', icon: '🔷' },
      { key: 'hdd', name: 'HDD Storage', icon: '🔷' },
      { key: 'psu', name: 'Power Supply', icon: '🔷' },
      { key: 'case', name: 'Cabinet/Case', icon: '🔷' },
      { key: 'cooler', name: 'Cooler', icon: '🔷' },
      { key: 'setup', name: 'Setup & Software', icon: '🔷' }
    ];
    
    components.forEach(comp => {
      const item = el('div', {class:'component-item', onClick: () => renderComponentManager(comp.key)}, [
        el('span', {class:'component-icon'}, [comp.icon]),
        el('span', {class:'component-name'}, [comp.name])
      ]);
      componentList.appendChild(item);
    });
    
    sidebar.appendChild(componentList);
    
    // Content area
    const contentArea = el('div', {class:'admin-content'});
    contentArea.appendChild(el('div', {class:'admin-welcome'}, [
      el('h3', {}, ['Welcome to Admin Portal']),
      el('p', {}, ['Select a component from the left sidebar to manage items.']),
      el('p', {}, ['You can add new components, update existing ones, or remove items from inventory.']),
      el('p', {}, ['All changes are automatically saved to the database.'])
    ]));
    
    mainContainer.appendChild(sidebar);
    mainContainer.appendChild(contentArea);
    
    // Admin info and logout
    const adminInfo = el('div', {class:'section'}, [
      el('div', {class:'row', style:'justify-content:space-between; align-items:center'}, [
        el('span', {}, [`Logged in as: ${currentUser().email}`]),
        el('button', {class:'flat', onClick: async () => {
          await logOutUser();
          renderAdminLogin();
        }}, ['Logout'])
      ])
    ]);
    
    // Back button
    const backBtn = el('button', {class:'ghost', onClick: () => location.hash = '#/'}, ['Back to Home']);
    
    // Append all elements in correct order
    appEl.appendChild(header);
    appEl.appendChild(adminInfo);
    appEl.appendChild(mainContainer);
    appEl.appendChild(backBtn);
  }

  function renderComponentManager(componentType){
    if(!Catalog[componentType]) return;
    
    const component = Catalog[componentType];
    const contentArea = document.querySelector('.admin-content');
    if(!contentArea) return;
    
    // Clear content area completely and remove all event listeners
    contentArea.innerHTML = '';
    
    // Create all sections first, then append once
    const sections = [];
    
    // Component header
    const compHeader = el('div', {class:'admin-section'}, [
      el('h3', {}, [component.title]),
      el('div', {class:'desc'}, [component.desc])
    ]);
    sections.push(compHeader);
    
    // Add new item form
    const addSection = el('div', {class:'admin-section'});
    addSection.appendChild(el('h4', {}, ['Add New Item']));
    
    const form = el('form', {class:'admin-form'});
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addComponent(componentType, {
        id: document.querySelector('.admin-form input[type="text"]').value,
        name: document.querySelector('.admin-form input[type="text"]:nth-of-type(2)').value,
        price: parseInt(document.querySelector('.admin-form input[type="number"]').value) || 0
      });
    });
    
    // ID field
    const idRow = el('div', {class:'form-row'});
    idRow.appendChild(el('label', {}, ['ID:']));
    const idInput = el('input', {type:'text', placeholder:'unique-id', required: true});
    idRow.appendChild(idInput);
    form.appendChild(idRow);
    
    // Name field
    const nameRow = el('div', {class:'form-row'});
    nameRow.appendChild(el('label', {}, ['Name:']));
    const nameInput = el('input', {type:'text', placeholder:'Component Name', required: true});
    nameRow.appendChild(nameInput);
    form.appendChild(nameRow);
    
    // Price field
    const priceRow = el('div', {class:'form-row'});
    priceRow.appendChild(el('label', {}, ['Price (₹):']));
    const priceInput = el('input', {type:'number', placeholder:'0', required: true});
    priceRow.appendChild(priceInput);
    form.appendChild(priceRow);
    
    // Dynamic fields based on component type
    const dynamicFields = getDynamicFields(componentType);
    dynamicFields.forEach(field => {
      const row = el('div', {class:'form-row'});
      row.appendChild(el('label', {}, [field.label + ':']));
      const input = el('input', {type: field.type || 'text', placeholder: field.placeholder});
      row.appendChild(input);
      form.appendChild(row);
    });
    
    // Submit button
    const submitRow = el('div', {class:'form-row'});
    const submitBtn = el('button', {type:'submit', class:'primary'}, ['Add Component']);
    submitRow.appendChild(submitBtn);
    form.appendChild(submitRow);
    
    addSection.appendChild(form);
    sections.push(addSection);
    
    // Existing items list
    const listSection = el('div', {class:'admin-section'});
    listSection.appendChild(el('h4', {}, ['Existing Items']));
    
    const itemsList = el('div', {class:'admin-items-list'});
    const options = [...component.options].sort((a,b) => (a.price||0) - (b.price||0));
    
    options.forEach(option => {
      const itemCard = el('div', {class:'admin-item-card'});
      
      const itemInfo = el('div', {class:'item-info'});
      itemInfo.appendChild(el('h5', {}, [option.name || option.id]));
      itemInfo.appendChild(el('div', {class:'item-price'}, [formatPrice(option.price)]));
      
      // Show additional properties
      const props = el('div', {class:'item-props'});
      Object.entries(option).forEach(([key, value]) => {
        if(!['id', 'name', 'price'].includes(key)) {
          props.appendChild(el('span', {class:'prop'}, [`${key}: ${value}`]));
        }
      });
      itemInfo.appendChild(props);
      
      const itemActions = el('div', {class:'item-actions'});
      const editBtn = el('button', {class:'ghost small'}, ['Edit']);
      const deleteBtn = el('button', {class:'flat small'}, ['Delete']);
      
      editBtn.addEventListener('click', () => editComponent(componentType, option.id));
      deleteBtn.addEventListener('click', () => deleteComponent(componentType, option.id));
      
      itemActions.appendChild(editBtn);
      itemActions.appendChild(deleteBtn);
      
      itemCard.appendChild(itemInfo);
      itemCard.appendChild(itemActions);
      itemsList.appendChild(itemCard);
    });
    
    listSection.appendChild(itemsList);
    sections.push(listSection);
    
    // Append all sections at once
    sections.forEach(section => contentArea.appendChild(section));
  }

  function getDynamicFields(componentType){
    const fields = {
      cpu: [
        { label: 'Brand', placeholder: 'Intel/AMD', type: 'text' },
        { label: 'Socket', placeholder: 'LGA1700/AM5', type: 'text' },
        { label: 'TDP', placeholder: '65', type: 'number' }
      ],
      motherboard: [
        { label: 'Socket', placeholder: 'LGA1700/AM5', type: 'text' },
        { label: 'Form Factor', placeholder: 'ATX/mATX', type: 'text' },
        { label: 'Memory Type', placeholder: 'DDR4/DDR5', type: 'text' }
      ],
      gpu: [
        { label: 'Brand', placeholder: 'NVIDIA/AMD', type: 'text' },
        { label: 'VRAM', placeholder: '8GB', type: 'text' },
        { label: 'TDP', placeholder: '150', type: 'number' }
      ],
      memory: [
        { label: 'Type', placeholder: 'DDR4/DDR5', type: 'text' },
        { label: 'Size (GB)', placeholder: '16', type: 'number' },
        { label: 'Speed', placeholder: '3200', type: 'text' }
      ],
      ssd: [
        { label: 'Type', placeholder: 'SSD/NVMe', type: 'text' },
        { label: 'Capacity', placeholder: '1TB', type: 'text' }
      ],
      hdd: [
        { label: 'Capacity', placeholder: '1TB', type: 'text' },
        { label: 'RPM', placeholder: '7200', type: 'number' }
      ],
      psu: [
        { label: 'Wattage', placeholder: '650', type: 'number' },
        { label: 'Efficiency', placeholder: '80+ Gold', type: 'text' }
      ],
      case: [
        { label: 'Form Factor', placeholder: 'ATX/mATX', type: 'text' }
      ],
      cooler: [
        { label: 'Type', placeholder: 'Air/Liquid', type: 'text' },
        { label: 'Size', placeholder: '120mm', type: 'text' }
      ],
      setup: [
        { label: 'Group', placeholder: 'OS/MS Office/Antivirus', type: 'text' }
      ]
    };
    
    return fields[componentType] || [];
  }

  function addComponent(componentType, data){
    // Add dynamic field values
    const form = document.querySelector('.admin-form');
    const dynamicFields = getDynamicFields(componentType);
    
    dynamicFields.forEach((field, index) => {
      const input = form.querySelectorAll('input')[3 + index]; // Skip id, name, price inputs
      if(input && input.value) {
        const fieldName = field.label.toLowerCase().replace(' ', '').replace('(gb)', '').replace(' ', '');
        data[fieldName] = input.value;
      }
    });
    
    // Add to Catalog
    Catalog[componentType].options.push(data);
    
    // Save to database
    saveCatalogToFirestore().then(result => {
      if(result.success){
        console.log(`Component ${data.id} added to ${componentType} and saved to database`);
      } else {
        console.error('Failed to save to database:', result.error);
        alert('Component added locally but failed to save to database: ' + result.error);
      }
    });
    
    // Refresh the component manager
    renderComponentManager(componentType);
  }

  function editComponent(componentType, componentId){
    const component = Catalog[componentType];
    const itemIndex = component.options.findIndex(opt => opt.id === componentId);
    
    if(itemIndex === -1) {
      alert(`Component ${componentId} not found in ${componentType}`);
      return;
    }
    
    const item = component.options[itemIndex];
    
    // Create edit form
    const contentArea = document.querySelector('.admin-content');
    contentArea.innerHTML = '';
    
    const editHeader = el('div', {class:'admin-section'}, [
      el('h3', {}, [`Edit ${component.title}`]),
      el('div', {class:'desc'}, [`Editing: ${item.name || item.id}`])
    ]);
    
    const editForm = el('form', {class:'admin-form'});
    
    // ID field (readonly)
    const idRow = el('div', {class:'form-row'});
    idRow.appendChild(el('label', {}, ['ID:']));
    const idInput = el('input', {type:'text', value: item.id, readonly: true});
    idRow.appendChild(idInput);
    editForm.appendChild(idRow);
    
    // Name field
    const nameRow = el('div', {class:'form-row'});
    nameRow.appendChild(el('label', {}, ['Name:']));
    const nameInput = el('input', {type:'text', value: item.name || '', required: true});
    nameRow.appendChild(nameInput);
    editForm.appendChild(nameRow);
    
    // Price field
    const priceRow = el('div', {class:'form-row'});
    priceRow.appendChild(el('label', {}, ['Price (₹):']));
    const priceInput = el('input', {type:'number', value: item.price || 0, required: true});
    priceRow.appendChild(priceInput);
    editForm.appendChild(priceRow);
    
    // Dynamic fields
    const dynamicFields = getDynamicFields(componentType);
    dynamicFields.forEach(field => {
      const row = el('div', {class:'form-row'});
      row.appendChild(el('label', {}, [field.label + ':']));
      const fieldName = field.label.toLowerCase().replace(' ', '').replace('(gb)', '').replace(' ', '');
      const value = item[fieldName] || '';
      const input = el('input', {type: field.type || 'text', value: value, placeholder: field.placeholder});
      row.appendChild(input);
      editForm.appendChild(row);
    });
    
    // Buttons
    const buttonRow = el('div', {class:'form-row'});
    const saveBtn = el('button', {type:'submit', class:'primary'}, ['Save Changes']);
    const cancelBtn = el('button', {type:'button', class:'ghost', onClick: () => renderComponentManager(componentType)}, ['Cancel']);
    
    buttonRow.appendChild(saveBtn);
    buttonRow.appendChild(cancelBtn);
    editForm.appendChild(buttonRow);
    
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Update the component data
      const updatedData = {
        id: item.id,
        name: nameInput.value,
        price: parseInt(priceInput.value) || 0
      };
      
      // Add dynamic field values
      dynamicFields.forEach((field, index) => {
        const input = editForm.querySelectorAll('input')[3 + index];
        if(input && input.value) {
          const fieldName = field.label.toLowerCase().replace(' ', '').replace('(gb)', '').replace(' ', '');
          updatedData[fieldName] = input.value;
        }
      });
      
      // Update in catalog
      component.options[itemIndex] = updatedData;
      
      // Save to database
      saveCatalogToFirestore().then(result => {
        if(result.success){
          console.log(`Component ${item.id} updated in ${componentType} and saved to database`);
          alert(`Component ${item.id} updated successfully!`);
        } else {
          console.error('Failed to save to database:', result.error);
          alert('Component updated locally but failed to save to database: ' + result.error);
        }
      });
      
      // Go back to component manager
      renderComponentManager(componentType);
    });
    
    contentArea.appendChild(editHeader);
    contentArea.appendChild(editForm);
  }

  function deleteComponent(componentType, componentId){
    if(confirm(`Are you sure you want to delete ${componentId}?`)){
      // Remove from Catalog
      const component = Catalog[componentType];
      const itemIndex = component.options.findIndex(opt => opt.id === componentId);
      
      if(itemIndex !== -1) {
        component.options.splice(itemIndex, 1);
        
        // Save to database
        saveCatalogToFirestore().then(result => {
          if(result.success){
            console.log(`Component ${componentId} deleted from ${componentType} and saved to database`);
            alert(`Deleted: ${componentId} from ${componentType}`);
          } else {
            console.error('Failed to save to database:', result.error);
            alert('Component deleted locally but failed to save to database: ' + result.error);
          }
        });
      } else {
        alert(`Component ${componentId} not found`);
      }
      
      // Refresh the component manager
      renderComponentManager(componentType);
    }
  }

  // ---- Init ----
  function init(){
    // Load catalog from database first, then initialize app
    loadCatalogFromFirestore().then(result => {
      if(result.success){
        console.log('Catalog loaded from database successfully');
      } else {
        console.error('Failed to load catalog from database:', result.error);
      }
      updateTotal();
      router();
    }).catch(error => {
      console.error('Error loading catalog:', error);
      // Continue with local catalog if database fails
      updateTotal();
      router();
    });
  }
  init();
})();
