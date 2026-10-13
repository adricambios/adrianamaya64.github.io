# Adri Cambios — GitHub Pages (estático)

Versión sin servidor, sin base de datos, sin Cloudflare, sin Workers, sin KV y sin WordPress. Tema negro y dorado, calculadora pública de remesas, calculadora interna de comisiones, tasas, formulario que prepara WhatsApp y panel para editar la configuración.

## Publicar por primera vez
1. Crea el repositorio `adri-cambios` en GitHub.
2. Sube todos los archivos y carpetas del ZIP a la raíz del repositorio (no subas solo el ZIP).
3. En GitHub abre **Settings → Pages**. Selecciona **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
4. Abre la URL que GitHub Pages te muestre.

## Cómo actualizar las tasas y opciones
1. Abre `https://TU-USUARIO.github.io/adri-cambios/admin.html`.
2. En la primera visita, crea una clave local. Esta clave solo oculta el panel en ese navegador; no es seguridad real.
3. Cambia tasas, comisión fija o porcentual (por ejemplo, 8%), límites, monedas, métodos y WhatsApp. La calculadora interna muestra la comisión, el total del cliente y el porcentaje efectivo. Guarda.
4. Pulsa **Generar archivo para publicar en GitHub**. Se descargará un archivo llamado `site-config.js`.
5. En tu repositorio de GitHub, abre el archivo `site-config.js`, pulsa el lápiz para editarlo o usa **Add file → Upload files** para subir el archivo descargado con el mismo nombre y reemplazar el anterior. Confirma el cambio (Commit changes).
6. Cuando GitHub Pages termine de publicar, todos los visitantes recibirán los valores de la configuración nueva. Puede tardar un poco en actualizarse por la publicación/caché.

## Limitaciones inevitables de una web estática
- No hay base de datos ni servidor. El navegador no puede escribir directamente en los archivos del repositorio publicado.
- Guardar en el panel afecta primero al navegador actual. Para actualizar el sitio público para todos, el panel genera `site-config.js` y debes subir ese archivo a GitHub y confirmar el cambio. Esta es la forma de hacerlo solo con GitHub Pages y sin otro servicio.
- La clave local del panel no protege realmente la administración: cualquier persona que conozca la URL puede inspeccionar archivos y la configuración pública. No uses este diseño para guardar secretos ni datos privados.
- Las tasas comienzan en cero para no inventar cotizaciones. Configura las tasas reales y confirma cada operación por WhatsApp.
- El formulario abre WhatsApp con la solicitud preparada; el usuario aún debe pulsar Enviar.
- No solicites contraseñas bancarias, claves de Binance ni códigos de verificación.
