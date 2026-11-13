// Local design editor. SVG artwork and JSON use the same element coordinates.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const area = {x:65,y:115,w:170,h:190};
  let side = 'front', selected = 'name', counter = 3, drag = null, busy = false;
  let faces = {front:[
    {id:'name',type:'text',text:'Your Shop Name',x:85,y:75,size:17,font:'sans-serif',color:'#12336b',bold:true},
    {id:'tagline',type:'text',text:'Your tagline goes here',x:85,y:102,size:9,font:'sans-serif',color:'#12336b',bold:false},
    {id:'contact',type:'text',text:'Phone / Address',x:85,y:143,size:8,font:'sans-serif',color:'#12336b',bold:false}
  ],back:[]};
  const current = () => faces[side].find(e=>e.id===selected);
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  const svgNode = (tag,attrs={}) => {const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));return n;};
  const announce = message => {$('editorStatus').textContent=message;};
  function snapshot(){return {version:1,side,faces:JSON.parse(JSON.stringify(faces))};}
  function validate(data){
    if(data?.version!==1 || !data.faces || !['front','back'].every(key=>Array.isArray(data.faces[key]) && data.faces[key].length<=30)) throw Error('Invalid design file.');
    const clean={front:[],back:[]};
    for(const key of ['front','back']) for(const [i,e] of data.faces[key].entries()){
      if(!e || !['text','image','decoration'].includes(e.type) || ![e.x,e.y,e.size].every(Number.isFinite)) throw Error('Invalid design element.');
      const item={id:key+'-'+i,type:e.type,x:clamp(e.x,0,170),y:clamp(e.y,0,190),size:clamp(e.size,6,e.type==='text'?30:160)};
      if(e.type==='text')Object.assign(item,{text:String(e.text||'').slice(0,80),font:['sans-serif','serif','monospace'].includes(e.font)?e.font:'sans-serif',color:/^#[0-9a-f]{6}$/i.test(e.color)?e.color:'#12336b',bold:!!e.bold});
      else if(e.type==='decoration'){if(!['boutique','rules','leaf'].includes(e.preset))throw Error('Unknown decoration.');Object.assign(item,{preset:e.preset,color:/^#[0-9a-f]{6}$/i.test(e.color)?e.color:'#12336b'});}
      else {if(typeof e.src!=='string' || e.src.length>7500000 || !/^data:image\/(png|jpeg);base64,[a-z0-9+/=]+$/i.test(e.src))throw Error('Invalid logo image.');Object.assign(item,{src:e.src,ratio:clamp(Number(e.ratio)||1,.1,10)});item.size=Math.min(item.size,130,item.ratio*(area.h-8));}
      clean[key].push(item);
    }
    return clean;
  }
  function restore(data){faces=validate(data);side=data.side==='back'?'back':'front';selected=faces[side][0]?.id;counter=Date.now();render();}
  function elementNode(e,offset=true){
    const x=e.x+(offset?area.x:0), y=e.y+(offset?area.y:0);
    if(e.type==='decoration'){
      const group=svgNode('g',{transform:`translate(${x} ${y}) scale(${e.size/100})`,fill:'none',stroke:e.color,'stroke-width':1.2,'stroke-linecap':'round'});
      const drawings={boutique:['M-48-18Q-48-23-43-23H43Q48-23 48-18V18Q48 23 43 23H-43Q-48 23-48 18Z','M-35-32Q-15-28 0-44Q15-28 35-32 M-28-39Q-14-42-8-35 M28-39Q14-42 8-35 M0-44V-54 M-7-48Q0-62 7-48 M-35 32Q-15 28 0 44Q15 28 35 32 M-28 39Q-14 42-8 35 M28 39Q14 42 8 35 M0 44V54 M-7 48Q0 62 7 48'],rules:['M-48-34H48 M-48-31H48 M-48 34H48 M-48 31H48'],leaf:['M-36 0Q0-46 36 0Q0 46-36 0Z M-30 0H30 M0 0 12-12 M-12 0 0 12']};
      drawings[e.preset].forEach(d=>group.append(svgNode('path',{d})));return group;
    }
    if(e.type==='image')return svgNode('image',{href:e.src,x:x-e.size/2,y:y-e.size/(e.ratio||1)/2,width:e.size,height:e.size/(e.ratio||1),preserveAspectRatio:'xMidYMid meet'});
    const n=svgNode('text',{x,y,'text-anchor':'middle','dominant-baseline':'middle','font-family':e.font,'font-size':e.size,'font-weight':e.bold?'700':'400',fill:e.color});n.textContent=e.text;return n;
  }
  function controls(){
    const e=current();$('elementControls').hidden=!e;
    $('layerList').replaceChildren();
    if(!faces[side].length){const o=new Option('No elements on this side','');$('layerList').add(o);}
    faces[side].forEach(e=>$('layerList').add(new Option(e.type==='image'?'Logo image':e.type==='decoration'?'Border / decoration':e.text||'Empty text',e.id)));
    window.customizerUI?.layers(faces[side],selected,id=>{selected=id;render();});
    if(!e)return;
    $('layerList').value=e.id;$('textControls').hidden=e.type!=='text';
    if(e.type==='text'){$('shop').value=e.text;$('fontFamily').value=e.font;$('inkColor').value=e.color;$('boldText').checked=e.bold;}
    $('elementSize').max=e.type==='text'?'30':e.type==='image'?'130':'160';$('elementSize').value=e.size;$('sizeLabel').textContent=Math.round(e.size);
    $('positionX').value=Math.round(e.x/area.w*100);$('positionY').value=Math.round(e.y/area.h*100);
  }
  function render(sync=true){
    const active=document.activeElement, keepFocus=active?.closest?.('#designLayers');
    $('designLayers').replaceChildren();$('selectionOutline').replaceChildren();
    faces[side].forEach(e=>{
      const group=svgNode('g',{'data-element':e.id,tabindex:0,role:'button','aria-label':(e.type==='text'?e.text:'Logo')+'. Drag or use arrow keys to move.'});
      const node=elementNode(e);group.append(node);$('designLayers').append(group);
      let box=e.type==='text'&&!e.text?{x:e.x+area.x,y:e.y+area.y,width:0,height:0}:node.getBBox();
      if(e.type==='text' && box.width>area.w-8){node.setAttribute('textLength',area.w-8);node.setAttribute('lengthAdjust','spacingAndGlyphs');box=node.getBBox();}
      // Keep the complete design inside the printable rectangle.
      const dx=box.x<area.x?area.x-box.x:box.x+box.width>area.x+area.w?area.x+area.w-box.x-box.width:0;
      const dy=box.y<area.y?area.y-box.y:box.y+box.height>area.y+area.h?area.y+area.h-box.y-box.height:0;
      if(dx||dy){e.x+=dx;e.y+=dy;if(e.type==='decoration')node.setAttribute('transform',`translate(${e.x+area.x} ${e.y+area.y}) scale(${e.size/100})`);else{node.setAttribute('x',Number(node.getAttribute('x'))+dx);node.setAttribute('y',Number(node.getAttribute('y'))+dy);}box=node.getBBox();}
      if(e.id===selected){$('selectionOutline').append(svgNode('rect',{x:box.x-3,y:box.y-3,width:Math.max(8,box.width+6),height:Math.max(8,box.height+6),rx:2,fill:'none',stroke:'#d83b55','stroke-width':1,'stroke-dasharray':'3 2'}));if(keepFocus)group.focus({preventScroll:true});}
    });
    $('frontSide').setAttribute('aria-pressed',String(side==='front'));$('backSide').setAttribute('aria-pressed',String(side==='back'));
    $('printGuides').style.display=$('showGuides').checked?'':'none';
    if(sync)controls();
    document.dispatchEvent(new CustomEvent('bag-design-change'));
  }
  function addText(text,bold=false){if(faces[side].length>=30){announce('Maximum 30 elements per side.');return;}const e={id:'element-'+(++counter),type:'text',text,x:85,y:80,size:bold?17:9,font:'sans-serif',color:'#12336b',bold};faces[side].push(e);selected=e.id;render();$('shop').focus();$('shop').select();announce('Text added. Type your details or drag it on the bag.');}
  $('addName').onclick=()=>addText('पसलको नाम',true);$('addDetails').onclick=()=>addText('98XXXXXXXX');$('addText').onclick=()=>addText('यहाँ लेख्नुहोस्');
  $('addAddress').onclick=()=>addText('तपाईंको ठेगाना');
  $('layerList').onchange=()=>{selected=$('layerList').value;render();};
  for(const [id,key] of [['shop','text'],['fontFamily','font'],['inkColor','color'],['boldText','bold'],['elementSize','size']])$(id).addEventListener('input',()=>{const e=current();if(!e)return;e[key]=id==='boldText'?$(id).checked:id==='elementSize'?Number($(id).value):$(id).value;render(false);$('sizeLabel').textContent=Math.round(e.size)+(e.type==='image'?' / logo width':' / text size');});
  for(const [id,key,max] of [['positionX','x',area.w],['positionY','y',area.h]])$(id).oninput=()=>{const e=current();if(!e)return;e[key]=clamp(Number($(id).value)||0,0,100)/100*max;render(false);};
  $('centerElement').onclick=()=>{if(current()){current().x=area.w/2;render();}};
  $('deleteElement').onclick=()=>{faces[side]=faces[side].filter(e=>e.id!==selected);selected=faces[side].at(-1)?.id;render();announce('Element removed.');};
  $('duplicateElement').onclick=()=>{if(!current()||faces[side].length>=30)return;const e={...current(),id:'element-'+(++counter),y:clamp(current().y+15,0,190)};faces[side].push(e);selected=e.id;render();};
  for(const name of ['front','back'])$(name+'Side').onclick=()=>{side=name;selected=faces[side][0]?.id;render();if(name==='back')document.dispatchEvent(new CustomEvent('bag-both-sides'));announce(name==='back'?'Designing the back. Front artwork is kept separately.':'Designing the front.');};
  $('showGuides').onchange=()=>render(false);
  function point(event){const p=new DOMPoint(event.clientX,event.clientY);return p.matrixTransform($('designCanvas').getScreenCTM().inverse());}
  $('designCanvas').addEventListener('pointerdown',event=>{const target=event.target.closest('[data-element]');if(!target)return;event.preventDefault();selected=target.dataset.element;const p=point(event);drag={pointer:event.pointerId,x:p.x,y:p.y,ox:current().x,oy:current().y};$('designCanvas').setPointerCapture(event.pointerId);render();});
  $('designCanvas').addEventListener('pointermove',event=>{if(!drag||drag.pointer!==event.pointerId)return;const p=point(event),e=current();if(!e)return;e.x=clamp(drag.ox+p.x-drag.x,0,area.w);e.y=clamp(drag.oy+p.y-drag.y,0,area.h);render();});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])$('designCanvas').addEventListener(type,()=>{drag=null;});
  $('designCanvas').addEventListener('keydown',event=>{const keys={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},delta=keys[event.key];if(!delta)return;const target=event.target.closest('[data-element]');if(target)selected=target.dataset.element;const e=current();if(!e)return;event.preventDefault();e.x=clamp(e.x+delta[0]*(event.shiftKey?5:1),0,area.w);e.y=clamp(e.y+delta[1]*(event.shiftKey?5:1),0,area.h);render();});
  $('file').onchange=async()=>{
    const file=$('file').files[0];if(!file)return;
    if(busy)return;
    if(!['image/png','image/jpeg'].includes(file.type)||file.size>5*1024*1024){$('fileStatus').textContent='Choose a PNG or JPG up to 5 MB.';return;}
    if(faces[side].length>=30){announce('Maximum 30 elements per side.');return;}
    busy=true;$('fileStatus').textContent='Preparing your logo...';const targetSide=side;
    try{const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});const image=new Image();image.src=src;await image.decode();const e={id:'element-'+(++counter),type:'image',src,ratio:clamp(image.naturalWidth/image.naturalHeight,.1,10),x:85,y:45,size:Math.min(60,100*image.naturalWidth/image.naturalHeight)};faces[targetSide].push(e);if(side===targetSide)selected=e.id;render();$('fileStatus').textContent=file.name+' added. Drag it on the bag to position it.';}
    catch{$('fileStatus').textContent='This image could not be opened. Try a different PNG or JPG.';}finally{busy=false;$('file').value='';}
  };
  function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $('downloadDesign').onclick=()=>{download('my-bag-design.json',JSON.stringify({format:'sanjana-bag-design',...window.bagEditor.getProject()},null,2),'application/json');announce('Design file includes both sides, logo images and bag details. Share it with the business.');};
  function artwork(face){
    const width=Number($('w').value),height=Number($('h').value);
    if(!Number.isFinite(width)||width<150||width>600||!Number.isFinite(height)||height<200||height>800)throw Error('Enter valid bag dimensions before exporting artwork.');
    const root=svgNode('svg',{xmlns:NS,width:(width*area.w/220).toFixed(2)+'mm',height:(height*area.h/268).toFixed(2)+'mm',viewBox:`0 0 ${area.w} ${area.h}`});
    const title=svgNode('title');title.textContent=face+' artwork - demo print area; confirm dimensions and fonts before production';root.append(title);
    // Clone the exact rendered nodes so text fitting matches the preview.
    const original=side;side=face;render(false);const content=svgNode('g',{transform:`translate(${-area.x} ${-area.y})`});Array.from($('designLayers').children).forEach(g=>content.append(g.firstChild.cloneNode(true)));root.append(content);side=original;render();
    return new XMLSerializer().serializeToString(root);
  }
  $('downloadArtwork').onclick=()=>{try{download('bag-'+side+'-artwork.svg',artwork(side),'image/svg+xml');announce('Current side exported without the bag or guides. Confirm print size and fonts with your printer.');}catch(error){announce(error.message);}};
  $('importDesign').onchange=async()=>{const file=$('importDesign').files[0];if(!file)return;try{if(file.size>20*1024*1024)throw Error('Design file must be under 20 MB.');const data=JSON.parse(await file.text());if(data.format!=='sanjana-bag-design')throw Error('Choose a Sanjana design JSON file.');const clean=validate(data.editor);window.bagEditor.restoreProject({...data,editor:{...data.editor,faces:clean}});announce('Saved design opened. Both sides and logos have been restored.');}catch(error){announce(error.message||'Unable to open that design file.');}finally{$('importDesign').value='';}};
  window.bagEditor={render,snapshot,restore,artwork,getProject:()=>({editor:snapshot()}),restoreProject:data=>restore(data.editor)};
  render();
})();
