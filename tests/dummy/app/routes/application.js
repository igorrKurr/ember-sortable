import Ember from 'ember';
const { A } = Ember;
const a = A;

export default Ember.Route.extend({
  model() {
    return a(['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco']);
    
  },

});
