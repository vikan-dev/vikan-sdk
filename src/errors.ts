import type { ApiProblem } from './generated/types.js'
export type { ApiProblem } from './generated/types.js'

export class VikanApiError extends Error {
  readonly status: number
  readonly code: string | undefined
  readonly problem: ApiProblem | undefined
  constructor(status: number, problem?: ApiProblem) {
    super(problem?.title ?? `The vikan API returned HTTP ${status}.`)
    this.name = 'VikanApiError'
    this.status = status
    this.problem = problem
    this.code = problem ? problem.type.split('/').at(-1) : undefined
  }
}

export class VikanValidationError extends Error {
  constructor(readonly direction: 'input' | 'output', cause: unknown) {
    super(`The vikan ${direction} does not match the API contract.`, { cause })
    this.name = 'VikanValidationError'
  }
}

export class VikanConnectionError extends Error {
  constructor(readonly kind: 'network' | 'timeout' | 'aborted', cause: unknown) {
    super(kind === 'timeout' ? 'The vikan request timed out.' : kind === 'aborted' ? 'The vikan request was cancelled.' : 'The vikan API could not be reached.', { cause })
    this.name = 'VikanConnectionError'
  }
}
