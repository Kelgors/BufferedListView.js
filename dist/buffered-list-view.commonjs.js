"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConstantArray = createConstantArray;
function createConstantArray() {
  for (var _len = arguments.length, elements = Array(_len), _key = 0; _key < _len; _key++) {
    elements[_key] = arguments[_key];
  }

  // create array with predefined properties 0, 1, 2, n...
  var array = new Array(elements.length);
  for (var index = 0; index < elements.length; index++) {
    // typeof array === 'object' =D so,
    // Assign each elements as enumerable non-writable
    Object.defineProperty(array, index, {
      configurable: false, writable: false, enumerable: true,
      value: elements[index]
    });
  }
  return array;
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
  _createClass(View, [{
    key: 'isAttached',
    get: function get() {
      return !!this.el && !!this.el.parentNode;
    }
  }]);

  function View() {
    _classCallCheck(this, View);

    this.$el = (0, _jquery2.default)(this.el = document.createElement(this.constructor.tagName || 'div'));
    this.$el.addClass('view');
    this.model = null;
    if (typeof DEV_MODE !== 'undefined') this.el.__view__ = this;
  }

  _createClass(View, [{
    key: 'destroy',
    value: function destroy() {
      if (this.el) {
        if ('__view__' in this.el) this.el.__view__ = null;
        this.remove();
      }
    }
  }, {
    key: '$',
    value: function $() {
      return this.$el.find.apply(this.$el, arguments);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.remove();
      this.el.innerHTML = '';
      this.model = null;
    }
  }, {
    key: 'remove',
    value: function remove() {
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
    }
  }, {
    key: 'template',
    value: function template() {
      return '';
    }
  }, {
    key: 'render',
    value: function render() {
      this.el.innerHTML = this.template();
    }
  }]);

  return View;
}();

exports.default = View;

View.DESTROY_METHOD = 'destroy';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _View2 = require('View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferedListItemView = function (_View) {
  _inherits(BufferedListItemView, _View);

  function BufferedListItemView() {
    _classCallCheck(this, BufferedListItemView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListItemView).call(this));

    _this.$el.addClass('item-view');
    return _this;
  }

  _createClass(BufferedListItemView, [{
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(BufferedListItemView.prototype), 'destroy', this).call(this);
      this.indexInModelList = null;
      this.model = null;
      this.parentListView = null;
    }
  }, {
    key: 'template',
    value: function template() {
      return String(this.indexInModelList);
    }
  }, {
    key: 'onInitialize',
    value: function onInitialize(_ref) {
      var model = _ref.model;
      var parentListView = _ref.parentListView;
      var indexInModelList = _ref.indexInModelList;

      this.model = model;
      this.parentListView = parentListView;
      this.indexInModelList = indexInModelList;
      this.el.setAttribute('data-index', this.indexInModelList);
    }
  }, {
    key: 'onUpdate',
    value: function onUpdate(event) {
      this.indexInModelList = event.indexInModelList;
      this.el.setAttribute('data-index', this.indexInModelList);
    }
  }]);

  return BufferedListItemView;
}(_View3.default);

exports.default = BufferedListItemView;


BufferedListItemView.tagName = 'li';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _View2 = require('View');

var _View3 = _interopRequireDefault(_View2);

var _BufferedListItemView = require('BufferedListItemView');

var _BufferedListItemView2 = _interopRequireDefault(_BufferedListItemView);

var _arrays = require('arrays');

var _klogger = require('klogger');

