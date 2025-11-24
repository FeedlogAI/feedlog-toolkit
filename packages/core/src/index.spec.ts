import { FeedlogSDK, validateApiKey, generateId } from './index';

describe('FeedlogSDK', () => {
  it('should create an instance', () => {
    const sdk = new FeedlogSDK();
    expect(sdk).toBeInstanceOf(FeedlogSDK);
  });

  it('should initialize with API key', () => {
    const sdk = new FeedlogSDK();
    sdk.initialize({ apiKey: 'test-key' });
    expect(sdk.getApiKey()).toBe('test-key');
  });

  it('should accept API key in constructor', () => {
    const sdk = new FeedlogSDK('test-key');
    expect(sdk.getApiKey()).toBe('test-key');
  });
});

describe('validateApiKey', () => {
  it('should validate a non-empty string', () => {
    expect(validateApiKey('valid-key')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(validateApiKey('')).toBe(false);
  });
});

describe('generateId', () => {
  it('should generate a unique ID', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });
});

