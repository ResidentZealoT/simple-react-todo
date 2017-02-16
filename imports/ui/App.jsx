import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

// import components to be used
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx'

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
    Meteor.call('tasks.insert', text);
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
          <h1>Todo List ({this.props.incompleteCount})</h1>
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

          {/* This is a login component */}
          <AccountsUIWrapper />



          {/* form allows user to input tasks to database */}
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>

      </div>
    );
  }
}

// defines the type of each prop, ie Tasks are an array and count is a number
App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

// defines what is created in each container, ie tasks fetch an array tasks in reverse order
// incompletedCount counts the number of tasks remaining
export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
