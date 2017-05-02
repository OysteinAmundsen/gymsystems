import { ToUpperPipe } from './to-upper.pipe';

describe('ToUpperPipe', () => {
  it('create an instance', () => {
    const pipe = new ToUpperPipe();
    expect(pipe).toBeTruthy();
  });
});
