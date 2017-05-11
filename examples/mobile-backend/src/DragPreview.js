import React, { PureComponent } from 'react';
import { DragLayer } from 'react-dnd';
import './DragPreview.css';

class DragPreview extends PureComponent {

  render() {
    const {
      item,
      offset,
    } = this.props;

    return (
      <div className="DragPreview">
        {item && (
          <div
            className="DragPreview__item"
            style={{
              position: 'absolute',
              top: offset.y,
              left: offset.x,
            }}
          />
        )}
      </div>
    );
  }
}

export default DragLayer(
  monitor => ({
    item: monitor.getItem(),
    offset: monitor.getClientOffset(),
  })
)(DragPreview);
