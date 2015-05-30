import Ember from 'ember';
import layout from '../templates/components/sortable-group';
const { $, A, Component, computed, get, set, run, Logger, } = Ember;
const { warn } = Logger;
const a = A;
const NO_MODEL = {};

export default Component.extend({
  layout: layout,

  /**
    @property direction
    @type string
    @default y
  */
  direction: 'y',
  /**
    @property model
    @type Any
    @default null
  */
  model: NO_MODEL,

  /**
    @property items
    @type Ember.NativeArray
  */
  items: computed({
    get: function() {
      return a(); 
    },
    set: function(){
     warn('`items` is read only'); 
    }
  }), 
  /**
    @method _getFirstItemPosition
    @private
  */
  _getFirstItemPosition: function(direction) {
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

  /**
    Position for the first item.

    @property itemPosition
    @type Number
  */
  itemPosition: computed({
    get: function() {
      return this._getFirstItemPosition(this.get('direction'));
    },
    set: function(){
     warn('`itemPosition` is read only'); 
    }
  }).volatile(),

  /**
    @property sortedItems
    @type Array
  */

  sortedItems: computed('items.@each.y', 'items.@each.x', {
    get: function() {
      return a(this.get('items')).sortBy(this.get('direction'));
    },
    set: function(){
     warn('`sortedItems` is read only'); 
    }
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
    let groupModel = this.get('model');
    let itemModels = items.mapBy('model');

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
    
    if (groupModel !== NO_MODEL) {
      this.sendAction('onChange', groupModel, itemModels);
    } else {
      this.sendAction('onChange', itemModels);
    }
  }
});
