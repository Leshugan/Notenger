import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";

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
let __LITE=false;
const THEMES = {
  dark:  { "--bg":"#1A1410","--bar":"#2A2017","--row2":"#2E251C","--line":"#4A3A2A","--txt":"#F2EAE0","--sub":"#B0A498","--sub2":"#8A7A65","--ink2":"#D8CCBE","--line2":"#3A2E24","--sub3":"#6A5A48","--barActive":"#33271B","--acc":"#EF6C00","--accfg":"#fff","--gold":"#F5A623","--pinbg":"#3A2A1A","--pinbd":"#F5A623","--dcard":"#241B12","--dcard2":"#1C1510" },
  light: { "--bg":"#EEF1F4","--bar":"#FFFFFF","--row2":"#E7EBEF","--line":"#D3D8DE","--txt":"#1E2329","--sub":"#5F6B78","--sub2":"#8A93A0","--ink2":"#3D4754","--line2":"#DFE4E9","--sub3":"#9AA3AE","--barActive":"#E1E6EB","--acc":"#2F80ED","--accfg":"#fff","--gold":"#2F80ED","--pinbg":"#E3EDFB","--pinbd":"#2F80ED","--dcard":"#E7EBEF","--dcard2":"#DDE3EA" },
};
const IC = {
  sun: (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" style={{display:"block"}}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>),
  moon: (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{display:"block"}}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>),
  send:  (<svg width={28} height={28} viewBox="2 2.5 20 20" style={{display:"block"}}><path d="M12 4.2 Q12.9 4.2 13.5 5.3 L18.7 15.2 Q19.6 16.9 17.7 17.3 Q14.8 17.9 12 15.9 Q9.2 17.9 6.3 17.3 Q4.4 16.9 5.3 15.2 L10.5 5.3 Q11.1 4.2 12 4.2 Z" fill="currentColor"/></svg>),
  sendUp:(<svg width={28} height={28} viewBox="2 2.5 20 20" style={{display:"block"}}><path d="M12 4.2 Q12.9 4.2 13.5 5.3 L18.7 15.2 Q19.6 16.9 17.7 17.3 Q14.8 17.9 12 15.9 Q9.2 17.9 6.3 17.3 Q4.4 16.9 5.3 15.2 L10.5 5.3 Q11.1 4.2 12 4.2 Z" fill="currentColor"/></svg>),
  mic:   <Icon d={["M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z","M19 11a7 7 0 0 1-14 0","M12 18v3"]} stroke={2} />,
  stop:  <Icon d="M7 7h10v10H7z" stroke={2} />,
  clip:  <Icon d="M21 11.5 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 9" stroke={2} />,
  eye:   <Icon d={["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} stroke={2} />,
  search:<Icon d={["M11 11m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0","M21 21l-4.3-4.3"]} stroke={2} />,
  plus:  <Icon d={["M12 5v14","M5 12h14"]} stroke={2.2} />,
  back:  <Icon d="M15 19 8 12l7-7" stroke={2.2} />,
  dots:  <Icon d={["M12 6.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z","M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z","M12 19.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"]} stroke={1} fill="currentColor" />,
  edit:  <Icon d={["M5 19h3.5L19 8.5a2 2 0 0 0-2.8-2.8L5.7 16.2 5 19Z","M14.5 7.5l2.8 2.8"]} stroke={2} />,
  drag:  <Icon d={["M8 6h.01M8 12h.01M8 18h.01M14 6h.01M14 12h.01M14 18h.01"]} stroke={2.5} />,
  scissors: <Icon d={["M6 6a2.4 2.4 0 1 0 0 4.8A2.4 2.4 0 0 0 6 6ZM6 13.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z","M8.1 9.5 19 17M8.1 14.5 19 7"]} stroke={2} />,
  selectAll: <Icon d={["M4 9V6a2 2 0 0 1 2-2h3M15 4h3a2 2 0 0 1 2 2v3M20 15v3a2 2 0 0 1-2 2h-3M9 20H6a2 2 0 0 1-2-2v-3","M8.5 8.5h7v7h-7z"]} stroke={2} />,
  paste: <Icon d={["M9 4h6v3H9z","M7 5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1"]} stroke={1.9} />,
  paste: <Icon d={["M9 4h6v3H9z","M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"]} stroke={2} />,
  copy2: <Icon d={["M9 9h10v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Z","M5 15V5a1 1 0 0 1 1-1h9"]} stroke={2} />,
  palette: <Icon d={["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z","M3 9h18","M7 13h6","M7 16h9"]} stroke={1.7} />,
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
  vibrate:<Icon d={["M8 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5Z","M4 9v6","M20 9v6"]} stroke={1.8} />,
  sliders:<Icon d={["M4 6h10","M18 6h2","M4 12h4","M12 12h8","M4 18h12","M18 18h2"]} stroke={1.8} />,
  arrRight:<Icon d={["M5 12h14","M13 6l6 6-6 6"]} stroke={2} />,
  arrLeft: <Icon d={["M19 12H5","M11 6l-6 6 6 6"]} stroke={2} />,
  copy:  <Icon d={["M9 9h10v12H9z","M5 15V3h10"]} stroke={2} />,
  cut:   <Icon d={["M6 6m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0","M6 18m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0","M20 4 8.5 15.5","M20 20 8.5 8.5"]} stroke={2} />,
  check: <Icon d="M5 12l5 5 9-11" stroke={2.4} />,
  ouro: <Icon d={["M20 12a8 8 0 1 1-3.2-6.4","M16 2.5l1 3.2-3.2 1"]} stroke={2.2} />,
  clock: <Icon d={["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M12 7.5v5l3.2 2"]} stroke={2} />,
  logout: <Icon d={["M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4","M10 8l-4 4 4 4","M6 12h10"]} stroke={2} />,
  close: <Icon d={["M6 6l12 12","M18 6L6 18"]} stroke={2.2} />,
  copyT: (<svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{display:"block"}}>
    <rect x="4" y="3" width="11" height="14" rx="2"/><path d="M17 7h3v12a2 2 0 0 1-2 2H9"/>
    <text x="9.5" y="12.5" fontSize="8" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle">Т</text></svg>),
  copyMsg: <Icon d={["M4 16v-1.5A5.5 5.5 0 0 1 9.5 9H18","M14 5l4.5 4-4.5 4"]} stroke={2} />,
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
  fFolder: <Icon d="M3 6h6l2 2h10v10H3z" stroke={2} />,
  fWork:   <Icon d={["M4 8h16v11H4z","M9 8V6h6v2"]} stroke={2} />,
  fHome:   <Icon d={["M4 11l8-7 8 7","M6 10v9h12v-9"]} stroke={2} />,
  fBook:   <Icon d={["M5 4h13v16H5z","M5 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"]} stroke={2} />,
  fGame:   <Icon d={["M6 9h12a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3 3 3 0 0 1-2.4-1.2l-.6-.8H9l-.6.8A3 3 0 0 1 6 16a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3Z","M8 12v2M7 13h2M15.5 12.5h.01M17 14h.01"]} stroke={1.8} />,
  fGamepad:<Icon d={["M8 8h8a5 5 0 0 1 5 5 4 4 0 0 1-7 2.6l-.6-.6h-2.8l-.6.6A4 4 0 0 1 3 13a5 5 0 0 1 5-5Z","M7 11.5v2.5M5.8 12.7h2.4","M15.5 11.5h.01M17.3 13h.01"]} stroke={1.7} />,
  fMusic:  <Icon d={["M9 18V6l10-2v12","M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z","M19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"]} stroke={2} />,
  fPlane:  <Icon d="M2 12l20-8-8 20-2-8-10-4Z" stroke={2} />,
  fHeart:  <Icon d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z" stroke={2} />,
  fStar:   <Icon d="M12 3l2.6 5.6 6 .7-4.4 4 1.2 6L12 16.8 6.6 19.3l1.2-6L3.4 9.3l6-.7L12 3Z" stroke={2} />,
  fFire:   <Icon d="M12 3c1 4-3 5-3 9a3 3 0 0 0 6 0c0-2-1-3-1-3 2 1 3 3 3 5a5 5 0 0 1-10 0c0-5 5-7 5-11Z" stroke={2} />,
  fLeaf:   <Icon d={["M5 20c-1-9 5-15 15-15 1 9-5 15-15 15Z","M5 20C8 15 12 11 17 9"]} stroke={2} />,
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
  fSettings:<Icon d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z","M12 2v3M12 19v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93"]} stroke={2} />,
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
  fEdit:   <Icon d={["M5 19h3.5L19 8.5a2 2 0 0 0-2.8-2.8L5.7 16.2 5 19Z","M14.5 7.5l2.8 2.8"]} stroke={2} />,
  fSearch: <Icon d={["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z","M21 21l-4-4"]} stroke={2} />,
  fEye:    <Icon d={["M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z","M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]} stroke={2} />,
  fCoffee: <Icon d={["M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z","M17 9h2a2 2 0 0 1 0 5h-2","M7 3v2M11 3v2"]} stroke={2} />,
  fCode:   <Icon d={["M9 8l-4 4 4 4","M15 8l4 4-4 4","M13 6l-2 12"]} stroke={2} />,
  fCar:    <Icon d={["M3 13l2-5h12l2 5","M3 13h18v5H3z","M7 18v2M17 18v2","M6 16h1M17 16h1"]} stroke={1.8} />,
  fPlanet: <Icon d={["M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z","M5.5 14.5C3 16 1.6 17.6 2.2 18.8c.8 1.6 6 .6 11.6-2.2C19.4 13.8 23.4 10 22.6 8.4c-.5-1-2.6-.8-5.4.2"]} stroke={1.8} />,
  fTag:    <Icon d={["M4 4h8l8 8-8 8-8-8V4Z","M8 8a1 1 0 1 0 0-.01"]} stroke={2} />,
  fMoon:   <Icon d="M20 14a8 8 0 1 1-9-11 7 7 0 0 0 9 11Z" stroke={2} />,
  fSun:    <Icon d={["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z","M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"]} stroke={1.8} />,
  fDroplet:<Icon d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z" stroke={2} />,
  launch:  (<svg width={24} height={24} viewBox="0 0 24 24" style={{display:"block"}}><path d="M12 4.2 Q12.9 4.2 13.5 5.3 L18.7 15.2 Q19.6 16.9 17.7 17.3 Q14.8 17.9 12 15.9 Q9.2 17.9 6.3 17.3 Q4.4 16.9 5.3 15.2 L10.5 5.3 Q11.1 4.2 12 4.2 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>),
  launchOff:(<svg width={24} height={24} viewBox="0 0 24 24" style={{display:"block"}}><path d="M12 4.2 Q12.9 4.2 13.5 5.3 L18.7 15.2 Q19.6 16.9 17.7 17.3 Q14.8 17.9 12 15.9 Q9.2 17.9 6.3 17.3 Q4.4 16.9 5.3 15.2 L10.5 5.3 Q11.1 4.2 12 4.2 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
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
    else if (m[16]) {
      // не включать в ссылку хвостовую пунктуацию (закрывающие скобки и знаки)
      let url=m[16]; let trail="";
      while(/[\u0029\u005D\u007D.,;:!?\u00BB"']$/.test(url)){ trail=url.slice(-1)+trail; url=url.slice(0,-1); }
      parts.push({ type:"link", content:url, href:url });
      if(trail) parts.push({ type:"text", content:trail });
    }
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
  while(true){ const i=lc.indexOf(q.toLowerCase(),pos); if(i<0){ parts.push(content.slice(pos)); break; } parts.push(content.slice(pos,i)); parts.push(<mark key={i} style={{background:"var(--acc)",color:"#fff",borderRadius:3,padding:"0 1px"}}>{content.slice(i,i+ql)}</mark>); pos=i+ql; }
  return parts;
}
function RichText({ text, color, onLinkMenu, highlight }) {
  const q=(highlight||"").trim();
  return (
    <span>{parseMarkdown(text).map((p,i) => {
      if (p.type==="bold")   return <strong key={i}>{p.content}</strong>;
      if (p.type==="italic") return <em key={i}>{p.content}</em>;
      if (p.type==="strike") return <s key={i}>{p.content}</s>;
      if (p.type==="spoiler") return <span key={i} style={{background:"var(--sub)",color:"var(--sub)",borderRadius:3,cursor:"pointer",userSelect:"none"}}
        onClick={e=>{e.stopPropagation();e.currentTarget.style.color="var(--txt)";e.currentTarget.style.background="#4A3A22";}}>{p.content}</span>;
      if (p.type==="quote")  return <span key={i} style={{borderLeft:"3px solid "+(color||"#EF6C00"),paddingLeft:8,opacity:.9,display:"inline-block"}}>{p.content}</span>;
      if (p.type==="code")   return <code key={i} style={{background:"var(--dcard)",borderRadius:4,padding:"1px 5px",fontSize:"0.87em",fontFamily:"monospace"}}>{p.content}</code>;
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

// ───── IndexedDB «гараж»: ёмкое хранилище для тяжёлых данных (заметки + медиа) ─────
// localStorage имеет лимит ~5-10МБ; IndexedDB — сотни МБ и больше.
// Стратегия: IndexedDB — авторитетная копия (без лимита); localStorage — быстрый
// синхронный кэш для мгновенного старта. Пишем в оба; если localStorage упёрся в
// лимит — данные всё равно целы в IndexedDB.
const IDB_NAME = "notenger_db";
const IDB_STORE = "kv";
let _idbPromise = null;
function idbOpen(){
  if(_idbPromise) return _idbPromise;
  _idbPromise = new Promise((resolve)=>{
    try{
      if(!window.indexedDB){ resolve(null); return; }
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = ()=>{ try{ const db=req.result; if(!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE); }catch{} };
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>resolve(null);
    }catch{ resolve(null); }
  });
  return _idbPromise;
}
async function idbSet(key, value){
  const db = await idbOpen(); if(!db) return false;
  return new Promise((resolve)=>{
    try{ const tx=db.transaction(IDB_STORE,"readwrite"); tx.objectStore(IDB_STORE).put(value,key);
      tx.oncomplete=()=>resolve(true); tx.onerror=()=>resolve(false); tx.onabort=()=>resolve(false);
    }catch{ resolve(false); }
  });
}
async function idbGet(key){
  const db = await idbOpen(); if(!db) return undefined;
  return new Promise((resolve)=>{
    try{ const tx=db.transaction(IDB_STORE,"readonly"); const r=tx.objectStore(IDB_STORE).get(key);
      r.onsuccess=()=>resolve(r.result); r.onerror=()=>resolve(undefined);
    }catch{ resolve(undefined); }
  });
}
async function idbDel(key){
  const db = await idbOpen(); if(!db) return;
  return new Promise((resolve)=>{
    try{ const tx=db.transaction(IDB_STORE,"readwrite"); tx.objectStore(IDB_STORE).delete(key);
      tx.oncomplete=()=>resolve(true); tx.onerror=()=>resolve(false);
    }catch{ resolve(false); }
  });
}
// Флаг: удалось ли последнее сохранение в localStorage (для индикации режима «только IndexedDB»)
let _lsOK = true;

function loadDrafts(){ try{ const r=localStorage.getItem(DRAFT_KEY); return r?JSON.parse(r):{}; }catch{ return {}; } }
function saveDrafts(d){ try{ localStorage.setItem(DRAFT_KEY,JSON.stringify(d)); }catch{} idbSet(DRAFT_KEY, JSON.stringify(d)); }

const defaultData = {
  folders:[
    {id:"f1",name:"Работа",icon:"fWork",color:"#EF6C00",unread:0,subfolders:[
      {id:"sf1",name:"Проекты",icon:"fFolder",color:"#EF6C00",notes:[
        {id:"n1",text:"Дедлайн по [b]проекту X[/b] — 15 июня",time:"10:24",ts:new Date(2026,5,15,10,24).toISOString(),pinned:true,attachments:[]},
        {id:"n2",text:"Созвон в пятницу 15:00\nСсылка: [Google Meet](https://meet.google.com)",time:"09:10",ts:new Date(2026,5,14,9,10).toISOString(),pinned:false,attachments:[]},
      ]},
      {id:"sf2",name:"Идеи",icon:"fIdea",color:"var(--gold)",notes:[
        {id:"n3",text:"Добавить [i]авторизацию[/i] через [b]Google[/b]",time:"вчера",ts:new Date(2026,5,13,18,30).toISOString(),pinned:false,attachments:[]},
      ]},
    ]},
    {id:"f2",name:"Личное",icon:"fHome",color:"var(--gold)",unread:0,subfolders:[
      {id:"sf3",name:"Покупки",icon:"fCart",color:"var(--gold)",notes:[
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
function saveData(d) {
  const json = JSON.stringify(d);
  const ts = String(Date.now());
  // 1) IndexedDB — авторитетная копия без лимита (всегда)
  idbSet(SK, json); idbSet("napp_data_mtime", ts);
  // 2) localStorage — быстрый синхронный кэш (по возможности)
  try { localStorage.setItem(SK, json); localStorage.setItem("napp_data_mtime", ts); _lsOK=true; }
  catch { _lsOK=false; /* лимит localStorage исчерпан — данные целы в IndexedDB */ }
}
function loadAS()   { try { const r=localStorage.getItem(AS_KEY); return r?JSON.parse(r):defaultAutoSave; } catch { return defaultAutoSave; } }
function saveAS(s)  { try { localStorage.setItem(AS_KEY,JSON.stringify(s)); } catch {} }

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
const COLORS = ["#EF6C00","var(--gold)","#FF8A3D","#D2691E","#C75B39","#8D6E63","#A1887F","#BCAAA4"];
const ICONS_F = ["fFolder","fWork","fHome","fBook","fGamepad","fMusic","fPlane","fHeart","fStar","fFire","fLeaf","fNote","fIdea","fCart","fGym","fPin","fBookmark","fLock","fTarget","fFlask","fChat","fChats","fUser","fUsers","fSettings","fBell","fMail","fPhone","fCamera","fImage","fVideo","fMic","fFile","fLink","fCalendar","fClock","fPinLoc","fWallet","fGift","fFlag","fShield","fGlobe","fBolt","fCloud","fKey","fChart","fCheck","fTrash","fEdit","fSearch","fEye","fCoffee","fCode","fCar","fPlanet","fTag","fMoon","fSun","fDroplet"];
const ICONS_S = ["fFolder","fWork","fHome","fBook","fGamepad","fMusic","fPlane","fHeart","fStar","fFire","fLeaf","fNote","fIdea","fCart","fGym","fPin","fBookmark","fLock","fTarget","fFlask","fChat","fChats","fUser","fUsers","fSettings","fBell","fMail","fPhone","fCamera","fImage","fVideo","fMic","fFile","fLink","fCalendar","fClock","fPinLoc","fWallet","fGift","fFlag","fShield","fGlobe","fBolt","fCloud","fKey","fChart","fCheck","fTrash","fEdit","fSearch","fEye","fCoffee","fCode","fCar","fPlanet","fTag","fMoon","fSun","fDroplet"];
const strip = t=>(t||"").replace(/\[\/?(b|i|s|spoiler|code|q)\]/g,"").replace(/\[.*?\]\(.*?\)/g,"$1").slice(0,52);
const tnow  = ()=>new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
const MES = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
function tstamp(d){ return (d?new Date(d):new Date()).toISOString(); } // храним ISO
// Формат метки времени: "10:24, 01.12.97"
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
  let bin=""; const CH=8192;
  for(let i=0;i<out.length;i+=CH){ bin+=String.fromCharCode.apply(null, out.subarray(i,i+CH)); }
  return btoa(bin);
}
async function aesDecrypt(b64, pwd) {
  const enc=new TextEncoder();
  const raw=Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
  const salt=raw.slice(0,16), iv=raw.slice(16,28), ct=raw.slice(28);
  const km=await crypto.subtle.importKey("raw",enc.encode(pwd),"PBKDF2",false,["deriveKey"]);
  const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:310000,hash:"SHA-256"},km,{name:"AES-GCM",length:256},false,["decrypt"]);
  const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv},key,ct);
  return new TextDecoder().decode(pt);
}

// ═══════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════
function Av({ icon, img, color, size=44, onClick, acc }) {
  const isDefaultOrange = (color==="#EF6C00" || !color);
  const choco = acc==="choco" && isDefaultOrange;
  const neon = acc==="neon" && isDefaultOrange;
  const choconeon = acc==="choconeon" && isDefaultOrange;
  const bg = __LITE ? "#FFFFFF" : (choco ? "var(--line2)" : neon ? "#2E4A6B" : choconeon ? "var(--line2)" : (color||"#EF6C00"));
  const iconColor = __LITE ? "var(--acc)" : (choco ? "var(--acc)" : neon ? "var(--line2)" : choconeon ? "var(--acc)" : "#fff");
  const softBorder = __LITE ? "1px solid var(--line)" : (choco ? "1px solid var(--gline,var(--line))" : neon ? "1px solid #3E5C82" : choconeon ? "1px solid var(--gline,var(--line))" : "none");
  const glow = __LITE ? ((neon||choconeon)?"0 0 14px rgba(47,128,237,.55), 0 0 5px rgba(47,128,237,.4)":"0 2px 8px rgba(0,0,0,.15)") : ((neon||choconeon) ? "0 0 14px rgba(239,108,0,.75), 0 0 5px rgba(239,108,0,.6)" : null);
  return <div onClick={onClick} style={{width:size,height:size,borderRadius:"50%",background:bg,display:"flex",
    alignItems:"center",justifyContent:"center",fontSize:size*.4,flexShrink:0,overflow:"hidden",
    border:softBorder,
    boxShadow:glow || (choco?"none":`0 2px 8px ${bg}55`),cursor:onClick?"pointer":"default"}}>
    {img?<img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:(IC[icon]?<span style={{display:"flex",color:iconColor}}>{IC[icon]}</span>:icon)}
  </div>;
}

function Sheet({ open, onClose, title="", children, noAnim }) {
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
      display:"flex",alignItems:"flex-end",zIndex:300,backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"var(--bar)",
        borderRadius:"20px 20px 0 0",padding:"20px 20px 36px",animation:noAnim?"none":"sUp .34s cubic-bezier(.2,.9,.3,1)",
        maxHeight:"88vh",overflowY:"auto"}}>
        {title&&<div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{title}</div>}
        {children}
        <button onClick={onClose} style={{width:"100%",marginTop:18,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",
          borderRadius:12,padding:13,color:"var(--sub)",cursor:"pointer",fontSize:14}}>Закрыть</button>
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
    boxStyle={position:"fixed",top,left,width:W,background:"var(--bar)",borderRadius:14,padding:16,
      animation:"fS .15s ease",border:"1px solid var(--gline,var(--line))",boxShadow:"0 10px 36px rgba(0,0,0,.6)",zIndex:600};
  } else {
    boxStyle={background:"var(--bar)",borderRadius:16,padding:24,width:"100%",maxWidth:340,animation:"fS .18s ease"};
  }
  return (
    <div onClick={onNo} style={{position:"fixed",inset:0,background:anchor?"rgba(0,0,0,.35)":"rgba(0,0,0,.65)",
      display:"flex",alignItems:anchor?"flex-start":"center",justifyContent:anchor?"flex-start":"center",
      zIndex:600,backdropFilter:anchor?"none":"blur(4px)",padding:anchor?0:"0 24px"}}>
      <div onClick={e=>e.stopPropagation()} style={boxStyle}>
        <div style={{fontSize:14,color:"var(--ink,var(--txt))",marginBottom:16,lineHeight:1.5}}>{msg}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onNo}  style={{flex:1,background:"var(--row2)",border:"none",borderRadius:10,padding:10,color:"var(--sub)",fontSize:14,cursor:"pointer"}}>Отмена</button>
          <button onClick={onYes} style={{flex:1,background:"#E05252",border:"none",borderRadius:10,padding:10,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Удалить</button>
        </div>
      </div>
    </div>
  );
}

// Generic dropdown menu (inline positioned by caller)
function DropMenu({ items, onClose, style:extraStyle={} }) {
  const ref=useRef(null);
  const armed=useRef(false); // защита от «хвостового» клика при открытии длинным нажатием
  useEffect(()=>{
    const t=setTimeout(()=>{ armed.current=true; },250);
    function h(e){ if(e.target&&e.target.closest&&e.target.closest("[data-menutrigger]")) return; if(ref.current&&!ref.current.contains(e.target))onClose(); }
    setTimeout(()=>document.addEventListener("mousedown",h),0);
    return()=>{ clearTimeout(t); document.removeEventListener("mousedown",h); };
  },[onClose]);
  return (
    <>
    <div onClick={(e)=>{e.stopPropagation(); onClose();}} onTouchStart={(e)=>{ if(e.target===e.currentTarget){ e.stopPropagation(); }}} style={{position:"fixed",inset:0,zIndex:1190}}/>
    <div ref={ref} style={{background:"var(--bar)",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.6)",
      overflow:"hidden",width:"max-content",zIndex:1200,animation:"dropGrow .2s cubic-bezier(.2,.9,.3,1.2)",transformOrigin:(extraStyle&&extraStyle.bottom!=null)?"bottom right":"top right",border:"1px solid var(--gline,var(--line))",...extraStyle}}>
      {items.map((item,i)=>item.sep
        ?<div key={i} style={{height:1,background:"var(--gline,var(--line))",margin:"2px 0"}}/>
        :<button key={i} className="dmi" onClick={()=>{ if(!armed.current) return; item.fn();onClose();}}
          style={{background:"none",border:"none",padding:"10px 14px",width:"100%",
            color:item.danger?"#E05252":"var(--txt)",fontSize:14,cursor:"pointer",
            textAlign:"left",display:"flex",alignItems:"center",gap:9,whiteSpace:"nowrap"}}
          >
          <span style={{width:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:item.special||"var(--sub)"}}>{item.ic}</span>
          <span>{item.label}</span>
        </button>
      )}
    </div>
    </>
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
      <div style={{background:"var(--bar)",borderRadius:14,overflow:"hidden",
        boxShadow:"0 6px 28px rgba(0,0,0,.55)",border:"1px solid var(--gline,var(--line))"}}>
        <div style={{height:3,background:"linear-gradient(90deg,#E05252,#FF6B6B)",width:pct+"%",transition:"width .08s linear"}}/>
        <div style={{display:"flex",alignItems:"center",padding:"10px 14px",gap:12}}>
          <svg width={32} height={32} style={{flexShrink:0,transform:"rotate(-90deg)"}}>
            <circle cx={16} cy={16} r={R} fill="none" stroke="var(--line)" strokeWidth={2.5}/>
            <circle cx={16} cy={16} r={R} fill="none" stroke="#E05252" strokeWidth={2.5}
              strokeDasharray={`${dash} ${C}`} strokeLinecap="round" style={{transition:"stroke-dasharray .08s linear"}}/>
            <text x={16} y={16} textAnchor="middle" dominantBaseline="central"
              style={{transform:"rotate(90deg)",transformOrigin:"16px 16px"}}
              fill="#E05252" fontSize={11} fontWeight={700}>{sec}</text>
          </svg>
          <div style={{flex:1}}>
            <div style={{fontSize:14,color:"var(--ink,var(--txt))",fontWeight:500}}>Заметка удалена</div>
            <div style={{fontSize:11,color:"var(--sub)",marginTop:1}}>Нажмите «Отменить» для восстановления</div>
          </div>
          <button onClick={onUndo} style={{background:"var(--acc)",border:"none",borderRadius:10,
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
      <div style={{background:"var(--bar)",borderRadius:16,padding:22,width:"100%",maxWidth:360,animation:"fS .18s ease"}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><span style={{display:"flex",color:"var(--acc)"}}>{IC.fLink}</span> Вставить ссылку</div>
        <div style={{fontSize:12,color:"var(--sub)",marginBottom:5}}>Текст</div>
        <input value={lbl} onChange={e=>setLbl(e.target.value)} placeholder="Текст ссылки"
          style={{width:"100%",background:"var(--bar)",border:"none",borderRadius:10,padding:"10px 12px",color:"var(--ink,var(--txt))",fontSize:14,marginBottom:12,outline:"none"}}/>
        <div style={{fontSize:12,color:"var(--sub)",marginBottom:5}}>URL</div>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://"
          style={{width:"100%",background:"var(--bar)",border:"none",borderRadius:10,padding:"10px 12px",color:"var(--ink,var(--txt))",fontSize:14,marginBottom:18,outline:"none"}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,background:"var(--bar)",border:"none",borderRadius:12,padding:12,color:"var(--sub)",cursor:"pointer",fontSize:14}}>Отмена</button>
          <button onClick={()=>{if(url.trim()){onInsert(lbl.trim()||url.trim(),url.trim());onClose();}}}
            style={{flex:1,background:"var(--acc)",border:"none",borderRadius:12,padding:12,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Вставить</button>
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
      background:"var(--bar)",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.7)",
      overflow:"hidden",zIndex:700,animation:"fS .15s ease",border:"1px solid var(--gline,var(--line))",minWidth:200}}>
      <div style={{fontSize:11,color:"var(--sub)",padding:"8px 14px 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{shortHref}</div>
      {[
        {icon:"📋",label:"Копировать ссылку",fn:()=>{navigator.clipboard?.writeText(href);onClose();}},
        {icon:"↗",label:"Открыть ссылку",fn:()=>{window.open(href,"_blank");onClose();}},
      ].map((it,i)=>(
        <button key={i} onClick={it.fn} style={{width:"100%",background:"none",border:"none",
          borderTop:"1px solid var(--gline,var(--line))",padding:"11px 14px",color:"var(--ink,var(--txt))",fontSize:14,
          cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}
          >
          <span style={{fontSize:16,width:22,textAlign:"center"}}>{it.icon}</span>{it.label}
        </button>
      ))}
    </div>
  );
}

// ─── Preview modal ────────────────────────────────────────────
function PlaneGhost({ phase, acc, accFg, glow, anchor, micAnchor, accBorder }){
  // 'in': центр(самолёт носом вверх 0) летит вправо, ВИДИМЫЙ поворот -> 90, и только в конце -> микрофон
  // 'out': справа(самолёт носом влево -90) летит в центр, доворот -> 0 (носом вверх)
  const [go,setGo]=useState(false);
  const [late,setLate]=useState(false); // финальная фаза: превращение в микрофон
  const ghostRef=useRef(null);
  useEffect(()=>{
    if(ghostRef.current) void ghostRef.current.offsetHeight;
    const t0=setTimeout(()=>setGo(true), 60);
    const tl=setTimeout(()=>setLate(true), 560);
    return ()=>{ clearTimeout(t0); clearTimeout(tl); };
  },[]);
  // Центр = реальная позиция кнопки «Написать»; если не захвачена — запасной вариант по центру низа
  const cx = anchor?anchor.cx:null, cy = anchor?anchor.cy:null;
  const centerPos = anchor
    ? {left:cx+"px", top:cy+"px", transform:"translate(-50%,-50%) scale(1)"}
    : {left:"50%", bottom:"6px", transform:"translateX(-50%) scale(1)"};
  const rightPos = micAnchor
    ? {left:micAnchor.cx+"px", top:micAnchor.cy+"px", transform:"translate(-50%,-50%) scale(1)"}
    : (anchor
      ? {left:(cx+150)+"px", top:cy+"px", transform:"translate(-50%,-50%) scale(1)"}
      : {left:"calc(50% + 150px)", bottom:"6px", transform:"translateX(-50%) scale(1)"});
  const pos = (phase==='in') ? (go?rightPos:centerPos) : (go?centerPos:rightPos);
  let planeRot;
  if(phase==='in'){
    planeRot = go?90:0;   // долетел вправо → повёрнут на 90° = «отправить»
  } else {
    planeRot = go?0:-90;
  }
  return (
    <div ref={ghostRef} className="planeGhost" style={{...pos,background:acc||"#EF6C00",color:accFg||"#fff",border:(accBorder&&accBorder!=="transparent")?("1px solid "+accBorder):"none",boxShadow:glow||((acc&&acc!=="#EF6C00")?"none":"0 1px 5px rgba(239,108,0,.3)")}}>
      <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24}}>
        <span style={{display:"flex",transition:"transform .5s cubic-bezier(.4,0,.2,1)",
          transform:`scale(.9) rotate(${planeRot}deg)`}}>{IC.sendUp}</span>
      </span>
    </div>
  );
}
function PreviewModal({ open, onClose, onSend, text, atts, color, isEdit }) {
  if(!open) return null;
  return (
    <div style={{position:"fixed",top:0,bottom:0,left:0,right:0,background:"var(--bg)",zIndex:600,display:"flex",flexDirection:"column"}}>
      {/* Шапка без стрелки */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 14px",borderBottom:"1px solid var(--gline2,var(--bar))",flexShrink:0}}>
        <div style={{fontWeight:600,fontSize:16,color:"var(--ink,var(--txt))"}}>Предпросмотр</div>
      </div>
      {/* Содержимое — как пузырь сообщения */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 12px",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{background:"var(--row2)",borderRadius:"16px 4px 16px 16px",padding:"10px 14px",maxWidth:"90%"}}>
            {text&&<div style={{fontSize:15,lineHeight:1.6,color:"var(--ink,var(--txt))",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              <RichText text={text} color={color}/></div>}
            {atts?.map((a,i)=><AttBubble key={i} att={a}/>)}
            <div style={{fontSize:8.5,color:"var(--sub)",textAlign:"right",marginTop:5}}>{tnow()} ✓✓</div>
          </div>
        </div>
      </div>
      {/* Нижняя панель: компактная «Изменить» рядом с «Отправить» */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10,padding:"0 12px",border:"1px solid var(--gline,var(--line))",background:"var(--bar)",flexShrink:0,height:52,borderRadius:"16px 16px 0 0",boxShadow:"0 4px 16px rgba(0,0,0,.35)",width:"calc(100% - 2px)",margin:"0 1px"}}>
        <button onClick={onClose} title="Изменить"
          style={{width:40,height:40,borderRadius:"50%",background:"var(--row2)",border:"1px solid var(--gline,var(--line))",color:"var(--sub)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{display:"flex",transform:"scale(.8)"}}>{IC.edit}</span>
        </button>
        <button onClick={()=>{onSend();onClose();}} title={isEdit?"Сохранить":"Отправить"}
          style={{width:44,height:44,borderRadius:"50%",background:"var(--acc)",border:"none",cursor:"pointer",
            color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:_lite?"0 2px 10px rgba(47,128,237,.4)":"0 2px 10px rgba(239,108,0,.4)"}}>{isEdit?IC.check:IC.send}</button>
      </div>
    </div>
  );
}

// ─── Attachment bubble ────────────────────────────────────────
function VoiceMessage({ att, color, center, stamp, compact, selecting }){
  const [playing,setPlaying]=useState(false);
  const [cur,setCur]=useState(0);
  const [dur,setDur]=useState(att.dur||0);
  const [started,setStarted]=useState(false);
  const [finished,setFinished]=useState(false);
  const audioRef=useRef(null);
  const rafRef=useRef(0);
  const trackRef=useRef(null);
  const draggingRef=useRef(false);
  useEffect(()=>{
    const a=new Audio(att.dataUrl);
    audioRef.current=a;
    a.onloadedmetadata=()=>{ if(isFinite(a.duration)&&a.duration>0) setDur(a.duration); };
    a.onended=()=>{ setPlaying(false); setCur(a.duration||dur); setFinished(true); cancelAnimationFrame(rafRef.current); };
    return ()=>{ try{a.pause();}catch{} cancelAnimationFrame(rafRef.current); audioRef.current=null; };
  },[att.dataUrl]);
  useEffect(()=>{
    if(!playing) { cancelAnimationFrame(rafRef.current); return; }
    const tick=()=>{ const a=audioRef.current; if(a&&!draggingRef.current){ setCur(a.currentTime); } rafRef.current=requestAnimationFrame(tick); };
    rafRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[playing]);
  const toggle=(e)=>{ e&&e.stopPropagation(); const a=audioRef.current; if(!a)return; if(playing){ a.pause(); setPlaying(false); } else { if(a.currentTime>=(a.duration||dur)-0.05){ a.currentTime=0; } setCur(a.currentTime); setFinished(false); a.play().then(()=>{ setStarted(true); setPlaying(true); const tick=()=>{ const au=audioRef.current; if(au&&!draggingRef.current){ setCur(au.currentTime); } rafRef.current=requestAnimationFrame(tick); }; cancelAnimationFrame(rafRef.current); rafRef.current=requestAnimationFrame(tick); }).catch(()=>{}); } };
  const pct=dur>0?Math.min(100,(cur/dur)*100):0;
  const fmt=s=>{ s=Math.round(s||0); const m=Math.floor(s/60),ss=s%60; return m+":"+String(ss).padStart(2,"0"); };
  const seekToClientX=(clientX)=>{ const el=trackRef.current; const a=audioRef.current; if(!el||!a||!dur)return; const r=el.getBoundingClientRect(); const x=Math.max(0,Math.min(1,(clientX-r.left)/r.width)); const t=x*dur; a.currentTime=t; setCur(t); };
  const downXY=useRef(null);
  const onDown=(e)=>{ if(selecting){ return; } downXY.current={x:e.clientX,y:e.clientY,seeked:false}; };
  const onMove=(e)=>{ if(selecting||!downXY.current)return; const dx=Math.abs(e.clientX-downXY.current.x), dy=Math.abs(e.clientY-downXY.current.y); if(!downXY.current.seeked && (dx>6||dy>6)){ downXY.current.seeked=true; draggingRef.current=true; } if(draggingRef.current){ e.stopPropagation(); seekToClientX(e.clientX); } };
  const onUp=(e)=>{ if(draggingRef.current){ e.stopPropagation(); } draggingRef.current=false; downXY.current=null; };
  const bars=[6,10,8,14,9,16,7,13,11,18,8,12,15,9,17,10,8,14,11,7,13,9,16,8,12,10,15,9];
  const c=color||"#EF6C00";
  const BARW=compact?2:3, GAP=2, TRACKW=bars.length*(BARW+GAP); const PB=compact?42:48;
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,background:"var(--dcard)",borderRadius:16,padding:"8px 9px",width:"fit-content",maxWidth:270,...(center?{margin:"0 auto"}:{})}}>
      <div style={{flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div ref={trackRef}
          onPointerDown={selecting?undefined:onDown} onPointerMove={selecting?undefined:onMove} onPointerUp={selecting?undefined:onUp} onPointerCancel={selecting?undefined:onUp}
          style={{position:"relative",height:compact?22:26,cursor:selecting?"default":"pointer",touchAction:selecting?"auto":"pan-y",pointerEvents:selecting?"none":"auto",width:TRACKW,display:"flex",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:GAP,position:"absolute",inset:0}}>
            {bars.map((h,i)=><div key={i} style={{width:BARW,height:h,borderRadius:2,background:"var(--line)",flexShrink:0}}/>)}
          </div>
          <div style={{position:"absolute",top:0,left:0,bottom:0,overflow:"hidden",width:pct+"%"}}>
            <div style={{display:"flex",alignItems:"center",gap:GAP,height:"100%",width:TRACKW}}>
              {bars.map((h,i)=><div key={i} style={{width:BARW,height:h,borderRadius:2,background:finished?"var(--sub3)":c,flexShrink:0}}/>)}
            </div>
          </div>
        </div>
        <div style={{fontSize:11,color:"var(--sub)",marginTop:3,fontVariantNumeric:"tabular-nums",display:"flex",gap:6,alignItems:"center",justifyContent:"space-between",width:TRACKW}}><span>{playing||cur>0?fmt(cur):fmt(dur)}</span>{stamp&&<span style={{fontSize:8.5,opacity:.8}}>{stamp}</span>}</div>
      </div>
      <button onClick={toggle} style={{width:PB,height:PB,flexShrink:0,borderRadius:"50%",background:c,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 2px 8px "+c+"55"}}>
        {playing
          ? <svg width={26} height={26} viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.6" fill="#fff"/><rect x="14" y="5" width="4" height="14" rx="1.6" fill="#fff"/></svg>
          : <svg width={26} height={26} viewBox="0 0 24 24"><path d="M8 6.5 L18 12 L8 17.5 Z" fill="#fff" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"/></svg>}
      </button>
    </div>
  );
}
function AttBubble({ att, onOpen, stamp, selecting }) {
  if(att.dataUrl&&att.type?.startsWith("image/")) return (
    <div data-imgsrc={att.dataUrl} style={{marginTop:0,position:"relative"}}>
      <img src={att.dataUrl} alt={att.name} draggable={false} style={{maxWidth:220,width:"100%",borderRadius:9,display:"block",pointerEvents:"none"}}/>
      {stamp&&<span style={{position:"absolute",right:0,bottom:0,left:0,fontSize:9,color:"var(--sub)",background:"linear-gradient(transparent,rgba(20,12,6,.8))",borderRadius:"0 0 9px 9px",padding:"8px 8px 3px",pointerEvents:"none",lineHeight:1.2,fontWeight:500,textAlign:"right"}}>{stamp}</span>}
      {att.caption&&<div style={{fontSize:13,color:"var(--ink2)",marginTop:5,lineHeight:1.4}}>{att.caption}</div>}
    </div>
  );
  if(att.dataUrl&&att.type?.startsWith("video/")) return (
    <div style={{marginTop:8}}>
      <video src={att.dataUrl} controls style={{maxWidth:220,borderRadius:10,display:"block"}}/>
      {att.caption&&<div style={{fontSize:13,color:"var(--ink2)",marginTop:5}}>{att.caption}</div>}
    </div>
  );
  if(att.dataUrl&&att.type?.startsWith("audio/")) return (
    <div style={{marginTop:0}}>
      <VoiceMessage att={att} stamp={stamp} selecting={selecting} />
      {att.caption&&<div style={{fontSize:12,color:"var(--ink2)",marginTop:3}}>{att.caption}</div>}
    </div>
  );
  const openFile=(e)=>{ e.stopPropagation(); try{ const a=document.createElement("a"); a.href=att.dataUrl; a.download=att.name||"file"; document.body.appendChild(a); a.click(); document.body.removeChild(a); }catch{} };
  return (
    <div onClick={openFile} title={att.name}
      style={{marginTop:8,background:"var(--dcard)",borderRadius:10,padding:"8px 12px",
      display:"flex",alignItems:"center",gap:8,maxWidth:230,cursor:"pointer"}}>
      <span style={{color:"var(--acc)",display:"flex"}}>{ficon(att.type)}</span>
      <div style={{minWidth:0}}>
        <div style={{fontSize:13,color:"var(--ink,var(--txt))",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{att.name}</div>
        {att.caption&&<div style={{fontSize:12,color:"var(--ink2)",marginTop:2}}>{att.caption}</div>}
        <div style={{fontSize:11,color:"var(--sub)"}}>{fsize(att.size)}</div>
      </div>
    </div>
  );
}

// ─── Pinned banner ────────────────────────────────────────────
// Живой двухслойный переход экранов (iOS push/pop), без клонов.
// Держит предыдущий контент смонтированным во время анимации и двигает оба слоя.
function ZoomImg({ src }){
  const wrapRef = useRef(null);
  const st = useRef({scale:1,x:0,y:0,startDist:0,startScale:1,startX:0,startY:0,px:0,py:0,pinch:false,pan:false,moved:false,lastTap:0});
  const [,force] = useState(0);
  const apply=()=>{ const el=wrapRef.current; if(el){ const s=st.current; el.style.transform=`translate(${s.x}px,${s.y}px) scale(${s.scale})`; } };
  const dist=(t)=>{ const dx=t[0].clientX-t[1].clientX, dy=t[0].clientY-t[1].clientY; return Math.hypot(dx,dy); };
  const mid=(t)=>({x:(t[0].clientX+t[1].clientX)/2, y:(t[0].clientY+t[1].clientY)/2});
  const onTouchStart=(e)=>{
    const s=st.current;
    if(e.touches.length===2){ s.pinch=true; s.pan=false; s.startDist=dist(e.touches); s.startScale=s.scale; const m=mid(e.touches); s.px=m.x; s.py=m.y; s.startX=s.x; s.startY=s.y; }
    else if(e.touches.length===1){
      const now=Date.now();
      if(now-s.lastTap<300){ // двойной тап — сброс/увеличение
        if(s.scale>1){ s.scale=1; s.x=0; s.y=0; } else { s.scale=2.5; }
        apply(); s.lastTap=0; e.preventDefault(); return;
      }
      s.lastTap=now;
      if(s.scale>1){ s.pan=true; s.startX=e.touches[0].clientX; s.startY=e.touches[0].clientY; s.px=s.x; s.py=s.y; }
      s.moved=false;
    }
  };
  const onTouchMove=(e)=>{
    const s=st.current;
    if(s.pinch && e.touches.length===2){
      e.preventDefault(); e.stopPropagation();
      const d=dist(e.touches); let ns=s.startScale*(d/s.startDist); ns=Math.max(1,Math.min(5,ns)); s.scale=ns;
      if(ns<=1){ s.x=0; s.y=0; } else { const m=mid(e.touches); s.x=s.startX+(m.x-s.px); s.y=s.startY+(m.y-s.py); }
      s.moved=true; apply();
    } else if(s.pan && e.touches.length===1 && s.scale>1){
      e.preventDefault(); e.stopPropagation();
      s.x=s.px+(e.touches[0].clientX-s.startX); s.y=s.py+(e.touches[0].clientY-s.startY); s.moved=true; apply();
    }
  };
  const onTouchEnd=(e)=>{
    const s=st.current;
    if(e.touches.length===0){ s.pinch=false; s.pan=false; }
    else if(e.touches.length===1 && s.pinch){ s.pinch=false; if(s.scale>1){ s.pan=true; s.startX=e.touches[0].clientX; s.startY=e.touches[0].clientY; s.px=s.x; s.py=s.y; } }
  };
  return (
    <div onClick={(e)=>{ if(st.current.moved||st.current.scale>1){ e.stopPropagation(); } }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{maxWidth:"100%",maxHeight:"100%",display:"flex",alignItems:"center",justifyContent:"center",touchAction:"none"}}>
      <img ref={wrapRef} src={src} alt="" draggable={false}
        style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:8,transformOrigin:"center center",willChange:"transform",animation:"lbZoom .26s cubic-bezier(.2,.8,.2,1)",userSelect:"none"}}/>
    </div>
  );
}
function PinnedBanner({ note, color, onJump, count=1, index=0 }) {
  if(!note) return null;
  return (
    <div onClick={onJump} style={{background:"var(--bar)",border:"1px solid var(--gline,var(--line))",
      borderRadius:"0 0 16px 16px",boxShadow:"var(--gline-glow,none)",animation:"pinDown .3s cubic-bezier(.2,.9,.3,1)",
      padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
      {count>1 && (
        <div style={{display:"flex",flexDirection:"column",gap:2,alignSelf:"stretch",justifyContent:"center",paddingRight:2}}>
          {Array.from({length:Math.min(count,4)}).map((_,i)=>(
            <div key={i} style={{width:2.5,height:count<=4?14:9,borderRadius:2,background:i===(index%Math.min(count,4))?"var(--acc)":"var(--line)"}}/>
          ))}
        </div>
      )}
      <span style={{display:"flex",color:"var(--acc)",transform:"scale(.8)"}}>{IC.pin}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color:"var(--acc)",fontWeight:600,marginBottom:1}}>{count>1?`Закреплённые · ${index+1}/${count}`:"Закреплено"}</div>
        <div style={{fontSize:13,color:"var(--ink2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {strip(note.text)||"Вложение"}
        </div>
      </div>
    </div>
  );
}

// ─── Media browser (Telegram-style, opens from avatar tap) ───
function MediaBrowser({ open, onClose, subf, color, onChangeIcon, onOpenImage, onJumpTo, onRename, onClear, onDelete, onPinned, isTopTheme, accent }) {
  const [ctxMenu,setCtxMenu]=useState(null); // {item,x,y}
  const lpRef=useRef(null);
  const startLp=(item,e)=>{ const t=e.touches?e.touches[0]:e; const x=t.clientX,y=t.clientY; lpRef.current=setTimeout(()=>{ buzz(15); setCtxMenu({item,x,y}); },450); };
  const cancelLp=()=>{ clearTimeout(lpRef.current); };
  const [tab,setTab]=useState("photo");
  if(!open||!subf) return null;

  const allAtts = subf.notes.flatMap(n=>(n.attachments||[]).map(a=>({...a,noteText:strip(n.text),noteTime:n.time,noteId:n.id})));
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
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"var(--bar)",
        borderRadius:"20px 20px 0 0",maxHeight:"80vh",display:"flex",flexDirection:"column",animation:"sUp .34s cubic-bezier(.2,.9,.3,1)"}}>
        {/* Шапка темы + действия с иконкой */}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 14px 10px",flexShrink:0}}>
          <Av icon={subf.icon} img={subf.iconImg} color={subf.color||color} size={40} acc={accent}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"var(--font-title)"}}>{subf.name}</div>
            
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,padding:"0 14px 12px",flexShrink:0}}>
          <button onClick={()=>{onChangeIcon&&onChangeIcon();}} title="Изменить иконку темы"
            style={{background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:8,padding:"6px 10px",
              color:"var(--acc)",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{display:"flex",transform:"scale(.85)"}}>{IC.edit}</span> Иконка
          </button>
          <button onClick={()=>{onPinned&&onPinned();}}
            style={{background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:8,padding:"6px 10px",color:"var(--ink2)",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{display:"flex",transform:"scale(.85)"}}>{IC.pin}</span> Закреплённые
          </button>
          <button onClick={()=>{onRename&&onRename();}}
            style={{background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:8,padding:"6px 10px",color:"var(--ink2)",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{display:"flex",transform:"scale(.85)"}}>{IC.edit}</span> Переименовать
          </button>
          <button onClick={()=>{onClear&&onClear();}}
            style={{background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:8,padding:"6px 10px",color:"var(--ink2)",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{display:"flex",transform:"scale(.85)"}}>{IC.archive}</span> Очистить
          </button>
          {isTopTheme && (
          <button onClick={()=>{onDelete&&onDelete();}}
            style={{background:"var(--row2)",border:"1px solid #5A2A22",borderRadius:8,padding:"6px 10px",color:"#E0705C",fontSize:12,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{display:"flex",transform:"scale(.85)"}}>{IC.trash}</span> Удалить
          </button>
          )}
        </div>
        {/* Tab bar */}
        <div style={{display:"flex",borderBottom:"1px solid var(--gline2,var(--bar))",flexShrink:0}}>
          {Object.entries(cats).map(([k,c])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,background:"none",border:"none",
              padding:"12px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,
              borderBottom:tab===k?`2px solid ${color}`:"2px solid transparent",
              color:tab===k?color:"var(--sub)",transition:"color .15s"}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <span style={{fontSize:10}}>{c.label} {c.items.length>0?`(${c.items.length})`:""}</span>
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:12}}>
          {current.items.length===0&&<div style={{textAlign:"center",color:"var(--sub)",marginTop:30,fontSize:14}}>Нет файлов в этой категории</div>}
          {tab==="photo"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
              {current.items.map((a,i)=>(
                <img key={i} src={a.dataUrl} alt={a.name} onClick={()=>onOpenImage&&onOpenImage(a.dataUrl)}
                  onTouchStart={(e)=>startLp(a,e)} onTouchEnd={cancelLp} onTouchMove={cancelLp}
                  onContextMenu={(e)=>{e.preventDefault();setCtxMenu({item:a,x:e.clientX,y:e.clientY});}}
                  style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:8,cursor:"pointer"}}/>
              ))}
            </div>
          )}
          {tab==="video"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {current.items.map((a,i)=>(
                <div key={i} onTouchStart={(e)=>startLp(a,e)} onTouchEnd={cancelLp} onTouchMove={cancelLp} onContextMenu={(e)=>{e.preventDefault();setCtxMenu({item:a,x:e.clientX,y:e.clientY});}}><video src={a.dataUrl} controls style={{width:"100%",borderRadius:10}}/></div>
              ))}
            </div>
          )}
          {tab==="audio"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {current.items.map((a,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"center"}}
                  onTouchStart={(e)=>startLp(a,e)} onTouchEnd={cancelLp} onTouchMove={cancelLp}
                  onContextMenu={(e)=>{e.preventDefault();setCtxMenu({item:a,x:e.clientX,y:e.clientY});}}>
                  <VoiceMessage att={a} compact stamp={a.noteTime} />
                </div>
              ))}
            </div>
          )}
          {tab==="doc"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {current.items.map((a,i)=>(
                <div key={i} onTouchStart={(e)=>startLp(a,e)} onTouchEnd={cancelLp} onTouchMove={cancelLp}
                  onContextMenu={(e)=>{e.preventDefault();setCtxMenu({item:a,x:e.clientX,y:e.clientY});}}
                  style={{background:"var(--bar)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:"var(--acc)",display:"flex"}}>{ficon(a.type)}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"var(--ink,var(--txt))",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                    <div style={{fontSize:11,color:"var(--sub)"}}>{fsize(a.size)} · {a.noteTime}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab==="link"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {current.items.map((l,i)=>(
                <a key={i} href={l.href} target="_blank" rel="noreferrer"
                  style={{background:"var(--bar)",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",
                    gap:10,textDecoration:"none",color:"inherit"}}>
                  <span style={{color:"var(--acc)",display:"flex",flexShrink:0}}>{IC.fLink}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:"var(--acc)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.label}</div>
                    <div style={{fontSize:11,color:"var(--sub)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.href}</div>
                    <div style={{fontSize:10,color:"var(--sub2)",marginTop:2}}>{l.noteTime}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
        <div style={{padding:"12px 16px 24px",borderTop:"1px solid var(--gline2,var(--bar))",flexShrink:0}}>
          <button onClick={onClose} style={{width:"100%",background:"var(--bar)",border:"none",borderRadius:12,padding:13,color:"var(--sub)",cursor:"pointer",fontSize:14}}>Закрыть</button>
        </div>
      </div>
      {ctxMenu&&(
        <div onClick={(e)=>{e.stopPropagation();setCtxMenu(null);}} style={{position:"fixed",inset:0,zIndex:500}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"fixed",
            left:Math.max(8,Math.min(ctxMenu.x-100,window.innerWidth-210)),top:Math.max(8,ctxMenu.y-72),
            background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,.6)",overflow:"hidden",minWidth:200,animation:"fS .12s ease"}}>
            <button onClick={()=>{ const id=ctxMenu.item.noteId; setCtxMenu(null); onClose&&onClose(); onJumpTo&&onJumpTo(id); }}
              style={{width:"100%",background:"none",border:"none",padding:"13px 16px",color:"var(--ink,var(--txt))",fontSize:14,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
              <span style={{display:"flex",color:"var(--acc)"}}>{IC.arrRight}</span> Перейти к сообщению
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Folder form ──────────────────────────────────────────────
function FolderForm({ title, initName="", initIcon="fFolder", initColor, icons, onSubmit, btnLabel="Сохранить", onBrowse, accent }) {
  const [name,setName]=useState(initName);
  const [icon,setIcon]=useState(initIcon);
  const [color,setColor]=useState(initColor||COLORS[0]);
  const isOrange = (color==="#EF6C00");
  const choco = accent==="choco" && isOrange;
  const neon = accent==="neon" && isOrange;
  const choconeon = accent==="choconeon" && isOrange;
  const selBg = __LITE ? (color||"var(--acc)") : (choco ? "var(--line2)" : neon ? "#2E4A6B" : choconeon ? "var(--line2)" : color);
  const selFg = choco ? "var(--acc)" : neon ? "var(--line2)" : choconeon ? "var(--acc)" : "#fff";
  const selBorder = choco ? "var(--line)" : neon ? "#3E5C82" : choconeon ? "var(--line)" : color;
  const selGlow = (neon||choconeon) ? (__LITE?"0 0 14px rgba(47,128,237,.7)":"0 0 14px rgba(239,108,0,.7)") : "none";
  return (
    <>
      <div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{title}</div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Название"
        style={{width:"100%",background:"var(--bar)",border:"none",borderRadius:12,
          padding:"12px 14px",color:"var(--ink,var(--txt))",fontSize:15,marginBottom:14,outline:"none"}}/>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12,color:"var(--sub)",marginBottom:8}}>Иконка</div>
        {onBrowse&&(
          <button onClick={onBrowse} title="Загрузить своё изображение"
            style={{width:"100%",borderRadius:12,cursor:"pointer",border:"1px dashed #5A4C40",
              background:"var(--row2)",color:"var(--acc)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px",marginBottom:10}}>
            <Icon d={["M12 16V4","M7 9l5-5 5 5","M5 20h14"]} stroke={2.2} size={20}/>
            <span style={{fontSize:14,fontWeight:600}}>Загрузить своё изображение</span>
          </button>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, 42px)",gap:8,justifyContent:"center"}}>
          {icons.map(k=>(
            <button key={k} onClick={()=>setIcon(k)}
              style={{width:42,height:42,borderRadius:"50%",cursor:"pointer",border:icon===k?"2px solid "+selBorder:"1px solid var(--gline,var(--line))",
                background:icon===k?selBg:"var(--row2)",color:icon===k?selFg:"var(--sub)",
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all .12s"}}>
              {IC[k]||IC.fFolder}
            </button>
          ))}
        </div>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:12,color:"var(--sub)",marginBottom:8}}>Цвет</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {COLORS.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:28,height:28,borderRadius:"50%",
            background:c,cursor:"pointer",border:color===c?"3px solid #fff":"3px solid transparent",transition:"border .15s"}}/>)}
        </div>
      </div>
      <button onClick={()=>name.trim()&&onSubmit(name.trim(),icon,color)}
        style={{width:"100%",background:__LITE?"var(--acc)":selBg,border:(!__LITE&&choco)?"1px solid var(--gline,var(--line))":(!__LITE&&neon)?"1px solid #3E5C82":(!__LITE&&choconeon)?"1px solid var(--gline,var(--line))":"none",borderRadius:12,padding:13,
          color:__LITE?"#fff":selFg,fontWeight:600,fontSize:15,cursor:"pointer",opacity:name.trim()?1:.5,transition:"background .15s",boxShadow:__LITE?"none":selGlow}}>
        {btnLabel}
      </button>
    </>
  );
}



// ─── Export sheet ─────────────────────────────────────────────
function ExportSheet({ open, onClose, data, asSettings, setAsSettings, noInputAnim, toggleInputAnim, syncSection, buildBackup, onImportClick, asOpen, setAsOpen }) {
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
    const backup = buildBackup ? buildBackup() : data;
    const json=JSON.stringify(backup,null,2);
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
    const fname=`notenger_${dt}.${ext}`;
    const blob=new Blob([content],{type:mime});
    // 0) Android SAF: системный выбор папки через нативный мост
    if(window.AndroidRec && window.AndroidRec.saveFileDialog){
      try{
        const reader=new FileReader();
        reader.onload=()=>{
          const b64=String(reader.result).split(",")[1]||"";
          try{ window.AndroidRec.saveFileDialog(fname, mime, b64); setMsg("Выберите папку для сохранения…"); }
          catch(e){ setMsg("❌ "+(e.message||"Ошибка")); }
          setBusy(false);
        };
        reader.onerror=()=>{ setMsg("❌ Ошибка чтения"); setBusy(false); };
        reader.readAsDataURL(blob);
        return;
      }catch(e){}
    }
    // 1) Современный API (десктоп-браузеры)
    if(window.showSaveFilePicker){
      try{
        const fh=await window.showSaveFilePicker({suggestedName:fname,types:[{description:"Notenger",accept:{[mime]:[`.${ext}`]}}]});
        const w=await fh.createWritable();await w.write(blob);await w.close();
        setMsg("✅ Сохранено");
      }catch(e){if(e&&e.name!=="AbortError")setMsg("❌ "+(e.message||"Ошибка"));}
      setBusy(false);return;
    }
    // 2) WebView/мобильные: data-URL через ссылку (ловится DownloadListener в Android)
    try{
      const reader=new FileReader();
      reader.onload=()=>{
        const a=document.createElement("a");
        a.href=reader.result; // data:...;base64,...
        a.download=fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setMsg("📥 Сохранено в Загрузки");
        setBusy(false);
      };
      reader.onerror=()=>{ setMsg("❌ Ошибка сохранения"); setBusy(false); };
      reader.readAsDataURL(blob);
    }catch(e){
      // 3) Запасной вариант: blob-URL
      try{ const u=URL.createObjectURL(blob),a=document.createElement("a"); a.href=u;a.download=fname;a.click();URL.revokeObjectURL(u); setMsg("📥 Файл сохранён"); }
      catch{ setMsg("❌ Не удалось сохранить"); }
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={()=>{setAsOpen(false);onClose();}} title="Резервная копия данных">
      {syncSection}
      {/* Автосохранение — открывает отдельное меню */}
      <div style={{marginBottom:8}}>
        <div style={{fontSize:13,color:"var(--sub)",marginBottom:8,fontWeight:600}}>Локальное автосохранение</div>
        <div onClick={()=>setAsOpen(true)}
          style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"var(--bar)",borderRadius:10,cursor:"pointer",border:"1px solid var(--gline,var(--line))"}}>
          <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>{(AS_MODES.find(m=>m.val===asSettings.mode)||AS_MODES[0]).label}</span>
          <span style={{display:"flex",color:"var(--sub2)"}}>{IC.arrRight}</span>
        </div>
      </div>
      <Sheet open={asOpen} onClose={()=>setAsOpen(false)} title="Автосохранение">
        {AS_MODES.map(m=>(
          <div key={m.val} onClick={()=>{setAsSettings({mode:m.val});saveAS({mode:m.val});setAsOpen(false);}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:"pointer",marginBottom:6}}>
            <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(asSettings.mode===m.val?"var(--acc)":"#5A4C40"),
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {asSettings.mode===m.val&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--acc)"}}/>}
            </div>
            <span style={{fontSize:14,color:"var(--ink,var(--txt))"}}>{m.label}</span>
          </div>
        ))}
      </Sheet>
      <div style={{height:1,background:"var(--bar)",margin:"16px 0"}}/>
      <div style={{fontSize:15,color:"var(--ink,var(--txt))",fontWeight:600,marginBottom:10}}>Ручная копия</div>
      <div onClick={()=>setUsePwd(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,
        background:"var(--bar)",borderRadius:12,padding:"11px 14px",cursor:"pointer",marginBottom:10,border:"1px solid var(--gline,var(--line))"}}>
        <div style={{width:20,height:20,borderRadius:6,
          background:usePwd?"#9B59B6":"transparent",border:"2px solid "+(usePwd?"#9B59B6":"#5A4C40"),
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {usePwd&&<span style={{fontSize:12,color:"#fff"}}>✓</span>}
        </div>
        <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>Шифровать (AES-256)</span>
      </div>
      {usePwd&&<input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Пароль..."
        style={{width:"100%",background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:10,padding:"11px 14px",
          color:"var(--ink,var(--txt))",fontSize:14,marginBottom:10,outline:"none"}}/>}
      {msg&&<div style={{fontSize:13,color:"#7EC87E",marginBottom:10}}>{msg}</div>}
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>onImportClick&&onImportClick()} disabled={busy}
          style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:12,padding:13,
            color:"var(--ink,var(--txt))",cursor:"pointer",fontSize:14}}>
          <span style={{display:"flex",transform:"scale(.8)"}}>{IC.imp}</span>Импорт
        </button>
        <button onClick={()=>doSave(usePwd)} disabled={busy}
          style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:7,background:usePwd?"#9B59B6":"var(--acc)",border:"none",borderRadius:12,
            padding:13,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14,opacity:busy?0.5:1}}>
          <span style={{display:"flex",transform:"scale(.8)"}}>{IC.save}</span>{busy?"...":"Создать"}
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
  const [theme, setTheme] = useState(()=>{ try{ return localStorage.getItem("ntgr_theme")||"dark"; }catch{ return "dark"; } });
  const toggleTheme=()=>{ const t=theme==="dark"?"light":"dark"; setTheme(t); try{ localStorage.setItem("ntgr_theme",t); }catch{} };
  // Стартовая сверка с IndexedDB (гараж): подтягиваем данные, если localStorage
  // пуст/устарел (например, ранее упёрся в лимит и не сохранил последнюю версию),
  // и заодно мигрируем существующие localStorage-данные в IndexedDB при первом запуске.
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const idbJson = await idbGet(SK);
        const idbTs = parseInt(await idbGet("napp_data_mtime")||"0",10);
        const lsTs = parseInt(localStorage.getItem("napp_data_mtime")||"0",10);
        if(idbJson){
          // IndexedDB новее локального кэша → применяем (случай: LS упёрся в лимит)
          if(idbTs>lsTs){
            try{ const parsed=dedupeIds(JSON.parse(idbJson)); if(!cancelled){ setData(parsed); try{ localStorage.setItem(SK,idbJson); localStorage.setItem("napp_data_mtime",String(idbTs)); }catch{} } }catch{}
          }
        } else {
          // Первый запуск с IndexedDB: мигрируем то, что уже есть в localStorage
          const lsJson = localStorage.getItem(SK);
          if(lsJson){ idbSet(SK, lsJson); idbSet("napp_data_mtime", String(lsTs||Date.now())); }
          // и черновики
          const dr = localStorage.getItem(DRAFT_KEY); if(dr) idbSet(DRAFT_KEY, dr);
        }
      }catch{}
    })();
    return ()=>{ cancelled=true; };
  },[]);
  const _initLaunch = (()=>{
    try{
      const t=JSON.parse(localStorage.getItem(DLAUNCH_KEY)||"null"); if(!t) return null;
      const d=JSON.parse(localStorage.getItem(SK)||"null"); if(!d||!d.folders) return null;
      const f=d.folders.find(x=>x.id===t.fid); if(!f) return null;
      if(t.sid==="__top__"||f.isTheme) return {scr:"chat",fid:f.id,sid:"__top__"};
      if(t.sid){ const sub=f.subfolders.find(x=>x.id===t.sid); return sub?{scr:"chat",fid:f.id,sid:sub.id}:{scr:"sub",fid:f.id,sid:null}; }
      return {scr:"sub",fid:f.id,sid:null};
    }catch{ return null; }
  })();
  const [scr,       setScr]       = useState(_initLaunch?_initLaunch.scr:"main");
  const [navTick,   setNavTick]   = useState(0);
  const [staggerOn, setStaggerOn] = useState(false);
  const firstRender = useRef(true);
  const delTimers = useRef({});
  const multiDelTimer = useRef(null);
  const lmTitleTimer = useRef(null);
  const writeHoldTimer = useRef(null);
  const writeHoldFired = useRef(false);
  const writeStartX = useRef(null);
  const [booting, setBooting] = useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setBooting(false), 500); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ firstRender.current=false; },[]);
  const [fid,       setFid]       = useState(_initLaunch?_initLaunch.fid:null);
  const [sid,       setSid]       = useState(_initLaunch?_initLaunch.sid:null);
  useEffect(()=>{ setStaggerOn(true); const t=setTimeout(()=>setStaggerOn(false),1100); return ()=>clearTimeout(t); },[]);
  const [navDir, setNavDir] = useState("push");
  const navTickInit = useRef(true);
  function captureNavSnapshot(dir){
    if(booting) return;
    try{
      const root=document.querySelector("[data-ver-badge]");
      if(!root) return;
      const rect=root.getBoundingClientRect();
      const ease="cubic-bezier(.33,.05,.2,1)";
      // снимок СТАРОГО экрана (живой клон), уезжает; новый проявляется под ним
      const snap=root.cloneNode(true);
      snap.removeAttribute("data-ver-badge"); snap.className="";
      try{ snap.querySelectorAll("*").forEach(el=>{ const z=parseInt(el.style&&el.style.zIndex||"0",10); if(z>=300){ el.style.visibility="hidden"; } }); }catch{}
      // на время пролёта прячем картинки/превью — резко облегчает GPU-текстуру слоя → выше FPS
      try{ snap.querySelectorAll("img,[data-imgsrc],video,canvas").forEach(el=>{ el.style.visibility="hidden"; }); }catch{}
      snap.style.position="fixed"; snap.style.top=rect.top+"px"; snap.style.left=rect.left+"px";
      snap.style.width=rect.width+"px"; snap.style.height=rect.height+"px";
      snap.style.margin="0"; snap.style.maxWidth="none"; snap.style.pointerEvents="none";
      snap.style.background="var(--bg)"; snap.style.overflow="hidden";
      snap.style.willChange="transform"; snap.style.backfaceVisibility="hidden"; snap.style.contain="strict";
      snap.style.transformStyle="flat";
      snap.style.zIndex="2147483646";
      const shadow=document.createElement("div");
      shadow.style.cssText="position:absolute;top:0;bottom:0;"+(dir==="pop"?"left:-18px":"right:-18px")+";width:18px;background:linear-gradient(to "+(dir==="pop"?"left":"right")+",rgba(0,0,0,.28),transparent);pointer-events:none;";
      snap.appendChild(shadow);
      document.body.appendChild(snap);
      // растеризуем слой ОДИН раз перед стартом (готовая текстура двигается без перерисовки → ровный FPS)
      snap.style.transform="translate3d(0,0,0)";
      void snap.offsetHeight;
      snap.style.transition="transform .35s "+ease;
      requestAnimationFrame(()=>{
        snap.style.transform = dir==="pop" ? "translate3d(106%,0,0)" : "translate3d(-106%,0,0)";
      });
      setTimeout(()=>{ try{ snap.remove(); }catch{} }, 370);
    }catch{}
  }
  const noAnimOnce = useRef(false);
  const prevScrInfo = useRef({scr:null,fid:null,sid:null});
  const [suppressScrAnim, setSuppressScrAnim] = useState(false);
  useLayoutEffect(()=>{
    if(navTickInit.current){ navTickInit.current=false; prevScrInfo.current={scr,fid,sid}; return; }
    const prev=prevScrInfo.current;
    const depth=s=> s==="main"?0 : s==="sub"?1 : 2;
    const dir = depth(scr) >= depth(prev.scr) ? "push" : "pop";
    prevScrInfo.current={scr,fid,sid};
    setNavDir(dir);
    if(noAnimOnce.current){ noAnimOnce.current=false; setSuppressScrAnim(true); setTimeout(()=>setSuppressScrAnim(false),50); }
    setNavTick(t=>t+1);
  },[scr,fid,sid]);
  const [search,    setSearch]    = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState(null); // null=закрыт, "" или строка=открыт
  const [note,      setNote]      = useState("");
  const drafts = useRef(loadDrafts());
  const [patts,     setPatts]     = useState([]);
  const [capPos,    setCapPos]    = useState("top"); // позиция подписи для текущего сообщения с фото
  const [checklist, setChecklist] = useState(null); // [{id,text,checked}] — режим списка в композере, null = обычный текст
  const [clTitle,   setClTitle]   = useState("");   // отдельный заголовок списка
  const [listMode,  setListMode]  = useState(null);  // {fid,sid,id} — открытый на весь экран список
  const [clDragId, setClDragId] = useState(null);
  const [clDragOff, setClDragOff] = useState(0);
  const [lmDragId, setLmDragId] = useState(null);
  const [lmDragOff, setLmDragOff] = useState(0);
  const [lmDragOrder, setLmDragOrder] = useState(null);   // локальный порядок id при drag
  const [lmLand, setLmLand] = useState(null);             // {id, off} — приземление после броска
  const [clEditId,  setClEditId]  = useState(null); // id пункта, который сейчас редактируется (input не readOnly)
  const [lmEditId,  setLmEditId]  = useState(null);
  const [lmEditMode, setLmEditMode] = useState(false);
  const clItemRefs = useRef({});
  function finalizeChecklist(){ if(!checklist) return null; const items=checklist.filter(x=>x.text.trim()!==""); if(!items.length) return null; return items.map(x=>({...x})); }
  const lmDragRef = useRef(null);
  const lm_setItemsRef = useRef(null);
  function lmRowTouchStart(idx,e,items,setItems){
    const id=items&&items[idx]?items[idx].id:null; if(!id)return;
    const y0=e.touches[0].clientY, x0=e.touches[0].clientX;
    const order=items.map(x=>x.id);
    lmDragRef.current={id,active:false,moved:false,y0,x0,order,setItems,curIndex:order.indexOf(id),t:setTimeout(()=>{
      if(lmDragRef.current&&!lmDragRef.current.moved){
        const dt=lmDragRef.current; dt.active=true;
        // СНИМОК геометрии один раз (как в SortableJS): центры и высоты слотов в текущем порядке
        const els=dt.order.map(id=>document.querySelector(`[data-lmid="${id}"]`));
        dt.slots=els.map(el=>{ const r=el.getBoundingClientRect(); return {top:r.top, h:r.height, mid:r.top+r.height/2}; });
        dt.els=els;
        dt.startIndex=dt.order.indexOf(id);
        dt.curIndex=dt.startIndex;
        setLmDragId(id); setLmDragOff(0); try{buzz(12);}catch{}
      }
    },400)};
  }
  function lmRowTouchMove(e){
    const dt=lmDragRef.current; if(!dt) return;
    if(!dt.active){ const tt=e.touches[0]; if(Math.abs(tt.clientX-dt.x0)>8||Math.abs(tt.clientY-dt.y0)>8){ dt.moved=true; if(dt.t)clearTimeout(dt.t); } return; }
    e.preventDefault();
    const t=e.touches[0];
    if(!dt.slots) return;
    const startSlot=dt.slots[dt.startIndex];
    const self=dt.els[dt.startIndex];
    // перетаскиваемый строго под пальцем: смещение от его исходного слота
    const dragY = t.clientY - dt.y0;            // насколько палец ушёл от точки захвата
    dt.lastDragY=dragY;
    if(self){ self.style.transition="none"; self.style.transform=`translateY(${dragY}px)`; self.style.zIndex="30"; self.style.position="relative"; }
    // куда вставить: индекс слота, чью середину пересёк центр перетаскиваемого (по ЗАФИКСИРОВАННЫМ центрам)
    const dragMid = startSlot.mid + dragY;
    let newIndex=dt.startIndex;
    for(let i=0;i<dt.slots.length;i++){ if(i===dt.startIndex) continue; const s=dt.slots[i]; if(i<dt.startIndex && dragMid < s.mid){ newIndex=Math.min(newIndex,i); } else if(i>dt.startIndex && dragMid > s.mid){ newIndex=Math.max(newIndex,i); } }
    if(newIndex!==dt.curIndex){
      dt.curIndex=newIndex;
      // ghost-preview: сдвигаем соседей между старым и новым индексом на высоту перетаскиваемого
      const dragH=startSlot.h;
      dt.order.forEach((id,i)=>{
        if(i===dt.startIndex) return;
        const el=dt.els[i]; if(!el) return;
        let shift=0;
        if(dt.startIndex<newIndex && i>dt.startIndex && i<=newIndex) shift=-dragH;
        else if(dt.startIndex>newIndex && i<dt.startIndex && i>=newIndex) shift=dragH;
        el.style.transition="transform 200ms cubic-bezier(.22,1,.36,1)";
        el.style.transform = shift? `translateY(${shift}px)` : "";
      });
    }
  }
  function flushSlides(selector){
    document.querySelectorAll(selector).forEach(n=>{
      if(n._slideTimer||n._slideCommit){
        if(n._slideTimer){ clearTimeout(n._slideTimer); n._slideTimer=null; }
        n.style.setProperty("transition","none","important");
        n.style.transform="";
        if(n._slideCommit){ try{n._slideCommit();}catch{} n._slideCommit=null; }
        n._sliding=false;
        requestAnimationFrame(()=>{ try{n.style.removeProperty("transition");}catch{} });
      }
    });
  }
  function lmRowTouchEnd(){
    const dt=lmDragRef.current;
    if(!dt){ return; }
    if(dt.t)clearTimeout(dt.t);
    lmDragRef.current=null;
    if(!dt.active || !dt.slots){ setLmDragId(null); setLmDragOff(0); return; }
    const order=dt.order.slice();
    const [mv]=order.splice(dt.startIndex,1);
    order.splice(dt.curIndex,0,mv);
    const self=dt.els[dt.startIndex];
    const dragY = dt.lastDragY||0;
    // снять preview-сдвиги соседей
    dt.els.forEach((el,i)=>{ if(el && i!==dt.startIndex){ el.style.transition=""; el.style.transform=""; } });
    if(self){ self.style.transition=""; self.style.transform=""; self.style.zIndex=""; self.style.position=""; }
    const changed = dt.curIndex!==dt.startIndex;
    if(changed){
      // позиция слота curIndex в зафиксированных координатах
      let destTop;
      if(dt.curIndex>dt.startIndex){ destTop = dt.slots[dt.curIndex].top + dt.slots[dt.curIndex].h - dt.slots[dt.startIndex].h; }
      else { destTop = dt.slots[dt.curIndex].top; }
      const curVisualTop = dt.slots[dt.startIndex].top + dragY;
      const landOff = curVisualTop - destTop;   // насколько визуально пункт смещён от нового слота
      // применяем новый порядок В ДАННЫЕ и landing-offset ОДНОВРЕМЕННО (React отрисует атомарно)
      setLmLand({id:dt.id, off:landOff});
      if(lm_setItemsRef.current){ lm_setItemsRef.current(arr=>{ const map={}; arr.forEach(x=>map[x.id]=x); const ord=order.map(id=>map[id]).filter(Boolean); const rest=arr.filter(x=>!order.includes(x.id)); return [...ord,...rest]; }); }
      // на следующем кадре анимируем landing → 0, затем убираем
      requestAnimationFrame(()=>{ setLmLand(l=>l&&l.id===dt.id?{id:dt.id,off:0,animate:true}:l); setTimeout(()=>setLmLand(l=>l&&l.id===dt.id?null:l),160); });
    }
    setLmDragId(null); setLmDragOff(0);
  }
  function lmRowTouchEnd_OLD(){
    const dt=lmDragRef.current;
    if(!dt){ return; }
    if(dt.t)clearTimeout(dt.t);
    const el=document.querySelector(`[data-lmid="${dt.id}"]`);
    const cur=dt.curD||0;
    lmDragRef.current=null;
    flushSlides("[data-lmid]");
    const finalOrder=dt.order?dt.order.slice():null;
    // фиксируем порядок в данных СРАЗУ (до анимации и сброса) — иначе при быстром отпускании возвращается
    if(finalOrder && lm_setItemsRef.current){ lm_setItemsRef.current(arr=>{ const m={}; arr.forEach(x=>m[x.id]=x); const ord=finalOrder.map(id=>m[id]).filter(Boolean); const rest=arr.filter(x=>!finalOrder.includes(x.id)); return [...ord,...rest]; }); }
    const commitOrder=()=>{};
    if(el && Math.abs(cur)>0.5){
      requestAnimationFrame(()=>{
        const r=el.getBoundingClientRect();
        const cleanTop=r.top-cur;
        const startD=(dt.lastFingerY!=null? dt.lastFingerY : (cleanTop+r.height/2)) - (cleanTop+r.height/2);
        el.style.setProperty("transition","none","important");
        el.style.transform=`translateY(${startD}px)`;
        void el.offsetHeight;
        el.style.setProperty("transition","transform 200ms cubic-bezier(.22,1,.36,1)","important");
        el.style.transform="translateY(0)";
        setTimeout(()=>{ try{ el.style.removeProperty("transition"); el.style.transform=""; }catch{} setLmDragId(null); setLmDragOff(0); setTimeout(()=>setLmDragOrder(null),30); }, 210);
      });
    } else {
      if(el) el.style.transform="";
      setLmDragId(null); setLmDragOff(0); setTimeout(()=>setLmDragOrder(null),30);
    }
  }
  function lmDragStart(idx,e,items,setItems){
    e.stopPropagation();
    let y0=e.touches[0].clientY; let cur=idx;
    setLmDragIdx(idx); setLmDragDY(0);
    const move=ev=>{ ev.preventDefault(); const dy=ev.touches[0].clientY-y0; setLmDragDY(dy);
      const self=document.querySelector(`[data-lmid][data-dragging="1"]`); const rh=self?self.getBoundingClientRect().height:44;
      const step=Math.round(dy/Math.max(24,rh)); const ni=Math.max(0,Math.min(items.length-1, cur+step));
      if(ni!==cur){ flipReorder("[data-lmid]", ()=>setItems(arr=>{ const a=[...arr]; const [m]=a.splice(cur,1); a.splice(ni,0,m); return a; })); cur=ni; setLmDragIdx(ni); y0=ev.touches[0].clientY; setLmDragDY(0); } };
    const up=()=>{ setLmDragIdx(-1); setLmDragDY(0); document.removeEventListener("touchmove",move); document.removeEventListener("touchend",up); document.removeEventListener("touchcancel",up); };
    document.addEventListener("touchmove",move,{passive:false});
    document.addEventListener("touchend",up);
    document.addEventListener("touchcancel",up);
  }
  function toggleClItem(idx){
    try{buzz(8,"check");}catch{}
    const _cur=checklist&&checklist[idx];
    const _checking=_cur&&!_cur.checked;
    flipReorder("[data-clid]", ()=>setChecklist(cl=>{
      const a=cl.map(x=>({...x}));
      const it=a[idx];
      if(!it) return cl;
      if(!it.checked){
        it.checked=true; it.origIdx=idx;
        a.splice(idx,1); a.push(it);
        return a;
      } else {
        it.checked=false;
        a.splice(idx,1);
        const unchecked=a.filter(x=>!x.checked).length;
        const back=Math.min(it.origIdx??unchecked, unchecked);
        a.splice(back,0,it); delete it.origIdx;
        return a;
      }
    }), _checking?560:320);
  }
  const ROWH=34;
  const clDragRef = useRef(null);
  function clRowTouchStart(idx,e){
    const id=(checklist&&checklist[idx])?checklist[idx].id:null; if(!id)return;
    const y0=e.touches[0].clientY, x0=e.touches[0].clientX;
    clDragRef.current={id,active:false,moved:false,y0,x0,lastSwap:0,t:setTimeout(()=>{ if(clDragRef.current&&!clDragRef.current.moved){ clDragRef.current.active=true; setClDragId(id); setClDragOff(0); try{buzz(12);}catch{} } },400)};
  }
  function clRowTouchMove(e){
    const dt=clDragRef.current; if(!dt) return;
    if(!dt.active){ const tt=e.touches[0]; if(Math.abs(tt.clientX-dt.x0)>8||Math.abs(tt.clientY-dt.y0)>8){ dt.moved=true; if(dt.t)clearTimeout(dt.t); } return; }
    e.preventDefault();
    const t=e.touches[0];
    setClDragOff(t.clientY-dt.y0);
    const now=Date.now();
    if(now-dt.lastSwap>140){
      const self=document.querySelector(`[data-clid="${dt.id}"]`);
      if(!self) return;
      const sr=self.getBoundingClientRect();
      const rows=Array.from(document.querySelectorAll("[data-clid]"));
      let target=null;
      for(const r of rows){ const id=r.getAttribute("data-clid"); if(id===dt.id) continue; const rr=r.getBoundingClientRect(); const overlap=Math.min(sr.bottom,rr.bottom)-Math.max(sr.top,rr.top); if(overlap>0 && overlap>=rr.height*0.75){ target=id; break; } }
      if(target){ flipReorder("[data-clid]", ()=>setChecklist(cl=>{ const a=[...cl]; const from=a.findIndex(x=>x.id===dt.id); const to=a.findIndex(x=>x.id===target); if(from<0||to<0)return cl; const [m]=a.splice(from,1); a.splice(to,0,m); return a; })); dt.lastSwap=now; dt.y0=t.clientY; setClDragOff(0); }
    }
  }
  function clRowTouchEnd(){ const dt=clDragRef.current; if(dt&&dt.t)clearTimeout(dt.t); clDragRef.current=null; setClDragId(null); setClDragOff(0); }
  function clDragStart(idx,e){
    e.stopPropagation();
    let y0=e.touches[0].clientY; let cur=idx;
    setClDragIdx(idx); setClDragDY(0);
    const move=ev=>{ ev.preventDefault(); const dy=ev.touches[0].clientY-y0; setClDragDY(dy);
      const self=document.querySelector(`[data-clid][data-dragging="1"]`); const rh=self?self.getBoundingClientRect().height:ROWH;
      const step=Math.round(dy/Math.max(20,rh)); const ni=Math.max(0,Math.min((checklist?.length||1)-1, cur+step));
      if(ni!==cur){ flipReorder("[data-clid]", ()=>setChecklist(cl=>{ const a=[...cl]; const [m]=a.splice(cur,1); a.splice(ni,0,m); return a; })); cur=ni; setClDragIdx(ni); y0=ev.touches[0].clientY; setClDragDY(0); } };
    const up=()=>{ setClDragIdx(-1); setClDragDY(0); document.removeEventListener("touchmove",move); document.removeEventListener("touchend",up); document.removeEventListener("touchcancel",up); };
    document.addEventListener("touchmove",move,{passive:false});
    document.addEventListener("touchend",up);
    document.addEventListener("touchcancel",up);
  }
  const [modal,     setModal]     = useState(null);
  const [dlg,       setDlg]       = useState(null);
  // edit in main input field
  const [editId,    setEditId]    = useState(null); // note being edited
  const [taHeight,  setTaHeight]  = useState(null); // explicit textarea height (px) or null=auto
  const [recording, setRecording] = useState(false);
  // Независимый рекордер кнопки «Написать» — удалён (запись теперь через общий микрофон)
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
  const [msgPop,    setMsgPop]   = useState(null); // {id,x,y} popup копировать/редактировать при одиночном тапе
  const [txtSel,    setTxtSel]   = useState(null); // {x,y,editable} панель копировать/вырезать/вставить при выделении текста
  const [imgSel,    setImgSel]   = useState([]); // выбранные отдельные картинки: "noteId|attId"
  function toggleImgSel(noteId, attId){ const key=noteId+"|"+attId; setImgSel(s=>s.includes(key)?s.filter(k=>k!==key):[...s,key]); }
  const tileLp = useRef(null); const tileMoved = useRef(false);
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
  const lastSel = useRef(null); // последнее НЕпустое выделение в поле
  const [lightbox, setLightbox] = useState(null); // dataUrl открытого изображения
  const lightboxFromBrowser = useRef(false);
  const fullTaRef = useRef(null);
  // Блокируем повторный показ клавиатуры при тапе по тулбару: на миг делаем поле readOnly
  // (readOnly-поле не может вызвать IME), фокус и выделение сохраняются.
  function suppressKb(){
    try{
      const el=fullTaRef.current; if(!el) return;
      el.setAttribute("readonly","readonly");
      setTimeout(()=>{ try{ el.removeAttribute("readonly"); }catch{} }, 350);
    }catch{}
  }
  const composerWantFocus = useRef(false);
  const taSwipe = useRef(null);
  const clipText = useRef("");
  const [recSec, setRecSec] = useState(0);
  const recTimer = useRef(null);
  const recCancel = useRef(false);
  const recStartY = useRef(0);
  const recStartX = useRef(0);
  const [recSlide, setRecSlide] = useState(0); // смещение пальца влево (px) для отмены
  const recCancelArm = useRef(false);
  const micStream = useRef(null);
  const recSecRef = useRef(0);
  const nativeAudio = useRef(false);
  const recActiveRef = useRef(false);
  const writeTouchLive = useRef(false);
  const writeWasRecGesture = useRef(false);
  const [headerRec, setHeaderRec] = useState(false);
  const [pendingVoice, setPendingVoice] = useState(null); // {att,origin} ожидает подтверждения отправки
  function sendPendingVoice(){
    const pv=pendingVoice; if(!pv) return;
    const o=pv.origin;
    updNotesAt(o.fid,o.sid,_n=>[..._n,{id:uid("n"),text:"",time:tnow(),ts:tstamp(),pinned:false,attachments:[pv.att]}]);
    setPendingVoice(null);
    setComposerFull(false); setComposerPeek(false); setFid(o.fid); setSid(o.sid); setScr("chat");
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);
  }
  function discardPendingVoice(){ setPendingVoice(null); }
  // ── Запись голосовых: чистая реализация, поток освобождается полностью ──
  async function startRec(e, fromHold){
    if(fromHold && !writeTouchLive.current){ return; } // палец уже отпущен — не стартуем
    recCancel.current=false;
    if(e&&e.touches&&e.touches[0]){ recStartY.current=e.touches[0].clientY; recStartX.current=e.touches[0].clientX; } setRecSlide(0); recCancelArm.current=false;
    if(recording) return; // уже идёт
    recActiveRef.current=true;
    // НАТИВНАЯ запись (Android, минуя WebView/getUserMedia)
    if(window.AndroidRec && typeof window.AndroidRec.startRec==="function"){
      // показываем UI записи МГНОВЕННО, не дожидаясь нативного prepare()
      nativeAudio.current=true;
      setRecording(true); setRecSec(0); recSecRef.current=0;
      buzz(12);
      recTimer.current=setInterval(()=>{ recSecRef.current+=1; setRecSec(recSecRef.current); },1000);
      let ok=false;
      try{ ok=window.AndroidRec.startRec(); }catch{ ok=false; }
      if(!ok){
        nativeAudio.current=false; setRecording(false);
        if(recTimer.current){clearInterval(recTimer.current);recTimer.current=null;}
        setRecSec(0); recSecRef.current=0;
        tst("Не удалось включить микрофон");
        return;
      }
      // если за время старта палец уже отпустили — сразу останавливаем
      if(fromHold && !writeTouchLive.current){ stopRec(true); }
      return;
    }
    // Жёстко освобождаем любой прежний поток/рекордер
    try{ if(mediaRec.current && mediaRec.current.state!=="inactive") mediaRec.current.stop(); }catch{}
    mediaRec.current=null;
    try{ if(micStream.current){ micStream.current.getTracks().forEach(t=>{ try{t.stop();}catch{} }); } }catch{}
    micStream.current=null;
    recChunks.current=[];
    recSecRef.current=0;
    if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)){ tst("Запись не поддерживается"); return; }
    // ДИАГНОСТИКА: сколько аудио-входов видит система
    let micCount=-1;
    try{ if(navigator.mediaDevices.enumerateDevices){ const ds=await navigator.mediaDevices.enumerateDevices(); micCount=ds.filter(d=>d.kind==="audioinput").length; } }catch{}
    let stream;
    // Пробуем по очереди разные запросы — первый сработавший выигрывает
    const attempts=[
      {audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}},
      {audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:1}},
      {audio:true},
      {audio:{channelCount:1}},
    ];
    let lastErr=null;
    for(const c of attempts){
      try{ stream=await navigator.mediaDevices.getUserMedia(c); lastErr=null; break; }
      catch(err){ lastErr=err; if(err&&err.name==="NotAllowedError") break; await new Promise(r=>setTimeout(r,250)); }
    }
    if(!stream){
      const n=lastErr&&lastErr.name||"?";
      const m=lastErr&&lastErr.message?(" / "+lastErr.message):"";
      // показываем ПОЛНУЮ причину для диагностики
      tst("МИК ["+n+"] входов:"+micCount+m);
      return;
    }
    micStream.current=stream;
    // выбираем поддерживаемый формат
    let mime="";
    try{
      const cand=["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/ogg;codecs=opus","audio/ogg"];
      for(const c of cand){ if(window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)){ mime=c; break; } }
    }catch{}
    let mr;
    try{ mr = mime ? new MediaRecorder(stream,{mimeType:mime}) : new MediaRecorder(stream); }
    catch{ try{ mr=new MediaRecorder(stream); }catch{ tst("Запись недоступна"); try{stream.getTracks().forEach(t=>t.stop());}catch{} micStream.current=null; return; } }
    mediaRec.current=mr;
    mr.ondataavailable=ev=>{ if(ev.data&&ev.data.size>0) recChunks.current.push(ev.data); };
    mr.onstop=()=>{
      // полностью отпускаем микрофон
      try{ if(micStream.current){ micStream.current.getTracks().forEach(t=>{ try{t.stop();}catch{} }); } }catch{}
      micStream.current=null;
      if(recTimer.current){ clearInterval(recTimer.current); recTimer.current=null; }
      const cancelled=recCancel.current;
      const secs=recSecRef.current;
      setRecording(false); setRecSec(0); recSecRef.current=0;
      const chunks=recChunks.current; recChunks.current=[];
      mediaRec.current=null;
      if(cancelled) return;
      const blob=new Blob(chunks,{type:mr.mimeType||mime||"audio/webm"});
      if(blob.size<500) { tst("Слишком коротко"); return; }
      const fr=new FileReader();
      fr.onload=()=>{
        const t=(blob.type&&blob.type.indexOf("audio")>=0)?blob.type:"audio/webm";
        const att={type:t,name:`Голосовое ${secs}s`,dataUrl:fr.result,size:blob.size,voice:true,dur:secs};
        setPendingVoice({att, origin:composerOrigin.current||{fid,sid}});
      };
      fr.readAsDataURL(blob);
    };
    try{ mr.start(); }catch{ tst("Не удалось начать запись"); try{stream.getTracks().forEach(t=>t.stop());}catch{} micStream.current=null; mediaRec.current=null; return; }
    setRecording(true); setRecSec(0); recSecRef.current=0;
    recTimer.current=setInterval(()=>{ recSecRef.current+=1; setRecSec(recSecRef.current); },1000);
    buzz(12);
  }
  function stopRec(cancel){
    recActiveRef.current=false;
    recCancel.current=!!cancel;
    // Нативная запись
    if(nativeAudio.current){
      nativeAudio.current=false;
      if(recTimer.current){ clearInterval(recTimer.current); recTimer.current=null; }
      const secs=recSecRef.current;
      setRecording(false); setRecSec(0); recSecRef.current=0;
      if(cancel){ try{ window.AndroidRec&&window.AndroidRec.cancelRec(); }catch{} return; }
      let dataUrl=null;
      try{ dataUrl=window.AndroidRec.stopRec(); }catch{}
      if(!dataUrl){ tst("Запись не получилась"); return; }
      if(secs<1){ return; }
      const att={type:"audio/mp4",name:`Голосовое ${secs}s`,dataUrl,size:Math.round((dataUrl.length*3)/4),voice:true,dur:secs};
      setPendingVoice({att, origin:composerOrigin.current||{fid,sid}});
      return;
    }
    const mr=mediaRec.current;
    if(mr && mr.state!=="inactive"){ try{ mr.stop(); }catch{ try{ if(micStream.current){micStream.current.getTracks().forEach(t=>t.stop());micStream.current=null;} }catch{} setRecording(false); } }
    else {
      try{ if(micStream.current){ micStream.current.getTracks().forEach(t=>t.stop()); micStream.current=null; } }catch{}
      setRecording(false);
      if(recTimer.current){clearInterval(recTimer.current);recTimer.current=null;}
      setRecSec(0); recSecRef.current=0;
    }
  }
  function fmtRec(s){ const m=Math.floor(s/60), ss=s%60; return m+":"+String(ss).padStart(2,"0"); }
  function buzz(ms=15,kind){ try{ if(kind&&vibeCfg&&vibeCfg[kind]===false) return; if(vibeCfg&&vibeCfg.master===false) return; }catch{} try{ if(window.AndroidRec&&window.AndroidRec.vibrate){ window.AndroidRec.vibrate(ms); return; } }catch{} try{ navigator.vibrate&&navigator.vibrate(ms); }catch{} }
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
  const [destroyIds, setDestroyIds] = useState([]);
  const [noInputAnim, setNoInputAnim] = useState(()=>{ try{return localStorage.getItem("napp_noInputAnim")==="1";}catch{return false;} });
  const [noDelAnim, setNoDelAnim] = useState(()=>{ try{return localStorage.getItem("napp_noDelAnim")==="1";}catch{return false;} });
  const [noScrAnim, setNoScrAnim] = useState(()=>{ try{return localStorage.getItem("napp_noScrAnim")==="1";}catch{return false;} });
  const [imgCompress, setImgCompress] = useState(()=>{ try{return localStorage.getItem("napp_imgCompress")==="1";}catch{return false;} });
  const [customSelMenu, setCustomSelMenu] = useState(()=>{ try{return localStorage.getItem("napp_customSelMenu")==="1";}catch{return false;} });
  const [softInk, setSoftInk] = useState(()=>{ try{return localStorage.getItem("napp_softInk")==="1";}catch{return false;} });
  const [vibeSh, setVibeSh] = useState(false);
  const [vibeCfg, setVibeCfg] = useState(()=>{ try{ const v=JSON.parse(localStorage.getItem("napp_vibe")||"null"); return v||{master:true,send:true,check:true,delete:true,drag:true}; }catch{ return {master:true,send:true,check:true,delete:true,drag:true}; } });
  function setVibe(k,val){ setVibeCfg(c=>{ const n={...c,[k]:val}; try{localStorage.setItem("napp_vibe",JSON.stringify(n));}catch{} return n; }); }
  const [iosTrans, setIosTrans] = useState(()=>{ try{return localStorage.getItem("napp_iosTrans")==="1";}catch{return false;} });
  function toggleIosTrans(){ setIosTrans(v=>{ const nv=!v; try{localStorage.setItem("napp_iosTrans",nv?"1":"0");}catch{} return nv; }); }
  function toggleSoftInk(){ setSoftInk(v=>{ const nv=!v; try{localStorage.setItem("napp_softInk",nv?"1":"0");}catch{} return nv; }); }
  function toggleCustomSelMenu(){ setCustomSelMenu(v=>{ const nv=!v; try{localStorage.setItem("napp_customSelMenu",nv?"1":"0");}catch{} try{ if(window.NotengerSelMenu&&window.NotengerSelMenu.setEnabled) window.NotengerSelMenu.setEnabled(nv); }catch{} return nv; }); }
  const [imgCompressPopup, setImgCompressPopup] = useState(false);
  function toggleImgCompress(){
    setImgCompress(v=>{ const nv=!v; try{localStorage.setItem("napp_imgCompress",nv?"1":"0");}catch{} if(nv) setImgCompressPopup(true); return nv; });
  }
  // Умное сжатие изображения без заметной потери качества (ресайз до 2048px + JPEG q0.82)
  function compressImage(dataUrl, type){
    return new Promise(resolve=>{
      try{
        if(!type || !type.startsWith("image/") || type==="image/gif"){ resolve(dataUrl); return; }
        const img=new Image();
        img.onload=()=>{
          try{
            const MAX=2048;
            let {width:w,height:h}=img;
            if(w>MAX||h>MAX){ const k=Math.min(MAX/w,MAX/h); w=Math.round(w*k); h=Math.round(h*k); }
            const c=document.createElement("canvas"); c.width=w; c.height=h;
            const ctx=c.getContext("2d"); ctx.drawImage(img,0,0,w,h);
            const out=c.toDataURL("image/jpeg",0.82);
            // используем сжатую версию только если реально меньше
            resolve(out.length<dataUrl.length?out:dataUrl);
          }catch{ resolve(dataUrl); }
        };
        img.onerror=()=>resolve(dataUrl);
        img.src=dataUrl;
      }catch{ resolve(dataUrl); }
    });
  }
  // Множители скорости анимаций (0.3 = быстрее/короче … 1 = базовая длительность). Храним как множитель длительности.
  const spd=(key,base)=>base;
  function toggleScrAnim(){ setNoScrAnim(v=>{ const nv=!v; try{localStorage.setItem("napp_noScrAnim",nv?"1":"0");}catch{} return nv; }); }
  const dlaunchApplied = useRef(false);
  function setDefaultLaunch(target){ try{ if(target) localStorage.setItem(DLAUNCH_KEY, JSON.stringify(target)); else localStorage.removeItem(DLAUNCH_KEY); }catch{} tst(target?"Будет открываться при запуске":"Запуск сброшен на главный экран"); }
  function getDefaultLaunch(){ try{ const r=localStorage.getItem(DLAUNCH_KEY); return r?JSON.parse(r):null; }catch{ return null; } }
  function isDefaultLaunch(tFid,tSid){ const d=getDefaultLaunch(); if(!d) return false; return d.fid===tFid && (d.sid||null)===(tSid||null); }
  function toggleDefaultLaunch(tFid,tSid){ if(isDefaultLaunch(tFid,tSid)) setDefaultLaunch(null); else setDefaultLaunch({fid:tFid,sid:tSid||null}); }
  function toggleDelAnim(){ setNoDelAnim(v=>{ const nv=!v; try{localStorage.setItem("napp_noDelAnim",nv?"1":"0");}catch{} return nv; }); }
  function toggleInputAnim(){ setNoInputAnim(v=>{ const nv=!v; try{localStorage.setItem("napp_noInputAnim",nv?"1":"0");}catch{} return nv; }); }
  const swipeRef = useRef(null);
  const composerOrigin = useRef(null); // {fid,sid} откуда начато сообщение/правка
  const planeAnchor = useRef(null); // реальная позиция кнопки «Написать» на экране
  const prevLoc = useRef(null); // где был пользователь до перехода на правый экран (восстанавливаем при peek)
  const micAnchor = useRef(null); // реальная позиция кнопки микрофона в шапке
  const writeBtnRef = useRef(null);
  const sendBtnRef = useRef(null);
  const [planeXY, setPlaneXY] = useState(null);
  function capturePlaneAnchor(){ try{ const r=writeBtnRef.current&&writeBtnRef.current.getBoundingClientRect(); if(r) planeAnchor.current={cx:r.left+r.width/2, cy:r.top+r.height/2}; }catch{} }
  const [planePhase, setPlanePhase] = useState('idle'); // 'idle' | 'in'(написать->отправить) | 'out'(отправить->написать)
  const [animSh, setAnimSh] = useState(false); // шторка настроек анимаций
  const [uiSh, setUiSh] = useState(false); // меню «Интерфейс»
  const uiNoAnim = useRef(false);
  const openUiReturn = ()=>{ uiNoAnim.current=true; setUiSh(true); };
  const [accentSh, setAccentSh] = useState(false); // шторка «Цвет иконок»
  const [miscSh, setMiscSh] = useState(false); // меню «Прочее»
  const [hideVersion, setHideVersion] = useState(()=>{ try{ return localStorage.getItem("napp_hideVersion")==="1"; }catch{ return false; } });
  function toggleHideVersion(){ setHideVersion(v=>{ const nv=!v; try{ localStorage.setItem("napp_hideVersion",nv?"1":"0"); }catch{} return nv; }); }
  const [iconAccent, setIconAccent] = useState(()=>{ try{ return localStorage.getItem("napp_iconAccent")||"orange"; }catch{ return "orange"; } });
  // Цвет серых граней: при «Шоколадном неоне» все грани тёплые оранжевые
  useEffect(()=>{ try{ const _lt=theme==="light"; document.documentElement.style.setProperty("--gline", iconAccent==="choconeon"?(_lt?"rgba(47,128,237,.5)":"rgba(239,108,0,.55)"):"var(--line)"); document.documentElement.style.setProperty("--gline2", (!_lt&&iconAccent==="choconeon")?"rgba(239,108,0,.3)":"var(--bar)"); document.documentElement.style.setProperty("--gline-glow", iconAccent==="choconeon"?(_lt?"0 0 10px rgba(47,128,237,.4)":"0 0 10px rgba(239,108,0,.35)"):"none"); }catch{} },[iconAccent,theme]);
  function setAccent(v){ setIconAccent(v); try{ localStorage.setItem("napp_iconAccent",v); }catch{} }
  const _lite = theme==="light"; __LITE=_lite;
  useEffect(()=>{ try{ const bg=(THEMES[theme]||THEMES.dark)["--bg"]; if(window.AndroidRec&&window.AndroidRec.setBars){ window.AndroidRec.setBars(bg, theme==="light"); } }catch{} },[theme]);
  const ACC = _lite ? "#FFFFFF" : (iconAccent==="choco" ? "var(--line2)" : iconAccent==="neon" ? "#2E4A6B" : iconAccent==="choconeon" ? "var(--line2)" : "var(--acc)");
  const ACC_FG = _lite ? "#2F80ED" : (iconAccent==="choco" ? "var(--acc)" : iconAccent==="neon" ? "var(--line2)" : iconAccent==="choconeon" ? "var(--acc)" : "var(--accfg)");
  const ACC_BORDER = _lite ? "#D3D8DE" : (iconAccent==="choco" ? "var(--line)" : iconAccent==="neon" ? "#3E5C82" : iconAccent==="choconeon" ? "var(--line)" : "transparent");
  const ACC_GLOW = _lite ? "0 0 14px rgba(47,128,237,.45), 0 2px 8px rgba(0,0,0,.15)" : (iconAccent==="neon" ? "0 0 14px rgba(239,108,0,.75), 0 0 5px rgba(239,108,0,.6)" : iconAccent==="choconeon" ? "0 0 14px rgba(239,108,0,.75), 0 0 5px rgba(239,108,0,.6)" : null);
  const [imgSh, setImgSh] = useState(false); // шторка сжатия изображений
  const [driveSh, setDriveSh] = useState(false); // отдельное меню Google Диска
  const [cloudWhenSh, setCloudWhenSh] = useState(false);
  const [cloudWhatSh, setCloudWhatSh] = useState(false);
  const [cloudStorSh, setCloudStorSh] = useState(false);
  const [asOpen, setAsOpen] = useState(false); // локальное автосохранение (лифт из ExportSheet)
  const [fontSh, setFontSh] = useState(false); // шторка шрифтов
  const [fontDelSh, setFontDelSh] = useState(false); // список удаления шрифтов
  const [fontOpen, setFontOpen] = useState(null); // {key,x,y} какой пункт шрифта раскрыт
  const FONT_KEY="napp_fonts_v1";
  // Встроенные тестовые шрифты (Google Fonts) + загруженные пользователем (data-URL ttf)
  const BUILTIN_FONTS=[
    {id:"sys",name:"По умолчанию",css:"'Noto Sans',sans-serif"},
    {id:"comfortaa",name:"Comfortaa",css:"'Comfortaa',cursive"},
    {id:"roboto",name:"Roboto",css:"'Roboto',sans-serif"},
    {id:"verdana",name:"Verdana",css:"Verdana,Geneva,sans-serif"},
  ];
  // Цели, для которых можно задать шрифт
  const FONT_TARGETS=[
    {key:"messages",label:"Текст сообщений"},
    {key:"ui",label:"Интерфейс (кнопки, меню)"},
    {key:"titles",label:"Заголовки тем и категорий"},
    {key:"input",label:"Поле ввода"},
  ];
  function loadFonts(){ try{ const r=localStorage.getItem(FONT_KEY); return r?JSON.parse(r):{assign:{},custom:[]}; }catch{ return {assign:{},custom:[]}; } }
  const [fonts,setFonts]=useState(loadFonts);
  function saveFonts(f){ try{ localStorage.setItem(FONT_KEY,JSON.stringify(f)); }catch{} setFonts(f); }
  const allFonts=[...BUILTIN_FONTS, ...(fonts.custom||[])].filter(f=> f.id==="sys" || !((fonts.hidden||[]).includes(f.id)) );
  function fontCssFor(key){ const id=fonts.assign?.[key]; const f=allFonts.find(x=>x.id===id); return f?f.css:"'Noto Sans',sans-serif"; }
  // Подгружаем веб-шрифты и регистрируем кастомные @font-face
  useEffect(()=>{
    // кастомные через @font-face (data-URL)
    let css="";
    (fonts.custom||[]).forEach(f=>{ if(f.dataUrl){ css+=`@font-face{font-family:'${f.id}';src:url('${f.dataUrl}');}`; } });
    let st=document.getElementById("custom-fonts"); if(!st){ st=document.createElement("style"); st.id="custom-fonts"; document.head.appendChild(st); } st.textContent=css;
  },[fonts.custom]);
  const fontFileRef=useRef(null);
  function onFontFile(e){
    const f=e.target.files&&e.target.files[0]; if(!f){return;}
    const r=new FileReader();
    r.onload=ev=>{
      const id="cf_"+Date.now().toString(36);
      const name=f.name.replace(/\.(ttf|otf|woff2?|TTF|OTF)$/,"");
      const nf={id,name,css:`'${id}',sans-serif`,dataUrl:ev.target.result};
      const next={...fonts,custom:[...(fonts.custom||[]),nf]};
      saveFonts(next);
      tst("Шрифт добавлен: "+name);
    };
    r.readAsDataURL(f); e.target.value="";
  }
  function setFontAssign(key,id){ const next={...fonts,assign:{...(fonts.assign||{}),[key]:id}}; saveFonts(next); }
  function removeFont(id){
    if(id==="sys") return; // системный по умолчанию не удаляется
    const assign={...(fonts.assign||{})};
    Object.keys(assign).forEach(k=>{ if(assign[k]===id) delete assign[k]; });
    const isCustom=(fonts.custom||[]).some(f=>f.id===id);
    let next;
    if(isCustom){ next={...fonts, assign, custom:(fonts.custom||[]).filter(f=>f.id!==id)}; }
    else { next={...fonts, assign, hidden:[...new Set([...(fonts.hidden||[]),id])]}; }
    saveFonts(next);
    tst("Шрифт удалён");
  }

  // ===== СИНХРОНИЗАЦИЯ С GOOGLE DRIVE (опционально) =====
  const SYNC_CFG_KEY="napp_sync_cfg_v1"; // настройки синка
  const GOOGLE_CLIENT_ID="589335091963-ajbq6kdh6gvsocrhqlhcqr3ubb4r7dre.apps.googleusercontent.com";
  const DRIVE_FILE_NAME="notenger_backup.json";
  // Модули, которые можно синкать/сохранять выборочно
  const SYNC_MODULES=[
    {key:"settings",label:"Настройки приложения", keys:[AS_KEY,DLAUNCH_KEY,FONT_KEY,"napp_noInputAnim","napp_noDelAnim","napp_noScrAnim","napp_animSpeed","napp_iconAccent","napp_imgCompress","napp_hideVersion","napp_customSelMenu","napp_softInk","napp_iosTrans"]},
    {key:"notes",   label:"Заметки", keys:[SK]},
    {key:"drafts",  label:"Черновики", keys:[DRAFT_KEY]},
  ];
  // Медиа-категории (вложения внутри заметок) — фильтруются по типу при сборке
  const MEDIA_MODULES=[
    {key:"images", label:"Изображения", test:a=>a&&a.type&&a.type.startsWith("image/")},
    {key:"videos", label:"Видео",       test:a=>a&&a.type&&a.type.startsWith("video/")},
    {key:"files",  label:"Файлы (прочее)", test:a=>a&&(!a.type || (!a.type.startsWith("image/")&&!a.type.startsWith("video/")&&!a.voice&&!a.type.startsWith("audio/")))},
  ];
  const defaultSyncCfg={enabled:false, auto:true, modules:{settings:true,notes:true,drafts:true}, media:{images:true,videos:true,files:true}, account:null};
  function loadSyncCfg(){
    try{ const r=localStorage.getItem(SYNC_CFG_KEY); const p=r?JSON.parse(r):{};
      return {...defaultSyncCfg, ...p,
        modules:{...defaultSyncCfg.modules, ...(p&&p.modules||{})},
        media:{...defaultSyncCfg.media, ...(p&&p.media||{})}};
    }catch{ return {...defaultSyncCfg}; }
  }
  const [syncCfg,setSyncCfgState]=useState(()=>loadSyncCfg());
  function saveSyncCfg(c){ try{ localStorage.setItem(SYNC_CFG_KEY,JSON.stringify(c)); }catch{} setSyncCfgState(c); }
  const [syncStatus,setSyncStatus]=useState("idle"); // idle|syncing|ok|error|signedout
  const [syncLastTime,setSyncLastTime]=useState(()=>{ try{return localStorage.getItem("napp_sync_last")||null;}catch{return null;} });
  const [syncSh,setSyncSh]=useState(false); // шторка настроек синка
  const [syncDetails,setSyncDetails]=useState(false);
  const [syncMenuOpen,setSyncMenuOpen]=useState(false); // выпадающее "когда/как сохранять"
  const [signOutAsk,setSignOutAsk]=useState(false);     // подтверждение выхода
  // Расписание облачного автосохранения (как у локального)
  const CLOUD_MODES=[
    {val:"off",    label:"Вручную"},
    {val:"change", label:"При изменении"},
    {val:"1h",     label:"Раз в час"},
    {val:"1d",     label:"Раз в день"},
    {val:"1w",     label:"Раз в неделю"},
  ];
  function cloudSignOut(){
    try{ if(window.NotengerAuthNative&&window.NotengerAuthNative.signOut) window.NotengerAuthNative.signOut(); }catch{}
    setSyncStatus("signedout"); setSignOutAsk(false);
  }
  // ===== Учёт места на Google Диске =====
  const [storageOpen,setStorageOpen]=useState(false);
  const [storageInfo,setStorageInfo]=useState(null); // {total, parts:[{label,bytes}]}
  const [storageBusy,setStorageBusy]=useState(false);
  const [clearAsk,setClearAsk]=useState(false);
  function humanBytes(b){ if(b==null) return "—"; if(b<1024) return b+" Б"; if(b<1048576) return (b/1024).toFixed(1)+" КБ"; if(b<1073741824) return (b/1048576).toFixed(1)+" МБ"; return (b/1073741824).toFixed(2)+" ГБ"; }
  // Разбивка по типам — по тому, что реально уходит в бэкап (с учётом выбора)
  function computeStorageBreakdown(){
    const enc=new TextEncoder();
    const sizeOf=str=>{ try{ return enc.encode(str).length; }catch{ return (str||"").length; } };
    const parts=[];
    // настройки
    let setBytes=0; SYNC_MODULES.find(m=>m.key==="settings").keys.forEach(k=>{ const v=localStorage.getItem(k); if(v) setBytes+=sizeOf(v); });
    // черновики
    let draftBytes=0; const dv=localStorage.getItem(DRAFT_KEY); if(dv) draftBytes=sizeOf(dv);
    // заметки: текст vs медиа по типам
    let textBytes=0, img=0, vid=0, aud=0, files=0;
    try{
      const d=data||JSON.parse(localStorage.getItem(SK)||"{}");
      const walk=arr=>arr&&arr.forEach(f=>{
        if(f.notes) f.notes.forEach(n=>{
          if(n.text) textBytes+=sizeOf(n.text);
          if(n.attachments) n.attachments.forEach(a=>{
            const sz=sizeOf((a&&(a.dataUrl||a.data||a.url||a.src))||"");
            if(a&&(a.voice||(a.type&&a.type.startsWith("audio/")))) aud+=sz;
            else if(a&&a.type&&a.type.startsWith("image/")) img+=sz;
            else if(a&&a.type&&a.type.startsWith("video/")) vid+=sz;
            else files+=sz;
          });
        });
        if(f.subs) walk(f.subs);
      });
      if(d.folders) walk(d.folders);
    }catch{}
    parts.push({label:"Изображения",bytes:img});
    parts.push({label:"Видео",bytes:vid});
    parts.push({label:"Аудио / голос",bytes:aud});
    parts.push({label:"Файлы (прочее)",bytes:files});
    parts.push({label:"Текст заметок",bytes:textBytes});
    parts.push({label:"Черновики",bytes:draftBytes});
    parts.push({label:"Настройки",bytes:setBytes});
    parts.sort((a,b)=>b.bytes-a.bytes);
    return parts.filter(p=>p.bytes>0);
  }
  async function refreshStorageInfo(){
    setStorageBusy(true);
    let total=null, hasFile=false;
    try{
      const token=await getAccessToken(false);
      if(token){ const f=await driveFindFile(token); if(f){ hasFile=true; total=f.size?parseInt(f.size,10):0; } else { hasFile=false; total=0; } }
    }catch{}
    if(!hasFile){ setStorageInfo({total:total||0,parts:[]}); setStorageBusy(false); return; }
    // файл в облаке есть — показываем оценку распределения по локальным данным (что в нём лежит)
    const parts=computeStorageBreakdown();
    if(total==null) total=parts.reduce((s,p)=>s+p.bytes,0);
    setStorageInfo({total,parts});
    setStorageBusy(false);
  }
  async function clearCloudData(){
    setClearAsk(false); setStorageBusy(true);
    try{
      const token=await getAccessToken(true);
      if(token){ const f=await driveFindFile(token); if(f) await driveDelete(token,f.id); }
    }catch{}
    setStorageInfo({total:0,parts:[]});
    setSyncLastTime(null); try{ localStorage.removeItem("napp_sync_last"); }catch{}
    setStorageBusy(false);
  }
  const syncTimer=useRef(null);

  // Получить валидный access-token. Реальная реализация — через нативный плагин Google (подключается в сборке).
  // Пока абстракция: window.NotengerAuth.getToken() -> Promise<string> | null
  async function getAccessToken(interactive){
    try{
      const ask=(inter)=>{
        if(window.NotengerAuthNative && window.NotengerAuthNative.getToken){
          return Promise.race([
            new Promise(resolve=>{
              window.__ntgrResolveToken=(t)=>{ window.__ntgrResolveToken=null; resolve(t||null); };
              try{ window.NotengerAuthNative.getToken(!!inter); }catch(e){ resolve(null); }
            }),
            new Promise(res=>setTimeout(()=>res(null), inter?60000:8000))
          ]);
        }
        if(window.NotengerAuth && window.NotengerAuth.getToken){
          return Promise.race([
            window.NotengerAuth.getToken(!!inter),
            new Promise(res=>setTimeout(()=>res(null), inter?60000:8000))
          ]);
        }
        return Promise.resolve(null);
      };
      // всегда пробуем тихо: если уже авторизован — окно входа не показываем
      const silent=await ask(false);
      if(silent) return silent;
      if(interactive) return await ask(true);
    }catch(e){}
    return null;
  }

  // Отфильтровать вложения в заметках по выбранным медиа-категориям
  function filterNotesMedia(notesJsonStr, mediaCfg){
    try{
      const d=JSON.parse(notesJsonStr);
      const keep=a=>{
        if(a&&(a.voice||(a.type&&a.type.startsWith("audio/")))) return true; // голосовые/аудио всегда с заметкой
        for(const m of MEDIA_MODULES){ if(m.test(a)) return !!mediaCfg[m.key]; }
        return true;
      };
      const walk=arr=>arr&&arr.forEach(f=>{
        if(f.notes) f.notes.forEach(n=>{ if(n.attachments) n.attachments=n.attachments.filter(keep); });
        if(f.subs) walk(f.subs);
      });
      if(d.folders) walk(d.folders);
      return JSON.stringify(d);
    }catch{ return notesJsonStr; }
  }
  // Собрать данные включённых модулей (cfg=syncCfg или произвольный выбор)
  function collectBackup(cfg){
    const out={__meta:{ts:Date.now(), v:2, app:"notenger"}, data:{}};
    SYNC_MODULES.forEach(m=>{
      if(!cfg.modules[m.key]) return;
      m.keys.forEach(k=>{ try{
        // SK берём из актуального состояния в памяти (localStorage мог не вместить всё)
        let v = (k===SK) ? JSON.stringify(data) : localStorage.getItem(k);
        if(v==null) return;
        if(k===SK) v=filterNotesMedia(v, cfg.media||{images:true,videos:true,files:true});
        out.data[k]=v; }catch{} });
    });
    return out;
  }
  function collectSyncData(){ return collectBackup(syncCfg); }
  // Применить скачанные данные (включённые модули)
  function applyBackup(obj,cfg){
    if(!obj||!obj.data) return false;
    let changed=false, notesChanged=false;
    SYNC_MODULES.forEach(m=>{
      if(!cfg.modules[m.key]) return;
      m.keys.forEach(k=>{ if(k in obj.data){ try{ localStorage.setItem(k,obj.data[k]); }catch{} try{ if(k===SK||k===DRAFT_KEY) idbSet(k, obj.data[k]); }catch{} changed=true; if(k===SK) notesChanged=true; } });
    });
    if(notesChanged){ try{ setData(loadData()); }catch{} }
    // фиксируем mtime по времени облачного снимка, чтобы не считать применённое «новее»
    try{ const ts=(obj&&obj.__meta&&obj.__meta.ts)||Date.now(); localStorage.setItem("napp_data_mtime", String(ts)); idbSet("napp_data_mtime", String(ts)); }catch{}
    return changed;
  }
  function applySyncData(obj){ return applyBackup(obj,syncCfg); }

  // Найти id файла бэкапа в appDataFolder
  async function driveFindFile(token){
    const q=encodeURIComponent("name='"+DRIVE_FILE_NAME+"'");
    const r=await fetch("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q="+q+"&fields=files(id,modifiedTime,size)",
      {headers:{Authorization:"Bearer "+token}});
    if(!r.ok) throw new Error("list "+r.status);
    const j=await r.json();
    return (j.files&&j.files[0])||null;
  }
  async function driveDelete(token,id){
    const r=await fetch("https://www.googleapis.com/drive/v3/files/"+id,{method:"DELETE",headers:{Authorization:"Bearer "+token}});
    if(!r.ok && r.status!==404) throw new Error("del "+r.status);
    return true;
  }
  async function driveDownload(token,id){
    const r=await fetch("https://www.googleapis.com/drive/v3/files/"+id+"?alt=media",{headers:{Authorization:"Bearer "+token}});
    if(!r.ok) throw new Error("dl "+r.status);
    return await r.json();
  }
  async function driveUpload(token,id,content){
    const meta={name:DRIVE_FILE_NAME, parents: id?undefined:["appDataFolder"]};
    const boundary="ntgr"+Date.now();
    const body="--"+boundary+"\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"+
      JSON.stringify(meta)+"\r\n--"+boundary+"\r\nContent-Type: application/json\r\n\r\n"+
      JSON.stringify(content)+"\r\n--"+boundary+"--";
    const method=id?"PATCH":"POST";
    const url=id?("https://www.googleapis.com/upload/drive/v3/files/"+id+"?uploadType=multipart")
                :"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
    const r=await fetch(url,{method,headers:{Authorization:"Bearer "+token,"Content-Type":"multipart/related; boundary="+boundary},body});
    if(!r.ok) throw new Error("up "+r.status);
    return await r.json();
  }

  // Главная функция синка. mode: 'push'|'pull'|'auto'
  const syncRunning=useRef(false);
  async function runSync(mode, interactive){
    if(syncRunning.current) return;
    syncRunning.current=true; setSyncStatus("syncing");
    try{
      const token=await getAccessToken(interactive);
      if(!token){ setSyncStatus(interactive?"signedout":(syncCfg.enabled?"ok":"signedout")); syncRunning.current=false; return; }
      const remote=await driveFindFile(token);
      if(remote && (mode==="pull" || mode==="auto")){
        const obj=await driveDownload(token,remote.id);
        const remoteTs=(obj&&obj.__meta&&obj.__meta.ts)||0;
        const localTs=parseInt(localStorage.getItem("napp_data_mtime")||"0",10);
        // применяем облако ТОЛЬКО если оно новее локальных данных
        if(remoteTs>localTs){ applySyncData(obj); }
      }
      // выгружаем актуальное локальное состояние
      const payload=collectSyncData();
      await driveUpload(token, remote?remote.id:null, payload);
      const now=new Date().toISOString();
      try{ localStorage.setItem("napp_sync_last",now); }catch{}
      setSyncLastTime(now); setSyncStatus("ok");
      if(!syncCfg.enabled) saveSyncCfg({...syncCfg,enabled:true});
    }catch(e){
      setSyncStatus("error");
    }
    syncRunning.current=false;
  }

  function scheduleAutoSync(){
    const mode=syncCfg.cloudMode||(syncCfg.auto?"change":"off");
    if(!syncCfg.enabled || mode==="off" || mode!=="change") return; // дебаунс только для «при изменении»
    clearTimeout(syncTimer.current);
    syncTimer.current=setTimeout(()=>{ runSync("push",false); }, 4000);
  }
  // При запуске — подтянуть, если синк включён
  useEffect(()=>{
    if(syncCfg.enabled){ runSync("pull",false); }
    // eslint-disable-next-line
  },[]);

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
  const [textArmed, setTextArmed] = useState(false);

  // floating action buttons: which note is at the bottom of the viewport
  const [inputH, setInputH] = useState(96); // measured input-area height
  const [chatSearch, setChatSearch] = useState(""); // search query within current subfolder

  const bottomRef    = useRef(null);
  const [justSent, setJustSent] = useState(null);
  const pinRef       = useRef(null);
  const taRef        = useRef(null);
  const fileRef      = useRef(null);
  const importRef    = useRef(null);
  const iconRef      = useRef(null);
  const iconTarget   = useRef("sub"); // "folder" | "sub" — к чему применить выбранное изображение
  const lpTimer      = useRef(null);  // long-press timer
  const lpStartXY    = useRef(null);
  const lpScrolled   = useRef(false); // detect scroll during long-press
  const asTimer      = useRef(null);  // auto-save timer
  const lastTap      = useRef({id:null,t:0}); // double-tap detection
  const rowTap       = useRef({id:null,t:0}); // double-tap по пустой области строки
  const touchUsed    = useRef(false); // guard synthetic mouse after touch
  const lpFired      = useRef(false); // long-press already opened menu
  const justEnteredSel = useRef(null); // id пузыря, чей хвостовой клик глушим
  const bubbleEls    = useRef({}); // note id -> element
  const scrollRef    = useRef(null); // chat scroll container
  const openLock     = useRef(false);
  useEffect(()=>{ try{ if(window.NotengerSelMenu&&window.NotengerSelMenu.setEnabled) window.NotengerSelMenu.setEnabled(customSelMenu); }catch{} },[]);
  useEffect(()=>{ try{ document.documentElement.style.setProperty("--ink", softInk?"#B8AC9C":"var(--txt)"); }catch{} },[softInk]);
  const popupJustClosed = useRef(0);
  useEffect(()=>{
    if(!customSelMenu) { setTxtSel(null); return; }
    let raf=0;
    const update=()=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        try{
          const sel=window.getSelection&&window.getSelection();
          const ae=document.activeElement;
          const editable = ae && (ae.tagName==="TEXTAREA" || ae.tagName==="INPUT");
          if(editable){
            const hasSel = ae.selectionStart!=null && ae.selectionEnd!=null && ae.selectionEnd>ae.selectionStart;
            if(!hasSel){ setTxtSel(null); return; }
            const r=ae.getBoundingClientRect();
            setTxtSel({ x:r.left+r.width/2, y:r.top-6, editable:true });
            return;
          }
          if(sel && sel.rangeCount>0 && !sel.isCollapsed && String(sel).trim()!==""){
            const rect=sel.getRangeAt(0).getBoundingClientRect();
            if(rect&&rect.width>0){ setTxtSel({ x:rect.left+rect.width/2, y:rect.top-6, editable:false }); return; }
          }
          setTxtSel(null);
        }catch{ setTxtSel(null); }
      });
    };
    document.addEventListener("selectionchange",update);
    const blockCtx=(e)=>{ e.preventDefault(); };
    document.addEventListener("contextmenu",blockCtx);
    return ()=>{ document.removeEventListener("selectionchange",update); document.removeEventListener("contextmenu",blockCtx); cancelAnimationFrame(raf); };
  },[customSelMenu]);
  function txtCopy(){ try{ const ae=document.activeElement; let t=""; if(ae&&(ae.tagName==="TEXTAREA"||ae.tagName==="INPUT")){ t=ae.value.slice(ae.selectionStart,ae.selectionEnd); } else { t=String(window.getSelection()); } if(t){ (navigator.clipboard&&navigator.clipboard.writeText)?navigator.clipboard.writeText(t):document.execCommand("copy"); } }catch{} setTxtSel(null); }
  function txtCut(){ try{ const ae=document.activeElement; if(ae&&(ae.tagName==="TEXTAREA"||ae.tagName==="INPUT")){ const s=ae.selectionStart,e=ae.selectionEnd; const t=ae.value.slice(s,e); if(t){ (navigator.clipboard&&navigator.clipboard.writeText)&&navigator.clipboard.writeText(t); const nv=ae.value.slice(0,s)+ae.value.slice(e); if(ae===fullTaRef.current) setNote(nv); else { ae.value=nv; } requestAnimationFrame(()=>{ try{ae.focus(); ae.setSelectionRange(s,s);}catch{} }); } } }catch{} setTxtSel(null); }
  async function txtPaste(){ try{ const ae=document.activeElement; if(ae&&(ae.tagName==="TEXTAREA"||ae.tagName==="INPUT")){ let clip=""; try{ clip=await navigator.clipboard.readText(); }catch{} if(clip){ const s=ae.selectionStart,e=ae.selectionEnd; const nv=ae.value.slice(0,s)+clip+ae.value.slice(e); if(ae===fullTaRef.current) setNote(nv); else ae.value=nv; const pos=s+clip.length; requestAnimationFrame(()=>{ try{ae.focus(); ae.setSelectionRange(pos,pos);}catch{} }); } } }catch{} setTxtSel(null); }
  function txtSelectAll(){ try{ const ae=document.activeElement; if(ae&&(ae.tagName==="TEXTAREA"||ae.tagName==="INPUT")){ ae.setSelectionRange(0,ae.value.length); } else { const r=document.createRange(); const sel=window.getSelection(); /* выделить родителя текущего выделения */ const node=sel.anchorNode&&sel.anchorNode.parentElement; if(node){ r.selectNodeContents(node); sel.removeAllRanges(); sel.addRange(r);} } }catch{} }
  useEffect(()=>{
    if(!msgPop) return;
    const close=(e)=>{ if(e.target&&e.target.closest&&e.target.closest("[data-msgpop]")) return; popupJustClosed.current=Date.now(); setMsgPop(null); };
    const opts={passive:true,capture:true};
    document.addEventListener("touchstart",close,opts);
    document.addEventListener("wheel",close,opts);
    document.addEventListener("scroll",close,opts);
    return ()=>{ document.removeEventListener("touchstart",close,opts); document.removeEventListener("wheel",close,opts); document.removeEventListener("scroll",close,opts); };
  },[msgPop]);
  const imgTapGuard  = useRef(false);
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

  useLayoutEffect(()=>{
    if(scr==="chat" && scrollRef.current){
      const sc=scrollRef.current;
      const saved=scrollPos.current[fid+"|"+sid];
      if(saved!==undefined){ sc.scrollTop = saved; }
      else {
        openLock.current=true;
        sc.scrollTop = sc.scrollHeight;
        requestAnimationFrame(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; });
        setTimeout(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },60);
        setTimeout(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },200);
        setTimeout(()=>{ openLock.current=false; },280);
      }
    }
  },[scr,sid]);
  useEffect(()=>{
    if(scr==="chat" && scrollRef.current){
      const sc=scrollRef.current; if(!sc) return;
      const saved=scrollPos.current[fid+"|"+sid];
      if(saved!==undefined){ sc.scrollTop = saved; }
    }
  },[scr,sid]);
  useLayoutEffect(()=>{
    if(!booting && scr==="chat" && scrollRef.current){
      const sc=scrollRef.current;
      const saved=scrollPos.current[fid+"|"+sid];
      sc.scrollTop = (saved!==undefined) ? saved : sc.scrollHeight;
    }
  },[booting]);
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
  useEffect(()=>{ try{ const bg=(THEMES[theme]||THEMES.dark)["--bg"]; if(window.AndroidRec&&window.AndroidRec.setBars){ window.AndroidRec.setBars(bg, theme==="light"); } }catch{} },[theme]);
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
  const pinnedList = subf?.notes.filter(n=>n.pinned)||[];
  const [pinIdx, setPinIdx] = useState(0);
  const pinned = pinnedList.length ? (pinnedList[Math.min(pinIdx,pinnedList.length-1)]) : null;
  const subColor = subf?.color||"#EF6C00";

  function upd(fn) {
    setData(d=>{
      const n=fn(d); saveData(n);
      // auto-save on change mode
      if(asSettings.mode==="change") saveData(n);
      return n;
    });
    scheduleAutoSync();
  }
  function tst(m) { setToast(m); const dur=(typeof m==="string"&&m.indexOf("МИК")===0)?6000:2200; setTimeout(()=>setToast(null),dur); }

  // ── Nav ──
  function openF(f) {
    if(settingsMenu||plusMenu||hdrMenu||folderMenu||subMenu||noteCtx){ closeAllMenus(); setNoteCtx(null); return; }
    if(composerFull){ // живой редактор справа — не трогаем черновик, только навигация
      if(f.isTheme){ setFid(f.id); setSid("__top__"); setScr("chat"); }
      else { setFid(f.id); setScr("sub"); setSubSearch(""); }
      return;
    }
    if(f.isTheme){ captureNavSnapshot("push"); setFid(f.id); setSid("__top__"); setScr("chat"); cancelEdit(); setChatSearch(""); setSelectMode(null); setMultiSelect([]); setIsTyping(false);
      setNote(drafts.current["__top__"+f.id]||"");
      return;
    }
    captureNavSnapshot("push"); setFid(f.id); setScr("sub"); setSubSearch("");
  }
  function openS(s) {
    if(settingsMenu||plusMenu||hdrMenu||folderMenu||subMenu||noteCtx){ closeAllMenus(); setNoteCtx(null); return; }
    if(composerFull){ setSid(s.id); setScr("chat"); return; } // живой редактор — только навигация
    captureNavSnapshot("push"); setSid(s.id); setScr("chat"); cancelEdit(); setChatSearch(""); setSelectMode(null); setMultiSelect([]); setIsTyping(false);
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
  // Постоянно запоминаем последнее непустое выделение в поле ввода
  useEffect(()=>{
    if(!composerFull) return;
    const id=setInterval(()=>{
      const el=fullTaRef.current; if(!el) return;
      if(document.activeElement===el && el.selectionStart!==el.selectionEnd){
        lastSel.current={s:el.selectionStart,e:el.selectionEnd};
      }
    }, 150);
    return ()=>clearInterval(id);
  }, [composerFull]);
  // Открыть тему/категорию по умолчанию при запуске
  useEffect(()=>{
    if(dlaunchApplied.current) return; dlaunchApplied.current=true; if(_initLaunch) return;
    const t=getDefaultLaunch(); if(!t) return;
    const f=data.folders.find(x=>x.id===t.fid); if(!f) return;
    if(t.sid==="__top__"||f.isTheme){ setFid(f.id); setSid("__top__"); setScr("chat"); }
    else if(t.sid){ const sub=f.subfolders.find(x=>x.id===t.sid); if(sub){ setFid(f.id); setSid(sub.id); setScr("chat"); } else { setFid(f.id); setScr("sub"); } }
    else { setFid(f.id); setScr("sub"); }
  }, []);
  // Результаты глобального поиска по всем сообщениям
  function globalResults(q){
    if(!q || q.trim().length<2) return [];
    const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
    const norm=s=>(s||"").toLowerCase().replace(/\[\/?(b|i|s|spoiler|code|q)\]/g,"").replace(/\[(.*?)\]\((.*?)\)/g,"$1 $2");
    const out=[];
    const matchNote=(n,ctx)=>{
      const hay=norm(n.text)+" "+ctx+" "+((n.attachments||[]).map(a=>(a.name||"")+" "+(a.caption||"")).join(" ")).toLowerCase();
      return terms.every(t=>hay.includes(t));
    };
    data.folders.forEach(f=>{
      if(f.isTheme){
        (f.notes||[]).forEach(n=>{ if(matchNote(n, f.name)) out.push({folderId:f.id,subId:"__top__",themeName:f.name,note:n}); });
      } else {
        f.subfolders.forEach(s=>{
          (s.notes||[]).forEach(n=>{ if(matchNote(n, f.name+" "+s.name)) out.push({folderId:f.id,subId:s.id,themeName:`${f.name} · ${s.name}`,note:n}); });
        });
      }
    });
    return out.slice(0,300);
  }
  function playPlaneBack(){ if(noInputAnim)return; setPlanePhase('outStart'); setTimeout(()=>setPlanePhase('out'),60); setTimeout(()=>setPlanePhase('idle'),650); }
  function back()   {
    if(multiSelect.length){setMultiSelect([]);return;}
    if(selectMode){setSelectMode(null);return;}
    if(scr==="chat"){ captureNavSnapshot("pop"); if(sid==="__top__"){setScr("main");setSid(null);} else {setScr("sub");} if(!composerFull){ cancelEdit(); } setChatSearch(""); }
    else if(scr==="sub"){ captureNavSnapshot("pop"); setScr("main"); }
  }
  // Аппаратная кнопка «Назад» (Android). Возвращает true, если что-то закрыли.
  function closeAllMenus(){ setSettingsMenu(false); setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); }
  function closeLightbox(){ setLightbox(null); }
  function saveImageToFolder(dataUrl){
    try{
      const m=/^data:([^;]+);base64,(.*)$/.exec(dataUrl||"");
      let mime="image/jpeg", b64="";
      if(m){ mime=m[1]; b64=m[2]; }
      else { return; }
      const ext=mime.indexOf("png")>=0?"png":mime.indexOf("webp")>=0?"webp":mime.indexOf("gif")>=0?"gif":"jpg";
      const name="notenger_img_"+Date.now()+"."+ext;
      if(window.AndroidRec && window.AndroidRec.saveFileDialog){ window.AndroidRec.saveFileDialog(name, mime, b64); tst("Выберите папку…"); }
      else { const a=document.createElement("a"); a.href=dataUrl; a.download=name; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
    }catch(e){}
  }
  function handleHardwareBack(){
    if(recActiveRef.current){ stopRec(true); setRecSlide(0); return true; }
    if(listMode){ setListMode(null); setLmEditMode(false); return true; }
    if(msgPop){ setMsgPop(null); return true; }
    if(noteCtx){ setNoteCtx(null); return true; }
    if(linkPopup){ setLinkPopup(null); return true; }
    if(fullFmt){ setFullFmt(false); return true; }
    if(prevSh){ setPrevSh(false); return true; }
    if(imgSel.length){ setImgSel([]); return true; }
    if(pendingVoice){ discardPendingVoice(); return true; }
    if(imgCompressPopup){ setImgCompressPopup(false); return true; }
    if(lightbox){ closeLightbox(); return true; }
    if(globalSearch!==null){ setGlobalSearch(null); return true; }
    if(attSh){ setAttSh(false); return true; }
    if(composerFull && !composerPeek){ closeComposer(); return true; }
    // при peek: кнопка назад листает каталоги слева (в черновик — только свайп/гребешок)
    if(cloudWhenSh){ setCloudWhenSh(false); return true; }
    if(cloudWhatSh){ setCloudWhatSh(false); return true; }
    if(cloudStorSh){ setCloudStorSh(false); return true; }
    if(driveSh){ setDriveSh(false); return true; }
    if(fontDelSh){ setFontDelSh(false); return true; }
    if(fontSh){ setFontSh(false); setFontOpen&&setFontOpen(null); setUiSh(true); return true; }
    if(animSh){ setAnimSh(false); openUiReturn(); return true; }
    if(vibeSh){ setVibeSh(false); return true; }
    if(miscSh){ setMiscSh(false); return true; }
    if(accentSh){ setAccentSh(false); openUiReturn(); return true; }
    if(uiSh){ setUiSh(false); return true; }
    if(dlg){ setDlg(null); return true; }
    if(modal){ setModal(null); return true; }
    if(pinnedOpen){ setPinnedOpen(false); return true; }
    if(mediaBrowser){ setMediaBrowser(false); return true; }
    if(asOpen){ setAsOpen(false); return true; }
    if(expSh){ setExpSh(false); return true; }
    if(settingsMenu||plusMenu||hdrMenu||folderMenu||subMenu){ setSettingsMenu(false);setPlusMenu(false);setHdrMenu(null);setFolderMenu(null);setSubMenu(null); return true; }
    if(moveBuffer){ setMoveBuffer(null); return true; }
    if(chatSearch!==""&&!composerPeek){ setChatSearch(""); return true; }
    if(multiSelect.length){ setMultiSelect([]); return true; }
    if(selectMode){ setSelectMode(null); return true; }
    if(editId && !composerFull){ cancelEdit(); return true; }
    if(scr==="chat"){ captureNavSnapshot("pop"); if(sid==="__top__"){setScr("main");setSid(null);} else {setScr("sub");} if(!composerFull) setChatSearch(""); return true; }
    if(scr==="sub"){ captureNavSnapshot("pop"); setScr("main"); return true; }
    return false; // на главном экране — не обработали (разрешаем выход по двойному нажатию)
  }

  // Свайп влево для возврата к черновику (работает поверх навигации, не мешая тапам)
  useEffect(()=>{
    if(!(composerFull && composerPeek)) return;
    let sx=null, sy=null;
    const ts=e=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; };
    const te=e=>{ if(sx===null) return; const t=e.changedTouches[0]; const dx=t.clientX-sx, dy=t.clientY-sy;
      if(dx<-70 && Math.abs(dx)>Math.abs(dy)*1.3){
        // полный переход к редактору: закрыть шторки, перейти в тему черновика, раскрыть
        setAttSh(false); setCloudWhenSh(false); setCloudWhatSh(false); setCloudStorSh(false); setDriveSh(false);
        setImgSh(false); setFontDelSh(false); setFontSh(false); setAnimSh(false); setUiSh(false); setMiscSh(false);
        setExpSh(false); setAsOpen(false); setMediaBrowser(false); setPinnedOpen(false); setModal(null); setDlg(null);
        setSettingsMenu(false); setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setNoteCtx(null);
        setPrevSh(false); setFullFmt(false); setMsgPop(null); setLinkPopup(null);
        const o=composerOrigin.current||{fid,sid};
        if(o&&o.fid!=null){ if(scr!=="chat"||sid!==o.sid||fid!==o.fid){ prevLoc.current={scr,fid,sid}; } setFid(o.fid); setSid(o.sid); setScr("chat"); }
        setComposerPeek(false);
      } sx=null; sy=null; };
    window.addEventListener("touchstart",ts,{passive:true});
    window.addEventListener("touchend",te,{passive:true});
    return ()=>{ window.removeEventListener("touchstart",ts); window.removeEventListener("touchend",te); };
  },[composerFull,composerPeek,scr,fid,sid]);

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
  const [dragOrder, setDragOrder] = useState(null);   // локальный порядок id при drag тем/категорий
  const [fLand, setFLand] = useState(null);           // {id, off, animate} приземление тем/категорий
  // Сосед едет СВОЕЙ анимацией сразу (без перескока), массив переставляется по завершении.
  // Догнанный (ещё едущий) доезжает остаток быстрее.
  function slideSwap(selector, draggedId, targetId, reorderFn, movingDown, reactClears, dur=300){
    const tgt=document.querySelector(`${selectorAttr(selector,targetId)}`);
    if(!tgt){ reorderFn(); return; }
    const cs=getComputedStyle(tgt);
    const mt=parseFloat(cs.marginTop)||0, mb=parseFloat(cs.marginBottom)||0;
    const pitch=tgt.getBoundingClientRect().height + mt + mb;   // реальный шаг слота с учётом отступов
    const slide = movingDown ? -pitch : pitch;
    const wasSliding = tgt._sliding;
    const thisDur = wasSliding ? Math.max(120, Math.round(dur*0.35)) : dur;
    if(tgt._slideTimer){ clearTimeout(tgt._slideTimer); tgt._slideTimer=null; }
    tgt._sliding=true;
    tgt._slideCommit=reorderFn;
    tgt.style.setProperty("transition",`transform ${thisDur}ms cubic-bezier(.22,1,.36,1)`,"important");
    tgt.style.transform=`translateY(${slide}px)`;
    tgt._slideTimer=setTimeout(()=>{
      tgt.style.setProperty("transition","none","important");
      tgt.style.transform="";
      reorderFn();
      tgt._sliding=false; tgt._slideTimer=null; tgt._slideCommit=null;
      requestAnimationFrame(()=>{
        try{ tgt.style.removeProperty("transition"); }catch{}
        // перестановка изменила раскладку — удержим перетаскиваемый строго под пальцем даже если палец стоит
        const adt=lmDragRef.current||dragTouch.current;
        if(adt&&adt.active&&adt.lastFingerY!=null){
          const dEl=document.querySelector(`${selectorAttr(selector,adt.id)}`);
          if(dEl){ const r=dEl.getBoundingClientRect(); const cm=(r.top-(adt.curD||0))+r.height/2; const nd=adt.lastFingerY-cm; adt.curD=nd; const sc=(selector.indexOf("lmid")>=0)?"":" scale(1.07)"; dEl.style.transform=`translateY(${nd}px)${sc}`; }
        }
      });
    }, thisDur+40);
  }
  function selectorAttr(selector,id){ const attr=selector.replace(/[\[\]]/g,""); return `[${attr}="${id}"]`; }
  // FLIP: захватываем позиции ДО перестановки, выполняем перестановку, затем анимируем
  function flipReorder(selector, doReorder, dur=420){
    const nodes=Array.from(document.querySelectorAll(selector));
    const first={}; nodes.forEach(n=>{ const id=n.getAttribute("data-fid")||n.getAttribute("data-sid")||n.getAttribute("data-clid")||n.getAttribute("data-lmid"); first[id]=n.getBoundingClientRect().top; });
    doReorder();
    let tries=0;
    const run=()=>{
      const nodes2=Array.from(document.querySelectorAll(selector));
      // сначала проверим, отрисовалась ли перестановка
      let anyMoved=false;
      nodes2.forEach(n=>{
        const id=n.getAttribute("data-fid")||n.getAttribute("data-sid")||n.getAttribute("data-clid")||n.getAttribute("data-lmid");
        if(first[id]==null) return;
        if(n.getAttribute("data-dragging")==="1") return;
        const prev=n.style.transform; const prevTr=n.style.transition;
        n.style.setProperty("transition","none","important"); n.style.transform="";
        const moved=Math.abs(first[id]-n.getBoundingClientRect().top)>0.5;
        n.style.transform=prev; if(prevTr) n.style.transition=prevTr; else n.style.removeProperty("transition");
        if(moved) anyMoved=true;
      });
      if(!anyMoved && tries<4){ tries++; requestAnimationFrame(run); return; }
      nodes2.forEach(n=>{
        const id=n.getAttribute("data-fid")||n.getAttribute("data-sid")||n.getAttribute("data-clid")||n.getAttribute("data-lmid");
        if(first[id]==null) return;
        if(n.getAttribute("data-dragging")==="1") return;
        const wasFlipping=n._flipping;
        if(n._flipTimer){ clearTimeout(n._flipTimer); n._flipTimer=null; }
        n.style.setProperty("transition","none","important");
        n.style.transform="";
        const layoutTop = n.getBoundingClientRect().top;
        const dy = (first[id] - layoutTop);
        if(!dy){ n._flipping=false; return; }
        if(Math.abs(dy)>2000){ n._flipping=false; return; }
        const thisDur = wasFlipping ? Math.max(110, Math.round(dur*0.32)) : dur;
        n._flipping=true;
        n.style.transform=`translateY(${dy}px)`;
        void n.offsetHeight;
        n.style.setProperty("transition",`transform ${thisDur}ms cubic-bezier(.22,1,.36,1)`,"important");
        n.style.transform="translateY(0)";
        n._flipTimer=setTimeout(()=>{ try{ n.style.removeProperty("transition"); n.style.transform=""; n._flipping=false; n._flipTimer=null; }catch{ n._flipping=false; n._flipTimer=null; } },thisDur+20);
      });
    };
    requestAnimationFrame(run);
  }
  // Перетаскивание касанием (long-press + drag): snapshot + ghost-preview + атомарное приземление
  function folderDragTouchStart(id,e){ const y0=e.touches[0].clientY, x0=e.touches[0].clientX; const order=Array.from(document.querySelectorAll("[data-fid]")).map(n=>n.getAttribute("data-fid")); dragTouch.current={id,active:false,y0,x0,order,kind:"fid",startIndex:order.indexOf(id),curIndex:order.indexOf(id),t:setTimeout(()=>{ if(dragTouch.current&&!dragTouch.current.moved){ const dt=dragTouch.current; dt.active=true; const els=dt.order.map(id=>document.querySelector(`[data-fid="${id}"]`)); dt.slots=els.map(el=>{const r=el.getBoundingClientRect();return{top:r.top,h:r.height,mid:r.top+r.height/2};}); dt.els=els; dt.startIndex=dt.order.indexOf(id); dt.curIndex=dt.startIndex; setDragActive(id); setDragOffset(0); buzz(12);} },400)}; }
  function folderDragTouchMove(e){
    const dt=dragTouch.current; if(!dt) return;
    if(!dt.active){ const tt=e.touches[0]; if(Math.abs(tt.clientX-dt.x0)>8||Math.abs(tt.clientY-dt.y0)>8){ dt.moved=true; if(dt.t)clearTimeout(dt.t); } return; }
    e.preventDefault();
    const t=e.touches[0];
    if(!dt.slots) return;
    const startSlot=dt.slots[dt.startIndex];
    const self=dt.els[dt.startIndex];
    const dragY=t.clientY-dt.y0; dt.lastDragY=dragY;
    if(self){ self.style.transition="none"; self.style.transform=`translateY(${dragY}px) scale(1.07)`; self.style.zIndex="30"; self.style.position="relative"; }
    const dragMid=startSlot.mid+dragY;
    let newIndex=dt.startIndex;
    for(let i=0;i<dt.slots.length;i++){ if(i===dt.startIndex) continue; const s=dt.slots[i]; if(i<dt.startIndex && dragMid<s.mid){ newIndex=Math.min(newIndex,i); } else if(i>dt.startIndex && dragMid>s.mid){ newIndex=Math.max(newIndex,i); } }
    if(newIndex!==dt.curIndex){
      dt.curIndex=newIndex;
      const dragH=startSlot.h;
      dt.order.forEach((id,i)=>{ if(i===dt.startIndex) return; const el=dt.els[i]; if(!el) return; let shift=0; if(dt.startIndex<newIndex && i>dt.startIndex && i<=newIndex) shift=-dragH; else if(dt.startIndex>newIndex && i<dt.startIndex && i>=newIndex) shift=dragH; el.style.transition="transform 200ms cubic-bezier(.22,1,.36,1)"; el.style.transform=shift?`translateY(${shift}px)`:""; });
    }
  }
  function folderDragTouchEnd(){
    const dt=dragTouch.current; if(!dt){ return; } if(dt.t)clearTimeout(dt.t); dragTouch.current=null;
    if(!dt.active||!dt.slots){ setDragActive(null); setDragOffset(0); return; }
    const order=dt.order.slice(); const [mv]=order.splice(dt.startIndex,1); order.splice(dt.curIndex,0,mv);
    const self=dt.els[dt.startIndex]; const dragY=dt.lastDragY||0;
    dt.els.forEach((el,i)=>{ if(el&&i!==dt.startIndex){ el.style.transition="none"; el.style.transform=""; requestAnimationFrame(()=>{ try{el.style.transition="";}catch{} }); } });
    if(self){ self.style.transition=""; self.style.transform=""; self.style.zIndex=""; self.style.position=""; }
    if(dt.curIndex!==dt.startIndex){
      let destTop; if(dt.curIndex>dt.startIndex){ destTop=dt.slots[dt.curIndex].top+dt.slots[dt.curIndex].h-dt.slots[dt.startIndex].h; } else { destTop=dt.slots[dt.curIndex].top; }
      const landOff=(dt.slots[dt.startIndex].top+dragY)-destTop;
      setFLand({id:dt.id, off:landOff});
      upd(d=>{ const o={}; order.forEach((id,i)=>o[id]=i); return {...d,folders:d.folders.slice().sort((a,b)=>(o[a.id]??999)-(o[b.id]??999))}; });
      requestAnimationFrame(()=>{ setFLand(l=>l&&l.id===dt.id?{id:dt.id,off:0,animate:true}:l); setTimeout(()=>setFLand(l=>l&&l.id===dt.id?null:l),160); });
    }
    setDragActive(null); setDragOffset(0);
  }
  function subDragTouchStart(id,e){ const y0=e.touches[0].clientY, x0=e.touches[0].clientX; const order=Array.from(document.querySelectorAll("[data-sid]")).map(n=>n.getAttribute("data-sid")); dragTouch.current={id,active:false,y0,x0,order,kind:"sid",startIndex:order.indexOf(id),curIndex:order.indexOf(id),t:setTimeout(()=>{ if(dragTouch.current&&!dragTouch.current.moved){ const dt=dragTouch.current; dt.active=true; const els=dt.order.map(id=>document.querySelector(`[data-sid="${id}"]`)); dt.slots=els.map(el=>{const r=el.getBoundingClientRect();return{top:r.top,h:r.height,mid:r.top+r.height/2};}); dt.els=els; dt.startIndex=dt.order.indexOf(id); dt.curIndex=dt.startIndex; setDragActive(id); setDragOffset(0); buzz(12);} },400)}; }
  function subDragTouchMove(e){
    const dt=dragTouch.current; if(!dt) return;
    if(!dt.active){ const tt=e.touches[0]; if(Math.abs(tt.clientX-dt.x0)>8||Math.abs(tt.clientY-dt.y0)>8){ dt.moved=true; if(dt.t)clearTimeout(dt.t); } return; }
    e.preventDefault();
    const t=e.touches[0];
    if(!dt.slots) return;
    const startSlot=dt.slots[dt.startIndex];
    const self=dt.els[dt.startIndex];
    const dragY=t.clientY-dt.y0; dt.lastDragY=dragY;
    if(self){ self.style.transition="none"; self.style.transform=`translateY(${dragY}px) scale(1.07)`; self.style.zIndex="30"; self.style.position="relative"; }
    const dragMid=startSlot.mid+dragY;
    let newIndex=dt.startIndex;
    for(let i=0;i<dt.slots.length;i++){ if(i===dt.startIndex) continue; const s=dt.slots[i]; if(i<dt.startIndex && dragMid<s.mid){ newIndex=Math.min(newIndex,i); } else if(i>dt.startIndex && dragMid>s.mid){ newIndex=Math.max(newIndex,i); } }
    if(newIndex!==dt.curIndex){
      dt.curIndex=newIndex;
      const dragH=startSlot.h;
      dt.order.forEach((id,i)=>{ if(i===dt.startIndex) return; const el=dt.els[i]; if(!el) return; let shift=0; if(dt.startIndex<newIndex && i>dt.startIndex && i<=newIndex) shift=-dragH; else if(dt.startIndex>newIndex && i<dt.startIndex && i>=newIndex) shift=dragH; el.style.transition="transform 200ms cubic-bezier(.22,1,.36,1)"; el.style.transform=shift?`translateY(${shift}px)`:""; });
    }
  }
  function subDragTouchEnd(){
    const dt=dragTouch.current; if(!dt){ return; } if(dt.t)clearTimeout(dt.t); dragTouch.current=null;
    if(!dt.active||!dt.slots){ setDragActive(null); setDragOffset(0); return; }
    const order=dt.order.slice(); const [mv]=order.splice(dt.startIndex,1); order.splice(dt.curIndex,0,mv);
    const self=dt.els[dt.startIndex]; const dragY=dt.lastDragY||0;
    dt.els.forEach((el,i)=>{ if(el&&i!==dt.startIndex){ el.style.transition="none"; el.style.transform=""; requestAnimationFrame(()=>{ try{el.style.transition="";}catch{} }); } });
    if(self){ self.style.transition=""; self.style.transform=""; self.style.zIndex=""; self.style.position=""; }
    if(dt.curIndex!==dt.startIndex){
      let destTop; if(dt.curIndex>dt.startIndex){ destTop=dt.slots[dt.curIndex].top+dt.slots[dt.curIndex].h-dt.slots[dt.startIndex].h; } else { destTop=dt.slots[dt.curIndex].top; }
      const landOff=(dt.slots[dt.startIndex].top+dragY)-destTop;
      setFLand({id:dt.id, off:landOff});
      upd(d=>({...d,folders:d.folders.map(f=>{ if(f.id!==fid) return f; const o={}; order.forEach((id,i)=>o[id]=i); return {...f,subfolders:f.subfolders.slice().sort((a,b)=>(o[a.id]??999)-(o[b.id]??999))}; })}));
      requestAnimationFrame(()=>{ setFLand(l=>l&&l.id===dt.id?{id:dt.id,off:0,animate:true}:l); setTimeout(()=>setFLand(l=>l&&l.id===dt.id?null:l),160); });
    }
    setDragActive(null); setDragOffset(0);
  }
  function delF(id)    { try{buzz(18,"delete");}catch{} upd(d=>({...d,folders:d.folders.filter(f=>f.id!==id)})); if(fid===id){noAnimOnce.current=true;setFid(null);setScr("main");} }

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
  function delS(id)    { try{buzz(18,"delete");}catch{} upd(d=>({...d,folders:d.folders.map(f=>f.id!==fid?f:{...f,subfolders:f.subfolders.filter(s=>s.id!==id)})})); if(sid===id){noAnimOnce.current=true;setSid(null);setScr("sub");} }

  // ── Edit in main input ──
  function startEdit(n) {
    setEditId(n.id);
    setNote(n.text||"");
    setPatts(n.attachments||[]);
    setCapPos(n.capPos||"top");
    setChecklist(n.checklist&&n.checklist.length?n.checklist.map(x=>({...x})):null);
    setClTitle(n.clTitle||"");
    setNoteCtx(null);
    setSelectMode(null);
    composerOrigin.current={fid,sid};
    composerWantFocus.current=true;
    // без анимации перелёта — редактирование открывается сразу
    setComposerFull(true); setComposerPeek(false);
  }
  function cancelEdit() {
    setEditId(null); setNote(""); setPatts([]); setChecklist(null); setClTitle(""); setIsTyping(false); setTaHeight(null); manualResize.current=false; if(draftKey){ delete drafts.current[draftKey]; saveDrafts(drafts.current); }
    if(taRef.current){ taRef.current.style.height="auto"; }
  }
  // Закрытие полноэкранного редактора с анимацией возврата микрофона/самолёта
  function closeComposer(){
    prevLoc.current=null;
    const o=composerOrigin.current||{fid,sid};
    const dk=o.sid==="__top__"?("__top__"+o.fid):o.sid;
    if(dk){ delete drafts.current[dk]; saveDrafts(drafts.current); }
    const wasEdit=!!editId;
    if(editId) cancelEdit();
    setNote(""); setPatts([]); setChecklist(null); setClTitle(""); setComposerFull(false); setComposerPeek(false); setTxtSel(null); playPlaneBack();
    
  }
  function saveEdit() {
    if(!note.trim()&&patts.length===0&&!finalizeChecklist()) return;
    const editedId=editId;
    updNotes(_n=>(_n.map(n=>n.id===editId?{...n,text:note.trim(),attachments:patts,capPos,checklist:finalizeChecklist(),clTitle:(checklist&&clTitle.trim())?clTitle.trim():undefined,time:tnow(),ts:tstamp()}:n)));
    cancelEdit();
    setTimeout(()=>{ const el=bubbleEls.current[editedId]; if(el&&el.scrollIntoView) el.scrollIntoView({block:"nearest"}); },50);
  }

  // Отправка из полноэкранного редактора: пишем в origin и возвращаемся туда
  function composerCommit(){
    prevLoc.current=null;
    const o=composerOrigin.current||{fid,sid};
    const wasEdit = !!editId; const editedId = editId;
    if(editId){
      if(note.trim()||patts.length||finalizeChecklist()){ updNotesAt(o.fid,o.sid,_n=>_n.map(n=>n.id===editId?{...n,text:note.trim(),attachments:patts,capPos,checklist:finalizeChecklist(),clTitle:(checklist&&clTitle.trim())?clTitle.trim():undefined,time:tnow(),ts:tstamp()}:n)); }
    } else {
      if(note.trim()||patts.length||finalizeChecklist()){ updNotesAt(o.fid,o.sid,_n=>[..._n,{id:uid("n"),text:note.trim(),time:tnow(),ts:tstamp(),pinned:false,attachments:patts,capPos,checklist:finalizeChecklist(),clTitle:(checklist&&clTitle.trim())?clTitle.trim():undefined}]); }
    }
    // очистка черновика
    const dKey = o.sid==="__top__" ? "__top__"+o.fid : o.sid;
    if(dKey){ delete drafts.current[dKey]; saveDrafts(drafts.current); }
    setEditId(null); setNote(""); setPatts([]); setChecklist(null); setClTitle(""); setIsTyping(false);
    // возврат в исходную тему + анимация полёта кнопки обратно в позицию "написать"
    setComposerFull(false); setComposerPeek(false); playPlaneBack();
    setFid(o.fid); setSid(o.sid); setScr("chat");
    
    if(wasEdit){
      setTimeout(()=>{ const el=bubbleEls.current[editedId]; if(el&&el.scrollIntoView) el.scrollIntoView({block:"nearest"}); },80);
    } else {
      setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),80);
    }
  }
  // ── Notes ──
  function send() {
    if(!note.trim()&&patts.length===0&&!finalizeChecklist()) return;
    if(editId) { saveEdit(); return; }
    const nid=uid("n"); setJustSent(nid); try{buzz(10,"send");}catch{}
    updNotes(_n=>([..._n,{id:nid,text:note.trim(),time:tnow(),ts:tstamp(),pinned:false,attachments:patts,capPos,checklist:finalizeChecklist(),clTitle:(checklist&&clTitle.trim())?clTitle.trim():undefined}]));
    setNote(""); setPatts([]); setIsTyping(false); setTaHeight(null); manualResize.current=false; if(draftKey){ delete drafts.current[draftKey]; saveDrafts(drafts.current); }
    if(taRef.current) taRef.current.style.height="auto";
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),120);
    setTimeout(()=>{ setJustSent(null); },500);
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
  function toggleSel(n){
    if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
    setTextArmed(false);
    // объединяем текущее выделение (selectMode + multiSelect) в один набор
    const cur = new Set(multiSelect);
    if(selectMode) cur.add(selectMode);
    if(cur.has(n.id)) cur.delete(n.id); else cur.add(n.id);
    const arr=[...cur];
    if(arr.length===0){ setMultiSelect([]); setSelectMode(null); }
    else if(arr.length===1){ setMultiSelect([]); setSelectMode(arr[0]); }
    else { setSelectMode(null); setMultiSelect(arr); }
  }
  function handleMultiTap(n) {
    if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
    const next = multiSelect.includes(n.id)?multiSelect.filter(x=>x!==n.id):[...multiSelect,n.id];
    if(next.length===1){ setMultiSelect([]); setSelectMode(next[0]); }   // -> одиночная панель
    else if(next.length===0){ setMultiSelect([]); setSelectMode(null); } // -> выход
    else { setMultiSelect(next); }
  }
  function clearMulti() { if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setMultiSelect([]); setTextArmed(false); setImgSel([]); }
  function deleteMulti() {
    const arr = (sid==="__top__"&&folder?.isTheme)?(folder.notes||[]):(subf?.notes||[]);
    const chosen = arr.map((n,i)=>({n,i})).filter(x=>multiSelect.includes(x.n.id));
    if(!chosen.length) return;
    if(undo) commitDel();
    const ids = chosen.map(x=>x.n.id);
    setDestroyIds(ids);
    setUndo({multi:chosen.map(x=>({note:x.n,idx:x.i})),fid,sid});
    const durMs = noDelAnim?0:Math.round(spd("del",2)*1000);
    multiDelTimer.current=setTimeout(()=>{ const set=new Set(ids); updNotesAt(fid,sid,_n=>_n.filter(x=>!set.has(x.id))); setDestroyIds([]); multiDelTimer.current=null; }, durMs+20);
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
    // запоминаем что и откуда; при "cut" НИЧЕГО не удаляем до вставки
    setMoveBuffer({mode, notes:chosen.map(n=>({...n})), srcFid:fid, srcSid:sid, srcIds:sel.slice()});
    clearMulti();
  }
  function deleteMultiIds(ids){
    const set=new Set(ids);
    updNotes(_n=>(_n.filter(n=>!set.has(n.id))));
    clearMulti();
  }
  function pasteMulti() {
    if(!moveBuffer) return;
    const buf=moveBuffer;
    const copies=buf.notes.map((n)=>({...n,id:uid("n"),pinned:false,time:tnow(),ts:tstamp()}));
    // 1) вставляем в текущий раздел
    updNotes(arr=>[...arr, ...copies]);
    // 2) при перемещении — теперь удаляем оригиналы из исходного раздела
    if(buf.mode==="cut" && buf.srcIds && buf.srcIds.length){
      const set=new Set(buf.srcIds);
      updNotesAt(buf.srcFid, buf.srcSid, _n=>_n.filter(x=>!set.has(x.id)));
    }
    setMoveBuffer(null);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  function softDel(n) {
    if(undo) commitDel();
    const arr = (sid==="__top__"&&folder?.isTheme)?(folder.notes||[]):(subf?.notes||[]);
    const idx = arr.findIndex(x=>x.id===n.id);
    setDestroying(n.id);
    setUndo({note:n,fid,sid,idx});
    // визуально проигрываем анимацию (если включена), затем удаляем из данных
    const durMs = noDelAnim?0:Math.round(spd("del",2)*1000);
    delTimers.current[n.id]=setTimeout(()=>{ updNotesAt(fid,sid,_n=>_n.filter(x=>x.id!==n.id)); delete delTimers.current[n.id]; }, durMs+20);
  }
  function undoDel() {
    if(!undo) return;
    const u=undo;
    if(u.multi){
      if(multiDelTimer.current){ clearTimeout(multiDelTimer.current); multiDelTimer.current=null; setDestroyIds([]); setUndo(null); return; }
      // уже удалены — возвращаем по исходным позициям
      updNotesAt(u.fid,u.sid,_n=>{ const arr=[..._n]; u.multi.slice().sort((a,b)=>a.idx-b.idx).forEach(m=>{ const at=Math.max(0,Math.min(m.idx,arr.length)); arr.splice(at,0,m.note); }); return arr; });
      setDestroyIds([]); setUndo(null); return;
    }
    if(delTimers.current[u.note.id]){ clearTimeout(delTimers.current[u.note.id]); delete delTimers.current[u.note.id]; setDestroying(null); setUndo(null); return; }
    setDestroying(null);
    updNotesAt(u.fid,u.sid,_n=>{ const arr=[..._n]; const at=Math.max(0,Math.min(u.idx, arr.length)); arr.splice(at,0,u.note); return arr; });
    setUndo(null);
  }
  function commitDel(){
    if(undo && undo.multi){ if(multiDelTimer.current){ clearTimeout(multiDelTimer.current); multiDelTimer.current=null; const set=new Set(undo.multi.map(m=>m.note.id)); updNotesAt(undo.fid,undo.sid,_n=>_n.filter(x=>!set.has(x.id))); } setDestroyIds([]); setUndo(null); return; }
    if(undo && delTimers.current[undo.note.id]){ clearTimeout(delTimers.current[undo.note.id]); delete delTimers.current[undo.note.id]; updNotesAt(undo.fid,undo.sid,_n=>_n.filter(x=>x.id!==undo.note.id)); }
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
    if(msgPop) setMsgPop(null);
    const isTouch = e.type==="touchstart";
    if(isTouch) touchUsed.current=true;
    else if(touchUsed.current) return; // игнор синтетической мыши после touch
    lpScrolled.current=false;
    const t=e.touches?e.touches[0]:e; lpStartXY.current={x:t.clientX,y:t.clientY};
    if(selectMode===n.id || multiSelect.length>0) return; // в выделении — не вмешиваемся
    // Удержание (~400мс как в Telegram) → войти в режим выделения сообщения
    clearTimeout(lpTimer.current);
    lpTimer.current=setTimeout(()=>{
      if(lpScrolled.current) return;
      lpFired.current=true;
      if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop;
      justEnteredSel.current=n.id;
      setTimeout(()=>{ justEnteredSel.current=null; },450);
      setSelectMode(n.id);
      setTextArmed(false);
      setNoteCtx(null);
      buzz(15);
    },400);
  }
  function bubbleLpMove(e)  {
    if(e && lpStartXY.current){ const t=e.touches?e.touches[0]:e; if(Math.abs(t.clientX-lpStartXY.current.x)<10 && Math.abs(t.clientY-lpStartXY.current.y)<10) return; }
    lpScrolled.current=true; clearTimeout(lpTimer.current);
  }
  function bubbleLpEnd(n, e) {
    clearTimeout(lpTimer.current);
    const isTouch = e.type==="touchend";
    if(!isTouch && touchUsed.current){ setTimeout(()=>{touchUsed.current=false;},400); return; }
    if(editId){ lastTap.current={id:null,t:0}; lpFired.current=false; return; }
    if(lpScrolled.current){ lastTap.current={id:null,t:0}; lpScrolled.current=false; return; }
    if(lpFired.current){ lpFired.current=false; lastTap.current={id:null,t:0}; setTimeout(()=>setTextArmed(true),50); return; } // удержание уже выделило
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
  function pickFiles(accept, capture) {
    const el=fileRef.current; if(!el) return;
    el.accept=accept||"*/*";
    if(capture){ el.setAttribute("capture", capture); } else { el.removeAttribute("capture"); }
    el.click(); setAttSh(false);
  }
  function onFiles(e) {
    Array.from(e.target.files||[]).forEach(file=>{
      const r=new FileReader();
      r.onload=async ev=>{
        let dataUrl=ev.target.result;
        let type=file.type||"application/octet-stream";
        const b64bytes=(du)=>{ try{ const i=(du||"").indexOf(","); const b=i>=0?du.slice(i+1):du; const pad=(b.endsWith("==")?2:b.endsWith("=")?1:0); return Math.max(0, Math.floor(b.length*3/4)-pad); }catch{ return 0; } };
        const origSize=file.size||b64bytes(dataUrl);
        let compressed=false;
        if(imgCompress && type.startsWith("image/")){
          try{ const c=await compressImage(dataUrl,type); if(c!==dataUrl){ dataUrl=c; type="image/jpeg"; compressed=true; } }catch{}
        }
        const att={id:uid("a")+Math.random(),name:file.name,type,size:b64bytes(dataUrl),origSize,compressed,dataUrl,caption:""};
        setPatts(p=>[...p,att]);
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
  async function onImport(e) {
    const f=e.target.files[0]; if(!f) return;
    e.target.value="";
    const r=new FileReader();
    r.onload=async ev=>{
      let txt=ev.target.result;
      // если зашифровано — спросить пароль
      if(f.name.endsWith(".aes256")){
        const pw=prompt("Пароль для расшифровки:");
        if(!pw){ tst("Импорт отменён"); return; }
        try{ txt=await aesDecrypt(txt, pw.trim()); }catch{ tst("❌ Неверный пароль"); return; }
      }
      try{
        const p=JSON.parse(txt);
        if(p && p.__meta && p.data){
          // новый формат — восстанавливаем все модули, что есть в файле
          const allCfg={modules:{settings:true,notes:true,drafts:true}};
          applyBackup(p, allCfg);
          // перечитываем настройки в state
          try{ setAsSettings(loadAS()); setFonts(loadFonts()); }catch{}
          tst("✅ Импортировано (все данные)");
        } else if(p && p.folders){
          // старый формат — только заметки
          upd(()=>p); tst("✅ Импортировано (заметки)");
        } else tst("❌ Неверный формат");
      }catch{ tst("❌ Ошибка чтения"); }
    };
    r.readAsText(f);
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

  const filtF=data.folders.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));

  // ── Keyboard detection for focus-mode ──


  // (floating buttons removed — no scroll tracking needed)
  function updateActiveNote(){ if(openLock.current) return; if(scr==='chat'&&scrollRef.current&&sid){ scrollPos.current[fid+"|"+sid]=scrollRef.current.scrollTop; } }

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
      className={(booting?"booting":"")+(navDir==="pop"?" navPop":"")+(suppressScrAnim?" noScrAnim":"")+(iosTrans?(navDir==="pop"?" iosT iosPop":" iosT"):"")}
      style={{height:"100dvh",background:"var(--bg)",
        display:"flex",flexDirection:"column",fontFamily:"var(--font-ui,'Noto Sans',sans-serif)",
        ...(THEMES[theme]||THEMES.dark),
        "--font-ui":fontCssFor("ui"),"--font-msg":fontCssFor("messages"),"--font-title":fontCssFor("titles"),"--font-input":fontCssFor("input"),"--scr-dur":spd("scr",0.6)+"s","--del-dur":spd("del",2)+"s","--input-dur":spd("input",0.38)+"s",
        color:"var(--ink2,var(--txt))",overflow:"hidden",position:"relative"}}
      data-ver-badge
      onTouchStart={e=>{ const t=e.touches[0]; window.__ntgrEdge = (t.clientX > window.innerWidth-34) ? {x:t.clientX,y:t.clientY} : null; }}
      onTouchEnd={e=>{ const st=window.__ntgrEdge; window.__ntgrEdge=null; if(!st) return; const t=e.changedTouches[0]; const dx=t.clientX-st.x, dy=t.clientY-st.y;
        if(dx < -60 && Math.abs(dx) > Math.abs(dy)*1.3){
          const hasDraft = composerFull ? composerPeek : (note.trim()!=="" || patts.length>0 || !!editId);
          if(!hasDraft) return;
          setAttSh(false); setCloudWhenSh(false); setCloudWhatSh(false); setCloudStorSh(false); setDriveSh(false);
          setImgSh(false); setFontDelSh(false); setFontSh(false); setAnimSh(false); setUiSh(false); setMiscSh(false);
          setExpSh(false); setAsOpen(false); setMediaBrowser(false); setPinnedOpen(false); setModal(null); setDlg(null);
          setSettingsMenu(false); setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setNoteCtx(null);
          setPrevSh(false); setFullFmt(false); setMsgPop(null); setLinkPopup(null);
          const o=composerOrigin.current||{fid,sid};
          if(o&&o.fid!=null){ if(scr!=="chat"||sid!==o.sid||fid!==o.fid){ prevLoc.current={scr,fid,sid}; } setFid(o.fid); setSid(o.sid); setScr("chat"); } // редактор живёт в экране чата
          if(!composerFull){ composerOrigin.current=o; setComposerFull(true); }
          setComposerPeek(false);
        } }}
      onClick={()=>{setNoteCtx(null);setHdrMenu(null);setFolderMenu(null);setSubMenu(null);setLinkPopup(null);setSettingsMenu(false);setPlusMenu(false);setMsgPop(null);}}
    >
      {/* Глобальная панель пересылки — снизу, над полем ввода */}
      {moveBuffer&&(
        <div onClick={e=>e.stopPropagation()} style={{position:"fixed",left:0,right:0,bottom:0,
          background:"var(--row2)",borderTop:"1px solid var(--gline,var(--line))",
          padding:"12px 14px",display:"flex",alignItems:"center",gap:10,zIndex:120,
          boxShadow:"0 -4px 16px rgba(0,0,0,.4)"}}>
          <span style={{fontSize:14,color:"var(--sub)",flex:1}}>
            {moveBuffer.mode==="cut"?"Переместить":"Переслать"}: {moveBuffer.notes.length}
          </span>
          {scr==="chat" ? (
            <button onClick={pasteMulti}
              style={{background:"var(--acc)",border:"none",borderRadius:8,padding:"8px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>Вставить сюда</button>
          ) : (
            <span style={{fontSize:12,color:"var(--sub2)"}}>Откройте тему</span>
          )}
          <button onClick={()=>setMoveBuffer(null)} title="Отмена пересылки"
            style={{background:"var(--barActive)",border:"none",borderRadius:8,padding:"8px 11px",color:"var(--sub)",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center"}}>{IC.close}</button>
        </div>
      )}
      <style>{`html,body{background:${(THEMES[theme]||THEMES.dark)["--bg"]}!important}`}</style>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;}
        input,textarea{-webkit-user-select:text;user-select:text;}
        .editor-ta{-webkit-user-select:text;-webkit-touch-callout:none!important;}
        .editor-ta::selection{background:color-mix(in srgb, var(--acc) 35%, transparent);}
        .selectable,.selectable *{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important;cursor:text;}
        ::-webkit-scrollbar{width:0;}
        /* staggered появление карточек — только прозрачность (не двигаем хит-зону) */
        @keyframes cardIn{from{opacity:0}to{opacity:1}}
        .stagger>*{animation:cardIn .4s ease both;}
        .stagger>*:nth-child(1){animation-delay:.03s}
        .stagger>*:nth-child(2){animation-delay:.08s}
        .stagger>*:nth-child(3){animation-delay:.13s}
        .stagger>*:nth-child(4){animation-delay:.18s}
        .stagger>*:nth-child(5){animation-delay:.23s}
        .stagger>*:nth-child(6){animation-delay:.28s}
        .stagger>*:nth-child(7){animation-delay:.33s}
        .stagger>*:nth-child(8){animation-delay:.38s}
        .stagger>*:nth-child(n+9){animation-delay:.42s}
        /* fade-in картинок */
        @keyframes imgFade{from{opacity:0}to{opacity:1}}
        img[data-imgsrc]{animation:imgFade .35s ease;}
        /* pinned баннер slide-down */
        @keyframes pinDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fS {from{opacity:0}to{opacity:1}}
        @keyframes scrIn{from{opacity:.6;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
        @keyframes scrInPop{from{opacity:.6;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
        @keyframes dropGrow{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
        @keyframes msgInUp{from{opacity:0;transform:translateY(28px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes checkPop{0%{transform:scale(.6)}55%{transform:scale(1.18)}100%{transform:scale(1)}}
        @keyframes lbZoom{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
        .msgInUp{animation:msgInUp .34s cubic-bezier(.2,.7,.2,1) both;}
        .checkPop{animation:checkPop .32s cubic-bezier(.3,1.3,.4,1) both;}
        .scrAnim{animation-name:scrIn;animation-duration:var(--scr-dur,.6s);animation-timing-function:cubic-bezier(.05,.7,.1,1);animation-fill-mode:both;}
        .navPop .scrAnim{animation-name:scrInPop;}
        .iosT .scrAnim{animation:none!important;}
        .noScrAnim .scrAnim{animation:none!important;}
        
        
        
        
        
        @keyframes iosPushIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes iosPopIn{from{transform:translateX(-30%)}to{transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes recPulse {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
        @keyframes tIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        html,body,#root{background:${(THEMES[theme]||THEMES.dark)["--bg"]} !important;margin:0;}
        .row:active{background:var(--line);}
        .dmi:active{background:var(--line);}
        .dmi:hover{background:#332512;}
        .menu-dots:active{background:var(--line);border-radius:50%;}
        textarea:focus,input:focus{outline:none;}
        *{-webkit-tap-highlight-color:transparent;}
        button{outline:none;-webkit-tap-highlight-color:transparent;}
        button:focus,button:focus-visible{outline:none;}
        /* анимация нажатия отключена, чтобы не было артефактов при переключении */
        .nb{animation:fS .18s ease;}
        .booting .nb{animation:none!important;}
        .booting .scrAnim{animation:none!important;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes flyAwayLeft{
          0%{transform:translateX(0) rotate(0);opacity:1}
          18%{transform:translateX(14px) rotate(1.5deg);opacity:1}
          100%{transform:translateX(-140vw) rotate(-8deg);opacity:0}}
        .destroying{animation:flyAwayLeft var(--del-dur,2s) cubic-bezier(.5,0,.75,0) forwards;will-change:transform;}
        .planeGhost{position:fixed;width:44px;height:44px;border-radius:50%;background:var(--acc);
          display:flex;align-items:center;justify-content:center;color:#fff;z-index:500;pointer-events:none;
          box-shadow:0 1px 5px rgba(239,108,0,.3);
          transition:left .5s cubic-bezier(.4,0,.2,1),top .5s cubic-bezier(.4,0,.2,1),bottom .5s cubic-bezier(.4,0,.2,1),transform .5s cubic-bezier(.4,0,.2,1);}
      `}</style>

      
      {planePhase!=='idle' && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:52,pointerEvents:"none",zIndex:9998}}>
          <div style={{position:"absolute",top:"50%",width:44,height:44,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:ACC_GLOW||"none",
            left:(planePhase==='in'||planePhase==='outStart')?"calc(100% - 35px)":"50%",
            transform:(planePhase==='in'||planePhase==='outStart')?"translate(-50%,-50%) rotate(90deg)":"translate(-50%,-50%) rotate(0deg)",
            transition:(planePhase==='start'||planePhase==='outStart')?"none":"left .45s ease-in-out, transform .45s ease-in-out"}}>
            <span style={{display:"flex",transform:"scale(.9)"}}>{IC.sendUp}</span>
          </div>
        </div>
      )}
      {!hideVersion && <div style={{position:"fixed",top:2,left:2,zIndex:9999,fontSize:9,color:"var(--sub3)",pointerEvents:"none",fontFamily:"monospace"}}>beta v554</div>}
      <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={onFiles}/>
      <input ref={importRef} type="file" accept=".json,.aes256,application/json,text/plain" style={{display:"none"}} onChange={onImport}/>
      <input ref={iconRef} type="file" accept="image/*" style={{display:"none"}} onChange={onIconPick}/>

      {listMode&&(()=>{
        const lm=listMode;
        const lnote=(()=>{ const f=data.folders.find(x=>x.id===lm.fid); if(!f)return null; if(f.isTheme) return (f.notes||[]).find(x=>x.id===lm.id); const sb=(f.subfolders||[]).find(x=>x.id===lm.sid); return sb&&(sb.notes||[]).find(x=>x.id===lm.id); })();
        const rawItems=lnote?.checklist||[];
        let items=rawItems;
        if(lmDragOrder){ const m={}; rawItems.forEach(x=>m[x.id]=x); const ord=lmDragOrder.map(id=>m[id]).filter(Boolean); const rest=rawItems.filter(x=>!lmDragOrder.includes(x.id)); items=[...ord,...rest]; }
        const setItems=fn=>updNotesAt(lm.fid,lm.sid,_n=>_n.map(n=>n.id===lm.id?{...n,checklist:fn(n.checklist||[])}:n));
        lm_setItemsRef.current=setItems;
        const toggle=id=>{ const cur=items.find(x=>x.id===id); const checking=cur&&!cur.checked; flipReorder("[data-lmid]", ()=>setItems(arr=>{ const a=arr.map(x=>({...x})); const i=a.findIndex(x=>x.id===id); if(i<0)return arr; const it=a[i]; if(!it.checked){ it.checked=true; it.origIdx=i; a.splice(i,1); a.push(it); } else { it.checked=false; a.splice(i,1); const unchecked=a.filter(x=>!x.checked).length; const back=Math.min(it.origIdx??unchecked,unchecked); a.splice(back,0,it); delete it.origIdx; } return a; }), checking?560:320); try{buzz(8,"check");}catch{} };
        const editTxt=(id,v)=>setItems(arr=>arr.map(x=>x.id===id?{...x,text:v}:x));
        return (
        <div style={{position:"fixed",top:0,bottom:0,left:0,right:0,background:"var(--bg)",zIndex:620,display:"flex",flexDirection:"column"}}>
          <div onTouchMove={lmRowTouchMove} onTouchEnd={lmRowTouchEnd} style={{flex:1,overflowY:"auto",padding:"12px 0",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
            <div style={{width:"max-content",maxWidth:"calc(100% - 24px)",marginLeft:"auto",marginRight:14,boxSizing:"border-box"}}>
            <input data-lmtitle defaultValue={lnote?.clTitle||""} key={"lmtitle-"+lm.id} readOnly={!lmEditMode}
              onChange={e=>{ const v=e.target.value; clearTimeout(lmTitleTimer.current); lmTitleTimer.current=setTimeout(()=>updNotesAt(lm.fid,lm.sid,_n=>_n.map(n=>n.id===lm.id?{...n,clTitle:v}:n)),300); }}
              onBlur={e=>{ const v=e.target.value; clearTimeout(lmTitleTimer.current); updNotesAt(lm.fid,lm.sid,_n=>_n.map(n=>n.id===lm.id?{...n,clTitle:v}:n)); }}
              placeholder="Заголовок"
              style={{width:"100%",boxSizing:"border-box",background:"transparent",border:"none",outline:"none",color:"var(--ink,var(--txt))",fontSize:18,fontWeight:700,fontFamily:"var(--font-msg)",padding:"2px 0 10px 30px",textAlign:"left",userSelect:lmEditMode?"text":"none",WebkitUserSelect:lmEditMode?"text":"none",pointerEvents:lmEditMode?"auto":"none"}}/>
            {items.map((it,idx)=>(
              <div key={it.id} data-lmid={it.id} data-dragging={lmDragId===it.id?"1":"0"}
                onTouchStart={e=>{ if(!lmEditMode) lmRowTouchStart(idx,e,items,setItems); }}
                style={{display:"flex",alignItems:"flex-start",gap:8,padding:"2px 0",opacity:it.checked?.6:1,touchAction:lmDragId===it.id?"none":"auto",
                transform: (lmLand&&lmLand.id===it.id)?`translateY(${lmLand.off}px)`:undefined,
                transition: lmDragId===it.id?"box-shadow .18s ease":((lmLand&&lmLand.id===it.id&&lmLand.animate)?"transform 140ms cubic-bezier(.22,1,.36,1)":((lmLand&&lmLand.id===it.id)?"none":"transform 180ms cubic-bezier(.2,.8,.2,1)")),
                position:"relative", zIndex:(lmDragId===it.id||(lmLand&&lmLand.id===it.id))?30:1,
                background:lmDragId===it.id?"var(--dcard)":"transparent",
                border:"none",
                boxShadow:lmDragId===it.id?"0 14px 32px rgba(0,0,0,.6)":"none",
                borderRadius:8}}>
                <button onClick={()=>toggle(it.id)} style={{flexShrink:0,padding:"8px 4px 6px 0",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{width:22,height:22,borderRadius:6,border:"2px solid "+(it.checked?"var(--acc)":"var(--sub3)"),background:it.checked?"var(--acc)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {it.checked&&<span className="checkPop" style={{display:"flex",transform:"scale(.7)",color:"#fff"}}>{IC.check}</span>}</span></button>
                <div style={{display:"inline-grid",minWidth:0,maxWidth:"100%",flex:"0 1 auto"}}>
                  {lmDragId? (
                    <div style={{gridArea:"1/1/2/2",whiteSpace:"pre-wrap",overflowWrap:"break-word",lineHeight:"1.35",color:it.checked?"var(--sub2)":"var(--ink,var(--txt))",fontSize:16,fontFamily:"var(--font-msg)",textDecoration:it.checked?"line-through":"none",padding:"6px 0"}}>{it.text||"\u200b"}</div>
                  ) : (<>
                  <span aria-hidden="true" style={{gridArea:"1/1/2/2",visibility:"hidden",whiteSpace:"pre-wrap",overflowWrap:"break-word",lineHeight:"1.35",fontSize:16,fontFamily:"var(--font-msg)",padding:"6px 0",minWidth:"1ch"}}>{(it.text||" ")+"\u200b"}</span>
                  <textarea value={it.text} readOnly={!lmEditMode} rows={1}
                    onChange={e=>editTxt(it.id,e.target.value)} data-lmrow={idx}
                    style={{gridArea:"1/1/2/2",width:"100%",background:"transparent",border:"none",outline:"none",textAlign:"left",resize:"none",overflow:"hidden",whiteSpace:"pre-wrap",overflowWrap:"break-word",lineHeight:"1.35",color:it.checked?"var(--sub2)":"var(--ink,var(--txt))",fontSize:16,fontFamily:"var(--font-msg)",textDecoration:it.checked?"line-through":"none",padding:"6px 0",userSelect:lmEditMode?"text":"none",WebkitUserSelect:lmEditMode?"text":"none",pointerEvents:lmEditMode?"auto":"none"}}/></>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
          {/* Нижняя шапка списка — скруглённая, как остальные панели */}
          <div data-lmfooter style={{display:"flex",alignItems:"center",gap:8,padding:"0 12px",height:52,
            background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",width:"calc(100% - 2px)",margin:"0 1px",
            boxShadow:"0 -4px 16px rgba(0,0,0,.35)",flexShrink:0,position:"relative"}}>
            <button onClick={()=>{setListMode(null);setLmEditMode(false);}} style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"var(--ink,var(--txt))",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.back}</button>
            <div style={{flex:1,fontWeight:600,fontSize:16,color:"var(--ink,var(--txt))"}}>Список</div>
            <button onClick={()=>{ const entering=!lmEditMode; setLmEditMode(entering); if(entering){ setTimeout(()=>{ const el=document.querySelector('[data-lmrow="0"]'); if(el){ el.focus(); try{el.setSelectionRange(el.value.length,el.value.length);}catch{} } },80); } }} title={lmEditMode?"Готово":"Редактировать"}
              style={{width:44,height:44,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",boxShadow:ACC_GLOW||((!_lite&&iconAccent==="orange")?"0 1px 5px rgba(239,108,0,.3)":"none")}}>
              <span style={{display:"flex",transform:"scale(.82)"}}>{lmEditMode?IC.check:IC.edit}</span></button>
          </div>
        </div>
        );
      })()}

      {/* Глобальный поиск по сообщениям */}
      {globalSearch!==null&&(
        <div style={{position:"fixed",top:0,bottom:0,left:0,right:0,background:"var(--bg)",zIndex:420,display:"flex",flexDirection:"column"}}>
          {/* Результаты сверху */}
          <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
            {globalSearch.trim().length<2 && <div style={{textAlign:"center",color:"var(--sub3)",marginTop:50,fontSize:14}}>Введите минимум 2 символа</div>}
            {globalSearch.trim().length>=2 && globalResults(globalSearch).length===0 && <div style={{textAlign:"center",color:"var(--sub3)",marginTop:50,fontSize:14}}>Ничего не найдено</div>}
            {globalResults(globalSearch).map((r,i)=>(
              <div key={i} onClick={()=>openThemeAt(r.folderId,r.subId,r.note.id)}
                style={{padding:"10px 16px",borderBottom:"1px solid var(--gline2,var(--bar))",cursor:"pointer"}}>
                <div style={{fontSize:12,color:"var(--acc)",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.themeName}</div>
                <div style={{fontSize:14,color:"var(--ink,var(--txt))",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{strip(r.note.text)}</div>
                <div style={{fontSize:10,color:"var(--sub3)",marginTop:3}}>{r.note.ts?fmtStamp(r.note.ts):r.note.time}</div>
              </div>
            ))}
          </div>
          {/* Панель поиска внизу — в едином стиле, высота 46 */}
          <div style={{padding:"0 12px",flexShrink:0,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 1px",height:52,display:"flex",alignItems:"center",boxShadow:"0 4px 16px rgba(0,0,0,.35)",width:"calc(100% - 2px)"}}>
            <div style={{background:"var(--bg)",borderRadius:12,display:"flex",alignItems:"center",padding:"0 12px",height:40,gap:8,width:"100%"}}>
              <span style={{color:"var(--sub)",display:"flex"}}>{IC.search}</span>
              <input autoFocus value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Поиск по всем сообщениям..."
                style={{background:"none",border:"none",color:"var(--ink,var(--txt))",fontSize:14,flex:1}}/>
              <button onClick={()=>setGlobalSearch(null)} style={{background:"none",border:"none",color:"var(--sub)",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
          </div>
        </div>
      )}

      {/* Возвратная вкладка к черновику — видна на ЛЮБОМ экране, пока пишется/редактируется сообщение */}
      {((composerFull && composerPeek) || (!composerFull && (note.trim()!=="" || patts.length>0 || editId))) && (
        <button onClick={()=>{
            // закрыть всё, что может перекрывать редактор, и вернуться к нему
            setAttSh(false); setCloudWhenSh(false); setCloudWhatSh(false); setCloudStorSh(false); setDriveSh(false);
            setImgSh(false); setFontDelSh(false); setFontSh(false); setAnimSh(false); setUiSh(false); setMiscSh(false);
            setExpSh(false); setAsOpen(false); setMediaBrowser(false); setPinnedOpen(false); setModal(null); setDlg(null);
            setSettingsMenu(false); setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setNoteCtx(null);
            setPrevSh(false); setFullFmt(false); setMsgPop(null); setLinkPopup(null);
            const o=composerOrigin.current||{fid,sid};
            if(o&&o.fid!=null){ if(scr!=="chat"||sid!==o.sid||fid!==o.fid){ prevLoc.current={scr,fid,sid}; } setFid(o.fid); setSid(o.sid); setScr("chat"); } // редактор живёт в экране чата
            if(!composerFull){ composerOrigin.current=o; setComposerFull(true); }
            setComposerPeek(false);
          }} title="Вернуться к сообщению (свайп влево)"
          style={{position:"fixed",right:0,top:"50%",transform:"translateY(-50%)",zIndex:1300,
            background:"rgba(46,37,28,.9)",border:"1px solid var(--gline,var(--line))",borderRight:"none",color:"var(--acc)",cursor:"pointer",
            width:30,height:80,borderRadius:"12px 0 0 12px",display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"-2px 0 12px rgba(0,0,0,.4)"}}>
          <span style={{display:"flex",transform:"scale(.8)"}}>{IC.arrLeft}</span>
        </button>
      )}


      {/* Летящий самолётик: визуальный переход между «написать» (центр) и «отправить» (угол) */}

      {/* Летящий самолётик между «написать» (центр-низ) и «отправить» (угол) */}
      {/* PlaneGhost перемещён в конец для верхнего слоя */}

      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:84,left:"50%",transform:"translateX(-50%)",
        background:"var(--bar)",color:"var(--ink,var(--txt))",borderRadius:12,padding:"10px 18px",fontSize:14,
        zIndex:650,whiteSpace:"nowrap",animation:"tIn .2s ease",boxShadow:"0 4px 20px rgba(0,0,0,.4)"}}>
        {toast}</div>}

      {undo&&<UndoToast onUndo={undoDel} onDone={commitDel}/>}

      {linkPopup&&<LinkPopup href={linkPopup.href} x={linkPopup.x} y={linkPopup.y} onClose={()=>setLinkPopup(null)}/>}

      {txtSel&&customSelMenu&&(()=>{
        const W=txtSel.editable?176:120, pad=8;
        let left=Math.min(Math.max(pad, txtSel.x - W/2), window.innerWidth - W - pad);
        let top=txtSel.y - 46; if(top<pad) top=txtSel.y + 22;
        const Btn=(ic,fn,t)=>(<button onMouseDown={e=>e.preventDefault()} onClick={fn} title={t}
          style={{width:40,height:32,borderRadius:8,background:"var(--row2)",border:"none",color:"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{display:"flex",transform:"scale(.8)"}}>{ic}</span></button>);
        return (
        <div style={{position:"fixed",inset:0,zIndex:485,pointerEvents:"none"}}>
          <div onMouseDown={e=>e.preventDefault()} style={{position:"absolute",left,top,pointerEvents:"auto",display:"flex",gap:4,background:"var(--barActive)",border:"1px solid var(--gline,var(--line))",borderRadius:12,padding:5,boxShadow:"0 8px 28px rgba(0,0,0,.55)",animation:"fS .12s ease"}}>
            {Btn(IC.copy2||IC.copy, txtCopy, "Копировать")}
            {txtSel.editable && Btn(IC.scissors, txtCut, "Вырезать")}
            {txtSel.editable && Btn(IC.paste, txtPaste, "Вставить")}
            {Btn(IC.selectAll, txtSelectAll, "Выделить всё")}
          </div>
        </div>
        );
      })()}
      {msgPop&&(()=>{
        const note=(subf?.notes||[]).find(x=>x.id===msgPop.id) || (folder?.isTheme?(folder.notes||[]):[]).find(x=>x.id===msgPop.id);
        if(!note) return null;
        const W=120, H=44; const pad=8;
        let left=Math.min(Math.max(pad, msgPop.x - W/2), window.innerWidth - W - pad);
        let top=msgPop.y - H - 10; if(top<pad) top=msgPop.y + 14;
        return (
        <div style={{position:"fixed",inset:0,zIndex:480,pointerEvents:"none"}}>
          <div data-msgpop onClick={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()}
            style={{position:"absolute",left,top,pointerEvents:"auto",display:"flex",gap:4,background:"var(--barActive)",border:"1px solid var(--gline,var(--line))",
              borderRadius:12,padding:5,boxShadow:"0 8px 28px rgba(0,0,0,.55)",animation:"fS .12s ease"}}>
            {note.text&&<button onClick={()=>{ copyText(note); setMsgPop(null); }} onTouchEnd={(e)=>{ e.preventDefault(); e.stopPropagation(); copyText(note); setMsgPop(null); }} title="Копировать"
              style={{width:44,height:34,borderRadius:8,background:"var(--row2)",border:"none",color:"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{display:"flex",transform:"scale(.85)"}}>{IC.copy||IC.text}</span></button>}
            <button onClick={()=>{ setMsgPop(null); startEdit(note); }} onTouchEnd={(e)=>{ e.preventDefault(); e.stopPropagation(); setMsgPop(null); startEdit(note); }} title="Редактировать"
              style={{width:44,height:34,borderRadius:8,background:"var(--row2)",border:"none",color:"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{display:"flex",transform:"scale(.85)"}}>{IC.edit}</span></button>
          </div>
        </div>
        );
      })()}

      {/* ══ HEADER — hidden in typing mode ══ */}
      {false&&!(isTyping&&note.length>0)&&!selectMode&&multiSelect.length===0&&(
        <div style={{background:"var(--bar)",padding:"0 12px",height:46,display:"flex",alignItems:"center",
          gap:10,borderBottom:"1px solid var(--gline2,var(--bar))",flexShrink:0}}>
          {scr!=="main"
            ?<button onClick={back} title="Назад"
               style={{width:38,height:38,borderRadius:"50%",background:"var(--bar)",border:"none",
                 color:"var(--ink,var(--txt))",fontSize:22,cursor:"pointer",display:"flex",alignItems:"center",
                 justifyContent:"center",lineHeight:1,flexShrink:0}}>{IC.back}</button>
            :null}

          {scr==="main"&&(
            <div style={{position:"relative",flex:1}} onClick={e=>e.stopPropagation()}>
              <div data-menutrigger onClick={()=>{ setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setSettingsMenu(v=>!v); }}
                style={{fontSize:19,fontWeight:700,letterSpacing:-.5,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
                Notenger <span style={{fontSize:12,color:"var(--sub)"}}>▾</span>
              </div>
              {settingsMenu&&<DropMenu onClose={()=>setSettingsMenu(false)}
                style={{position:"absolute",top:"calc(100% + 8px)",left:0}}
                items={[
                  {ic:IC.save,label:"Резервная копия данных",fn:()=>setExpSh(true)},
                  {ic:IC.palette,label:"Интерфейс",fn:()=>{ uiNoAnim.current=false; setUiSh(true); }},
                {ic:IC.vibrate,label:"Вибрация",fn:()=>setVibeSh(true)},
                {ic:IC.sliders,label:"Прочее",fn:()=>setMiscSh(true)},
                ]}/>}
            </div>
          )}

          {scr==="sub"&&folder&&(
            <div onClick={e=>{e.stopPropagation();setModal("renF");}}
              style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,cursor:"pointer"}}>
              {/* Тап по иконке категории → форма смены иконки (без файлов) */}
              <Av icon={folder.icon} img={folder.iconImg} color={folder.color} size={36} acc={iconAccent}/>
              <div style={{minWidth:0}}>
                <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{folder.name}</div>
                <div style={{fontSize:12,color:"var(--sub)"}}>{folder.subfolders.length} тем</div>
              </div>
            </div>
          )}

          {scr==="chat"&&subf&&(
            <div onClick={e=>{e.stopPropagation();setMediaBrowser(true);}}
              style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,cursor:"pointer"}}>
              {/* Тап по иконке темы → панель вложений (как в Telegram) */}
              <div style={{flexShrink:0}}>
                <Av icon={subf.icon} img={subf.iconImg} color={subf.color} size={36} acc={iconAccent}/>
              </div>
              <div style={{minWidth:0,flex:1}}>
                <div style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"var(--font-title)"}}>{subf.name}</div>
                
              </div>
            </div>
          )}

          {/* Header right */}
          <div style={{display:"flex",gap:6,marginLeft:"auto",flexShrink:0,position:"relative"}}>
            {scr==="main"&&(
              <button onClick={()=>setGlobalSearch("")} title="Поиск по сообщениям"
                style={{width:38,height:38,background:"var(--bar)",border:"none",color:"var(--sub)",borderRadius:"50%",
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.search}</button>
            )}

            {scr==="sub"&&(<>
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button data-menutrigger onClick={e=>openHdrMenu("folder",e)}
                  style={{width:38,height:38,background:"var(--bar)",border:"none",color:"var(--sub)",borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
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
                  style={{width:38,height:38,background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,borderRadius:"50%",cursor:"pointer",fontSize:22,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.plus}</button>
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
                style={{width:38,height:38,background:"var(--bar)",border:"none",color:"var(--sub)",borderRadius:"50%",cursor:"pointer",fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.search}</button>
              {/* ⋯ menu — rename only (delete removed) */}
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button data-menutrigger onClick={e=>openHdrMenu("sub",e)}
                  style={{width:38,height:38,background:"var(--bar)",border:"none",color:"var(--sub)",borderRadius:"50%",cursor:"pointer",fontSize:18,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
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
      {scr==="chat"&&pinned&&!(isTyping&&note.length>0)&&(
        <PinnedBanner note={pinned} color={subColor} count={pinnedList.length} index={Math.min(pinIdx,pinnedList.length-1)}
          onJump={()=>{ jumpTo(pinned.id); if(pinnedList.length>1) setPinIdx(i=>(i+1)%pinnedList.length); }}/>
      )}

      {scr==="main"&&(
        <div className={((noScrAnim||navTick===0)?"":"scrAnim ")} key={noScrAnim?"scr-main":"scr-main-"+navTick} style={{flex:1,overflowY:"auto",padding:"4px 0",display:"flex",flexDirection:"column",justifyContent:"flex-end",animationDuration:spd("scr",0.6)+"s"}}
          onTouchMove={folderDragTouchMove}
          onTouchEnd={folderDragTouchEnd}>
          {filtF.length===0&&<div style={{textAlign:"center",color:"var(--sub)",marginTop:60,fontSize:15}}>Нет категорий — нажмите +</div>}
          {filtF.map(f=>{
            const last = f.isTheme
              ? ((f.notes&&f.notes.length)?f.notes.slice(-1)[0]:(f.subfolders||[]).flatMap(s=>s.notes||[]).slice(-1)[0])
              : f.subfolders.flatMap(s=>s.notes).pop();
            return (
              <div key={f.id} data-fid={f.id} data-dragging={dragActive===f.id?"1":"0"} className="row" onClick={()=>openF(f)}
                onTouchStart={e=>folderDragTouchStart(f.id,e)}
                style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",position:"relative",
                  cursor:"pointer",margin:"3px 8px",
                  background:dragActive===f.id?"var(--barActive)":"var(--bar)",
                  border:"1px solid "+(iconAccent==="choconeon"?(_lite?"rgba(47,128,237,.5)":"rgba(239,108,0,.55)"):"var(--line)"),
                  transform:dragActive===f.id?undefined:((fLand&&fLand.id===f.id)?`translateY(${fLand.off}px)`:"none"),
                  transition:dragActive===f.id?"box-shadow .18s ease, background .15s ease":((fLand&&fLand.id===f.id&&fLand.animate)?"transform 140ms cubic-bezier(.22,1,.36,1), background .15s ease":((fLand&&fLand.id===f.id)?"background .15s ease":"transform .42s cubic-bezier(.16,1,.3,1), background .15s ease")),
                  boxShadow:dragActive===f.id?"0 18px 42px rgba(0,0,0,.7)":(iconAccent==="choconeon"?(_lite?"0 0 10px rgba(47,128,237,.4)":"0 0 10px rgba(239,108,0,.35)"):"none"),
                  borderRadius:f.isTheme?22:12,
                  zIndex:(dragActive===f.id||(fLand&&fLand.id===f.id))?30:"auto"}}>
                {/* Метка типа — прижата к верхней грани, правый угол */}
                <span style={{position:"absolute",top:3,right:12,fontSize:8,letterSpacing:.3,
                  textTransform:"uppercase",color:"var(--sub3)",pointerEvents:"none"}}>{f.isTheme?"тема":"катег"}</span>
                <Av icon={f.icon} img={f.iconImg} color={f.color} acc={iconAccent}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:16,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0,fontFamily:"var(--font-title)"}}>{f.name}</span>
                  </div>
                  <div style={{fontSize:13,color:"var(--sub)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                    {f.isTheme ? (last?(strip(last.text)||(last.attachments?.length?"Вложение":"Нет сообщений")):"Нет сообщений") : (last?(strip(last.text)||(last.attachments?.length?"Вложение":"Нет сообщений")):`${f.subfolders.length} тем`)}
                  </div>
                </div>
                <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}
                  onPointerDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}>
                  <button className="menu-dots" data-menutrigger onClick={e=>openFolderMenu(f,e)}
                    style={{background:"none",border:"none",color:"var(--sub)",fontSize:20,cursor:"pointer",width:34,height:34,opacity:.55,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                  {folderMenu?.fid===f.id&&(()=>{ const est=150; const below=folderMenu.rect.bottom+4; const up=(below+est>window.innerHeight); return (
                  <DropMenu onClose={()=>setFolderMenu(null)}
                    style={up
                      ?{position:"fixed",bottom:(window.innerHeight-folderMenu.rect.top+4),right:window.innerWidth-folderMenu.rect.right}
                      :{position:"fixed",top:below,right:window.innerWidth-folderMenu.rect.right}}
                    items={[
                      {ic:IC.edit,label:"Переименовать",fn:()=>{setFid(f.id);setModal("renF");}},
                      {ic:isDefaultLaunch(f.id,f.isTheme?"__top__":null)?IC.launchOff:IC.launch,label:isDefaultLaunch(f.id,f.isTheme?"__top__":null)?"Не открывать при запуске":"Открывать при запуске",fn:()=>toggleDefaultLaunch(f.id,f.isTheme?"__top__":null)},
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
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"0 12px",
          background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 0 0",flexShrink:0,height:52,overflow:"visible",boxShadow:"0 4px 16px rgba(0,0,0,.35)"}} onClick={e=>e.stopPropagation()}>
          <div style={{position:"relative",flex:1,minWidth:0}}>
            <div data-menutrigger onClick={()=>{ setPlusMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setSettingsMenu(v=>!v); }}
              style={{fontSize:17,fontWeight:700,letterSpacing:-.5,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
              Notenger <span style={{fontSize:11,color:"var(--sub)"}}>▾</span>
            </div>
            {settingsMenu&&<DropMenu onClose={()=>setSettingsMenu(false)}
              style={{position:"absolute",bottom:"calc(100% + 8px)",left:0}}
              items={[
                {ic:IC.save,label:"Резервная копия данных",fn:()=>setExpSh(true)},
                {ic:IC.palette,label:"Интерфейс",fn:()=>{ uiNoAnim.current=false; setUiSh(true); }},
                {ic:IC.vibrate,label:"Вибрация",fn:()=>setVibeSh(true)},
                {ic:IC.sliders,label:"Прочее",fn:()=>setMiscSh(true)},
              ]}/>}
          </div>
          {/* Центрированный FAB + */}
          <button data-menutrigger onClick={()=>{ setSettingsMenu(false); setHdrMenu(null); setFolderMenu(null); setSubMenu(null); setPlusMenu(v=>!v); }} title="Создать"
            style={{position:"absolute",left:"50%",bottom:6,transform:"translateX(-50%)",zIndex:5,
              width:44,height:44,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",
              fontSize:24,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:ACC_GLOW||((!_lite&&iconAccent==="orange")?"0 1px 5px rgba(239,108,0,.3)":"none")}}>{IC.plus}</button>
          {plusMenu&&<div style={{position:"absolute",bottom:"calc(100% + 10px)",left:"50%",transform:"translateX(-50%)"}}>
            <DropMenu onClose={()=>setPlusMenu(false)}
            style={{position:"relative",transformOrigin:"bottom center"}}
            items={[
              {ic:IC.fFolder,label:"Новая категория",fn:()=>setModal("mkF")},
              {ic:IC.fNote,label:"Новая тема",fn:()=>setModal("mkTop")},
            ]}/></div>}
          {scr==="main"&&<button onClick={toggleTheme} title="Тема"
            style={{position:"fixed",top:10,right:12,zIndex:600,width:36,height:36,borderRadius:18,background:theme==="light"?"#FFFFFF":"var(--bar)",border:"1px solid var(--line)",color:"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,boxShadow:theme==="light"?"0 2px 10px rgba(0,0,0,.18)":"0 2px 8px rgba(0,0,0,.28)"}}>{theme==="light"?IC.moon:IC.sun}</button>}
          <button onClick={()=>setGlobalSearch("")} title="Поиск по сообщениям"
            style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"var(--sub)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.search}</button>
        </div>
      )}

      {scr==="sub"&&folder&&(
        <div className={((noScrAnim||navTick===0)?"":"scrAnim ")} key={noScrAnim?"scr-sub":"scr-sub-"+navTick}  style={{flex:1,overflowY:"auto",padding:"4px 0",display:"flex",flexDirection:"column",justifyContent:"flex-end",animationDuration:spd("scr",0.6)+"s"}}
          onTouchMove={subDragTouchMove}
          onTouchEnd={subDragTouchEnd}>
          {folder.subfolders.length===0&&<div style={{textAlign:"center",color:"var(--sub)",marginTop:60,fontSize:15}}>Нет тем — нажмите +</div>}
          {folder.subfolders.filter(s=>s.name.toLowerCase().includes(subSearch.trim().toLowerCase())).map(s=>{
            const last=s.notes[s.notes.length-1];
            return (
              <div key={s.id} data-sid={s.id} data-dragging={dragActive===s.id?"1":"0"} className="row" onClick={()=>openS(s)}
                onTouchStart={e=>subDragTouchStart(s.id,e)}
                style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",
                  cursor:"pointer",margin:"3px 8px",
                  background:dragActive===s.id?"var(--barActive)":"var(--bar)",
                  border:"1px solid "+(iconAccent==="choconeon"?(_lite?"rgba(47,128,237,.5)":"rgba(239,108,0,.55)"):"var(--line)"),
                  transform:dragActive===s.id?undefined:((fLand&&fLand.id===s.id)?`translateY(${fLand.off}px)`:"none"),
                  transition:dragActive===s.id?"box-shadow .18s ease, background .15s ease":((fLand&&fLand.id===s.id&&fLand.animate)?"transform 140ms cubic-bezier(.22,1,.36,1), background .15s ease":((fLand&&fLand.id===s.id)?"background .15s ease":"transform .42s cubic-bezier(.16,1,.3,1), background .15s ease")),
                  boxShadow:dragActive===s.id?"0 18px 42px rgba(0,0,0,.7)":(iconAccent==="choconeon"?(_lite?"0 0 10px rgba(47,128,237,.4)":"0 0 10px rgba(239,108,0,.35)"):"none"),
                  borderRadius:22,
                  zIndex:(dragActive===s.id||(fLand&&fLand.id===s.id))?30:"auto"}}>
                <Av icon={s.icon} color={s.color} acc={iconAccent}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:600,fontSize:16,fontFamily:"var(--font-title)"}}>{s.name}</span>
                  </div>
                  <div style={{fontSize:13,color:"var(--sub)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>
                    {last?(strip(last.text)||(last.attachments?.length?"Вложение":"Нет сообщений")):"Нет сообщений"}
                  </div>
                </div>
                <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}
                  onPointerDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()}>
                  <button className="menu-dots" data-menutrigger onClick={e=>openSubMenu(s,e)}
                    style={{background:"none",border:"none",color:"var(--sub)",fontSize:20,cursor:"pointer",width:34,height:34,opacity:.55,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
                  {subMenu?.sid===s.id&&(()=>{ const est=150; const below=subMenu.rect.bottom+4; const up=(below+est>window.innerHeight); return (
                  <DropMenu onClose={()=>setSubMenu(null)}
                    style={up
                      ?{position:"fixed",bottom:(window.innerHeight-subMenu.rect.top+4),right:window.innerWidth-subMenu.rect.right}
                      :{position:"fixed",top:below,right:window.innerWidth-subMenu.rect.right}}
                    items={[
                      {sep:true},
                      {ic:IC.edit,label:"Переименовать",fn:()=>{setSid(s.id);setModal("renS");}},
                      {ic:isDefaultLaunch(fid,s.id)?IC.launchOff:IC.launch,label:isDefaultLaunch(fid,s.id)?"Не открывать при запуске":"Открывать при запуске",fn:()=>toggleDefaultLaunch(fid,s.id)},
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
        <div style={{padding:"0 12px",flexShrink:0,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 1px",height:52,display:"flex",alignItems:"center",boxShadow:"0 4px 16px rgba(0,0,0,.35)",width:"calc(100% - 2px)"}}>
          <div style={{background:"var(--bg)",borderRadius:12,display:"flex",alignItems:"center",padding:"0 12px",height:40,gap:8,width:"100%"}}>
            <span style={{color:"var(--sub)",display:"flex"}}>{IC.search}</span>
            <input autoFocus value={subSearch.trim()===""?"":subSearch} onChange={e=>setSubSearch(e.target.value||" ")}
              placeholder="Поиск темы..." style={{background:"none",border:"none",color:"var(--ink,var(--txt))",fontSize:14,flex:1}}/>
            <button onClick={()=>setSubSearch("")} style={{background:"none",border:"none",color:"var(--sub)",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
        </div>
      )}
      {/* ═══ НИЖНЯЯ ШАПКА КАТЕГОРИИ — назад · категория · поиск · ⋯ · + ═══ */}
      {scr==="sub"&&folder&&subSearch===""&&!selectMode&&multiSelect.length===0&&(
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"0 12px",
          background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 0 0",flexShrink:0,height:52,overflow:"visible",boxShadow:"0 4px 16px rgba(0,0,0,.35)"}} onClick={e=>e.stopPropagation()}>
          <button onClick={back} title="Назад"
            style={{width:42,height:42,borderRadius:"50%",background:"none",border:"none",color:"var(--ink,var(--txt))",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:2}}>{IC.back}</button>
          <div onClick={e=>{e.stopPropagation();setModal("renF");}} style={{minWidth:0,flex:1,cursor:"pointer",paddingLeft:4}}>
            <div style={{fontWeight:600,fontSize:15,color:"var(--ink,var(--txt))",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{folder.name}</div>
            <div style={{fontSize:11,color:"var(--sub2)"}}>{folder.subfolders.length} тем</div>
          </div>
          <button onClick={()=>setSubSearch(" ")} title="Поиск темы"
            style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"var(--sub)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{IC.search}</button>
          <div style={{position:"relative",flexShrink:0}}>
            <button data-menutrigger onClick={e=>openHdrMenu("folder",e)}
              style={{width:40,height:40,borderRadius:"50%",background:"none",border:"none",color:"var(--sub)",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.dots}</button>
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
              style={{width:44,height:44,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",
                fontSize:22,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:ACC_GLOW||((!_lite&&iconAccent==="orange")?"0 1px 5px rgba(239,108,0,.3)":"none")}}>{IC.plus}</button>
            {plusMenu&&<div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)"}}>
              <DropMenu onClose={()=>setPlusMenu(false)}
              style={{position:"relative",transformOrigin:"bottom center"}}
              items={[
                {ic:IC.fFolder,label:"Новая категория",fn:()=>setModal("mkF")},
                {ic:IC.fNote,label:"Новая тема",fn:()=>setModal("mkS")},
              ]}/></div>}
          </div>
        </div>
      )}

      {/* Верхняя панель действий — заменяет контекстное меню */}
      {/* Chat search bar */}
      {/* ═══ CHAT ═══ */}
      {scr==="chat"&&subf&&(<>
        {/* Фиксированная панель вставки/перемещения — всегда сверху до завершения выбора */}
        {clipboard&&(
          <div style={{background:"var(--row2)",borderBottom:"1px solid var(--gline,var(--line))",padding:"10px 14px",
            display:"flex",alignItems:"center",gap:10,flexShrink:0,zIndex:30}}>
            <span style={{fontSize:14,color:"var(--sub)",flex:1}}>
              {clipboard.mode==="cut"?"Сообщение вырезано":"Сообщение скопировано"}
            </span>
            <button onClick={pasteMsg}
              style={{background:"var(--acc)",border:"none",borderRadius:8,padding:"7px 14px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>Вставить</button>
            <button onClick={()=>{ if(clipboard.mode==="cut") cancelCut(); else setClipboard(null); }}
              style={{background:"var(--barActive)",border:"none",borderRadius:8,padding:"7px 12px",color:"var(--sub)",cursor:"pointer",fontSize:13}}>Отмена</button>
          </div>
        )}
        <div ref={scrollRef} onScroll={()=>{ updateActiveNote(); if(msgPop) setMsgPop(null); }} className={(noScrAnim||navTick===0)?undefined:"scrAnim"} key={noScrAnim?"scr-chat-"+sid:"scr-chat-"+sid+"-"+navTick}
          style={{flex:1,overflowY:"auto",padding:"10px 10px 6px 4px",display:"flex",flexDirection:"column",gap:"0.4px",animationDuration:spd("scr",0.6)+"s",opacity:(booting&&navTick===0)?0:1}}
          onClick={(e)=>{ setNoteCtx(null); const el=e.target&&e.target.closest&&e.target.closest("[data-imgsrc]"); if(el && !(multiSelect.length>0||selectMode)){ const src=el.getAttribute("data-imgsrc"); if(src) setLightbox(src); } }}>
          {snotes.length===0&&<div style={{textAlign:"center",color:"var(--sub)",marginTop:40,fontSize:14}}>Напишите первую заметку ↓</div>}

          {snotes.map(n=>{
            const isMulti = multiSelect.includes(n.id); // выбран в мультивыделении
            const multiActive = multiSelect.length>0;   // активен режим выделения
            const selActive = selectMode===n.id;        // текст этого пузыря выделяем
            return (
            <div key={n.id}
              ref={el=>{ bubbleEls.current[n.id]=el; if(n.pinned)pinRef.current=el; }}
              data-noteid={n.id} className={"nb"+(((destroying===n.id||destroyIds.includes(n.id))&&!noDelAnim)?" destroying":"")+(justSent===n.id?" msgInUp":"")}
              style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:0,pointerEvents:(destroying===n.id||destroyIds.includes(n.id))?"none":"auto"}}>
              {n.pinned&&<div style={{fontSize:11,color:"var(--acc)",marginBottom:2,paddingRight:2,display:"flex",alignItems:"center",gap:4}}><span style={{display:"flex",transform:"scale(.62)",margin:"-3px"}}>{IC.pin}</span>закреплено</div>}

              <div onClick={(e)=>{ if(e.target!==e.currentTarget) return;
                  if(justEnteredSel.current===n.id){ return; }
                  const inSel = (multiSelect.length>0)||selectMode;
                  if(inSel){ toggleSel(n); }
                }}
                onTouchStart={multiActive?undefined:(e=>{ if(!selActive && !(selectMode&&selectMode!==n.id)) bubbleLpStart(n,e); })}
                onTouchMove={multiActive?undefined:(e=>{ bubbleLpMove(e); })}
                onTouchEnd={multiActive?undefined:(e=>{ if(!selActive) bubbleLpEnd(n,e); })}
                style={{display:"flex",justifyContent:"flex-end",width:"calc(100% + 14px)",position:"relative",
                  background:(isMulti||selActive)?(_lite?"rgba(47,128,237,.12)":"rgba(239,108,0,.13)"):"transparent",
                  padding:"0.8px 10px 0.8px 4px",margin:"0 -10px 0 -4px",boxSizing:"border-box"}}>
                <div style={{position:"relative",display:"inline-flex",maxWidth:"calc(100% - 8px)"}}>
                {/* Пузырь */}
                <div
                  onClick={e=>{
                    if(justEnteredSel.current===n.id){ e.stopPropagation(); return; } // хвостовой клик после входа в выделение
                    if(multiActive){ e.stopPropagation(); toggleSel(n); return; }
                    if(selectMode && selectMode!==n.id){ e.stopPropagation(); toggleSel(n); return; }
                    if(selActive){ // одиночный тап по выделенному → снять выделение (даже если был выделен текст)
                      e.stopPropagation();
                      if(textArmed){ setTextArmed(false); try{window.getSelection&&window.getSelection().removeAllRanges();}catch{} }
                      setSelectMode(null);
                      return;
                    }
                    if(imgSel.length>0){ return; }
                    // тап по изображению → открыть его (даже если в сообщении есть текст)
                    { const it=e.target&&e.target.closest&&e.target.closest("[data-imgsrc]"); if(it){ const src=it.getAttribute("data-imgsrc"); if(src){ e.stopPropagation(); setLightbox(src); return; } } }
                    // popup только для текстовых сообщений (не для аудио/изображений)
                    if(!(n.text && n.text.trim())){ return; }
                    // одиночный тап вне выделения → popup копировать/редактировать в точке клика
                    e.stopPropagation();
                    if(popupJustClosed.current && Date.now()-popupJustClosed.current<350){ popupJustClosed.current=0; return; }
                    if(msgPop && msgPop.id===n.id){ setMsgPop(null); return; }
                    setMsgPop({ id:n.id, x:e.clientX||0, y:(e.clientY||0)-54 });
                  }}
                  onTouchStart={multiActive?undefined:(e=>{ if(selActive){ clearTimeout(lpTimer.current); lpTimer.current=setTimeout(()=>{ setTextArmed(true); buzz(10); },350); } else bubbleLpStart(n,e); })}
                  onTouchMove={multiActive?undefined:(e=>{ bubbleLpMove(e); })}
                  onTouchEnd={multiActive?undefined:(e=>{ if(selActive){ clearTimeout(lpTimer.current); } else bubbleLpEnd(n,e); })}
                  onMouseDown={(selectMode||multiActive)?undefined:(e=>bubbleLpStart(n,e))}
                  onMouseMove={(selectMode||multiActive)?undefined:bubbleLpMove}
                  onMouseUp={(selectMode||multiActive)?undefined:(e=>bubbleLpEnd(n,e))}
                  onContextMenu={e=>{ e.preventDefault(); }}
                  style={{background:highlightId===n.id?(_lite?"var(--barActive)":"#52401F"):editId===n.id?"var(--bar)":isMulti?"var(--barActive)":selActive?"var(--barActive)":"var(--bar)",
                    borderRadius:"16px 4px 16px 16px",padding:(!n.text&&n.attachments&&n.attachments.length===1&&(n.attachments[0].voice||n.attachments[0].type?.startsWith("image/")))?"3px":"6px 14px 4px",
                    maxWidth:"100%",minWidth:0,cursor:multiActive?"pointer":"default",opacity:editId===n.id?.5:1,
                    border:(highlightId===n.id)?"1px solid var(--gold)":(selActive||isMulti)?"1px solid var(--acc)":"1px solid transparent",
                    boxShadow:highlightId===n.id?"0 0 0 2px rgba(245,166,35,.45), 0 0 18px rgba(245,166,35,.35)":"none",
                    transition:"border .5s ease, background .5s ease, box-shadow .5s ease"}}>
                  {editId===n.id&&<div style={{fontSize:10.5,color:"var(--acc)",fontWeight:600,marginBottom:3,opacity:1}}>Редактируется вами…</div>}
                  {n.text&&n.checklist&&n.checklist.length>0&&(
                    <div className={((selActive&&textArmed)||multiActive)?"selectable":undefined}
                      style={{fontSize:15,lineHeight:1.4,color:"var(--ink,var(--txt))",whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"var(--font-msg)",marginBottom:4,fontWeight:400,
                      userSelect:((selActive&&textArmed)||multiActive)?"text":"none",WebkitUserSelect:((selActive&&textArmed)||multiActive)?"text":"none"}}>
                      <RichText text={n.text} color={subColor} onLinkMenu={handleLinkMenu} highlight={chatSearch}/>
                    </div>
                  )}
                  {n.clTitle&&n.checklist&&n.checklist.length>0&&(
                    <div style={{fontSize:16,fontWeight:700,color:"var(--ink,var(--txt))",marginBottom:4,wordBreak:"break-word",fontFamily:"var(--font-msg)"}}>{n.clTitle}</div>
                  )}
                  {n.checklist&&n.checklist.length>0&&(
                    <div style={{margin:"2px 0 4px"}}>
                      {n.checklist.map(it=>(
                        <div key={it.id} style={{display:"flex",alignItems:"center",gap:8,padding:"2px 0",opacity:it.checked?.55:1}}>
                          <span style={{width:20,height:20,flexShrink:0,borderRadius:6,border:"2px solid "+(it.checked?"var(--acc)":"var(--sub3)"),background:it.checked?"var(--acc)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            {it.checked&&<span style={{display:"flex",transform:"scale(.65)",color:"#fff"}}>{IC.check}</span>}</span>
                          <span style={{fontSize:15,color:it.checked?"var(--sub2)":"var(--txt)",textDecoration:it.checked?"line-through":"none",fontFamily:"var(--font-msg)",wordBreak:"break-word"}}>{it.text}</span>
                        </div>
                      ))}
                      <button onClick={e=>{ e.stopPropagation(); setListMode({fid,sid,id:n.id}); }}
                        style={{marginTop:8,width:"100%",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6,background:"transparent",border:"none",borderTop:"1px solid var(--gline,var(--line))",borderRadius:0,padding:"10px 2px 2px",color:"var(--acc)",fontSize:13,fontWeight:600,cursor:"pointer",letterSpacing:.2}}>
                        Открыть список <span style={{display:"flex",transform:"scale(.7)"}}>{IC.arrRight}</span></button>
                    </div>
                  )}
                  {n.text&&!(n.checklist&&n.checklist.length>0)&&(n.capPos||"top")==="top"&&(
                    <div className={((selActive&&textArmed)||multiActive)?"selectable":undefined}
                      style={{fontSize:15,lineHeight:1.4,color:"var(--ink,var(--txt))",whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"var(--font-msg)",
                      userSelect:((selActive&&textArmed)||multiActive)?"text":"none",WebkitUserSelect:((selActive&&textArmed)||multiActive)?"text":"none"}}>
                      <RichText text={n.text} color={subColor} onLinkMenu={handleLinkMenu} highlight={chatSearch}/>
                    </div>
                  )}
                  {(()=>{
                    const atts=n.attachments||[];
                    const imgs=atts.filter(a=>a.dataUrl&&a.type?.startsWith("image/"));
                    const others=atts.filter(a=>!(a.dataUrl&&a.type?.startsWith("image/")));
                    const noteImgSelActive = imgSel.some(k=>k.startsWith(n.id+"|"));
                    const inSel=multiActive||selActive||noteImgSelActive;
                    return (<>
                      {imgs.length>=2 ? (
                        <div style={{display:"grid",gridTemplateColumns:imgs.length===2?"repeat(2,1fr)":"repeat(3,1fr)",gap:3,marginTop:0,width:imgs.length===2?180:210,maxWidth:"100%"}}>
                          {imgs.map(a=>{
                            const key=n.id+"|"+a.id;
                            const noteHasImgSel = imgSel.some(k=>k.startsWith(n.id+"|"));
                            const picked = noteHasImgSel ? imgSel.includes(key) : inSel; // если по картинкам не выбирали — выделены все (как выделено сообщение)
                            return (
                            <div key={a.id} data-imgsrc={inSel?undefined:a.dataUrl}
                              onClick={inSel?(e=>{ e.stopPropagation(); if(noteHasImgSel) toggleImgSel(n.id,a.id); }):undefined}
                              onTouchStart={e=>{ e.stopPropagation(); tileMoved.current=false; const tt=e.touches[0]; const sx=tt.clientX,sy=tt.clientY; clearTimeout(tileLp.current);
                                tileLp.current=setTimeout(()=>{ if(tileMoved.current)return; buzz(12); setSelectMode(null); setMultiSelect([]); setImgSel([key]); },380); }}
                              onTouchMove={e=>{ tileMoved.current=true; clearTimeout(tileLp.current); }}
                              onTouchEnd={e=>{ e.stopPropagation(); clearTimeout(tileLp.current); }}
                              style={{position:"relative",aspectRatio:"1 / 1",borderRadius:7,overflow:"hidden",cursor:"pointer",
                                outline:(inSel&&picked)?"2px solid var(--acc)":"none",outlineOffset:"-2px"}}>
                              <img src={a.dataUrl} alt={a.name} draggable={false} style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}}/>
                              {inSel&&<div style={{position:"absolute",top:4,right:4,width:18,height:18,borderRadius:"50%",
                                background:picked?"var(--acc)":"rgba(0,0,0,.45)",border:"1.5px solid #fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                {picked&&<span style={{display:"flex",transform:"scale(.55)",color:"#fff"}}>{IC.check}</span>}</div>}
                            </div>
                            );
                          })}
                        </div>
                      ) : imgs.map(a=><AttBubble key={a.id} att={a} onOpen={setLightbox} stamp={(n.text&&n.text.trim())?null:(n.ts?fmtStamp(n.ts):n.time)} selecting={inSel}/>)}
                      {others.map(a=><AttBubble key={a.id} att={a} onOpen={setLightbox} stamp={(n.text&&n.text.trim())?null:(n.ts?fmtStamp(n.ts):n.time)} selecting={inSel}/>)}
                    </>);
                  })()}
                  {n.text&&!(n.checklist&&n.checklist.length>0)&&n.capPos==="bottom"&&(
                    <div className={((selActive&&textArmed)||multiActive)?"selectable":undefined}
                      style={{fontSize:15,lineHeight:1.4,color:"var(--ink,var(--txt))",whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"var(--font-msg)",marginTop:4,
                      userSelect:((selActive&&textArmed)||multiActive)?"text":"none",WebkitUserSelect:((selActive&&textArmed)||multiActive)?"text":"none"}}>
                      <RichText text={n.text} color={subColor} onLinkMenu={handleLinkMenu} highlight={chatSearch}/>
                    </div>
                  )}
                  {!(!n.text&&n.attachments&&n.attachments.length===1&&(n.attachments[0].voice||n.attachments[0].type?.startsWith("image/")))&&(
                  <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:4,marginTop:1}}>
                    <span style={{fontSize:8.5,color:"var(--sub)",userSelect:"none",WebkitUserSelect:"none",pointerEvents:"none"}}>{n.ts?fmtStamp(n.ts):n.time}</span>
                  </div>
                  )}
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
          <div style={{background:"var(--bar)",borderTop:"1px solid var(--gline,var(--line))",
            padding:"8px 12px",display:"flex",gap:8,flexWrap:"wrap",flexShrink:0}}>
            {patts.map(a=>(
              <div key={a.id} style={{background:"var(--bar)",borderRadius:10,
                padding:"5px 8px",display:"flex",alignItems:"center",gap:5,maxWidth:150}}>
                <span style={{color:"var(--acc)",display:"flex"}}>{ficon(a.type)}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:11,color:"var(--ink2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                  {a.caption&&<div style={{fontSize:10,color:"var(--sub)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.caption}</div>}
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
            onTouchEnd={e=>{ const s=swipeRef.current; if(!s){return;} const t=e.changedTouches[0]; const dx=t.clientX-s.x, dy=t.clientY-s.y; if(dx>70 && Math.abs(dx)>Math.abs(dy)*1.3){ setComposerPeek(true); const pl=prevLoc.current; if(pl){ prevLoc.current=null; setScr(pl.scr); setFid(pl.fid); setSid(pl.sid); } } swipeRef.current=null; }}
            style={{position:"fixed",top:0,bottom:0,left:0,right:0,background:"var(--bg)",zIndex:400,display:"flex",flexDirection:"column",
              transform: composerPeek?"translateX(101%)":"translateX(0)",
              transition: noInputAnim ? "none" : ("transform "+spd("input",0.5)+"s cubic-bezier(.32,.72,0,1)"),
              pointerEvents:composerPeek?"none":"auto",
              boxShadow:"0 -12px 30px rgba(0,0,0,.5)"}}>
            {/* Козырёк с названием темы убран */}
            {/* Прикреплённые файлы в наборе */}
            {patts.length>0&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap",padding:"10px 12px",borderBottom:"1px solid var(--gline2,var(--bar))",flexShrink:0}}>
                {patts.map(a=>(
                  <div key={a.id} style={{position:"relative",borderRadius:10,overflow:"hidden",background:"var(--row2)",border:"1px solid var(--gline,var(--line))"}}>
                    {a.type&&a.type.startsWith("image/")
                      ? <img src={a.dataUrl} alt="" style={{width:72,height:72,objectFit:"cover",display:"block"}}/>
                      : <div style={{width:120,height:72,display:"flex",alignItems:"center",gap:6,padding:"0 10px"}}>
                          <span style={{color:"var(--acc)",display:"flex"}}>{ficon(a.type)}</span>
                          <span style={{fontSize:11,color:"var(--ink2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</span>
                        </div>}
                    <button onClick={()=>rmPatt(a.id)}
                      style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,.6)",border:"none",borderRadius:"50%",
                        width:20,height:20,color:"#fff",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                  </div>
                ))}
              </div>
            )}
            {/* Текст + список как одно сообщение, прижато вниз */}
            <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:checklist?"flex-start":"flex-end",overflowY:"auto"}}>
            <textarea value={note} className="editor-ta"
              onKeyDown={e=>{ if(e.key==="Enter" && !checklist){ const el=e.target; const pos=el.selectionStart; const before=el.value.slice(0,pos); const after=el.value.slice(pos); const lineStart=before.lastIndexOf("\n")+1; const curLine=before.slice(lineStart); if(/^•\s/.test(curLine)){ if(curLine.trim()==="•"){ e.preventDefault(); const ns=el.value.slice(0,lineStart)+el.value.slice(pos); setNote(ns); requestAnimationFrame(()=>{ try{el.selectionStart=el.selectionEnd=lineStart; el.scrollTop=el.scrollHeight;}catch{} }); return; } e.preventDefault(); const nextLineMatch=after.match(/^(\n)(•\s)/); if(nextLineMatch){ const newPos=pos+2; requestAnimationFrame(()=>{ try{el.selectionStart=el.selectionEnd=newPos+1; el.scrollTop=el.scrollHeight;}catch{} }); return; } const ins="\n• "; const ns=el.value.slice(0,pos)+ins+el.value.slice(pos); setNote(ns); requestAnimationFrame(()=>{ try{el.selectionStart=el.selectionEnd=pos+ins.length; el.blur(); el.focus(); el.setSelectionRange(pos+ins.length,pos+ins.length); el.scrollTop=el.scrollHeight;}catch{} }); } } }}
              onChange={e=>{ let v=e.target.value; if(checklist){ const el=e.target; el.style.height="auto"; el.style.height=el.scrollHeight+"px"; } const m=v.match(/(^|\n)(--|—|——)$/); if(!checklist && m){ const base=v.slice(0, v.length-m[2].length).replace(/\n$/,""); setNote(base); const nid=uid("cl"); setChecklist([{id:nid,text:"",checked:false}]); setClEditId(nid); const foc=()=>{ const f=clItemRefs.current[nid]; if(f){ f.focus(); } else requestAnimationFrame(foc); }; requestAnimationFrame(foc); return; } v=v.replace(/(^|\n)- /g,"$1• "); setNote(v); }}
              onSelect={e=>{ fmtSel.current={s:e.target.selectionStart,e:e.target.selectionEnd}; }}
              onKeyUp={e=>{ fmtSel.current={s:e.target.selectionStart,e:e.target.selectionEnd}; }}
              onMouseUp={e=>{ fmtSel.current={s:e.target.selectionStart,e:e.target.selectionEnd}; }}
              onBlur={e=>{ fmtSel.current={s:e.target.selectionStart,e:e.target.selectionEnd}; }}
              onTouchEnd={e=>{ const t=e.target; setTimeout(()=>{ try{fmtSel.current={s:t.selectionStart,e:t.selectionEnd};}catch{} },0); }}
              ref={el=>{ fullTaRef.current=el; if(el){ if(checklist){ el.style.height="auto"; el.style.height=el.scrollHeight+"px"; } if(composerWantFocus.current){ composerWantFocus.current=false; try{ el.focus(); const L=el.value.length; el.setSelectionRange(L,L); }catch{} } } }}
              placeholder={editId?"Редактировать сообщение...":"Текст сообщения..."}
              style={{flex:checklist?"0 0 auto":1,width:"100%",background:"var(--bg)",border:"none",outline:"none",
                color:"var(--ink,var(--txt))",fontSize:16,lineHeight:1.5,fontWeight:400,padding:checklist?(note?"12px 16px 2px":"0 16px"):"16px 16px",resize:"none",fontFamily:"var(--font-input)",height:checklist&&!note?0:undefined,minHeight:checklist&&!note?0:undefined,
                boxSizing:"border-box",overflowY:checklist?"hidden":"auto",WebkitTapHighlightColor:"transparent",WebkitTouchCallout:"none",caretColor:"var(--acc)",
                WebkitAppearance:"none",appearance:"none",boxShadow:"none"}}/>
            {checklist && (
              <input value={clTitle} onChange={e=>setClTitle(e.target.value)} placeholder="Заголовок (необязательно)"
                style={{width:"100%",boxSizing:"border-box",background:"transparent",border:"none",outline:"none",color:"var(--ink,var(--txt))",fontSize:17,fontWeight:700,fontFamily:"var(--font-input)",padding:"6px 16px 4px"}}/>
            )}
            {checklist && (
              <div onTouchMove={clRowTouchMove} onTouchEnd={clRowTouchEnd} style={{padding:"2px 8px 12px",flexShrink:0}}>
                {checklist.map((it,idx)=>(
                  <div key={it.id} data-clid={it.id} data-dragging={clDragId===it.id?"1":"0"}
                    onTouchStart={e=>{ clRowTouchStart(idx,e); }}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"1px 0",touchAction:clDragId===it.id?"none":"auto",
                    transform: clDragId===it.id?`translateY(${clDragOff}px) scale(1.04)`:"none",
                    transition: clDragId===it.id?"box-shadow .18s ease, background .15s ease":"transform .42s cubic-bezier(.16,1,.3,1), background .15s ease",
                    position:"relative", zIndex:clDragId===it.id?30:1,
                    background:clDragId===it.id?"var(--barActive)":"transparent",borderRadius:8,
                    boxShadow:clDragId===it.id?"0 14px 32px rgba(0,0,0,.6)":"none"}}>
                    <button onClick={()=>toggleClItem(idx)}
                      style={{flexShrink:0,padding:"8px 6px 8px 4px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{width:22,height:22,borderRadius:6,border:"2px solid "+(it.checked?"var(--acc)":"var(--sub3)"),background:it.checked?"var(--acc)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {it.checked&&<span className="checkPop" style={{display:"flex",transform:"scale(.7)",color:"#fff"}}>{IC.check}</span>}</span></button>
                    <input value={it.text} readOnly={clEditId!==it.id}
                      ref={el=>{ if(el) clItemRefs.current[it.id]=el; }}
                      onBlur={()=>{ if(clEditId===it.id) setClEditId(null); }}
                      onChange={e=>setChecklist(cl=>cl.map((x,i)=>i===idx?{...x,text:e.target.value}:x))}
                      onKeyDown={e=>{
                        if(e.key==="Enter"){ e.preventDefault(); const nid=uid("cl"); setChecklist(cl=>{ const a=[...cl]; a.splice(idx+1,0,{id:nid,text:"",checked:false}); return a; }); setClEditId(nid); const foc=()=>{ const f=clItemRefs.current[nid]; if(f) f.focus(); else requestAnimationFrame(foc); }; requestAnimationFrame(foc); }
                        else if(e.key==="Backspace" && it.text===""){ e.preventDefault();
                          if(checklist.length===1){ setChecklist(null); setTimeout(()=>{ try{fullTaRef.current&&fullTaRef.current.focus();}catch{} },30); }
                          else { setChecklist(cl=>cl.filter((_,i)=>i!==idx)); const prev=checklist[idx-1]; if(prev) setTimeout(()=>{ const f=clItemRefs.current[prev.id]; if(f){f.focus(); const L=f.value.length; f.setSelectionRange(L,L);} },30); }
                        }
                      }}
                      placeholder="Пункт списка"
                      style={{flex:1,background:"transparent",border:"none",outline:"none",color:it.checked?"var(--sub2)":"var(--txt)",fontSize:16,fontFamily:"var(--font-input)",textDecoration:it.checked?"line-through":"none",padding:"6px 0"}}/>
                  </div>
                ))}
              </div>
            )}
            {!checklist && !note && (
              <div style={{textAlign:"center",fontSize:12,color:"var(--sub3)",padding:"0 0 10px",pointerEvents:"none"}}>Двойное тире — для создания списка</div>
            )}
            </div>
            {/* Всплывающая панель ББ-кодов */}
            {fullFmt&&(
              <div style={{position:"absolute",left:10,bottom:54,background:"var(--bar)",borderRadius:12,padding:"5px 6px",
                display:"flex",gap:2,flexWrap:"wrap",maxWidth:"calc(100vw - 20px)",boxShadow:"0 6px 24px rgba(0,0,0,.6)",border:"1px solid var(--gline,var(--line))",zIndex:6}}>
                {[
                  {ic:<Icon size={18} d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" stroke={2} />, b:"[b]",a:"[/b]",x:"текст",t:"Жирный"},
                  {ic:<Icon size={18} d={["M15 5h-5","M14 19H9","M14 5l-4 14"]} stroke={2} />, b:"[i]",a:"[/i]",x:"текст",t:"Курсив"},
                  {ic:<Icon size={18} d={["M5 12h14","M8 8a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3","M16 16a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3"]} stroke={2} />, b:"[s]",a:"[/s]",x:"текст",t:"Зачёркнутый"},
                  {ic:<Icon size={18} d={["M9 8l-4 4 4 4","M15 8l4 4-4 4"]} stroke={2} />, b:"[code]",a:"[/code]",x:"код",t:"Моноширинный"},
                  {ic:<Icon size={18} d={["M3 3l18 18","M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.4","M9.9 9.9a3 3 0 0 0 4.2 4.2"]} stroke={2} />, b:"[spoiler]",a:"[/spoiler]",x:"текст",t:"Спойлер"},
                  {ic:<Icon size={18} d={["M7 7h4v5a4 4 0 0 1-4 4","M14 7h4v5a4 4 0 0 1-4 4"]} stroke={2} />, b:"[q]",a:"[/q]",x:"цитата",t:"Цитата"},
                  {ic:<Icon size={18} d={["M9 15l6-6","M10 7l1-1a3.5 3.5 0 0 1 5 5l-1 1","M14 17l-1 1a3.5 3.5 0 0 1-5-5l1-1"]} stroke={2} />, link:true,x:"ссылка",t:"Ссылка"},
                ].map((it,i)=>(
                  <button key={i} title={it.t||""} onPointerDown={e=>e.preventDefault()}
                    onClick={()=>{ const el=fullTaRef.current; if(!el)return; let s=el.selectionStart,e2=el.selectionEnd; if(s===e2 && lastSel.current && lastSel.current.s!==lastSel.current.e){ s=lastSel.current.s; e2=lastSel.current.e; } const sel=note.slice(s,e2)||it.x;
                      if(it.link){ const ins="["+sel+"](https://)"; setNote(note.slice(0,s)+ins+note.slice(e2)); lastSel.current=null; setFullFmt(false); setTimeout(()=>{ el.focus(); const urlPos=s+sel.length+3+("https://").length; el.setSelectionRange(urlPos,urlPos); },0); return; }
                      setNote(note.slice(0,s)+it.b+sel+it.a+note.slice(e2)); lastSel.current=null; setFullFmt(false); setTimeout(()=>{ el.focus(); const p=s+it.b.length+sel.length+it.a.length; el.setSelectionRange(p,p); },0); }}
                    style={{background:"var(--row2)",border:"none",borderRadius:8,width:38,height:38,cursor:"pointer",color:"var(--ink,var(--txt))",display:"flex",alignItems:"center",justifyContent:"center"}}>{it.ic}</button>
                ))}
              </div>
            )}
            {/* Нижняя панель инструментов */}
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"0 12px",border:"1px solid var(--gline,var(--line))",background:"var(--bar)",flexShrink:0,height:52,borderRadius:"16px 16px 0 0",boxShadow:"0 4px 16px rgba(0,0,0,.35)",width:"calc(100% - 2px)",margin:"0 1px"}}>
              <div role="button" onPointerDown={e=>e.preventDefault()} onClick={()=>setFullFmt(v=>!v)} title="Форматирование"
                style={{width:38,height:38,borderRadius:"50%",background:fullFmt?"var(--acc)":"var(--row2)",cursor:"pointer",
                  color:fullFmt?"#fff":"var(--sub)",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>BB</div>
              <div role="button" onPointerDown={e=>e.preventDefault()} onClick={undoNote} title="Отменить"
                style={{width:38,height:38,borderRadius:"50%",background:"var(--row2)",cursor:"pointer",color:"var(--sub)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{display:"flex",transform:"scale(.8)"}}>{IC.undo}</span></div>
              <div role="button" onPointerDown={e=>e.preventDefault()} onClick={redoNote} title="Вернуть"
                style={{width:38,height:38,borderRadius:"50%",background:"var(--row2)",cursor:"pointer",color:"var(--sub)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{display:"flex",transform:"scale(.8)"}}>{IC.redo}</span></div>
              <div role="button" onClick={()=>setPrevSh(true)} title="Предпросмотр"
                style={{width:38,height:38,borderRadius:"50%",background:"var(--row2)",cursor:"pointer",color:"var(--sub)",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.eye}</div>
              {patts.some(a=>a.dataUrl&&a.type?.startsWith("image/")) && (
                <div role="button" onPointerDown={()=>suppressKb()} onClick={()=>setCapPos(p=>p==="top"?"bottom":"top")} title={capPos==="top"?"Подпись сверху (нажмите — будет снизу)":"Подпись снизу (нажмите — будет сверху)"}
                  style={{width:38,height:38,borderRadius:"50%",background:"var(--row2)",cursor:"pointer",color:"var(--acc)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    {capPos==="top"
                      ? <><rect x="4" y="4" width="16" height="3.2" rx="1" fill="currentColor"/><rect x="4" y="9" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="13.5" r="1.4" fill="currentColor"/><path d="M7 18l3-3 3 2.5 2-1.8 2 2.3" stroke="currentColor" strokeWidth="1.6" fill="none"/></>
                      : <><rect x="4" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="8.5" r="1.4" fill="currentColor"/><path d="M7 13l3-3 3 2.5 2-1.8 2 2.3" stroke="currentColor" strokeWidth="1.6" fill="none"/><rect x="4" y="16.8" width="16" height="3.2" rx="1" fill="currentColor"/></>}
                  </svg>
                </div>
              )}
              <div style={{flex:1}}/>
              <div role="button" onPointerDown={e=>e.preventDefault()} onClick={()=>setAttSh(true)} title="Прикрепить"
                style={{width:38,height:38,borderRadius:"50%",background:"none",cursor:"pointer",color:"var(--sub)",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:3}}>{IC.clip}</div>
              <div role="button" onClick={closeComposer} title="Отменить"
                style={{width:38,height:38,borderRadius:"50%",background:"none",cursor:"pointer",color:"var(--sub)",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:3}}>{IC.close}</div>
              <div ref={sendBtnRef} role="button" onClick={composerCommit} title={editId?"Сохранить":"Отправить"}
                    style={{width:44,height:44,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,cursor:"pointer",marginLeft:3,
                      color:ACC_FG,display:"flex",alignItems:"center",justifyContent:"center",opacity:planePhase==='in'?0:1,boxShadow:ACC_GLOW||((!_lite&&iconAccent==="orange")?"0 2px 10px rgba(239,108,0,.4)":"none")}}><span style={{display:"flex",transform:"scale(.9) rotate(90deg)"}}>{IC.send}</span></div>
            </div>
            {/* Подтверждение отправки голосового */}
            {pendingVoice && (
              <div style={{position:"absolute",left:0,right:0,bottom:0,background:"var(--bar)",borderTop:"1px solid var(--gline,var(--line))",
                padding:"12px 14px",zIndex:24,display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:13,color:"var(--sub)"}}>Голосовое сообщение · {fmtRec(pendingVoice.att.dur||0)}</div>
                <div style={{display:"flex",justifyContent:"center"}}><div style={{transform:"translateX(80px)"}}><VoiceMessage att={pendingVoice.att} /></div></div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={discardPendingVoice}
                    style={{flex:1,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:10,padding:"11px",color:"var(--sub)",cursor:"pointer",fontSize:14}}>Отмена</button>
                  <button onClick={sendPendingVoice}
                    style={{flex:1,background:"var(--acc)",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>Отправить</button>
                </div>
              </div>
            )}
            {/* Оверлей записи голосового (только в редакторе) */}
            {recording && composerFull && (
              <div style={{position:"absolute",left:1,right:1,bottom:0,padding:"0 12px",background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",height:52,display:"flex",alignItems:"center",gap:12,boxShadow:"0 4px 16px rgba(0,0,0,.35)",zIndex:20}}>
                <span style={{width:11,height:11,borderRadius:"50%",background:"#E05252",animation:"pulse 1s infinite",flexShrink:0}}/>
                <span style={{fontSize:15,color:"var(--ink,var(--txt))",fontVariantNumeric:"tabular-nums"}}>{fmtRec(recSec)}</span>
                <span style={{flex:1,fontSize:13,textAlign:"center",color:recSlide>60?"#E05252":"var(--sub2)",transform:`translateX(${-Math.min(recSlide,120)*0.5}px)`}}>{recSlide>60?"Отпустите для отмены":"← смахните влево для отмены"}</span>
              </div>
            )}
            {/* Кастомная панель выделения: копировать/вставить/вырезать или выбрать всё/вставить */}
            {selBar&&(
              <div data-selbar="1"
                onClick={e=>e.stopPropagation()}
                onTouchStart={e=>{ e.stopPropagation(); swipeRef.current=null; const t=e.touches[0]; selBar._d={dx:t.clientX-selBar.x,dy:t.clientY-selBar.y}; }}
                onTouchMove={e=>{ e.stopPropagation(); e.preventDefault(); const t=e.touches[0]; const d=selBar._d||{dx:0,dy:0}; const w=selBar.hasSel?250:200,pad=10; const nx=Math.max(pad+w/2,Math.min(window.innerWidth-pad-w/2,t.clientX-d.dx)); const ny=Math.max(72,Math.min(window.innerHeight-70,t.clientY-d.dy)); setSelBar(s=>s?{...s,x:nx,y:ny,_d:d}:s); }}
                style={{position:"fixed",left:selBar.x,top:selBar.y,transform:"translateX(-50%)",zIndex:520,
                  background:"rgba(36,28,22,.96)",border:"1px solid var(--gline,var(--line))",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,.45)",
                  display:"flex",overflow:"hidden",animation:"fS .1s ease",backdropFilter:"blur(2px)"}}>
                {(selBar.hasSel
                  ? [{l:"Копировать",fn:tbCopy},{l:"Вырезать",fn:tbCut},{l:"Вставить",fn:tbPaste}]
                  : [{l:"Выбрать всё",fn:tbAll},{l:"Вставить",fn:tbPaste}]
                ).map((b,i)=>(
                  <button key={i} onClick={b.fn} onTouchStart={e=>e.stopPropagation()} style={{background:"none",border:"none",color:"var(--ink2)",fontSize:12.5,
                    padding:"8px 13px",cursor:"pointer",borderLeft:i?"1px solid var(--gline,var(--line))":"none",whiteSpace:"nowrap"}}>{b.l}</button>
                ))}
              </div>
            )}
          </div>
        )}

      {scr==="chat"&&(multiSelect.length>0||selectMode)&&(()=>{
        const single = !multiSelect.length && selectMode;
        const selNote = single ? subf?.notes.find(x=>x.id===selectMode) : null;
        const closePanel = ()=>{ if(single){ setSelectMode(null); setTextArmed(false); } else clearMulti(); };
        return (
        <div style={{background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 0 0",padding:"0 12px",height:52,boxShadow:"0 4px 16px rgba(0,0,0,.35)",
          display:"flex",alignItems:"center",gap:6,flexShrink:0,overflowX:"auto"}}>
          <button onClick={closePanel} title="Отмена"
            style={{width:42,height:42,borderRadius:"50%",flexShrink:0,background:"none",border:"none",color:"var(--ink,var(--txt))",marginRight:2,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.close}</button>
          <span style={{flex:1,fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>{single?"1":multiSelect.length}</span>
          {/* Закрепить / Открепить */}
          {single&&(
            <button onClick={()=>{ if(selNote){pin(selNote.id);} closePanel(); }} title={selNote?.pinned?"Открепить":"Закрепить"}
              style={{width:38,height:38,borderRadius:"50%",flexShrink:0,
                background:selNote?.pinned?"var(--pinbg)":"var(--row2)",border:"1px solid "+(selNote?.pinned?"var(--pinbd)":"var(--gline,var(--line))"),boxShadow:selNote?.pinned?"none":"var(--gline-glow,none)",
                color:selNote?.pinned?"var(--gold)":"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {selNote?.pinned?IC.pinOff:IC.pin}</button>
          )}
          {/* Копировать текст — одиночное или несколько */}
          {single && selNote && selNote.text && (
          <button onClick={()=>{ if(selNote)copyText(selNote); closePanel(); }} title="Копировать текст"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",boxShadow:"var(--gline-glow,none)",color:"var(--acc)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.copyT}</button>
          )}
          {!single && (
          <button onClick={()=>{ const ids=new Set(multiSelect); if(selectMode) ids.add(selectMode); const arr=(sid==="__top__"&&folder?.isTheme)?(folder.notes||[]):(subf?.notes||[]); const txt=arr.filter(n=>ids.has(n.id)&&n.text).map(n=>n.text).join("\n\n"); if(txt){ try{ navigator.clipboard?.writeText(txt); }catch{} tst("Скопировано: "+arr.filter(n=>ids.has(n.id)&&n.text).length); } closePanel(); }} title="Копировать текст"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",boxShadow:"var(--gline-glow,none)",color:"var(--acc)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.copyT}</button>
          )}
          {/* Удалить */}
          <button onClick={()=>{ if(single){ if(selNote){softDel(selNote);setSelectMode(null);} } else { deleteMulti(); } }} title="Удалить"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--barActive)",border:"1px solid #5A3A2A",color:"#E05252",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.trash}</button>
          {/* Редактировать — только для одиночного */}
          {single&&(
            <button onClick={()=>{ if(selNote){ startEdit(selNote); } setMultiSelect([]); }} title="Редактировать"
              style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",boxShadow:"var(--gline-glow,none)",color:"var(--acc)",
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.edit}</button>
          )}
          {/* Переместить в раздел (переслать) */}
          <button onClick={()=>{ if(single){ if(selNote){ setSelectMode(null); copyMulti("cut",[selNote.id]); } } else { copyMulti("cut"); } setScr("main"); }} title="Переместить в раздел"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",boxShadow:"var(--gline-glow,none)",color:"var(--acc)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.copyMsg}</button>
        </div>
        );
      })()}
      {scr==="chat" && imgSel.length>0 && (
        <div style={{background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 0 0",padding:"0 12px",height:52,boxShadow:"0 4px 16px rgba(0,0,0,.35)",
          display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          <button onClick={()=>setImgSel([])} title="Отмена"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--row2)",border:"none",color:"var(--ink,var(--txt))",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.close}</button>
          <span style={{flex:1,fontSize:14,fontWeight:600}}>{imgSel.length} фото</span>
          <button onClick={()=>{
              const sel=new Set(imgSel);
              updNotes(_n=>_n.map(n=>{
                const keep=(n.attachments||[]).filter(a=>!sel.has(n.id+"|"+a.id));
                return {...n, attachments:keep};
              }).filter(n=>(n.text&&n.text.trim())|| (n.attachments&&n.attachments.length) ));
              setImgSel([]); setSelectMode(null); setMultiSelect([]);
            }} title="Удалить выбранные фото"
            style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:"var(--row2)",border:"none",color:"#E05252",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{IC.trash}</button>
        </div>
      )}
        {!selectMode && multiSelect.length===0 && (!composerFull||composerPeek) && chatSearch!=="" && (
          <div style={{padding:"0 12px",flexShrink:0,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 1px",height:52,display:"flex",alignItems:"center",boxShadow:"0 4px 16px rgba(0,0,0,.35)",width:"calc(100% - 2px)"}}>
            <div style={{background:"var(--bg)",borderRadius:12,display:"flex",alignItems:"center",padding:"0 12px",height:40,gap:8,width:"100%"}}>
              <span style={{color:"var(--sub)",display:"flex"}}>{IC.search}</span>
              <input autoFocus value={chatSearch.trim()===""?"":chatSearch} onChange={e=>setChatSearch(e.target.value||" ")}
                placeholder="Поиск в теме..."
                style={{background:"none",border:"none",color:"var(--ink,var(--txt))",fontSize:14,flex:1}}/>
              <button onClick={()=>setChatSearch("")} style={{background:"none",border:"none",color:"var(--sub)",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
          </div>
        )}
        {!selectMode && multiSelect.length===0 && chatSearch==="" && (!composerFull||composerPeek) && (
          <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"0 12px",
            background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",margin:"0 0 0",flexShrink:0,height:52,overflow:"visible",boxShadow:"0 4px 16px rgba(0,0,0,.35)"}}>
            <div style={{minWidth:0,maxWidth:"calc(100% - 210px)",marginLeft:4,marginRight:8,overflow:"hidden",display:"flex",alignItems:"center",height:44}}>
              <div onClick={e=>{e.stopPropagation(); if(subf) setMediaBrowser(true);}} style={{cursor:"pointer",fontFamily:"var(--font-title)",fontSize:16,fontWeight:700,color:"var(--ink2,var(--txt))",whiteSpace:"nowrap",overflow:"hidden",...((subf?.name||"").length>16?{WebkitMaskImage:"linear-gradient(90deg,#000 90%,transparent 100%)",maskImage:"linear-gradient(90deg,#000 90%,transparent 100%)"}:{})}}>{(subf?.name||"Сообщение").slice(0,16)}</div>
            </div>
            <div style={{flex:1}}/>
            {/* Кнопка Написать — по центру панели; удержание = запись (та же механика, что у микрофона) */}
            <button ref={el=>{ writeBtnRef.current=el; if(el){ try{ const r=el.getBoundingClientRect(); if(r&&r.width) planeAnchor.current={cx:r.left+r.width/2, cy:r.top+r.height/2}; }catch{} } }}
              onClick={e=>{ closeAllMenus(); if(planePhase!=='idle')return; composerOrigin.current={fid,sid}; setEditId(null); composerWantFocus.current=true; setComposerFull(true); setComposerPeek(false); if(!noInputAnim){ setPlanePhase('start'); setTimeout(()=>setPlanePhase('in'),60); setTimeout(()=>setPlanePhase('idle'),650); } }}
              title="Написать"
              style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",
                width:44,height:44,borderRadius:"50%",opacity:(planePhase==='idle'&&!recording)?1:0,pointerEvents:recording?"none":"auto",
                background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",zIndex:3,
                display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s",
                boxShadow:ACC_GLOW||((!_lite&&iconAccent==="orange")?"0 1px 5px rgba(239,108,0,.3)":"none")}}>
              <span style={{display:"flex",transform:"scale(.9)"}}>{IC.sendUp}</span>
            </button>
            {/* Скрепка справа от кнопки написать — быстрый доступ к вложениям */}
            <button onClick={e=>{e.stopPropagation(); composerOrigin.current={fid,sid}; setEditId(null); setAttSh(true);}} title="Вложение"
              style={{width:32,height:32,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:ACC_GLOW||"none",opacity:recording?0:1,pointerEvents:recording?"none":"auto"}}>{IC.clip}</button>
            {/* Оверлей записи микрофоном в шапке: таймер + смахните влево для отмены */}
            {recording && (!composerFull) && (
              <div style={{position:"absolute",inset:0,background:"var(--bar)",borderRadius:"16px 16px 0 0",
                display:"flex",alignItems:"center",gap:12,padding:"0 16px",zIndex:6,pointerEvents:"none"}}>
                <span style={{width:12,height:12,borderRadius:"50%",background:"#E05252",flexShrink:0,animation:"recPulse 1s infinite"}}/>
                <span style={{fontSize:15,color:"var(--ink,var(--txt))",fontVariantNumeric:"tabular-nums",minWidth:44}}>{fmtRec(recSec)}</span>
                <span style={{flex:1,fontSize:13,color:"var(--sub)",textAlign:"center",transform:`translateX(${-recSlide}px)`,opacity:Math.max(0,1-recSlide/90)}}>← смахните влево для отмены</span>
              </div>
            )}
            {/* Поиск + ⋯ справа */}
            <button onClick={e=>{e.stopPropagation(); if(scrollRef.current) preserveScroll.current=scrollRef.current.scrollTop; setChatSearch(v=>v?"":" ");}} title="Поиск в теме"
              style={{width:32,height:32,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:ACC_GLOW||"none"}}>{IC.search}</button>
            <button onClick={back} title="Назад"
              style={{width:32,height:32,borderRadius:"50%",background:ACC,border:"1px solid "+ACC_BORDER,color:ACC_FG,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:ACC_GLOW||"none"}}>{IC.back}</button>
            <div style={{position:"relative",flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <button ref={el=>{ if(el){ try{ const r=el.getBoundingClientRect(); if(r&&r.width) micAnchor.current={cx:r.left+r.width/2, cy:r.top+r.height/2}; }catch{} } }}
                onPointerDown={e=>{ e.preventDefault(); }}
                onTouchStart={e=>{ e.preventDefault(); e.stopPropagation(); composerOrigin.current={fid,sid}; startRec(e); }}
                onTouchMove={e=>{ if(!recording)return; const dx=e.touches[0].clientX-recStartX.current; const left=Math.max(0,-dx); setRecSlide(left); if(left>120){ recCancelArm.current=true; stopRec(true); setRecSlide(0); } }}
                onTouchEnd={e=>{ e.preventDefault(); e.stopPropagation(); if(recording) stopRec(recCancelArm.current); setRecSlide(0); }}
                onMouseDown={e=>{ e.preventDefault(); composerOrigin.current={fid,sid}; startRec(e); }}
                onMouseUp={e=>{ e.preventDefault(); if(recording) stopRec(false); }}
                title="Записать голосовое"
                style={{width:44,height:44,borderRadius:"50%",background:recording?"#E05252":ACC,border:"1px solid "+(recording?"transparent":ACC_BORDER),cursor:"pointer",
                  color:recording?"#fff":ACC_FG,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:ACC_GLOW||((!_lite&&iconAccent==="orange")?"0 2px 10px rgba(239,108,0,.4)":"none"),
                  transform:recording?"scale(1.15)":"scale(1)",transition:"transform .15s ease, background .15s ease"}}>{IC.mic}</button>
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
            background:"rgba(36,28,22,.96)",color:"var(--ink2)",border:"1px solid var(--gline,var(--line))",borderRadius:10,padding:"8px 14px",
            fontSize:12.5,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.45)",backdropFilter:"blur(2px)",
            display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"flex",transform:"scale(.85)"}}>{IC.copyT}</span> Копировать
        </button>
      </>)}

      {/* ══ MODALS ══ */}
      <LinkDlg open={lnkDlg} selected={lnkSel} onClose={()=>setLnkDlg(false)} onInsert={insertLink}/>
      <PreviewModal open={prevSh} onClose={()=>setPrevSh(false)} onSend={composerCommit} text={note} atts={patts} color={subColor} isEdit={!!editId}/>
      <MediaBrowser open={mediaBrowser} onClose={()=>setMediaBrowser(false)} subf={subf} color={subColor} accent={iconAccent}
        onOpenImage={(u)=>{ setLightbox(u); }}
        onJumpTo={(id)=>{ setMediaBrowser(false); if(id) setTimeout(()=>jumpTo(id),120); }}
        onChangeIcon={()=>{ setMediaBrowser(false); setModal(sid==="__top__"?"renF":"renS"); }}
        isTopTheme={sid==="__top__"}
        onPinned={()=>{ setMediaBrowser(false); setPinnedOpen(true); }}
        onRename={()=>{ setMediaBrowser(false); setModal(sid==="__top__"?"renF":"renS"); }}
        onClear={()=>{ setMediaBrowser(false); setDlg({msg:`Очистить все сообщения в «${subf?.name}»?`,yes:()=>clearSub()}); }}
        onDelete={()=>{ setMediaBrowser(false); setDlg({msg:`Удалить «${subf?.name}»?`,yes:()=>{delF(fid);setScr("main");setSid(null);}}); }}/>
      <Sheet open={pinnedOpen} onClose={()=>setPinnedOpen(false)} title="Закреплённые сообщения">
        {(()=>{
          const pins=(subf?.notes||[]).filter(n=>n.pinned);
          if(!pins.length) return <div style={{color:"var(--sub)",fontSize:14,textAlign:"center",padding:"20px 0"}}>Нет закреплённых сообщений</div>;
          return (
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"60vh",overflowY:"auto"}}>
              {pins.map(n=>(
                <button key={n.id} onClick={()=>jumpTo(n.id)}
                  style={{textAlign:"left",background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:12,
                    padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:"var(--gold)",display:"flex",flexShrink:0}}>{IC.pin}</span>
                  <span style={{flex:1,minWidth:0}}>
                    <span style={{display:"block",color:"var(--ink,var(--txt))",fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {n.text?strip(n.text):(n.attachments?.length?"Вложение":"—")}
                    </span>
                    <span style={{display:"block",color:"var(--sub2)",fontSize:9.5,marginTop:2}}>{n.ts?fmtStamp(n.ts):n.time}</span>
                  </span>
                </button>
              ))}
            </div>
          );
        })()}
      </Sheet>

      <Sheet open={!!capDlg} onClose={()=>setCapDlg(null)} title="💬 Подпись к файлу">
        <div style={{fontSize:13,color:"var(--sub)",marginBottom:10}}>{capDlg?.name}</div>
        <textarea value={capTx} onChange={e=>setCapTx(e.target.value)} placeholder="Добавить подпись..." rows={3}
          style={{width:"100%",background:"var(--bar)",border:"none",borderRadius:12,padding:12,
            color:"var(--ink,var(--txt))",fontSize:14,resize:"none",marginBottom:14,outline:"none"}}/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setCapDlg(null)} style={{flex:1,background:"var(--bar)",border:"none",borderRadius:12,padding:12,color:"var(--sub)",cursor:"pointer",fontSize:14}}>Пропустить</button>
          <button onClick={saveCaption} style={{flex:1,background:"var(--acc)",border:"none",borderRadius:12,padding:12,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Сохранить</button>
        </div>
      </Sheet>

      {/* Просмотр изображения на весь экран */}
      {/* Глобальное подтверждение голосового (для записи кнопкой микрофона в шапке) */}
      {pendingVoice && !composerFull && (
        <div onClick={discardPendingVoice} style={{position:"fixed",inset:0,zIndex:610,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"flex-end"}}>
          <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:"var(--bar)",borderTop:"1px solid var(--gline,var(--line))",borderRadius:"16px 16px 0 0",padding:"16px 14px",display:"flex",flexDirection:"column",gap:12,animation:"sUp .3s cubic-bezier(.2,.9,.3,1)"}}>
            <div style={{fontSize:13,color:"var(--sub)"}}>Голосовое сообщение · {fmtRec(pendingVoice.att.dur||0)}</div>
            <div style={{display:"flex",justifyContent:"center"}}><div style={{transform:"translateX(80px)"}}><VoiceMessage att={pendingVoice.att} /></div></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={discardPendingVoice}
                style={{flex:1,background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:10,padding:"12px",color:"var(--sub)",cursor:"pointer",fontSize:14}}>Отмена</button>
              <button onClick={sendPendingVoice}
                style={{flex:1,background:"var(--acc)",border:"none",borderRadius:10,padding:"12px",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>Отправить</button>
            </div>
          </div>
        </div>
      )}
      {lightbox&&(()=>{
        let meta=null;
        try{
          const walk=arr=>arr&&arr.forEach(f=>{ if(f.notes) f.notes.forEach(n=>{ if(n.attachments) n.attachments.forEach(a=>{ if(a&&a.dataUrl===lightbox) meta=a; }); }); if(f.subs) walk(f.subs); });
          walk(data.folders);
        }catch{}
        const hb=b=>{ if(b==null) return null; if(b<1024) return b+" Б"; if(b<1048576) return (b/1024).toFixed(1)+" КБ"; return (b/1048576).toFixed(1)+" МБ"; };
        return (
        <div onClick={closeLightbox} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:600,
          display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflow:"hidden"}}>
          <ZoomImg src={lightbox}/>
          {meta && (meta.size||meta.origSize) && (
            <div style={{position:"absolute",left:16,bottom:24,fontSize:11,lineHeight:1.5,color:"#C8BCAE",textShadow:"0 1px 3px rgba(0,0,0,.9)"}}>
              <div>{hb(meta.origSize||meta.size)}</div>
              {meta.compressed && meta.size && meta.origSize && meta.size<meta.origSize && (
                <div style={{color:"#9FCF8F"}}>Сжато · {hb(meta.size)}</div>
              )}
            </div>
          )}
          <button onClick={(e)=>{ e.stopPropagation(); saveImageToFolder(lightbox); }} title="Сохранить в папку"
            style={{position:"absolute",right:16,bottom:24,width:44,height:44,borderRadius:"50%",background:"rgba(46,37,28,.85)",border:"1px solid var(--gline,var(--line))",color:"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{display:"flex"}}><Icon d={["M12 4v12","M7 11l5 5 5-5","M5 20h14"]} stroke={2}/></span>
          </button>
          <button onClick={closeLightbox} style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.5)",
            border:"none",borderRadius:"50%",width:40,height:40,color:"#fff",fontSize:20,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        );
      })()}
      {/* Attach picker — Telegram-style categories */}
      {attSh&&(
        <div onClick={()=>setAttSh(false)} style={{position:"fixed",inset:0,zIndex:450}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:10,bottom:60,
            background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:16,padding:10,
            boxShadow:"0 10px 36px rgba(0,0,0,.6)",animation:"fS .15s ease",transformOrigin:"bottom right"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3, 78px)",gridAutoRows:"72px",gap:6}}>
            {[
              {ic:IC.gallery,  label:"Изображение",accept:"image/*"},
              {ic:IC.file,     label:"Файл",       accept:"*/*"},
              {ic:IC.camera,   label:"Камера",     accept:"image/*", capture:"environment"},
              {ic:IC.video,    label:"Видео",      accept:"video/*"},
              {ic:IC.audio,    label:"Аудио",      accept:"audio/*"},
              {ic:IC.camcorder,label:"Видеозап.",  accept:"video/*", capture:"environment"},
            ].map(o=>(
              <button key={o.label} onClick={()=>pickFiles(o.accept,o.capture)}
                style={{background:"var(--row2)",border:"1px solid var(--gline,var(--line))",borderRadius:12,
                  cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5}}>
                <span style={{color:"var(--acc)",display:"flex"}}>{o.ic}</span>
                <span style={{fontSize:10,color:"var(--ink2)"}}>{o.label}</span>
              </button>
            ))}
            </div>
          </div>
        </div>
      )}

      <ExportSheet open={expSh} onClose={()=>{setExpSh(false);setDriveSh(false);setCloudWhenSh(false);setCloudWhatSh(false);setCloudStorSh(false);setSyncMenuOpen(false);setSyncDetails(false);setStorageOpen(false);setSignOutAsk(false);setClearAsk(false);}} data={data} asSettings={asSettings} setAsSettings={setAsSettings} noInputAnim={noInputAnim} toggleInputAnim={toggleInputAnim}
        asOpen={asOpen} setAsOpen={setAsOpen} buildBackup={()=>collectBackup(syncCfg.enabled?syncCfg:{modules:{settings:true,notes:true,drafts:true},media:{images:true,videos:true,files:true}})} onImportClick={()=>importRef.current&&importRef.current.click()}
        syncSection={(
          <>
            <div style={{fontSize:13,color:"var(--sub)",marginBottom:8,fontWeight:600}}>Облачная синхронизация</div>
            <div onClick={()=>{ setDriveSh(true); }}
              style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:"pointer"}}>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{flexShrink:0}}><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6c1.9-5.6 7.1-9.8 13.7-9.8z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/><path fill="#FBBC05" d="M10.3 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.3.7-4.7l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.7 2.3-7.7 2.3-6.6 0-11.8-4.2-13.7-9.8l-7.8 6C6.4 42.6 14.6 48 24 48z"/></svg>
              <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))",fontWeight:700}}>Google Диск</span>
              <span style={{fontSize:12,color:syncStatus==="ok"?"#5BBF5B":"var(--sub2)"}}>{syncStatus==="syncing"?"синхронизация…":syncStatus==="ok"?"подключён":"настроить"}</span>
              <span onClick={e=>{ e.stopPropagation(); setDriveSh(true); }} style={{display:"flex",color:"var(--sub2)",padding:4}}>{IC.arrRight}</span>
            </div>
            <div style={{height:1,background:"var(--bar)",margin:"16px 0"}}/>
          </>
        )}/>
      <Sheet open={driveSh} onClose={()=>{setDriveSh(false);setSyncMenuOpen(false);setSyncDetails(false);setStorageOpen(false);setSignOutAsk(false);setClearAsk(false);}} title="Google Диск">
        {syncStatus!=="ok" ? (
          <>
            <div style={{fontSize:13,color:"var(--sub)",lineHeight:1.5,marginBottom:14}}>Войдите в аккаунт Google — данные будут храниться в скрытой папке приложения на вашем Диске и использовать ваше место.</div>
            <button onClick={()=>runSync("pull",true)} disabled={syncStatus==="syncing"}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"var(--acc)",border:"none",borderRadius:12,padding:14,cursor:"pointer",opacity:syncStatus==="syncing"?.6:1}}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#fff" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6c1.9-5.6 7.1-9.8 13.7-9.8z" opacity=".9"/><path fill="#fff" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z"/><path fill="#fff" d="M10.3 28.7c-.5-1.4-.7-2.9-.7-4.7s.3-3.3.7-4.7l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.8-6z" opacity=".7"/><path fill="#fff" d="M24 48c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.7 2.3-7.7 2.3-6.6 0-11.8-4.2-13.7-9.8l-7.8 6C6.4 42.6 14.6 48 24 48z" opacity=".85"/></svg>
              <span style={{fontSize:15,color:"#fff",fontWeight:700}}>{syncStatus==="syncing"?"Вход…":"Войти через Google"}</span>
            </button>
            {syncStatus==="error" && <div style={{fontSize:12,color:"#E07A5C",padding:"8px 4px"}}>Ошибка входа</div>}
            {syncStatus==="signedout" && <div style={{fontSize:12,color:"#E07A5C",padding:"8px 4px"}}>Вход не выполнен</div>}
          </>
        ) : (
          <>
            {/* Статус + уроборос */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",marginBottom:10}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#5BBF5B",flexShrink:0}}/>
              <span style={{flex:1,fontSize:13,color:"var(--ink2)"}}>Синхронизировано{syncLastTime?", "+new Date(syncLastTime).toLocaleString("ru-RU",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"2-digit"}):""}</span>
              <button onClick={()=>{ if(syncStatus==="signedout"){ return; } runSync("auto",false); }} title="Синхронизировать сейчас"
                style={{width:36,height:36,borderRadius:"50%",background:"var(--row2)",border:"1px solid var(--gline,var(--line))",color:"var(--acc)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{display:"flex",transform:"scale(.8)",animation:syncStatus==="syncing"?"spin 1s linear infinite":"none"}}>{IC.ouro}</span>
              </button>
            </div>

            {/* Когда сохранять — отдельное меню */}
            <div onClick={()=>setCloudWhenSh(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:"pointer",marginBottom:8}}>
              <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>Когда сохранять</span>
              <span style={{fontSize:13,color:"var(--sub)"}}>{(CLOUD_MODES.find(m=>m.val===(syncCfg.auto?(syncCfg.cloudMode||"change"):"off"))||CLOUD_MODES[0]).label}</span>
              <span style={{display:"flex",color:"var(--sub2)"}}>{IC.arrRight}</span>
            </div>

            {/* Что сохранять — отдельное меню */}
            <div onClick={()=>setCloudWhatSh(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:"pointer",marginBottom:8}}>
              <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>Что сохранять</span>
              <span style={{display:"flex",color:"var(--sub2)"}}>{IC.arrRight}</span>
            </div>

            {/* Место на диске — отдельное меню */}
            <div onClick={()=>{ setCloudStorSh(true); refreshStorageInfo(); }}
              style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:"pointer",marginBottom:8}}>
              <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>На Диске занято</span>
              <span style={{fontSize:13,color:"var(--acc)",fontWeight:600}}>{storageBusy?"…":(storageInfo?humanBytes(storageInfo.total):"")}</span>
              <span style={{display:"flex",color:"var(--sub2)"}}>{IC.arrRight}</span>
            </div>

            {/* Выход */}
            {!signOutAsk ? (
              <button onClick={()=>setSignOutAsk(true)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:12,padding:12,color:"var(--sub)",cursor:"pointer",fontSize:14,marginTop:4}}>
                <span style={{display:"flex",transform:"scale(.75)"}}>{IC.logout}</span>Выйти из аккаунта
              </button>
            ) : (
              <div style={{marginTop:4,padding:"12px 14px",background:"var(--row2)",borderRadius:10,border:"1px solid var(--gline,var(--line))"}}>
                <div style={{fontSize:14,color:"var(--ink,var(--txt))",marginBottom:10}}>Выйти из аккаунта Google?</div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={cloudSignOut} style={{flex:1,background:"#E05252",border:"none",borderRadius:9,padding:10,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Да</button>
                  <button onClick={()=>setSignOutAsk(false)} style={{flex:1,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:9,padding:10,color:"var(--ink,var(--txt))",cursor:"pointer",fontSize:14}}>Нет</button>
                </div>
              </div>
            )}
          </>
        )}
      </Sheet>

      <Sheet open={cloudWhenSh} onClose={()=>setCloudWhenSh(false)} title="Когда сохранять">
        {CLOUD_MODES.map(m=>{ const sel=(syncCfg.auto?(syncCfg.cloudMode||"change"):"off")===m.val; const timed=(m.val==="1d"||m.val==="1w"); return (
          <div key={m.val} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",marginBottom:6}}>
            <div onClick={()=>{ saveSyncCfg({...syncCfg, auto:m.val!=="off", cloudMode:m.val}); }} style={{display:"flex",alignItems:"center",gap:10,flex:1,cursor:"pointer"}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(sel?"var(--acc)":"#5A4C40"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--acc)"}}/>}</div>
              <span style={{fontSize:14,color:"var(--ink,var(--txt))"}}>{m.label}</span>
            </div>
            {timed && sel && (
              <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                <span style={{display:"flex",color:"var(--acc)",transform:"scale(.85)"}}>{IC.clock||IC.ouro}</span>
                <input type="time" value={syncCfg.cloudTime||"03:00"}
                  onChange={e=>saveSyncCfg({...syncCfg,cloudTime:e.target.value})}
                  style={{background:"transparent",border:"1px solid var(--gline,var(--line))",borderRadius:8,color:"var(--acc)",fontSize:13,padding:"4px 6px",outline:"none",fontWeight:600}}/>
              </label>
            )}
          </div>
        ); })}
        <div style={{fontSize:12,color:"var(--sub2)",padding:"4px 4px"}}>Для «раз в день/неделю» можно указать время автосохранения.</div>
      </Sheet>

      <Sheet open={cloudWhatSh} onClose={()=>setCloudWhatSh(false)} title="Что сохранять">
        {SYNC_MODULES.map(m=>(
          <div key={m.key} onClick={()=>saveSyncCfg({...syncCfg,modules:{...syncCfg.modules,[m.key]:!(syncCfg.modules&&syncCfg.modules[m.key])}})}
            style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:"pointer",marginBottom:6}}>
            <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>{m.label}</span>
            <div style={{width:40,height:24,borderRadius:12,background:(syncCfg.modules&&syncCfg.modules[m.key])?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:(syncCfg.modules&&syncCfg.modules[m.key])?18:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
            </div>
          </div>
        ))}
        <div style={{fontSize:12,color:"var(--sub2)",padding:"8px 4px 6px"}}>Медиа {(syncCfg.modules&&syncCfg.modules.notes)?"":"(нужны «Заметки»)"}</div>
        {MEDIA_MODULES.map(m=>{ const on=(syncCfg.media&&syncCfg.media[m.key]), avail=(syncCfg.modules&&syncCfg.modules.notes); return (
          <div key={m.key} onClick={()=>{ if(!avail) return; saveSyncCfg({...syncCfg,media:{...syncCfg.media,[m.key]:!on}}); }}
            style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",cursor:avail?"pointer":"default",opacity:avail?1:.4,marginBottom:6}}>
            <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>{m.label}</span>
            <div style={{width:40,height:24,borderRadius:12,background:on?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:on?18:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
            </div>
          </div>
        ); })}
      </Sheet>

      <Sheet open={cloudStorSh} onClose={()=>{setCloudStorSh(false);setClearAsk(false);}} title="На Диске занято">
        {storageBusy && <div style={{padding:"12px 4px",fontSize:13,color:"var(--sub2)"}}>Загрузка…</div>}
        {!storageBusy && storageInfo && storageInfo.parts.length===0 && <div style={{padding:"12px 4px",fontSize:14,color:"var(--sub2)"}}>В облаке нет данных</div>}
        {!storageBusy && storageInfo && storageInfo.parts.length>0 && (
          <div style={{fontSize:13,color:"var(--sub)",marginBottom:10}}>Всего: <span style={{color:"var(--acc)",fontWeight:600}}>{humanBytes(storageInfo.total)}</span></div>
        )}
        {!storageBusy && storageInfo && storageInfo.parts.map((p,i)=>{ const pct=storageInfo.total>0?Math.round(p.bytes/storageInfo.total*100):0; return (
          <div key={i} style={{padding:"10px 14px",background:"var(--bar)",borderRadius:10,border:"1px solid var(--gline,var(--line))",marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:13,color:"var(--ink,var(--txt))"}}>{p.label}</span>
              <span style={{fontSize:12,color:"var(--sub)"}}>{humanBytes(p.bytes)}</span>
            </div>
            <div style={{height:5,borderRadius:3,background:"var(--bg)",overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:"var(--acc)",borderRadius:3}}/></div>
          </div>
        ); })}
        {!storageBusy && storageInfo && storageInfo.parts.length>0 && !clearAsk && (
          <button onClick={()=>setClearAsk(true)} style={{width:"100%",marginTop:6,background:"var(--bar)",border:"1px solid #E05252",borderRadius:12,padding:13,color:"#E05252",cursor:"pointer",fontSize:14,fontWeight:600}}>Очистить данные в Google Диске</button>
        )}
        {clearAsk && (
          <div style={{marginTop:8,padding:"12px 14px",background:"var(--row2)",borderRadius:10,border:"1px solid #E05252"}}>
            <div style={{fontSize:14,color:"var(--ink,var(--txt))",marginBottom:4,fontWeight:600}}>Удалить все данные с Диска?</div>
            <div style={{fontSize:12,color:"var(--sub)",marginBottom:10,lineHeight:1.5}}>Резервная копия в облаке будет полностью удалена. Локальные заметки на устройстве останутся.</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={clearCloudData} style={{flex:1,background:"#E05252",border:"none",borderRadius:9,padding:10,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Удалить</button>
              <button onClick={()=>setClearAsk(false)} style={{flex:1,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:9,padding:10,color:"var(--ink,var(--txt))",cursor:"pointer",fontSize:14}}>Отмена</button>
            </div>
          </div>
        )}
      </Sheet>

            <Sheet open={miscSh} onClose={()=>setMiscSh(false)} title="Прочее">
              <div onClick={toggleHideVersion} style={{background:"var(--bar)",borderRadius:12,border:"1px solid var(--gline,var(--line))",padding:"14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Скрыть номер версии</span>
                <div style={{width:46,height:26,borderRadius:13,background:hideVersion?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:hideVersion?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
                </div>
              </div>
              <div style={{fontSize:12,color:"var(--sub2)",padding:"8px 4px 14px"}}>Скрывает метку «beta v…» в углу экрана.</div>
              <div onClick={toggleImgCompress} style={{display:"flex",alignItems:"center",gap:12,padding:"14px",background:"var(--bar)",borderRadius:12,border:"1px solid var(--gline,var(--line))",cursor:"pointer"}}>
                <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Сжимать изображения</span>
                <div style={{width:46,height:26,borderRadius:13,background:imgCompress?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:imgCompress?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
                </div>
              </div>
              <div style={{fontSize:12,color:"var(--sub2)",padding:"8px 4px"}}>Новые добавляемые изображения будут автоматически уменьшаться в размере. Уже добавленные не затрагиваются.</div>
              <div onClick={toggleCustomSelMenu} style={{display:"flex",alignItems:"center",gap:12,padding:"14px",background:"var(--bar)",borderRadius:12,border:"1px solid var(--gline,var(--line))",cursor:"pointer"}}>
                <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Своё меню выделения текста</span>
                <div style={{width:46,height:26,borderRadius:13,background:customSelMenu?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:customSelMenu?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
                </div>
              </div>
              <div style={{fontSize:12,color:"var(--sub2)",padding:"8px 4px"}}>Заменяет системное меню (Копировать / Вставить и т.д.) на компактное со значками. Применяется после перезапуска приложения.</div>
            </Sheet>
            <Sheet open={vibeSh} onClose={()=>setVibeSh(false)} title="Вибрация">
              {[
                {k:"master",label:"Вибрация включена",hint:"Главный выключатель тактильного отклика."},
                {k:"send",label:"При отправке сообщения"},
                {k:"check",label:"При отметке пункта списка"},
                {k:"delete",label:"При удалении"},
                {k:"drag",label:"При захвате для перетаскивания"},
              ].map(row=>{
                const on = row.k==="master" ? vibeCfg.master!==false : (vibeCfg.master!==false && vibeCfg[row.k]!==false);
                const dis = row.k!=="master" && vibeCfg.master===false;
                return (
                  <div key={row.k}>
                    <div onClick={()=>{ if(dis) return; setVibe(row.k, !(vibeCfg[row.k]!==false)); try{buzz(12,"master");}catch{} }}
                      style={{background:"var(--bar)",borderRadius:12,border:"1px solid var(--gline,var(--line))",padding:"14px",display:"flex",alignItems:"center",gap:12,cursor:dis?"default":"pointer",opacity:dis?.45:1,marginBottom:row.hint?0:10}}>
                      <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>{row.label}</span>
                      <div style={{width:46,height:26,borderRadius:13,background:on?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:2,left:on?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
                      </div>
                    </div>
                    {row.hint&&<div style={{fontSize:12,color:"var(--sub2)",padding:"8px 4px 14px"}}>{row.hint}</div>}
                  </div>
                );
              })}
            </Sheet>
            {imgCompressPopup && (
              <div onClick={()=>setImgCompressPopup(false)} style={{position:"fixed",inset:0,zIndex:700,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
                <div onClick={e=>e.stopPropagation()} style={{background:"var(--bar)",borderRadius:16,border:"1px solid var(--gline,var(--line))",padding:"20px 18px",maxWidth:320,boxShadow:"0 12px 40px rgba(0,0,0,.6)"}}>
                  <div style={{fontSize:16,color:"var(--ink,var(--txt))",fontWeight:700,marginBottom:10}}>Сжатие включено</div>
                  <div style={{fontSize:14,color:"var(--ink2)",lineHeight:1.55,marginBottom:16}}>Качество, заметное человеческому глазу, не пострадает. Изображения станут заметно легче и будут быстрее синхронизироваться.</div>
                  <button onClick={()=>setImgCompressPopup(false)} style={{width:"100%",background:"var(--acc)",border:"none",borderRadius:12,padding:12,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14}}>Понятно</button>
                </div>
              </div>
            )}
            <Sheet open={uiSh} noAnim={uiNoAnim.current} onClose={()=>setUiSh(false)} title="Интерфейс">
        <div onClick={()=>{setUiSh(false);setAnimSh(true);}} style={{display:"flex",alignItems:"center",gap:12,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:12,padding:"14px",marginBottom:10,cursor:"pointer"}}>
          <span style={{display:"flex",color:"var(--acc)"}}>{IC.sparkle}</span>
          <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Анимации</span>
        </div>
        <div onClick={()=>{setUiSh(false);setFontSh(true);}} style={{display:"flex",alignItems:"center",gap:12,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:12,padding:"14px",marginBottom:10,cursor:"pointer"}}>
          <span style={{display:"flex",color:"var(--acc)"}}>{IC.text}</span>
          <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Шрифты</span>
        </div>
        <div onClick={()=>{setUiSh(false);setAccentSh(true);}} style={{display:"flex",alignItems:"center",gap:12,background:"var(--bar)",border:"1px solid var(--gline,var(--line))",borderRadius:12,padding:"14px",marginBottom:10,cursor:"pointer"}}>
          <span style={{display:"flex",color:"var(--acc)"}}>{IC.palette||IC.sparkle}</span>
          <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Цвет иконок</span>
        </div>
      </Sheet>
      <Sheet open={accentSh} onClose={()=>{setAccentSh(false);openUiReturn();}} title="Цвет иконок">
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[{k:"orange",label:"Оранжевая",bg:"#EF6C00",fg:"#fff",bd:"transparent",glow:null},{k:"choco",label:"Шоколадная",bg:"#3A2E24",fg:"#EF6C00",bd:"#4A3A2A",glow:null},{k:"choconeon",label:"Шоколадный неон",bg:"#3A2E24",fg:"#EF6C00",bd:"#4A3A2A",glow:"0 0 14px rgba(239,108,0,.75)"}].map(o=>(
              <div key={o.k} onClick={()=>setAccent(o.k)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,cursor:"pointer",
                background:o.k==="orange"?"#241B12":"#1C1510",border:"1px solid "+(iconAccent===o.k?"var(--acc)":"#3A2E24")}}>
                <div style={{display:"flex",gap:6}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:o.bg,border:"1px solid "+o.bd,color:o.fg,boxShadow:o.glow||"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{display:"flex",transform:"rotate(90deg) scale(.66)"}}>{IC.send}</span>
                  </div>
                  <div style={{width:28,height:28,borderRadius:"50%",background:o.bg,border:"1px solid "+o.bd,color:o.fg,boxShadow:o.glow||"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{display:"flex",transform:"scale(.66)"}}>{IC.mic}</span>
                  </div>
                  <div style={{width:28,height:28,borderRadius:"50%",background:o.bg,border:"1px solid "+o.bd,color:o.fg,boxShadow:o.glow||"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <span style={{display:"flex",transform:"scale(.66)"}}>{IC.plus}</span>
                  </div>
                </div>
                <span style={{flex:1,fontSize:14,color:iconAccent===o.k?"#F2EAE0":"#B0A498"}}>{o.label}</span>
                {iconAccent===o.k && <span style={{display:"flex",color:"var(--acc)"}}>{IC.check}</span>}
              </div>
            ))}
        </div>
      </Sheet>
      <Sheet open={animSh} onClose={()=>{setAnimSh(false);openUiReturn();}} title="Анимации">
        {[
          {key:"scr",label:"Переходы между экранами",off:noScrAnim,toggle:toggleScrAnim},
          {key:"input",label:"Поле ввода",off:noInputAnim,toggle:toggleInputAnim},
          {key:"del",label:"Удаление сообщения",off:noDelAnim,toggle:toggleDelAnim},
        ].map(it=>{
          const enabled=!it.off;
          return (
            <div key={it.key} onClick={it.toggle} style={{background:"var(--bar)",borderRadius:12,border:"1px solid var(--gline,var(--line))",padding:"14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>{it.label}</span>
              <div style={{width:46,height:26,borderRadius:13,background:enabled?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
                <div style={{position:"absolute",top:2,left:enabled?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
              </div>
            </div>
          );
        })}
        <div style={{fontSize:12,color:"var(--sub2)",padding:"2px 4px"}}>Включение или отключение анимаций.</div>
      </Sheet>

      <input ref={fontFileRef} type="file" accept=".ttf,.otf,.woff,.woff2,font/*" style={{display:"none"}} onChange={onFontFile}/>
      {/* блок синхронизации перенесён в ExportSheet через syncSection */}
      {false && (<Sheet open={false} onClose={()=>{}} title="Синхронизация">
        {/* Главный тумблер */}
        <div onClick={()=>{ const c={...syncCfg,enabled:!syncCfg.enabled}; saveSyncCfg(c); if(c.enabled) setTimeout(()=>runSync("pull",true),100); }}
          style={{display:"flex",alignItems:"center",gap:12,padding:"12px 4px",cursor:"pointer"}}>
          <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Синхронизация с Google Диском</span>
          <div style={{width:46,height:26,borderRadius:13,background:syncCfg.enabled?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:2,left:syncCfg.enabled?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
          </div>
        </div>
        <div style={{fontSize:12,color:"var(--sub3)",padding:"0 4px 8px",lineHeight:1.5}}>Данные хранятся в скрытой папке приложения на вашем Google Диске и используют ваше место. По умолчанию выключено.</div>

        {syncCfg.enabled && (<>
          {/* Статус */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"var(--bar)",borderRadius:10,margin:"8px 0"}}>
            <div style={{width:10,height:10,borderRadius:"50%",flexShrink:0,
              background:syncStatus==="ok"?"#5BBF5B":syncStatus==="syncing"?"#E0A152":(syncStatus==="error"||syncStatus==="signedout")?"#E05252":"var(--sub3)"}}/>
            <span style={{flex:1,fontSize:13,color:"var(--ink2)"}}>
              {syncStatus==="syncing"?"Синхронизация…":
               syncStatus==="ok"?("Синхронизировано"+(syncLastTime?", "+new Date(syncLastTime).toLocaleString("ru-RU",{hour:"2-digit",minute:"2-digit",day:"2-digit",month:"2-digit"}):"")):
               syncStatus==="error"?"Ошибка синхронизации":
               syncStatus==="signedout"?"Не синхронизируется — войдите снова":
               "Готово к синхронизации"}
            </span>
          </div>

          {/* Баннер если выкинуло */}
          {syncStatus==="signedout" && (
            <div onClick={()=>runSync("pull",true)} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"#3A2218",border:"1px solid #E05252",borderRadius:10,margin:"8px 0",cursor:"pointer"}}>
              <span style={{flex:1,fontSize:13,color:"var(--ink,var(--txt))"}}>Заметки не синхронизируются с облаком. Нажмите, чтобы войти.</span>
            </div>
          )}

          {/* Авто-режим */}
          <div onClick={()=>saveSyncCfg({...syncCfg,auto:!syncCfg.auto})}
            style={{display:"flex",alignItems:"center",gap:12,padding:"12px 4px",cursor:"pointer"}}>
            <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Автоматически</span>
            <div style={{width:46,height:26,borderRadius:13,background:syncCfg.auto?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:2,left:syncCfg.auto?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
            </div>
          </div>

          {/* Кнопка ручного синка */}
          <button onClick={()=>{ if(syncStatus==="signedout"){ return; } runSync("auto",false); }} disabled={syncStatus==="syncing"||syncStatus==="signedout"}
            style={{width:"100%",background:"var(--acc)",border:"none",borderRadius:12,padding:13,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:14,margin:"8px 0",opacity:(syncStatus==="syncing"||syncStatus==="signedout")?.6:1}}>
            {syncStatus==="syncing"?"Синхронизация…":"Синхронизировать сейчас"}
          </button>

          <div style={{height:1,background:"var(--bar)",margin:"10px 0"}}/>
          <div style={{fontSize:13,color:"var(--sub2)",padding:"4px 4px 8px"}}>Что синхронизировать</div>
          {SYNC_MODULES.map(m=>(
            <div key={m.key} onClick={()=>saveSyncCfg({...syncCfg,modules:{...syncCfg.modules,[m.key]:!(syncCfg.modules&&syncCfg.modules[m.key])}})}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 4px",cursor:"pointer"}}>
              <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>{m.label}</span>
              <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                border:"2px solid "+((syncCfg.modules&&syncCfg.modules[m.key])?"var(--acc)":"#5A4C40"),
                background:(syncCfg.modules&&syncCfg.modules[m.key])?"var(--acc)":"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                {(syncCfg.modules&&syncCfg.modules[m.key])&&<span style={{display:"flex",transform:"scale(.7)"}}>{IC.check}</span>}
              </div>
            </div>
          ))}
        </>)}
      </Sheet>)}

      <Sheet open={fontSh} onClose={()=>{setFontSh(false);setFontOpen(null);openUiReturn();}} title="Шрифты">
        <div onClick={toggleSoftInk} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:"var(--bar)",borderRadius:12,border:"1px solid var(--gline,var(--line))",cursor:"pointer",marginBottom:14}}>
          <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))"}}>Приглушённый шрифт</span>
          <div style={{width:46,height:26,borderRadius:13,background:softInk?"var(--acc)":"var(--line)",position:"relative",transition:"background .2s",flexShrink:0}}>
            <div style={{position:"absolute",top:2,left:softInk?22:2,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left .28s cubic-bezier(.3,1.4,.4,1)"}}/>
          </div>
        </div>
        <div style={{fontSize:12,color:"var(--sub2)",padding:"0 4px 14px"}}>Делает текст мягче — не ярко-белым, а приглушённым, приятнее для глаз.</div>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          <button onClick={()=>fontFileRef.current&&fontFileRef.current.click()}
            style={{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 14px",background:"var(--row2)",border:"1px solid var(--gline,#5A4C40)",borderRadius:22,cursor:"pointer"}}>
            <span style={{display:"flex",color:"var(--acc)"}}><Icon d={["M12 4v12","M7 11l5 5 5-5","M5 20h14"]} stroke={2} size={17}/></span>
            <span style={{fontSize:14,color:"var(--ink,var(--txt))"}}>Загрузить</span>
          </button>
          <button onClick={()=>setFontDelSh(true)}
            style={{flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 14px",background:"var(--row2)",border:"1px solid #5A3A2A",borderRadius:22,cursor:"pointer"}}>
            <span style={{display:"flex",color:"#E05252"}}>{IC.trash}</span>
            <span style={{fontSize:14,color:"var(--ink,var(--txt))"}}>Удалить</span>
          </button>
        </div>
        {FONT_TARGETS.map(t=>{
          const curId=fonts.assign?.[t.key]||"sys";
          const curFont=allFonts.find(f=>f.id===curId)||allFonts[0];
          return (
            <div key={t.key} onClick={(e)=>{ const r=e.currentTarget.getBoundingClientRect(); setFontOpen({key:t.key,x:r.left,y:r.top,w:r.width}); }}
              style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",background:"var(--bar)",borderRadius:10,cursor:"pointer",marginBottom:8}}>
              <span style={{flex:1,fontSize:14,color:"var(--ink,var(--txt))"}}>{t.label}</span>
              <span style={{fontSize:13,color:"var(--sub)",fontFamily:curFont.css}}>{curFont.name}</span>
              <span style={{display:"flex",color:"var(--sub2)"}}>{IC.arrRight}</span>
            </div>
          );
        })}
      </Sheet>
      {/* Список удаления шрифтов */}
      <Sheet open={fontDelSh} onClose={()=>setFontDelSh(false)} title="Удалить шрифт">
        {allFonts.filter(f=>f.id!=="sys").length===0 && <div style={{textAlign:"center",color:"var(--sub)",fontSize:14,padding:"20px 0"}}>Нет шрифтов для удаления</div>}
        {allFonts.filter(f=>f.id!=="sys").map(f=>(
          <div key={f.id} onClick={()=>setDlg({msg:`Удалить шрифт «${f.name}»?`,yes:()=>removeFont(f.id)})}
            style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bar)",borderRadius:10,marginBottom:8,cursor:"pointer"}}>
            <span style={{flex:1,fontSize:15,color:"var(--ink,var(--txt))",fontFamily:f.css,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
            <span style={{display:"flex",color:"#E05252",transform:"scale(.85)"}}>{IC.trash}</span>
          </div>
        ))}
      </Sheet>
      {/* Popup выбора шрифта поверх */}
      {fontOpen&&(
        <div onClick={()=>setFontOpen(null)} style={{position:"fixed",inset:0,zIndex:700}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"fixed",
            left:Math.max(8,Math.min(fontOpen.x+fontOpen.w/2-125,window.innerWidth-258)),top:Math.max(8,Math.min(fontOpen.y-20,window.innerHeight-340)),
            background:"var(--bar)",borderRadius:14,width:"max-content",minWidth:180,maxWidth:280,maxHeight:"64vh",display:"flex",flexDirection:"column",animation:"fS .12s ease",border:"1px solid var(--gline,var(--line))",boxShadow:"0 10px 36px rgba(0,0,0,.6)"}}>
            <div style={{padding:"12px 16px 8px",fontSize:13,fontWeight:700,color:"var(--sub2)"}}>{FONT_TARGETS.find(t=>t.key===fontOpen.key)?.label}</div>
            <div style={{overflowY:"auto",flex:1}}>
            {allFonts.map(f=>{
              const curId=fonts.assign?.[fontOpen.key]||"sys";
              return (
                <div key={f.id} onClick={()=>{ setFontAssign(fontOpen.key,f.id); setFontOpen(null); }}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",cursor:"pointer"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid "+(curId===f.id?"var(--acc)":"#5A4C40"),
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {curId===f.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--acc)"}}/>}
                  </div>
                  <span style={{fontSize:15,color:"var(--ink,var(--txt))",fontFamily:f.css}}>{f.name}</span>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      )}

      <Sheet open={modal==="mkF"}  onClose={()=>setModal(null)}><FolderForm title="Новая категория"            icons={ICONS_F} btnLabel="Создать" onSubmit={mkF} accent={iconAccent}/></Sheet>
      <Sheet open={modal==="renF"} onClose={()=>setModal(null)}>{folder&&<FolderForm title="Редактировать категорию" icons={ICONS_F} initName={folder.name} initIcon={folder.icon} initColor={folder.color} onSubmit={renF} onBrowse={()=>browseIcon("folder")} accent={iconAccent}/>}</Sheet>
      <Sheet open={modal==="mkS"}  onClose={()=>setModal(null)}><FolderForm title="Новая тема"             icons={ICONS_S} btnLabel="Создать" onSubmit={mkS} initColor={folder?.color} accent={iconAccent}/></Sheet>
      <Sheet open={modal==="mkTop"} onClose={()=>setModal(null)}><FolderForm title="Новая тема" icons={ICONS_S} btnLabel="Создать" onSubmit={mkTopTheme} accent={iconAccent}/></Sheet>
      <Sheet open={modal==="renS"} onClose={()=>setModal(null)}>{subf&&<FolderForm title="Редактировать тему"     icons={ICONS_S} initName={subf.name} initIcon={subf.icon} initColor={subf.color} onSubmit={renS} onBrowse={()=>browseIcon("sub")} accent={iconAccent}/>}</Sheet>

      <Dlg open={!!dlg} msg={dlg?.msg} anchor={dlg?.anchor} onYes={()=>{dlg?.yes();setDlg(null);}} onNo={()=>setDlg(null)}/>
    </div>
  );
}
