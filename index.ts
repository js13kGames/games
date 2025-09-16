import sandboxed from './sandboxed'

export default {
  async fetch(req: Request, env: Record<string, any>) {
    const
      url = new URL(req.url),
      uri = url.pathname.slice(1)

    // Naively filter out all requests for URIs with dots. Legit, existing files would've been already served
    // one level higher (before hitting the Worker) and we don't want every single scanner to trigger boots.
    if (uri.indexOf('.') >= 0) {
      // Rewrite requests to game packages so that they're served on easy to remember paths,
      // i.e.: play.js13kgames.com/my-game.zip
      if (uri.slice(-4) == '.zip') {
        url.pathname = uri.slice(0, -4) + '/.src/g.zip'
        return env.ASSETS.fetch(url, req)
      }

      return new Response(null, { status: 404 })
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

    return env.RUNTIME_SANDBOX.fetch(req)
  }
}

const naiveBots = /(?<! cu)bots?|crawl|http|scan|search|spider/i
function isBot(req: Request) {
  return req.cf.verifiedBotCategory || naiveBots.test(req.headers.get('user-agent'))
}