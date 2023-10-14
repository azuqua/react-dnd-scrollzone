import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import './DragItem.css';

class DragItem extends PureComponent {

  static propTypes = {
    label: PropTypes.string.isRequired,
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
