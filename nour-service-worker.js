const CACHE='nour-v1';
const CORE=['./nour-quran.html','./nour-manifest.webmanifest','./nour-icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE))));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok && (event.request.url.includes('everyayah.com') || event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com'))){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match('./nour-quran.html'))));
});
