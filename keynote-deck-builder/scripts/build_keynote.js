/* build_keynote.js — Keynote Deck Builder renderer.
 * Minimalist, presenter-driven decks: one idea per slide, big auto-sized type, heavy
 * negative space, dark/light themes, optional conceptual VECTOR motifs (no photos).
 *
 *   THEME=navy|black|light  MOTIFS=on|off  node build_keynote.js <outline.json> [<script.json>] <out.pptx>
 *
 * - outline.json is the source of truth (see references/outline_template.json).
 * - script.json (optional) is {"1":"notes",...}; if omitted, per-slide `notes` in the
 *   outline are used. Notes are baked into PowerPoint speaker notes.
 * - THEME default navy. MOTIFS default: on for navy, off for black/light (override with MOTIFS=on|off).
 */
const fs = require('fs');
const PptxGenJS = require('pptxgenjs');

const [,, OUTLINE_PATH, A2, A3] = process.argv;
const SCRIPT_PATH = A3 ? A2 : '';            // if 3 file args, middle is script.json
const OUT = A3 ? A3 : A2;
if (!OUTLINE_PATH || !OUT) { console.error('usage: [THEME=][MOTIFS=] node build_keynote.js outline.json [script.json] out.pptx'); process.exit(1); }
const SLIDES = JSON.parse(fs.readFileSync(OUTLINE_PATH, 'utf8')).slides;
let NOTES = {};
if (SCRIPT_PATH) { try { NOTES = JSON.parse(fs.readFileSync(SCRIPT_PATH,'utf8')); delete NOTES._comment; delete NOTES._house_style; } catch(e){ console.warn('*** no script JSON at',SCRIPT_PATH); } }

const THEME = (process.env.THEME||'navy').toLowerCase();
const W=13.333, H=7.5, CX=W/2;
const HF='Segoe UI Semibold', LF='Segoe UI Light';

// ---- themes ----
const THEMES = {
  navy:  { BG:'081120', INK:'FFFFFF', MUTE:'AFC0DA', faintNum:'12294A', nodeBase:'0E1F38', nodeHL:'12325A', nodeInk:'FFFFFF',
           ACC:{BLUE:'5EA8FF',GREEN:'49D6A0',GOLD:'F2B45A',PINK:'FF7E9D',VIOLET:'B69CFF',SOFT:'9BC6FF'}, ambient:true,  motifDefault:true,  motifTr:0 },
  black: { BG:'050507', INK:'FFFFFF', MUTE:'9AA7BC', faintNum:'15171C', nodeBase:'101216', nodeHL:'171A20', nodeInk:'FFFFFF',
           ACC:{BLUE:'5EA8FF',GREEN:'49D6A0',GOLD:'F2B45A',PINK:'FF7E9D',VIOLET:'B69CFF',SOFT:'9BC6FF'}, ambient:false, motifDefault:false, motifTr:0 },
  light: { BG:'FFFFFF', INK:'0B1B2E', MUTE:'5A6B82', faintNum:'E7ECF4', nodeBase:'F0F4FA', nodeHL:'E6F0FF', nodeInk:'0B1B2E',
           ACC:{BLUE:'2E6BE6',GREEN:'17A673',GOLD:'C9871B',PINK:'D6356B',VIOLET:'6D4FD0',SOFT:'3F73D6'}, ambient:false, motifDefault:false, motifTr:10 }
};
const T = THEMES[THEME] || THEMES.navy;
const ACC = T.ACC;
const MOTIFS_ON = process.env.MOTIFS ? process.env.MOTIFS.toLowerCase()==='on' : T.motifDefault;

const pptx = new PptxGenJS();
pptx.defineLayout({ name:'W', width:W, height:H }); pptx.layout='W';

// ---- base + ambient ----
function base(accent){ const s=pptx.addSlide(); s.background={color:T.BG};
  if(T.ambient){ s.addShape('ellipse',{x:8.2,y:-2.6,w:8.5,h:8.5,fill:{color:accent,transparency:90},line:{type:'none'}});
                 s.addShape('ellipse',{x:-3.4,y:3.8,w:7.5,h:7.5,fill:{color:accent,transparency:93},line:{type:'none'}}); }
  return s; }

