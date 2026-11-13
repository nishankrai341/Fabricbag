// Three local prototype journeys. No request or approval is sent to the business.
(() => {
  'use strict';
  const $=id=>document.getElementById(id), editor=window.bagEditor, ui=window.customizerUI;
  const baseGet=editor.getProject, baseRestore=editor.restoreProject;
  let mode='template',attachments=[],approval=null,revision=1,lastContent='',previous=null,loading=false;
  const text=(id,value,y,size=11,bold=false)=>({id,type:'text',text:value,x:85,y,size,font:'sans-serif',color:'#12336b',bold});
  const decoration=(preset,y,size=150)=>({id:'frame',type:'decoration',preset,x:85,y,size,color:'#12336b'});
  const templates=[
    {id:'boutique',label:'बुटिक',subtitle:'फूलबुट्टा र फ्रेम',preview:'BOUTIQUE',front:[decoration('boutique',81),text('name','YOUR BOUTIQUE',76,14,true),text('tagline','Fashion made for you',94,7),text('phone','98XXXXXXXX',151,8),text('address','Your address',165,8)]},
    {id:'textile',label:'कपडा पसल',subtitle:'नेपाली नाम र विवरण',preview:'वस्त्रालय',front:[decoration('rules',89),text('owner','प्रो. तपाईंको नाम',26,7),text('name','तपाईंको वस्त्रालय',59,16,true),text('address','तपाईंको ठेगाना',81,10),text('phone','फोन: 98XXXXXXXX',99,8),text('details','साडी · कुर्ता · कपडा',153,9)]},
    {id:'store',label:'किराना / मार्ट',subtitle:'लोगो र ठेगाना',preview:'FRESH MART',front:[decoration('leaf',31,65),text('name','YOUR FRESH MART',78,14,true),text('tagline','Everyday essentials',101,9),text('phone','98XXXXXXXX',141,9),text('address','Your address',158,8)]}
  ];
  const host=document.createElement('section');host.className='design-journeys';host.setAttribute('aria-label','डिजाइन बनाउने तरिका');
  host.innerHTML=`<div class="journey-heading"><h2>कसरी बनाउने?</h2><span class="badge blue">३ सजिला तरिका</span></div><div class="journey-options"></div>
    <div id="journeyTemplate" class="journey-panel"><div class="template-grid"></div><button id="undoTemplate" class="btn small ghost" type="button" hidden>↶ अघिल्लो डिजाइन</button><p class="hint">नमुना छान्नुहोस्। तल नाम र विवरण बदल्नुहोस्।</p></div>
    <div id="journeyUpload" class="journey-panel" hidden><label class="journey-upload" for="fullArtwork"><span class="journey-upload-icon"></span><strong>आफ्नो डिजाइन राख्नुहोस्</strong><span>PNG / JPG / PDF · 5 MB</span><input id="fullArtwork" type="file" accept="image/png,image/jpeg,application/pdf"></label><p class="hint">PNG/JPG झोलामा देखिन्छ। PDF मूल फाइलका रूपमा सुरक्षित हुन्छ; designer ले जाँच्छन्।</p></div>
    <div id="journeyHelp" class="journey-panel" hidden><label class="journey-upload" for="referencePhoto"><span class="reference-upload-icon"></span><strong>पुरानो झोला / नमुना फोटो</strong><span>PNG / JPG · 5 MB</span><input id="referencePhoto" type="file" accept="image/png,image/jpeg"></label><label for="designBrief">के बनाउने?</label><textarea id="designBrief" rows="3" maxlength="2000" placeholder="पसलको नाम, फोन, मन पर्ने रङ वा डिजाइन..."></textarea><p class="notice">फोटोबाट designer ले artwork बनाउँछन्। फोटो आफैं print file होइन।</p></div>
    <div id="journeyAttachments" class="journey-attachments"></div><p id="journeyStatus" class="hint" role="status"></p>`;
  const panel=document.querySelector('[data-panel="1"]');panel.querySelector('h2').after(host);
  host.querySelector('.journey-upload-icon').innerHTML=ui.icon('folder');host.querySelector('.reference-upload-icon').innerHTML=ui.icon('image');
  const modes=[['template','bag','नमुना छान्ने'],['upload','folder','आफ्नो डिजाइन'],['help','image','बनाइदिनुहोस्']];
  for(const [key,icon,label] of modes){const b=document.createElement('button');b.type='button';b.dataset.journey=key;b.className='journey-choice';ui.button(b,icon,label);b.onclick=()=>setMode(key);host.querySelector('.journey-options').append(b);}
  const say=message=>$('journeyStatus').textContent=message;
  const review=document.createElement('section');review.className='design-review';review.innerHTML=`<div class="journey-heading"><h2>डिजाइन जाँच</h2><span id="designVersion" class="badge blue"></span></div><div id="reviewSides" class="review-sides"></div><p id="reviewState" role="status"></p><label class="approval-check"><input id="approveCheck" type="checkbox"><span>नाम, फोन, अगाडि / पछाडिको डिजाइन जाँच गरेँ।</span></label><button id="approveDesign" class="btn" type="button">✓ यो डिजाइन ठीक छ</button><p class="hint">यो device मा demo approval मात्र हो। वास्तविक छपाइअघि designer ले font, नाप र artwork पक्का गर्छन्।</p>`;
  document.querySelector('[data-panel="2"] h2').after(review);
  const previewWarning=document.createElement('p');previewWarning.className='notice';previewWarning.hidden=true;document.querySelector('.preview-caption').after(previewWarning);
  function content(){const p=baseGet();return JSON.stringify({state:p.state,fields:p.fields,faces:p.editor.faces,mode,attachments,brief:$('designBrief').value});}
  function observe(){
    if(loading)return;
    const value=content();if(lastContent && value!==lastContent){if(approval)revision++;approval=null;$('approveCheck').checked=false;}lastContent=value;
    $('designVersion').textContent='Version '+revision;
    const pending=mode==='help'||attachments.some(a=>a.kind==='artwork'&&a.type==='application/pdf');
    $('approveDesign').disabled=pending||!$('approveCheck').checked||!baseGet().editor.faces.front.length;
    $('approveCheck').disabled=pending;
    $('downloadArtwork').disabled=pending;
    previewWarning.hidden=!pending;previewWarning.textContent='Designer को artwork आउन बाँकी छ। तलको झोला final design होइन।';
    $('reviewState').textContent=pending?'Designer ले artwork बनाएपछि मात्र final design approve गर्नुहोस्।':approval?'✓ यो version तपाईंले जाँच गर्नुभयो।':'नाम, फोन र दुवै side जाँच गर्नुहोस्।';
    document.querySelector('.approval-check').hidden=pending;$('approveDesign').hidden=pending;
  }
  function setMode(next){mode=next;for(const [key] of modes){host.querySelector(`[data-journey="${key}"]`).setAttribute('aria-pressed',String(mode===key));$('journey'+({template:'Template',upload:'Upload',help:'Help'}[key])).hidden=mode!==key;}observe();}
  for(const t of templates){const b=document.createElement('button');b.type='button';b.className='template-choice';b.dataset.template=t.id;
    const thumb=document.createElement('div');thumb.className='template-mini template-'+t.id;const name=document.createElement('strong');name.textContent=t.preview;const detail=document.createElement('span');detail.textContent='98XXXXXXXX';thumb.append(name,detail);
    const label=document.createElement('strong');label.textContent=t.label;const sub=document.createElement('small');sub.textContent=t.subtitle;b.append(thumb,label,sub);b.setAttribute('aria-label',t.label+' नमुना प्रयोग गर्नुहोस्');b.onclick=()=>{previous=editor.snapshot();editor.restore({version:1,side:'front',faces:{front:t.front,back:[]}});$('undoTemplate').hidden=false;host.querySelectorAll('[data-template]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));say('नमुना तयार छ। नाम वा फोन थिचेर आफ्नो विवरण राख्नुहोस्।');};host.querySelector('.template-grid').append(b);}
  $('undoTemplate').onclick=()=>{if(previous){editor.restore(previous);previous=null;$('undoTemplate').hidden=true;host.querySelectorAll('[data-template]').forEach(n=>n.setAttribute('aria-pressed','false'));say('अघिल्लो डिजाइन फर्कियो।');}};
  function showAttachments(){
    $('journeyAttachments').replaceChildren();
    for(const a of attachments){const card=document.createElement('div');card.className='attachment-card';if(a.type!=='application/pdf'){const image=document.createElement('img');image.src=a.data;image.alt=a.kind==='reference'?'नमुना फोटो':'ग्राहकको artwork';card.append(image);}else{const icon=document.createElement('span');icon.innerHTML=ui.icon('folder');card.append(icon);}const label=document.createElement('span');label.textContent=a.name;const remove=document.createElement('button');remove.type='button';remove.className='btn small ghost';ui.button(remove,'trash','हटाउनुहोस्');remove.onclick=()=>{attachments=attachments.filter(item=>item!==a);showAttachments();observe();};card.append(label,remove);$('journeyAttachments').append(card);}
  }
  async function fileInput(id,kind){
    const input=$(id),file=input.files[0];if(!file)return;const allowed=kind==='reference'?['image/png','image/jpeg']:['image/png','image/jpeg','application/pdf'];
    if(!allowed.includes(file.type)||file.size>5*1024*1024){say('मिल्ने फाइल छान्नुहोस्, बढीमा 5 MB।');input.value='';return;}
    input.disabled=true;say('फाइल खोल्दै...');
    try{const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
      if(file.type!=='application/pdf'){const image=new Image();image.src=data;await image.decode();if(kind==='artwork'){const doc=editor.snapshot(),ratio=Math.max(.1,Math.min(10,image.naturalWidth/image.naturalHeight)),size=Math.min(160,180*ratio);previous=doc;doc.faces[doc.side]=[{id:'full-artwork',type:'image',src:data,ratio,x:85,y:95,size:Math.min(130,size)}];editor.restore(doc);$('undoTemplate').hidden=false;}}
      attachments=attachments.filter(a=>a.kind!==kind);attachments.push({kind,name:file.name,type:file.type,data});showAttachments();observe();say(kind==='reference'?'फोटो राखियो। विवरण लेख्नुहोस्; designer ले तयार गर्छन्।':file.type==='application/pdf'?'PDF राखियो। Designer को जाँच आवश्यक छ।':'डिजाइन राखियो। झोलामा तानेर मिलाउन सक्नुहुन्छ।');
    }catch{say('फाइल खुलेन। अर्को फाइल छान्नुहोस्।');}finally{input.disabled=false;input.value='';}
  }
  $('fullArtwork').onchange=()=>fileInput('fullArtwork','artwork');$('referencePhoto').onchange=()=>fileInput('referencePhoto','reference');$('designBrief').oninput=observe;
  $('approveCheck').onchange=observe;
  $('approveDesign').onclick=()=>{observe();if($('approveDesign').disabled)return;approval={revision,approvedAt:new Date().toISOString(),status:'CUSTOMER_REVIEWED_DEMO'};observe();};
  function refreshReview(){
    observe();$('reviewSides').replaceChildren();
    if(mode==='help'||attachments.some(a=>a.type==='application/pdf')){const p=document.createElement('p');p.className='notice';p.textContent='Reference / PDF सुरक्षित छ। Designer ले final artwork तयार गरेपछि यहाँ जाँच गर्न मिल्छ।';$('reviewSides').append(p);return;}
    const data=baseGet().editor;
    for(const face of ['front','back']){const tile=document.createElement('div');tile.className='review-side';const title=document.createElement('strong');title.textContent=face==='front'?'अगाडि':'पछाडि';tile.append(title);if(data.faces[face].length){try{const image=document.createElement('img');image.alt=title.textContent+' artwork';image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(editor.artwork(face));tile.append(image);}catch{const p=document.createElement('p');p.textContent='पहिले झोलाको नाप मिलाउनुहोस्।';tile.append(p);}}else{const p=document.createElement('p');p.textContent='खाली';tile.append(p);}$('reviewSides').append(tile);}
    observe();
  }
  document.addEventListener('bag-design-change',observe);
  document.querySelectorAll('[data-step="2"],#nextStep,#requestQuote').forEach(b=>b.addEventListener('click',refreshReview));
  document.querySelectorAll('#w,#h,#g,#qty,#loc,#ins').forEach(n=>n.addEventListener('input',observe));
  editor.getProject=()=>{observe();return {...baseGet(),workflow:{version:1,mode,attachments,brief:$('designBrief').value,revision,approval}};};
  editor.restoreProject=data=>{
    const w=data.workflow;
    if(w && (w.version!==1||!['template','upload','help'].includes(w.mode)||!Array.isArray(w.attachments)||w.attachments.length>2))throw Error('Invalid workflow data.');
    const clean=(w?.attachments||[]).map(a=>{if(!a||!['reference','artwork'].includes(a.kind)||!['image/png','image/jpeg','application/pdf'].includes(a.type)||typeof a.data!=='string'||a.data.length>7100000||!a.data.startsWith('data:'+a.type+';base64,')||!/^[a-z0-9+/=]+$/i.test(a.data.split(',')[1]))throw Error('Invalid attachment.');return {kind:a.kind,name:String(a.name).slice(0,200),type:a.type,data:a.data};});
    loading=true;try{baseRestore(data);attachments=clean;$('designBrief').value=String(w?.brief||'').slice(0,2000);revision=Number.isInteger(w?.revision)&&w.revision>0?w.revision:1;approval=null;lastContent='';setMode(w?.mode||'template');showAttachments();}finally{loading=false;}observe();say('डिजाइन खोलियो। फेरि जाँच गरेर approve गर्नुहोस्।');
  };
  window.designWorkflow={openRequest(){
    observe();
    if(mode==='help'&&!attachments.some(a=>a.kind==='reference')&&!$('designBrief').value.trim()){document.querySelector('[data-step="1"]').click();$('designBrief').focus();say('फोटो राख्नुहोस् वा चाहिएको डिजाइनको विवरण लेख्नुहोस्।');return;}
    const dialog=document.createElement('dialog');dialog.className='demo-dialog';
    const heading=document.createElement('h2');heading.textContent='अनुरोधको नमुना';
    const status=document.createElement('p');status.textContent=mode==='help'?'फोटो / विवरणबाट artwork बनाउने अनुरोध।':attachments.some(a=>a.type==='application/pdf')?'PDF जाँच गरेर quotation तयार गर्ने अनुरोध।':approval?'तपाईंले जाँच गरेको design version '+revision+' सहित quotation अनुरोध।':'Quotation अनुरोध। छाप्नुअघि final artwork approval आवश्यक छ।';
    const note=document.createElement('p');note.textContent='यो demo हो। अनुरोध पठाइएको छैन। डिजाइन फाइल डाउनलोड गरेर व्यवसायलाई दिन सक्नुहुन्छ।';
    const save=document.createElement('button');save.className='btn';ui.button(save,'download','फाइल डाउनलोड');save.onclick=()=>$('downloadDesign').click();
    const close=document.createElement('button');close.className='btn ghost';close.textContent='फर्कनुहोस्';close.onclick=()=>dialog.close();
    dialog.append(heading,status,note,save,close);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
  }};
  // The base customizer has already restored its editor; restore workflow metadata too.
  try{const draft=JSON.parse(localStorage.getItem('sanjana-design-v2'));if(draft?.workflow)editor.restoreProject(draft);}catch{say('पुरानो draft पूर्ण रूपमा खुलेन। डाउनलोड गरेको फाइलबाट फेरि खोल्नुहोस्।');}
  setMode(mode);refreshReview();
})();
