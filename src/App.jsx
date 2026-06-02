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
  send:  (<svg width={28} height={28} viewBox="0 0 24 24" style={{display:"block"}}>
    <path d="M18.5 12 6 6.5 10 11 10 13 6 17.5Z" fill="currentColor" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>),
  sendUp:(<svg width={28} height={28} viewBox="0 0 24 24" style={{display:"block",transform:"rotate(-90deg)"}}>
    <path d="M18.5 12 6 6.5 10 11 10 13 6 17.5Z" fill="currentColor" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>),
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
  arrUp:  <Icon d={["M12 5v14","M6 11l6-6 6 6"]} stroke={2} />,
  arrDown:<Icon d={["M12 5v14","M6 13l6 6 6-6"]} stroke={2} />,
  undo:   <Icon d={["M9 7L4 12l5 5","M4 12h11a5 5 0 0 1 0 10h-3"]} stroke={2} />,
  redo:   <Icon d={["M15 7l5 5-5 5","M20 12H9a5 5 0 0 0 0 10h3"]} stroke={2} />,
  expand: <Icon d={["M4 10V4h6","M20 14v6h-6","M4 4l7 7","M20 20l-7-7"]} stroke={2} />,
  sparkle:<Icon d={["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"]} stroke={1.6} />,
  arrRight:<Icon d={["M5 12h14","M13 6l6 6-6 6"]} stroke={2} />,
  arrLeft: <Icon d={["M19 12H5","M11 6l-6 6 6 6"]} stroke={2} />,
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
  fChat:   <Icon d="M4 5h16v11H8l-4 4V5Z" stroke={2} />,
  fChats:  <Icon d={["M3 4h13v9H8l-3 3V4Z","M8 8h11v8l-3-3H10"]} stroke={2} />,
  fUser:   <Icon d={["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M4 21c0-4 4-6 8-6s8 2 8 6"]} stroke={2} />,
  fUsers:  <Icon d={["M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z","M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5","M16 4.5a3.5 3.5 0 0 1 0 7","M17 14.5c2.5.4 5 2 5 5.5"]} stroke={2} />,
  fSettings:<Icon d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L16 3H8l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 3 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L8 21h8l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z"]} stroke={1.6} />,
  fBell:   <Icon d={["M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z","M10 20a2 2 0 0 0 4 0"]} stroke={2} />,
  fMail:   <Icon d={["M3 6h18v12H3z","M3 7l9 6 9-6"]} stroke={2} />,
  fPhone:  <Icon d="M6 3l3 1 1 4-2 2a11 11 0 0 0 5 5l2-2 4 1 1 3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke={2} />,
  fCamera: <Icon d={["M4 8h3l2-2h6l2 2h3v11H4z","M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"]} stroke={2} />,
  fImage:  <Icon d={["M4 5h16v14H4z","M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M4 17l5-5 4 4 3-3 4 4"]} stroke={2} />,
  fVideo:  <Icon d={["M3 6h12v12H3z","M15 10l6-3v10l-6-3"]} stroke={2} />,
  fMic:    <Icon d={["M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z","M6 11a6 6 0 0 0 12 0","M12 17v4"]} stroke={2} />,
  fFile:   <Icon d={["M6 3h8l4 4v14H6z","M14 3v4h4"]} stroke={2} />,
  fLink:   <Icon d={["M9 15l6-6","M10 7l1-1a3.5 3.5 0 0 1 5 5l-1 1","M14 17l-1 1a3.5 3.5 0 0 1-5-5l1-1"]} stroke={2} />,
  fCalendar:<Icon d={["M4 6h16v15H4z","M4 10h16","M8 3v4M16 3v4"]} stroke={2} />,
  fClock:  <Icon d={["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M12 7v5l3 2"]} stroke={2} />,
  fPinLoc: <Icon d={["M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z","M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"]} stroke={2} />,
  fWallet: <Icon d={["M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V7Z","M3 7l13-3v3","M17 13h1"]} stroke={2} />,
  fGift:   <Icon d={["M4 11h16v9H4z","M3 8h18v3H3z","M12 8v12","M12 8S9 3 7 5s1 3 5 3 7-1 5-3-5 3-5 3"]} stroke={1.8} />,
  fFlag:   <Icon d={["M5 21V4","M5 4h12l-2 4 2 4H5"]} stroke={2} />,
  fShield: <Icon d={["M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3Z","M9 12l2 2 4-4"]} stroke={2} />,
  fGlobe:  <Icon d={["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M3 12h18","M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"]} stroke={1.8} />,
  fBolt:   <Icon d="M13 3L5 13h6l-1 8 8-10h-6l1-8Z" stroke={2} />,
  fCloud:  <Icon d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.5-1.5A3.5 3.5 0 0 1 18 18H7Z" stroke={2} />,
  fKey:    <Icon d={["M9 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M12 11l8 8","M16 15l2 2","M18 13l2 2"]} stroke={2} />,
  fChart:  <Icon d={["M4 20V4","M4 20h16","M8 16v-4M12 16V8M16 16v-7"]} stroke={2} />,
  fCheck:  <Icon d={["M5 13l4 4L19 7"]} stroke={2.4} />,
  fTrash:  <Icon d={["M5 7h14","M9 7V4h6v3","M7 7l1 13h8l1-13"]} stroke={2} />,
  fEdit:   <Icon d={["M4 20h4L18 10l-4-4L4 16v4Z","M14 6l4 4"]} stroke={2} />,
  fSearch: <Icon d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z","M21 21l-4-4"]} stroke={2} />,
  fEye:    <Icon d={["M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} stroke={2} />,
  fCoffee: <Icon d={["M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z","M17 9h2a2 2 0 0 1 0 5h-2","M7 3v2M11 3v2"]} stroke={2} />,
  fCode:   <Icon d={["M9 8l-4 4 4 4","M15 8l4 4-4 4","M13 6l-2 12"]} stroke={2} />,
  fCar:    <Icon d={["M3 13l2-5h12l2 5","M3 13h18v5H3z","M7 18v2M17 18v2","M6 16h1M17 16h1"]} stroke={1.8} />,
  fPlanet: <Icon d={["M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z","M4 16c5 3 13 1 16-4M20 8C15 5 7 7 4 12"]} stroke={1.8} />,
  fTag:    <Icon d={["M4 4h8l8 8-8 8-8-8V4Z","M8 8a1 1 0 1 0 0-.01"]} stroke={2} />,
  fMoon:   <Icon d="M20 14a8 8 0 1 1-9-11 7 7 0 0 0 9 11Z" stroke={2} />,
  fSun:    <Icon d={["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"]} stroke={1.8} />,
  fDroplet:<Icon d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z" stroke={2} />,
};


// ═══════════════════════════════════════════════
// MARKDOWN (Telegram-identical set)
// ═══════════════════════════════════════════════
function parseMarkdown(text) {
  if (!text) return [];
  const parts = [];
  // bold **  italic _  strike ~~  spoiler ||  mono `  link [t](url)  bare url
  const re = /(\[b\]([\s\S]+?)\[\/b\])|(\[i\]([\s\S]+?)\[\/i\])|(\[s\]([\s\S]+?)\[\/s\])|(\[spoiler\]([\s\S]+?)\[\/spoiler\])|(\[code\]([\s\S]+?)\[\/code\])|(\[q\]([\s\S]+?)\[\/q\])|(\[(.+?)\]\((https?:\/\/[^)]+)\))|(https?:\/\/\S+)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type:"text",    content:text.slice(last,m.index) });
    if      (m[1])  parts.push({ type:"bold",    content:m[2] });
    else if (m[3])  parts.push({ type:"italic",  content:m[4] });
    else if (m[5])  parts.push({ type:"strike",  content:m[6] });
    else if (m[7])  parts.push({ type:"spoiler", content:m[8] });
    else if (m[9])  parts.push({ type:"code",    content:m[10] });
    else if (m[11]) parts.push({ type:"quote",   content:m[12] });
    else if (m[13]) parts.push({ type:"link",    content:m[14], href:m[15] });
    else if (m[16]) parts.push({ type:"link",    content:m[16], href:m[16] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type:"text", content:text.slice(last) });
  return parts;
}

function hl(content, q){
  if(!q || typeof content!=="string") return content;
  const idx=content.toLowerCase().indexOf(q.toLowerCase());
  if(idx<0) return content;
  const parts=[]; let rest=content, base=0, ql=q.length;
  let lc=content.toLowerCase(); let pos=0;
  while(true){ const i=lc.indexOf(q.toLowerCase(),pos); if(i<0){ parts.push(content.slice(pos)); break; } parts.push(content.slice(pos,i)); parts.push(<mark key={i} style={{background:"#EF6C00",color:"#fff",borderRadius:3,padding:"0 1px"}}>{content.slice(i,i+ql)}</mark>); pos=i+ql; }
  return parts;
}
function RichText({ text, color, onLinkMenu, highlight }) {
  const q=(highlight||"").trim();
  return (
    <span>{parseMarkdown(text).map((p,i) => {
      if (p.type==="bold")   return <strong key={i}>{p.content}</strong>;
      if (p.type==="italic") return <em key={i}>{p.content}</em>;
      if (p.type==="strike") return <s key={i}>{p.content}</s>;
      if (p.type==="spoiler") return <span key={i} style={{background:"#B0A498",color:"#B0A498",borderRadius:3,cursor:"pointer",userSelect:"none"}}
        onClick={e=>{e.stopPropagation();e.currentTarget.style.color="#F2EAE0";e.currentTarget.style.background="#4A3A22";}}>{p.content}</span>;
      if (p.type==="quote")  return <span key={i} style={{borderLeft:"3px solid "+(color||"#EF6C00"),paddingLeft:8,opacity:.9,display:"inline-block"}}>{p.content}</span>;
      if (p.type==="code")   return <code key={i} style={{background:"#15100C",borderRadius:4,padding:"1px 5px",fontSize:"0.87em",fontFamily:"monospace"}}>{p.content}</code>;
      if (p.type==="link")   return (
        <a key={i} href={p.href} target="_blank" rel="noreferrer"
          style={{color:color||"#EF6C00",textDecoration:"underline dotted"}}
          onClick={e=>{ e.preventDefault(); e.stopPropagation();
            const x=(e.clientX||window.innerWidth/2), y=(e.clientY||window.innerHeight/2);
            onLinkMenu&&onLinkMenu(p.href,{clientX:x,clientY:y}); }}
        >{p.content}</a>
      );
      return <span key={i}>{hl(p.content,q)}</span>;
    })}</span>
  );
}

// ═══════════════════════════════════════════════
// STORAGE + AUTO-SAVE
// ═══════════════════════════════════════════════
const SK = "napp_v9";
const AS_KEY = "napp_v9_autosave"; // autosave settings
const DRAFT_KEY = "napp_v9_drafts";
const DLAUNCH_KEY = "napp_v9_defaultLaunch";
function loadDrafts(){ try{ const r=localStorage.getItem(DRAFT_KEY); return r?JSON.parse(r):{}; }catch{ return {}; } }
function saveDrafts(d){ try{ localStorage.setItem(DRAFT_KEY,JSON.stringify(d)); }catch{} }