var _klogger2 = _interopRequireDefault(_klogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logger = new _klogger2.default(_klogger2.default.WARN);
var EventManager = void 0;

/*
 * interface EventManager {
 *   on(eventName, eventCallback, eventContext?);
 *   off(eventName, eventCallback, eventContext?);
 *   trigger(eventName, eventValue);
 * }
 */

var BufferedListView = function (_View) {
  _inherits(BufferedListView, _View);

  _createClass(BufferedListView, null, [{
    key: 'setEventManager',
    value: function setEventManager(eventManager) {
      EventManager = eventManager;
    }
  }, {
    key: 'setLogLevel',
    value: function setLogLevel(levelName) {
      levelName = levelName.toUpperCase();
      if (levelName in _klogger2.default) logger.loglevel = _klogger2.default[levelName];
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

  }]);

  function BufferedListView() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var listContainerSelector = _ref.listContainerSelector;
    var scrollerContainerSelector = _ref.scrollerContainerSelector;
    var listHeight = _ref.listHeight;
    var listItemHeight = _ref.listItemHeight;
    var idModelPropertyName = _ref.idModelPropertyName;
    var visibleOutboundItemsCount = _ref.visibleOutboundItemsCount;
    var ItemConstructor = _ref.ItemConstructor;
    var models = _ref.models;

    _classCallCheck(this, BufferedListView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this));

    if (EventManager) _jquery2.default.extend(_this, EventManager);else throw 'UndefinedEventManagerError: Please set by calling BufferedListView.setEventManager(eventManager : Object)';
    Object.defineProperty(_this, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: (0, _arrays.createConstantArray)(0, 0)
    });
    _this.scrollPositionY = 0;
    _this.isRendered = false;
    _this.$listContainer = null;
    _this.$scrollerContainer = null;

    _this.listContainerSelector = listContainerSelector || '.list-container:first > .list-display';
    _this.scrollerContainerSelector = scrollerContainerSelector || '.list-container:first';
    _this.listHeight = listHeight || 'auto';
    _this.listHeightAutoMode = _this.listHeight === 'auto';
    _this.listItemHeight = listItemHeight;
    _this.idModelPropertyName = idModelPropertyName || 'id';

    _this.visibleOutboundItemsCount = typeof visibleOutboundItemsCount !== 'number' ? 2 : visibleOutboundItemsCount;

    _this.viewsMap = new Map();
    _this.models = models || [];
    _this.ItemConstructor = ItemConstructor || null;

    _this._onWindowResize = _this.onResize.bind(_this);
    (0, _jquery2.default)(window).on('resize', _this._onWindowResize);

    if (_this.listHeightAutoMode) {
      _this.once('attach', function () {
        _this.listHeight = _this.queryListHeight();
        if (_this.isRendered) {
          _this.updateListScrollerHeight();
          _this.renderVisibleItems();
        }
      });
    }
    return _this;
  }

  _createClass(BufferedListView, [{
    key: 'destroy',
    value: function destroy() {
      logger.debug('Destroying instance of BufferedListView');
      (0, _jquery2.default)(window).off('resize', this._onWindowResize);
      if (this.el && '__view__' in this.el) this.el.__view__ = null;
      _get(Object.getPrototypeOf(BufferedListView.prototype), 'destroy', this).call(this);
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
  }, {
    key: 'setModels',
    value: function setModels() {
      var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this.models = models;
      Object.defineProperty(this, '_currentVisibleRange', {
        configurable: true, writable: false,
        value: (0, _arrays.createConstantArray)(-1, -1)
      });
      this.updateListScrollerHeight();
      this.renderVisibleItems();
    }

    /**
     * Returns the ItemView used to render each models
     * @returns {Function}
    **/

  }, {
    key: 'getItemConstructor',
    value: function getItemConstructor() {
      return this.ItemConstructor || _BufferedListItemView2.default;
    }

    /* Rendering related methods */

    /**
     * Returns the html content of a empty BufferedListView
     * @returns {String}
    **/

  }, {
    key: 'template',
    value: function template() {
      return '<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>';
    }

    /**
     * Put the value returned by template method and listen all events necessary
    **/

  }, {
    key: 'render',
    value: function render() {
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
  }, {
    key: 'renderBaseView',
    value: function renderBaseView() {
      this.$el.html(this.template());
    }
  }, {
    key: 'attachTo',
    value: function attachTo(element) {
      (0, _jquery2.default)(element).append(this.$el);
      if (this.el.parentNode) this.trigger('attach');
    }

    /**
     * Scroll to the index of a model
     * @param {Number} index - The index of the model in models array
     * @param {?Object} options
     * @param {Object} options.animate - scroll with animation
    **/

  }, {
    key: 'scrollToIndex',
    value: function scrollToIndex(index) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var scrollTopPosition = index * this.listItemHeight;
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

  }, {
    key: 'queryListHeight',
    value: function queryListHeight() {
      return this.$el.outerHeight();
    }

    /**
     * Update the scroller height. It results that the list scrolling is adapted to its content
    **/

  }, {
    key: 'updateListScrollerHeight',
    value: function updateListScrollerHeight() {
      this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight + 'px');
    }

    /**
     * Define with scrollPositionY, listItemHeight and listHeight the range of models which should be visible
     * @returns {Number[]} [ startIndex, endIndex ]
    **/

  }, {
    key: 'defineRangeOfModelsVisibles',
    value: function defineRangeOfModelsVisibles() {
      var start = Math.floor(this.scrollPositionY / this.listItemHeight);
      var length = Math.ceil(this.listHeight / this.listItemHeight);
      var end = Math.min(this.models.length - 1, start + length);
      return [start, end];
    }
  }, {
    key: 'getRangeOfModels',
    value: function getRangeOfModels(_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);

      var start = _ref3[0];
      var end = _ref3[1];

      return this.models.slice(start, end);
    }

    /**
     *
     * @param {number[]} tuple - [ startIndex, endIndex ]
     * @param {boolean} forceRendering
    **/

  }, {
    key: 'renderItemsRange',
    value: function renderItemsRange(_ref4) {
      var _this2 = this;

      var _ref5 = _slicedToArray(_ref4, 2);

      var start = _ref5[0];
      var end = _ref5[1];
      var forceRendering = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (!forceRendering && this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
      var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
      var modelsEnd = Math.min(this.models.length, end + this.visibleOutboundItemsCount);
      var rangeOfModels = this.getRangeOfModels([modelsStart, modelsEnd]);
      var views = rangeOfModels.map(function (model, index) {
        return _this2.getView(model, modelsStart + Number(index));
      });
      this.renderViews(views);
      Object.defineProperty(this, '_currentVisibleRange', {
        configurable: true, writable: false,
        value: (0, _arrays.createConstantArray)(start, end)
      });
      if (BufferedListView.debugMode) this.renderDebugInfos();
    }

    /**
     * Render items that should be currently visible
    **/

  }, {
    key: 'renderVisibleItems',
    value: function renderVisibleItems(forceRendering) {
      // ensure forceRendering is true.
      this.renderItemsRange(this.defineRangeOfModelsVisibles(), forceRendering === true);
    }

    /**
     * Render the given array of views into this list
     * @method
     * @param {any[]} views
    **/

  }, {
    key: 'renderViews',
    value: function renderViews(views) {
      var currentViews = [].concat(_toConsumableArray(this.viewsMap.values()));
      if (currentViews.length === 0) {
        this.addViews(views);
      } else {
        var viewsToRemove = currentViews.filter(function (view) {
          return !views.includes(view);
        });
        var viewsToAdd = views;
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

  }, {
    key: 'getView',
    value: function getView(model, indexInModelList) {
      var view = this.viewsMap.get(model[this.idModelPropertyName]);

      if (typeof this.idModelPropertyName === 'undefined') {
        throw new Error('BufferedListView#idModelPropertyName must be defined');
      }
      if (typeof model[this.idModelPropertyName] === 'undefined') {
        throw new Error('The model.' + this.idModelPropertyName + ' is undefined. There is no chance to show more than one view.');
      }
      if (!view) {
        view = this.createView(model, indexInModelList);
        this.viewsMap.set(model[this.idModelPropertyName], view);
        view.render();
      } else view.onUpdate({ indexInModelList: indexInModelList, parentListView: this, type: 'update' });

      return view;
    }
  }, {
    key: 'createView',
    value: function createView(model, indexInModelList) {
      var view = new (this.getItemConstructor())();
      view.onInitialize({ type: 'initialize', model: model, parentListView: this, indexInModelList: indexInModelList });
      return view;
    }

    /**
     * Remove the given views list from this view
     * @param {any[]} views
    **/

  }, {
    key: 'removeViews',
    value: function removeViews(views) {
      for (var index = 0; index < views.length; index++) {
        this.removeView(views[index]);
      }
    }

    /**
     * Remove the given view from this view
     * @param {any} view
    **/

  }, {
    key: 'removeView',
    value: function removeView(view) {
      this.viewsMap.delete(view.model[this.idModelPropertyName]);
      view[this.getItemConstructor().DESTROY_METHOD]();
      view.parentListView = null;
      view.model = null;
    }

    /**
     * Add the given views list from this view
     * @param {any[]} views
    **/

  }, {
    key: 'addViews',
    value: function addViews(views) {
      for (var index = 0; index < views.length; index++) {
        this.addView(views[index], index);
      }
    }

    /**
     * Add the given view from this view
     * @param {any} view
    **/

  }, {
    key: 'addView',
    value: function addView(view, index) {
      var $container = this.$listContainer;
      var $children = $container.children();
      var positionTop = this.listItemHeight * view.indexInModelList;
      view.el.style.top = String(positionTop) + 'px';
      if ($children.length <= index) {
        $container.append(view.el);
      } else if (index === 0) {
        $container.prepend(view.el);
      } else {
        (0, _jquery2.default)($container.children().get(index)).after(view.el);
      }
    }

    /* Events */

  }, {
    key: 'onResize',
    value: function onResize(event) {
      this._onResize(event);
      this.renderVisibleItems();
    }
  }, {
    key: 'onScroll',
    value: function onScroll(event) {
      this._onScroll(event);
    }

    /* Class behavior dependent events */

    /**
     * When the viewport is resized and this.listHeightAutoMode is truthy, update list height
     * @param {Event}
    **/

  }, {
    key: '_onResize',
    value: function _onResize(event) {
      if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
    }

    /**
     * When the user scroll the list-scroller, update scroll position and render visible items
     * @param {Event} event
    **/

  }, {
    key: '_onScroll',
    value: function _onScroll(event) {
      this.scrollPositionY = this.$scrollerContainer.scrollTop();
      this.renderVisibleItems();
    }

    /* Debug */

  }, {
    key: 'toDebugInfos',
    value: function toDebugInfos() {
      var _defineRangeOfModelsV = this.defineRangeOfModelsVisibles();

      var _defineRangeOfModelsV2 = _slicedToArray(_defineRangeOfModelsV, 2);

      var startIndex = _defineRangeOfModelsV2[0];
      var endIndex = _defineRangeOfModelsV2[1];

      return 'Visible range: (' + startIndex + ', ' + endIndex + ')\nVisible models: (' + Math.max(0, startIndex - this.visibleOutboundItemsCount) + ', ' + Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount) + ')';
    }
  }, {
    key: 'renderDebugInfos',
    value: function renderDebugInfos() {
      (0, _jquery2.default)('#debug-container').html('<div>' + this.toDebugInfos().replace('\n', '</div><div>') + '</div>');
    }
  }]);

  return BufferedListView;
}(_View3.default);

exports.default = BufferedListView;


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