import sandboxed from './sandboxed'

export default {
  async fetch(req: Request, env: Record<string, any>) {
    const
      url = new URL(req.url),
      uri = url.pathname.slice(1)

    // Naively filter out all requests for URIs with dots. Locally existing game files would've been already served
    // one level higher, so unless we're dealing with a virtual path, passthrough to the assets CDN.
    if (uri.indexOf('.') >= 0) {
      if (uri.slice(-4) == '.zip') {
        // Rewrite to support `play.js13kgames.com/my-game.zip` URLs.
        url.pathname = uri.slice(0, -4) + '/.src/g.zip'
        return env.PLAY.fetch(url, req)
      }

      return env.ASSETS.fetch(req)
    }

    const i = uri.indexOf('/')
    if (i < 0) {
      // If a game with this slug exists, append trailing slash and redirect.
      if (sandboxed[uri]) {
        url.pathname = uri + '/'
        return Response.redirect(url.toString(), 308)
      }

      return new Response(null, { status: 404 })
    }

    const game = uri.slice(0, i)
    if (!sandboxed[game]) return new Response(null, { status: 404 })
    if (isBot(req)) {
      // Perma-redirect for crawlers, since we're checking for them anyway
      // and would rather people hit the game's page than the game directly.
      return Response.redirect('https://js13kgames.com/games/' + game, 308)
    }

    return env.RUNTIME.fetch(req)
  }
}

const naiveBots = /(?<! cu)bots?|crawl|http|scan|search|spider/i
function isBot(req: Request) {
  return req.cf.verifiedBotCategory || naiveBots.test(req.headers.get('user-agent'))
}