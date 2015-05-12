import Ember from 'ember';
const { A } = Ember;

export default Ember.Controller.extend({
  actions: {
    update: function(newOrder) {

      console.log("SDD", newOrder)
      this.set('model', A(newOrder));
    }
  }

});
