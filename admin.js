(() => {
  const KEY="adriCambiosConfigV1", PIN_KEY="adriCambiosLocalPinV1";
  const defaults={brand:"Adri Cambios",todayRate:0,tomorrowRate:0,feeType:"fixed",feeValue:0,minAmount:0,maxAmount:0,fromCurrency:"COP",toCurrency:"VES",updatedAt:"",tomorrowDate:"",methods:["Transferencia bancaria","Pago móvil","Efectivo"],currencies:["COP","USD","EUR","CLP","PEN"],whatsapp:"584145811952",note:"Confirma la tasa final por WhatsApp antes de realizar el pago."};
  const $=id=>document.getElementById(id);
  const load=()=>{try{return {...defaults,...(window.ADRI_CAMBIOS_CONFIG||{}),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(_){return {...defaults,...(window.ADRI_CAMBIOS_CONFIG||{})}}};
  const safeList=s=>String(s||"").split(",").map(x=>x.trim()).filter(Boolean);
  let cfg=load();
  function fillSelect(id,items,selected){const el=$(id);el.replaceChildren();items.forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;el.append(o)});if(items.includes(selected))el.value=selected;}
  fillSelect("fromCurrency",["COP","USD","EUR","CLP","PEN","VES","ARS","BRL","MXN"],cfg.fromCurrency);
  fillSelect("toCurrency",["VES","COP","USD","EUR","CLP","PEN","ARS","BRL","MXN"],cfg.toCurrency);
  function populate(c=load()){
    ["todayRate","tomorrowRate","feeType","feeValue","minAmount","maxAmount","updatedAt","tomorrowDate","whatsapp","note"].forEach(k=>{const el=$(k+"Input")||$(k);if(el)el.value=c[k]??defaults[k]??""});
    $("currencies").value=(c.currencies||defaults.currencies).join(", ");
    $("methods").value=(c.methods||defaults.methods).join(", ");
    $("fromCurrency").value=c.fromCurrency||"COP";$("toCurrency").value=c.toCurrency||"VES";
  }

  function updateFeeTool(){
    const amount=Number($("feeTestAmount").value)||0;
    const type=$("feeType").value;
    const value=Number($("feeValue").value)||0;
    const fee=type==="percent"?amount*value/100:value;
    const currency=$("fromCurrency").value||"COP";
    const money=n=>Number(n||0).toLocaleString("es-CO",{minimumFractionDigits:2,maximumFractionDigits:2});
    $("feeTestCommission").textContent=money(fee)+" "+currency;
    $("feeTestTotal").textContent=money(amount+fee)+" "+currency;
    $("feeTestPercent").textContent=amount>0?money(fee/amount*100)+"% efectivo":"—";
  }
  ["feeTestAmount","feeType","feeValue","fromCurrency"].forEach(id=>$(id).addEventListener("input",updateFeeTool));
  ["feeType","fromCurrency"].forEach(id=>$(id).addEventListener("change",updateFeeTool));
  function showApp(){ $("loginPanel").hidden=true;$("adminApp").hidden=false;populate();updateFeeTool(); }
  function showLogin(){ $("loginPanel").hidden=false;$("adminApp").hidden=true; }
  const pin=localStorage.getItem(PIN_KEY);
  if(pin) { $("adminPin").placeholder="Introduce tu clave local"; $("resetPin").textContent="Olvidé la clave / cambiar clave local"; }
  $("loginForm").addEventListener("submit",e=>{e.preventDefault();const entered=$("adminPin").value;if(!localStorage.getItem(PIN_KEY)){if(entered.length<4){$("loginError").textContent="Usa al menos 4 caracteres.";return;}localStorage.setItem(PIN_KEY,entered);$("loginError").textContent="";showApp();}else if(entered===localStorage.getItem(PIN_KEY)){$("loginError").textContent="";showApp();}else $("loginError").textContent="Clave incorrecta en este navegador.";});
  $("resetPin").addEventListener("click",()=>{if(confirm("Esto elimina la clave local guardada en este navegador. ¿Continuar?")){localStorage.removeItem(PIN_KEY);$("adminPin").value="";$("adminPin").placeholder="Crea una nueva clave local";$("resetPin").textContent="Configurar clave local";$("loginError").textContent="Clave local eliminada. Crea una nueva al entrar."; }});
  $("logout").addEventListener("click",()=>{showLogin();$("adminPin").value="";});
  $("settingsForm").addEventListener("submit",e=>{e.preventDefault();const n=id=>Number($(id).value)||0;cfg={...cfg,todayRate:n("todayRateInput"),tomorrowRate:n("tomorrowRateInput"),feeType:$("feeType").value,feeValue:n("feeValue"),minAmount:n("minAmount"),maxAmount:n("maxAmount"),fromCurrency:$("fromCurrency").value,toCurrency:$("toCurrency").value,updatedAt:$("updatedAt").value.trim(),tomorrowDate:$("tomorrowDate").value.trim(),currencies:safeList($("currencies").value),methods:safeList($("methods").value),whatsapp:$("whatsapp").value.replace(/\D/g,""),note:$("note").value.trim()};if(!cfg.currencies.length||!cfg.methods.length||!cfg.whatsapp){$("saveStatus").textContent="Revisa monedas, métodos y WhatsApp.";return;}localStorage.setItem(KEY,JSON.stringify(cfg));$("saveStatus").textContent="Guardado en este navegador. Genera site-config.js y súbelo a GitHub para publicar estos valores para todos.";updateFeeTool();});
  $("resetDefaults").addEventListener("click",()=>{if(confirm("¿Restaurar valores iniciales? Se perderán los ajustes locales.")){cfg={...defaults};localStorage.setItem(KEY,JSON.stringify(cfg));populate(cfg);$("saveStatus").textContent="Valores iniciales restaurados."; }});
  function downloadFile(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  $("publishConfig").addEventListener("click",()=>{const c=load();const js="// Configuración pública generada desde el panel de Adri Cambios.\\n// No coloques secretos ni datos bancarios privados aquí.\\nwindow.ADRI_CAMBIOS_CONFIG = "+JSON.stringify(c,null,2)+";\\n";downloadFile("site-config.js",js,"text/javascript");$("saveStatus").textContent="Archivo site-config.js generado. Súbelo al repositorio GitHub y confirma el cambio para que la web pública use estos valores.";});
  $("exportConfig").addEventListener("click",()=>{downloadFile("adri-cambios-config.json",JSON.stringify(load(),null,2),"application/json");});
  $("importConfig").addEventListener("click",()=>$("importFile").click());
  $("importFile").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());cfg={...defaults,...imported};localStorage.setItem(KEY,JSON.stringify(cfg));populate(cfg);$("saveStatus").textContent="Configuración importada en este navegador. Recuerda volver a publicar si quieres que la vean otros clientes.";}catch(_){$("saveStatus").textContent="No se pudo leer el JSON. Usa un archivo de configuración válido.";}e.target.value="";});
})();
