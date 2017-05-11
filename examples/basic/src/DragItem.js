import React, { PureComponent } from 'react';
import { DragSource } from 'react-dnd';
import './DragItem.css';

class DragItem extends PureComponent {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
  };

  render() {
    return this.props.dragSource(
      <div className="DragItem">
        {this.props.label}
      </div>
    );
  }
}

export default DragSource(
  'foo',
  {
    beginDrag() {
      return {}
    }
  },
  (connect) => ({
    dragSource: connect.dragSource(),
  })
)(DragItem);
