import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

// App component - represents the whole app
class App extends Component {

// Add state property to the App
  constructor(props){
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }
// handle text inputs to the form
  handleSubmit(event){
    event.preventDefault();
    // find the text field using the react ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), //adds the current time
    });

    //clear the form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  // Handle HideCompleted event
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">

        <header>
          <h1>Todo List</h1>
          {/* tick box to view completed */}
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
          Hide completed Tasks
          </label>

          {/* form allows user to input tasks to database */}
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>

      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, App);
