import $ from 'jquery';
import Backbone from 'backbone';
import Pool from 'Pool';
import BufferedListItemView from 'BufferedListItemView';
import { createConstantArray } from 'arrays';

export default class BufferedListView extends Backbone.View {

  get isAttached() {
    return !!this.el && !!this.el.parentNode;
  }

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
    Object.defineProperty(this, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: createConstantArray(0, 0)
    });

    this.isRendered = false;
    this.listContainerSelector = options.listContainerSelector || '.list-container:first > .list-display';
    this.scrollerContainerSelector = options.scrollerContainerSelector || '.list-container:first';
    this.scrollPositionY = 0;
    this.listHeight = options.listHeight || 'auto';
    this.listHeightAutoMode = this.listHeight === 'auto';
    this.listItemHeight = options.listItemHeight;
    this.idModelPropertyName = options.idModelPropertyName || 'id';

    this.visibleOutboundItemsCount = typeof options.visibleOutboundItemsCount !== 'number' ? 2 : options.visibleOutboundItemsCount;

    this.models = options.models || [];
    const ItemConstructor = options.ItemConstructor || this.getItemConstructor();
    this.viewsPool = new Pool(ItemConstructor, options.maxPoolSize || -1, {
      clearMethodName: ItemConstructor.CLEAR_METHOD,
      destroyMethodName: ItemConstructor.DESTROY_METHOD
    });
    this.viewsMap = new Map();

    this._onWindowResize = this.onResize.bind(this);
    $(window).on('resize', this._onWindowResize);

    if (this.listHeightAutoMode) {
      this.once('attach', function () {
        this.listHeight = this.queryListHeight();
        if (this.isRendered) {
          this.updateListScrollerHeight();
          this.renderVisibleItems();
        }
      });
    }
  }

  destroy() {
    $(window).off('resize', this._onWindowResize);
    this.viewsPool.destroy();
    if (this.el) delete this.el.__view__;
    if (this.$el) this.remove();
    delete this._onWindowResize;
    delete this.models;
    delete this.el;
    delete this.$el;
  }

  /**
   * Returns the ItemView used to render each models
   * @returns {Function}
  **/
  getItemConstructor() {
    return BufferedListItemView;
  }

/* Rendering related methods */

  /**
   * Returns the html content of a empty BufferedListView
   * @returns {String}
  **/
  template() {
    return '<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>';
  }

  /**
   * Put the value returned by template method and listen all events necessary
  **/
  render() {
    // render view
    this.$el.html(this.template());
    this.isRendered = true;
    // query elements
    this.$listContainer = this.$(this.listContainerSelector);
    this.$scrollerContainer = this.$(this.scrollerContainerSelector);
    // set on scroll listener
    this.$scrollerContainer.on('scroll', this.onScroll.bind(this));

    if (this.isAttached) {
      if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
      this.updateListScrollerHeight();
      this.renderVisibleItems();
    }
  }

  /**
   * Scroll to the index of a model
   * @param {Number} index - The index of the model in models array
   * @param {?Object} options
   * @param {Object} options.animate - scroll with animation
  **/
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

  /**
   * Calculate the total height of this view
  **/
  queryListHeight() {
    return this.$el.outerHeight();
  }

  /**
   * Update the scroller height. It results that the list scrolling is adapted to its content
  **/
  updateListScrollerHeight() {
    this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight);
  }

  /**
   * Define with scrollPositionY, listItemHeight and listHeight the range of models which should be visible
   * @returns {Number[]} [ startIndex, endIndex ]
  **/
  defineRangeOfModelsVisibles() {
    const start = Math.floor(this.scrollPositionY / this.listItemHeight);
    const length = Math.ceil(this.listHeight / this.listItemHeight);
    const end = Math.min(this.models.length - 1, start + length);
    return [ start, end ];
  }

  /**
   *
   * @param {Number[]} tuple - [ startIndex, endIndex ]
  **/
  renderItemsRange([ start, end ]) {
    if (this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
    const modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
    const modelsEnd = Math.min(this.models.length - 1, end + this.visibleOutboundItemsCount);
    const rangeOfModels = this.models.slice(modelsStart, modelsEnd);
    const views = rangeOfModels.map((model, index) => {
      const view = this.getView(model, modelsStart + Number(index));
      view.el.setAttribute('data-index', view.indexInModelList);
      return view;
    });
    this.renderViews(views);
    Object.defineProperty(this, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: createConstantArray(start, end)
    });
    if (this.constructor.DEV_MODE) this.renderDebugInfos();
  }

  /**
   * Render items that should be currently visible
  **/
  renderVisibleItems() {
    this.renderItemsRange(this.defineRangeOfModelsVisibles());
  }

  /**
   * Render the given array of views into this list
   * @method
   * @param {any[]} views
  **/
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


/* view list management */

  /**
   * Get a view from the views pool
   * @param {Object} model
   * @param {Number} indexInModelList
   * @returns {any}
  **/
  getView(model, indexInModelList) {
    let view = this.viewsMap.get(model[this.idModelPropertyName]);
    if (typeof this.idModelPropertyName === 'undefined') {
      throw new Error('BufferedListView#idModelPropertyName must be defined');
    }
    if (typeof model[this.idModelPropertyName] === 'undefined') {
      throw new Error(`The model.${this.idModelPropertyName} is undefined. There is no chance to show more than one view.`);
    }
    if (!view) {
      view = this.viewsPool.borrows();
      if (!view) throw new Error(`No views availables. Actually borrowed: ${ this.viewsPool.getCountBorrowed() }`);
      view.model = model;
      view.indexInModelList = indexInModelList;
      view.render();
      this.viewsMap.set(model[this.idModelPropertyName], view);
    }
    return view;
  }

  /**
   * Remove the given views list from this view
   * @param {any[]} views
  **/
  removeViews(views) {
    for (let index = 0; index < views.length; index++) {
      this.removeView(views[index]);
    }
  }

  /**
   * Remove the given view from this view
   * @param {any} view
  **/
  removeView(view) {
    this.viewsMap.delete(view.model[this.idModelPropertyName]);
    this.viewsPool.returns(view);
  }

  /**
   * Add the given views list from this view
   * @param {any[]} views
  **/
  addViews(views) {
    for (let index = 0; index < views.length; index++) {
      this.addView(views[index], index);
    }
  }

  /**
   * Add the given view from this view
   * @param {any} view
  **/
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

/* Events */

  onResize(event) {
    this._onResize(event);
    this.renderVisibleItems();
  }

  onScroll(event) {
    this._onScroll(event);
  }

  /* Class behavior dependant events */
  _onResize(event) {
    if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
  }

  _onScroll(event) {
    this.scrollPositionY = this.$scrollerContainer.scrollTop();
    this.renderVisibleItems();
  }

/* Debug */

  renderDebugInfos() {
    const [ startIndex, endIndex ] = this.defineRangeOfModelsVisibles();
    $('#debug-container').html(`
<div>Actual pool usage: ${this.viewsPool.getCountBorrowed()} / ${this.viewsPool.getCountAvailables()}</div>
<div>Visible range: (${startIndex}, ${endIndex})</div>
<div>Visible models: (${Math.max(0, startIndex - this.visibleOutboundItemsCount)}, ${Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount)})`);
  }
}