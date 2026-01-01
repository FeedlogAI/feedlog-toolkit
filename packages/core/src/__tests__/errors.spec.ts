import {
  FeedlogError,
  FeedlogValidationError,
  FeedlogNetworkError,
  FeedlogTimeoutError,
} from '../errors';

describe('FeedlogError - Base Error Class', () => {
  it('should create error with message', () => {
    const error = new FeedlogError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('FeedlogError');
  });

  it('should create error with status code', () => {
    const error = new FeedlogError('msg', 500);
    expect(error.statusCode).toBe(500);
  });

  it('should preserve original error', () => {
    const original = new Error('original');
    const error = new FeedlogError('msg', 500, original);
    expect(error.originalError).toBe(original);
  });

  it('should pass instanceof check for FeedlogError', () => {
    const error = new FeedlogError('test');
    expect(error instanceof FeedlogError).toBe(true);
  });

  it('should pass instanceof check for Error', () => {
    const error = new FeedlogError('test');
    expect(error instanceof Error).toBe(true);
  });

  it('should have proper prototype chain', () => {
    const error = new FeedlogError('test');
    expect(Object.getPrototypeOf(error).constructor.name).toBe('FeedlogError');
  });
});

describe('FeedlogValidationError', () => {
  it('should create validation error', () => {
    const error = new FeedlogValidationError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.name).toBe('FeedlogValidationError');
  });

  it('should be instanceof FeedlogError', () => {
    const error = new FeedlogValidationError('Invalid');
    expect(error instanceof FeedlogError).toBe(true);
  });

  it('should be instanceof Error', () => {
    const error = new FeedlogValidationError('Invalid');
    expect(error instanceof Error).toBe(true);
  });
});

describe('FeedlogNetworkError', () => {
  it('should create network error with message', () => {
    const error = new FeedlogNetworkError('Network failed');
    expect(error.message).toBe('Network failed');
    expect(error.name).toBe('FeedlogNetworkError');
  });

  it('should create network error with status code', () => {
    const error = new FeedlogNetworkError('msg', 500);
    expect(error.statusCode).toBe(500);
  });

  it('should create network error with original error', () => {
    const original = new TypeError('fetch failed');
    const error = new FeedlogNetworkError('msg', undefined, original);
    expect(error.originalError).toBe(original);
  });

  it('should be instanceof FeedlogError', () => {
    const error = new FeedlogNetworkError('Network failed');
    expect(error instanceof FeedlogError).toBe(true);
  });

  it('should be instanceof Error', () => {
    const error = new FeedlogNetworkError('Network failed');
    expect(error instanceof Error).toBe(true);
  });
});

describe('FeedlogTimeoutError', () => {
  it('should create timeout error with default message', () => {
    const error = new FeedlogTimeoutError();
    expect(error.message).toBe('Request timed out');
    expect(error.name).toBe('FeedlogTimeoutError');
  });

  it('should create timeout error with custom message', () => {
    const error = new FeedlogTimeoutError('Custom timeout');
    expect(error.message).toBe('Custom timeout');
  });

  it('should be instanceof FeedlogError', () => {
    const error = new FeedlogTimeoutError();
    expect(error instanceof FeedlogError).toBe(true);
  });

  it('should be instanceof Error', () => {
    const error = new FeedlogTimeoutError();
    expect(error instanceof Error).toBe(true);
  });
});

describe('Error Hierarchy', () => {
  it('should maintain proper error hierarchy', () => {
    const errors = [
      new FeedlogValidationError('v'),
      new FeedlogNetworkError('n'),
      new FeedlogTimeoutError(),
    ];

    errors.forEach((error) => {
      expect(error instanceof FeedlogError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  it('should differentiate error types', () => {
    const validationError = new FeedlogValidationError('test');
    const networkError = new FeedlogNetworkError('test');
    const timeoutError = new FeedlogTimeoutError();

    expect(validationError.name).toBe('FeedlogValidationError');
    expect(networkError.name).toBe('FeedlogNetworkError');
    expect(timeoutError.name).toBe('FeedlogTimeoutError');
  });

  it('should handle error throwing and catching', () => {
    expect(() => {
      throw new FeedlogValidationError('invalid');
    }).toThrow(FeedlogValidationError);

    expect(() => {
      throw new FeedlogNetworkError('failed');
    }).toThrow(FeedlogNetworkError);

    expect(() => {
      throw new FeedlogTimeoutError();
    }).toThrow(FeedlogTimeoutError);
  });

  it('should catch all errors as FeedlogError', () => {
    const errors = [
      new FeedlogValidationError('v'),
      new FeedlogNetworkError('n'),
      new FeedlogTimeoutError(),
    ];

    errors.forEach((error) => {
      expect(() => {
        throw error;
      }).toThrow(FeedlogError);
    });
  });
});


