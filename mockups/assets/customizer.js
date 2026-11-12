// Customizer behaviour - DEMO ONLY. Limits below are placeholders, NOT real manufacturing limits.
(function () {
  const DEMO_LIMITS = { w: [150, 600], h: [200, 800], g: [0, 200], minQty: 100 }; // mm / pcs (placeholder)
  const $ = (s) => document.querySelector(s);
  const state = { type: "Handle bag", material: "Plastic", color: "#FFFFFF", print: "Shop name", sides: "One side" };

  // Toggle button groups
  document.querySelectorAll(".opt-group[data-key]").forEach((g) => {
    g.addEventListener("click", (e) => {
      const b = e.target.closest(".opt"); if (!b) return;
      g.querySelectorAll(".opt").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      state[g.dataset.key] = b.dataset.value || b.textContent.trim();
      render();
    });
  });
  document.querySelectorAll(".swatch").forEach((s) =>
    s.addEventListener("click", () => {
      document.querySelectorAll(".swatch").forEach((x) => x.setAttribute("aria-pressed", "false"));
      s.setAttribute("aria-pressed", "true"); state.color = s.dataset.color; render();
    }));
  ["shop", "w", "h", "g", "qty"].forEach((id) => { const el = $("#" + id); if (el) el.addEventListener("input", render); });

  function lum(hex) { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }

  function render() {
    const bag = $("#bagBody"); if (!bag) return;
    bag.setAttribute("fill", state.color);
    const dark = lum(state.color) < 0.5;
    const ink = dark ? "#fff" : "#12336B";
    const shop = ($("#shop").value || "Your Shop Name").slice(0, 28);
    const t = $("#bagText"); t.textContent = shop; t.setAttribute("fill", ink);
    const showText = state.print === "Shop name" || state.print === "Logo + name";
    const showLogo = state.print === "Logo" || state.print === "Logo + name" || state.print === "Custom artwork";
    t.style.display = showText ? "" : "none";
    $("#bagLogo").style.display = showLogo ? "" : "none";
    $("#bagLogo").setAttribute("stroke", ink);
    $("#bagLogoText").setAttribute("fill", ink);
    $("#bagLogoText").textContent = state.print === "Custom artwork" ? "ART" : "LOGO";
    $("#sidesLbl").textContent = state.print === "No printing" ? "No printing" : state.sides + " print";
    $("#handleG").style.display = state.type === "Handle bag" || state.type === "Fabric bag" ? "" : "none";

    // validation
    const w = +$("#w").value, h = +$("#h").value, g = +$("#g").value, q = +$("#qty").value;
    const errs = [];
    if (w && (w < DEMO_LIMITS.w[0] || w > DEMO_LIMITS.w[1])) errs.push(`Width must be ${DEMO_LIMITS.w[0]}-${DEMO_LIMITS.w[1]} mm (demo limit)`);
    if (h && (h < DEMO_LIMITS.h[0] || h > DEMO_LIMITS.h[1])) errs.push(`Height must be ${DEMO_LIMITS.h[0]}-${DEMO_LIMITS.h[1]} mm (demo limit)`);
    if (g && g > DEMO_LIMITS.g[1]) errs.push(`Gusset up to ${DEMO_LIMITS.g[1]} mm (demo limit)`);
    if (q && q < DEMO_LIMITS.minQty) errs.push(`Minimum order quantity is ${DEMO_LIMITS.minQty} pcs (demo value)`);
    $("#errs").innerHTML = errs.map((e) => `<div class="err">${e}</div>`).join("");

    const ps = $("#priceState");
    if (errs.length) ps.innerHTML = `<strong>Check your size / quantity</strong><br><span class="hint">Values outside limits cannot be quoted automatically.</span>`;
    else ps.innerHTML = `<strong>Request Custom Quotation</strong><br><span class="hint">No approved rate exists for this configuration. The owner will review and reply. (Demo: when an approved rate exists and the customer is approved, a direct "Place Order" button appears here.)</span>`;
    $("#summary").innerHTML = [
      ["Type", state.type], ["Material", state.material], ["Size", `${w || "–"} × ${h || "–"} × ${g || "–"} mm`],
      ["Printing", state.print === "No printing" ? "None" : `${state.print}, ${state.sides}`], ["Quantity", q ? q + " pcs" : "–"],
    ].map(([a, b]) => `<tr><td class="hint">${a}</td><td><b>${b}</b></td></tr>`).join("");
  }
  render();
})();