const defaultData = {
  folders:[
    {id:"f1",name:"Работа",icon:"fWork",color:"#EF6C00",unread:0,subfolders:[
      {id:"sf1",name:"Проекты",icon:"fFolder",color:"#EF6C00",notes:[
        {id:"n1",text:"Дедлайн по [b]проекту X[/b] — 15 июня",time:"10:24",ts:new Date(2026,5,15,10,24).toISOString(),pinned:true,attachments:[]},
        {id:"n2",text:"Созвон в пятницу 15:00\nСсылка: [Google Meet](https://meet.google.com)",time:"09:10",ts:new Date(2026,5,14,9,10).toISOString(),pinned:false,attachments:[]},
      ]},
      {id:"sf2",name:"Идеи",icon:"fIdea",color:"#F5A623",notes:[
        {id:"n3",text:"Добавить [i]авторизацию[/i] через [b]Google[/b]",time:"вчера",ts:new Date(2026,5,13,18,30).toISOString(),pinned:false,attachments:[]},
      ]},
    ]},
    {id:"f2",name:"Личное",icon:"fHome",color:"#F5A623",unread:0,subfolders:[
      {id:"sf3",name:"Покупки",icon:"fCart",color:"#F5A623",notes:[
        {id:"n4",text:"Молоко, хлеб, [b]яйца[/b], сыр",time:"08:45",ts:new Date(2026,5,14,8,45).toISOString(),pinned:false,attachments:[]},
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
const ICONS_F = ["fFolder","fWork","fHome","fBook","fGame","fMusic","fPlane","fHeart","fStar","fFire","fLeaf","fArt","fNote","fIdea","fCart","fGym","fPin","fBookmark","fLock","fTarget","fFlask","fChat","fChats","fUser","fUsers","fSettings","fBell","fMail","fPhone","fCamera","fImage","fVideo","fMic","fFile","fLink","fCalendar","fClock","fPinLoc","fWallet","fGift","fFlag","fShield","fGlobe","fBolt","fCloud","fKey","fChart","fCheck","fTrash","fEdit","fSearch","fEye","fCoffee","fCode","fCar","fPlanet","fTag","fMoon","fSun","fDroplet"];
const ICONS_S = ["fFolder","fWork","fHome","fBook","fGame","fMusic","fPlane","fHeart","fStar","fFire","fLeaf","fArt","fNote","fIdea","fCart","fGym","fPin","fBookmark","fLock","fTarget","fFlask","fChat","fChats","fUser","fUsers","fSettings","fBell","fMail","fPhone","fCamera","fImage","fVideo","fMic","fFile","fLink","fCalendar","fClock","fPinLoc","fWallet","fGift","fFlag","fShield","fGlobe","fBolt","fCloud","fKey","fChart","fCheck","fTrash","fEdit","fSearch","fEye","fCoffee","fCode","fCar","fPlanet","fTag","fMoon","fSun","fDroplet"];
const strip = t=>(t||"").replace(/\[\/?(b|i|s|spoiler|code|q)\]/g,"").replace(/\[.*?\]\(.*?\)/g,"$1").slice(0,52);
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

function Dlg({ open, msg, onYes, onNo, anchor }) {
  if(!open) return null;
  // Если есть anchor (rect места вызова) — показываем popover рядом, иначе по центру
  let boxStyle;
  if(anchor){
    const W=260, margin=8;
    let left=Math.min(Math.max(margin, anchor.right - W), window.innerWidth - W - margin);
    let top=anchor.bottom + 6;
    if(top + 150 > window.innerHeight) top = Math.max(margin, anchor.top - 150);
    boxStyle={position:"fixed",top,left,width:W,background:"#241C16",borderRadius:14,padding:16,
      animation:"fS .15s ease",border:"1px solid #3A2E24",boxShadow:"0 10px 36px rgba(0,0,0,.6)",zIndex:600};
  } else {
    boxStyle={background:"#241C16",borderRadius:16,padding:24,width:"100%",maxWidth:340,animation:"fS .18s ease"};
  }
  return (
    <div onClick={onNo} style={{position:"fixed",inset:0,background:anchor?"rgba(0,0,0,.35)":"rgba(0,0,0,.65)",
      display:"flex",alignItems:anchor?"flex-start":"center",justifyContent:anchor?"flex-start":"center",
      zIndex:600,backdropFilter:anchor?"none":"blur(4px)",padding:anchor?0:"0 24px"}}>
      <div onClick={e=>e.stopPropagation()} style={boxStyle}>
        <div style={{fontSize:14,color:"#F2EAE0",marginBottom:16,lineHeight:1.5}}>{msg}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onNo}  style={{flex:1,background:"#2E251C",border:"none",borderRadius:10,padding:10,color:"#B0A498",fontSize:14,cursor:"pointer"}}>Отмена</button>
          <button onClick={onYes} style={{flex:1,background:"#E05252",border:"none",borderRadius:10,padding:10,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

// Generic dropdown menu (inline positioned by caller)
function DropMenu({ items, onClose, style:extraStyle={} }) {
  const ref=useRef(null);
  useEffect(()=>{
    function h(e){ if(e.target&&e.target.closest&&e.target.closest("[data-menutrigger]")) return; if(ref.current&&!ref.current.contains(e.target))onClose(); }
    setTimeout(()=>document.addEventListener("mousedown",h),0);
    return()=>document.removeEventListener("mousedown",h);
  },[onClose]);
  return (
    <div ref={ref} style={{background:"#241C16",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.6)",
      overflow:"hidden",width:"max-content",zIndex:1200,animation:"fS .15s ease",border:"1px solid #3A2E24",...extraStyle}}>
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
  const [sec,setSec]=useState(2);
  const [pct,setPct]=useState(100);
  useEffect(()=>{
    const t0=Date.now(),total=2000;
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
        <div style={{fontWeight:700,fontSize:16,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><span style={{display:"flex",color:"#EF6C00"}}>{IC.fLink}</span> Вставить ссылку</div>
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
    function h(e){ if(e.target&&e.target.closest&&e.target.closest("[data-menutrigger]")) return; if(ref.current&&!ref.current.contains(e.target))onClose(); }
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
function PlaneGhost({ phase }){
  // 'in': центр(самолёт) -> угол(микрофон) ; 'out': угол(микрофон) -> центр(самолёт)
  const [go,setGo]=useState(false);
  useEffect(()=>{ const id=requestAnimationFrame(()=>setGo(true)); return ()=>cancelAnimationFrame(id); },[]);
  const centerPos={left:"50%",bottom:"6px",transform:"translateX(-50%) rotate(0deg) scale(1)"};
  const cornerPos={left:"calc(100% - 60px)",bottom:"10px",transform:"translateX(0) rotate(90deg) scale(.92)"};
  const pos = (phase==='in') ? (go?cornerPos:centerPos) : (go?centerPos:cornerPos);
  // прогресс «к микрофону»: in -> к концу =1 (микрофон), out -> к концу =0 (самолёт)
  const atMic = (phase==='in') ? go : !go;
  return (
    <div className="planeGhost" style={pos}>
      <span style={{position:"relative",display:"flex",width:24,height:24,alignItems:"center",justifyContent:"center"}}>
        <span style={{position:"absolute",display:"flex",transition:"opacity .26s ease, transform .26s ease",
          opacity:atMic?0:1, transform:`scale(${atMic?0.6:0.9}) rotate(${atMic?-90:0}deg)`}}>{IC.sendUp}</span>
        <span style={{position:"absolute",display:"flex",transition:"opacity .26s ease, transform .26s ease",
          opacity:atMic?1:0, transform:`scale(${atMic?0.9:0.6}) rotate(${atMic?0:90}deg)`}}>{IC.mic}</span>
      </span>
    </div>
  );
}
function PreviewModal({ open, onClose, onSend, text, atts, color, isEdit }) {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"#1A1410",zIndex:600,display:"flex",flexDirection:"column"}}>
      {/* Шапка */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:"1px solid #241C16",flexShrink:0}}>
        <button onClick={onClose} title="Назад к редактированию"
          style={{background:"none",border:"none",color:"#F2EAE0",cursor:"pointer",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.back}</button>
        <div style={{fontWeight:600,fontSize:16,color:"#F2EAE0",flex:1}}>Предпросмотр</div>
      </div>
      {/* Содержимое — как пузырь сообщения */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 12px",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{background:"#2E251C",borderRadius:"16px 4px 16px 16px",padding:"10px 14px",maxWidth:"90%"}}>
            {text&&<div style={{fontSize:15,lineHeight:1.6,color:"#F2EAE0",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              <RichText text={text} color={color}/></div>}
            {atts?.map((a,i)=><AttBubble key={i} att={a}/>)}
            <div style={{fontSize:8.5,color:"#B0A498",textAlign:"right",marginTop:5}}>{tnow()} ✓✓</div>
          </div>
        </div>
      </div>
      {/* Нижняя панель: аккуратная кнопка отправки */}
      <div style={{display:"flex",alignItems:"center",padding:"3px 12px",borderTop:"1px solid #3A2E24",background:"#241C16",flexShrink:0,minHeight:46}}>
        <button onClick={onClose}
          style={{background:"#2E251C",border:"1px solid #3A2E24",borderRadius:10,padding:"9px 16px",color:"#B0A498",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",gap:6}}>
          <span style={{display:"flex",transform:"scale(.8)"}}>{IC.edit}</span> Изменить
        </button>
        <div style={{flex:1}}/>
        <button onClick={()=>{onSend();onClose();}} title={isEdit?"Сохранить":"Отправить"}
          style={{width:48,height:48,borderRadius:"50%",background:"#EF6C00",border:"none",cursor:"pointer",
            color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px rgba(239,108,0,.4)"}}>{isEdit?IC.check:IC.send}</button>
      </div>
    </div>
  );
}

// ─── Attachment bubble ────────────────────────────────────────
function AttBubble({ att, onOpen }) {
  if(att.dataUrl&&att.type?.startsWith("image/")) return (
    <div style={{marginTop:8}}>
      <img src={att.dataUrl} alt={att.name} onClick={(e)=>{ e.stopPropagation(); onOpen&&onOpen(att.dataUrl); }} style={{maxWidth:220,width:"100%",borderRadius:10,display:"block",cursor:"pointer"}}/>
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
function MediaBrowser({ open, onClose, subf, color, onChangeIcon }) {
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
    link:  {label:"Ссылки",  icon:IC.fLink, items:links},
  };

  const current=cats[tab];
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
      display:"flex",alignItems:"flex-end",zIndex:400,backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"#241C16",
        borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column",animation:"sUp .22s ease"}}>
        {/* Шапка темы + действия с иконкой */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 14px 10px",flexShrink:0}}>
          <Av icon={subf.icon} img={subf.iconImg} color={subf.color||color} size={40}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subf.name}</div>
            <div style={{fontSize:12,color:"#B0A498"}}>{subf.notes.length} сообщений</div>
          </div>
        </div>
        <div style={{display:"flex",padding:"0 14px 12px",flexShrink:0}}>
          <button onClick={()=>{onChangeIcon&&onChangeIcon();}} title="Изменить иконку темы"
            style={{background:"#2E251C",border:"1px solid #3A2E24",borderRadius:8,padding:"5px 10px",
              color:"#EF6C00",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{display:"flex",transform:"scale(.85)"}}>{IC.edit}</span> Иконка
          </button>
        </div>
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
                  <span style={{color:"#EF6C00",display:"flex",flexShrink:0}}>{IC.fLink}</span>
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
function FolderForm({ title, initName="", initIcon="fFolder", initColor, icons, onSubmit, btnLabel="Сохранить", onBrowse }) {
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
          {onBrowse&&(
            <button onClick={onBrowse} title="Выбрать своё изображение"
              style={{width:42,height:42,borderRadius:"50%",cursor:"pointer",border:"1px dashed #5A4C40",
                background:"#2E251C",color:"#EF6C00",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {IC.gallery}
            </button>
          )}
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



// ─── Export sheet ─────────────────────────────────────────────
function ExportSheet({ open, onClose, data, asSettings, setAsSettings, noInputAnim, toggleInputAnim }) {
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
        setMsg("✅ Сохранено");
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
      <div style={{background:"#241C16",border:"1px solid #3A2E24",borderRadius:12,
        padding:"10px 14px",marginBottom:14,fontSize:13,color:"#B0A498",lineHeight:1.5}}>
        «Сохранить» создаёт файл-резервную копию со всеми данными. Выберите в системном диалоге, куда его сохранить.
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
  const [settingsMenu, setSettingsMenu] = useState(false);
  const [plusMenu, setPlusMenu] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [selCopy, setSelCopy] = useState(null); // {x,y,text} плавающая кнопка копирования выделенного текста
  const [data,      setData]      = useState(loadData);
  const [scr,       setScr]       = useState("main");
  const [fid,       setFid]       = useState(null);
  const [sid,       setSid]       = useState(null);
  const [search,    setSearch]    = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState(null); // null=закрыт, "" или строка=открыт
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
  const mediaRec = useRef(null);
  const recChunks = useRef([]);
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
  const [composerFull, setComposerFull] = useState(false); // ЭКСПЕРИМЕНТ: режим написания как в Google Keep
  const [fullFmt, setFullFmt] = useState(false);
  const fmtSel = useRef(null);
  const [lightbox, setLightbox] = useState(null); // dataUrl открытого изображения
  const fullTaRef = useRef(null);
  const taSwipe = useRef(null);
  const clipText = useRef("");
  const [recSec, setRecSec] = useState(0);
  const recTimer = useRef(null);
  const recCancel = useRef(false);
  const recStartY = useRef(0);
  const micStream = useRef(null);
  const [pendingVoice, setPendingVoice] = useState(null); // {att,origin} ожидает подтверждения отправки
  useEffect(()=>{ /* fullTaResize */ if(composerFull&&fullTaRef.current){ const ta=fullTaRef.current; ta.style.height="auto"; ta.style.height=ta.scrollHeight+"px"; } },[composerFull, note]);
  function sendPendingVoice(){
    const pv=pendingVoice; if(!pv) return;
    const o=pv.origin;
    updNotesAt(o.fid,o.sid,_n=>[..._n,{id:uid("n"),text:"",time:tnow(),ts:tstamp(),pinned:false,attachments:[pv.att]}]);
    setPendingVoice(null);
    setComposerFull(false); setComposerPeek(false); setFid(o.fid); setSid(o.sid); setScr("chat");
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);
  }
  function discardPendingVoice(){ setPendingVoice(null); }
  async function startRec(e){
    recCancel.current=false;
    if(e&&e.touches&&e.touches[0]) recStartY.current=e.touches[0].clientY;
    // освобождаем возможный «зависший» поток с прошлого раза
    try{ if(micStream.current){ micStream.current.getTracks().forEach(t=>t.stop()); micStream.current=null; } }catch{}
    const getMic=async()=>{
      if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia) return await navigator.mediaDevices.getUserMedia({audio:true});
      const gum=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia;
      if(!gum) throw new Error("no getUserMedia");
      return await new Promise((res,rej)=>gum.call(navigator,{audio:true},res,rej));
    };
    let stream;
    try{ stream=await getMic(); }
    catch(err){
      // NotReadableError: устройство занято — короткая пауза и повтор
      if(err&&(err.name==="NotReadableError"||err.name==="AbortError")){
        await new Promise(r=>setTimeout(r,400));
        try{ stream=await getMic(); }
        catch(err2){ tst("Микрофон занят, закройте другие приложения и попробуйте снова"); return; }
      } else if(err&&err.name==="NotAllowedError"){
        // разрешение не выдано — пробуем запросить через Capacitor и повторить
        try{
          const p="@capacitor/core"; const m=await import(/* @vite-ignore */ p);
          if(m&&m.Capacitor&&m.Capacitor.isNativePlatform&&m.Capacitor.isNativePlatform()){
            tst("Разрешите доступ к микрофону в настройках приложения");
          } else { tst("Микрофон: доступ запрещён"); }
        }catch{ tst("Микрофон: доступ запрещён"); }
        return;
      } else { tst("Микрофон: "+(err&&err.name?err.name:"нет доступа")); return; }
    }
    micStream.current=stream;
    try{
      const mr=new MediaRecorder(stream);
      mediaRec.current=mr; recChunks.current=[];
      mr.ondataavailable=ev=>{ if(ev.data&&ev.data.size>0) recChunks.current.push(ev.data); };
      mr.onstop=()=>{
        stream.getTracks().forEach(t=>t.stop()); micStream.current=null;
        if(recTimer.current){ clearInterval(recTimer.current); recTimer.current=null; }
        const cancelled=recCancel.current;
        setRecording(false);
        const secs=recSec;
        setRecSec(0);
        if(cancelled) return;
        const blob=new Blob(recChunks.current,{type:mr.mimeType||"audio/webm"});
        if(blob.size<800) return; // слишком короткая запись
        const fr=new FileReader();
        fr.onload=()=>{
          const att={type:(blob.type&&blob.type.startsWith("audio/"))?blob.type:"audio/webm",name:`Голосовое ${secs}s`,dataUrl:fr.result,size:blob.size,voice:true,dur:secs};
          setPendingVoice({att, origin:composerOrigin.current||{fid,sid}}); // показываем подтверждение
        };
        fr.readAsDataURL(blob);
      };
      mr.start();
      setRecording(true); setRecSec(0);
      recTimer.current=setInterval(()=>setRecSec(x=>x+1),1000);
      try{navigator.vibrate&&navigator.vibrate(12);}catch{}
    }catch{ tst("Запись недоступна"); }
  }
  function stopRec(cancel){
    recCancel.current=!!cancel;
    const mr=mediaRec.current;
    if(mr && mr.state!=="inactive"){ try{mr.stop();}catch{} }
    else { setRecording(false); if(recTimer.current){clearInterval(recTimer.current);recTimer.current=null;} setRecSec(0); }
  }
  function fmtRec(s){ const m=Math.floor(s/60), ss=s%60; return m+":"+String(ss).padStart(2,"0"); }
  async function clipWrite(t){
    clipText.current=t;
    let ok=false;
    try{ const p="@capacitor/clipboard"; const m=await import(/* @vite-ignore */ p); await m.Clipboard.write({string:t}); ok=true; }catch{}
    if(!ok){ try{ if(navigator.clipboard&&navigator.clipboard.writeText){ await navigator.clipboard.writeText(t); ok=true; } }catch{} }
    return ok;
  }
  async function clipRead(){
    try{ const p="@capacitor/clipboard"; const m=await import(/* @vite-ignore */ p); const r=await m.Clipboard.read(); if(r&&typeof r.value==="string") return r.value; }catch{}
    try{ if(navigator.clipboard&&navigator.clipboard.readText){ const t=await navigator.clipboard.readText(); if(t) return t; } }catch{}
    return clipText.current||"";
  }
  const [selBar, setSelBar] = useState(null); // {x,y,hasSel} панель копировать/вставить/вырезать
  useEffect(()=>{
    if(!selBar) return;
    const h=(ev)=>{ const el=ev.target; if(el&&el.closest&&el.closest("[data-selbar]")) return; setSelBar(null); try{const ta=fullTaRef.current; if(ta){const p=ta.selectionStart; ta.setSelectionRange(p,p);} window.getSelection&&window.getSelection().removeAllRanges();}catch{} };
    const id=setTimeout(()=>document.addEventListener("touchstart",h,true),50);
    return ()=>{ clearTimeout(id); document.removeEventListener("touchstart",h,true); };
  },[selBar]);
  const selBarTimer = useRef(null);
  function taHasSelection(){ const el=fullTaRef.current; return el && el.selectionStart!==el.selectionEnd; }
  function showSelBar(clientX,clientY){
    const w=taHasSelection()?250:200,pad=10; const x=Math.max(pad+w/2,Math.min(window.innerWidth-pad-w/2,clientX)); let y=clientY-58; if(y<72) y=clientY+30; y=Math.max(72,Math.min(window.innerHeight-70,y)); setSelBar({x,y,hasSel:taHasSelection()});
  }
  async function tbCopy(){ const el=fullTaRef.current; if(!el){setSelBar(null);return;} const a=el.selectionStart,b=el.selectionEnd; const t=el.value.slice(a,b); if(t){ const ok=await clipWrite(t); if(!ok){ try{ el.focus(); el.setSelectionRange(a,b); document.execCommand("copy"); }catch{} } } setSelBar(null); }
  async function tbCut(){ const el=fullTaRef.current; if(!el){setSelBar(null);return;} const a=el.selectionStart,b=el.selectionEnd; const t=el.value.slice(a,b); if(t){ await clipWrite(t); setNote(el.value.slice(0,a)+el.value.slice(b)); setTimeout(()=>{el.focus();el.setSelectionRange(a,a);},0); } setSelBar(null); }
  async function tbPaste(){ const el=fullTaRef.current; if(!el){setSelBar(null);return;} const a=el.selectionStart,b=el.selectionEnd; const t=await clipRead(); if(t){ const v=el.value; setNote(v.slice(0,a)+t+v.slice(b)); const p=a+t.length; setTimeout(()=>{el.focus();el.setSelectionRange(p,p);},0); } setSelBar(null); }
  function tbAll(){ const el=fullTaRef.current; if(!el)return; el.focus(); el.setSelectionRange(0,el.value.length); setSelBar(s=>s?{...s,hasSel:true}:s); }
  const [composerPeek, setComposerPeek] = useState(false); // редактор уехал вправо, листаем навигацию
  const [destroying, setDestroying] = useState(null);
  const [noInputAnim, setNoInputAnim] = useState(()=>{ try{return localStorage.getItem("napp_noInputAnim")==="1";}catch{return false;} });
  const [noDelAnim, setNoDelAnim] = useState(()=>{ try{return localStorage.getItem("napp_noDelAnim")==="1";}catch{return false;} });
  const dlaunchApplied = useRef(false);
  function setDefaultLaunch(target){ try{ if(target) localStorage.setItem(DLAUNCH_KEY, JSON.stringify(target)); else localStorage.removeItem(DLAUNCH_KEY); }catch{} tst(target?"Будет открываться при запуске":"Запуск сброшен на главный экран"); }
  function getDefaultLaunch(){ try{ const r=localStorage.getItem(DLAUNCH_KEY); return r?JSON.parse(r):null; }catch{ return null; } }
  function toggleDelAnim(){ setNoDelAnim(v=>{ const nv=!v; try{localStorage.setItem("napp_noDelAnim",nv?"1":"0");}catch{} return nv; }); }
  function toggleInputAnim(){ setNoInputAnim(v=>{ const nv=!v; try{localStorage.setItem("napp_noInputAnim",nv?"1":"0");}catch{} return nv; }); }
  const swipeRef = useRef(null);
  const composerOrigin = useRef(null); // {fid,sid} откуда начато сообщение/правка
  const [planePhase, setPlanePhase] = useState('idle'); // 'idle' | 'in'(написать->отправить) | 'out'(отправить->написать)
  const [animSh, setAnimSh] = useState(false); // шторка настроек анимаций
  const histRef = useRef({stack:[""],idx:0,skip:false});
  // фиксируем изменения note в историю (с дебаунсом по словам)
  useEffect(()=>{
    const h=histRef.current;
    if(h.skip){ h.skip=false; return; }
    if(h.stack[h.idx]===note) return;
    h.stack=h.stack.slice(0,h.idx+1);
    h.stack.push(note);
    if(h.stack.length>100) h.stack.shift();
    h.idx=h.stack.length-1;
  },[note]);
  function undoNote(){ const h=histRef.current; if(h.idx>0){ h.idx--; h.skip=true; setNote(h.stack[h.idx]); } }
  function redoNote(){ const h=histRef.current; if(h.idx<h.stack.length-1){ h.idx++; h.skip=true; setNote(h.stack[h.idx]); } }
  // double-tap text selection mode (note id)
  const [selectMode, setSelectMode] = useState(null);

  // floating action buttons: which note is at the bottom of the viewport
  const [inputH, setInputH] = useState(96); // measured input-area height
  const [chatSearch, setChatSearch] = useState(""); // search query within current subfolder

  const bottomRef    = useRef(null);
  const pinRef       = useRef(null);
  const taRef        = useRef(null);
  const fileRef      = useRef(null);
  const importRef    = useRef(null);
  const iconRef      = useRef(null);
  const iconTarget   = useRef("sub"); // "folder" | "sub" — к чему применить выбранное изображение
  const lpTimer      = useRef(null);  // long-press timer
  const lpScrolled   = useRef(false); // detect scroll during long-press
  const asTimer      = useRef(null);  // auto-save timer
  const lastTap      = useRef({id:null,t:0}); // double-tap detection
  const rowTap       = useRef({id:null,t:0}); // double-tap по пустой области строки
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
      if(note && note.trim()!==""){ drafts.current[draftKey]=note; }
      else { delete drafts.current[draftKey]; }
      saveDrafts(drafts.current);
    }
  },[note, sid, fid, scr, editId]);
  // recompute floating buttons when notes or input height change
  useEffect(()=>{ if(scr==="chat") updateActiveNote(); },[data,inputH,isTyping]);
  // measure input area height
  useEffect(()=>{
    if(inputAreaRef.current) setInputH(inputAreaRef.current.offsetHeight);
  });

  const folder = data.folders.find(f=>f.id===fid);
  const subf   = (sid==="__top__" && folder?.isTheme) ? folder : folder?.subfolders.find(s=>s.id===sid);
  const draftKey = sid==="__top__" ? "__top__"+fid : sid;
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
  function openF(f) {
    if(f.isTheme){ setFid(f.id); setSid("__top__"); setScr("chat"); cancelEdit(); setChatSearch(""); setSelectMode(null); setMultiSelect([]); setIsTyping(false);
      setNote(drafts.current["__top__"+f.id]||"");
      return;
    }
    setFid(f.id); setScr("sub"); setSubSearch("");
  }
  function openS(s) {
    setSid(s.id); setScr("chat"); cancelEdit(); setChatSearch(""); setSelectMode(null); setMultiSelect([]); setIsTyping(false);
    setNote(drafts.current[s.id] || "");
  }
  function openThemeAt(folderId, subId, noteId){
    const f=data.folders.find(x=>x.id===folderId); if(!f) return;
    setGlobalSearch(null);
    if(f.isTheme){ setFid(f.id); setSid("__top__"); }
    else { setFid(f.id); setSid(subId); }
    setScr("chat"); cancelEdit(); setChatSearch(""); setSelectMode(null); setMultiSelect([]);
    if(noteId) setTimeout(()=>jumpTo(noteId), 120);
  }
  // Открыть тему/категорию по умолчанию при запуске
  useEffect(()=>{
    if(dlaunchApplied.current) return; dlaunchApplied.current=true;
    const t=getDefaultLaunch(); if(!t) return;
    const f=data.folders.find(x=>x.id===t.fid); if(!f) return;
    if(t.sid==="__top__"||f.isTheme){ setFid(f.id); setSid("__top__"); setScr("chat"); }
    else if(t.sid){ const sub=f.subfolders.find(x=>x.id===t.sid); if(sub){ setFid(f.id); setSid(sub.id); setScr("chat"); } else { setFid(f.id); setScr("sub"); } }
    else { setFid(f.id); setScr("sub"); }
  }, []);
  // Результаты глобального поиска по всем сообщениям
  function globalResults(q){
    if(!q || !q.trim()) return [];
    const ql=q.toLowerCase(); const out=[];
    data.folders.forEach(f=>{
      if(f.isTheme){
        (f.notes||[]).forEach(n=>{ if((n.text||"").toLowerCase().includes(ql)) out.push({folderId:f.id,subId:"__top__",themeName:f.name,note:n}); });
      } else {
        f.subfolders.forEach(s=>{
          (s.notes||[]).forEach(n=>{ if((n.text||"").toLowerCase().includes(ql)) out.push({folderId:f.id,subId:s.id,themeName:`${f.name} · ${s.name}`,note:n}); });
        });
      }
    });
    return out.slice(0,200);
  }
  function back()   {
    if(multiSelect.length){setMultiSelect([]);return;}
    if(selectMode){setSelectMode(null);return;}
    if(scr==="chat"){ if(sid==="__top__"){setScr("main");setSid(null);} else {setScr("sub");} cancelEdit();setChatSearch(""); }
    else if(scr==="sub")setScr("main");
  }
  // Аппаратная кнопка «Назад» (Android). Возвращает true, если что-то закрыли.
  function closeAllMenus(){ setSettingsMenu(false); setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); }
  function handleHardwareBack(){
    if(globalSearch!==null){ setGlobalSearch(null); return true; }
    if(composerFull){ if(composerPeek){ setComposerPeek(false); return true; } setComposerFull(false); return true; }
    if(dlg){ setDlg(null); return true; }
    if(modal){ setModal(null); return true; }
    if(pinnedOpen){ setPinnedOpen(false); return true; }
    if(mediaBrowser){ setMediaBrowser(false); return true; }
    if(attSh){ setAttSh(false); return true; }
    if(expSh){ setExpSh(false); return true; }
    if(settingsMenu||plusMenu||hdrMenu||folderMenu||subMenu){ setSettingsMenu(false);setPlusMenu(false);setHdrMenu(null);setFolderMenu(null);setSubMenu(null); return true; }
    if(moveBuffer){ setMoveBuffer(null); return true; }
    if(chatSearch!==""){ setChatSearch(""); return true; }
    if(multiSelect.length){ setMultiSelect([]); return true; }
    if(selectMode){ setSelectMode(null); return true; }
    if(editId){ cancelEdit(); return true; }
    if(scr==="chat"){ if(sid==="__top__"){setScr("main");setSid(null);} else {setScr("sub");} setChatSearch(""); return true; }
    if(scr==="sub"){ setScr("main"); return true; }
    return false; // на главном экране — не обработали (разрешаем выход по двойному нажатию)
  }

  // Свайп влево для возврата к черновику (работает поверх навигации, не мешая тапам)
  useEffect(()=>{
    if(!(composerFull && composerPeek)) return;
    let sx=null, sy=null;
    const ts=e=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; };
    const te=e=>{ if(sx===null) return; const t=e.changedTouches[0]; const dx=t.clientX-sx, dy=t.clientY-sy; if(dx<-70 && Math.abs(dx)>Math.abs(dy)*1.3){ setComposerPeek(false); } sx=null; sy=null; };
    window.addEventListener("touchstart",ts,{passive:true});
    window.addEventListener("touchend",te,{passive:true});
    return ()=>{ window.removeEventListener("touchstart",ts); window.removeEventListener("touchend",te); };
  },[composerFull,composerPeek]);

  // Аппаратная кнопка «Назад» (Capacitor)
  const exitArm = useRef(false);
  const backRef = useRef(()=>false);
  backRef.current = handleHardwareBack;  // всегда актуальная логика
  useEffect(()=>{
    let remove=()=>{};
    let appRef=null;
    const onBack=()=>{
      const handled = backRef.current();
      if(!handled){
        if(exitArm.current){ try{ if(appRef&&appRef.exitApp) appRef.exitApp(); else if(navigator.app&&navigator.app.exitApp) navigator.app.exitApp(); }catch(e){} }
        else { exitArm.current=true; tst("Нажмите ещё раз для выхода"); setTimeout(()=>{exitArm.current=false;},2000); }
      }
    };
    (async()=>{
      try{
        const cap="@capacitor/app"; const mod = await import(/* @vite-ignore */ cap);
        const App = mod.App || (mod.default&&mod.default.App);
        if(App){
          appRef=App;
          const h = await App.addListener("backButton", onBack);
          remove=()=>h&&h.remove&&h.remove();
          return;
        }
      }catch(e){}
      // Фолбэк: Cordova-style событие
      document.addEventListener("backbutton", onBack, false);
      remove=()=>document.removeEventListener("backbutton", onBack, false);
    })();
    return ()=>remove();
  }, []);

  // ── Folder CRUD ──
  function mkF(n,i,c)  { upd(d=>({...d,folders:[...d.folders,{id:"f"+Date.now(),name:n,icon:i,color:c,unread:0,subfolders:[]}]})); setModal(null); }
  function renF(n,i,c) { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,name:n,icon:i,color:c})})); setModal(null); }
  function pinFolder(id){
    upd(d=>{
      const maxOrder=Math.max(0,...d.folders.filter(f=>f.pinned).map(f=>f.pinOrder||0));
      return {...d,folders:d.folders.map(f=>f.id!==id?f:(f.pinned?{...f,pinned:false}:{...f,pinned:true,pinOrder:maxOrder+1}))};
    });
  }
  const dragTouch = useRef(null);
  const [dragActive, setDragActive] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  function reorderPinFolder(srcId,dstId){
    upd(d=>{
      const pins=d.folders.filter(f=>f.pinned).slice().sort((a,b)=>(a.pinOrder||0)-(b.pinOrder||0));
      const si=pins.findIndex(f=>f.id===srcId), di=pins.findIndex(f=>f.id===dstId);
      if(si<0||di<0) return d;
      const arr=pins.map(f=>f.id); arr.splice(si,1); arr.splice(di,0,srcId);
      const orderMap={}; arr.forEach((id,i)=>orderMap[id]=i+1);
      return {...d,folders:d.folders.map(f=>f.pinned?{...f,pinOrder:orderMap[f.id]??f.pinOrder}:f)};
    });
  }
  function reorderPinSub(srcId,dstId){
    upd(d=>({...d,folders:d.folders.map(f=>{
      if(f.id!==fid) return f;
      const pins=f.subfolders.filter(s=>s.pinned).slice().sort((a,b)=>(a.pinOrder||0)-(b.pinOrder||0));
      const si=pins.findIndex(s=>s.id===srcId), di=pins.findIndex(s=>s.id===dstId);
      if(si<0||di<0) return f;
      const arr=pins.map(s=>s.id); arr.splice(si,1); arr.splice(di,0,srcId);
      const orderMap={}; arr.forEach((id,i)=>orderMap[id]=i+1);
      return {...f,subfolders:f.subfolders.map(s=>s.pinned?{...s,pinOrder:orderMap[s.id]??s.pinOrder}:s)};
    })}));
  }
  // Перетаскивание касанием (long-press + drag): определяем строку под пальцем
  function folderDragTouchStart(id,e){ const y0=e.touches[0].clientY, x0=e.touches[0].clientX; dragTouch.current={id,active:false,y0,x0,lastSwap:0,t:setTimeout(()=>{ if(dragTouch.current&&!dragTouch.current.moved){dragTouch.current.active=true; setDragActive(id); setDragOffset(0); try{navigator.vibrate&&navigator.vibrate(12);}catch{}} },550)}; }
  function folderDragTouchMove(e){
    const dt=dragTouch.current; if(!dt) return;
    if(!dt.active){ const tt=e.touches[0]; if(Math.abs(tt.clientX-dt.x0)>8||Math.abs(tt.clientY-dt.y0)>8){ dt.moved=true; if(dt.t)clearTimeout(dt.t); } return; }
    e.preventDefault();
    const t=e.touches[0];
    setDragOffset(t.clientY-dt.y0);
    const now=Date.now();
    if(now-dt.lastSwap>120){
      const self=document.querySelector(`[data-fid="${dt.id}"]`);
      const prevPE=self?self.style.pointerEvents:null; if(self) self.style.pointerEvents="none";
      const el=document.elementFromPoint(t.clientX,t.clientY);
      if(self) self.style.pointerEvents=prevPE||"";
      const row=el&&el.closest&&el.closest("[data-fid]");
      if(row){ const overId=row.getAttribute("data-fid"); if(overId&&overId!==dt.id){ reorderPinFolder(dt.id,overId); dt.lastSwap=now; dt.y0=t.clientY; setDragOffset(0); } }
    }
  }
  function folderDragTouchEnd(){ const dt=dragTouch.current; if(dt&&dt.t)clearTimeout(dt.t); dragTouch.current=null; setDragActive(null); setDragOffset(0); }
  function subDragTouchStart(id,e){ const y0=e.touches[0].clientY, x0=e.touches[0].clientX; dragTouch.current={id,active:false,y0,x0,lastSwap:0,t:setTimeout(()=>{ if(dragTouch.current&&!dragTouch.current.moved){dragTouch.current.active=true; setDragActive(id); setDragOffset(0); try{navigator.vibrate&&navigator.vibrate(12);}catch{}} },550)}; }
  function subDragTouchMove(e){
    const dt=dragTouch.current; if(!dt) return;
    if(!dt.active){ const tt=e.touches[0]; if(Math.abs(tt.clientX-dt.x0)>8||Math.abs(tt.clientY-dt.y0)>8){ dt.moved=true; if(dt.t)clearTimeout(dt.t); } return; }
    e.preventDefault();
    const t=e.touches[0];
    setDragOffset(t.clientY-dt.y0);
    const now=Date.now();
    if(now-dt.lastSwap>120){
      const self=document.querySelector(`[data-sid="${dt.id}"]`);
      const prevPE=self?self.style.pointerEvents:null; if(self) self.style.pointerEvents="none";
      const el=document.elementFromPoint(t.clientX,t.clientY);
      if(self) self.style.pointerEvents=prevPE||"";
      const row=el&&el.closest&&el.closest("[data-sid]");
      if(row){ const overId=row.getAttribute("data-sid"); if(overId&&overId!==dt.id){ reorderPinSub(dt.id,overId); dt.lastSwap=now; dt.y0=t.clientY; setDragOffset(0); } }
    }
  }
  function subDragTouchEnd(){ const dt=dragTouch.current; if(dt&&dt.t)clearTimeout(dt.t); dragTouch.current=null; setDragActive(null); setDragOffset(0); }
  function delF(id)    { upd(d=>({...d,folders:d.folders.filter(f=>f.id!==id)})); if(fid===id){setFid(null);setScr("main");} }

  // ── Subfolder CRUD ──
  function mkS(n,i,c)  { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:[...f.subfolders,{id:uid("sf"),name:n,icon:i,color:c,notes:[]}]})})); setModal(null); }
  // Применяет преобразование к notes текущей темы (верхнего уровня или подпапки)
  function updNotesAt(tFid,tSid,transform){
    upd(d=>({...d,folders:d.folders.map(f=>{
      if(f.id!==tFid) return f;
      if(tSid==="__top__" && f.isTheme){ return {...f, notes:transform(f.notes||[])}; }
      return {...f, subfolders:f.subfolders.map(s=>s.id!==tSid?s:{...s, notes:transform(s.notes||[])})};
    })}));
  }
  function updNotes(transform){ updNotesAt(fid,sid,transform); }
  function mkTopTheme(n,i,c){ upd(d=>({...d,folders:[...d.folders,{id:uid("f"),name:n,icon:i,color:c,unread:0,isTheme:true,subfolders:[],notes:[]}]})); setModal(null); }
  function renS(n,i,c) { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.map(s=>s.id!==sid?s:{...s,name:n,icon:i,color:c})})})); setModal(null); }
  function pinSub(id){
    upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:(()=>{
      const maxOrder=Math.max(0,...f.subfolders.filter(s=>s.pinned).map(s=>s.pinOrder||0));
      return f.subfolders.map(s=>s.id!==id?s:(s.pinned?{...s,pinned:false}:{...s,pinned:true,pinOrder:maxOrder+1}));
    })()})}));
  }
  function delS(id)    { upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.filter(s=>s.id!==id)})})); if(sid===id){setSid(null);setScr("sub");} }

  // ── Edit in main input ──
  function startEdit(n) {
    setEditId(n.id);
    setNote(n.text||"");
    setPatts(n.attachments||[]);
    setNoteCtx(null);
    setSelectMode(null);
    composerOrigin.current={fid,sid};
    if(noInputAnim){ setComposerFull(true); setComposerPeek(false); }
    else { setPlanePhase('in'); setTimeout(()=>{ setComposerFull(true); setComposerPeek(false); },300); setTimeout(()=>setPlanePhase('idle'),360); }
  }
  function cancelEdit() {
    setEditId(null); setNote(""); setPatts([]); setIsTyping(false); setTaHeight(null); manualResize.current=false; if(draftKey){ delete drafts.current[draftKey]; saveDrafts(drafts.current); }
    if(taRef.current){ taRef.current.style.height="auto"; }
  }
  function saveEdit() {
    if(!note.trim()&&patts.length===0) return;
    updNotes(_n=>(_n.map(n=>n.id===editId?{...n,text:note.trim(),attachments:patts,time:tnow(),ts:tstamp()}:n)));
    cancelEdit();
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  // Отправка из полноэкранного редактора: пишем в origin и возвращаемся туда
  function composerCommit(){
    const o=composerOrigin.current||{fid,sid};
    if(editId){
      if(note.trim()||patts.length){ updNotesAt(o.fid,o.sid,_n=>_n.map(n=>n.id===editId?{...n,text:note.trim(),attachments:patts,time:tnow(),ts:tstamp()}:n)); }
    } else {
      if(note.trim()||patts.length){ updNotesAt(o.fid,o.sid,_n=>[..._n,{id:uid("n"),text:note.trim(),time:tnow(),ts:tstamp(),pinned:false,attachments:patts}]); }
    }
    // очистка черновика
    const dKey = o.sid==="__top__" ? "__top__"+o.fid : o.sid;
    if(dKey){ delete drafts.current[dKey]; saveDrafts(drafts.current); }
    setEditId(null); setNote(""); setPatts([]); setIsTyping(false);
    // возврат в исходную тему + анимация полёта кнопки обратно в позицию "написать"
    setComposerFull(false); setComposerPeek(false);
    setFid(o.fid); setSid(o.sid); setScr("chat");
    if(!noInputAnim){ setPlanePhase('out'); setTimeout(()=>setPlanePhase('idle'),360); }
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);
  }
  // ── Notes ──
  function send() {
    if(!note.trim()&&patts.length===0) return;
    if(editId) { saveEdit(); return; }
    updNotes(_n=>([..._n,{id:uid("n"),text:note.trim(),time:tnow(),ts:tstamp(),pinned:false,attachments:patts}]));
    setNote(""); setPatts([]); setIsTyping(false); setTaHeight(null); manualResize.current=false; if(draftKey){ delete drafts.current[draftKey]; saveDrafts(drafts.current); }
    if(taRef.current) taRef.current.style.height="auto";
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }
  // ── Multi-select ──
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
  async function copySelection(){
    if(!selCopy) return;
    const t=selCopy.text;
    const ok=await clipWrite(t);
    if(!ok) fallbackCopy(t,()=>{});
    setSelCopy(null); try{window.getSelection().removeAllRanges();}catch(e){}
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
    updNotes(_n=>([]));
  }
  function handleMultiTap(n) {
    if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
    const next = multiSelect.includes(n.id)?multiSelect.filter(x=>x!==n.id):[...multiSelect,n.id];
    if(next.length===1){ setMultiSelect([]); setSelectMode(next[0]); }   // -> одиночная панель
    else if(next.length===0){ setMultiSelect([]); setSelectMode(null); } // -> выход
    else { setMultiSelect(next); }
  }
  function clearMulti() { if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setMultiSelect([]); }
  function deleteMulti() {
    const ids=new Set(multiSelect);
    updNotes(_n=>(_n.filter(n=>!ids.has(n.id))));
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
    updNotes(_n=>(_n.filter(n=>!set.has(n.id))));
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
    const arr = (sid==="__top__"&&folder?.isTheme)?(folder.notes||[]):(subf?.notes||[]);
    const idx = arr.findIndex(x=>x.id===n.id);
    setDestroying(n.id);
    setUndo({note:n,fid,sid,idx});
  }
  function undoDel() {
    if(!undo) return;
    const id=undo.note.id;
    const el=document.querySelector(`[data-noteid="${id}"]`);
    if(el){
      // 1) Считываем где сообщение сейчас (в полёте)
      const cs=getComputedStyle(el).transform;
      const op=parseFloat(getComputedStyle(el).opacity)||0;
      const fromT=(cs&&cs!=="none")?cs:"translateX(0px)";
      // 2) Снимаем класс анимации СРАЗУ и переводим элемент в нормальное состояние (React больше не вмешается)
      setDestroying(null);
      setUndo(null);
      // 3) В следующем кадре проигрываем возврат через Web Animations API из запомненной точки в 0
      requestAnimationFrame(()=>{
        const node=document.querySelector(`[data-noteid="${id}"]`)||el;
        try{
          const anim=node.animate(
            [ {transform:fromT, opacity:op}, {transform:"translateX(0) rotate(0)", opacity:1} ],
            {duration:420, easing:"cubic-bezier(.22,1,.36,1)", fill:"none"}
          );
        }catch{}
      });
    } else { setDestroying(null); setUndo(null); }
  }
  // фактическое удаление по истечении времени отмены
  function commitDel(){
    if(!undo) return;
    const u=undo;
    updNotesAt(u.fid,u.sid,_n=>_n.filter(x=>x.id!==u.note.id));
    setDestroying(null);
    setUndo(null);
  }
  function pin(nid) {
    updNotes(_n=>(_n.map(n=>n.id===nid?{...n,pinned:!n.pinned}:n)));
  }

  // ── Copy / Cut / Paste ──
  function copyText(n) {
    const plain = (n.text||"").replace(/\[\/?(b|i|s|spoiler|code|q)\]/g,"").replace(/\[(.*?)\]\((.*?)\)/g,"$1");
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
    updNotes(_n=>([..._n,{...clipboard.note,time:tnow(),ts:tstamp()}]));
    setClipboard(null);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
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
        // открываем редактор, чтобы вложение сразу было в наборе сообщения
        if(!composerFull){ composerOrigin.current={fid,sid}; setEditId(null); setComposerFull(true); setComposerPeek(false); }
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
      if(iconTarget.current==="folder"){
        upd(d=>({...d,folders:d.folders.map(ff=>ff.id!==fid?ff:{...ff,iconImg:url})}));
      } else {
        upd(d=>({...d,folders:d.folders.map(ff=>ff.id!==fid?ff:{...ff,subfolders:ff.subfolders.map(s=>s.id!==sid?s:{...s,iconImg:url})})}));
      }
    };
    r.readAsDataURL(f); e.target.value="";
  }
  function browseIcon(target){ iconTarget.current=target; iconRef.current&&iconRef.current.click(); }
  function onImport(e) {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{try{const p=JSON.parse(ev.target.result);if(p&&p.folders){upd(()=>p);tst("✅ Импортировано");}else tst("❌ Неверный формат");}catch{tst("❌ Ошибка чтения");}};
    r.readAsText(f); e.target.value="";
  }

  // ── Context menu helpers ──
  function openFolderMenu(f,e) {
    e.stopPropagation();
    if(folderMenu&&folderMenu.fid===f.id){ setFolderMenu(null); return; }
    const rect=e.currentTarget.getBoundingClientRect();
    setFolderMenu({fid:f.id,f,rect});
  }
  function openSubMenu(s,e) {
    e.stopPropagation();
    if(subMenu&&subMenu.sid===s.id){ setSubMenu(null); return; }
    const rect=e.currentTarget.getBoundingClientRect();
    setSubMenu({sid:s.id,s,rect});
  }
  function openHdrMenu(type,e) { e.stopPropagation(); setHdrMenu(v=>v===type?null:type); }

  const filtF=data.folders.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()))
    .slice().sort((a,b)=>{
      const ap=a.pinned?1:0, bp=b.pinned?1:0;
      if(ap!==bp) return ap-bp;            // закреплённые — внизу
      if(a.pinned&&b.pinned) return (a.pinOrder||0)-(b.pinOrder||0); // порядок среди закреплённых
      return 0;                             // остальные — в порядке создания (новые снизу)
    });

  // ── Keyboard detection for focus-mode ──


  // (floating buttons removed — no scroll tracking needed)
  function updateActiveNote(){ if(scr==='chat'&&scrollRef.current&&sid){ scrollPos.current[sid]=scrollRef.current.scrollTop; } }

  // ── Auto-grow textarea ──

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
      onClick={()=>{setNoteCtx(null);setHdrMenu(null);setFolderMenu(null);setSubMenu(null);setLinkPopup(null);setSettingsMenu(false);setPlusMenu(false);}}
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
        .editor-ta{-webkit-user-select:text;-webkit-touch-callout:none!important;}
        .editor-ta::selection{background:rgba(239,108,0,.35);}
        .selectable,.selectable *{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important;cursor:text;}
        ::-webkit-scrollbar{width:0;}
        @keyframes sUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fS {from{opacity:0}to{opacity:1}}
        @keyframes tIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .row:active{background:#3A2E24;}
        .row:has(button:active){background:transparent;}
        .menu-dots:active{background:#3A2E24;border-radius:50%;}
        textarea:focus,input:focus{outline:none;}
        *{-webkit-tap-highlight-color:transparent;}
        button{outline:none;-webkit-tap-highlight-color:transparent;}
        button:focus,button:focus-visible{outline:none;}
        /* анимация нажатия отключена, чтобы не было артефактов при переключении */
        .nb{animation:fS .18s ease;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes flyAwayLeft{
          0%{transform:translateX(0) rotate(0);opacity:1}
          18%{transform:translateX(14px) rotate(1.5deg);opacity:1}
          100%{transform:translateX(-140vw) rotate(-8deg);opacity:0}}
        .destroying{animation:flyAwayLeft 2s cubic-bezier(.5,0,.75,0) forwards;will-change:transform;}
        .planeGhost{position:fixed;width:44px;height:44px;border-radius:50%;background:#EF6C00;
          display:flex;align-items:center;justify-content:center;color:#fff;z-index:95;pointer-events:none;
          box-shadow:0 1px 5px rgba(239,108,0,.3);
          transition:left .38s cubic-bezier(.45,0,.25,1),bottom .38s cubic-bezier(.45,0,.25,1),transform .38s cubic-bezier(.45,0,.25,1);}
      `}</style>

      <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={onFiles}/>
      <input ref={importRef} type="file" accept=".json,application/json" style={{display:"none"}} onChange={onImport}/>
      <input ref={iconRef} type="file" accept="image/*" style={{display:"none"}} onChange={onIconPick}/>

      {/* Глобальный поиск по сообщениям */}
      {globalSearch!==null&&(
        <div style={{position:"fixed",inset:0,background:"#1A1410",zIndex:420,display:"flex",flexDirection:"column"}}>
          {/* Результаты сверху */}
          <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
            {globalSearch.trim()==="" && <div style={{textAlign:"center",color:"#6A5A48",marginTop:50,fontSize:14}}>Введите текст для поиска</div>}
            {globalSearch.trim()!=="" && globalResults(globalSearch).length===0 && <div style={{textAlign:"center",color:"#6A5A48",marginTop:50,fontSize:14}}>Ничего не найдено</div>}
            {globalResults(globalSearch).map((r,i)=>(
              <div key={i} onClick={()=>openThemeAt(r.folderId,r.subId,r.note.id)}
                style={{padding:"10px 16px",borderBottom:"1px solid #241C16",cursor:"pointer"}}>
                <div style={{fontSize:12,color:"#EF6C00",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.themeName}</div>
                <div style={{fontSize:14,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{strip(r.note.text)}</div>
                <div style={{fontSize:10,color:"#6A5A48",marginTop:3}}>{r.note.ts?fmtStamp(r.note.ts):r.note.time}</div>
              </div>
            ))}
          </div>
          {/* Панель поиска внизу — в едином стиле, высота 46 */}
          <div style={{padding:"0 12px",flexShrink:0,background:"#241C16",borderTop:"1px solid #3A2E24",minHeight:46,display:"flex",alignItems:"center"}}>
            <div style={{background:"#1A1410",borderRadius:12,display:"flex",alignItems:"center",padding:"0 12px",height:36,gap:8,width:"100%"}}>
              <span style={{color:"#B0A498",display:"flex"}}>{IC.search}</span>
              <input autoFocus value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Поиск по всем сообщениям..."
                style={{background:"none",border:"none",color:"#F2EAE0",fontSize:14,flex:1}}/>
              <button onClick={()=>setGlobalSearch(null)} style={{background:"none",border:"none",color:"#B0A498",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Возвратная вкладка к черновику — видна на ЛЮБОМ экране, пока пишется/редактируется сообщение */}
      {composerFull && composerPeek && (
        <button onClick={()=>setComposerPeek(false)} title="Вернуться к сообщению (свайп влево)"
          style={{position:"fixed",right:0,top:"50%",transform:"translateY(-50%)",zIndex:430,
            background:"rgba(46,37,28,.85)",border:"1px solid #3A2E24",borderRight:"none",color:"#B0A498",cursor:"pointer",
            width:22,height:64,borderRadius:"10px 0 0 10px",display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"-2px 0 10px rgba(0,0,0,.3)"}}>
          <span style={{display:"flex",transform:"scale(.7)"}}>{IC.arrLeft}</span>
        </button>
      )}


      {/* Летящий самолётик: визуальный переход между «написать» (центр) и «отправить» (угол) */}

      {/* Летящий самолётик между «написать» (центр-низ) и «отправить» (угол) */}
      {planePhase!=='idle' && !composerFull && <PlaneGhost phase={planePhase}/>}

      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:84,left:"50%",transform:"translateX(-50%)",
        background:"#241C16",color:"#F2EAE0",borderRadius:12,padding:"10px 18px",fontSize:14,
        zIndex:650,whiteSpace:"nowrap",animation:"tIn .2s ease",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
        {toast}</div>}

      {undo&&<UndoToast onUndo={undoDel} onDone={commitDel}/>}

      {linkPopup&&<LinkPopup href={linkPopup.href} x={linkPopup.x} y={linkPopup.y} onClose={()=>setLinkPopup(null)}/>}

      {/* ══ HEADER — hidden in typing mode ══ */}
      {false&&!(isTyping&&note.length>0)&&!selectMode&&multiSelect.length===0&&(
        <div style={{background:"#241C16",padding:"0 12px",height:46,display:"flex",alignItems:"center",
          gap:10,borderBottom:"1px solid #241C16",flexShrink:0}}>
          {scr!=="main"
            ?<button onClick={back} title="Назад"
               style={{width:38,height:38,borderRadius:"50%",background:"#241C16",border:"none",
                 color:"#F2EAE0",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",
                 justifyContent:"center",lineHeight:1,flexShrink:0}}>{IC.back}</button>
            :null}

          {scr==="main"&&(
            <div style={{position:"relative",flex:1}} onClick={e=>e.stopPropagation()}>
              <div data-menutrigger onClick={()=>{ setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setSettingsMenu(v=>!v); }}
                style={{fontSize:19,fontWeight:700,letterSpacing:-.5,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
                Notenger <span style={{fontSize:12,color:"#B0A498"}}>▾</span>
              </div>
              {settingsMenu&&<DropMenu onClose={()=>setSettingsMenu(false)}
                style={{position:"absolute",top:"calc(100% + 8px)",left:0}}
                items={[
                  {ic:IC.save,label:"Сохранить / экспорт",fn:()=>setExpSh(true)},
                  {ic:IC.imp,label:"Импорт данных",fn:()=>importRef.current&&importRef.current.click()},
                  {ic:IC.sparkle,label:"Настройка анимаций",fn:()=>setAnimSh(true)},
                ]}/>}
            </div>
          )}

          {scr==="sub"&&folder&&(
            <div onClick={e=>{e.stopPropagation();setModal("renF");}}
              style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,cursor:"pointer"}}>
              {/* Тап по иконке категории → форма смены иконки (без файлов) */}
              <Av icon={folder.icon} img={folder.iconImg} color={folder.color} size={36}/>
              <div style={{minWidth:0}}>
                <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{folder.name}</div>
                <div style={{fontSize:12,color:"#B0A498"}}>{folder.subfolders.length} тем</div>
              </div>
            </div>
          )}

          {scr==="chat"&&subf&&(
            <div onClick={e=>{e.stopPropagation();setMediaBrowser(true);}}
              style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,cursor:"pointer"}}>
              {/* Тап по иконке темы → панель вложений (как в Telegram) */}
              <div style={{flexShrink:0}}>
                <Av icon={subf.icon} img={subf.iconImg} color={subf.color} size={36}/>
              </div>
              <div style={{minWidth:0,flex:1}}>
                <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subf.name}</div>
                <div style={{fontSize:12,color:"#B0A498"}}>{subf.notes.length} сообщений</div>
              </div>
            </div>
          )}

          {/* Header right */}
          <div style={{display:"flex",gap:6,marginLeft:"auto",flexShrink:0,position:"relative"}}>
            {scr==="main"&&(
              <button onClick={()=>setGlobalSearch("")} title="Поиск по сообщениям"
                style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.search}</button>
            )}

            {scr==="sub"&&(<>
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button data-menutrigger onClick={e=>openHdrMenu("folder",e)}
                  style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                {hdrMenu==="folder"&&<DropMenu onClose={()=>setHdrMenu(null)}
                  style={{position:"absolute",top:"calc(100% + 6px)",right:0}}
                  items={[
                    {ic:IC.edit,label:"Переименовать категорию",fn:()=>setModal("renF")},
                    {sep:true},
                    {ic:IC.trash,label:"Удалить категорию",danger:true,fn:()=>setDlg({msg:`Удалить «${folder?.name}»?`,yes:()=>delF(fid)})},
                  ]}/>}
              </div>
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button data-menutrigger onClick={()=>{ setSettingsMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setPlusMenu(v=>!v); }} title="Создать"
                  style={{width:38,height:38,background:"#EF6C00",border:"none",color:"#fff",borderRadius:"50%",cursor:"pointer",fontSize:22,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.plus}</button>
                {plusMenu&&<DropMenu onClose={()=>setPlusMenu(false)}
                  style={{position:"absolute",top:"calc(100% + 6px)",right:0}}
                  items={[
                    {ic:IC.fFolder,label:"Новая категория",fn:()=>setModal("mkF")},
                    {ic:IC.fNote,label:"Новая тема",fn:()=>setModal("mkS")},
                  ]}/>}
              </div>
            </>)}

            {scr==="chat"&&(<>
              {/* Search button (Telegram-style) */}
              <button onClick={e=>{e.stopPropagation(); if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setChatSearch(v=>v?"":" ");}} title="Поиск в теме"
                style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",cursor:"pointer",fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.search}</button>
              {/* ⋯ menu — rename only (delete removed) */}
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button data-menutrigger onClick={e=>openHdrMenu("sub",e)}
                  style={{width:38,height:38,background:"#241C16",border:"none",color:"#B0A498",borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                {hdrMenu==="sub"&&<DropMenu onClose={()=>setHdrMenu(null)}
                  style={{position:"absolute",top:"calc(100% + 6px)",right:0}}
                  items={[
                    {ic:IC.pin,label:"Закреплённые сообщения",fn:()=>setPinnedOpen(true)},
                    {ic:IC.edit,label:"Переименовать",fn:()=>setModal(sid==="__top__"?"renF":"renS")},
                    {ic:IC.archive,label:"Очистить тему",fn:()=>setDlg({msg:`Очистить все сообщения в «${subf?.name}»?`,yes:()=>clearSub()})},
                    ...(sid==="__top__"?[{ic:IC.trash,label:"Удалить тему",danger:true,fn:()=>setDlg({msg:`Удалить «${subf?.name}»?`,yes:()=>{delF(fid);setScr("main");setSid(null);}})}]:[]),
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

      {/* ═══ FOLDERS ═══ */}
      {scr==="main"&&(
        <div style={{flex:1,overflowY:"auto",padding:"4px 0",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}
          onTouchMove={folderDragTouchMove}
          onTouchEnd={folderDragTouchEnd}>
          {filtF.length===0&&<div style={{textAlign:"center",color:"#B0A498",marginTop:60,fontSize:15}}>Нет категорий — нажмите +</div>}
          {filtF.map(f=>{
            const last = f.isTheme ? (f.notes||[]).slice(-1)[0] : f.subfolders.flatMap(s=>s.notes).pop();
            return (
              <div key={f.id} data-fid={f.id} className="row" onClick={()=>openF(f)}
                onTouchStart={f.pinned?(e=>folderDragTouchStart(f.id,e)):undefined}
                style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",position:"relative",
                  cursor:"pointer",borderBottom:"1px solid #241C16",
                  background:dragActive===f.id?"#33271B":(f.pinned?"#221A12":"transparent"),
                  transform:dragActive===f.id?`translateY(${dragOffset}px) scale(1.07)`:"none",
                  transition:dragActive===f.id?"box-shadow .18s ease, background .15s ease, scale .15s ease":"transform .22s cubic-bezier(.25,1,.5,1), background .15s ease",
                  boxShadow:dragActive===f.id?"0 18px 42px rgba(0,0,0,.7)":"none",
                  borderRadius:dragActive===f.id?12:0,
                  zIndex:dragActive===f.id?30:"auto"}}>
                {/* Метка типа — прижата к верхней грани, правый угол */}
                <span style={{position:"absolute",top:3,right:12,fontSize:8,letterSpacing:.3,
                  textTransform:"uppercase",color:"#6A5A48",pointerEvents:"none"}}>{f.isTheme?"тема":"катег"}</span>
                <Av icon={f.icon} img={f.iconImg} color={f.color}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0}}>{f.name}</span>
                  </div>
                  <div style={{fontSize:13,color:"#B0A498",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                    {f.isTheme ? (last?strip(last.text):"Нет сообщений") : (last?strip(last.text):`${f.subfolders.length} тем`)}
                  </div>
                </div>
                <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}
                  onPointerDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}>
                  <button className="menu-dots" data-menutrigger onClick={e=>openFolderMenu(f,e)}
                    style={{background:"none",border:"none",color:"#B0A498",fontSize:20,cursor:"pointer",width:34,height:34,opacity:.55,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                  {folderMenu?.fid===f.id&&(()=>{ const est=200; const below=folderMenu.rect.bottom+4; const up=(below+est>window.innerHeight); return (
                  <DropMenu onClose={()=>setFolderMenu(null)}
                    style={up
                      ?{position:"fixed",bottom:(window.innerHeight-folderMenu.rect.top+4),right:window.innerWidth-folderMenu.rect.right}
                      :{position:"fixed",top:below,right:window.innerWidth-folderMenu.rect.right}}
                    items={[
                      {ic:f.pinned?IC.pinOff:IC.pin,label:f.pinned?"Открепить":"Закрепить",fn:()=>pinFolder(f.id)},
                      {sep:true},
                      {ic:IC.edit,label:"Переименовать",fn:()=>{setFid(f.id);setModal("renF");}},
                      {ic:IC.sendUp,label:"Открывать при запуске",fn:()=>setDefaultLaunch({fid:f.id,sid:f.isTheme?"__top__":null})},
                      {ic:IC.trash,label:f.isTheme?"Удалить тему":"Удалить категорию",danger:true,fn:()=>{setFid(f.id);setDlg({msg:`Удалить «${f.name}»?`,yes:()=>delF(f.id),anchor:folderMenu?.rect});}},
                    ]}/> ); })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* НИЖНЯЯ ШАПКА ГЛАВНОГО: Notenger ▾ · поиск · [центр FAB +] */}
      {scr==="main"&&!selectMode&&multiSelect.length===0&&(
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"3px 12px",
          background:"#241C16",borderTop:"1px solid #3A2E24",flexShrink:0,minHeight:46,overflow:"visible"}} onClick={e=>e.stopPropagation()}>
          <div style={{position:"relative",flex:1,minWidth:0}}>
            <div data-menutrigger onClick={()=>{ setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setSettingsMenu(v=>!v); }}
              style={{fontSize:17,fontWeight:700,letterSpacing:-.5,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
              Notenger <span style={{fontSize:11,color:"#B0A498"}}>▾</span>
            </div>
            {settingsMenu&&<DropMenu onClose={()=>setSettingsMenu(false)}
              style={{position:"absolute",bottom:"calc(100% + 8px)",left:0}}
              items={[
                {ic:IC.save,label:"Сохранить / экспорт",fn:()=>setExpSh(true)},
                {ic:IC.imp,label:"Импорт данных",fn:()=>importRef.current&&importRef.current.click()},
                {ic:IC.sparkle,label:"Настройка анимаций",fn:()=>setAnimSh(true)},
                {sep:true},
                {ic:IC.sendUp,label:"Сбросить запуск по умолчанию",fn:()=>setDefaultLaunch(null)},
              ]}/>}
          </div>
          {/* Центрированный FAB + */}
          <button data-menutrigger onClick={()=>{ setSettingsMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setPlusMenu(v=>!v); }} title="Создать"
            style={{position:"absolute",left:"50%",bottom:6,transform:"translateX(-50%)",zIndex:5,
              width:44,height:44,borderRadius:"50%",background:"#EF6C00",border:"none",color:"#fff",cursor:"pointer",
              fontSize:24,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 5px rgba(239,108,0,.3)"}}>{IC.plus}</button>
          {plusMenu&&<DropMenu onClose={()=>setPlusMenu(false)}
            style={{position:"absolute",bottom:"calc(100% + 10px)",left:"50%",transform:"translateX(-50%)"}}
            items={[
              {ic:IC.fFolder,label:"Новая категория",fn:()=>setModal("mkF")},
              {ic:IC.fNote,label:"Новая тема",fn:()=>setModal("mkTop")},
            ]}/>}
          <button onClick={()=>setGlobalSearch("")} title="Поиск по сообщениям"
            style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"#B0A498",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.search}</button>
        </div>
      )}

      {/* ═══ SUBFOLDERS ═══ */}
      {scr==="sub"&&folder&&(
        <div style={{flex:1,overflowY:"auto",padding:"4px 0",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}
          onTouchMove={subDragTouchMove}
          onTouchEnd={subDragTouchEnd}>
          {folder.subfolders.length===0&&<div style={{textAlign:"center",color:"#B0A498",marginTop:60,fontSize:15}}>Нет тем — нажмите +</div>}
          {folder.subfolders.filter(s=>s.name.toLowerCase().includes(subSearch.trim().toLowerCase())).slice().sort((a,b)=>{
            const ap=a.pinned?1:0,bp=b.pinned?1:0;
            if(ap!==bp) return ap-bp;            // закреплённые — внизу
            if(a.pinned&&b.pinned) return (a.pinOrder||0)-(b.pinOrder||0);
            return 0;
          }).map(s=>{
            const last=s.notes[s.notes.length-1];
            return (
              <div key={s.id} data-sid={s.id} className="row" onClick={()=>openS(s)}
                onTouchStart={s.pinned?(e=>subDragTouchStart(s.id,e)):undefined}
                style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",
                  cursor:"pointer",borderBottom:"1px solid #241C16",
                  background:dragActive===s.id?"#33271B":(s.pinned?"#221A12":"transparent"),
                  transform:dragActive===s.id?`translateY(${dragOffset}px) scale(1.07)`:"none",
                  transition:dragActive===s.id?"box-shadow .18s ease, background .15s ease":"transform .22s cubic-bezier(.25,1,.5,1), background .15s ease",
                  boxShadow:dragActive===s.id?"0 18px 42px rgba(0,0,0,.7)":"none",
                  borderRadius:dragActive===s.id?12:0,
                  zIndex:dragActive===s.id?30:"auto"}}>
                <Av icon={s.icon} color={s.color}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:16}}>{s.name}</span>
                  </div>
                  <div style={{fontSize:13,color:"#B0A498",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                    {last?strip(last.text):"Нет сообщений"}
                  </div>
                </div>
                <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}
                  onPointerDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}>
                  <button className="menu-dots" data-menutrigger onClick={e=>openSubMenu(s,e)}
                    style={{background:"none",border:"none",color:"#B0A498",fontSize:20,cursor:"pointer",width:34,height:34,opacity:.55,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                  {subMenu?.sid===s.id&&(()=>{ const est=200; const below=subMenu.rect.bottom+4; const up=(below+est>window.innerHeight); return (
                  <DropMenu onClose={()=>setSubMenu(null)}
                    style={up
                      ?{position:"fixed",bottom:(window.innerHeight-subMenu.rect.top+4),right:window.innerWidth-subMenu.rect.right}
                      :{position:"fixed",top:below,right:window.innerWidth-subMenu.rect.right}}
                    items={[
                      {ic:s.pinned?IC.pinOff:IC.pin,label:s.pinned?"Открепить":"Закрепить",fn:()=>pinSub(s.id)},
                      {sep:true},
                      {ic:IC.edit,label:"Переименовать",fn:()=>{setSid(s.id);setModal("renS");}},
                      {ic:IC.sendUp,label:"Открывать при запуске",fn:()=>setDefaultLaunch({fid:fid,sid:s.id})},
                      {ic:IC.trash,label:"Удалить",danger:true,fn:()=>{setSid(s.id);setDlg({msg:`Удалить «${s.name}»?`,yes:()=>delS(s.id),anchor:subMenu?.rect});}},
                    ]}/> ); })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Строка поиска по темам — внизу */}
      {scr==="sub"&&folder&&subSearch!=="" && !selectMode && multiSelect.length===0 && (
        <div style={{padding:"0 12px",flexShrink:0,background:"#241C16",borderTop:"1px solid #3A2E24",minHeight:46,display:"flex",alignItems:"center"}}>
          <div style={{background:"#1A1410",borderRadius:12,display:"flex",alignItems:"center",padding:"0 12px",height:36,gap:8,width:"100%"}}>
            <span style={{color:"#B0A498",display:"flex"}}>{IC.search}</span>
            <input autoFocus value={subSearch.trim()===""?"":subSearch} onChange={e=>setSubSearch(e.target.value||" ")}
              placeholder="Поиск темы..." style={{background:"none",border:"none",color:"#F2EAE0",fontSize:14,flex:1}}/>
            <button onClick={()=>setSubSearch("")} style={{background:"none",border:"none",color:"#B0A498",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
        </div>
      )}
      {/* ═══ НИЖНЯЯ ШАПКА КАТЕГОРИИ — назад · категория · поиск · ⋯ · + ═══ */}
      {scr==="sub"&&folder&&subSearch===""&&!selectMode&&multiSelect.length===0&&(
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"3px 12px",
          background:"#241C16",borderTop:"1px solid #3A2E24",flexShrink:0,minHeight:46,overflow:"visible"}} onClick={e=>e.stopPropagation()}>
          <button onClick={back} title="Назад"
            style={{width:42,height:42,borderRadius:"50%",background:"none",border:"none",color:"#F2EAE0",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:2}}>{IC.back}</button>
          <div onClick={e=>{e.stopPropagation();setModal("renF");}} style={{minWidth:0,flex:1,cursor:"pointer",paddingLeft:4}}>
            <div style={{fontWeight:600,fontSize:15,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{folder.name}</div>
            <div style={{fontSize:11,color:"#8A7A65"}}>{folder.subfolders.length} тем</div>
          </div>
          <button onClick={()=>setSubSearch(" ")} title="Поиск темы"
            style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"#B0A498",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.search}</button>
          <div style={{position:"relative",flexShrink:0}}>
            <button data-menutrigger onClick={e=>openHdrMenu("folder",e)}
              style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"#B0A498",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
            {hdrMenu==="folder"&&<DropMenu onClose={()=>setHdrMenu(null)}
              style={{position:"absolute",bottom:"calc(100% + 6px)",right:0}}
              items={[
                {ic:IC.edit,label:"Переименовать категорию",fn:()=>setModal("renF")},
                {sep:true},
                {ic:IC.trash,label:"Удалить категорию",danger:true,fn:()=>setDlg({msg:`Удалить «${folder?.name}»?`,yes:()=>delF(fid)})},
              ]}/>}
          </div>
          {/* Центрированный FAB "+" как кнопка "Написать" */}
          <div style={{position:"absolute",left:"50%",bottom:6,transform:"translateX(-50%)",zIndex:5}}>
            <button data-menutrigger onClick={()=>{ setSettingsMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setPlusMenu(v=>!v); }} title="Создать"
              style={{width:44,height:44,borderRadius:"50%",background:"#EF6C00",border:"none",color:"#fff",cursor:"pointer",
                fontSize:22,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 5px rgba(239,108,0,.3)"}}>{IC.plus}</button>
            {plusMenu&&<DropMenu onClose={()=>setPlusMenu(false)}
              style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)"}}
              items={[
                {ic:IC.fFolder,label:"Новая категория",fn:()=>setModal("mkF")},
                {ic:IC.fNote,label:"Новая тема",fn:()=>setModal("mkS")},
              ]}/>}
          </div>
        </div>
      )}

      {/* Верхняя панель действий — заменяет контекстное меню */}
      {/* Chat search bar */}
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
              data-noteid={n.id} className={"nb"+((destroying===n.id&&!noDelAnim)?" destroying":"")}
              style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:0,pointerEvents:destroying===n.id?"none":"auto"}}>
              {n.pinned&&<div style={{fontSize:11,color:subColor,marginBottom:2,paddingRight:2}}>📌 закреплено</div>}

              <div onClick={(e)=>{ if(e.target!==e.currentTarget) return; const now=Date.now(); if(rowTap.current.id===n.id && now-rowTap.current.t<300){ if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; rowTap.current={id:null,t:0}; if(selectMode===n.id){ setSelectMode(null); } else if(multiSelect.includes(n.id)){ setMultiSelect(ms=>ms.filter(x=>x!==n.id)); } else { justEnteredSel.current=n.id; setTimeout(()=>{justEnteredSel.current=null;},450); setSelectMode(n.id); } } else { rowTap.current={id:n.id,t:now}; } }}
                style={{display:"flex",justifyContent:"flex-end",width:"100%",position:"relative"}}>
                <div style={{position:"relative",display:"inline-flex",maxWidth:"calc(100% - 30px)"}}>
                {/* Чекбокс — вплотную слева от пузыря (1px). У широких сообщений оказывается в узком зазоре, у маленьких — у самого сообщения */}
                {(multiActive||selActive) && (
                  <div style={{position:"absolute",right:"100%",top:"50%",transform:"translateY(-50%)",marginRight:2,zIndex:6,pointerEvents:"none"}}>
                    <div style={{width:25,height:25,borderRadius:"50%",flexShrink:0,
                      border:"2px solid "+((isMulti||selActive)?"#EF6C00":"#5A4C40"),
                      background:(isMulti||selActive)?"#EF6C00":"rgba(0,0,0,.2)",
                      display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                      {(isMulti||selActive)?<span style={{display:"flex",transform:"scale(.8)"}}>{IC.check}</span>:null}
                    </div>
                  </div>
                )}

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
                      <RichText text={n.text} color={subColor} onLinkMenu={handleLinkMenu} highlight={chatSearch}/>
                    </div>
                  )}
                  {n.attachments?.map(a=><AttBubble key={a.id} att={a} onOpen={setLightbox}/>)}
                  <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:4,marginTop:5}}>
                    <span style={{fontSize:8.5,color:"#B0A498",userSelect:"none",WebkitUserSelect:"none"}}>{n.ts?fmtStamp(n.ts):n.time}</span>
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

        {/* ── ПОЛНОЭКРАННЫЙ РЕДАКТОР (эксперимент, как Google Keep) ── */}
        {composerFull && (
          <div
            onTouchStart={e=>{ const t=e.touches[0]; swipeRef.current={x:t.clientX,y:t.clientY}; }}
            onTouchEnd={e=>{ const s=swipeRef.current; if(!s){return;} const t=e.changedTouches[0]; const dx=t.clientX-s.x, dy=t.clientY-s.y; if(dx>70 && Math.abs(dx)>Math.abs(dy)*1.3){ setComposerPeek(true); } swipeRef.current=null; }}
            style={{position:"fixed",inset:0,background:"#1A1410",zIndex:400,display:"flex",flexDirection:"column",
              transform: noInputAnim ? "translateX(0)" : (composerPeek?"translateX(100%)":"translateX(0)"),
              transition: noInputAnim ? "none" : "transform .3s cubic-bezier(.32,.72,0,1)",
              pointerEvents:composerPeek?"none":"auto",
              boxShadow:"0 -12px 30px rgba(0,0,0,.5)"}}>
            {/* Верхняя строка: заголовок темы */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 14px",borderBottom:"1px solid #241C16",flexShrink:0}}>
              <div style={{fontWeight:600,fontSize:16,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{editId?"Редактирование":(subf?.name||"Сообщение")}</div>
            </div>
            {/* Прикреплённые файлы в наборе */}
            {patts.length>0&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap",padding:"10px 12px",borderBottom:"1px solid #241C16",flexShrink:0}}>
                {patts.map(a=>(
                  <div key={a.id} style={{position:"relative",borderRadius:10,overflow:"hidden",background:"#2E251C",border:"1px solid #3A2E24"}}>
                    {a.type&&a.type.startsWith("image/")
                      ? <img src={a.dataUrl} alt="" style={{width:72,height:72,objectFit:"cover",display:"block"}}/>
                      : <div style={{width:120,height:72,display:"flex",alignItems:"center",gap:6,padding:"0 10px"}}>
                          <span style={{color:"#EF6C00",display:"flex"}}>{ficon(a.type)}</span>
                          <span style={{fontSize:11,color:"#D8CCBE",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</span>
                        </div>}
                    <button onClick={()=>rmPatt(a.id)}
                      style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.6)",border:"none",borderRadius:"50%",
                        width:20,height:20,color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {/* Текст: растёт снизу вверх (содержимое прижато к низу) */}
            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",overflowY:"auto"}}>
            <textarea ref={fullTaRef} value={note} className="editor-ta"
              onChange={e=>setNote(e.target.value)}
              onSelect={e=>{ fmtSel.current={s:e.target.selectionStart,e:e.target.selectionEnd}; }}
              onKeyUp={e=>{ fmtSel.current={s:e.target.selectionStart,e:e.target.selectionEnd}; }}
              onContextMenu={e=>{ e.preventDefault(); showSelBar(e.clientX||window.innerWidth/2, e.clientY||window.innerHeight/2); }}
              onTouchStart={e=>{ const t=e.touches[0]; taSwipe.current={x:t.clientX,y:t.clientY,h:false}; if(selBarTimer.current)clearTimeout(selBarTimer.current); selBarTimer.current=setTimeout(()=>{ showSelBar(t.clientX,t.clientY); },480); }}
              onTouchMove={e=>{ const s2=taSwipe.current; if(!s2)return; const dx=e.touches[0].clientX-s2.x, dy=e.touches[0].clientY-s2.y; if((Math.abs(dx)>8||Math.abs(dy)>8)&&selBarTimer.current){ clearTimeout(selBarTimer.current); selBarTimer.current=null; } if(!s2.h && Math.abs(dx)>10 && Math.abs(dx)>Math.abs(dy)){ s2.h=true; try{fullTaRef.current&&fullTaRef.current.blur();}catch{} try{window.getSelection&&window.getSelection().removeAllRanges();}catch{} } }}
              onTouchEnd={()=>{ if(selBarTimer.current){clearTimeout(selBarTimer.current);selBarTimer.current=null;} }}
              autoFocus placeholder={editId?"Редактировать сообщение...":"Текст сообщения..."}
              onInput={e=>{ const ta=e.target; ta.style.height="auto"; ta.style.height=ta.scrollHeight+"px"; }}
              rows={1}
              style={{width:"100%",background:"#1A1410",border:"none",outline:"none",
                color:"#F2EAE0",fontSize:16,lineHeight:1.5,padding:"16px 16px",resize:"none",
                boxSizing:"border-box",overflowY:"auto",WebkitTapHighlightColor:"transparent",WebkitTouchCallout:"none",caretColor:"#EF6C00",
                WebkitAppearance:"none",appearance:"none",boxShadow:"none",minHeight:54}}/>
            </div>
            {/* Нижняя панель инструментов */}
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"3px 10px",borderTop:"1px solid #3A2E24",background:"#241C16",flexShrink:0,minHeight:46}}>
              <button onMouseDown={e=>e.preventDefault()} onTouchStart={e=>{ e.preventDefault(); const el=fullTaRef.current; if(el){fmtSel.current={s:el.selectionStart,e:el.selectionEnd};} }} onClick={()=>{ const el=fullTaRef.current; if(el){fmtSel.current={s:el.selectionStart,e:el.selectionEnd};} setFullFmt(v=>!v); }} title="Форматирование"
                style={{width:38,height:38,borderRadius:"50%",background:fullFmt?"#EF6C00":"#2E251C",border:"none",cursor:"pointer",
                  color:fullFmt?"#fff":"#B0A498",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>Aa</button>
              <button onClick={()=>setPrevSh(true)} title="Предпросмотр"
                style={{width:38,height:38,borderRadius:"50%",background:"#2E251C",border:"none",cursor:"pointer",color:"#B0A498",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.eye}</button>
              <button onClick={undoNote} title="Отменить"
                style={{width:38,height:38,borderRadius:"50%",background:"#2E251C",border:"none",cursor:"pointer",color:"#B0A498",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{display:"flex",transform:"scale(.8)"}}>{IC.undo}</span></button>
              <button onClick={redoNote} title="Вернуть"
                style={{width:38,height:38,borderRadius:"50%",background:"#2E251C",border:"none",cursor:"pointer",color:"#B0A498",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{display:"flex",transform:"scale(.8)"}}>{IC.redo}</span></button>
              <button onClick={()=>setAttSh(true)} title="Прикрепить"
                style={{width:38,height:38,borderRadius:"50%",background:"#2E251C",border:"none",cursor:"pointer",color:"#B0A498",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.clip}</button>
              <div style={{flex:1}}/>
              <button onClick={()=>{ const o=composerOrigin.current||{fid,sid}; const dk=o.sid==="__top__"?"__top__"+o.fid:o.sid; if(dk){ delete drafts.current[dk]; saveDrafts(drafts.current); } if(editId) cancelEdit(); setNote(""); setPatts([]); setComposerFull(false); setComposerPeek(false); if(!noInputAnim){ setPlanePhase('out'); setTimeout(()=>setPlanePhase('idle'),360); } }} title="Отменить"
                style={{width:38,height:38,borderRadius:"50%",background:"#2E251C",border:"none",cursor:"pointer",color:"#B0A498",display:"flex",alignItems:"center",justifyContent:"center",marginRight:4}}>{IC.close}</button>
              {(note.trim()||patts.length>0||editId)
                ? <button onClick={composerCommit} title={editId?"Сохранить":"Отправить"}
                    style={{width:44,height:44,borderRadius:"50%",background:"#EF6C00",border:"none",cursor:"pointer",
                      color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px rgba(239,108,0,.4)"}}>{IC.send}</button>
                : <button title="Удерживайте для записи"
                    onTouchStart={e=>{ e.preventDefault(); startRec(e); }}
                    onTouchMove={e=>{ if(recording){ const dy=e.touches[0].clientY-recStartY.current; if(dy>90){ stopRec(true); } } }}
                    onTouchEnd={e=>{ e.preventDefault(); if(recording) stopRec(false); }}
                    style={{width:44,height:44,borderRadius:"50%",background:recording?"#E05252":"#EF6C00",border:"none",cursor:"pointer",
                      color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px rgba(239,108,0,.4)",
                      transform:recording?"scale(1.15)":"scale(1)",transition:"transform .15s ease, background .15s ease"}}>{IC.mic}</button>}
            </div>
            {/* Подтверждение отправки голосового */}
            {pendingVoice && (
              <div style={{position:"absolute",left:0,right:0,bottom:0,background:"#241C16",borderTop:"1px solid #3A2E24",
                padding:"12px 14px",zIndex:24,display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:13,color:"#B0A498"}}>Голосовое сообщение · {fmtRec(pendingVoice.att.dur||0)}</div>
                <audio src={pendingVoice.att.dataUrl} controls style={{width:"100%"}}/>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={discardPendingVoice}
                    style={{flex:1,background:"#2E251C",border:"1px solid #3A2E24",borderRadius:10,padding:"11px",color:"#B0A498",cursor:"pointer",fontSize:14}}>Отмена</button>
                  <button onClick={sendPendingVoice}
                    style={{flex:1,background:"#EF6C00",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>Отправить</button>
                </div>
              </div>
            )}
            {/* Оверлей записи голосового */}
            {recording && (
              <div style={{position:"absolute",left:0,right:0,bottom:0,height:60,background:"#241C16",borderTop:"1px solid #3A2E24",
                display:"flex",alignItems:"center",gap:12,padding:"0 16px",zIndex:20}}>
                <span style={{width:11,height:11,borderRadius:"50%",background:"#E05252",animation:"pulse 1s infinite",flexShrink:0}}/>
                <span style={{fontSize:15,color:"#F2EAE0",fontVariantNumeric:"tabular-nums"}}>{fmtRec(recSec)}</span>
                <span style={{flex:1,fontSize:13,color:"#8A7A65",textAlign:"center"}}>Отпустите для отправки · смахните вверх для отмены</span>
              </div>
            )}
            {/* Кастомная панель выделения: копировать/вставить/вырезать или выбрать всё/вставить */}
            {selBar&&(
              <div data-selbar="1"
                onClick={e=>e.stopPropagation()}
                onTouchStart={e=>{ e.stopPropagation(); swipeRef.current=null; const t=e.touches[0]; selBar._d={dx:t.clientX-selBar.x,dy:t.clientY-selBar.y}; }}
                onTouchMove={e=>{ e.stopPropagation(); e.preventDefault(); const t=e.touches[0]; const d=selBar._d||{dx:0,dy:0}; const w=selBar.hasSel?250:200,pad=10; const nx=Math.max(pad+w/2,Math.min(window.innerWidth-pad-w/2,t.clientX-d.dx)); const ny=Math.max(72,Math.min(window.innerHeight-70,t.clientY-d.dy)); setSelBar(s=>s?{...s,x:nx,y:ny,_d:d}:s); }}
                style={{position:"fixed",left:selBar.x,top:selBar.y,transform:"translateX(-50%)",zIndex:520,
                  background:"rgba(36,28,22,.96)",border:"1px solid #3A2E24",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,.45)",
                  display:"flex",overflow:"hidden",animation:"fS .1s ease",backdropFilter:"blur(2px)"}}>
                {(selBar.hasSel
                  ? [{l:"Копировать",fn:tbCopy},{l:"Вырезать",fn:tbCut},{l:"Вставить",fn:tbPaste}]
                  : [{l:"Выбрать всё",fn:tbAll},{l:"Вставить",fn:tbPaste}]
                ).map((b,i)=>(
                  <button key={i} onClick={b.fn} onTouchStart={e=>e.stopPropagation()} style={{background:"none",border:"none",color:"#D8CCBE",fontSize:12.5,
                    padding:"8px 13px",cursor:"pointer",borderLeft:i?"1px solid #3A2E24":"none",whiteSpace:"nowrap"}}>{b.l}</button>
                ))}
              </div>
            )}
            {/* Поп-меню форматирования внутри полноэкранного */}
            {fullFmt&&(
              <div style={{position:"absolute",left:10,bottom:64,background:"#241C16",borderRadius:12,padding:"5px 6px",
                display:"flex",gap:2,boxShadow:"0 6px 24px rgba(0,0,0,.6)",border:"1px solid #3A2E24",zIndex:5}}>
                {[
                  {l:"B",s:{fontWeight:700},b:"[b]",a:"[/b]",x:"текст"},
                  {l:"I",s:{fontStyle:"italic"},b:"[i]",a:"[/i]",x:"текст"},
                  {l:"S",s:{textDecoration:"line-through"},b:"[s]",a:"[/s]",x:"текст"},
                  {l:"M",s:{fontFamily:"monospace",fontSize:12},b:"[code]",a:"[/code]",x:"код"},
                  {l:"||",s:{opacity:.7},b:"[spoiler]",a:"[/spoiler]",x:"текст"},
                  {l:"❝",s:{},b:"[q]",a:"[/q]",x:"цитата"},
                ].map((it,i)=>(
                  <button key={i} tabIndex={-1}
                    onPointerDown={(ev)=>{ ev.preventDefault(); const el=fullTaRef.current; if(!el)return;
                      // читаем выделение СИНХРОННО, до потери фокуса
                      let s=el.selectionStart, e2=el.selectionEnd;
                      if(s===e2 && fmtSel.current && fmtSel.current.s!==fmtSel.current.e){ s=fmtSel.current.s; e2=fmtSel.current.e; }
                      const cur=el.value; const sel=cur.slice(s,e2)||it.x;
                      const nv=cur.slice(0,s)+it.b+sel+it.a+cur.slice(e2);
                      const p=s+it.b.length+sel.length+it.a.length;
                      setNote(nv);
                      requestAnimationFrame(()=>{ try{ el.focus(); el.setSelectionRange(p,p); fmtSel.current={s:p,e:p}; }catch{} });
                    }}
                    onMouseDown={e=>e.preventDefault()} onTouchStart={e=>e.preventDefault()}
                    style={{background:"none",border:"none",borderRadius:8,padding:"7px 11px",cursor:"pointer",color:"#F2EAE0",fontSize:13,...it.s}}>{it.l}</button>
                ))}
              </div>
            )}
          </div>
        )}

      {scr==="chat"&&(multiSelect.length>0||selectMode)&&(()=>{
        const single = !multiSelect.length && selectMode;
        const selNote = single ? subf?.notes.find(x=>x.id===selectMode) : null;
        const closePanel = ()=>{ if(single) setSelectMode(null); else clearMulti(); };
        return (
        <div style={{background:"#241C16",borderTop:"1px solid #3A2E24",padding:"0 10px",height:46,
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
        {/* ── НИЖНЯЯ ШАПКА ЧАТА (единый блок: шапка ИЛИ поиск) ── */}
        {!selectMode && multiSelect.length===0 && !composerFull && chatSearch!=="" && (
          <div style={{padding:"0 12px",flexShrink:0,background:"#241C16",borderTop:"1px solid #3A2E24",minHeight:46,display:"flex",alignItems:"center"}}>
            <div style={{background:"#1A1410",borderRadius:12,display:"flex",alignItems:"center",padding:"0 12px",height:36,gap:8,width:"100%"}}>
              <span style={{color:"#B0A498",display:"flex"}}>{IC.search}</span>
              <input autoFocus value={chatSearch.trim()===""?"":chatSearch} onChange={e=>setChatSearch(e.target.value||" ")}
                placeholder="Поиск в теме..."
                style={{background:"none",border:"none",color:"#F2EAE0",fontSize:14,flex:1}}/>
              <button onClick={()=>setChatSearch("")} style={{background:"none",border:"none",color:"#B0A498",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
          </div>
        )}
        {!selectMode && multiSelect.length===0 && chatSearch==="" && !composerFull && (
          <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"3px 12px",
            background:"#241C16",borderTop:"1px solid #3A2E24",flexShrink:0,minHeight:46,overflow:"visible"}}>
            <button onClick={back} title="Назад"
              style={{width:42,height:42,borderRadius:"50%",background:"none",border:"none",color:"#F2EAE0",
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:2}}>{IC.back}</button>
            <div onClick={e=>{e.stopPropagation(); if(subf) setMediaBrowser(true);}} style={{minWidth:0,flex:1,cursor:"pointer",paddingLeft:4}}>
              <div style={{fontWeight:600,fontSize:15,color:"#F2EAE0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{subf?.name||"Сообщение"}</div>
              {subf&&<div style={{fontSize:11,color:"#8A7A65"}}>{subf.notes.length} сообщений</div>}
            </div>
            {/* Кнопка Написать — по центру панели */}
            <button onClick={()=>{ closeAllMenus(); if(planePhase!=='idle')return; composerOrigin.current={fid,sid}; setEditId(null); if(noInputAnim){ setComposerFull(true); setComposerPeek(false); } else { setPlanePhase('in'); setTimeout(()=>{ setComposerFull(true); setComposerPeek(false); }, 300); setTimeout(()=>setPlanePhase('idle'),360); } }} title="Написать"
              style={{position:"absolute",left:"50%",bottom:6,transform:"translateX(-50%)",
                width:44,height:44,borderRadius:"50%",opacity:planePhase==='idle'?1:0,
                background:"#EF6C00",border:"none",color:"#fff",cursor:"pointer",zIndex:5,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 1px 5px rgba(239,108,0,.3)"}}>
              <span style={{display:"flex",transform:"scale(.9)"}}>{IC.sendUp}</span>
            </button>
            {/* Поиск + ⋯ справа */}
            <button onClick={e=>{e.stopPropagation(); if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setChatSearch(v=>v?"":" ");}} title="Поиск в теме"
              style={{width:38,height:38,borderRadius:"50%",background:"none",border:"none",color:"#B0A498",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.search}</button>
            <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <button data-menutrigger onClick={e=>openHdrMenu("sub",e)}
                style={{width:38,height:38,borderRadius:"50%",background:"none",border:"none",color:"#B0A498",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
              {hdrMenu==="sub"&&<DropMenu onClose={()=>setHdrMenu(null)}
                style={{position:"absolute",bottom:"calc(100% + 6px)",right:0}}
                items={[
                  {ic:IC.pin,label:"Закреплённые сообщения",fn:()=>setPinnedOpen(true)},
                  {ic:IC.edit,label:"Переименовать",fn:()=>setModal(sid==="__top__"?"renF":"renS")},
                  {ic:IC.archive,label:"Очистить тему",fn:()=>setDlg({msg:`Очистить все сообщения в «${subf?.name}»?`,yes:()=>clearSub()})},
                  ...(sid==="__top__"?[{ic:IC.trash,label:"Удалить тему",danger:true,fn:()=>setDlg({msg:`Удалить «${subf?.name}»?`,yes:()=>{delF(fid);setScr("main");setSid(null);}})}]:[]),
                ]}/>}
            </div>
          </div>
        )}
      </>)}

      {/* Плавающая кнопка копирования выделенного текста */}
      {selCopy&&(<>
        {/* бэкдроп: тап вне — просто закрыть панель (без перехвата у других кнопок) */}
        <div onClick={()=>{ setSelCopy(null); try{window.getSelection&&window.getSelection().removeAllRanges();}catch{} }} style={{position:"fixed",inset:0,zIndex:199}}/>
        <button
          onClick={e=>{e.stopPropagation();copySelection();}}
          style={{position:"fixed",left:Math.max(60,Math.min(selCopy.x,window.innerWidth-60)),
            top:Math.max(70,selCopy.y-46),transform:"translateX(-50%)",zIndex:200,
            background:"rgba(36,28,22,.96)",color:"#D8CCBE",border:"1px solid #3A2E24",borderRadius:10,padding:"8px 14px",
            fontSize:12.5,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.45)",backdropFilter:"blur(2px)",
            display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"flex",transform:"scale(.85)"}}>{IC.copyT}</span> Копировать
        </button>
      </>)}

      {/* ══ MODALS ══ */}
      <LinkDlg open={lnkDlg} selected={lnkSel} onClose={()=>setLnkDlg(false)} onInsert={insertLink}/>
      <PreviewModal open={prevSh} onClose={()=>setPrevSh(false)} onSend={composerCommit} text={note} atts={patts} color={subColor} isEdit={!!editId}/>
      <MediaBrowser open={mediaBrowser} onClose={()=>setMediaBrowser(false)} subf={subf} color={subColor}
        onChangeIcon={()=>{ setMediaBrowser(false); setModal(sid==="__top__"?"renF":"renS"); }}/>
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
                    <span style={{display:"block",color:"#8A7A65",fontSize:9.5,marginTop:2}}>{n.ts?fmtStamp(n.ts):n.time}</span>
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

      {/* Просмотр изображения на весь экран */}
      {lightbox&&(
        <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:600,
          display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <img src={lightbox} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:8}}/>
          <button onClick={()=>setLightbox(null)} style={{position:"absolute",top:16,right:16,background:"rgba(0,0,0,.5)",
            border:"none",borderRadius:"50%",width:40,height:40,color:"#fff",fontSize:20,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      )}
      {/* Attach picker — Telegram-style categories */}
      {attSh&&(
        <div onClick={()=>setAttSh(false)} style={{position:"fixed",inset:0,zIndex:450}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:10,bottom:74,
            background:"#241C16",border:"1px solid #3A2E24",borderRadius:16,padding:10,
            boxShadow:"0 10px 36px rgba(0,0,0,.6)",animation:"fS .15s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3, 78px)",gridAutoRows:"72px",gap:6}}>
            {[
              {ic:IC.gallery,  label:"Изображение",accept:"image/*"},
              {ic:IC.file,     label:"Файл",       accept:"*/*"},
              {ic:IC.camera,   label:"Камера",     accept:"image/*;capture=camera"},
              {ic:IC.video,    label:"Видео",      accept:"video/*"},
              {ic:IC.audio,    label:"Аудио",      accept:"audio/*"},
              {ic:IC.camcorder,label:"Видеозап.",  accept:"video/*;capture=camcorder"},
            ].map(o=>(
              <button key={o.label} onClick={()=>pickFiles(o.accept)}
                style={{background:"#2E251C",border:"1px solid #3A2E24",borderRadius:12,
                  cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5}}>
                <span style={{color:"#EF6C00",display:"flex"}}>{o.ic}</span>
                <span style={{fontSize:10,color:"#D8CCBE"}}>{o.label}</span>
              </button>
            ))}
            </div>
          </div>
        </div>
      )}

      <ExportSheet open={expSh} onClose={()=>setExpSh(false)} data={data} asSettings={asSettings} setAsSettings={setAsSettings}noInputAnim={noInputAnim} toggleInputAnim={toggleInputAnim}/>
      <Sheet open={animSh} onClose={()=>setAnimSh(false)} title="Настройка анимаций">
        <div onClick={toggleInputAnim} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 4px",cursor:"pointer"}}>
          <span style={{flex:1,fontSize:15,color:"#F2EAE0"}}>Отключить анимацию для поля ввода</span>
          <div style={{width:46,height:26,borderRadius:13,background:noInputAnim?"#EF6C00":"#3A2E24",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:2,left:noInputAnim?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
          </div>
        </div>
        <div onClick={toggleDelAnim} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 4px",cursor:"pointer"}}>
          <span style={{flex:1,fontSize:15,color:"#F2EAE0"}}>Отключить анимацию удаления сообщения</span>
          <div style={{width:46,height:26,borderRadius:13,background:noDelAnim?"#EF6C00":"#3A2E24",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:2,left:noDelAnim?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
          </div>
        </div>
        <div style={{fontSize:12,color:"#6A5A48",padding:"0 4px",lineHeight:1.5}}>Когда включено — поле написания открывается и закрывается мгновенно, без анимации скольжения.</div>
      </Sheet>

      <Sheet open={modal==="mkF"}  onClose={()=>setModal(null)}><FolderForm title="Новая категория"            icons={ICONS_F} btnLabel="Создать" onSubmit={mkF}/></Sheet>
      <Sheet open={modal==="renF"} onClose={()=>setModal(null)}>{folder&&<FolderForm title="Редактировать категорию" icons={ICONS_F} initName={folder.name} initIcon={folder.icon} initColor={folder.color} onSubmit={renF} onBrowse={()=>browseIcon("folder")}/>}</Sheet>
      <Sheet open={modal==="mkS"}  onClose={()=>setModal(null)}><FolderForm title="Новая тема"             icons={ICONS_S} btnLabel="Создать" onSubmit={mkS} initColor={folder?.color}/></Sheet>
      <Sheet open={modal==="mkTop"} onClose={()=>setModal(null)}><FolderForm title="Новая тема" icons={ICONS_S} btnLabel="Создать" onSubmit={mkTopTheme}/></Sheet>
      <Sheet open={modal==="renS"} onClose={()=>setModal(null)}>{subf&&<FolderForm title="Редактировать тему"     icons={ICONS_S} initName={subf.name} initIcon={subf.icon} initColor={subf.color} onSubmit={renS} onBrowse={()=>browseIcon("sub")}/>}</Sheet>

      <Dlg open={!!dlg} msg={dlg?.msg} anchor={dlg?.anchor} onYes={()=>{dlg?.yes();setDlg(null);}} onNo={()=>setDlg(null)}/>
    </div>
  );
}
