import Ember from 'ember';
const { A, set } = Ember;
const a = A;

export default Ember.Route.extend({
  model() {
    return {
      vertical: a(['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco']),
      horizontal: a(['Ein', "Zwei", "Drei", "Vier", "Funf"])
    };
    
  },

  actions: {
    update(model, newOrder) {
      set(model,'items', a(newOrder));
    }
  }
});