// ---- motif library (abstract vector, low-opacity) ----
const TR = (v)=>Math.min(98, v + T.motifTr);
function ln(s,x1,y1,x2,y2,c,w=1.25,tr=66){ s.addShape('line',{x:Math.min(x1,x2),y:Math.min(y1,y2),w:Math.abs(x2-x1),h:Math.abs(y2-y1),
  line:{color:c,width:w,transparency:TR(tr)},flipH:(x2<x1),flipV:(y2<y1)}); }
function dot(s,cx,cy,d,c,tr=0){ s.addShape('ellipse',{x:cx-d/2,y:cy-d/2,w:d,h:d,fill:{color:c,transparency:TR(tr)},line:{type:'none'}}); }
function ring(s,cx,cy,d,c,tr=70,wd=1.25){ s.addShape('ellipse',{x:cx-d/2,y:cy-d/2,w:d,h:d,fill:{type:'none'},line:{color:c,width:wd,transparency:TR(tr)}}); }
const MOTIF = {
  none(){},
  orbit(s,a){ ring(s,11.0,1.7,3.2,a,72); ring(s,11.0,1.7,4.6,a,82); dot(s,11.0,1.7,0.16,a,30); },
  ripple(s,a){ [1.4,2.6,3.9,5.3,6.8].forEach((d,i)=>ring(s,CX,4.0,d,a,60+i*6)); dot(s,CX,4.0,0.18,a,10); },
  nodes(s,a){ const P=[[2.0,1.6],[4.2,2.5],[3.0,5.6],[10.8,1.9],[11.6,5.2],[9.4,6.1],[6.9,1.3],[1.7,4.6]];
    P.forEach((p,i)=>P.slice(i+1).forEach(q=>{ if(Math.hypot(p[0]-q[0],p[1]-q[1])<3.4) ln(s,p[0],p[1],q[0],q[1],a,1,80); }));
    P.forEach(p=>dot(s,p[0],p[1],0.16,a,30)); },
  road(s,a){ ln(s,CX-0.25,7.4,CX-2.9,1.2,a,1.5,68); ln(s,CX+0.25,7.4,CX+2.9,1.2,a,1.5,68);
    [6.6,5.4,4.2,3.0,2.0].forEach((y,i)=>{ const w=0.9-i*0.14; ln(s,CX-w,y,CX+w,y,a,1,72+i*4); }); },
  branch(s,a){ const ox=2.4,oy=4.0,ends=[[10.8,1.5],[11.2,3.2],[11.0,4.9],[10.4,6.3]];
    ends.forEach(e=>ln(s,ox,oy,e[0],e[1],a,1.25,70)); dot(s,ox,oy,0.22,a,18); ends.forEach(e=>dot(s,e[0],e[1],0.15,a,35)); },
  spark(s,a){ const cx=11.0,cy=4.0; for(let i=0;i<12;i++){ const ang=i*Math.PI/6; ln(s,cx,cy,cx+Math.cos(ang)*1.5,cy+Math.sin(ang)*1.5,a,1,74);} dot(s,cx,cy,0.3,a,8); },
  converge(s,a){ const fx=10.9,fy=4.0; [[1.2,1.3],[1.0,2.6],[1.1,4.0],[1.0,5.4],[1.2,6.6]].forEach(p=>ln(s,p[0],p[1],fx,fy,a,1.1,72)); dot(s,fx,fy,0.26,a,12); },
  grid(s,a){ for(let r=0;r<5;r++)for(let c=0;c<5;c++) dot(s,9.0+c*0.62,1.2+r*0.62,0.1,a,55+((r+c)%3)*10); },
  arc(s,a){ ring(s,CX,9.7,11.5,a,72,1.5); ring(s,CX,9.9,13.0,a,84,1.25); }
};

function fit(t,maxW,maxPt,minPt){ const len=Math.max(t.length,1); return Math.max(minPt,Math.round(Math.min(maxPt,maxW/(len*0.0098)))); }

// ---- slide types ----
function TITLE(s,d,a){
  if(d.eyebrow) s.addText(d.eyebrow,{x:1.2,y:2.45,w:10.9,h:0.4,fontFace:HF,fontSize:13.5,bold:true,color:a,charSpacing:4});
  s.addShape('rect',{x:1.24,y:3.0,w:0.16,h:1.5,fill:{color:a},line:{type:'none'}});
  s.addText(d.text,{x:1.62,y:2.95,w:10.4,h:1.7,fontFace:HF,fontSize:fit(d.text,10.2,58,40),bold:true,color:T.INK,valign:'top',lineSpacingMultiple:1.02});
  if(d.sub) s.addText(d.sub,{x:1.66,y:4.85,w:10.2,h:0.7,fontFace:LF,fontSize:20,color:T.MUTE}); }
