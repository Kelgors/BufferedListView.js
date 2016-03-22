class BufferedListView extends Backbone.View {

  constructor(options = {}) {
    super(options);
    this.el.__view__ = this;
    this.scrollerContainerSelector = '#list-container';
    this.listContainerSelector = '#list-container > .list-display:first';
    this.scrollPositionY = 0;
    this.listHeight = 'auto';
    this.listItemHeight = 31;

    this.visibleOutboundItemsCount = 2;

    this.scrollEventCallFrames = 4;

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

  template() {
    return '<div id="list-container"><div class="list-content"></div><ul class="list-display"></ul></div>';
  }

  render() {
    this.$el.html(this.template());
    this.$listContainer = this.$(this.listContainerSelector);
    this.$scrollerContainer = this.$(this.scrollerContainerSelector);

    let eventCalls = 0;
    this.$scrollerContainer.on('scroll', () => {
      this.scrollPositionY = this.$scrollerContainer.scrollTop();
      //console.log(this.scrollPositionY);
      this.renderVisibleItems();
      // if (++eventCalls % this.scrollEventCallFrames === 0) {
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
    //console.log('actual index', modelsIndex);
    this.__actualIndex__ = modelsIndex;
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
    console.log('range', rangeOfModelsVisibles);
    const visibleModels = this.models.slice(rangeOfModelsVisibles[0], rangeOfModelsVisibles[1]);
    const views = visibleModels.map((model, index) => {
      const view = this.getView(model, Number(rangeOfModelsVisibles[0]) + Number(index));
      view.el.setAttribute('data-index', view.indexInModelList);
      return view;
    });
    this.renderViews(views);
    this.renderDebugInfos();
  }

  renderDebugInfos() {
    $('#debug-container')
      .html(`
  <div>Actual pool usage: ${this.viewsPool.getCountBorrowed()} / ${this.viewsPool.getCountAvailables()}</div>
  <div>Current start index: ${this.__actualIndex__}</div>
`)
  }

  getView(model, indexInModelList) {
    let view = this.viewsMap.get(model.id);
    if (!view) {
      view = this.viewsPool.borrows();
      if (!view) debugger;
      view.model = model;
      view.indexInModelList = indexInModelList;
      view.render();
      this.viewsMap.set(model.id, view);
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
    //console.log('add %s views', views.length);
    for (let index = 0; index < views.length; index++) {
      this.addView(views[index], index);
    }
  }

  addView(view, index) {
    const $container = this.$listContainer;
    const $children = $container.children();
    //const positionTop = this.scrollPositionY + this.listItemHeight * index;
    const positionTop = this.listItemHeight * view.indexInModelList;
    // console.log('  addViewAt(%s/%s)', index, $children.length);
    // if ($children.get(index) === view.el) {
    //   console.log('    pass over');
    // }
    view.el.style.top = String(positionTop) + 'px';
    if ($children.length <= index) {
      $container.append(view.el);
    } else if (index === 0) {
      $container.prepend(view.el);
    } else {
      $($container.children().get(index)).after(view.el);
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