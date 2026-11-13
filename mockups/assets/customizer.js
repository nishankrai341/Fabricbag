// Interactive local prototype. No data is submitted to a server.
(() => {
  const $ = s => document.querySelector(s);
  const state = {type:'Handle bag',material:'Plastic',color:'#FFFFFF',print:'Custom artwork',sides:'One side',handle:'Loop handle'};
  let step = 1;
  const fields = ['w','h','g','qty','loc','ins'];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function errors() {
    const w = Number($('#w').value), h = Number($('#h').value), g = Number($('#g').value), q = Number($('#qty').value);
    const result = [];
    if (!Number.isFinite(w) || w < 150 || w > 600) result.push('Enter a width from 150 to 600 mm.');
    if (!Number.isFinite(h) || h < 200 || h > 800) result.push('Enter a height from 200 to 800 mm.');
    if ($('#g').value === '' || !Number.isFinite(g) || g < 0 || g > 200) result.push('Enter a gusset from 0 to 200 mm.');
    if (!Number.isInteger(q) || q < 100) result.push('Enter a whole quantity of at least 100 bags.');
    return result;
  }
  function render() {
    document.querySelectorAll('.opt-group[data-key]').forEach(group => group.querySelectorAll('.opt').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.value || b.textContent.trim()) === state[group.dataset.key]))));
    document.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.color === state.color)));
    $('#bagBody').setAttribute('fill',state.color);
    window.bagEditor.render();
    $('#handleG').style.display = ['Handle bag','Fabric bag'].includes(state.type) ? '' : 'none';
    const handle = $('#handleG path');
    handle.setAttribute('d', state.handle === 'Cut-out handle' ? 'M112 103 H188' : 'M95 72 C95 8 205 8 205 72');
    const errs = errors();
    $('#errs').innerHTML = errs.filter(e => !e.includes('quantity')).map(e => '<div class="err">'+e+' <span class="hint">(demo limits)</span></div>').join('');
    $('#priceState').innerHTML = errs.length ? '<strong>Check your details</strong><p class="err">'+errs.map(escape).join('<br>')+'</p>' : '<strong>Made to your requirements</strong><br><span class="hint">Request a quotation for pricing and delivery. Your artwork will be confirmed before production.</span>';
    $('#requestQuote').disabled = errs.length > 0;
    const rows = [['Bag',state.type],['Material',state.material],['Size',`${$('#w').value} - ${$('#h').value} - ${$('#g').value} mm`],['Printing',state.print],['Handle',state.handle],['Quantity',$('#qty').value+' pcs']];
    $('#summary').innerHTML = '<caption class="hint" style="text-align:left;margin-bottom:6px">Your design at a glance</caption><tbody>'+rows.map(([a,b])=>`<tr><th scope="row" style="background:none">${escape(a)}</th><td>${escape(b)}</td></tr>`).join('')+'</tbody>';
  }
  function showStep(index, focus = false) {
    step = index;
    document.querySelector('.cz').classList.toggle('editor-mode',step===1);
    document.querySelectorAll('[data-panel]').forEach(p => p.hidden = Number(p.dataset.panel) !== step);
    document.querySelectorAll('[data-step]').forEach(b => { if(Number(b.dataset.step) === step) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); });
    $('#prevStep').hidden = step === 0;
    $('#nextStep').hidden = step === 2;
    $('#nextStep').textContent = step === 0 ? 'Continue to branding' : 'Continue to quantity';
    window.customizerUI?.button($('#nextStep'),'arrow',step===0?'डिजाइन गरौँ':'अर्को');
    window.customizerUI?.button($('#prevStep'),'back','पछाडि');
    if (focus) { const heading = $(`[data-panel="${step}"] h2`); heading.tabIndex = -1; heading.focus({preventScroll:true}); heading.scrollIntoView({block:'nearest',behavior:'auto'}); }
  }
  document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.step),true)));
  $('#nextStep').addEventListener('click',()=>{ if(step === 0 && errors().some(e=>!e.includes('quantity'))) { $('#w').focus(); render(); return; } showStep(Math.min(2,step+1),true); });
  $('#prevStep').addEventListener('click',()=>showStep(Math.max(0,step-1),true));
  document.querySelectorAll('.opt-group[data-key]').forEach(group=>group.addEventListener('click',e=>{ const b=e.target.closest('.opt'); if(!b)return; state[group.dataset.key]=b.dataset.value||b.textContent.trim(); render(); }));
  document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{state.color=b.dataset.color;render();}));
  document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{ document.querySelectorAll('[data-size]').forEach(x=>x.setAttribute('aria-pressed',String(x===b))); if(b.dataset.size !== 'custom') b.dataset.size.split(',').forEach((v,i)=>$('#'+['w','h','g'][i]).value=v); else $('#w').focus(); render(); }));
  fields.forEach(id=>$('#'+id).addEventListener('input',render));
  $('#saveDesign').addEventListener('click',()=>{
    try {localStorage.setItem('sanjana-design-v2',JSON.stringify(window.bagEditor.getProject()));window.demoToast('Draft saved on this device, including both sides and logo images.');}
    catch {window.demoToast('Your browser could not save this draft. Please allow local storage.');}
  });
  $('#requestQuote').addEventListener('click',()=>{
    if(step!==2){showStep(2,true);return;}
    if(errors().length){render();return;}
    if(window.designWorkflow){window.designWorkflow.openRequest();return;}
    const dialog=document.createElement('dialog');dialog.className='demo-dialog';
    const h=document.createElement('h2');h.textContent='Your design is ready to review';
    const p=document.createElement('p');p.textContent=`${state.type} - ${state.material} - ${$('#qty').value} bags. This is a design demo. No quotation has been sent. Download the design file to share the exact layout and logo images with the business, or save your draft on this device.`;
    const close=document.createElement('button');close.className='btn';close.textContent='Back to my design';close.onclick=()=>dialog.close();
    dialog.append(h,p,close);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
  });
  window.bagEditor.getProject = () => ({state:{...state},fields:Object.fromEntries(fields.map(id=>[id,$('#'+id).value])),editor:window.bagEditor.snapshot()});
  window.bagEditor.restoreProject = data => {
    if(!data || !data.editor) throw Error('Design data is missing.');
    window.bagEditor.restore(data.editor);
    if(data.state)for(const key of Object.keys(state))if(typeof data.state[key]==='string')state[key]=data.state[key];
    if(data.fields)fields.forEach(id=>{if(typeof data.fields[id]==='string')$('#'+id).value=data.fields[id];});
    render();
  };
  document.addEventListener('bag-both-sides',()=>{state.sides='Both sides';render();});
  try { const draft=JSON.parse(localStorage.getItem('sanjana-design-v2'));if(draft)window.bagEditor.restoreProject(draft); } catch {}
  showStep(1);render();
})();
