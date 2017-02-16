import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods(
  {
// describes database methods that can be called from the react components
    'tasks.insert'(text)
    {
      check(text, String);

      // make sure the user is logged in before insert
      if (! this.userId)
      {
        throw new Meteor.Error('not-authorized');
      }

      Tasks.insert(
        {
          text,
          createdAt: new Date(),
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username,
        }
      );
    },

    'tasks.remove' (taskId)
    {
      check(taskId, String);
      Tasks.remove(taskId);
    },

    'tasks.setChecked'(taskId, setChecked)
    {
      check(taskId, String);
      check(setChecked, Boolean);
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
  }
);
