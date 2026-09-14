import sandboxed from './sandboxed'
import { CSP_EDITION } from './config.js'
import currentGames from './csp.generated'

const
  PLAY_ORIGIN = 'https://play.js13kgames.com/',
  FAVICON_URL = `${PLAY_ORIGIN}favicon.ico`,
  REPORT_ORIGIN = 'https://csp.js13kgames.com/',
  RELAY_ORIGIN = 'wss://relay.js13kgames.com',
  FRAME_ANCESTORS = "frame-ancestors 'self' https://js13kgames.com"

export default {
  async fetch(req: Request, env: Record<string, any>) {
    const
      url = new URL(req.url),
      uri = url.pathname.slice(1)

    const i = uri.indexOf('/')
    if (i < 0) {
      // Naively filter out all requests for URIs with dots. Locally existing game files would've been already served
      // one level higher, so unless we're dealing with a virtual path, passthrough to the assets CDN.
      if (uri.indexOf('.') >= 0) {
        if (uri.slice(-4) == '.zip') {
          return fetchPackage(uri.slice(0, -4), req)
        }

        const asset = await env.PLAY.fetch(req)
        return withCsp(asset.status === 404 ? await env.ASSETS.fetch(req) : asset, url.pathname)
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

      // Only forward a request to the container when neither asset source has that path. This keeps client assets
      // out of the container image and avoids starting a container for an ordinary asset request.
      if (req.method === 'GET' || req.method === 'HEAD') {
        let asset = await env.PLAY.fetch(req)
        if (asset.status !== 404) return withCsp(asset, url.pathname, game)

        asset = await env.ASSETS.fetch(req)
        if (asset.status !== 404) return withCsp(asset, url.pathname, game)
      }

      return withCsp(await env.RUNTIME.fetch(req), url.pathname, game)
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      const asset = await env.PLAY.fetch(req)
      if (asset.status !== 404) return withCsp(asset, url.pathname, game)
    }

    // Naive filtering here because it's ultimately much cheaper (even if a bit inconvenient) to stick to
    // a file naming convention. Note: this covers /2025/webxr/..., /2025/online/... - paths like /socket.io.js
    // would have already been handled earlier in the flow.
    if (game.length == 4) {
      let y = parseInt(game)
      if (y >= 2012 && y < 2200) {
        return withCsp(await env.ASSETS.fetch(req), url.pathname)
      }
    }

    // Proxy through to our backend directly as a last resort.
    return fetchFromOrigin(uri, req, game)
  }
}

function sourcePolicy(game: string) {
  return `default-src 'unsafe-inline' 'unsafe-eval' data: blob: ${PLAY_ORIGIN}${game}/ ${PLAY_ORIGIN}${CSP_EDITION}/ ${FAVICON_URL} ${RELAY_ORIGIN}`
}

function withCsp(res: Response, pathname: string, game?: string) {
  if (!res.ok || !(pathname.endsWith('/') || pathname.endsWith('.html'))) return res

  return setCsp(new Response(res.body, res), game)
}

function setCsp(response: Response, game?: string, strict = false) {
  response.headers.set('Content-Security-Policy', strict && game
    ? `${sourcePolicy(game)}; ${FRAME_ANCESTORS}`
    : FRAME_ANCESTORS)

  if (!strict && game && currentGames.has(game)) {
    response.headers.set('Content-Security-Policy-Report-Only', `${sourcePolicy(game)}; report-uri ${REPORT_ORIGIN}`)
  }

  return response
}

async function fetchPackage(slug: string, req: Request) {
  let res = await fetch(
    `https://raw.githubusercontent.com/js13kGames/${ slug }/HEAD/.website/game.zip`,
    {
      method: req.method,
      headers: req.headers,
      cf: {
        cacheEverything: true,
        cacheTtl: 300
      }
    }
  )

  res = new Response(res.body, res)
  if (res.ok) {
    res.headers.set('Content-Disposition', `attachment; filename="${ slug }.zip"`)
  }

  return res
}

const naiveBots = /(?<! cu)bots?|crawl|http|scan|search|spider/i
type BotManagementSignals = {
  score?: number
  verifiedBot?: boolean
  jsDetection?: { passed?: boolean }
}

type RequestWithBotSignals = Request & {
  cf?: {
    verifiedBotCategory?: string
    botManagement?: BotManagementSignals | null
  }
}

function isBot(req: Request) {
  const
    cf = (req as RequestWithBotSignals).cf,
    botManagement = cf?.botManagement,
    score = botManagement?.score

  return Boolean(
    cf?.verifiedBotCategory ||
    botManagement?.verifiedBot ||
    (typeof score === 'number' && score < 30) ||
    botManagement?.jsDetection?.passed === false ||
    naiveBots.test(req.headers.get('user-agent') || '')
  )
}

async function fetchFromOrigin(uri: string, req: Request, game: string) {
  // Set to cache aggressively, because we invalidate Cloudflare's cache directly whenever content in the backend
  // (like draft data) changes.
  //
  // TODO(alcore) Ideally we'd serve those off R2 directly, but this would require either backend support,
  // or moving the draft submission logic directly into workers. For now this is a good enough stopgap
  // measure to get stable URLs.
  const source = await fetch(new Request('http://drafts.js13kgames.com/' + uri, req), {
    cf: {
      cacheEverything: true
    }
  })

  // Our backend uses a perma-cache max-age that we want Cloudflare to respect, but we want clients to actually
  // revalidate through the Worker.
  const response = new Response(source.body, source)
  response.headers.set('Cache-Control', 'max-age=0,must-revalidate')

  return setCsp(response, game, true)
}