function STATEMENT(s,d,a){
  const lines=Array.isArray(d.text)?d.text:[d.text]; const longest=lines.reduce((m,l)=>Math.max(m,l.length),0);
  const cap=d.big?64:46; const baseS=fit('x'.repeat(longest),10.6,cap,d.big?30:24);
  const size=lines.length>=3?Math.min(baseS,30):lines.length===2?Math.min(baseS,42):baseS;
  if(d.kicker) s.addText(d.kicker,{x:1.2,y:2.2,w:10.9,h:0.4,fontFace:HF,fontSize:14,bold:true,color:a,charSpacing:3,align:'center'});
  const blockH=lines.length*(size/72*1.28); const startY=Math.max(1.7,(H-blockH)/2);
  const runs=lines.map((l,i)=>({text:l,options:{breakLine:true,color:(d.accentLineIdx===i)?a:T.INK}}));
  s.addText(runs,{x:1.0,y:startY,w:11.33,h:blockH+0.6,fontFace:HF,fontSize:size,bold:true,align:'center',valign:'middle',lineSpacingMultiple:1.2,color:T.INK});
  if(d.sub) s.addText(d.sub,{x:1.6,y:startY+blockH+0.45,w:10.13,h:0.6,fontFace:LF,fontSize:18,color:T.MUTE,align:'center'}); }
function WORD(s,d,a){
  const lines=Array.isArray(d.text)?d.text:[d.text]; const longest=lines.reduce((m,l)=>Math.max(m,l.length),0);
  const size=fit('x'.repeat(longest),11.0,118,46);
  if(d.kicker) s.addText(d.kicker,{x:1.2,y:1.7,w:10.9,h:0.4,fontFace:HF,fontSize:14,bold:true,color:a,charSpacing:3,align:'center'});
  const runs=lines.map(l=>({text:l,options:{breakLine:true}}));
  s.addText(runs,{x:0.8,y:2.2,w:11.73,h:3.2,fontFace:HF,fontSize:size,bold:true,color:T.INK,align:'center',valign:'middle'});
  if(d.sub) s.addText(d.sub,{x:1.6,y:5.45,w:10.13,h:0.7,fontFace:LF,fontSize:19,color:T.MUTE,align:'center'}); }
function QUESTION(s,d,a){
  s.addText('?',{x:CX-0.5,y:1.1,w:1.0,h:1.0,fontFace:LF,fontSize:54,color:a,align:'center'});
  s.addText(d.text,{x:1.1,y:2.6,w:11.13,h:2.6,fontFace:HF,fontSize:fit(d.text,10.4,48,28),bold:true,color:T.INK,align:'center',valign:'middle',lineSpacingMultiple:1.18}); }
function STEP(s,d,a){
  s.addText(String(d.num),{x:0.2,y:0.8,w:5.8,h:5.9,fontFace:HF,fontSize:240,bold:true,color:T.faintNum,align:'center',valign:'middle'});
  s.addText(d.kicker||('STEP '+d.num),{x:6.4,y:2.55,w:6.3,h:0.4,fontFace:HF,fontSize:14,bold:true,color:a,charSpacing:3});
  s.addText(d.text,{x:6.4,y:2.95,w:6.4,h:1.2,fontFace:HF,fontSize:fit(d.text,6.2,40,26),bold:true,color:T.INK,valign:'top',lineSpacingMultiple:1.04});
  if(d.sub) s.addText(d.sub,{x:6.42,y:4.25,w:6.3,h:1.4,fontFace:LF,fontSize:18,color:T.MUTE,lineSpacingMultiple:1.2}); }
