import { UtcDatePipe } from './utc-date.pipe';

describe('UtcDatePipe', () => {
  it('create an instance', () => {
    const pipe = new UtcDatePipe();
    expect(pipe).toBeTruthy();
  });
});
