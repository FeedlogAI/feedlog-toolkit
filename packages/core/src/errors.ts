/**
 * Custom error types for Feedlog SDK
 */

export class FeedlogError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FeedlogError';
    Object.setPrototypeOf(this, FeedlogError.prototype);
  }
}

export class FeedlogValidationError extends FeedlogError {
  constructor(message: string) {
    super(message);
    this.name = 'FeedlogValidationError';
    Object.setPrototypeOf(this, FeedlogValidationError.prototype);
  }
}

export class FeedlogNetworkError extends FeedlogError {
  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, statusCode, originalError);
    this.name = 'FeedlogNetworkError';
    Object.setPrototypeOf(this, FeedlogNetworkError.prototype);
  }
}

export class FeedlogTimeoutError extends FeedlogError {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'FeedlogTimeoutError';
    Object.setPrototypeOf(this, FeedlogTimeoutError.prototype);
  }
}

