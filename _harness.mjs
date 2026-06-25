import { JSDOM } from 'jsdom'; import fs from 'fs';
const dom=new JSDOM(`<!DOCTYPE html><html><body><div id="fl-splash"></div><div id="root"></div></body></html>`,{url:'https://x.test/',pretendToBeVisual:true,storageQuota:1e7});
const {window}=dom; global.window=window; global.document=window.document;
const def=(o,k,v)=>{try{o[k]=v;}catch(e){Object.defineProperty(o,k,{value:v,configurable:true,writable:true});}};
def(window,'scrollTo',()=>{}); def(window,'matchMedia',()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
def(window,'fetch',()=>Promise.resolve({ok:true,json:()=>Promise.resolve({}),clone(){return this;}}));
def(window,'supabase',{createClient:()=>({auth:{getSession:()=>Promise.resolve({data:{session:null}}),getUser:()=>Promise.resolve({data:{user:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signInWithOAuth(){},signOut:()=>Promise.resolve({})},from:()=>({select(){return this;},eq(){return this;},maybeSingle:()=>Promise.resolve({data:null}),upsert:()=>Promise.resolve({}),or(){return this;},in(){return this;},then(cb){return Promise.resolve(cb({data:[]}));}})})});
const errs=[]; const oe=console.error; console.error=(...a)=>errs.push(a.map(String).join(' '));
const React=(await import('react')).default; const RC=await import('react-dom/client'); const RD=await import('react-dom');
def(window,'React',React); global.React=React; const ReactDOM={...RD,createRoot:RC.createRoot}; def(window,'ReactDOM',ReactDOM); global.ReactDOM=ReactDOM;
function run(p){try{(new Function('window','document','navigator','self','location','React','ReactDOM','console',fs.readFileSync(p,'utf8'))).call(window,window,document,window.navigator,window,window.location,React,ReactDOM,console);}catch(e){errs.push('THROW '+p+': '+(e.stack||e.message).slice(0,200));}}
run('dist/redesign/backend.js'); run('dist/assets/app.bundle.js');
await new Promise(r=>setTimeout(r,500)); console.error=oe;
console.log('ROOT html length:', document.getElementById('root').innerHTML.length, '(>0 = app rendered ✓)');
console.log('ERRORS:', errs.length); errs.slice(0,6).forEach(e=>console.log('  •',e.slice(0,200)));
