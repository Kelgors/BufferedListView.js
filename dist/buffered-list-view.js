'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var View = function () {
  _createClass(View, [{
    key: 'isAttached',
    get: function get() {
      return !!this.el && !!this.el.parentNode;
    }
  }]);

  function View() {
    _classCallCheck(this, View);

    this.$el = jQuery(this.el = document.createElement(this.constructor.tagName || 'div'));
    this.$el.addClass('view');
    this.el.__view__ = this;
  }

  _createClass(View, [{
    key: 'destroy',
    value: function destroy() {
      if (this.el) {
        this.el.__view__ = null;
        this.remove();
      }
      this.el = this.$el = this.model = null;
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
      return String(this.indexInModelList);
    }
  }, {
    key: 'render',
    value: function render() {
      this.el.innerHTML = this.template();
    }
  }]);

  return View;
}();

var BufferedListItemView = function (_View) {
  _inherits(BufferedListItemView, _View);

  function BufferedListItemView() {
    _classCallCheck(this, BufferedListItemView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListItemView).call(this));

    _this.$el.addClass('item-view');
    return _this;
  }

  return BufferedListItemView;
}(View);

BufferedListItemView.tagName = 'li';
BufferedListItemView.DESTROY_METHOD = 'destroy';

var BufferedListView = function (_View2) {
  _inherits(BufferedListView, _View2);

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
   * @param {Function} options.ItemConstructor          - The constructor for each child views (default: call getItemConstructor())
  **/

  function BufferedListView() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BufferedListView);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this, options));

    $.extend(_this2, Bullet);
    Object.defineProperty(_this2, '_currentVisibleRange', {
      configurable: true, writable: false,
      value: createConstantArray(0, 0)
    });

    _this2.isRendered = false;
    _this2.listContainerSelector = options.listContainerSelector || '.list-container:first > .list-display';
    _this2.scrollerContainerSelector = options.scrollerContainerSelector || '.list-container:first';
    _this2.scrollPositionY = 0;
    _this2.listHeight = options.listHeight || 'auto';
    _this2.listHeightAutoMode = _this2.listHeight === 'auto';
    _this2.listItemHeight = options.listItemHeight;
    _this2.idModelPropertyName = options.idModelPropertyName || 'id';

    _this2.visibleOutboundItemsCount = typeof options.visibleOutboundItemsCount !== 'number' ? 2 : options.visibleOutboundItemsCount;

    _this2.models = options.models || [];
    _this2.ItemConstructor = options.ItemConstructor || _this2.getItemConstructor();
    _this2.viewsMap = new Map();

    _this2._onWindowResize = _this2.onResize.bind(_this2);
    $(window).on('resize', _this2._onWindowResize);

    if (_this2.listHeightAutoMode) {
      _this2.once('attach', function () {
        _this2.listHeight = _this2.queryListHeight();
        if (_this2.isRendered) {
          _this2.updateListScrollerHeight();
          _this2.renderVisibleItems();
        }
      });
    }
    return _this2;
  }

  _createClass(BufferedListView, [{
    key: 'destroy',
    value: function destroy() {
      $(window).off('resize', this._onWindowResize);
      if (this.el) delete this.el.__view__;
      if (this.$el) this.remove();
      this._onWindowResize = null;
      this.$listContainer = null;
      this.$scrollerContainer = null;
      this.models = null;
      this.$el = null;
      this.el = null;
    }
  }, {
    key: 'setModels',
    value: function setModels() {
      var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      this.models = models;
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
      return BufferedListItemView;
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
  }, {
    key: 'attachTo',
    value: function attachTo(element) {
      $(element).append(this.$el);
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

    /**
     *
     * @param {Number[]} tuple - [ startIndex, endIndex ]
    **/

  }, {
    key: 'renderItemsRange',
    value: function renderItemsRange(_ref) {
      var _this3 = this;

      var _ref2 = _slicedToArray(_ref, 2);

      var start = _ref2[0];
      var end = _ref2[1];

      if (this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
      var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
      var modelsEnd = Math.min(this.models.length, end + this.visibleOutboundItemsCount);
      var rangeOfModels = this.models.slice(modelsStart, modelsEnd);
      var views = rangeOfModels.map(function (model, index) {
        var view = _this3.getView(model, modelsStart + Number(index));
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

  }, {
    key: 'renderVisibleItems',
    value: function renderVisibleItems() {
      this.renderItemsRange(this.defineRangeOfModelsVisibles());
    }

    /**
     * Render the given array of views into this list
     * @method
     * @param {any[]} views
    **/

  }, {
    key: 'renderViews',
    value: function renderViews(views) {
      var currentViews = this.$listContainer.children().toArray().map(function (node) {
        return node.__view__;
      });
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
      }
      return view;
    }
  }, {
    key: 'createView',
    value: function createView(model, indexInModelList) {
      var view = new this.ItemConstructor();
      view.model = model;
      view.indexInModelList = indexInModelList;
      view.render();
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
      view[this.ItemConstructor.DESTROY_METHOD]();
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
        $($container.children().get(index)).after(view.el);
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

  }, {
    key: '_onResize',
    value: function _onResize(event) {
      if (this.listHeightAutoMode) this.listHeight = this.queryListHeight();
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(event) {
      this.scrollPositionY = this.$scrollerContainer.scrollTop();
      this.renderVisibleItems();
    }

    /* Debug */

  }, {
    key: 'renderDebugInfos',
    value: function renderDebugInfos() {
      var _defineRangeOfModelsV = this.defineRangeOfModelsVisibles();

      var _defineRangeOfModelsV2 = _slicedToArray(_defineRangeOfModelsV, 2);

      var startIndex = _defineRangeOfModelsV2[0];
      var endIndex = _defineRangeOfModelsV2[1];

      $('#debug-container').html('\n<div>Visible range: (' + startIndex + ', ' + endIndex + ')</div>\n<div>Visible models: (' + Math.max(0, startIndex - this.visibleOutboundItemsCount) + ', ' + Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount) + ')');
    }
  }]);

  return BufferedListView;
}(View);