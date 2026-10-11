import type { ApiProblem } from './generated/types.js';
export type { ApiProblem } from './generated/types.js';
export declare class VikanApiError extends Error {
    readonly status: number;
    readonly code: string | undefined;
    readonly problem: ApiProblem | undefined;
    constructor(status: number, problem?: ApiProblem);
}
export declare class VikanValidationError extends Error {
    readonly direction: 'input' | 'output';
    constructor(direction: 'input' | 'output', cause: unknown);
}
export declare class VikanConnectionError extends Error {
    readonly kind: 'network' | 'timeout' | 'aborted';
    constructor(kind: 'network' | 'timeout' | 'aborted', cause: unknown);
}
