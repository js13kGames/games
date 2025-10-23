import sandboxed from './sandboxed'

export default {
  fetch(req: Request, env: Record<string, any>) {
    const
      url = new URL(req.url),
      uri = url.pathname.slice(1)

    const i = uri.indexOf('/')
    if (i < 0) {
      // Naively filter out all requests for URIs with dots. Locally existing game files would've been already served
      // one level higher, so unless we're dealing with a virtual path, passthrough to the assets CDN.
      if (uri.indexOf('.') >= 0) {
        if (uri.slice(-4) == '.zip') {
          // Rewrite to support `play.js13kgames.com/my-game.zip` URLs.
          url.pathname = uri.slice(0, -4) + '/.src/g.zip'

          // Attempt to fetch from locally attached static files and pass through to origin on failure.
          return env.PLAY.fetch(url, req)
            .then(res => res.ok
              ? res
              : fetchFromOrigin(url.pathname, req)
            )
        }

        return env.ASSETS.fetch(req)
      }

      // Append trailing slash and redirect. This is rather aggressive since we're not checking for the existence
      // of the target resource in the first place (will get resolved after the redirect).
      url.pathname = uri + '/'
      return Response.redirect(url, 308)
    }

    const game = uri.slice(0, i)
    if (sandboxed[game]) {
      if (isBot(req)) {
        // Perma-redirect for crawlers, since we would rather people hit the game's page than the game directly.
        return Response.redirect('https://js13kgames.com/games/' + game, 308)
      }

      return env.RUNTIME.fetch(req)
    }

    // Naive filtering here because it's ultimately much cheaper (even if a bit inconvenient) to stick to
    // a file naming convention. Note: this covers /2025/webxr/..., /2025/online/... - paths like /socket.io.js
    // would have already been handled earlier in the flow.
    if (game.length == 4) {
      let y = parseInt(game)
      if (y >= 2012 && y < 2200) {
        return env.ASSETS.fetch(req)
      }
    }

    // Proxy through to our backend directly as a last resort.
    return fetchFromOrigin(uri, req)
  }
}

const naiveBots = /(?<! cu)bots?|crawl|http|scan|search|spider/i
function isBot(req: Request) {
  return req.cf.verifiedBotCategory || naiveBots.test(req.headers.get('user-agent'))
}

async function fetchFromOrigin(uri: string, req: Request) {
  // Set to cache aggressively, because we invalidate Cloudflare's cache directly whenever content in the backend
  // (like draft data) changes.
  //
  // TODO(alcore) Ideally we'd serve those off R2 directly, but this would require either backend support,
  // or moving the draft submission logic directly into workers. For now this is a good enough stopgap
  // measure to get stable URLs.
  let response = await fetch(new Request('http://drafts.js13kgames.com/' + uri, req), {
    cf: {
      cacheEverything: true
    }
  })

  // Our backend uses a perma-cache max-age that we want Cloudflare to respect, but we want clients to actually
  // revalidate through the Worker.
  response = new Response(response.body, response);
  response.headers.set("Cache-Control", "max-age=0,must-revalidate");
  return response
}