import type { ApiOperation, Operations } from './generated/types.js';
export interface RequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}
export type FetchImplementation = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export interface VikanClientOptions {
    apiKey: string;
    /** Full API base, including /api. Defaults to https://app.vikan.dev/api. */
    baseUrl?: string;
    fetch?: FetchImplementation;
    timeoutMs?: number;
    /** Retry transient GET failures only. Writes must be retried explicitly with the same operationId. */
    maxRetries?: number;
}
export type Input<K extends ApiOperation> = Operations[K]['input'];
export type Output<K extends ApiOperation> = Operations[K]['output'];
type Group = ApiOperation extends `${infer G}.${string}` ? G : never;
type Method<K extends ApiOperation> = {} extends Input<K> ? (input?: Input<K>, options?: RequestOptions) => Promise<Output<K>> : (input: Input<K>, options?: RequestOptions) => Promise<Output<K>>;
export type PaginatedOperation = {
    [K in ApiOperation]: Output<K> extends {
        items: unknown[];
        nextCursor: string | null;
    } ? K : never;
}[ApiOperation];
type PageItem<K extends PaginatedOperation> = Output<K> extends {
    items: Array<infer Item>;
} ? Item : never;
export type VikanClient = {
    [G in Group]: {
        [K in ApiOperation as K extends `${G}.${infer Name}` ? Name : never]: Method<K>;
    };
} & {
    request<K extends ApiOperation>(operation: K, input: Input<K>, options?: RequestOptions): Promise<Output<K>>;
    paginate<K extends PaginatedOperation>(operation: K, input: Input<K>, options?: RequestOptions): AsyncGenerator<PageItem<K>>;
};
export declare function createVikanClient(options: VikanClientOptions): VikanClient;
export {};
