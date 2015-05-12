import Ember from 'ember';
const { A } = Ember;
const a = A;

export default Ember.Route.extend({
  model() {
    return {
      vertical: a(['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco']),
      horizontal: a(['Ein', "Zwei", "Drei", "Vier", "Funf"])
    };
    
  },

});
