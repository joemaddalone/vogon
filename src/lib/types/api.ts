export type ApiResponse<T> =
| { data: undefined, error: Error }
| { data: T, error: undefined }
| { data: T, error: Error }