export class ErrorClass extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ErrorClass';
  }
}

export class ConfigurationError extends ErrorClass {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', details);
    this.name = 'ConfigurationError';
  }
}

export class APIError extends ErrorClass {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint?: string,
    details?: Record<string, unknown>
  ) {
    super(message, 'API_ERROR', { ...details, statusCode, endpoint });
    this.name = 'APIError';
  }
}

export class ValidationError extends ErrorClass {
  constructor(
    message: string,
    public field: string,
    public value?: unknown,
    details?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', { ...details, field, value });
    this.name = 'ValidationError';
  }
}

export class FileSystemError extends ErrorClass {
  constructor(
    message: string,
    public path: string,
    public operation: string,
    details?: Record<string, unknown>
  ) {
    super(message, 'FILE_SYSTEM_ERROR', { ...details, path, operation });
    this.name = 'FileSystemError';
  }
}

export class NetworkError extends ErrorClass {
  constructor(
    message: string,
    public url: string,
    public originalError?: Error,
    details?: Record<string, unknown>
  ) {
    super(message, 'NETWORK_ERROR', { ...details, url, originalError: originalError?.message });
    this.name = 'NetworkError';
  }
}

export class UserInputError extends ErrorClass {
  constructor(
    message: string,
    public input: string,
    public expectedFormat?: string,
    details?: Record<string, unknown>
  ) {
    super(message, 'USER_INPUT_ERROR', { ...details, input, expectedFormat });
    this.name = 'UserInputError';
  }
}

export const ERROR_CODES = {
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_SYSTEM_ERROR: 'FILE_SYSTEM_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_INPUT_ERROR: 'USER_INPUT_ERROR'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];