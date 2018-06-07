import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const taskSource = {
  beginDrag(props, monitor) {
    return {id: props.id, value: props.value, moveTask: props.moveTask};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Task extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <li key={this.props.id}>
        <p>{this.props.value}</p>
        <button onClick={this.props.handleDelete}>X</button>
      </li>
    );
  }
}

export default DragSource('task', taskSource, collect)(Task);