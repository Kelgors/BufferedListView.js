import $ from 'jquery';
import View from 'View';
import BufferedListItemView from 'BufferedListItemView';
import { createConstantArray } from 'arrays';
import KLogger from 'klogger';

const logger = new KLogger(KLogger.WARN);
let EventManager;

/*
 * interface EventManager {
 *   on(eventName, eventCallback, eventContext?);
 *   off(eventName, eventCallback, eventContext?);
 *   trigger(eventName, eventValue);
 * }
 */

export default class BufferedListView extends View {

  static setEventManager(eventManager) {
    EventManager = eventManager;
  }

  static setLogLevel(levelName) {
    levelName = levelName.toUpperCase();
    if (levelName in KLogger) logger.loglevel = KLogger[levelName];
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
   * @param {String} options.idModelPropertyName        - The propetyName which identify each objects
   * @param {Function} options.ItemConstructor          - The constructor for each child views (default: BufferedListItemView)
  **/
  constructor({ listContainerSelector, scrollerContainerSelector, listHeight, listItemHeight, idModelPropertyName, visibleOutboundItemsCount, ItemConstructor, models } = {}) {
    super();
    if (EventManager) $.extend(this, EventManager);
    else throw 'UndefinedEventManagerError: Please set by calling BufferedListView.setEventManager(eventManager : Object)';
    Object.defineProperty(this, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: createConstantArray(0, 0)
    });
    this.scrollPositionY = 0;
    this.isRendered = false;
    this.$listContainer = null;
    this.$scrollerContainer = null;

    this.listContainerSelector = listContainerSelector || '.list-container:first > .list-display';
    this.scrollerContainerSelector = scrollerContainerSelector || '.list-container:first';
    this.listHeight = listHeight || 'auto';
    this.listHeightAutoMode = this.listHeight === 'auto';
    this.listItemHeight = listItemHeight;
    this.idModelPropertyName = idModelPropertyName || 'id';

    this.visibleOutboundItemsCount = typeof visibleOutboundItemsCount !== 'number' ? 2 : visibleOutboundItemsCount;

    this.viewsMap = new Map();
    this.models = models || [];
    this.ItemConstructor = ItemConstructor || null;

    this._onWindowResize = this.onResize.bind(this);
    $(window).on('resize', this._onWindowResize);

    if (this.listHeightAutoMode) {
      this.once('attach', () => {
        this.listHeight = this.queryListHeight();
        if (this.isRendered) {
          this.updateListScrollerHeight();
          this.renderVisibleItems();
        }
      });
    }
  }

  destroy() {
    logger.debug('Destroying instance of BufferedListView');
    $(window).off('resize', this._onWindowResize);
    if (this.el && '__view__' in this.el) this.el.__view__ = null;
    super.destroy();
    this.isRendered = false;
    this.listContainerSelector = null;
    this.scrollerContainerSelector = null;
    this.scrollPositionY = 0;
    this.listHeight = null;
    this.listHeightAutoMode = null;
    this.listItemHeight = null;
    this.idModelPropertyName = null;
    this.visibleOutboundItemsCount = null;
    this.models = null;
    this.ItemConstructor = null;
    this.viewsMap = null;
    this._onWindowResize = null;
    this.$listContainer = null;
    this.$scrollerContainer = null;
  }

