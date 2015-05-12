import Ember from 'ember';
const { A } = Ember;

export default Ember.Controller.extend({
  actions: {
    updateVertical: function(newOrder) {
      this.set('model.vertical', A(newOrder));
    },
    updateHorizontal: function(newOrder) {
      this.set('model.horizontal', A(newOrder));
    }
  }
});
