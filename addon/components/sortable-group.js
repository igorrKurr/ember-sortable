import Ember from 'ember';
import layout from '../templates/components/sortable-group';
const { $, A, Component, computed, get, set, run } = Ember;
const a = A;

export default Component.extend({
  layout: layout,

  direction: 'y',
  /**
    @property items
    @type Ember.NativeArray
  */
  items: computed(() => { return a(); }),

  /**
    Vertical position for the first item.

    @property itemPosition
    @type Number
  */

  _getFirstItemPosition: function(direction ){
    let element = this.element;
    let stooge = $('<span style="position: absolute" />');
    let result;
    if(direction === 'y') {
      result = stooge.prependTo(element).position().top;
    }
    if(direction === 'x') {
      result = stooge.prependTo(element).position().left;
    }

    stooge.remove();

    return result;
  },

  itemPosition: computed(function() {
    return this._getFirstItemPosition(this.get('direction'));
  }).volatile(),

  /**
    @property sortedItems
    @type Array
  */

  sortedItems: computed('items.@each.y', 'items.@each.x', function() {
    return a(this.get('items')).sortBy(this.get('direction'));
  }),

  /**
    Register an item with this group.

    @method registerItem
    @param {SortableItem} [item]
  */
  registerItem(item) {
    this.get('items').addObject(item);
  },

  /**
    De-register an item with this group.

    @method deregisterItem
    @param {SortableItem} [item]
  */
  deregisterItem(item) {
    this.get('items').removeObject(item);
  },

  /**
    Prepare for sorting.
    Main purpose is to stash the current itemPosition so
    we don’t incur expensive re-layouts.

    @method prepare
  */
  prepare() {
    this._itemPosition = this.get('itemPosition');
  },

  /**
    Update item positions.

    @method update
  */
  update() {
    let sortedItems = this.get('sortedItems');
    let position = this._itemPosition;

    // Just in case we haven’t called prepare first.
    if (position === undefined) {
      position = this.get('itemPosition');
    }

    sortedItems.forEach(item => {
      if (!get(item, 'isDragging')) {
        set(item, this.get('direction'), position);
      }
      let dimension;
      if (this.get('direction') === 'y') {
       dimension = 'height'; 
      }
      if (this.get('direction') === 'x') {
       dimension = 'width'; 
      }
      position += get(item, dimension);
    });
  },

  /**
    @method commit
  */
  commit() {
    let items = this.get('sortedItems');
    let models = items.mapBy('model');

    delete this._itemPosition;

    run.schedule('render', () => {
      items.invoke('freeze');
    });

    run.schedule('afterRender', () => {
      items.invoke('reset');
    });

    run.next(() => {
      run.schedule('render', () => {
        items.invoke('thaw');
      });
    });

    this.sendAction('onChange', models);
  }
});
