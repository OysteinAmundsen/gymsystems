import { OrderByPipe } from './order-by.pipe';

describe('shared.pipes:OrderByPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByPipe();
    expect(pipe).toBeTruthy();
  });
});
