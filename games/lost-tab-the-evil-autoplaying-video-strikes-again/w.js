self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('message', function (e) {
    switch (e.data) {
        case "s":
            var t = [["a"], ["m"]];
            var n = 0;
            do {
                do {
                    t.push(["b"])
                } while (Math.random() > 0.3 && t.length < 10)
                do {
                    t[Math.floor(t.length * Math.random())].push("h" + n)
                    t[Math.floor(t.length * Math.random())].push("k" + (n++))
                } while (Math.random() > 0.3 && n < 7)
                do {
                    t[Math.floor(t.length * Math.random())].push("c")
                } while (Math.random() > 0.3)
            } while (Math.random() > 0.5)
            t.sort(x => Math.random() - 0.5)
            self.clients.matchAll().then(x => x.forEach(x => x.postMessage({ k: "l", a: t })));
            break;
        case "u":
            self.clients.matchAll().then(x => x.forEach(x => x.postMessage({ k: "u" })));
            break;
        case "m":
            self.clients.matchAll().then(x => x.forEach(x => x.postMessage({ k: "m" })));
            break;
        case "w":
            self.clients.matchAll().then(x => x.forEach(x => x.postMessage({ k: "w" })));
            break;
    }
}, false);