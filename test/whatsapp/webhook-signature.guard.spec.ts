import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookSignatureGuard } from '../../src/whatsapp/guards/webhook-signature.guard';
import * as crypto from 'crypto';

describe('WebhookSignatureGuard', () => {
  let guard: WebhookSignatureGuard;
  const mockConfigService = { get: jest.fn().mockReturnValue('test-app-secret') };

  beforeEach(() => {
    guard = new WebhookSignatureGuard(mockConfigService as any);
  });

  function createContext(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          rawBody,
          headers: { 'x-hub-signature-256': signature },
        }),
      }),
    } as any;
  }

  it('should return true for valid signature', () => {
    const body = Buffer.from('{"test":"data"}');
    const signature = 'sha256=' + crypto.createHmac('sha256', 'test-app-secret').update(body).digest('hex');
    const context = createContext(body, signature);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw for invalid signature', () => {
    const body = Buffer.from('{"test":"data"}');
    const context = createContext(body, 'sha256=invalidsignature');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw when rawBody is missing', () => {
    const context = createContext(undefined, 'sha256=something');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw when signature is missing', () => {
    const body = Buffer.from('{"test":"data"}');
    const context = createContext(body, undefined);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw when app secret is not configured', () => {
    const emptyConfigService = { get: jest.fn().mockReturnValue(undefined) };
    const guardWithNoSecret = new WebhookSignatureGuard(emptyConfigService as any);
    const body = Buffer.from('{"test":"data"}');
    const signature = 'sha256=something';
    const context = createContext(body, signature);

    expect(() => guardWithNoSecret.canActivate(context)).toThrow(UnauthorizedException);
  });
});
