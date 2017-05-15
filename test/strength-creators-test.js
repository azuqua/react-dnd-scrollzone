import { createHorizontalStrength, createVerticalStrength } from '../src';

describe('strength functions', function() {
  let hFn = createHorizontalStrength(150);
  let vFn = createVerticalStrength(150);
  let box = { x: 0, y: 0, w: 600, h: 600 };
  let lilBox = { x: 0, y: 0, w: 100, h: 100 };

  describe('horizontalStrength', function() {
    it('should return -1 when all the way at the left', function() {
      expect(hFn(box, { x: 0, y: 0 })).to.equal(-1);
    });

    it('should return 1 when all the way at the right', function() {
      expect(hFn(box, { x: 600, y: 0 })).to.equal(1);
    });

    it('should return 0 when in the center', function() {
      expect(hFn(box, { x: 300, y: 0 })).to.equal(0);
    });

    it('should return 0 when at either buffer boundary', function() {
      expect(hFn(box, { x: 150, y: 0 })).to.equal(0);
      expect(hFn(box, { x: 450, y: 0 })).to.equal(0);
    });

    it('should return 0 when outside the box', function() {
      expect(hFn(box, { x: 0, y: -100 })).to.equal(0);
      expect(hFn(box, { x: 0, y: 900 })).to.equal(0);
    });

    it('should scale linearly from the boundary to respective buffer', function() {
      expect(hFn(box, { x: 75, y: 0 })).to.equal(-.5);
      expect(hFn(box, { x: 525, y: 0 })).to.equal(.5);
    });

    it('should handle buffers larger than the box gracefully', function() {
      expect(hFn(lilBox, { x: 50, y: 0 })).to.equal(0);
    });
  });

  describe('verticalStrength', function() {
    it('should return -1 when all the way at the top', function() {
      expect(vFn(box, { x: 0, y: 0 })).to.equal(-1);
    });

    it('should return 1 when all the way at the bottom', function() {
      expect(vFn(box, { x: 0, y: 600 })).to.equal(1);
    });

    it('should return 0 when in the center', function() {
      expect(vFn(box, { x: 0, y: 300 })).to.equal(0);
    });

    it('should return 0 when at the buffer boundary', function() {
      expect(vFn(box, { x: 0, y: 150 })).to.equal(0);
      expect(vFn(box, { x: 0, y: 450 })).to.equal(0);
    });

    it('should return 0 when outside the box', function() {
      expect(vFn(box, { x: -100, y: 0 })).to.equal(0);
      expect(vFn(box, { x: 900, y: 0 })).to.equal(0);
    });

    it('should scale linearly from the boundary to respective buffer', function() {
      expect(vFn(box, { x: 0, y: 75 })).to.equal(-.5);
      expect(vFn(box, { x: 0, y: 525 })).to.equal(.5);
    });

    it('should handle buffers larger than the box gracefully', function() {
      expect(vFn(lilBox, { x: 0, y: 50 })).to.equal(0);
    });
  });
});
