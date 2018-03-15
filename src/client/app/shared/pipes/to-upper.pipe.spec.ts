import { ToUpperPipe } from './to-upper.pipe';

describe('shared.pipes:ToUpperPipe', () => {
  it('create an instance', () => {
    const pipe = new ToUpperPipe();
    expect(pipe).toBeTruthy();
  });
});