  setModels(models = []) {
    this.models = models;
    Object.defineProperty(this, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: createConstantArray(-1, -1)
    });
    this.updateListScrollerHeight();
    this.renderVisibleItems();
  }

  /**
   * Returns the ItemView used to render each models
   * @returns {Function}
  **/
  getItemConstructor() {
    return this.ItemConstructor || BufferedListItemView;
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
    this.renderBaseView();
    this.isRendered = true;
    // query elements
    this.$listContainer = this.$(this.listContainerSelector);
    this.$scrollerContainer = this.$(this.scrollerContainerSelector);
    // set on scroll listener
    /* Try to use passive event
    const scrollerContainerElement = this.$scrollerContainer.get(0);
    if (scrollerContainerElement) {
      scrollerContainerElement.addEventListener('scroll', this.onScroll.bind(this), {
        passive: true,
        capture: false
      });
    }*/
    this.$scrollerContainer.on('scroll', this.onScroll.bind(this));

    if (this.isAttached) {
      if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
      this.updateListScrollerHeight();
      this.renderVisibleItems();
    }
  }

  renderBaseView() {
    this.$el.html(this.template());
  }

  attachTo(element) {
    $(element).append(this.$el);
    if (this.el.parentNode) this.trigger('attach');
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
    this.$scrollerContainer.find('.list-content').height(`${this.models.length * this.listItemHeight}px`);
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

  getRangeOfModels([ start, end ]) {
    return this.models.slice(start, end);
  }

  /**
   *
   * @param {number[]} tuple - [ startIndex, endIndex ]
   * @param {boolean} forceRendering
  **/
  renderItemsRange([ start, end ], forceRendering = false) {
    if (!forceRendering && this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
    const modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
    const modelsEnd = Math.min(this.models.length, end + this.visibleOutboundItemsCount);
    const rangeOfModels = this.getRangeOfModels([ modelsStart, modelsEnd ]);
    const views = rangeOfModels.map((model, index) => {
      return this.getView(model, modelsStart + Number(index));
    });
    this.renderViews(views);
    Object.defineProperty(this, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: createConstantArray(start, end)
    });
    if (BufferedListView.debugMode) this.renderDebugInfos();
  }

  /**
   * Render items that should be currently visible
  **/
  renderVisibleItems(forceRendering) {
    // ensure forceRendering is true.
    this.renderItemsRange(this.defineRangeOfModelsVisibles(), forceRendering === true);
  }

  /**
   * Render the given array of views into this list
   * @method
   * @param {any[]} views
  **/
  renderViews(views) {
    const currentViews = [...this.viewsMap.values()];
    if (currentViews.length === 0) {
      this.addViews(views);
    } else {
      const viewsToRemove = currentViews.filter((view) => { return !views.includes(view); });
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
      view = this.createView(model, indexInModelList);
      this.viewsMap.set(model[this.idModelPropertyName], view);
      view.render();
    } else view.onUpdate({ indexInModelList: indexInModelList, parentListView: this, type: 'update' });

    return view;
  }

  createView(model, indexInModelList) {
    const view = new (this.getItemConstructor())();
    view.onInitialize({ type: 'initialize', model: model, parentListView: this, indexInModelList: indexInModelList });
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
    view[this.getItemConstructor().DESTROY_METHOD]();
    view.parentListView = null;
    view.model = null;
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

  /* Class behavior dependent events */

  /**
   * When the viewport is resized and this.listHeightAutoMode is truthy, update list height
   * @param {Event}
  **/
  _onResize(event) {
    if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
  }

  /**
   * When the user scroll the list-scroller, update scroll position and render visible items
   * @param {Event} event
  **/
  _onScroll(event) {
    this.scrollPositionY = this.$scrollerContainer.scrollTop();
    this.renderVisibleItems();
  }

/* Debug */

  toDebugInfos() {
    const [ startIndex, endIndex ] = this.defineRangeOfModelsVisibles();
    return `Visible range: (${startIndex}, ${endIndex})\nVisible models: (${Math.max(0, startIndex - this.visibleOutboundItemsCount)}, ${Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount)})`;
  }

  renderDebugInfos() {
    $('#debug-container').html(`<div>${this.toDebugInfos().replace('\n', '</div><div>')}</div>`);
  }
}

BufferedListView.VERSION = '1.1.5';
BufferedListView.debugMode = false;
BufferedListView.INSTANCE_PROPERTIES = {
  // BufferedListView
  _currentVisibleRange: null,
  isRendered: false,
  listContainerSelector: null,
  scrollerContainerSelector: null,
  scrollPositionY: 0,
  listHeight: null,
  listHeightAutoMode: null,
  listItemHeight: null,
  idModelPropertyName: null,
  visibleOutboundItemsCount: null,
  models: Array,
  ItemConstructor: null,
  viewsMap: Map,
  _onWindowResize: null,
  $listContainer: null,
  $scrollerContainer: null
};


