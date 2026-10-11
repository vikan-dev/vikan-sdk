import type { Output, VikanClient } from './client.js';
import type { WebhookEvent } from './generated/types.js';
export type PublicEvent = WebhookEvent;
export type EventSubscription = Output<'events.createSubscription'>;
export interface EventRecord {
    seqNum: number;
    body: string;
}
export interface EventReadSession extends AsyncIterable<EventRecord> {
    close(): Promise<void>;
}
export interface EventTransport {
    open(grant: EventSubscription, cursor: number, signal: AbortSignal): Promise<EventReadSession>;
}
export interface SubscribeOptions {
    projectId: string;
    /** Next unprocessed sequence, persisted AFTER accepting the preceding event. */
    cursor?: string;
    /** Capture this before reading an API snapshot, then pass it here to avoid a sync window. */
    subscription?: EventSubscription;
    signal?: AbortSignal;
}
export declare class VikanEventError extends Error {
    readonly kind: 'cursor' | 'gap' | 'invalid-event' | 'transport';
    constructor(kind: 'cursor' | 'gap' | 'invalid-event' | 'transport', message: string, options?: ErrorOptions);
}
/** Public API-key event access; it never uses CLI device credentials. */
export declare function createEventClient(client: VikanClient, options?: {
    transport?: EventTransport;
}): {
    subscribe(input: SubscribeOptions): AsyncGenerator<{
        event: PublicEvent;
        sequence: string;
        cursor: string;
    }>;
};
