class BufferedListView extends Backbone.View {

  /**
   *
   * @param {Object} options
   * @param {String} options.listContainerSelector      - Selector where to append child
   * @param {String} options.scrollerContainerSelector  - Selector to get on this element the scrollTop value
   * @param {String|Number} options.listHeight          - Define the list height (can be 'auto')
   * @param {Number} options.listItemHeight             - Define the list item height. Used to set position for each child
   * @param {Number} options.visibleOutboundItemsCount  - Set the number of items rendered out of the visible rectangle.
   * @param {Array} options.models                      - The list of models to be rendered
   * @param {Number} options.maxPoolSize                - The max views at the same time. The pool is working in lazy loading. If you put 100 and only 36 items are shown, only 36 item views are created
  **/
  constructor(options = {}) {
    super(options);
    this.el.__view__ = this;

    this.listContainerSelector = options.listContainerSelector || '.list-container:first > .list-display';
    this.scrollerContainerSelector = options.scrollerContainerSelector || '.list-container:first';
    this.scrollPositionY = 0;
    this.listHeight = options.listHeight || 'auto';
    this.listHeightAutoMode = this.listHeight === 'auto';
    this.listItemHeight = options.listItemHeight;

    this.visibleOutboundItemsCount = 2;

    this.models = options.models || [];
    this.viewsPool = new Pool(ItemView, options.maxPoolSize || -1);
    this.viewsMap = new Map();

    this._onWindowResize = this.onResize.bind(this);
    $(window).on('resize', this._onWindowResize);

    if (this.listHeightAutoMode) {
      this.once('attach', function () {
        this.listHeight = this.queryListHeight();
        this.updateListScrollerHeight();
        this.renderVisibleItems();
      });
    }
  }

  destroy() {
    $(window).off('resize', this._onWindowResize);
    this._onWindowResize = null;
    if (this.$el) this.$el.contents().remove();
    if (this.el) this.el.__view__ = null;
    this.models = null;
    this.viewsPool.destroy();
    this.el = this.$el = null;
  }

  template() {
    return '<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>';
  }

  render() {
    // render view
    this.$el.html(this.template());
    // query elements
    this.$listContainer = this.$(this.listContainerSelector);
    this.$scrollerContainer = this.$(this.scrollerContainerSelector);
    // set on scroll listener
    this.$scrollerContainer.on('scroll', this.onScroll.bind(this));

    if (!this.listHeightAutoMode && this.el.parentNode) {
      this.updateListScrollerHeight();
      this.renderVisibleItems();
    }
  }

  scrollToIndex(index, options = {}) {
    const scrollTopPosition = index * this.listItemHeight;
    if (options.animate) {
      this.$scrollerContainer.animate({
        scrollTop: scrollTopPosition
      }, options.duration || 300);
    } else {
      this.$scrollerContainer.scrollTop(scrollTopPosition);
    }
  }

  queryListHeight() {
    return this.$el.outerHeight();
  }

  updateListScrollerHeight() {
    this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight);
  }

  defineRangeOfModelsVisibles() {
    let modelsIndex = Math.floor(this.scrollPositionY / this.listItemHeight);
    const modelsCount = Math.ceil(this.listHeight / this.listItemHeight);
    const modelsLength = Math.min(this.models.length - 1, modelsIndex + modelsCount);
    return [ modelsIndex, modelsLength ];
  }

  renderItemsRange([ start, end ]) {
    this.__actualIndex__ = start;
    const modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
    const modelsEnd = Math.min(this.models.length, end + this.visibleOutboundItemsCount)
    const rangeOfModels = this.models.slice(start, end);
    const views = rangeOfModels.map((model, index) => {
      const view = this.getView(model, start + Number(index));
      view.el.setAttribute('data-index', view.indexInModelList);
      return view;
    });
    this.renderViews(views);
    if (BufferedListView.DEV_MODE) this.renderDebugInfos();
  }

  renderVisibleItems() {
    this.renderItemsRange(this.defineRangeOfModelsVisibles());
  }

  renderDebugInfos() {
    $('#debug-container').html(`<div>Actual pool usage: ${this.viewsPool.getCountBorrowed()} / ${this.viewsPool.getCountAvailables()}</div><div>Current start index: ${this.__actualIndex__}</div>`)
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
    for (let index = 0; index < views.length; index++) {
      this.addView(views[index], index);
    }
  }

  addView(view, index) {
    const $container = this.$listContainer;
    const $children = $container.children();
    const positionTop = this.listItemHeight * view.indexInModelList;
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
      this.removeViews(viewsToRemove);
      this.addViews(viewsToAdd);
    }
  }

  onResize(event) {
    this._onResize(event);
    this.renderVisibleItems();
  }

  onScroll(event) {
    this._onScroll(event);
  }

  _onResize(event) {
    if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
  }

  _onScroll(event) {
    this.scrollPositionY = this.$scrollerContainer.scrollTop();
    this.renderVisibleItems();
  }
}