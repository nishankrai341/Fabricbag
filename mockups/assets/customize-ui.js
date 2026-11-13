// Picture-led controls with short Nepali labels and accessible button names.
(() => {
  const paths={
    bag:'M6 8h12l2 13H4L6 8Zm3 0V6a3 3 0 0 1 6 0v2',
    shopping:'M5 5h14v16H5z M9 8v2a3 3 0 0 0 6 0V8',
    fabric:'M4 9h16v12H4z M8 9V6a4 4 0 0 1 8 0v3 M7 13h10 M7 16h10',
    shape:'m12 3 9 6-3 12H6L3 9 12 3Z',
    name:'M4 9h16v11H4z M3 9l2-5h14l2 5 M8 20v-6h5v6 M16 13h1',
    text:'M4 5h16 M12 5v15 M8 20h8',
    phone:'M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z',
    pin:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    image:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M3 16l5-5 5 5 3-3 5 5 M15 7a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
    center:'M12 3v18 M5 7h14v4H5z M8 14h8v4H8z',
    copy:'M8 8h13v13H8z M16 8V3H3v13h5',
    trash:'M3 6h18 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
    save:'M4 3h13l4 4v14H3V3h1Z M7 3v6h10V3 M7 21v-8h10v8',
    download:'M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5',
    print:'M7 8V3h10v5 M7 17H3V8h18v9h-4 M7 13h10v8H7z',
    folder:'M3 6h7l2 3h9v12H3V6Z',
    arrow:'M4 12h16 m-7-7 7 7-7 7',
    back:'M20 12H4 m7-7-7 7 7 7',
    check:'m5 12 4 4L20 5',
    move:'M12 2v20 M2 12h20 m-6-4 4 4-4 4 M8 4l4-2 4 2 M8 20l4 2 4-2 M6 8l-4 4 4 4',
    size:'M4 8V4h4 M16 4h4v4 M20 16v4h-4 M8 20H4v-4 M8 16l8-8',
    roll:'M5 4h13v16H5 M8 4c-5 0-5 6 0 6h10 M8 10v10 M13 14h5',
    weave:'M4 4h16v16H4z M8 4v16 M12 4v16 M16 4v16 M4 8h16 M4 12h16 M4 16h16'
  };
  // Filled product miniatures make the bag choices easier to recognize.
  const products={
    bag:'<path d="M17 16v-4a7 7 0 0 1 14 0v4" fill="none" stroke="#314e78" stroke-width="3"/><path d="M12 15h24l3 27H9z" fill="#6488ba"/><path d="m12 15-3 27h6l2-27" fill="#456998"/><path d="M20 26h10v8H20z" fill="#fff" opacity=".85"/>',
    shopping:'<path d="M10 7h28v35H10z" fill="#e4ae77"/><path d="M10 7h6v35h-6z" fill="#c78d58"/><path d="M18 15v3a6 6 0 0 0 12 0v-3" fill="none" stroke="#765039" stroke-width="3" stroke-linecap="round"/><path d="M18 30h12" stroke="#fff6e9" stroke-width="3" stroke-linecap="round"/>',
    fabric:'<path d="M17 17V11a7 7 0 0 1 14 0v6" fill="none" stroke="#427361" stroke-width="3"/><path d="M9 15h30l-2 27H11z" fill="#7eac97"/><path d="m9 15 2 27h5l-1-27" fill="#5b8b76"/><path d="M16 21h16v14H16z" fill="none" stroke="#cde3d7" stroke-width="1.5" stroke-dasharray="2 2"/>',
    shape:'<path d="M17 13a7 7 0 0 1 14 0" fill="none" stroke="#9270a9" stroke-width="3"/><path d="m10 15 14-4 14 4-3 27H13z" fill="#b69ac9"/><path d="m10 15 3 27h5l-2-26" fill="#9473ad"/><path d="m24 23 2 4 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#f8f1ff"/>',
    roll:'<path d="M13 10h22v31H13z" fill="#93b3d2"/><ellipse cx="13" cy="10" rx="6" ry="5" fill="#d4e2ef"/><path d="M7 10v26a6 5 0 0 0 12 0V10" fill="#638bae"/><ellipse cx="13" cy="10" rx="6" ry="5" fill="#c8dced"/><ellipse cx="13" cy="10" rx="2" ry="1.7" fill="#4a6b89"/><path d="M24 17h7M24 23h7M24 29h7" stroke="#dceaf4" stroke-width="2"/>',
    weave:'<path d="m8 9 28-3 5 33-29 4z" fill="#88ad99"/><path d="m14 10 4 30m4-31 4 30m4-31 4 30M11 17l26-3M12 25l26-3M13 33l26-3" stroke="#c9ded0" stroke-width="2"/><path d="m8 9 4 34-5-4L4 13z" fill="#5f8872"/>'
  };
  const accents={name:'#dae6fa',text:'#e7ddf3',phone:'#d7ecdf',pin:'#f9e0d7',image:'#dee7fb',trash:'#f8dce1',copy:'#e4def3',save:'#d9eade',print:'#dce6ee',download:'#dce7fa',center:'#e1e8f2',folder:'#f6e7cd'};
  const icon=name=>products[name]
    ? `<svg class="product-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><ellipse cx="24" cy="43" rx="16" ry="2" fill="#172e44" opacity=".08"/>${products[name]}</svg>`
    : `<svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="1" y="1" width="22" height="22" rx="7" fill="${accents[name]||'#e2eaf5'}" stroke="none"/><g transform="translate(3 3) scale(.75)"><path d="${paths[name]||paths.text}"/></g></svg>`;
  function button(node,name,label,accessible=label){if(!node)return;node.innerHTML=icon(name);const caption=document.createElement('span');caption.lang='ne';caption.textContent=label;node.append(caption);node.setAttribute('aria-label',accessible);node.title=accessible;}
  const $=id=>document.getElementById(id);
  document.body.classList.add('visual-customizer');
  document.getElementById('main').lang='ne';
  document.querySelector('.page-intro h1').textContent='आफ्नै झोला बनाउनुहोस्';
  document.querySelector('.page-intro .eyebrow').textContent='तपाईंको झोला · तपाईंको डिजाइन';
  document.querySelector('.page-intro .lead').textContent='छान्नुहोस् → सजाउनुहोस् → तयार';
  document.querySelector('.page-intro + .hint').textContent='नमुना डिजाइन · अर्डर पठाइएको छैन';
  const steps=[['bag','झोला'],['image','डिजाइन'],['check','तयार']];
  document.querySelectorAll('[data-step]').forEach((b,i)=>button(b,...steps[i]));
  const headings=['झोला छान्नुहोस्','डिजाइन मिलाउनुहोस्','कति वटा चाहिन्छ?'];
  document.querySelectorAll('.wizard-panel > h2').forEach((h,i)=>h.textContent=headings[i]);
  document.querySelectorAll('.wizard-panel > .hint,.editor-intro').forEach(n=>n.hidden=true);
  const groups={type:[['shopping','सपिङ'],['bag','ह्यान्डल'],['fabric','कपडा'],['shape','अरू']],material:[['roll','प्लास्टिक'],['weave','नन-वोभन'],['fabric','कपडा']],sides:[['bag','एकातिर'],['copy','दुवैतिर']],handle:[['bag','गोलो'],['fabric','लामो'],['shopping','काटेको']]};
  for(const [key,options] of Object.entries(groups))document.querySelectorAll(`.opt-group[data-key="${key}"] .opt`).forEach((b,i)=>{b.dataset.value=b.textContent.trim();button(b,...options[i]);b.classList.add('picture-option');});
  document.querySelectorAll('[data-size]').forEach((b,i)=>{button(b,'bag',['सानो','ठूलो','आफ्नै नाप'][i]);b.classList.add('size-option');b.style.setProperty('--bag-scale',[.65,.95,.8][i]);});
  document.querySelectorAll('.step-h').forEach((row,i)=>{row.querySelector('h3').textContent=['झोलाको प्रकार','कस्तो कपडा?','रङ','नाप','छपाइ','ह्यान्डल','संख्या र ठेगाना'][i];});
  const labels={addName:['name','नाम'],addDetails:['phone','फोन'],addText:['text','अरू लेख्नुहोस्'],centerElement:['center','बीचमा'],duplicateElement:['copy','कपी'],deleteElement:['trash','हटाउनुहोस्'],downloadDesign:['download','डिजाइन लिनुहोस्'],downloadArtwork:['print','प्रिन्ट फाइल'],saveDesign:['save','सेभ'],requestQuote:['check','हेर्नुहोस्'],frontSide:['bag','अगाडि'],backSide:['bag','पछाडि']};
  for(const [id,args] of Object.entries(labels))button($(id),...args);
  const address=document.createElement('button');address.type='button';address.className='btn small ghost';address.id='addAddress';button(address,'pin','ठेगाना');$('addText').before(address);
  const logoLabel=document.querySelector('label[for="file"]');button(logoLabel,'image','लोगो / फोटो');logoLabel.classList.add('logo-picker');logoLabel.tabIndex=0;logoLabel.setAttribute('role','button');logoLabel.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('file').click();}};
  $('file').classList.add('visually-hidden');
  document.querySelector('.upload-zone > .hint').textContent='PNG / JPG · 5 MB';
  document.querySelector('label[for="layerList"]').textContent='के मिलाउने?';
  const chips=document.createElement('div');chips.id='visualLayers';chips.className='visual-layers';chips.setAttribute('aria-label','डिजाइनका भागहरू');$('layerList').before(chips);$('layerList').classList.add('visually-hidden');
  document.querySelector('label[for="shop"]').textContent='यहाँ लेख्नुहोस्';$('shop').placeholder='आफ्नो नाम / विवरण';
  document.querySelector('label[for="fontFamily"]').textContent='अक्षर';document.querySelector('label[for="inkColor"]').textContent='रङ';
  Array.from($('fontFamily').options).forEach((o,i)=>o.textContent=['Aa — सरल','Aa — क्लासिक','Aa — मोनो'][i]);
  const boldLabel=$('boldText').parentElement;boldLabel.lastChild.textContent=' B — बाक्लो';
  const sizeLabel=document.querySelector('label[for="elementSize"]');sizeLabel.firstChild.textContent='सानो ↔ ठूलो ';
  const adjust=document.createElement('div');adjust.className='size-adjust';
  for(const [direction,label] of [[-1,'−'],[1,'+']]){const b=document.createElement('button');b.type='button';b.className='opt';b.textContent=label;b.setAttribute('aria-label',direction<0?'सानो बनाउनुहोस्':'ठूलो बनाउनुहोस्');b.onclick=()=>{$('elementSize').value=Number($('elementSize').value)+direction*2;$('elementSize').dispatchEvent(new Event('input',{bubbles:true}));};adjust.append(b);}
  $('elementSize').before(adjust);adjust.insertBefore($('elementSize'),adjust.lastChild);
  const positionRow=$('positionX').closest('.row2');const more=document.createElement('details');more.className='precise-position';const summary=document.createElement('summary');summary.textContent='ठ्याक्कै नाप मिलाउने';positionRow.before(more);more.append(summary,positionRow);
  const pad=document.createElement('div');pad.className='move-pad';pad.setAttribute('aria-label','डिजाइन सार्नुहोस्');
  for(const [symbol,label,axis,delta] of [['↑','माथि','positionY',-3],['←','बायाँ','positionX',-3],['↓','तल','positionY',3],['→','दायाँ','positionX',3]]){const b=document.createElement('button');b.type='button';b.className='opt';b.innerHTML=`<b aria-hidden="true">${symbol}</b><span>${label}</span>`;b.setAttribute('aria-label',label+' सार्नुहोस्');b.onclick=()=>{$(axis).value=Math.max(0,Math.min(100,Number($(axis).value)+delta));$(axis).dispatchEvent(new Event('input',{bubbles:true}));};pad.append(b);}
  more.before(pad);
  document.querySelector('.preview-caption h3').textContent='तपाईंको झोला';document.querySelector('.preview-caption .badge').innerHTML=icon('move')+' तानेर सार्नुहोस्';
  document.querySelector('.canvas-help').innerHTML=icon('move')+' छुनुहोस् → तान्नुहोस्';
  const guideLabel=$('showGuides').parentElement;guideLabel.lastChild.textContent=' छाप्ने ठाउँ';
  document.querySelector('#printGuides text').textContent='PRINT';
  document.querySelector('.preview .notice').textContent='नमुना मात्र। छाप्नुअघि नाप र डिजाइन पक्का गरिन्छ।';
  document.querySelector('.import-design').firstChild.textContent='📂 सेभ गरेको खोल्नुहोस्';
  document.querySelector('label[for="qty"]').textContent='कति वटा?';document.querySelector('label[for="loc"]').textContent='कहाँ पठाउने?';$('loc').placeholder='ठाउँ / जिल्ला';document.querySelector('label[for="ins"]').textContent='अरू कुरा';$('ins').placeholder='यहाँ लेख्नुहोस्';
  document.querySelector('label[for="w"]').textContent='↔ चौडाइ (mm)';document.querySelector('label[for="h"]').textContent='↕ उचाइ (mm)';document.querySelector('label[for="g"]').textContent='▱ मोटाइ (mm)';
  $('editorStatus').textContent='छुनुहोस् र तानेर मिलाउनुहोस्।';
  window.customizerUI={icon,button,layers(elements,selected,onSelect){chips.replaceChildren();elements.forEach(e=>{const b=document.createElement('button');b.type='button';b.className='layer-chip';button(b,e.type==='image'?'image':'text',e.type==='image'?'लोगो':e.text||'लेख्नुहोस्');b.setAttribute('aria-pressed',String(e.id===selected));b.onclick=()=>onSelect(e.id);chips.append(b);});if(!elements.length)chips.textContent='＋ नाम वा लोगो थप्नुहोस्';}};
})();
