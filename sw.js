/*
 * sw.js — que el cancionero abra sin internet.
 * ---------------------------------------------------------------------------
 * El problema que resuelve: las canciones estan guardadas, pero el PROGRAMA
 * que las enseña vive en GitHub Pages y hay que descargarlo. En un local con
 * mala cobertura, o en un sotano de ensayo, no habia cancionero.
 *
 * La version la estampa construir.py con una huella del index.html generado,
 * asi que cada publicacion estrena cache y la anterior se borra sola. No lo
 * pongas a mano.
 *
 * Estrategia, y es deliberada:
 *
 *   - La pagina y el firebase.json van a RED PRIMERO, con la cache como red
 *     de seguridad. Es la misma idea que el Cache-Control: no-cache de §5.10 —
 *     "pregunta antes de usar lo guardado". Si sirviera la cache primero, una
 *     version vieja de la app podria quedarse pegada para siempre, que es
 *     justo el fallo que mas cuesta ver.
 *   - Las librerias externas (Firebase, JSZip, pdf.js) van a CACHE PRIMERO:
 *     sus URL llevan el numero de version dentro, asi que nunca cambian de
 *     contenido. Ademas es lo que permite importar un Word sin conexion.
 *   - Solo GET, y solo lo de arriba. Nada de interceptar las escrituras de
 *     Firestore: de su propio trabajo sin conexion se encarga el SDK.
 */
const VERSION = '54f5185c681a';
const CACHE = 'cancionero-' + VERSION;

// Lo minimo para arrancar: la propia pagina y la configuracion del almacen.
const IMPRESCINDIBLE = ['./', './index.html'];

const ES_LIBRERIA = (url) =>
  url.startsWith('https://www.gstatic.com/firebasejs/') ||
  url.startsWith('https://cdnjs.cloudflare.com/ajax/libs/');

self.addEventListener('install', (ev) => {
  ev.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // El firebase.json puede no existir (copia suelta, o dentro de claude.ai):
    // que falte no puede tumbar la instalacion.
    await cache.addAll(IMPRESCINDIBLE).catch(() => {});
    await cache.add('./firebase.json').catch(() => {});
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.map((n) => (n !== CACHE && n.startsWith('cancionero-'))
      ? caches.delete(n) : null));
    await self.clients.claim();
  })());
});

async function redPrimero(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const guardado = await cache.match(req, {ignoreSearch: true});
    if (guardado) return guardado;
    throw e;
  }
}

async function cachePrimero(req) {
  const cache = await caches.open(CACHE);
  const guardado = await cache.match(req);
  if (guardado) return guardado;
  const res = await fetch(req);
  // Una respuesta opaca (script de otro dominio) tambien sirve: se guarda tal
  // cual y se devuelve igual la proxima vez.
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  const url = req.url;
  if (ES_LIBRERIA(url)) { ev.respondWith(cachePrimero(req)); return; }

  if (req.mode === 'navigate') { ev.respondWith(redPrimero(req)); return; }

  if (url.startsWith(self.registration.scope)) {
    const camino = url.slice(self.registration.scope.length).split('?')[0];
    if (camino === '' || camino === 'index.html' || camino === 'firebase.json'
        || camino === 'repertorio.json') {
      ev.respondWith(redPrimero(req));
    }
  }
});
