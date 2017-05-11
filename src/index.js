import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import throttle from 'lodash.throttle';
import raf from 'raf';
import getDisplayName from 'react-display-name';
import hoist from 'hoist-non-react-statics';
import { noop, intBetween } from './util';

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


export default function createScrollingComponent(WrappedComponent) {
  class ScrollingComponent extends Component {

    static displayName = `Scrolling(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      onScrollChange: PropTypes.func,
      verticalStrength: PropTypes.func,
      horizontalStrength: PropTypes.func,
      strengthMultiplier: PropTypes.number,
    };

    static defaultProps = {
      onScrollChange: noop,
      verticalStrength: defaultVerticalStrength,
      horizontalStrength: defaultHorizontalStrength,
      strengthMultiplier: 30,
    };

    static contextTypes = {
      dragDropManager: PropTypes.object,
    };

    constructor(props, ctx) {
      super(props, ctx);

      this.scaleX = 0;
      this.scaleY = 0;
      this.frame = null;
      this.attached = false;
    }

    componentDidMount() {
      this.container = findDOMNode(this.wrappedInstance);

      this.clearMonitorSubscription = this.context
          .dragDropManager
          .getMonitor()
          .subscribeToStateChange(() => this.handleMonitorChange());
    }

    componentWillUnmount() {
      this.clearMonitorSubscription();
      this.stopScrolling();
    }

    getCoords(evt) {
      if (evt.type === 'touchmove') {
        return { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
      }

      return { x: evt.clientX, y: evt.clientY };
    }

    attach() {
      this.attached = true;
      window.document.body.addEventListener('mousemove', this.updateScrolling);
      window.document.body.addEventListener('touchmove', this.updateScrolling);
    }

    detach() {
      this.attached = false;
      window.document.body.removeEventListener('mousemove', this.updateScrolling);
      window.document.body.removeEventListener('touchmove', this.updateScrolling);
    }

    handleMonitorChange() {
      const isDragging = this.context.dragDropManager.getMonitor().isDragging();

      if (!this.attached && isDragging) {
        this.attach();
      } else if (this.attached && !isDragging) {
        this.stopScrolling();
      }
    }

    // Update scaleX and scaleY every 100ms or so
    // and start scrolling if necessary
    updateScrolling = throttle(evt => {
      const { left: x, top: y, width: w, height: h } = this.container.getBoundingClientRect();
      const box = { x, y, w, h };
      const coords = this.getCoords(evt);

      // calculate strength
      this.scaleX = this.props.horizontalStrength(box, coords);
      this.scaleY = this.props.verticalStrength(box, coords);

      // start scrolling if we need to
      if (!this.frame && (this.scaleX || this.scaleY)) {
        this.startScrolling();
      }
    }, 100, { trailing: false })

    startScrolling() {
      let i = 0;
      const tick = () => {
        const { scaleX, scaleY, container } = this;
        const { strengthMultiplier, onScrollChange } = this.props;

        // stop scrolling if there's nothing to do
        if (strengthMultiplier === 0 || scaleX + scaleY === 0) {
          this.stopScrolling();
          return;
        }

        // there's a bug in safari where it seems like we can't get
        // mousemove events from a container that also emits a scroll
        // event that same frame. So we double the strengthMultiplier and only adjust
        // the scroll position at 30fps
        if (i++ % 2) {
          const {
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight,
          } = container;

          const newLeft = scaleX
            ? container.scrollLeft = intBetween(
              0,
              scrollWidth - clientWidth,
              scrollLeft + scaleX * strengthMultiplier
            )
            : scrollLeft;

          const newTop = scaleY
            ? container.scrollTop = intBetween(
              0,
              scrollHeight - clientHeight,
              scrollTop + scaleY * strengthMultiplier
            )
            : scrollTop;

          onScrollChange(newLeft, newTop);
        }
        this.frame = raf(tick);
      };

      tick();
    }

    stopScrolling = () => {
      this.detach();
      this.scaleX = 0;
      this.scaleY = 0;

      if (this.frame) {
        raf.cancel(this.frame);
        this.frame = null;
      }
    }

    render() {
      const {
        // not passing down these props
        strengthMultiplier,
        verticalStrength,
        horizontalStrength,
        onScrollChange,

        ...props,
      } = this.props;

      return (
        <WrappedComponent
          ref={(ref) => { this.wrappedInstance = ref; }}
          {...props}
        />
      );
    }
  }

  return hoist(ScrollingComponent, WrappedComponent);
}
