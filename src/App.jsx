import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";

// ─── Иконки в стиле Telegram (тонкие линейные SVG) ───
const _sv=(p,vb="0 0 24 24")=>({viewBox:vb,paths:p});
function Icon({d, size=22, color="currentColor", stroke=0, fill="none", vb="0 0 24 24", style}){
  return (
    <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke?color:"none"}
      strokeWidth={stroke||0} strokeLinecap="round" strokeLinejoin="round"
      style={{display:"block",...style}}>
      {Array.isArray(d)?d.map((x,i)=><path key={i} d={x} fill={fill==="none"?"none":color} stroke={stroke?color:"none"}/>):
        <path d={d} fill={fill==="none"?"none":color}/>}
    </svg>
  );
}
const IC = {
  send:  <Icon d="M3 11.5 21 3l-4 18-5-7-9-2.5Z" stroke={2} />,
  mic:   <Icon d={["M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z","M19 11a7 7 0 0 1-14 0","M12 18v3"]} stroke={2} />,
  stop:  <Icon d="M7 7h10v10H7z" stroke={2} />,
  clip:  <Icon d="M21 11.5 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 9" stroke={2} />,
  eye:   <Icon d={["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} stroke={2} />,
  search:<Icon d={["M11 11m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0","M21 21l-4.3-4.3"]} stroke={2} />,
  plus:  <Icon d={["M12 5v14","M5 12h14"]} stroke={2.2} />,
  back:  <Icon d="M15 19 8 12l7-7" stroke={2.2} />,
  dots:  <Icon d={["M12 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z","M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z","M12 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"]} stroke={1} fill="currentColor" />,
  edit:  <Icon d={["M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z","M13.5 6.5l3 3"]} stroke={2} />,
  trash: <Icon d={["M4 7h16","M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2","M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"]} stroke={2} />,
  save:  <Icon d={["M5 3h11l3 3v15H5z","M8 3v5h7","M8 21v-7h8v7"]} stroke={2} />,
  imp:   <Icon d={["M12 3v12","M7 10l5 5 5-5","M5 21h14"]} stroke={2} />,
  pin:   <Icon d="M9 4h6l-1 6 3 3H7l3-3-1-6Z M12 13v7" stroke={2} />,
  pinOff: <Icon d={["M9 4h6l-1 6 3 3H7l3-3-1-6Z","M12 13v7","M3 3l18 18"]} stroke={2.4} />,
  copy:  <Icon d={["M9 9h10v12H9z","M5 15V3h10"]} stroke={2} />,
  cut:   <Icon d={["M6 6m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0","M6 18m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0","M20 4 8.5 15.5","M20 20 8.5 8.5"]} stroke={2} />,
  check: <Icon d="M5 12l5 5 9-11" stroke={2.4} />,
  close: <Icon d={["M6 6l12 12","M18 6L6 18"]} stroke={2.2} />,
  copyT: (<svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{display:"block"}}>
    <rect x="4" y="3" width="11" height="14" rx="2"/><path d="M17 7h3v12a2 2 0 0 1-2 2H9"/>
    <text x="9.5" y="12.5" fontSize="8" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle">Т</text></svg>),
  copyMsg: <Icon d={["M3 14v-2a6 6 0 0 1 6-6h8","M13 2l6 4-6 4"]} stroke={2} />,
  // категории вложений
  gallery: <Icon d={["M3 5h18v14H3z","M3 16l5-5 4 4 3-3 6 6"]} stroke={2} />,
  video:   <Icon d={["M3 6h13v12H3z","M16 10l5-3v10l-5-3z"]} stroke={2} />,
  camera:  <Icon d={["M4 8h3l2-2h6l2 2h3v11H4z","M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"]} stroke={2} />,
  camcorder:<Icon d={["M3 7h11v10H3z","M14 10l7-3v10l-7-3z"]} stroke={2} />,
  audio:   <Icon d={["M9 18V6l10-2v12","M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z","M19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"]} stroke={2} />,
  doc:     <Icon d={["M6 3h8l4 4v14H6z","M14 3v4h4","M9 13h6","M9 17h6"]} stroke={2} />,
  text:    <Icon d={["M5 4h14","M5 9h14","M5 14h10","M5 19h7"]} stroke={2} />,
  archive: <Icon d={["M4 4h16v5H4z","M5 9v11h14V9","M10 13h4"]} stroke={2} />,
  file:    <Icon d={["M6 3h8l4 4v14H6z","M14 3v4h4"]} stroke={2} />,
  // иконки папок (TG-стиль)
  fFolder: <Icon d="M3 7h6l2 2h10v10H3z" stroke={2} />,
  fWork:   <Icon d={["M4 8h16v11H4z","M9 8V6h6v2"]} stroke={2} />,
  fHome:   <Icon d={["M4 11l8-7 8 7","M6 10v9h12v-9"]} stroke={2} />,
  fBook:   <Icon d={["M5 4h13v16H5z","M5 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"]} stroke={2} />,
  fGame:   <Icon d={["M7 10h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8Z","M9 14h2M8 13v2"]} stroke={2} />,
  fMusic:  <Icon d={["M9 18V6l10-2v12","M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z","M19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"]} stroke={2} />,
  fPlane:  <Icon d="M2 12l20-8-8 20-2-8-10-4Z" stroke={2} />,
  fHeart:  <Icon d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" stroke={2} />,
  fStar:   <Icon d="M12 3l2.6 5.6 6 .7-4.4 4 1.2 6L12 16.8 6.6 19.3l1.2-6L3.4 9.3l6-.7L12 3Z" stroke={2} />,
  fFire:   <Icon d="M12 3c1 4-3 5-3 9a3 3 0 0 0 6 0c0-2-1-3-1-3 2 1 3 3 3 5a5 5 0 0 1-10 0c0-5 5-7 5-11Z" stroke={2} />,
  fLeaf:   <Icon d={["M5 19C5 9 12 5 20 5c0 10-7 14-15 14Z","M9 15c3-3 6-4 8-5"]} stroke={2} />,
  fArt:    <Icon d={["M12 3a9 9 0 1 0 0 18c1 0 2-1 2-2s-1-1-1-2 1-1 2-1h1a4 4 0 0 0 4-4c0-4-4-7-8-7Z","M7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"]} stroke={2} />,
  fNote:   <Icon d={["M6 3h12v18H6z","M9 8h6M9 12h6M9 16h4"]} stroke={2} />,
  fIdea:   <Icon d={["M9 18h6","M10 21h4","M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10Z"]} stroke={2} />,
  fCart:   <Icon d={["M3 4h2l2.5 12h11l2-8H6","M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z","M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"]} stroke={2} />,
  fGym:    <Icon d={["M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"]} stroke={2} />,
  fPin:    <Icon d="M9 4h6l-1 6 3 3H7l3-3-1-6Z M12 13v7" stroke={2} />,
  fBookmark:<Icon d="M7 4h10v16l-5-4-5 4z" stroke={2} />,
  fLock:   <Icon d={["M6 11h12v9H6z","M9 11V8a3 3 0 0 1 6 0v3"]} stroke={2} />,
  fTarget: <Icon d={["M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0","M12 12m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0","M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0"]} stroke={2} />,
  fFlask:  <Icon d={["M9 3h6","M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"]} stroke={2} />,
};


// ═══════════════════════════════════════════════
// MARKDOWN (Telegram-identical set)
// ═══════════════════════════════════════════════
function parseMarkdown(text) {
  if (!text) return [];
  const parts = [];
  // bold **  italic _  strike ~~  spoiler ||  mono `  link [t](url)  bare url
  const re = /(\*\*(.+?)\*\*)|(_(.+?)_)|(~~(.+?)~~)|(\|\|(.+?)\|\|)|(`(.+?)`)|(\[(.+?)\]\((https?:\/\/[^)]+)\))|(https?:\/\/\S+)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type:"text",    content:text.slice(last,m.index) });
    if      (m[1])  parts.push({ type:"bold",    content:m[2] });
    else if (m[3])  parts.push({ type:"italic",  content:m[4] });
    else if (m[5])  parts.push({ type:"strike",  content:m[6] });
    else if (m[7])  parts.push({ type:"spoiler", content:m[8] });
    else if (m[9])  parts.push({ type:"code",    content:m[10] });
    else if (m[11]) parts.push({ type:"link",    content:m[12], href:m[13] });
    else if (m[14]) parts.push({ type:"link",    content:m[14], href:m[14] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type:"text", content:text.slice(last) });
  return parts;
}

function RichText({ text, color, onLinkMenu }) {
  return (
    <span>{parseMarkdown(text).map((p,i) => {
      if (p.type==="bold")   return <strong key={i}>{p.content}</strong>;
      if (p.type==="italic") return <em key={i}>{p.content}</em>;
      if (p.type==="strike") return <s key={i}>{p.content}</s>;
      if (p.type==="spoiler") return <span key={i} style={{background:"#B0A498",color:"#B0A498",borderRadius:3,cursor:"pointer",userSelect:"none"}}
        onClick={e=>{e.stopPropagation();e.currentTarget.style.color="#F2EAE0";e.currentTarget.style.background="#4A3A22";}}>{p.content}</span>;
      if (p.type==="code")   return <code key={i} style={{background:"#15100C",borderRadius:4,padding:"1px 5px",fontSize:"0.87em",fontFamily:"monospace"}}>{p.content}</code>;
      if (p.type==="link")   return (
        <a key={i} href={p.href} target="_blank" rel="noreferrer"
          style={{color:color||"#EF6C00",textDecoration:"underline dotted"}}
          onClick={e=>{ e.preventDefault(); e.stopPropagation();
            const x=(e.clientX||window.innerWidth/2), y=(e.clientY||window.innerHeight/2);
            onLinkMenu&&onLinkMenu(p.href,{clientX:x,clientY:y}); }}
        >{p.content}</a>
      );
      return <span key={i}>{p.content}</span>;
    })}</span>
  );
}

// ═══════════════════════════════════════════════
// STORAGE + AUTO-SAVE
// ═══════════════════════════════════════════════
const SK = "napp_v9";
const AS_KEY = "napp_v9_autosave"; // autosave settings
const DRAFT_KEY = "napp_v9_drafts";
function loadDrafts(){ try{ const r=localStorage.getItem(DRAFT_KEY); return r?JSON.parse(r):{}; }catch{ return {}; } }
function saveDrafts(d){ try{ localStorage.setItem(DRAFT_KEY,JSON.stringify(d)); }catch{} }

const defaultData = {
  folders:[
    {id:"f1",name:"Работа",icon:"fWork",color:"#EF6C00",unread:0,subfolders:[
      {id:"sf1",name:"Проекты",icon:"fFolder",color:"#EF6C00",notes:[
        {id:"n1",text:"Дедлайн по **проекту X** — 15 июня",time:"10:24",ts:new Date(2026,5,15,10,24).toISOString(),pinned:true,attachments:[]},
        {id:"n2",text:"Созвон в пятницу 15:00\nСсылка: [Google Meet](https://meet.google.com)",time:"09:10",ts:new Date(2026,5,14,9,10).toISOString(),pinned:false,attachments:[]},
      ]},
      {id:"sf2",name:"Идеи",icon:"fIdea",color:"#F5A623",notes:[
        {id:"n3",text:"Добавить _авторизацию_ через **Google**",time:"вчера",ts:new Date(2026,5,13,18,30).toISOString(),pinned:false,attachments:[]},
      ]},
    ]},
    {id:"f2",name:"Личное",icon:"fHome",color:"#F5A623",unread:0,subfolders:[
      {id:"sf3",name:"Покупки",icon:"fCart",color:"#F5A623",notes:[
        {id:"n4",text:"Молоко, хлеб, **яйца**, сыр",time:"08:45",ts:new Date(2026,5,14,8,45).toISOString(),pinned:false,attachments:[]},
      ]},
    ]},
  ],
};
const defaultAutoSave = { mode:"off" }; // off | change | 1h | 1d | 1w | 1mo

let _uidc = 0;
const uid = (p="n")=>`${p}${Date.now().toString(36)}${(_uidc++).toString(36)}${Math.floor(Math.random()*1e6).toString(36)}`;

// Гарантируем уникальность id у всех заметок (миграция старых данных и дубликатов)
function dedupeIds(data){
  if(!data||!data.folders) return data;
  const seen=new Set();
  data.folders.forEach(f=>(f.subfolders||[]).forEach(s=>(s.notes||[]).forEach(n=>{
    if(!n.id || seen.has(n.id)){ n.id=uid("n"); }
    seen.add(n.id);
    (n.attachments||[]).forEach(a=>{ if(!a.id) a.id=uid("a"); });
  })));
  return data;
}

