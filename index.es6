class Pool {
  constructor(ObjectContructor, size, initSize = size) {
    this.size = size;
    this.ObjectContructor = ObjectContructor;
    this.borrowedObjects = [];
    this.availableObjects = [];
  }

  destroy() {
    this.borrowedObjects = null;
    this.availableObjects = [];
    this.ObjectContructor = null;
  }

  borrows() {
    let object = null;
    if (this.hasAvailables()) {
      if (this.availableObjects.length === 0) {
        object = new this.ObjectContructor();
      } else {
        object = this.availableObjects.pop();
      }
      this.borrowedObjects.push(object);
    }
    return object;
  }

  returns(borrowedObject) {
    if (!(borrowedObject instanceof this.ObjectContructor)) {
      throw new Error(`Can't return object which is not a ${this.ObjectConstructor.name}`);
    }
    const index = this.borrowedObjects.indexOf(borrowedObject);
    if (index === -1) {
      if (this.availableObjects.includes(borrowedObject)) {
        throw new Error(`${this.ObjectContructor.name} already returned !`);
      } else {
        throw new Error(`Object given in Pool#returns() is not referenced in this Pool instance.`);
      }
    }
    this.borrowedObjects.splice(index, 1);
    try {
      borrowedObject.dispose();
    } catch (err) {
    } finally {
      console.log('finally');
      this.availableObjects.push(borrowedObject);
    }

  }

  hasAvailables() {
    return this.size === -1 || this.borrowedObjects.length < this.size;
  }

  getCountAvailables() {
    return this.availableObjects.length;
  }

  getCountBorrowed() {
    return this.borrowedObjects.length;
  }

}

class BufferedListView extends Backbone.View {

  constructor(options = {}) {
    super(options);
    this.scrollerContainerSelector = '#list-container';
    this.listContainerSelector = '#list-container > .list-display:first';
    this.scrollPositionY = 0;
    this.listHeight = 'auto';
    this.listItemHeight = 30;

    this.visibleOutboundItemsCount = 2;

    this.scrollEventCallFrames = 4;

    this.template = function () {
      return '<div id="list-container"><div class="list-content"></div><ul class="list-display"></ul></div>'
    };

    this.models = options.models || [];
    this.viewsPool = new Pool(ItemView, 100);
    this.viewsMap = new Map();
    if (this.listHeight === 'auto') {
      this.waitToBeAttached = true;
      this.once('attach', function () {
        this.listHeight = this.$listContainer.outerHeight();
        this.renderVisibleItems();
      });
    }
  }

  destroy() {
    this.$el.contents().remove();
    this.models = null;
    this.viewsPool.destroy();
    this.el = this.$el = null;
  }

  render() {
    this.$el.html(this.template());
    this.$listContainer = this.$(this.listContainerSelector);
    this.$scrollerContainer = this.$(this.scrollerContainerSelector);

    let eventCalls = 0;
    this.$scrollerContainer.on('scroll', () => {
      this.scrollPositionY = this.$scrollerContainer.scrollTop();
      this.renderVisibleItems();
      // if (++eventCalls % 4 === 0) {
      // }
    });
    if (this.waitToBeAttached && !this.el.parentNode) {
    } else {
      setTimeout(() => {
        if (this.listHeight === 'auto') {
          this.listHeight = this.queryListHeight();
          this.updateListContentHeight();
        }
        this.renderVisibleItems();
      }, 1000);
    }
  }

  queryListHeight() {
    return this.$el.outerHeight();
  }

  updateListContentHeight() {
    this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight);
  }

  defineRangeOfModelsVisibles() {
    const listContentHeight = this.models.length * this.listItemHeight;
    //const listPositionIndex = Math.floor(this.scrollPositionY / this.listItemHeight);
    let modelsIndex = Math.floor(this.scrollPositionY / this.listItemHeight);
    console.log('actual index', modelsIndex);
    const modelsCount = Math.floor(this.listHeight / this.listItemHeight) + this.visibleOutboundItemsCount * 2;
    modelsIndex = Math.max(0, modelsIndex - this.visibleOutboundItemsCount);
    const modelsLength = Math.min(this.models.length - 1, modelsIndex + modelsCount + this.visibleOutboundItemsCount);
    if (this.scrollPositionY > 100) {
      //debugger;
    }
    return [ modelsIndex, modelsLength ];
  }

  renderVisibleItems() {
    const rangeOfModelsVisibles = this.defineRangeOfModelsVisibles();
    console.log('scrollPositionY', this.scrollPositionY);
    //this.$listContainer.css('transform', `translateY(-${this.scrollPositionY}px)`);
    console.log('range', rangeOfModelsVisibles);
    const visibleModels = this.models.slice(rangeOfModelsVisibles[0], rangeOfModelsVisibles[1]);
    const views = visibleModels.map((model) => {
      return this.getView(model);
    });
    this.renderViews(views);
  }

  getView(model) {
    let view = this.viewsMap.get(model.id);
    if (!view) {
      view = this.viewsPool.borrows();
      if (!view) debugger;
      view.model = model;
      this.viewsMap.set(model.id, view);
      view.render();
    }
    return view;
  }

  removeViews(views) {
    //console.log('remove %s views', views.length);
    for (let index = 0; index < views.length; index++) {
      this.removeView(views[index]);
    }
  }

  removeView(view) {
    this.viewsMap.delete(view.model.id);
    view.model = null;
    view.remove();
    this.viewsPool.returns(view);
  }

  addViews(views) {
    console.log('add %s views', views.length);
    for (let index = 0; index < views.length; index++) {
      this.addView(views[index], index);
    }
  }

  addView(view, index) {
    const $container = this.$listContainer;
    const $children = $container.children();
    // console.log('  addViewAt(%s/%s)', index, $children.length);
    // if ($children.get(index) === view.el) {
    //   console.log('    pass over');
    // }
    if ($children.length <= index) {
      $container.append(view.el);
    } else if (index === 0) {
      $container.prepend(view.el);
    } else {
      $($container.get(index)).before(view.el);
    }
  }

  renderViews(views) {
    const currentViews = this.$listContainer.children().toArray().map(function (node) { return node.__view__; });
    if (currentViews.length === 0) {
      this.addViews(views);
    } else {
      const viewsToRemove = _.reject(currentViews, function (view) { return views.includes(view); });
      const viewsToAdd = views;
      //console.log('viewsToRemove', viewsToRemove);
      this.removeViews(viewsToRemove);
      this.addViews(viewsToAdd);
    }
  }
}

class ItemView extends Marionette.ItemView {
  constructor() {
    super({ tagName: 'li', className: 'item-view' });
    this.el.__view__ = this;
  }

  serializeModel() {
    return this.model;
  }

  template(model) {
    return model.content;
  }
}

function createString() {
  const count = 30;
  return Array(count+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, count);
}
const view = new BufferedListView();
view.models = new Array(3200);
for (let index = 0; index < view.models.length; index++) {
  view.models[index] = { id: _.uniqueId(), content: String(index) };
}
$('#c1').append(view.el);

view.render();
