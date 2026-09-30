import { verifyWebhook, VikanWebhookError } from '../src/webhooks.js'

/** Mount this Fetch-compatible handler in your Node/Bun server or framework. */
export function webhookHandler(secret: string, enqueueOnce: (id: string, event: Awaited<ReturnType<typeof verifyWebhook>>) => Promise<void>) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })
    try {
      const event = await verifyWebhook({ body: new Uint8Array(await request.arrayBuffer()), headers: request.headers, secret })
      // The application supplies durable deduplication and queue insertion.
      await enqueueOnce(event.id, event)
      return new Response(null, { status: 204 })
    } catch (error) {
      return new Response(error instanceof VikanWebhookError ? 'Invalid webhook' : 'Try again later', {
        status: error instanceof VikanWebhookError ? 400 : 503,
      })
    }
  }
}
