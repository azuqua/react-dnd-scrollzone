import React from 'react';
import throttle from 'lodash.throttle';
import raf from 'raf';

function getHorizontalStrength({ left, width }, { clientX }, buffer) {
  if (clientX >= left && clientX <= left + width) {
    if (clientX < left + buffer) {
      return (clientX - left - buffer) / buffer;
    } else if (clientX > (left + width - buffer)) {
      return -(left + width - clientX - buffer) / buffer;
    }
  }

  return 0;
}

function getVerticalStrength({ top, height }, { clientY }, buffer) {
  if (clientY >= top && clientY <= top + height) {
    if (clientY < top + buffer) {
      return (clientY - top - buffer) / buffer;
    } else if (clientY > (top + height - buffer)) {
      return -(top + height - clientY - buffer) / buffer;
    }
  }

  return 0;
}

export default class Scrollzone extends React.Component {

  static propTypes = {
    tag: React.PropTypes.string,
    buffer: React.PropTypes.number,
    speed: React.PropTypes.number,
    onDragOver: React.PropTypes.func,
    className: React.PropTypes.string,
  }

  static defaultProps = {
    tag: 'div',
    buffer: 150,
    speed: 30,
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
    const { buffer } = this.props;
    const { container } = this.refs;
    const rect = container.getBoundingClientRect();

    // calculate strength
    this.scaleX = getHorizontalStrength(rect, evt, buffer);
    this.scaleY = getVerticalStrength(rect, evt, buffer);

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
    const { tag: Tag, className } = this.props;
    const compClass = className ? `${className} scrollzone` : 'scrollzone';

    return (
      <Tag
        {...this.props}
        className={compClass}
        onDragOver={this.handleDragOver}
        ref="container"
      />
    );
  }
}
