import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

Meteor.startup(() => {
  
});

Meteor.methods({
  'getAllUsers'() {
    return Meteor.users.find({}).fetch();
  }
})