function loadData() { try { const r=localStorage.getItem(SK); return dedupeIds(r?JSON.parse(r):defaultData); } catch { return defaultData; } }
function saveData(d) { try { localStorage.setItem(SK,JSON.stringify(d)); } catch {} }
function loadAS()   { try { const r=localStorage.getItem(AS_KEY); return r?JSON.parse(r):defaultAutoSave; } catch { return defaultAutoSave; } }
function saveAS(s)  { try { localStorage.setItem(AS_KEY,JSON.stringify(s)); } catch {} }

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
const COLORS = ["#EF6C00","#F5A623","#FF8A3D","#D2691E","#C75B39","#8D6E63","#A1887F","#BCAAA4"];
const ICONS_F = ["fFolder","fWork","fHome","fBook","fGame","fMusic","fPlane","fHeart","fStar","fFire","fLeaf","fArt"];
const ICONS_S = ["fNote","fIdea","fCart","fGym","fPin","fBookmark","fFolder","fNote","fFlask","fTarget","fLeaf","fLock"];
const strip = t=>(t||"").replace(/\*\*|_|~~|\|\||`|\[.*?\]\(.*?\)/g,"").slice(0,52);
const tnow  = ()=>new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
const MES = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
function tstamp(d){ return (d?new Date(d):new Date()).toISOString(); } // храним ISO
// Формат метки: wordMonth=false -> "10:24 01.12.1997"; true -> "10:24 01.Дек.1997"
function fmtStamp(iso){
  let d; try{ d=new Date(iso); if(isNaN(d)) return iso; }catch{ return iso; }
  const p=n=>String(n).padStart(2,"0");
  const hh=p(d.getHours()), mm=p(d.getMinutes());
  const dd=p(d.getDate()), mo=p(d.getMonth()+1), yy=p(d.getFullYear()%100);
  return `${hh}:${mm}, ${dd}.${mo}.${yy}`;
}
const fsize = b=>b<1024?b+" Б":b<1048576?(b/1024).toFixed(1)+" КБ":(b/1048576).toFixed(1)+" МБ";
function ficon(t="") {
  if(t.startsWith("image/"))return IC.gallery; if(t.startsWith("video/"))return IC.video;
  if(t.startsWith("audio/"))return IC.audio; if(t.includes("pdf"))return IC.doc;
  if(t.includes("word")||t.includes("document"))return IC.doc;
  if(t.includes("sheet")||t.includes("excel"))return IC.doc;
  if(t.includes("zip")||t.includes("rar"))return IC.archive;
  if(t.startsWith("text/"))return IC.text; return IC.file;
}
function fcat(t="") { // category for media browser
  if(t.startsWith("image/"))return"photo";
  if(t.startsWith("video/"))return"video";
  if(t.startsWith("audio/"))return"audio";
  if(t.includes("pdf")||t.includes("word")||t.includes("document")||t.includes("sheet")||t.startsWith("text/"))return"doc";
  if(t.startsWith("http")||t==="link")return"link";
  return"file";
}

// ═══════════════════════════════════════════════
// AES-256-GCM
// ═══════════════════════════════════════════════
async function aesEncrypt(plain, pwd) {
  const enc=new TextEncoder();
  const salt=crypto.getRandomValues(new Uint8Array(16));
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const km=await crypto.subtle.importKey("raw",enc.encode(pwd),"PBKDF2",false,["deriveKey"]);
  const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:310000,hash:"SHA-256"},km,{name:"AES-GCM",length:256},false,["encrypt"]);
  const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,enc.encode(plain));
  const out=new Uint8Array(16+12+ct.byteLength);
  out.set(salt,0);out.set(iv,16);out.set(new Uint8Array(ct),28);
  return btoa(String.fromCharCode(...out));
}

// ═══════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════
function Av({ icon, img, color, size=44, onClick }) {
  return <div onClick={onClick} style={{width:size,height:size,borderRadius:"50%",background:color,display:"flex",
    alignItems:"center",justifyContent:"center",fontSize:size*.4,flexShrink:0,overflow:"hidden",
    boxShadow:`0 2px 8px ${color}55`,cursor:onClick?"pointer":"default"}}>
    {img?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(IC[icon]?<span style={{display:"flex",color:"#fff"}}>{IC[icon]}</span>:icon)}
  </div>;
}

function Sheet({ open, onClose, title="", children }) {
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
      display:"flex",alignItems:"flex-end",zIndex:300,backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"#241C16",
        borderRadius:"20px 20px 0 0",padding:"20px 20px 36px",animation:"sUp .22s ease",
        maxHeight:"88vh",overflowY:"auto"}}>
        {title&&<div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

function Dlg({ open, msg, onYes, onNo }) {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:500,backdropFilter:"blur(4px)",padding:"0 24px"}}>
      <div style={{background:"#241C16",borderRadius:16,padding:24,width:"100%",maxWidth:340,animation:"fS .18s ease"}}>
        <div style={{fontSize:15,color:"#F2EAE0",marginBottom:20,lineHeight:1.5}}>{msg}</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onNo}  style={{flex:1,background:"#241C16",border:"none",borderRadius:12,padding:12,color:"#B0A498",fontSize:15,cursor:"pointer"}}>Отмена</button>
          <button onClick={onYes} style={{flex:1,background:"#E05252",border:"none",borderRadius:12,padding:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

// Generic dropdown menu (inline positioned by caller)
function DropMenu({ items, onClose, style:extraStyle={} }) {
  const ref=useRef(null);
  useEffect(()=>{
    function h(e){if(ref.current&&!ref.current.contains(e.target))onClose();}
    setTimeout(()=>document.addEventListener("mousedown",h),0);
    return()=>document.removeEventListener("mousedown",h);
  },[onClose]);
  return (
    <div ref={ref} style={{background:"#241C16",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.6)",
      overflow:"hidden",width:"max-content",zIndex:500,animation:"fS .15s ease",border:"1px solid #3A2E24",...extraStyle}}>
      {items.map((item,i)=>item.sep
        ?<div key={i} style={{height:1,background:"#3A2E24",margin:"2px 0"}}/>
        :<button key={i} onClick={()=>{item.fn();onClose();}}
          style={{background:"none",border:"none",padding:"10px 14px",
            color:item.danger?"#E05252":"#F2EAE0",fontSize:14,cursor:"pointer",
            textAlign:"left",display:"flex",alignItems:"center",gap:9,whiteSpace:"nowrap"}}
          onMouseEnter={e=>(e.currentTarget.style.background="#332512")}
          onMouseLeave={e=>(e.currentTarget.style.background="none")}>
          <span style={{width:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:item.special||"#B0A498"}}>{item.ic}</span>
          <span>{item.label}</span>
        </button>
      )}
    </div>
  );
}

// ─── Undo toast ──────────────────────────────────────────────
function UndoToast({ onUndo, onDone }) {
  const [sec,setSec]=useState(5);
  const [pct,setPct]=useState(100);
  useEffect(()=>{
    const t0=Date.now(),total=5000;
    const id=setInterval(()=>{
      const rem=Math.max(0,total-(Date.now()-t0));
      setPct((rem/total)*100);setSec(Math.ceil(rem/1000));
      if(rem===0){clearInterval(id);onDone();}
    },80);
    return()=>clearInterval(id);
  },[]);
  const R=13,C=2*Math.PI*R,dash=(pct/100)*C;
  return (
    <div style={{position:"fixed",bottom:72,left:10,right:10,zIndex:700,animation:"tIn .22s ease"}}>
      <div style={{background:"#241C16",borderRadius:14,overflow:"hidden",
        boxShadow:"0 6px 28px rgba(0,0,0,.55)",border:"1px solid #3A2E24"}}>
        <div style={{height:3,background:"linear-gradient(90deg,#E05252,#FF6B6B)",width:pct+"%",transition:"width .08s linear"}}/>
        <div style={{display:"flex",alignItems:"center",padding:"10px 14px",gap:12}}>
          <svg width={32} height={32} style={{flexShrink:0,transform:"rotate(-90deg)"}}>
            <circle cx={16} cy={16} r={R} fill="none" stroke="#3A2E24" strokeWidth={2.5}/>
            <circle cx={16} cy={16} r={R} fill="none" stroke="#E05252" strokeWidth={2.5}
              strokeDasharray={`${dash} ${C}`} strokeLinecap="round" style={{transition:"stroke-dasharray .08s linear"}}/>
            <text x={16} y={16} textAnchor="middle" dominantBaseline="central"
              style={{transform:"rotate(90deg)",transformOrigin:"16px 16px"}}
              fill="#E05252" fontSize={11} fontWeight={700}>{sec}</text>
          </svg>
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:"#F2EAE0",fontWeight:500}}>Заметка удалена</div>
            <div style={{fontSize:11,color:"#B0A498",marginTop:1}}>Нажмите «Отменить» для восстановления</div>
          </div>
          <button onClick={onUndo} style={{background:"#EF6C00",border:"none",borderRadius:10,
            padding:"8px 14px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0}}>
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Link dialog ──────────────────────────────────────────────
function LinkDlg({ open, selected, onClose, onInsert }) {
  const [lbl,setLbl]=useState(""); const [url,setUrl]=useState("https://");
  useEffect(()=>{if(open){setLbl(selected||"");setUrl("https://");}}, [open]);
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",display:"flex",
      alignItems:"center",justifyContent:"center",zIndex:600,backdropFilter:"blur(4px)",padding:"0 20px"}}>
      <div style={{background:"#241C16",borderRadius:16,padding:22,width:"100%",maxWidth:360,animation:"fS .18s ease"}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:16}}>🔗 Вставить ссылку</div>
        <div style={{fontSize:12,color:"#B0A498",marginBottom:5}}>Текст</div>
        <input value={lbl} onChange={e=>setLbl(e.target.value)} placeholder="Текст ссылки"
          style={{width:"100%",background:"#241C16",border:"none",borderRadius:10,padding:"10px 12px",color:"#F2EAE0",fontSize:14,marginBottom:12,outline:"none"}}/>
        <div style={{fontSize:12,color:"#B0A498",marginBottom:5}}>URL</div>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://"
          style={{width:"100%",background:"#241C16",border:"none",borderRadius:10,padding:"10px 12px",color:"#F2EAE0",fontSize:14,marginBottom:18,outline:"none"}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"#241C16",border:"none",borderRadius:12,padding:12,color:"#B0A498",cursor:"pointer",fontSize:14}}>Отмена</button>
          <button onClick={()=>{if(url.trim()){onInsert(lbl.trim()||url.trim(),url.trim());onClose();}}}
            style={{flex:1,background:"#EF6C00",border:"none",borderRadius:12,padding:12,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Вставить</button>
        </div>
      </div>
    </div>
  );
}

// ─── Link tap popup (copy / open) ────────────────────────────
function LinkPopup({ href, x, y, onClose }) {
  const ref=useRef(null);
  const [pos,setPos]=useState({top:(y||100),left:(x||40)});
  useEffect(()=>{
    if(!ref.current)return;
    const r=ref.current.getBoundingClientRect();
    let top=y,left=x;
    if(top+r.height>window.innerHeight-8)top=y-r.height-8;
    if(left+r.width>window.innerWidth-8)left=window.innerWidth-r.width-8;
    if(left<8)left=8; if(top<8)top=8;
    setPos({top,left});
    function h(e){if(ref.current&&!ref.current.contains(e.target))onClose();}
    setTimeout(()=>document.addEventListener("mousedown",h),0);
    return()=>document.removeEventListener("mousedown",h);
  },[]);
  const shortHref=href.length>40?href.slice(0,38)+"…":href;
  return (
    <div ref={ref} style={{position:"fixed",top:pos.top,left:pos.left,
      background:"#241C16",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.7)",
      overflow:"hidden",zIndex:700,animation:"fS .15s ease",border:"1px solid #3A2E24",minWidth:200}}>
      <div style={{fontSize:11,color:"#B0A498",padding:"8px 14px 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{shortHref}</div>
      {[
        {icon:"📋",label:"Копировать ссылку",fn:()=>{navigator.clipboard?.writeText(href);onClose();}},
        {icon:"↗",label:"Открыть ссылку",fn:()=>{window.open(href,"_blank");onClose();}},
      ].map((it,i)=>(
        <button key={i} onClick={it.fn} style={{width:"100%",background:"none",border:"none",
          borderTop:"1px solid #3A2E24",padding:"11px 14px",color:"#F2EAE0",fontSize:14,
          cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}
          onMouseEnter={e=>(e.currentTarget.style.background="#332512")}
          onMouseLeave={e=>(e.currentTarget.style.background="none")}>
          <span style={{fontSize:16,width:22,textAlign:"center"}}>{it.icon}</span>{it.label}
        </button>
      ))}
    </div>
  );
}

// ─── Preview modal ────────────────────────────────────────────
function PreviewModal({ open, onClose, onSend, text, atts, color }) {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",
      alignItems:"flex-end",zIndex:600,backdropFilter:"blur(4px)"}}>
      <div style={{width:"100%",background:"#241C16",borderRadius:"20px 20px 0 0",
        padding:"20px 16px 32px",animation:"sUp .22s ease",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12,color:"#B0A498"}}>Предпросмотр</div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>
          <div style={{background:"#241C16",borderRadius:"16px 4px 16px 16px",padding:"10px 14px",maxWidth:"90%"}}>
            {text&&<div style={{fontSize:15,lineHeight:1.6,color:"#F2EAE0",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              <RichText text={text} color={color}/></div>}
            {atts?.map((a,i)=><AttBubble key={i} att={a}/>)}
            <div style={{fontSize:11,color:"#B0A498",textAlign:"right",marginTop:5}}>{tnow()} ✓✓</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"#241C16",border:"none",borderRadius:12,padding:13,color:"#B0A498",cursor:"pointer",fontSize:15}}>✏️ Изменить</button>
          <button onClick={()=>{onSend();onClose();}} style={{flex:1,background:"#EF6C00",border:"none",borderRadius:12,padding:13,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:15}}>➤ Отправить</button>
        </div>
      </div>
    </div>
  );
}

// ─── Attachment bubble ────────────────────────────────────────
function AttBubble({ att }) {
  if(att.dataUrl&&att.type?.startsWith("image/")) return (
    <div style={{marginTop:8}}>
      <img src={att.dataUrl} alt={att.name} style={{maxWidth:220,width:"100%",borderRadius:10,display:"block"}}/>
      {att.caption?<div style={{fontSize:13,color:"#D8CCBE",marginTop:5,lineHeight:1.4}}>{att.caption}</div>
        :<div style={{fontSize:11,color:"#B0A498",marginTop:3}}>{att.name}</div>}
    </div>
  );
  if(att.dataUrl&&att.type?.startsWith("video/")) return (
    <div style={{marginTop:8}}>
      <video src={att.dataUrl} controls style={{maxWidth:220,borderRadius:10,display:"block"}}/>
      {att.caption&&<div style={{fontSize:13,color:"#D8CCBE",marginTop:5}}>{att.caption}</div>}
    </div>
  );
  if(att.dataUrl&&att.type?.startsWith("audio/")) return (
    <div style={{marginTop:8}}>
      <audio src={att.dataUrl} controls style={{width:"100%",maxWidth:220}}/>
      {att.caption&&<div style={{fontSize:12,color:"#D8CCBE",marginTop:3}}>{att.caption}</div>}
    </div>
  );
  return (
    <div style={{marginTop:8,background:"#15100C",borderRadius:10,padding:"8px 12px",
      display:"flex",alignItems:"center",gap:8,maxWidth:230}}>
      <span style={{color:"#EF6C00",display:"flex"}}>{ficon(att.type)}</span>
      <div style={{minWidth:0}}>
        <div style={{fontSize:13,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{att.name}</div>
        {att.caption&&<div style={{fontSize:12,color:"#D8CCBE",marginTop:2}}>{att.caption}</div>}
        <div style={{fontSize:11,color:"#B0A498"}}>{fsize(att.size)}</div>
      </div>
    </div>
  );
}

// ─── Pinned banner ────────────────────────────────────────────
function PinnedBanner({ note, color, onJump }) {
  if(!note) return null;
  return (
    <div onClick={onJump} style={{background:"#241C16",borderLeft:`3px solid ${color}`,
      padding:"7px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,
      borderBottom:"1px solid #241C16",flexShrink:0}}>
      <span style={{fontSize:14}}>📌</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color,fontWeight:600,marginBottom:1}}>Закреплено</div>
        <div style={{fontSize:13,color:"#D8CCBE",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {strip(note.text)||"Вложение"}
        </div>
      </div>
    </div>
  );
}

// ─── Media browser (Telegram-style, opens from avatar tap) ───
function MediaBrowser({ open, onClose, subf, color }) {
  const [tab,setTab]=useState("photo");
  if(!open||!subf) return null;

  const allAtts = subf.notes.flatMap(n=>(n.attachments||[]).map(a=>({...a,noteText:strip(n.text),noteTime:n.time})));
  const links   = subf.notes.flatMap(n=>{
    const parsed=parseMarkdown(n.text||"");
    return parsed.filter(p=>p.type==="link").map(p=>({href:p.href,label:p.content,noteTime:n.time}));
  });

  const cats={
    photo: {label:"Фото",    icon:IC.gallery, items:allAtts.filter(a=>a.type?.startsWith("image/"))},
    video: {label:"Видео",   icon:IC.video, items:allAtts.filter(a=>a.type?.startsWith("video/"))},
    audio: {label:"Аудио",   icon:IC.audio, items:allAtts.filter(a=>a.type?.startsWith("audio/"))},
    doc:   {label:"Файлы",   icon:IC.doc, items:allAtts.filter(a=>!a.type?.startsWith("image/")&&!a.type?.startsWith("video/")&&!a.type?.startsWith("audio/"))},
    link:  {label:"Ссылки",  icon:"🔗", items:links},
  };

  const current=cats[tab];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
      display:"flex",alignItems:"flex-end",zIndex:400,backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"#241C16",
        borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column",animation:"sUp .22s ease"}}>
        {/* Tab bar */}
        <div style={{display:"flex",borderBottom:"1px solid #241C16",flexShrink:0}}>
          {Object.entries(cats).map(([k,c])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,background:"none",border:"none",
              padding:"12px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,
              borderBottom:tab===k?`2px solid ${color}`:"2px solid transparent",
              color:tab===k?color:"#B0A498",transition:"color .15s"}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <span style={{fontSize:10}}>{c.label} {c.items.length>0?`(${c.items.length})`:""}</span>
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:12}}>
          {current.items.length===0&&<div style={{textAlign:"center",color:"#B0A498",marginTop:30,fontSize:14}}>Нет файлов в этой категории</div>}
          {tab==="photo"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
              {current.items.map((a,i)=>(
                <img key={i} src={a.dataUrl} alt={a.name} style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:8}}/>
              ))}
            </div>
          )}
          {tab==="video"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {current.items.map((a,i)=>(
                <div key={i}><video src={a.dataUrl} controls style={{width:"100%",borderRadius:10}}/></div>
              ))}
            </div>
          )}
          {tab==="audio"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {current.items.map((a,i)=>(
                <div key={i} style={{background:"#241C16",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:"#EF6C00",display:"flex"}}>{IC.audio}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                    <div style={{fontSize:11,color:"#B0A498"}}>{a.noteTime}</div>
                  </div>
                  <audio src={a.dataUrl} controls style={{height:32,width:120}}/>
                </div>
              ))}
            </div>
          )}
          {tab==="doc"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {current.items.map((a,i)=>(
                <div key={i} style={{background:"#241C16",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:"#EF6C00",display:"flex"}}>{ficon(a.type)}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                    <div style={{fontSize:11,color:"#B0A498"}}>{fsize(a.size)} · {a.noteTime}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab==="link"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {current.items.map((l,i)=>(
                <a key={i} href={l.href} target="_blank" rel="noreferrer"
                  style={{background:"#241C16",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",
                    gap:10,textDecoration:"none",color:"inherit"}}>
                  <span style={{fontSize:20}}>🔗</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"#EF6C00",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.label}</div>
                    <div style={{fontSize:11,color:"#B0A498",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.href}</div>
                    <div style={{fontSize:10,color:"#8A7A65",marginTop:2}}>{l.noteTime}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
        <div style={{padding:"12px 16px 24px",borderTop:"1px solid #241C16",flexShrink:0}}>
          <button onClick={onClose} style={{width:"100%",background:"#241C16",border:"none",borderRadius:12,padding:13,color:"#B0A498",cursor:"pointer",fontSize:14}}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}


// ─── Folder form ──────────────────────────────────────────────
function FolderForm({ title, initName="", initIcon="fFolder", initColor, icons, onSubmit, btnLabel="Сохранить" }) {
  const [name,setName]=useState(initName);
  const [icon,setIcon]=useState(initIcon);
  const [color,setColor]=useState(initColor||COLORS[0]);
  return (
    <>
      <div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{title}</div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Название"
        style={{width:"100%",background:"#241C16",border:"none",borderRadius:12,
          padding:"12px 14px",color:"#F2EAE0",fontSize:15,marginBottom:14,outline:"none"}}/>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12,color:"#B0A498",marginBottom:8}}>Иконка</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
          {icons.map(k=>(
            <button key={k} onClick={()=>setIcon(k)}
              style={{width:42,height:42,borderRadius:"50%",cursor:"pointer",border:icon===k?"2px solid "+color:"1px solid #3A2E24",
                background:icon===k?color:"#2E251C",color:icon===k?"#fff":"#B0A498",
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all .12s"}}>
              {IC[k]||IC.fFolder}
            </button>
          ))}
        </div>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:12,color:"#B0A498",marginBottom:8}}>Цвет</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {COLORS.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:28,height:28,borderRadius:"50%",
            background:c,cursor:"pointer",border:color===c?"3px solid #fff":"3px solid transparent",transition:"border .15s"}}/>)}
        </div>
      </div>
      <button onClick={()=>name.trim()&&onSubmit(name.trim(),icon,color)}
        style={{width:"100%",background:color,border:"none",borderRadius:14,padding:14,
          color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",opacity:name.trim()?1:.5}}>
        {btnLabel}
      </button>
    </>
  );
}

// ─── Floating "Aa" format button ──────────────────────────────
// Popup appears 75px above the button (clear of Android selection toolbar)
function FloatFmtBtn({ taRef, value, onChange, onLinkClick }) {
  const [open,setOpen]=useState(false);
  function wrap(b,a,sample) {
    const el=taRef.current; if(!el)return;
    const s=el.selectionStart,e=el.selectionEnd,sel=value.slice(s,e)||sample;
    onChange(value.slice(0,s)+b+sel+a+value.slice(e));
    setTimeout(()=>{el.focus();const p=s+b.length+sel.length+a.length;el.setSelectionRange(p,p);},0);
    setOpen(false);
  }
  // Telegram formatting options (identical set)
  const fmtItems=[
    {label:"B",   style:{fontWeight:700},                    title:"Жирный",         fn:()=>wrap("**","**","текст")},
    {label:"I",   style:{fontStyle:"italic"},                title:"Курсив",          fn:()=>wrap("_","_","текст")},
    {label:"S",   style:{textDecoration:"line-through"},     title:"Зачёркнутый",     fn:()=>wrap("~~","~~","текст")},
    {label:"M",   style:{fontFamily:"monospace",fontSize:11},title:"Моноширинный",    fn:()=>wrap("`","`","код")},
    {label:"||",  style:{opacity:.7},                        title:"Спойлер",         fn:()=>wrap("||","||","текст")},
    {label:">",   style:{fontStyle:"italic",opacity:.8},     title:"Цитата",          fn:()=>wrap("> ","","текст")},
    {label:"🔗",  style:{},                                  title:"Ссылка",          fn:()=>{setOpen(false);onLinkClick();}},
  ];
  return (
    <div style={{position:"relative",flexShrink:0}}>
      {open&&(
        <>
          <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:49}}/>
          <div style={{position:"absolute",bottom:"calc(100% + 75px)",right:0,
            background:"#241C16",borderRadius:12,padding:"5px 6px",display:"flex",gap:2,alignItems:"center",
            boxShadow:"0 6px 24px rgba(0,0,0,.6)",border:"1px solid #3A2E24",
            animation:"fS .15s ease",zIndex:60,whiteSpace:"nowrap"}}>
            <div style={{position:"absolute",bottom:-7,right:12,width:0,height:0,
              borderLeft:"7px solid transparent",borderRight:"7px solid transparent",borderTop:"7px solid #3A2E24"}}/>
            <div style={{position:"absolute",bottom:-5,right:13,width:0,height:0,
              borderLeft:"6px solid transparent",borderRight:"6px solid transparent",borderTop:"6px solid #241C16"}}/>
            {fmtItems.map((it,i)=>(
              <button key={i} onMouseDown={e=>e.preventDefault()} onClick={it.fn} title={it.title}
                style={{background:"none",border:"none",borderRadius:8,padding:"7px 10px",
                  cursor:"pointer",color:"#F2EAE0",fontSize:13,...it.style}}
                onMouseEnter={e=>(e.currentTarget.style.background="#332512")}
                onMouseLeave={e=>(e.currentTarget.style.background="none")}>
                {it.label}
              </button>
            ))}
          </div>
        </>
      )}
      <button onMouseDown={e=>e.preventDefault()} onClick={()=>setOpen(v=>!v)}
        style={{width:40,height:40,borderRadius:"50%",background:open?"#EF6C00":"#241C16",
          border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:open?"#fff":"#B0A498",transition:"background .15s",flexShrink:0}}>
        Aa
      </button>
    </div>
  );
}

// ─── Floating draggable tools (format + preview) — typing mode only ───
function FloatingTools({ taRef, value, onChange, onLinkClick, onPreview }) {
  const [fmtOpen,setFmtOpen]=useState(false);
  const [pos,setPos]=useState({x:null,y:null}); // null → default anchor
  const drag=useRef(null);

  function wrap(b,a,sample) {
    const el=taRef.current; if(!el)return;
    const s=el.selectionStart,e=el.selectionEnd,sel=value.slice(s,e)||sample;
    onChange(value.slice(0,s)+b+sel+a+value.slice(e));
    setTimeout(()=>{el.focus();const p=s+b.length+sel.length+a.length;el.setSelectionRange(p,p);},0);
    setFmtOpen(false);
  }
  const fmtItems=[
    {label:"B",   style:{fontWeight:700},                     fn:()=>wrap("**","**","текст")},
    {label:"I",   style:{fontStyle:"italic"},                 fn:()=>wrap("_","_","текст")},
    {label:"S",   style:{textDecoration:"line-through"},      fn:()=>wrap("~~","~~","текст")},
    {label:"M",   style:{fontFamily:"monospace",fontSize:11}, fn:()=>wrap("`","`","код")},
    {label:"||",  style:{opacity:.7},                         fn:()=>wrap("||","||","текст")},
    {label:">",   style:{fontStyle:"italic",opacity:.8},      fn:()=>wrap("> ","","текст")},
    {label:"🔗",  style:{},                                   fn:()=>{setFmtOpen(false);onLinkClick();}},
  ];

  // dragging
  function onDown(e){
    const t=e.touches?e.touches[0]:e;
    drag.current={dx:t.clientX-(pos.x??t.clientX),dy:t.clientY-(pos.y??t.clientY),moved:false};
  }
  function onMove(e){
    if(!drag.current)return;
    const t=e.touches?e.touches[0]:e;
    drag.current.moved=true;
    setPos({x:t.clientX-drag.current.dx,y:t.clientY-drag.current.dy});
  }
  function onUp(){ drag.current=null; }

  // default position: bottom-right above input
  const style = pos.x!==null
    ? {position:"fixed",left:Math.max(8,Math.min(pos.x,window.innerWidth-120)),top:Math.max(60,Math.min(pos.y,window.innerHeight-160)),zIndex:120}
    : {position:"absolute",right:14,bottom:"calc(100% + 16px)",zIndex:120};

  return (
    <div style={style}
      onMouseMove={onMove} onMouseUp={onUp} onTouchMove={onMove} onTouchEnd={onUp}>
      {/* Format popup */}
      {fmtOpen&&(
        <div style={{position:"absolute",bottom:"calc(100% + 8px)",right:0,
          background:"#241C16",borderRadius:12,padding:"5px 6px",display:"flex",gap:2,
          boxShadow:"0 6px 24px rgba(0,0,0,.6)",border:"1px solid #3A2E24",animation:"fS .15s ease",whiteSpace:"nowrap"}}>
          {fmtItems.map((it,i)=>(
            <button key={i} onMouseDown={e=>e.preventDefault()} onClick={it.fn}
              style={{background:"none",border:"none",borderRadius:8,padding:"7px 10px",
                cursor:"pointer",color:"#F2EAE0",fontSize:13,...it.style}}
              onMouseEnter={e=>(e.currentTarget.style.background="#332512")}
              onMouseLeave={e=>(e.currentTarget.style.background="none")}>{it.label}</button>
          ))}
        </div>
      )}
      {/* The pill: drag handle + Aa + preview */}
      <div style={{display:"flex",alignItems:"center",gap:4,background:"#241C16",borderRadius:24,
        padding:"4px",boxShadow:"0 4px 18px rgba(0,0,0,.55)",border:"1px solid #3A2E24"}}>
        {/* drag handle */}
        <div onMouseDown={onDown} onTouchStart={onDown}
          style={{width:26,height:36,display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"grab",color:"#7A6A55",fontSize:16,touchAction:"none"}}>⠿</div>
        <button onMouseDown={e=>e.preventDefault()} onClick={()=>setFmtOpen(v=>!v)} title="Форматирование"
          style={{width:38,height:38,borderRadius:"50%",background:fmtOpen?"#EF6C00":"#241C16",border:"none",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:700,color:fmtOpen?"#fff":"#B0A498"}}>Aa</button>
        <button onClick={onPreview} title="Предпросмотр"
          style={{width:38,height:38,borderRadius:"50%",background:"#241C16",border:"none",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,color:"#B0A498"}}>{IC.eye}</button>
      </div>
    </div>
  );
}

// ─── Export sheet ─────────────────────────────────────────────
function ExportSheet({ open, onClose, data, asSettings, setAsSettings }) {
  const [usePwd,setUsePwd]=useState(false);
  const [pwd,setPwd]=useState("");
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");

  const AS_MODES=[
    {val:"off",     label:"Выключено"},
    {val:"change",  label:"При каждом изменении"},
    {val:"1h",      label:"Раз в час"},
    {val:"1d",      label:"Раз в день"},
    {val:"1w",      label:"Раз в неделю"},
    {val:"1mo",     label:"Раз в месяц"},
  ];

  async function doSave(encrypt) {
    setBusy(true);setMsg("");
    const json=JSON.stringify(data,null,2);
    let content=json,ext="json",mime="application/json";
    if(encrypt){
      if(!pwd.trim()){setMsg("⚠️ Введите пароль");setBusy(false);return;}
      try{
        content=await aesEncrypt(json,pwd.trim());
        ext="aes256";mime="text/plain";
        setMsg("🔒 AES-256-GCM, PBKDF2·310k iter");
      }catch{setMsg("❌ Ошибка шифрования");setBusy(false);return;}
    }
    const dt=new Date().toISOString().slice(0,10);
    const blob=new Blob([content],{type:mime});
    if(window.showSaveFilePicker){
      try{
        const fh=await window.showSaveFilePicker({suggestedName:`notes_${dt}.${ext}`,types:[{description:"Notes",accept:{[mime]:[`.${ext}`]}}]});
        const w=await fh.createWritable();await w.write(blob);await w.close();
        setMsg("✅ Сохранено в выбранную папку");
      }catch(e){if(e&&e.name!=="AbortError")setMsg("❌ "+(e.message||"Ошибка"));}
    }else{
      const u=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=u;a.download=`notes_${dt}.${ext}`;a.click();URL.revokeObjectURL(u);
      setMsg("📥 Файл скачан");
    }
    setBusy(false);
  }

  return (
    <Sheet open={open} onClose={onClose} title="💾 Экспорт / сохранение">
      {/* Auto-save options */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:13,color:"#B0A498",marginBottom:8,fontWeight:600}}>Автосохранение</div>
        {AS_MODES.map(m=>(
          <div key={m.val} onClick={()=>{setAsSettings({mode:m.val});saveAS({mode:m.val});}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
              background:"#241C16",borderRadius:10,marginBottom:6,cursor:"pointer",
              border:asSettings.mode===m.val?"1px solid #EF6C00":"1px solid transparent"}}>
            <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(asSettings.mode===m.val?"#EF6C00":"#5A4C40"),
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {asSettings.mode===m.val&&<div style={{width:8,height:8,borderRadius:"50%",background:"#EF6C00"}}/>}
            </div>
            <span style={{fontSize:14,color:"#F2EAE0"}}>{m.label}</span>
          </div>
        ))}
      </div>
      <div style={{height:1,background:"#241C16",margin:"16px 0"}}/>
      <div style={{background:"#1A2B1A",border:"1px solid #2A4A2A",borderRadius:12,
        padding:"10px 14px",marginBottom:14,fontSize:13,color:"#7EC87E",lineHeight:1.5}}>
        Android Chrome 86+: «Сохранить» открывает системный диалог выбора папки.
        Сохраняйте в Google Drive / Dropbox для автосинхронизации.
      </div>
      <div onClick={()=>setUsePwd(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,
        background:"#241C16",borderRadius:12,padding:"12px 14px",cursor:"pointer",marginBottom:12}}>
        <div style={{width:22,height:22,borderRadius:6,
          background:usePwd?"#9B59B6":"#241C16",border:"2px solid "+(usePwd?"#9B59B6":"#5A4C40"),
          display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s",flexShrink:0}}>
          {usePwd&&<span style={{fontSize:13,color:"#fff"}}>✓</span>}
        </div>
        <div>
          <div style={{fontSize:14,color:"#F2EAE0",fontWeight:500}}>🔒 Зашифровать AES-256-GCM</div>
          <div style={{fontSize:11,color:"#B0A498",marginTop:1}}>PBKDF2 + 310 000 итераций</div>
        </div>
      </div>
      {usePwd&&<input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Пароль..."
        style={{width:"100%",background:"#241C16",border:"none",borderRadius:10,padding:"11px 14px",
          color:"#F2EAE0",fontSize:14,marginBottom:12,outline:"none"}}/>}
      {msg&&<div style={{fontSize:13,color:"#7EC87E",marginBottom:10}}>{msg}</div>}
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>doSave(false)} disabled={busy}
          style={{flex:1,background:"#241C16",border:"none",borderRadius:12,padding:13,
            color:"#F2EAE0",cursor:"pointer",fontSize:14,opacity:busy?0.5:1}}>⬇ JSON</button>
        <button onClick={()=>doSave(usePwd)} disabled={busy}
          style={{flex:1,background:usePwd?"#9B59B6":"#EF6C00",border:"none",borderRadius:12,
            padding:13,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14,opacity:busy?0.5:1}}>
          {busy?"⏳...":(usePwd?"🔒 Сохранить":"💾 Сохранить")}
        </button>
      </div>
    </Sheet>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function App() {
  const [multiSelect, setMultiSelect] = useState([]); // ids of multi-selected notes
  const [moveBuffer, setMoveBuffer] = useState(null); // {mode, notes[]}
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [selCopy, setSelCopy] = useState(null); // {x,y,text} плавающая кнопка копирования выделенного текста
  const [data,      setData]      = useState(loadData);
  const [scr,       setScr]       = useState("main");
  const [fid,       setFid]       = useState(null);
  const [sid,       setSid]       = useState(null);
  const [search,    setSearch]    = useState("");
  const [note,      setNote]      = useState("");
  const drafts = useRef(loadDrafts());
  const [patts,     setPatts]     = useState([]);
  const [modal,     setModal]     = useState(null);
  const [dlg,       setDlg]       = useState(null);
  // edit in main input field
  const [editId,    setEditId]    = useState(null); // note being edited
  const [taHeight,  setTaHeight]  = useState(null); // explicit textarea height (px) or null=auto
  const [recording, setRecording] = useState(false);
  const [wordMonth, setWordMonth] = useState(false); // переключатель формата месяца в дате
  const [micMode, setMicMode] = useState(false); // false=отправка, true=микрофон (при пустом поле)
  const mediaRec = useRef(null);
  const recChunks = useRef([]);
  const recHeld = useRef(false);
  const holdTimer = useRef(null);
  function micPressStart(){
    recHeld.current=false;
    holdTimer.current=setTimeout(()=>{ recHeld.current=true; startRec(); }, 250);
  }
  function micPressEnd(){
    clearTimeout(holdTimer.current);
    if(recHeld.current){ recHeld.current=false; stopRec(); }   // было удержание → стоп+отправка
    else { setMicMode(false); }                                // короткий тап → назад к отправке
  }
  const [undo,      setUndo]      = useState(null);
  const [toast,     setToast]     = useState(null);
  const [attSh,     setAttSh]     = useState(false);
  const [expSh,     setExpSh]     = useState(false);
  const [lnkDlg,    setLnkDlg]   = useState(false);
  const [lnkSel,    setLnkSel]   = useState("");
  const [prevSh,    setPrevSh]    = useState(false);
  const [capDlg,    setCapDlg]   = useState(null);
  const [capTx,     setCapTx]    = useState("");
  const [asSettings,setAsSettings]= useState(loadAS);
  // context menu on note (long-press)
  const [noteCtx,   setNoteCtx]  = useState(null);
  // link popup
  const [linkPopup, setLinkPopup]= useState(null);
  // clipboard for move/copy
  const [clipboard, setClipboard]= useState(null); // {note, mode:"cut"|"copy", fromFid, fromSid}
  // media browser
  const [mediaBrowser,setMediaBrowser]=useState(false);
  // dropdown menus
  const [folderMenu, setFolderMenu]=useState(null);
  const [subMenu,    setSubMenu]   =useState(null);
  const [hdrMenu,    setHdrMenu]   =useState(null);
  // keyboard / focus (to hide UI while typing)
  const [isTyping, setIsTyping] = useState(false);
  // double-tap text selection mode (note id)
  const [selectMode, setSelectMode] = useState(null);
  // floating action buttons: which note is at the bottom of the viewport
  const [activeNote, setActiveNote] = useState(null); // {id, btnTop}
  const [inputH, setInputH] = useState(96); // measured input-area height
  const [chatSearch, setChatSearch] = useState(""); // search query within current subfolder

  const bottomRef    = useRef(null);
  const pinRef       = useRef(null);
  const taRef        = useRef(null);
  const fileRef      = useRef(null);
  const importRef    = useRef(null);
  const iconRef      = useRef(null);
  const lpTimer      = useRef(null);  // long-press timer
  const lpScrolled   = useRef(false); // detect scroll during long-press
  const asTimer      = useRef(null);  // auto-save timer
  const lastTap      = useRef({id:null,t:0}); // double-tap detection
  const touchUsed    = useRef(false); // guard synthetic mouse after touch
  const lpFired      = useRef(false); // long-press already opened menu
  const justEnteredSel = useRef(null); // id пузыря, чей хвостовой клик глушим
  const bubbleEls    = useRef({}); // note id -> element
  const scrollRef    = useRef(null); // chat scroll container
  const inputAreaRef = useRef(null); // input area for height measure
  const scrollPos    = useRef({}); // sid -> scrollTop (запоминаем позицию)

  // ── Auto-save on schedule ──
  useEffect(()=>{
    if(asTimer.current) clearInterval(asTimer.current);
    const intervals={off:null,"1h":3600000,"1d":86400000,"1w":604800000,"1mo":2592000000};
    const ms=intervals[asSettings.mode];
    if(ms){
      asTimer.current=setInterval(()=>{ saveData(data); },ms);
    }
    return()=>{if(asTimer.current)clearInterval(asTimer.current);};
  },[asSettings.mode,data]);

  useEffect(()=>{
    if(scr==="chat" && scrollRef.current){
      setTimeout(()=>{
        const sc=scrollRef.current; if(!sc) return;
        const saved=scrollPos.current[sid];
        // если для темы есть сохранённая позиция — туда, иначе вниз (первый вход)
        sc.scrollTop = (saved!==undefined) ? saved : sc.scrollHeight;
        updateActiveNote();
      },60);
    }
  },[scr,sid]);
  // Сохранять позицию прокрутки при входе/выходе из режимов выделения (чтобы не скакало)
  const preserveScroll = useRef(null);
  useLayoutEffect(()=>{
    const sc=scrollRef.current;
    if(scr==="chat" && sc && preserveScroll.current!==null){
      sc.scrollTop = preserveScroll.current;
      preserveScroll.current = null;
    }
  },[selectMode, multiSelect.length, chatSearch]);
  // Черновик: сохраняем текст поля по теме (кроме режима редактирования)
  useEffect(()=>{
    if(scr==="chat" && sid && !editId){
      if(note && note.trim()!==""){ drafts.current[sid]=note; }
      else { delete drafts.current[sid]; }
      saveDrafts(drafts.current);
    }
  },[note, sid, scr, editId]);
  // recompute floating buttons when notes or input height change
  useEffect(()=>{ if(scr==="chat") updateActiveNote(); },[data,inputH,isTyping]);
  // measure input area height
  useEffect(()=>{
    if(inputAreaRef.current) setInputH(inputAreaRef.current.offsetHeight);
  });

  const folder = data.folders.find(f=>f.id===fid);
  const subf   = folder?.subfolders.find(s=>s.id===sid);
  const _allNotes = subf ? subf.notes : [];
  const snotes = chatSearch.trim()
    ? _allNotes.filter(n=>strip(n.text).toLowerCase().includes(chatSearch.trim().toLowerCase()))
    : _allNotes;
  const pinned = subf?.notes.find(n=>n.pinned)||null;
  const subColor = subf?.color||"#EF6C00";

  function upd(fn) {
    setData(d=>{
      const n=fn(d); saveData(n);
      // auto-save on change mode
      if(asSettings.mode==="change") saveData(n);
      return n;
    });
  }
  function tst(m) { setToast(m); setTimeout(()=>setToast(null),2200); }

  // ── Nav ──
  function openF(f) { setFid(f.id); setScr("sub"); }
  function openS(s) {
    setSid(s.id); setScr("chat"); cancelEdit(); setChatSearch(""); setSelectMode(null); setMultiSelect([]);
    const dr = drafts.current[s.id] || "";
    setNote(dr);
    if(dr) setIsTyping(true);
  }
  function back()   {
    if(multiSelect.length){setMultiSelect([]);return;}
    if(selectMode){setSelectMode(null);return;}
    if(scr==="chat"){setScr("sub");cancelEdit();setChatSearch("");}
    else if(scr==="sub")setScr("main");
  }

  // ── Folder CRUD ──
  function mkF(n,i,c)  { upd(d=>({...d,folders:[...d.folders,{id:"f"+Date.now(),name:n,icon:i,color:c,unread:0,subfolders:[]}]})); setModal(null); }
  function renF(n,i,c) { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,name:n,icon:i,color:c})})); setModal(null); }
  function delF(id)    { upd(d=>({...d,folders:d.folders.filter(f=>f.id!==id)})); if(fid===id){setFid(null);setScr("main");} }

  // ── Subfolder CRUD ──
  function mkS(n,i,c)  { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:[...f.subfolders,{id:uid("sf"),name:n,icon:i,color:c,notes:[]}]})})); setModal(null); }
  function renS(n,i,c) { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,name:n,icon:i,color:c})})})); setModal(null); }
  function delS(id)    { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.filter(s=>s.id!==id)})})); if(sid===id){setSid(null);setScr("sub");} }

  // ── Edit in main input ──
  function startEdit(n) {
    setEditId(n.id);
    setNote(n.text||"");
    setPatts(n.attachments||[]);
    setNoteCtx(null);
    setSelectMode(null);
  }
  function cancelEdit() {
    setEditId(null); setNote(""); setPatts([]); setIsTyping(false); setTaHeight(null); manualResize.current=false; if(sid){ delete drafts.current[sid]; saveDrafts(drafts.current); }
    if(taRef.current){ taRef.current.style.height="auto"; }
  }
  function saveEdit() {
    if(!note.trim()&&patts.length===0) return;
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:s.notes.map(n=>n.id===editId?{...n,text:note.trim(),attachments:patts,time:tnow(),ts:tstamp()}:n)})})}));
    cancelEdit();
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  // ── Notes ──
  function send() {
    if(!note.trim()&&patts.length===0) return;
    if(editId) { saveEdit(); return; }
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:[...s.notes,{id:uid("n"),text:note.trim(),time:tnow(),ts:tstamp(),pinned:false,attachments:patts}]})})}));
    setNote(""); setPatts([]); setIsTyping(false); setTaHeight(null); manualResize.current=false; if(sid){ delete drafts.current[sid]; saveDrafts(drafts.current); }
    if(taRef.current) taRef.current.style.height="auto";
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }
  // ── Multi-select ──
  function toggleMulti(id) {
    setMultiSelect(prev=>{
      const next = prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];
      return next;
    });
  }
  // single tap in multi mode toggles membership; clearing the last one exits multi mode
  useEffect(()=>{
    function onSel(){
      const sel=window.getSelection&&window.getSelection();
      const text=sel?String(sel):"";
      if(text && text.trim().length>0 && sel.rangeCount>0){
        try{
          const r=sel.getRangeAt(0).getBoundingClientRect();
          if(r && (r.width||r.height)){
            setSelCopy({x:r.left+r.width/2, y:r.top, text});
            return;
          }
        }catch(e){}
      }
      setSelCopy(null);
    }
    document.addEventListener("selectionchange",onSel);
    return ()=>document.removeEventListener("selectionchange",onSel);
  },[]);
  function copySelection(){
    if(!selCopy) return;
    const t=selCopy.text;
    const done=()=>{ tst("Текст скопирован"); setSelCopy(null); try{window.getSelection().removeAllRanges();}catch(e){} };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done).catch(()=>fallbackCopy(t,done)); }
    else fallbackCopy(t,done);
  }
  function jumpTo(noteId){
    setPinnedOpen(false);
    setTimeout(()=>{
      const el=bubbleEls.current[noteId];
      if(el){ el.scrollIntoView({behavior:"smooth",block:"center"}); }
      setHighlightId(noteId);
      setTimeout(()=>setHighlightId(null),1000);
    },60);
  }
  function clearSub(){
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:[]})})}));
  }
  function checkTap(n) {
    if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
    if(selectMode){
      // одиночное выделение: клик по чекбоксу этого же -> снять; по другому -> мультивыбор
      if(selectMode===n.id){ setSelectMode(null); }
      else { setMultiSelect([selectMode, n.id]); setSelectMode(null); }
      return;
    }
    // мультирежим: toggle; снятие последнего -> выход
    setMultiSelect(prev=>{
      const next = prev.includes(n.id)?prev.filter(x=>x!==n.id):[...prev,n.id];
      return next;
    });
  }
  function handleMultiTap(n) {
    if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
    const next = multiSelect.includes(n.id)?multiSelect.filter(x=>x!==n.id):[...multiSelect,n.id];
    if(next.length===1){ setMultiSelect([]); setSelectMode(next[0]); }   // -> одиночная панель
    else if(next.length===0){ setMultiSelect([]); setSelectMode(null); } // -> выход
    else { setMultiSelect(next); }
  }
  function startMulti(id) { setSelectMode(null); setMultiSelect([id]); }
  function clearMulti() { if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setMultiSelect([]); }
  function deleteMulti() {
    const ids=new Set(multiSelect);
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:s.notes.filter(n=>!ids.has(n.id))})})}));
    clearMulti();
  }
  function copyTextMulti(){
    const chosen=(subf?.notes||[]).filter(n=>multiSelect.includes(n.id));
    const text=chosen.map(n=>(n.text||"")).filter(Boolean).join("\n\n");
    const done=()=>tst("Текст скопирован");
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done)); }
    else fallbackCopy(text,done);
  }
  function copyMulti(mode, ids) {
    const sel = ids || multiSelect;
    const chosen=(subf?.notes||[]).filter(n=>sel.includes(n.id));
    setMoveBuffer({mode, notes:chosen.map(n=>({...n}))});
    if(mode==="cut") deleteMultiIds(sel); else clearMulti();
  }
  function deleteMultiIds(ids){
    const set=new Set(ids);
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:s.notes.filter(n=>!set.has(n.id))})})}));
    clearMulti();
  }
  function pasteMulti() {
    if(!moveBuffer) return;
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,
      notes:[...s.notes, ...moveBuffer.notes.map((n,i)=>({...n,id:uid("n"),pinned:false,time:tnow(),ts:tstamp()}))]})})}));
    setMoveBuffer(null);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  function softDel(n) {
    setUndo(null);
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:s.notes.filter(x=>x.id!==n.id)})})}));
    setUndo({note:n,fid,sid});
  }
  function undoDel() {
    if(!undo) return;
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==undo.fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==undo.sid?s:{...s,notes:[...s.notes,undo.note]})})}));
    setUndo(null);
  }
  function pin(nid) {
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:s.notes.map(n=>n.id===nid?{...n,pinned:!n.pinned}:n)})})}));
  }

  // ── Copy / Cut / Paste ──
  function copyText(n) {
    const plain = (n.text||"").replace(/\*\*|__|~~|\|\||`/g,"").replace(/\[(.*?)\]\((.*?)\)/g,"$1");
    const done=()=>tst("Текст скопирован");
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(plain).then(done).catch(()=>fallbackCopy(plain,done));
    } else { fallbackCopy(plain,done); }
  }
  function fallbackCopy(text, cb){
    try{
      const ta=document.createElement("textarea");
      ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta); cb&&cb();
    }catch(e){ tst("Не удалось скопировать"); }
  }
  function copyMsg(n)  { setClipboard({note:{...n,id:uid("n")},mode:"copy",fromFid:fid,fromSid:sid}); tst("📋 Сообщение скопировано"); }
  function cutMsg(n)   {
    // переносим в буфер и убираем; запоминаем оригинал для отмены
    setClipboard({note:{...n},mode:"cut",fromFid:fid,fromSid:sid,original:{...n}});
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:s.notes.filter(x=>x.id!==n.id)})})}));
    tst("✂️ Вырезано — «Вставить» или «Отмена» вернёт");
  }
  function cancelCut() {
    // отмена вырезания возвращает сообщение на место
    if(clipboard && clipboard.mode==="cut" && clipboard.original){
      const o=clipboard.original, ofid=clipboard.fromFid, osid=clipboard.fromSid;
      upd(d=>({...d,folders:d.folders.map(f=>f.id!==ofid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==osid?s:{...s,notes:[...s.notes,o]})})}));
    }
    setClipboard(null);
  }
  function pasteMsg() {
    if(!clipboard) return;
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:[...s.notes,{...clipboard.note,time:tnow(),ts:tstamp()}]})})}));
    setClipboard(null);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  // ── Запись голосового сообщения ──
  async function startRec(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(stream);
      recChunks.current=[];
      mr.ondataavailable=e=>{ if(e.data.size>0) recChunks.current.push(e.data); };
      mr.onstop=()=>{
        const blob=new Blob(recChunks.current,{type:"audio/webm"});
        const reader=new FileReader();
        reader.onload=ev=>{
          const att={id:uid("a"),name:"Голосовое сообщение",type:"audio/webm",size:blob.size,dataUrl:ev.target.result,caption:""};
          upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,notes:[...s.notes,{id:uid("n"),text:"",time:tnow(),ts:tstamp(),pinned:false,attachments:[att]}]})})}));
          setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t=>t.stop());
      };
      mr.start();
      mediaRec.current=mr;
      setRecording(true);
    }catch(err){ tst("🎤 Нет доступа к микрофону"); }
  }
  function stopRec(){
    if(mediaRec.current && mediaRec.current.state!=="inactive"){ mediaRec.current.stop(); }
    setRecording(false);
  }

  // ── Long-press (context menu) + double-tap (toggle select text) ──
  // touchUsed guards against synthetic mouse events that browsers fire after touch,
  // which otherwise turn one physical tap into a false double-tap.
  // double-tap WHILE in select mode → exit select mode
  // Tap handling while in single-select (text) mode.
  // - SINGLE tap on a DIFFERENT bubble → promote to multi-select (active + tapped).
  // - DOUBLE tap on the active bubble → exit select mode.
  function handleSelTap(n, e) {
    if(justEnteredSel.current===n.id){ return; }
    const now=Date.now();
    const dt = now-lastTap.current.t;
    if(n.id!==selectMode){
      if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
      setMultiSelect([selectMode, n.id]);
      setSelectMode(null);
      lastTap.current={id:null,t:0};
      return;
    }
    // tapped the active (single-selected) bubble → double-tap exits
    const isDoubleSame = lastTap.current.id===n.id && dt<=300 && dt>40;
    if(isDoubleSame){
      if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
      setSelectMode(null);
      lastTap.current={id:null,t:0};
    } else {
      lastTap.current={id:n.id,t:now};
    }
  }

  function bubbleLpStart(n, e) {
    if(editId) return;
    const isTouch = e.type==="touchstart";
    if(isTouch) touchUsed.current=true;
    else if(touchUsed.current) return; // игнор синтетической мыши после touch
    lpScrolled.current=false;
    if(selectMode===n.id || multiSelect.length>0) return; // в выделении — не вмешиваемся
  }
  function bubbleLpMove()  { lpScrolled.current=true; clearTimeout(lpTimer.current); }
  function bubbleLpEnd(n, e) {
    clearTimeout(lpTimer.current);
    const isTouch = e.type==="touchend";
    if(!isTouch && touchUsed.current){ setTimeout(()=>{touchUsed.current=false;},400); return; }
    if(editId){ lastTap.current={id:null,t:0}; lpFired.current=false; return; }
    if(lpScrolled.current){ lastTap.current={id:null,t:0}; lpScrolled.current=false; return; }
    if(lpFired.current){ lpFired.current=false; lastTap.current={id:null,t:0}; return; } // меню уже открыто
    // двойной тап (в окне 300мс) по тому же пузырю → выделить сообщение
    const now=Date.now();
    const fast = lastTap.current.id===n.id && (now-lastTap.current.t)<=300 && (now-lastTap.current.t)>40;
    if(fast){
      if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
      justEnteredSel.current=n.id;
      setTimeout(()=>{ justEnteredSel.current=null; },450);
      setSelectMode(n.id);
      setNoteCtx(null);
      lastTap.current={id:null,t:0};
    } else {
      lastTap.current={id:n.id,t:now};
    }
  }

  // ── Links ──
  function insertLink(label,href) {
    const ta=taRef.current;
    if(!ta){setNote(v=>v+`[${label}](${href})`);return;}
    const s=ta.selectionStart,e=ta.selectionEnd,ins=`[${label}](${href})`;
    setNote(v=>v.slice(0,s)+ins+v.slice(e));
    setTimeout(()=>{ta.focus();ta.setSelectionRange(s+ins.length,s+ins.length);},0);
  }
  function openLinkDlg() {
    const ta=taRef.current;
    setLnkSel(ta?note.slice(ta.selectionStart,ta.selectionEnd):"");
    setLnkDlg(true);
  }
  function handleLinkMenu(href,e) {
    setLinkPopup({href,x:e.clientX,y:e.clientY});
  }

  // ── Files ──
  function pickFiles(accept) { fileRef.current.accept=accept; fileRef.current.click(); setAttSh(false); }
  function onFiles(e) {
    Array.from(e.target.files||[]).forEach(file=>{
      const r=new FileReader();
      r.onload=ev=>{
        const att={id:uid("a")+Math.random(),name:file.name,type:file.type||"application/octet-stream",size:file.size,dataUrl:ev.target.result,caption:""};
        setPatts(p=>[...p,att]);
        setCapDlg(att);setCapTx("");
      };
      r.readAsDataURL(file);
    });
    e.target.value="";
  }
  function saveCaption() { setPatts(p=>p.map(a=>a.id===capDlg.id?{...a,caption:capTx}:a)); setCapDlg(null);setCapTx(""); }
  function rmPatt(id) { setPatts(p=>p.filter(a=>a.id!==id)); }

  // ── Import JSON ──
  function onIconPick(e){
    const f=e.target.files&&e.target.files[0]; if(!f){return;}
    const r=new FileReader();
    r.onload=ev=>{
      const url=ev.target.result;
      upd(d=>({...d,folders:d.folders.map(ff=>ff.id!==fid?ff:{...ff,subfolders:ff.subfolders.map(s=>s.id!==sid?s:{...s,iconImg:url})})}));
    };
    r.readAsDataURL(f); e.target.value="";
  }
  function onImport(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{try{const p=JSON.parse(ev.target.result);if(p&&p.folders){upd(()=>p);tst("✅ Импортировано");}else tst("❌ Неверный формат");}catch{tst("❌ Ошибка чтения");}};
    r.readAsText(f); e.target.value="";
  }

  // ── Context menu helpers ──
  function openFolderMenu(f,e) {
    e.stopPropagation();
    const rect=e.currentTarget.getBoundingClientRect();
    setFolderMenu({fid:f.id,f,rect});
  }
  function openSubMenu(s,e) {
    e.stopPropagation();
    const rect=e.currentTarget.getBoundingClientRect();
    setSubMenu({sid:s.id,s,rect});
  }
  function openHdrMenu(type,e) { e.stopPropagation(); setHdrMenu(v=>v===type?null:type); }

  const filtF=data.folders.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));

  // ── Keyboard detection for focus-mode ──
  function handleFocus() { setIsTyping(true); }
  function handleBlur()  { setIsTyping(false); }


  // (floating buttons removed — no scroll tracking needed)
  function updateActiveNote(){ if(scr==='chat'&&scrollRef.current&&sid){ scrollPos.current[sid]=scrollRef.current.scrollTop; } }

  // ── Auto-grow textarea ──
  function autoGrow(el) {
    if(!el || editId || manualResize.current) return; // ручной ресайз/редактирование — не трогаем
    const cap = isTyping?315:150;
    el.style.height="auto";
    const h=Math.min(el.scrollHeight, cap);
    setTaHeight(h);
  }

  // On entering edit mode: give the field a comfortable starting height (~content, capped 45vh)
  // that the user can then freely drag via the grip handle. Reset on exit.
  useEffect(()=>{
    const el=taRef.current;
    if(!el) return;
    if(editId){
      const prev=el.style.height;
      el.style.height="auto";
      const natural=el.scrollHeight;
      el.style.height=prev;
      const start=Math.min(Math.max(natural,120), Math.round(window.innerHeight*0.45));
      setTaHeight(start);
      if(document.activeElement!==el){ el.focus(); el.scrollTop=0; }
    } else {
      setTaHeight(null);
      el.style.height="auto";
    }
  },[editId]);

  // ── Drag-resize handle (edit mode) ──
  const resizeRef = useRef(null);
  const manualResize = useRef(false);
  function gripStart(e){
    if(e.cancelable) e.preventDefault();  // не терять фокус/не скроллить страницу
    const t=e.touches?e.touches[0]:e;
    manualResize.current=true;
    resizeRef.current={startY:t.clientY, startH: taHeight || (taRef.current?taRef.current.offsetHeight:120)};
    window.addEventListener("mousemove",gripMove);
    window.addEventListener("mouseup",gripEnd);
    window.addEventListener("touchmove",gripMove,{passive:false});
    window.addEventListener("touchend",gripEnd);
  }
  function gripMove(e){
    if(!resizeRef.current) return;
    if(e.cancelable) e.preventDefault();
    const t=e.touches?e.touches[0]:e;
    const dy=resizeRef.current.startY - t.clientY; // up = grow
    const maxH=Math.round(window.innerHeight*0.88);
    const h=Math.max(48, Math.min(resizeRef.current.startH + dy, maxH));
    setTaHeight(h);
  }
  function gripEnd(){
    resizeRef.current=null;
    window.removeEventListener("mousemove",gripMove);
    window.removeEventListener("mouseup",gripEnd);
    window.removeEventListener("touchmove",gripMove);
    window.removeEventListener("touchend",gripEnd);
  }

  return (
    <div
      style={{maxWidth:420,margin:"0 auto",height:"100dvh",background:"#1A1410",
        display:"flex",flexDirection:"column",fontFamily:"'Noto Sans',sans-serif",
        color:"#F2EAE0",overflow:"hidden",position:"relative"}}
      onClick={()=>{setNoteCtx(null);setHdrMenu(null);setFolderMenu(null);setSubMenu(null);setLinkPopup(null);}}
    >
      {/* Глобальная панель пересылки — снизу, над полем ввода */}
      {moveBuffer&&(
        <div onClick={e=>e.stopPropagation()} style={{position:"fixed",left:0,right:0,bottom:0,
          maxWidth:420,margin:"0 auto",background:"#2E251C",borderTop:"1px solid #3A2E24",
          padding:"12px 14px",display:"flex",alignItems:"center",gap:10,zIndex:120,
          boxShadow:"0 -4px 16px rgba(0,0,0,.4)"}}>
          <span style={{fontSize:14,color:"#B0A498",flex:1}}>
            {moveBuffer.mode==="cut"?"Переместить":"Переслать"}: {moveBuffer.notes.length}
          </span>
          {scr==="chat" ? (
            <button onClick={pasteMulti}
              style={{background:"#EF6C00",border:"none",borderRadius:8,padding:"8px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>Вставить сюда</button>
          ) : (
            <span style={{fontSize:12,color:"#8A7A65"}}>Откройте тему</span>
          )}
          <button onClick={()=>setMoveBuffer(null)} title="Отмена пересылки"
            style={{background:"#332820",border:"none",borderRadius:8,padding:"8px 11px",color:"#B0A498",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center"}}>{IC.close}</button>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;}
        input,textarea{-webkit-user-select:text;user-select:text;}
        .selectable,.selectable *{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important;cursor:text;}
        ::-webkit-scrollbar{width:0;}
        @keyframes sUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fS {from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes tIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .row:active{background:#3A2E24!important;}
        textarea:focus,input:focus{outline:none;}
        .sbtn:active{transform:scale(.9);}
        .nb{animation:fS .18s ease;}
      `}</style>

      <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={onFiles}/>
      <input ref={importRef} type="file" accept=".json,application/json" style={{display:"none"}} onChange={onImport}/>
      <input ref={iconRef} type="file" accept="image/*" style={{display:"none"}} onChange={onIconPick}/>

      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:84,left:"50%",transform:"translateX(-50%)",
        background:"#241C16",color:"#F2EAE0",borderRadius:12,padding:"10px 18px",fontSize:14,
        zIndex:650,whiteSpace:"nowrap",animation:"tIn .2s ease",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
        {toast}</div>}

      {undo&&<UndoToast onUndo={undoDel} onDone={()=>setUndo(null)}/>}

      {linkPopup&&<LinkPopup href={linkPopup.href} x={linkPopup.x} y={linkPopup.y} onClose={()=>setLinkPopup(null)}/>}

      {/* ══ HEADER — hidden in typing mode ══ */}
      {!(isTyping&&note.length>0)&&!selectMode&&multiSelect.length===0&&!(scr==="chat"&&chatSearch!=="")&&(
        <div style={{background:"#241C16",padding:"0 14px",height:62,display:"flex",alignItems:"center",
          gap:10,borderBottom:"1px solid #241C16",flexShrink:0}}>
          {scr!=="main"
            ?<button onClick={back} title="Назад"
               style={{width:38,height:38,borderRadius:"50%",background:"#241C16",border:"none",
                 color:"#F2EAE0",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",
                 justifyContent:"center",lineHeight:1,flexShrink:0}}>{IC.back}</button>
            :<span style={{fontSize:22,userSelect:"none"}}>📓</span>}

          {scr==="main"&&<div style={{fontSize:19,fontWeight:700,flex:1,letterSpacing:-.5}}>Заметки</div>}

          {scr==="sub"&&folder&&(
            <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
              <Av icon={folder.icon} color={folder.color} size={36}/>
              <div style={{minWidth:0}}>
                <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{folder.name}</div>
                <div style={{fontSize:12,color:"#B0A498"}}>{folder.subfolders.length} подпапок</div>
              </div>
            </div>
          )}

          {scr==="chat"&&subf&&(
            <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
              {/* Тап по аватару → файл-пикер для замены иконки темы */}
              <div onClick={e=>{e.stopPropagation();iconRef.current&&iconRef.current.click();}} style={{cursor:"pointer",flexShrink:0}}>
                <Av icon={subf.icon} img={subf.iconImg} color={subf.color} size={36}/>
              </div>
              {/* Тап по заголовку → медиабраузер */}
              <div onClick={e=>{e.stopPropagation();setMediaBrowser(true);}}
                style={{minWidth:0,cursor:"pointer",flex:1}}>
                <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subf.name}</div>
                <div style={{fontSize:12,color:"#B0A498"}}>{subf.notes.length} заметок</div>
              </div>
            </div>
          )}

          {/* Header right */}
          <div style={{display:"flex",gap:6,marginLeft:"auto",flexShrink:0,position:"relative"}}>
            {scr==="main"&&(
              <>
                {/* Export / save — arrow up */}
                <button onClick={()=>setExpSh(true)} title="Сохранить / экспорт"
                  style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.save}</button>
                {/* Import — arrow down */}
                <button onClick={e=>{e.stopPropagation();importRef.current&&importRef.current.click();}} title="Импорт JSON"
                  style={{width:38,height:38,background:"#241C16",border:"none",borderRadius:"50%",cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",color:"#B0A498"}}>{IC.imp}</button>
                {/* New folder — plus */}
                <button onClick={()=>setModal("mkF")} title="Новая папка"
                  style={{width:38,height:38,background:"#EF6C00",border:"none",color:"#fff",borderRadius:"50%",
                    cursor:"pointer",fontSize:22,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.plus}</button>
              </>
            )}

            {scr==="sub"&&(<>
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button onClick={e=>openHdrMenu("folder",e)}
                  style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                {hdrMenu==="folder"&&<DropMenu onClose={()=>setHdrMenu(null)}
                  style={{position:"absolute",top:"calc(100% + 6px)",right:0}}
                  items={[
                    {ic:IC.edit,label:"Переименовать папку",fn:()=>setModal("renF")},
                    {sep:true},
                    {ic:IC.trash,label:"Удалить папку",danger:true,fn:()=>setDlg({msg:`Удалить «${folder?.name}»?`,yes:()=>delF(fid)})},
                  ]}/>}
              </div>
              <button onClick={()=>setModal("mkS")}
                style={{width:38,height:38,background:"#EF6C00",border:"none",color:"#fff",borderRadius:"50%",cursor:"pointer",fontSize:22,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.plus}</button>
            </>)}

            {scr==="chat"&&(<>
              {/* Search button (Telegram-style) */}
              <button onClick={e=>{e.stopPropagation(); if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setChatSearch(v=>v?"":" ");}} title="Поиск в теме"
                style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",cursor:"pointer",fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.search}</button>
              {/* ⋯ menu — rename only (delete removed) */}
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button onClick={e=>openHdrMenu("sub",e)}
                  style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                {hdrMenu==="sub"&&<DropMenu onClose={()=>setHdrMenu(null)}
                  style={{position:"absolute",top:"calc(100% + 6px)",right:0}}
                  items={[
                    {ic:IC.pin,label:"Закреплённые сообщения",fn:()=>setPinnedOpen(true)},
                    {ic:IC.edit,label:"Переименовать",fn:()=>setModal("renS")},
                    {ic:IC.archive,label:"Очистить папку",fn:()=>setDlg({msg:`Очистить все сообщения в «${subf?.name}»?`,yes:()=>clearSub()})},
                  ]}/>}
              </div>
            </>)}
          </div>
        </div>
      )}

      {/* Pinned banner */}
      {scr==="chat"&&pinned&&!(isTyping&&note.length>0)&&!selectMode&&multiSelect.length===0&&(
        <PinnedBanner note={pinned} color={subColor}
          onJump={()=>jumpTo(pinned.id)}/>
      )}

      {/* Search */}
      {scr==="main"&&(
        <div style={{padding:"10px 14px",flexShrink:0}}>
          <div style={{background:"#241C16",borderRadius:12,display:"flex",alignItems:"center",padding:"8px 12px",gap:8}}>
            <span style={{color:"#B0A498",display:"flex"}}>{IC.search}</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск папок..."
              style={{background:"none",border:"none",color:"#F2EAE0",fontSize:15,flex:1}}/>
          </div>
        </div>
      )}

      {/* ═══ FOLDERS ═══ */}
      {scr==="main"&&(
        <div style={{flex:1,overflowY:"auto",padding:"4px 0"}}>
          {filtF.length===0&&<div style={{textAlign:"center",color:"#B0A498",marginTop:60,fontSize:15}}>Нет папок — нажмите +</div>}
          {filtF.map(f=>{
            const last=f.subfolders.flatMap(s=>s.notes).pop();
            return (
              <div key={f.id} className="row" onClick={()=>openF(f)}
                style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",
                  cursor:"pointer",transition:"background .1s",borderBottom:"1px solid #241C16"}}>
                <Av icon={f.icon} color={f.color}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:16}}>{f.name}</span>
                    <span style={{fontSize:12,color:"#B0A498"}}>{last?.time||""}</span>
                  </div>
                  <div style={{fontSize:13,color:"#B0A498",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                    {last?strip(last.text):`${f.subfolders.length} подпапок`}
                  </div>
                </div>
                <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}>
                  <button onClick={e=>openFolderMenu(f,e)}
                    style={{background:"none",border:"none",color:"#B0A498",fontSize:20,cursor:"pointer",padding:"4px 6px",opacity:.55}}>{IC.dots}</button>
                  {folderMenu?.fid===f.id&&<DropMenu onClose={()=>setFolderMenu(null)}
                    style={{position:"fixed",top:folderMenu.rect.bottom+4,right:window.innerWidth-folderMenu.rect.right}}
                    items={[
                      {ic:IC.edit,label:"Переименовать",fn:()=>{setFid(f.id);setModal("renF");}},
                      {ic:IC.trash,label:"Удалить папку",danger:true,fn:()=>{setFid(f.id);setDlg({msg:`Удалить «${f.name}»?`,yes:()=>delF(f.id)});}},
                    ]}/>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ SUBFOLDERS ═══ */}
      {scr==="sub"&&folder&&(
        <div style={{flex:1,overflowY:"auto",padding:"4px 0"}}>
          {folder.subfolders.length===0&&<div style={{textAlign:"center",color:"#B0A498",marginTop:60,fontSize:15}}>Нет подпапок — нажмите +</div>}
          {folder.subfolders.map(s=>{
            const last=s.notes[s.notes.length-1];
            return (
              <div key={s.id} className="row" onClick={()=>openS(s)}
                style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",
                  cursor:"pointer",transition:"background .1s",borderBottom:"1px solid #241C16"}}>
                <Av icon={s.icon} color={s.color}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:16}}>{s.name}</span>
                    <span style={{fontSize:12,color:"#B0A498"}}>{last?.time||""}</span>
                  </div>
                  <div style={{fontSize:13,color:"#B0A498",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                    {last?strip(last.text):"Нет заметок"}
                  </div>
                </div>
                <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}>
                  <button onClick={e=>openSubMenu(s,e)}
                    style={{background:"none",border:"none",color:"#B0A498",fontSize:20,cursor:"pointer",padding:"4px 6px",opacity:.55}}>{IC.dots}</button>
                  {subMenu?.sid===s.id&&<DropMenu onClose={()=>setSubMenu(null)}
                    style={{position:"fixed",top:subMenu.rect.bottom+4,right:window.innerWidth-subMenu.rect.right}}
                    items={[
                      {ic:IC.edit,label:"Переименовать",fn:()=>{setSid(s.id);setModal("renS");}},
                      {ic:IC.trash,label:"Удалить",danger:true,fn:()=>{setSid(s.id);setDlg({msg:`Удалить «${s.name}»?`,yes:()=>delS(s.id)});}},
                    ]}/>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Верхняя панель действий — заменяет контекстное меню */}
      {scr==="chat"&&(multiSelect.length>0||selectMode)&&(()=>{
        const single = !multiSelect.length && selectMode;
        const selNote = single ? subf?.notes.find(x=>x.id===selectMode) : null;
        const closePanel = ()=>{ if(single) setSelectMode(null); else clearMulti(); };
        return (
        <div style={{background:"#241C16",borderBottom:"1px solid #241C16",padding:"0 10px",height:62,
          display:"flex",alignItems:"center",gap:6,flexShrink:0,overflowX:"auto"}}>
          <button onClick={closePanel} title="Отмена"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"#2E251C",border:"none",color:"#F2EAE0",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.close}</button>
          <span style={{flex:1,fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>{single?"1":multiSelect.length}</span>
          {/* Закрепить / Открепить */}
          {single&&(
            <button onClick={()=>{ if(selNote){pin(selNote.id);} closePanel(); }} title={selNote?.pinned?"Открепить":"Закрепить"}
              style={{width:38,height:38,borderRadius:"50%",flexShrink:0,
                background:selNote?.pinned?"#3A2A1A":"#2E251C",border:"1px solid "+(selNote?.pinned?"#F5A623":"#4A3A22"),
                color:selNote?.pinned?"#F5A623":"#EF6C00",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {selNote?.pinned?IC.pinOff:IC.pin}</button>
          )}
          {/* Копировать текст (Т) */}
          <button onClick={()=>{ if(single){ if(selNote)copyText(selNote); } else { copyTextMulti(); } closePanel(); }} title="Копировать текст"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"#2E251C",border:"1px solid #4A3A22",color:"#EF6C00",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.copyT}</button>
          {/* Копировать сообщение */}
          <button onClick={()=>{ if(single){ if(selNote){ setSelectMode(null); copyMulti("cut",[selNote.id]); } } else { copyMulti("cut"); } setScr("main"); }} title="Переместить в раздел"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"#2E251C",border:"1px solid #4A3A22",color:"#EF6C00",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.copyMsg}</button>
          {/* Редактировать — только для одиночного */}
          {single&&(
            <button onClick={()=>{ if(selNote){ startEdit(selNote); } setMultiSelect([]); }} title="Редактировать"
              style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"#2E251C",border:"1px solid #4A3A22",color:"#EF6C00",
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.edit}</button>
          )}
          {/* Удалить */}
          <button onClick={()=>{ if(single){ if(selNote){softDel(selNote);setSelectMode(null);} } else { deleteMulti(); } }} title="Удалить"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"#33231A",border:"1px solid #5A3A2A",color:"#E05252",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.trash}</button>
        </div>
        );
      })()}

      {/* Chat search bar */}
      {scr==="chat"&&chatSearch!==""&&!isTyping&&!selectMode&&(
        <div style={{padding:"8px 12px",flexShrink:0,background:"#1A1410",borderBottom:"1px solid #241C16"}}>
          <div style={{background:"#241C16",borderRadius:12,display:"flex",alignItems:"center",padding:"7px 12px",gap:8}}>
            <span style={{color:"#B0A498",display:"flex"}}>{IC.search}</span>
            <input autoFocus value={chatSearch.trim()===""?"":chatSearch} onChange={e=>setChatSearch(e.target.value||" ")}
              placeholder="Поиск в теме..."
              style={{background:"none",border:"none",color:"#F2EAE0",fontSize:14,flex:1}}/>
            <button onClick={()=>setChatSearch("")} style={{background:"none",border:"none",color:"#B0A498",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
        </div>
      )}

      {/* ═══ CHAT ═══ */}
      {scr==="chat"&&subf&&(<>
        {/* Фиксированная панель вставки/перемещения — всегда сверху до завершения выбора */}
        {clipboard&&(
          <div style={{background:"#2E251C",borderBottom:"1px solid #3A2E24",padding:"10px 14px",
            display:"flex",alignItems:"center",gap:10,flexShrink:0,zIndex:30}}>
            <span style={{fontSize:14,color:"#B0A498",flex:1}}>
              {clipboard.mode==="cut"?"Сообщение вырезано":"Сообщение скопировано"}
            </span>
            <button onClick={pasteMsg}
              style={{background:"#EF6C00",border:"none",borderRadius:8,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>Вставить</button>
            <button onClick={()=>{ if(clipboard.mode==="cut") cancelCut(); else setClipboard(null); }}
              style={{background:"#332820",border:"none",borderRadius:8,padding:"7px 12px",color:"#B0A498",cursor:"pointer",fontSize:13}}>Отмена</button>
          </div>
        )}
        <div ref={scrollRef} onScroll={updateActiveNote}
          style={{flex:1,overflowY:"auto",padding:"10px 10px 6px 4px",display:"flex",flexDirection:"column",gap:3}}
          onClick={()=>setNoteCtx(null)}>
          {snotes.length===0&&<div style={{textAlign:"center",color:"#B0A498",marginTop:40,fontSize:14}}>Напишите первую заметку ↓</div>}

          {snotes.map(n=>{
            const isMulti = multiSelect.includes(n.id); // выбран в мультивыделении
            const multiActive = multiSelect.length>0;   // активен режим выделения
            const selActive = selectMode===n.id;        // текст этого пузыря выделяем
            return (
            <div key={n.id}
              ref={el=>{ bubbleEls.current[n.id]=el; if(n.pinned)pinRef.current=el; }}
              data-noteid={n.id}
              className="nb"
              style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:0}}>
              {n.pinned&&<div style={{fontSize:11,color:subColor,marginBottom:2,paddingRight:2}}>📌 закреплено</div>}

              <div style={{display:"flex",justifyContent:"flex-end",width:"100%",position:"relative"}}>
                {/* Чекбокс — упирается в левую грань экрана (минимальный отступ) */}
                {(multiActive||selActive) && (
                  <div style={{position:"absolute",left:-2,top:"50%",transform:"translateY(-50%)",zIndex:6,pointerEvents:"none"}}>
                    <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
                      border:"2px solid "+((isMulti||selActive)?"#EF6C00":"#5A4C40"),
                      background:(isMulti||selActive)?"#EF6C00":"rgba(0,0,0,.2)",
                      display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                      {(isMulti||selActive)?<span style={{display:"flex"}}>{IC.check}</span>:null}
                    </div>
                  </div>
                )}
                <div style={{position:"relative",display:"inline-flex",maxWidth:"calc(100% - 34px)"}}>

                {/* Пузырь */}
                <div
                  onClick={e=>{
                    if(justEnteredSel.current===n.id){ e.stopPropagation(); return; } // хвостовой клик по только что выделенному
                    if(multiActive){ e.stopPropagation(); handleMultiTap(n); return; }
                    if(selectMode && selectMode!==n.id){ e.stopPropagation(); handleSelTap(n,e); return; }
                    if(selActive){ // одиночный тап по выделенному → снять выделение
                      e.stopPropagation();
                      if(justEnteredSel.current===n.id) return; // не считать хвостовой клик после входа
                      setSelectMode(null);
                    }
                  }}
                  onTouchStart={(selectMode||multiActive)?undefined:(e=>bubbleLpStart(n,e))}
                  onTouchMove={(selectMode||multiActive)?undefined:bubbleLpMove}
                  onTouchEnd={(selectMode||multiActive)?undefined:(e=>bubbleLpEnd(n,e))}
                  onMouseDown={(selectMode||multiActive)?undefined:(e=>bubbleLpStart(n,e))}
                  onMouseMove={(selectMode||multiActive)?undefined:bubbleLpMove}
                  onMouseUp={(selectMode||multiActive)?undefined:(e=>bubbleLpEnd(n,e))}
                  onContextMenu={e=>{ e.preventDefault(); }}
                  style={{background:highlightId===n.id?"#4A3A1E":editId===n.id?"#2E2418":isMulti?"#332512":selActive?"#2E2418":"#241C16",
                    borderRadius:"16px 4px 16px 16px",padding:"10px 14px",
                    maxWidth:"100%",minWidth:0,cursor:multiActive?"pointer":"default",
                    border:(highlightId===n.id)?"1px solid #F5A623":(editId===n.id||selActive||isMulti)?"1px solid #EF6C00":"1px solid transparent",
                    transition:"border .4s,background .4s"}}>
                  {n.text&&(
                    <div className={(selActive||multiActive)?"selectable":undefined}
                      style={{fontSize:15,lineHeight:1.6,color:"#F2EAE0",whiteSpace:"pre-wrap",wordBreak:"break-word",
                      userSelect:(selActive||multiActive)?"text":"none",WebkitUserSelect:(selActive||multiActive)?"text":"none"}}>
                      <RichText text={n.text} color={subColor} onLinkMenu={handleLinkMenu}/>
                    </div>
                  )}
                  {n.attachments?.map(a=><AttBubble key={a.id} att={a}/>)}
                  <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:4,marginTop:5}}>
                    <span style={{fontSize:11,color:"#B0A498",userSelect:"none",WebkitUserSelect:"none"}}>{n.ts?fmtStamp(n.ts):n.time}</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
            );
          })}
          <div ref={bottomRef}/>
        </div>

        {/* Pending attachments strip */}
        {patts.length>0&&(
          <div style={{background:"#241C16",borderTop:"1px solid #3A2E24",
            padding:"8px 12px",display:"flex",gap:8,flexWrap:"wrap",flexShrink:0}}>
            {patts.map(a=>(
              <div key={a.id} style={{background:"#241C16",borderRadius:10,
                padding:"5px 8px",display:"flex",alignItems:"center",gap:5,maxWidth:150}}>
                <span style={{color:"#EF6C00",display:"flex"}}>{ficon(a.type)}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:11,color:"#D8CCBE",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                  {a.caption&&<div style={{fontSize:10,color:"#B0A498",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.caption}</div>}
                </div>
                <button onClick={()=>rmPatt(a.id)} style={{background:"#E05252",border:"none",borderRadius:"50%",
                  width:16,height:16,color:"#fff",fontSize:10,cursor:"pointer",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* ── INPUT AREA — скрыт в выделении, мультивыборе и поиске ── */}
        {!selectMode && multiSelect.length===0 && chatSearch==="" && (
        <div ref={inputAreaRef} style={{background:"#241C16",borderTop:"1px solid #3A2E24",
          padding:"8px 10px 10px",flexShrink:0,position:"relative"}}>
          {/* Floating draggable format+preview — only while typing */}
          {(isTyping||editId) && note.length>0 && (
            <FloatingTools taRef={taRef} value={note} onChange={setNote}
              onLinkClick={openLinkDlg} onPreview={()=>setPrevSh(true)}/>
          )}
          {/* Гребешок при наборе — растягивает поле, как в редактировании */}
          {!editId && note.length>0 && (
            <div onMouseDown={gripStart} onTouchStart={gripStart}
              title="Потяните, чтобы изменить высоту"
              style={{display:"flex",justifyContent:"center",alignItems:"center",height:30,marginBottom:2,
                cursor:"ns-resize",touchAction:"none",position:"relative",zIndex:130}}>
              <div style={{width:70,height:7,borderRadius:4,background:"#6A5A48"}}/>
            </div>
          )}
          {/* Крестик слева + «Редактирование» по центру в овальном ободке (гребешок) */}
          {editId&&(
            <div style={{fontSize:13,color:"#EF6C00",marginBottom:6,display:"flex",alignItems:"center",position:"relative",minHeight:38}}>
              <button onClick={cancelEdit} title="Отменить редактирование"
                style={{background:"#241C16",border:"none",color:"#F2EAE0",cursor:"pointer",
                  fontSize:15,borderRadius:"50%",width:34,height:34,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.close}</button>
              <span
                onMouseDown={gripStart} onTouchStart={gripStart}
                title="Потяните вверх/вниз, чтобы изменить высоту"
                style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",
                  fontWeight:600,display:"flex",alignItems:"center",gap:6,
                  cursor:"ns-resize",touchAction:"none",userSelect:"none",WebkitUserSelect:"none",
                  padding:"7px 16px",borderRadius:20,background:"#2E251C",border:"1px solid #4A3A22"}}>
                {IC.edit} Редактирование
              </span>
            </div>
          )}
          <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
            {/* 📎 — only when the field is empty (text typed → paperclip hides, field widens) */}
            {note.trim()==="" && (
              <button onClick={()=>setAttSh(true)} title="Прикрепить"
                style={{width:42,height:42,borderRadius:"50%",background:"#2E251C",border:"none",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:20,flexShrink:0,color:"#B0A498"}}>{IC.clip}</button>
            )}
            {/* Textarea — fills all space up to 📎 / send */}
            <textarea ref={taRef} value={note}
              onChange={e=>{
                const v=e.target.value;
                setNote(v);
                if(v===""&&!editId){ manualResize.current=false; setTaHeight(null); if(taRef.current) taRef.current.style.height="auto"; }
                else autoGrow(e.target);
              }}
              onFocus={handleFocus} onBlur={handleBlur}
              placeholder={editId?"Редактировать...":"Сообщение..."} rows={1}
              style={{flex:1,background:"#2E251C",border:"1px solid #3A2E24",borderRadius:18,
                color:"#F2EAE0",fontSize:15,padding:"10px 16px",resize:"none",
                minHeight:42,maxHeight:(editId||taHeight)?"88vh":(isTyping?315:150),lineHeight:1.4,
                height:taHeight?taHeight+"px":undefined,
                overflowY:"auto",transition:"none"}}/>
            {/* Кнопка: при наличии текста/вложений — Отправить; при пустом — переключатель send/mic */}
            {(note.trim()!==""||patts.length>0) ? (
              <button className="sbtn" onClick={send} title="Отправить"
                style={{width:42,height:42,borderRadius:"50%",background:"#EF6C00",border:"none",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#fff",flexShrink:0,transition:"transform .1s",boxShadow:"0 2px 10px rgba(239,108,0,.4)"}}>{IC.send}</button>
            ) : micMode ? (
              <button className="sbtn"
                onMouseDown={()=>micPressStart()}
                onMouseUp={()=>micPressEnd()}
                onMouseLeave={()=>{ clearTimeout(holdTimer.current); if(recHeld.current){ recHeld.current=false; stopRec(); } }}
                onTouchStart={e=>{ e.preventDefault(); micPressStart(); }}
                onTouchEnd={e=>{ e.preventDefault(); micPressEnd(); }}
                title="Удерживайте для записи · короткий тап — назад к отправке"
                style={{width:42,height:42,borderRadius:"50%",background:recording?"#E05252":"#EF6C00",border:"none",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#fff",flexShrink:0,transition:"transform .1s",
                  boxShadow:recording?"0 0 0 6px rgba(224,82,82,.25)":"0 2px 10px rgba(239,108,0,.4)"}}>{recording?IC.stop:IC.mic}</button>
            ) : (
              <button className="sbtn" onClick={()=>setMicMode(true)} title="Переключить на микрофон"
                style={{width:42,height:42,borderRadius:"50%",background:"#2E251C",border:"1px solid #4A3A22",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#B0A498",flexShrink:0,transition:"transform .1s"}}>{IC.send}</button>
            )}
          </div>
        </div>
        )}
      </>)}

      {/* Плавающая кнопка копирования выделенного текста */}
      {selCopy&&(
        <button
          onMouseDown={e=>{e.preventDefault();e.stopPropagation();copySelection();}}
          onTouchStart={e=>{e.preventDefault();e.stopPropagation();copySelection();}}
          style={{position:"fixed",left:Math.max(50,Math.min(selCopy.x,window.innerWidth-50)),
            top:Math.max(46,selCopy.y-46),transform:"translateX(-50%)",zIndex:200,
            background:"#EF6C00",color:"#fff",border:"none",borderRadius:10,padding:"8px 14px",
            fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(0,0,0,.5)",
            display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"flex"}}>{IC.copyT}</span> Копировать
        </button>
      )}

      {/* ══ MODALS ══ */}
      <LinkDlg open={lnkDlg} selected={lnkSel} onClose={()=>setLnkDlg(false)} onInsert={insertLink}/>
      <PreviewModal open={prevSh} onClose={()=>setPrevSh(false)} onSend={send} text={note} atts={patts} color={subColor}/>
      <MediaBrowser open={mediaBrowser} onClose={()=>setMediaBrowser(false)} subf={subf} color={subColor}/>
      <Sheet open={pinnedOpen} onClose={()=>setPinnedOpen(false)} title="Закреплённые сообщения">
        {(()=>{
          const pins=(subf?.notes||[]).filter(n=>n.pinned);
          if(!pins.length) return <div style={{color:"#B0A498",fontSize:14,textAlign:"center",padding:"20px 0"}}>Нет закреплённых сообщений</div>;
          return (
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"60vh",overflowY:"auto"}}>
              {pins.map(n=>(
                <button key={n.id} onClick={()=>jumpTo(n.id)}
                  style={{textAlign:"left",background:"#2E251C",border:"1px solid #3A2E24",borderRadius:12,
                    padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:"#F5A623",display:"flex",flexShrink:0}}>{IC.pin}</span>
                  <span style={{flex:1,minWidth:0}}>
                    <span style={{display:"block",color:"#F2EAE0",fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {n.text?strip(n.text):(n.attachments?.length?"Вложение":"—")}
                    </span>
                    <span style={{display:"block",color:"#8A7A65",fontSize:11,marginTop:2}}>{n.ts?fmtStamp(n.ts):n.time}</span>
                  </span>
                </button>
              ))}
            </div>
          );
        })()}
      </Sheet>

      <Sheet open={!!capDlg} onClose={()=>setCapDlg(null)} title="💬 Подпись к файлу">
        <div style={{fontSize:13,color:"#B0A498",marginBottom:10}}>{capDlg?.name}</div>
        <textarea value={capTx} onChange={e=>setCapTx(e.target.value)} placeholder="Добавить подпись..." rows={3}
          style={{width:"100%",background:"#241C16",border:"none",borderRadius:12,padding:12,
            color:"#F2EAE0",fontSize:14,resize:"none",marginBottom:14,outline:"none"}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setCapDlg(null)} style={{flex:1,background:"#241C16",border:"none",borderRadius:12,padding:12,color:"#B0A498",cursor:"pointer",fontSize:14}}>Пропустить</button>
          <button onClick={saveCaption} style={{flex:1,background:"#EF6C00",border:"none",borderRadius:12,padding:12,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Сохранить</button>
        </div>
      </Sheet>

      {/* Attach picker — Telegram-style categories */}
      <Sheet open={attSh} onClose={()=>setAttSh(false)} title="Прикрепить">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
          {[
            {ic:IC.gallery,  label:"Галерея",  accept:"image/*"},
            {ic:IC.video,    label:"Видео",    accept:"video/*"},
            {ic:IC.camera,   label:"Камера",   accept:"image/*;capture=camera"},
            {ic:IC.camcorder,label:"Видеозап.",accept:"video/*;capture=camcorder"},
            {ic:IC.audio,    label:"Аудио",    accept:"audio/*"},
            {ic:IC.file,     label:"Файл",     accept:"*/*"},
          ].map(o=>(
            <button key={o.label} onClick={()=>pickFiles(o.accept)}
              style={{background:"#2E251C",border:"1px solid #3A2E24",borderRadius:12,padding:"10px 4px",
                cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <span style={{color:"#EF6C00",display:"flex"}}>{o.ic}</span>
              <span style={{fontSize:10.5,color:"#D8CCBE"}}>{o.label}</span>
            </button>
          ))}
        </div>
      </Sheet>

      <ExportSheet open={expSh} onClose={()=>setExpSh(false)} data={data} asSettings={asSettings} setAsSettings={setAsSettings}/>

      <Sheet open={modal==="mkF"}  onClose={()=>setModal(null)}><FolderForm title="Новая папка"            icons={ICONS_F} btnLabel="Создать" onSubmit={mkF}/></Sheet>
      <Sheet open={modal==="renF"} onClose={()=>setModal(null)}>{folder&&<FolderForm title="Редактировать папку"    icons={ICONS_F} initName={folder.name} initIcon={folder.icon} initColor={folder.color} onSubmit={renF}/>}</Sheet>
      <Sheet open={modal==="mkS"}  onClose={()=>setModal(null)}><FolderForm title="Новая подпапка"         icons={ICONS_S} btnLabel="Создать" onSubmit={mkS} initColor={folder?.color}/></Sheet>
      <Sheet open={modal==="renS"} onClose={()=>setModal(null)}>{subf&&<FolderForm title="Редактировать подпапку" icons={ICONS_S} initName={subf.name} initIcon={subf.icon} initColor={subf.color} onSubmit={renS}/>}</Sheet>

      <Dlg open={!!dlg} msg={dlg?.msg} onYes={()=>{dlg?.yes();setDlg(null);}} onNo={()=>setDlg(null)}/>
    </div>
  );
}
