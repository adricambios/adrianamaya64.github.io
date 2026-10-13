(() => {
  const KEY = "adriCambiosConfigV1";
  const defaults = {
    brand: "Adri Cambios", todayRate: 0, tomorrowRate: 0, feeType: "fixed", feeValue: 0,
    minAmount: 0, maxAmount: 0, fromCurrency: "COP", toCurrency: "VES",
    updatedAt: "", tomorrowDate: "", methods: ["Transferencia bancaria", "Pago móvil", "Efectivo"],
    currencies: ["COP", "USD", "EUR", "CLP", "PEN"], whatsapp: "584145811952",
    note: "Confirma la tasa final por WhatsApp antes de realizar el pago."
  };
  function loadConfig() {
    try { return {...defaults, ...(window.ADRI_CAMBIOS_CONFIG || {}), ...JSON.parse(localStorage.getItem(KEY) || "{}")}; }
    catch (_) { return {...defaults}; }
  }
  const cfg = loadConfig();
  const $ = id => document.getElementById(id);
  const fmt = (n, currency) => new Intl.NumberFormat("es-CO", {style:"decimal", maximumFractionDigits:2, minimumFractionDigits:2}).format(Number(n) || 0) + " " + currency;
  const money = n => Number(n || 0).toLocaleString("es-CO",{maximumFractionDigits:2,minimumFractionDigits:2});
  const rate = Number(cfg.todayRate) || 0, feeValue = Number(cfg.feeValue) || 0;
  $("todayRate").textContent = rate > 0 ? money(rate) : "Por definir";
  $("tomorrowRate").textContent = Number(cfg.tomorrowRate) > 0 ? money(cfg.tomorrowRate) : "Por definir";
  $("todayLabel").textContent = `${cfg.fromCurrency} → ${cfg.toCurrency}`;
  $("tomorrowLabel").textContent = `${cfg.fromCurrency} → ${cfg.toCurrency}`;
  $("updatedAt").textContent = cfg.updatedAt || "Pendiente de configurar";
  $("tomorrowDate").textContent = cfg.tomorrowDate || "Por confirmar";
  $("feeDisplay").textContent = cfg.feeType === "percent" ? `${money(feeValue)}%` : fmt(feeValue, cfg.fromCurrency);
  $("limitsDisplay").textContent = `Mín. ${cfg.minAmount || "—"} · Máx. ${cfg.maxAmount || "—"} ${cfg.fromCurrency}`;
  const currencySelect = $("currency");
  const currencies = Array.isArray(cfg.currencies) && cfg.currencies.length ? cfg.currencies : defaults.currencies;
  currencies.forEach(c => { const o=document.createElement("option");o.value=c;o.textContent=c;currencySelect.appendChild(o); });
  if(currencies.includes(cfg.fromCurrency)) currencySelect.value=cfg.fromCurrency;
  const methodSelect=$("method");
  (cfg.methods.length?cfg.methods:defaults.methods).forEach(m=>{const o=document.createElement("option");o.value=m;o.textContent=m;methodSelect.appendChild(o);});
  $("currencySymbol").textContent = currencySelect.value === "COP" ? "$" : currencySelect.value;
  function calculate(){
    const amount=Math.max(0,Number($("amount").value)||0);
    const fee=cfg.feeType==="percent"?amount*feeValue/100:feeValue;
    const total=amount+fee;
    $("calcFee").textContent=fmt(fee,currencySelect.value);
    $("calcTotal").textContent=fmt(total,currencySelect.value);
    $("calcPercent").textContent=cfg.feeType==="percent"?`${money(feeValue)}%`:(amount>0?`${money(fee/amount*100)}% efectivo`:"—");
    $("receiveAmount").textContent=rate>0?money(amount*rate):"Por definir";
    $("receiveCurrency").textContent=cfg.toCurrency;
    $("calcExplanation").textContent=rate>0?`Estimación calculada con la tasa publicada de ${money(rate)} ${cfg.toCurrency} por cada ${cfg.fromCurrency}. La comisión se suma al monto enviado.`:"Configura una tasa mayor que cero desde el panel de administración. Confirma el valor final por WhatsApp.";
    $("currencySymbol").textContent=currencySelect.value==="COP"||currencySelect.value==="USD"||currencySelect.value==="EUR"?"$":currencySelect.value;
  }
  $("amount").addEventListener("input",calculate);currencySelect.addEventListener("change",calculate);calculate();
  $("year").textContent=new Date().getFullYear();
  $("remitForm").addEventListener("submit",e=>{
    e.preventDefault();
    const amount=Number($("sendAmount").value);
    if(!Number.isFinite(amount)||amount<=0){alert("Introduce un monto válido.");return;}
    if(Number(cfg.minAmount)>0&&amount<Number(cfg.minAmount)){alert(`El monto mínimo es ${cfg.minAmount} ${cfg.fromCurrency}.`);return;}
    if(Number(cfg.maxAmount)>0&&amount>Number(cfg.maxAmount)){alert(`El monto máximo es ${cfg.maxAmount} ${cfg.fromCurrency}.`);return;}
    const message=[
      "Hola, Adri Cambios. Quiero solicitar una remesa.",
      "",`Nombre: ${$("firstName").value.trim()}`,`Apellido: ${$("lastName").value.trim()}`,
      `Documento: ${$("documentId").value.trim()}`,`Teléfono: ${$("phone").value.trim()}`,
      `País de origen: ${$("origin").value}`,`País de destino: ${$("destination").value}`,
      `Método de pago/entrega: ${$("method").value}`,`Monto a enviar: ${money(amount)} ${cfg.fromCurrency}`,
      `Tasa de referencia publicada: ${rate>0?money(rate):"Pendiente de confirmar"}`,
      `Comisión estimada: ${cfg.feeType==="percent"?money(amount*feeValue/100)+" "+cfg.fromCurrency:money(feeValue)+" "+cfg.fromCurrency}`,
      `Total estimado incluyendo comisión: ${money(amount+(cfg.feeType==="percent"?amount*feeValue/100:feeValue))} ${cfg.fromCurrency}`,
      "", "Entiendo que la tasa y disponibilidad deben confirmarse antes de pagar."
    ].join("\n");
    window.open(`https://wa.me/${String(cfg.whatsapp||defaults.whatsapp).replace(/\D/g,"")}?text=${encodeURIComponent(message)}`,"_blank","noopener");
  });
})();
