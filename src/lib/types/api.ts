export type ApiResponse<T> =
| { data: null, error: Error }
| { data: T, error: null }
| { data: T, error: Error }