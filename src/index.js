import React from 'react';
import throttle from 'lodash.throttle';
import raf from 'raf';

const DEFAULT_BUFFER = 150;

export function createHorizontalStrength(_buffer) {
  return function defaultHorizontalStrength({ x, w }, point) {
    const buffer = Math.min(w / 2, _buffer);

    if (point.x >= x && point.x <= x + w) {
      if (point.x < x + buffer) {
        return (point.x - x - buffer) / buffer;
      } else if (point.x > (x + w - buffer)) {
        return -(x + w - point.x - buffer) / buffer;
      }
    }

    return 0;
  };
}

export function createVerticalStrength(_buffer) {
  return function defaultVerticalStrength({ y, h }, point) {
    const buffer = Math.min(h / 2, _buffer);

    if (point.y >= y && point.y <= y + h) {
      if (point.y < y + buffer) {
        return (point.y - y - buffer) / buffer;
      } else if (point.y > (y + h - buffer)) {
        return -(y + h - point.y - buffer) / buffer;
      }
    }

    return 0;
  };
}

export const defaultHorizontalStrength = createHorizontalStrength(DEFAULT_BUFFER);

export const defaultVerticalStrength = createVerticalStrength(DEFAULT_BUFFER);

export default class Scrollzone extends React.Component {

  static propTypes = {
    verticalStrength: React.PropTypes.func,
    horizontalStrength: React.PropTypes.func,
    tag: React.PropTypes.string,
    speed: React.PropTypes.number,
  }

  static defaultProps = {
    verticalStrength: defaultVerticalStrength,
    horizontalStrength: defaultHorizontalStrength,
    speed: 30,
    tag: 'div',
  };

  constructor(props, ctx) {
    super(props, ctx);

    this.scaleX = 0;
    this.scaleY = 0;
    this.frame = null;
    this.attached = false;
  }

  componentWillUnmount() {
    if (this.frame) raf.cancel(this.frame);
    this.detach();
  }

  attach() {
    window.document.body.addEventListener('dragover', this.updateScrolling);
    window.document.body.addEventListener('dragend', this.stopScrolling);
    window.document.body.addEventListener('drop', this.stopScrolling);
    this.attached = true;
  }

  detach() {
    window.document.body.removeEventListener('dragover', this.updateScrolling);
    window.document.body.removeEventListener('dragend', this.stopScrolling);
    window.document.body.removeEventListener('drop', this.stopScrolling);
    this.attached = false;
  }

  // we don't care about the body's dragover events until this
  // component gets dragged over for the first time
  handleDragOver = (evt) => {
    // give users a chance to preventDefault
    if (typeof this.props.onDragOver === 'function') this.props.onDragOver(evt);

    if (!this.attached) {
      this.attach();
      this.updateScrolling(evt);
    }
  }

  // Update scaleX and scaleY every 100ms or so
  // and start scrolling if necessary
  updateScrolling = throttle(evt => {
    const { container } = this.refs;
    const { left: x, top: y, width: w, height: h } = container.getBoundingClientRect();
    const box = { x, y, w, h };
    const coords = { x: evt.clientX, y: evt.clientY };

    // calculate strength
    this.scaleX = this.props.horizontalStrength(box, coords);
    this.scaleY = this.props.verticalStrength(box, coords);

    // start scrolling if we need to
    if (!this.frame && (this.scaleX || this.scaleY)) this.startScrolling();
  }, 100, { trailing: false })

  startScrolling() {
    const { speed } = this.props;
    const { container } = this.refs;

    let i = 0;
    const tick = () => {
      const { scaleX, scaleY } = this;
      if (scaleX || scaleY) {
        // there's a bug in safari where it seems like we can't get
        // dragover events from a container that also emits a scroll
        // event that same frame. So we double the speed and only adjust
        // the scroll position at 30fps
        if (i++ % 2) {
          if (scaleX) container.scrollLeft += Math.floor(scaleX * speed);
          if (scaleY) container.scrollTop += Math.floor(scaleY * speed);
        }
        this.frame = raf(tick);
      } else {
        this.stopScrolling();
      }
    };

    tick();
  }

  stopScrolling = () => {
    if (this.frame) {
      this.detach();
      raf.cancel(this.frame);
      this.frame = null;
      this.scaleX = 0;
      this.scaleY = 0;
    }
  }

  render() {
    const { tag: Tag, speed, className, ...props } = this.props;
    const compClass = className ? `${className} scrollzone` : 'scrollzone';

    return (
      <Tag
        {...props}
        className={compClass}
        onDragOver={this.handleDragOver}
        ref="container"
      />
    );
  }
}