function PIPELINE(s,d,a){
  if(d.kicker) s.addText(d.kicker,{x:1.2,y:1.5,w:10.9,h:0.4,fontFace:HF,fontSize:14,bold:true,color:a,charSpacing:3,align:'center'});
  if(d.text) s.addText(Array.isArray(d.text)?d.text[0]:d.text,{x:1.0,y:2.0,w:11.33,h:1.0,fontFace:HF,fontSize:fit(Array.isArray(d.text)?d.text[0]:d.text,10.6,34,22),bold:true,color:T.INK,align:'center',valign:'middle'});
  const nodes=d.nodes,n=nodes.length,y=4.35,gap=0.5,total=W-2.0,nodeW=(total-(n-1)*gap)/n; let x=1.0;
  nodes.forEach((t,i)=>{ const hl=i===n-1;
    s.addShape('roundRect',{x,y,w:nodeW,h:1.05,rectRadius:0.1,fill:{color:hl?T.nodeHL:T.nodeBase},line:{color:a,width:hl?1.75:1,transparency:hl?0:45}});
    s.addText(t,{x:x+0.06,y:y+0.05,w:nodeW-0.12,h:0.95,fontFace:HF,fontSize:fit(t,nodeW-0.2,15,10),bold:true,color:hl?a:T.nodeInk,align:'center',valign:'middle'});
    if(d.subs&&d.subs[i]) s.addText(d.subs[i],{x,y:y+1.12,w:nodeW,h:0.7,fontFace:LF,fontSize:10.5,italic:true,color:T.MUTE,align:'center',lineSpacingMultiple:1.05});
    x+=nodeW; if(i<n-1){ s.addShape('rightArrow',{x:x+gap*0.18,y:y+0.42,w:gap*0.64,h:0.2,fill:{color:a,transparency:25},line:{type:'none'}}); x+=gap; } }); }
function TRIAD(s,d,a){
  if(d.kicker) s.addText(d.kicker,{x:1.2,y:1.55,w:10.9,h:0.4,fontFace:HF,fontSize:14,bold:true,color:a,charSpacing:3,align:'center'});
  const items=d.items,n=items.length,top=2.5,gap=0.32,rowH=(H-top-1.0-(n-1)*gap)/n;
  items.forEach((it,i)=>{ const y=top+i*(rowH+gap);
    s.addShape('rect',{x:1.6,y:y+0.14,w:0.12,h:rowH-0.28,fill:{color:ACC[it.accent]||a},line:{type:'none'}});
    s.addText(it.text,{x:1.95,y,w:9.4,h:rowH,fontFace:HF,fontSize:fit(it.text,9.0,30,18),bold:true,color:T.INK,valign:'middle',lineSpacingMultiple:1.05}); }); }
function CLOSE(s,d,a){
  if(d.kicker) s.addText(d.kicker,{x:1.2,y:2.4,w:10.9,h:0.4,fontFace:HF,fontSize:14,bold:true,color:a,charSpacing:3,align:'center'});
  s.addText(d.text,{x:1.0,y:2.95,w:11.33,h:1.6,fontFace:HF,fontSize:fit(Array.isArray(d.text)?d.text.join(' '):d.text,10.8,60,34),bold:true,color:T.INK,align:'center',valign:'middle'});
  if(d.sub) s.addText(d.sub,{x:1.6,y:4.7,w:10.13,h:0.7,fontFace:LF,fontSize:22,color:a,align:'center'}); }

const TYPE={TITLE,STATEMENT,WORD,QUESTION,STEP,PIPELINE,TRIAD,CLOSE};
// Required content fields per type, so a malformed slide fails with a clear message
// (which slide, which type, which field) instead of a raw TypeError deep in a renderer.
const REQUIRED={TITLE:['text'],STATEMENT:['text'],WORD:['text'],QUESTION:['text'],STEP:['num','text'],PIPELINE:['nodes'],TRIAD:['items'],CLOSE:['text']};
function missingField(d){ for(const f of (REQUIRED[d.type]||[])){ const v=d[f];
  if(v===undefined||v===null||v==='') return f;
  if((f==='nodes'||f==='items') && (!Array.isArray(v)||v.length===0)) return f; }
  return null; }
SLIDES.forEach((d,idx)=>{
  const where='slide '+(d.n!=null?d.n:idx+1);
  const fn=TYPE[d.type]; if(!fn){ console.error('build error:',where,'has unknown type',JSON.stringify(d.type)); process.exit(1); }
  const miss=missingField(d); if(miss){ console.error('build error:',where,'('+d.type+') is missing required field:',miss); process.exit(1); }
  const a=ACC[d.accent]||ACC.BLUE; const s=base(a);
  if(MOTIFS_ON && d.motif && d.motif!=='none') (MOTIF[d.motif]||MOTIF.none)(s,a);
  fn(s,d,a);
  const nt = NOTES[String(d.n)] || d.notes; if(nt) s.addNotes(nt);
});
pptx.writeFile({fileName:OUT}).then(()=>console.log('WROTE',OUT,'·',SLIDES.length,'slides · theme='+THEME+' motifs='+(MOTIFS_ON?'on':'off')));
