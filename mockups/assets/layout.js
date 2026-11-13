// Shared header/footer for the static mockups. DEMO ONLY.
(function () {
  const ph = (t) => `<span class="pending">${t}</span>`;
  const active = document.body.dataset.page || "";
  const link = (href, key, label) =>
    `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;

  const logo = `<a class="logo" href="index.html" aria-label="Sanjana Plastic & Business Link home">
      <span class="logo-mark" title="Placeholder - original approved logo to be supplied">SP</span>
      <span>Sanjana Plastic &amp; Business Link<small>सञ्जना प्लास्टिक एण्ड बिजनेस लिंक</small></span></a>`;

  const header = `
  <a class="skip" href="#main">Skip to content</a>
  <div class="topbar"><div class="container">
    <span>Tarkeshwor-6, Dharmasthali, Kathmandu</span>
    <span>Call: <a href="tel:9851255796">9851255796</a> · <a href="tel:9841180105">9841180105</a></span>
  </div></div>
  <header class="main"><div class="container">
    ${logo}
    <button class="menu-btn" aria-label="Menu" aria-controls="nav" aria-expanded="false" id="menuBtn">☰</button>
    <nav class="primary" id="nav" aria-label="Main">
      ${link("products.html", "products", "Products")}
      ${link("customize.html", "customize", "Customize Bag")}
      ${link("index.html#how", "how", "How it works")}
      ${link("index.html#contact", "contact", "Contact")}
      <a href="#" title="Language toggle (EN / नेपाली)">EN | नेपाली</a>
      ${link("account.html", "account", "My Account")}
      <a class="btn red small" href="customize.html">Request Quotation</a>
    </nav>
  </div></header>
  <div class="demo-ribbon">DESIGN PREVIEW &middot; Sample products and rates &middot; No orders or requests are submitted</div>`;

  const footer = `
  <footer class="site">
    <div class="container">
      <div class="brand">
        <span class="logo-mark">SP</span>
        <div>
          <strong style="color:#fff;font-size:1.15rem">Sanjana Plastic &amp; Business Link</strong><br>
          <span>सञ्जना प्लास्टिक एण्ड बिजनेस लिंक</span><br>
          <span>Tarkeshwor-6, Dharmasthali, Kathmandu</span> ·
          <a href="tel:9851255796">9851255796</a> · <a href="tel:9841180105">9841180105</a>
        </div>
      </div>
      <div class="cols">
        <div><h4>Company</h4><ul><li><a href="#">About Us</a></li><li><a href="index.html#contact">Contact Us</a></li><li><a href="#">Wholesale Supply</a></li></ul></div>
        <div><h4>Products</h4><ul><li><a href="products.html">Fabric Rolls</a></li><li><a href="products.html">Plastic Rolls</a></li><li><a href="products.html">Shopping Bags</a></li><li><a href="products.html">Handle Bags</a></li><li><a href="customize.html">Custom Printed Bags</a></li></ul></div>
        <div><h4>Customer Support</h4><ul><li><a href="account.html">My Account</a></li><li><a href="account.html">My Orders</a></li><li><a href="customize.html">Request Quotation</a></li><li><a href="#">Delivery Information</a></li></ul></div>
        <div><h4>Contact</h4><ul>
          <li>Tarkeshwor-6, Dharmasthali, Kathmandu</li>
          <li>9851255796</li><li>9841180105</li>
          <li>${ph("WhatsApp - shown only when verified")}</li>
          <li>${ph("Email - to be supplied")}</li>
          <li>${ph("Business hours - to be supplied")}</li></ul></div>
      </div>
      <div class="legal">
        <span>© <span id="yr"></span> Sanjana Plastic &amp; Business Link ${ph("· PAN/VAT shown only when verified")}</span>
        <nav aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms and Conditions</a><a href="#">Return/Cancellation Policy</a></nav>
      </div>
    </div>
  </footer>
  <div class="sticky-cta"><a class="btn" href="tel:9851255796">Call</a><a class="btn red" href="customize.html">Get Quote</a></div>`;

  document.querySelectorAll("[data-slot=header]").forEach((e) => (e.outerHTML = header));
  document.querySelectorAll("[data-slot=footer]").forEach((e) => (e.outerHTML = footer));
  const y = document.getElementById("yr"); if (y) y.textContent = new Date().getFullYear();
  const b = document.getElementById("menuBtn"), n = document.getElementById("nav");
  if (b) b.addEventListener("click", () => { const o = n.classList.toggle("open"); b.setAttribute("aria-expanded", o); });
})();

// Shared prototype feedback. Financial and account actions remain demonstrations.
(() => {
  let timer;
  window.demoToast = message => {
    document.querySelector('.toast')?.remove();
    clearTimeout(timer);
    const toast = document.createElement('div');
    toast.className = 'toast'; toast.setAttribute('role','status');toast.textContent = message;
    document.body.append(toast);timer = setTimeout(()=>toast.remove(),6500);
  };
  document.addEventListener('click',e=>{
    const placeholder = e.target.closest('a[href="#"]');
    if(placeholder) { e.preventDefault();window.demoToast(placeholder.textContent.trim() + ' is a demo feature. No changes were made.'); }
  });
  document.querySelector('.mobile-admin-toggle')?.addEventListener('click',e=>{
    const expanded = document.getElementById('adminMenu').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(expanded));
  });
  document.querySelectorAll('.tabs a').forEach(link=>link.addEventListener('click',()=>{if(link.hash.length>1){document.querySelectorAll('.tabs a').forEach(a=>a.classList.remove('active'));link.classList.add('active');}}));
  document.querySelector('#profile .btn')?.addEventListener('click',()=>window.demoToast('Profile preview only. Account details have not been saved.'));
  document.getElementById('menuBtn')?.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('nav').classList.remove('open');e.currentTarget.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('nav')?.classList.remove('open');document.getElementById('menuBtn')?.setAttribute('aria-expanded','false');}});
  document.querySelectorAll('nav.primary a').forEach(a=>{if(a.classList.contains('active'))a.setAttribute('aria-current','page');});
})();
