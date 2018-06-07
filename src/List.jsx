import React, { Component } from 'react';
import axios from 'axios';
import NewTaskForm from './NewTaskForm';
import Task from './Task';
import { DropTarget } from 'react-dnd';

const listTarget = {
  drop(listProps, monitor, component) {
    let taskItem = monitor.getItem();
    let task = {value: taskItem.value, id: taskItem.id}

    // console.log('dropTarget listProps', listProps)
    // console.log('dropTarget component', component)

    // TODO REVISIT THIS
    taskItem.moveTask(listProps.id, task, component)
  }
}
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: [],
      newTaskValue: '',
    }

    this.handleNewTaskChange = this.handleNewTaskChange.bind(this);
    this.postNewTask = this.postNewTask.bind(this);
    this.handleNewTaskSubmit = this.handleNewTaskSubmit.bind(this);
    this.fetchTaskData = this.fetchTaskData.bind(this);
    this.moveTask = this.moveTask.bind(this);

  }
  moveTask(list_id, task, component) {
    // console.log('list_id', list_id)
    // console.log('task', task)

    // console.log('this', this)

    axios.post(`https://trello-clone-bfbb5.firebaseio.com/lists/${list_id}/tasks.json`, {value: task.value})
      .then(res => {
        return axios.delete(`https://trello-clone-bfbb5.firebaseio.com/lists/${this.props.id}/tasks/${task.id}.json`)
      })
      .then(res => {
        return this.fetchTaskData()

      })
      .then(res => {
        return component.fetchTaskData()
      })
  }
  fetchTaskData() {
     axios.get(`https://trello-clone-bfbb5.firebaseio.com/lists/${this.props.id}/tasks.json`)
      .then(res => {
        let tasks = []
        if(res.data) {
          Object.keys(res.data).forEach(key => {
            tasks.push({...res.data[key], id: key})
          });
        }

        this.setState({
          tasks: tasks,
        });
      })
      .catch(err => {
      console.log('task error:', err)
    })
  }
  componentDidMount() {
    this.fetchTaskData()
  }
  postNewTask() {
    axios.post(`https://trello-clone-bfbb5.firebaseio.com/lists/${this.props.id}/tasks.json`, {value: this.state.newTaskValue})
    .then(res => {
    })
    .catch(err => {
      console.log('task error:', err)
    })
    .then(() => {
      this.fetchTaskData()
    })

    this.setState({newTaskValue: ''});

  }
  handleNewTaskChange(e) {
    this.setState({newTaskValue: e.target.value});
  }
  handleNewTaskSubmit(e) {
    e.preventDefault();
    this.postNewTask()
  }
  handleDeleteTask(task_id) {
    axios.delete(`https://trello-clone-bfbb5.firebaseio.com/lists/${this.props.id}/tasks/${task_id}.json`)
      .then(res => {
        this.fetchTaskData()
      })
      .catch(err => {
        console.log('error', err)
      })
  }
  render() {
    const { connectDropTarget } = this.props
    return connectDropTarget(
      <div className="list">
        <header>{this.props.name}</header>
        <ul>
          {this.state.tasks && this.state.tasks.map(task =>
            <Task key={task.id} {...task} handleDelete={() => this.handleDeleteTask(task.id)} moveTask={this.moveTask} fetchTaskData={this.fetchTaskData}/>
          )}
        </ul>
        <NewTaskForm handleChange={this.handleNewTaskChange} value={this.state.newTaskValue} handleSubmit={this.handleNewTaskSubmit}/>
        <button onClick={this.props.handleDelete}>X</button>
      </div>
    );
  }
}

export default DropTarget('task', listTarget, collect)(List);
