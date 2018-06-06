import React, { Component } from 'react';
import NewTaskForm from './NewTaskForm';
import axios from 'axios';

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
      axios.get(`https://trello-clone-bfbb5.firebaseio.com/lists/${this.props.id}/tasks.json`)
        .then(res => {

          let tasks = []

          Object.keys(res.data).forEach(key => {
            tasks.push({...res.data[key], id: key})
          });

          this.setState({
            tasks: tasks,
          });
        })
        .catch(err => {
        console.log('task error:', err)
      })
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
    return (
      <div className="list">
        <header>{this.props.name}</header>
        <ul>
          {this.state.tasks && this.state.tasks.map(
            task => <li key={task.id}><p>{task.value}</p><button onClick={() => this.handleDeleteTask(task.id)}>X</button></li>
          )}
        </ul>
        <NewTaskForm handleChange={this.handleNewTaskChange} value={this.state.newTaskValue} handleSubmit={this.handleNewTaskSubmit}/>
        <button onClick={this.props.handleDelete}>X</button>
      </div>
    );
  }
}

export default List;
