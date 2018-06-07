import React, { Component } from 'react';
import logo from './logo.svg';
import './firebaseConfig';
import axios from 'axios';

import List from './List';
import NewListForm from './NewListForm';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      lists: [],
      newListFormValue: '',
    }
  }
  fetchBoardData() {
    axios.get('https://trello-clone-bfbb5.firebaseio.com/lists.json')
      .then(res => {
        let lists = []

        if(res.data) {
          Object.keys(res.data).forEach(key => {
            lists.push({...res.data[key], id: key})
          });
        }

        this.setState({
          lists: [...lists]
        });
      })
      .catch((err) => {
        console.log('error:', err)
      })
  }
  componentDidMount() {
    this.fetchBoardData()
    this.handleNewListSubmit = this.handleNewListSubmit.bind(this)
    this.handleNewListChange = this.handleNewListChange.bind(this);
    this.handleDeleteList = this.handleDeleteList.bind(this);
    this.fetchBoardData = this.fetchBoardData.bind(this);
  }

  postNewList() {
    axios.post('https://trello-clone-bfbb5.firebaseio.com/lists.json',
      {name: this.state.newListFormValue})
    .then((res) => {
      console.log('post response', res)
      this.fetchBoardData();

      this.setState({
        newListFormValue: ''
      })
    })
  }
  handleNewListSubmit(e) {
    e.preventDefault();
    this.postNewList()
  }
  handleNewListChange(event) {
    this.setState({newListFormValue: event.target.value});
  }
  handleDeleteList(list_id) {
    axios.delete(`https://trello-clone-bfbb5.firebaseio.com/lists/${list_id}.json`)
      .then(res => {
        this.fetchBoardData()
      })
      .catch(err => {
        console.log('error', err)
      })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to <del>React</del> Trello</h1>
        </header>
        <div className="list-container">
          {
            this.state.lists.map(list => <List {...list} key={list.id} handleDelete={() => this.handleDeleteList(list.id)} />)
          }
        </div>
        <NewListForm handleSubmit={this.handleNewListSubmit} handleChange={this.handleNewListChange} value={this.state.newListFormValue}/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
