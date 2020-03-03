# Avoiding corrupted content errors with Service Workers
<p class = "article-date">2020/03/03</p>

At the time of writing I just finished writing my second service worker for a website and ran into another bunch of Corrupted Content Errors.

There are several ways you can cause this and none of them are particularly easy to Google the solution to because if you just search for "Corrupted Content Error" all you see are these errors in production sites that end users have experienced.

## Service Worker 101

To understand why these errors can be introduced into service worker code by accident it is helpful to recap how a service worker works.

You will probably register the service worker using code like the following example in a JavaScript file that is executed on every webpage of your site.

```js
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
}
```

Then in a JavaScript file which the web server makes public at `/service-worker.js` (or whatever you've named it as) you put the actual service worker (not in the `<head>` of any of your webpages).

The service worker will probably contain an `install` event, and a `fetch` event which will look a little bit like below:

```js
const CACHE_VERSION = 'v1'
const CACHE_NAME = `cache-name`
const CACHE_FILE_URLS = [
  '/',
  '/foo',
  '/foobar'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILE_URLS)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(...)
})
```

This rough structure will add all the files listed in `CACHE_FILE_URLS` to the service worker's cache when it installs. Once the service worker is installed the service worker will listen to every `fetch` event the browser makes for the webpage and be able to intercept it.

So far so good.

[MDN gives an example](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers) for the fetch event which will perform a strategy of cache then network

```js
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Service Worker] Fetching resource: '+e.request.url)
      return r || fetch(e.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url)
          cache.put(e.request, response.clone())
          return response
        })
      })
    })
  )
})
```

Understanding the asyncronous control flow can be a little tricky using `.then()`s so presented below is the ES7 version

```js
self.addEventListener('fetch', (e) => {
  e.respondWith(async () => {
    const cacheResponse = await caches.match(e.request)
    console.log('[Service Worker] Fetching resource: '+e.request.url)
    if (cacheResponse) {
      return cacheResponse
    }
    const networkResponse = await fetch(e.request)
    const cache = await caches.open(CACHE_NAME)
    console.log('[Service Worker] Caching new resource: '+e.request.url)
    cache.put(e.request, networkResponse.clone())
    return networkResponse
  })
})
```

Whoops!

<img src = "./images/sw-cce-1.png"
  alt = "Corrupted Content Error Screenshot"
  title = "Corrupted Content Error Screenshot">
</img>

I must have made a mistake. Now I can't load any pages for this site until I go to `about:serviceworkers` and unregister the service worker.

## The broken Service Worker skeleton

`/service-worker.js`

```js
const CACHE_VERSION = 'v1'
const CACHE_NAME = `cache-name`
const CACHE_FILE_URLS = [
  '/index.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILE_URLS)
    })
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(async () => {
    const cacheResponse = await caches.match(e.request)
    console.log('[Service Worker] Fetching resource: '+e.request.url)
    if (cacheResponse) {
      return cacheResponse
    }
    const networkResponse = await fetch(e.request)
    const cache = await caches.open(CACHE_NAME)
    console.log('[Service Worker] Caching new resource: '+e.request.url)
    cache.put(e.request, networkResponse.clone())
    return networkResponse
  })
})
```

`/sw-test.html`

```html
<html>
<head>
<meta charset="UTF8">
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
}
</script>
</head>
<body>
<p>The page loaded!</p>
</body>
</html>
```

Note that to replicate this bug you have to serve these files over HTTPS or localhost. The browser will refuse to install the service worker if you try to use `file:///`

## Issue One

The mistake I made was that I passed `respondWith` a function. It needs to receive a `Promise` that resolves to a `Response`.

The solution is to immediately call the asyncronous function I defined, as async functions always return promises.

```js
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const cacheResponse = await caches.match(e.request)
    console.log('[Service Worker] Fetching resource: '+e.request.url)
    if (cacheResponse) {
      return cacheResponse
    }
    const networkResponse = await fetch(e.request)
    const cache = await caches.open(CACHE_NAME)
    console.log('[Service Worker] Caching new resource: '+e.request.url)
    cache.put(e.request, networkResponse.clone())
    return networkResponse
  })())
})
```

It's easy to miss this step even when following a tutorial that does it because the `})()` at the end is after the function body.

Now I can stop the server and continue to load the cached webpage and the service worker will fetch it from the cache for me.

## Pages not in cache or network

What happens if I try a different URL?

Let's try `/sw-test` instead of `/sw-test.html`

<img src = "./images/sw-cce-2.png"
  alt = "Corrupted Content Error Screenshot"
  title = "Corrupted Content Error Screenshot">
</img>

Yet another Corrupted Content Error

Aside from the issue that the service worker code doesn't realise the resource at `/sw-test` and `/sw-test.html` is the same, and it has `/sw-test.html` in the cache, the main issue is that if you pass a promise that fails to resolve to a response you still get a Corrupted Content Error!

`fetch()` rejects if there's a network error, which must be caught so we can still resolve to a response.

```js
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const cacheResponse = await caches.match(e.request)
    console.log('[Service Worker] Fetching resource: '+e.request.url)
    if (cacheResponse) {
      return cacheResponse
    }
    try {
      const networkResponse = await fetch(e.request)
      const cache = await caches.open(CACHE_NAME)
      console.log('[Service Worker] Caching new resource: '+e.request.url)
      cache.put(e.request, networkResponse.clone())
      return networkResponse
    } catch (error) {
      // network error
    }
    return new Response('<p>Not in cache 😢</p>')
  })())
})
```

What about `match()` or `open()`? [`match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match) always resolves to either the response or `undefined` and [`open()`](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open) always resolves to the cache object, and will make one if it didn't exist.

## Working versions

Finally working offline

<img src = "./images/sw-cce-3.png"
  alt = "Fallback resource when offline screenshot"
  title = "Fallback resource when offline screenshot">
</img>

Immediately after adding the above image I tried refreshing my browser to see the updated article. Because the service worker is still set to cache then network and it has a cache of the article, it's going to prevent my browser fetching the new one from my server.

Hence below is the network then cache version for completeness.

```js
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    try {
      const networkResponse = await fetch(e.request)
      const cache = await caches.open(CACHE_NAME)
      console.log('[Service Worker] Caching updated resource: '+e.request.url)
      cache.put(e.request, networkResponse.clone())
      return networkResponse
    } catch (error) {
      // network error
    }
    const cacheResponse = await caches.match(e.request)
    console.log('[Service Worker] Fetching resource: '+e.request.url)
    if (cacheResponse) {
      return cacheResponse
    }
    return new Response('<p>Not in cache 😢</p>')
  })())
})
```

On a real website you probably don't want to indiscriminately cache everything and probably want a proper webpage to return if the cache and network fail, but you should now be able to avoid two easy mistakes that cause Corrupted Content Errors.

*****

All of the code examples in this article are MIT licensed.
