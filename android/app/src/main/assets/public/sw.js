/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "index.html",
    "revision": "07e76c10453c5f2c3d03e5495f4c576a"
  }, {
    "url": "assets/purify.es-Bvo9QlJ8.js",
    "revision": null
  }, {
    "url": "assets/index.es-BITh2v_t.js",
    "revision": null
  }, {
    "url": "assets/index-DqJ9e7UP.css",
    "revision": null
  }, {
    "url": "assets/index-BdzG6Tjp.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "202f2ffc05c1d838d287d0a634d24e0c"
  }, {
    "url": "favicon.svg",
    "revision": "c1a4ffd33f2a45390ef0c32aeb0c9a4e"
  }, {
    "url": "icon.svg",
    "revision": "04128abdbe14c5f50cf9989d5faabe95"
  }, {
    "url": "pwa-192x192.png",
    "revision": "12dde1b57e111535672d9576a68dc02c"
  }, {
    "url": "pwa-512x512.png",
    "revision": "9a581879863e85895fc5818c287c2028"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "2d5c219dc797463f3da35acbcc658cad"
  }, {
    "url": "manifest.webmanifest",
    "revision": "5db6ac0dd519304374550a9cf74ea4c9"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
