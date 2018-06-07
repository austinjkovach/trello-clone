import React, { Component } from 'react';

class NewTaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <label>
          New Task:
          <input type="text" value={this.props.value} onChange={this.props.handleChange} />
        </label>
        <input className="btn btn-submit" type="submit" value="+" />
      </form>
    );
  }
}

export default NewTaskForm;