import { RefreshGuard } from '../../src/auth/guards/refresh.guard';

describe('RefreshGuard', () => {
  it('should be defined', () => {
    expect(new RefreshGuard({} as any, {} as any)).toBeDefined();
  });
});
