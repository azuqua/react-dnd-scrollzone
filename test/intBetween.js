import { intBetween } from '../src/util';

describe('private intBetween()', () => {

  it('should return val if it is an int between min and max', () => {
    expect(intBetween(0, 2, 1)).to.equal(1);
  });

  it('should floor the val if it not an int', () => {
    expect(intBetween(0, 2, .5)).to.equal(0);
  });

  it('should take the floor of the min if its the bigger than val and not an int', () => {
    expect(intBetween(.5, 2, -1)).to.equal(0);
  });

  it('should take the floor of the max if its lower than val and not an int', () => {
    expect(intBetween(0, 1.5, 2)).to.equal(1);
  });
});
