'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function set_constant(instance, key, value) {
  Object.defineProperty(instance, key, {
    writable: false, configurable: false,
    value: value
  });
}

var Pool = function () {
  function Pool(ObjectConstructor) {
    var size = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$clearMethodName = _ref.clearMethodName;
    var clearMethodName = _ref$clearMethodName === undefined ? null : _ref$clearMethodName;
    var _ref$destroyMethodNam = _ref.destroyMethodName;
    var destroyMethodName = _ref$destroyMethodNam === undefined ? null : _ref$destroyMethodNam;
    var _ref$isFactory = _ref.isFactory;
    var isFactory = _ref$isFactory === undefined ? false : _ref$isFactory;

    _classCallCheck(this, Pool);

    this.size = size;
    set_constant(this, 'ObjectConstructor', ObjectConstructor);
    set_constant(this, 'objectClearMethodName', clearMethodName);
    set_constant(this, 'objectDestroyMethodName', destroyMethodName);
    set_constant(this, 'objectConstructorIsFactory', isFactory);
    set_constant(this, 'borrowedObjects', []);
    set_constant(this, 'availableObjects', []);
  }

  _createClass(Pool, [{
    key: 'destroy',
    value: function destroy() {
      this._destroyChildren(this.borrowedObjects);
      this._destroyChildren(this.availableObjects);
    }
  }, {
    key: '_destroyChildren',
    value: function _destroyChildren(arrayOfObjects) {
      var methodName = this.objectDestroyMethodName || this.clearMethodName;
      if (!methodName) {
        // just empty it
        arrayOfObjects.splice(0, arrayOfObjects.length);
        return;
      }
      var object = void 0;
      while (object = arrayOfObjects.pop()) {
        try {
          object[methodName].call(object);
        } catch (err) {
          if (typeof console === 'undefined') throw err;
          console.log('Error during destroy');
        }
      }
    }
  }, {
    key: 'borrows',
    value: function borrows() {
      var object = null;
      if (this.hasAvailables()) {
        if (this.availableObjects.length === 0) {
          object = this.objectConstructorIsFactory ? this.ObjectConstructor() : new this.ObjectConstructor();
        } else {
          object = this.availableObjects.pop();
        }
        this.borrowedObjects.push(object);
      }
      return object;
    }
  }, {
    key: 'returns',
    value: function returns(borrowedObject) {
      if (!(borrowedObject instanceof this.ObjectConstructor)) {
        throw new Error('Can\'t return object which is not a ' + this.ObjectConstructor.name);
      }
      var index = this.borrowedObjects.indexOf(borrowedObject);
      if (index === -1) {
        if (this.availableObjects.includes(borrowedObject)) {
          throw new Error(this.ObjectConstructor.name + ' already returned !');
        }
        throw new Error('Object given in Pool#returns() is not referenced in this Pool instance.');
      }
      this.borrowedObjects.splice(index, 1);
      if (this.objectClearMethodName !== null) {
        try {
          borrowedObject[this.objectClearMethodName].call(borrowedObject);
        } catch (err) {
          if (typeof console === 'undefined') throw err;
          console.log('Unable to call method ' + this.objectClearMethodName + ' on object instance ' + String(borrowedObject));
        }
      }
      this.availableObjects.push(borrowedObject);
    }
  }, {
    key: 'hasAvailables',
    value: function hasAvailables() {
      return this.size === -1 || this.borrowedObjects.length < this.size;
    }
  }, {
    key: 'getCountAvailables',
    value: function getCountAvailables() {
      return this.availableObjects.length;
    }
  }, {
    key: 'getCountBorrowed',
    value: function getCountBorrowed() {
      return this.borrowedObjects.length;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'Pool<' + this.ObjectConstructor.name + '>(borrowed: ' + this.getCountBorrowed() + ', available: ' + this.getCountAvailables() + ')';
    }
  }]);

  return Pool;
}();

var BufferedListItemView = function () {
  function BufferedListItemView() {
    _classCallCheck(this, BufferedListItemView);

    this.$el = $(this.el = document.createElement('li'));
    this.$el.addClass('item-view');
    this.$ = this.$el.find.bind(this.$el);
    this.el.__view__ = this;
  }

  _createClass(BufferedListItemView, [{
    key: 'destroy',
    value: function destroy() {
      if (this.el) delete this.el.__view__;
      delete this.$;
      delete this.$el;
      delete this.el;
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
      this.$el.remove();
    }
  }, {
    key: 'template',
    value: function template() {
      return String(this.indexInModelList);
    }
  }, {
    key: 'render',
    value: function render() {
      this.$el.html(this.template());
    }
  }]);

  return BufferedListItemView;
}();

BufferedListItemView.CLEAR_METHOD = 'clear';
BufferedListItemView.DESTROY_METHOD = 'destroy';

var BufferedListView = function (_Backbone$View) {
  _inherits(BufferedListView, _Backbone$View);

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

  function BufferedListView() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BufferedListView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this, options));

    _this.el.__view__ = _this;

    _this.listContainerSelector = options.listContainerSelector || '.list-container:first > .list-display';
    _this.scrollerContainerSelector = options.scrollerContainerSelector || '.list-container:first';
    _this.scrollPositionY = 0;
    _this.listHeight = options.listHeight || 'auto';
    _this.listHeightAutoMode = _this.listHeight === 'auto';
    _this.listItemHeight = options.listItemHeight;
    _this.idModelPropertyName = options.idModelPropertyName || 'id';

    _this.visibleOutboundItemsCount = typeof options.visibleOutboundItemsCount !== 'number' ? 2 : options.visibleOutboundItemsCount;

    _this.models = options.models || [];
    var ItemConstructor = options.ItemContructor || _this.getItemConstructor();
    _this.viewsPool = new Pool(ItemConstructor, options.maxPoolSize || -1, {
      clearMethodName: ItemConstructor.CLEAR_METHOD,
      destroyMethodName: ItemConstructor.DESTROY_METHOD
    });
    _this.viewsMap = new Map();

    _this._onWindowResize = _this.onResize.bind(_this);
    $(window).on('resize', _this._onWindowResize);

    if (_this.listHeightAutoMode) {
      _this.once('attach', function () {
        this.listHeight = this.queryListHeight();
        this.updateListScrollerHeight();
        this.renderVisibleItems();
      });
    }
    return _this;
  }

  _createClass(BufferedListView, [{
    key: 'destroy',
    value: function destroy() {
      $(window).off('resize', this._onWindowResize);
      this._onWindowResize = null;
      if (this.$el) this.$el.contents().remove();
      if (this.el) this.el.__view__ = null;
      this.models = null;
      this.viewsPool.destroy();
      this.el = this.$el = null;
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
     * Returns the content of a empty BufferedListView
     * @returns {String}
    **/

  }, {
    key: 'template',
    value: function template() {
      return '<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>';
    }

    /**
     * Put the value returned by template method listen all events necessary
    **/

  }, {
    key: 'render',
    value: function render() {
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
      this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight);
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
    value: function renderItemsRange(_ref2) {
      var _this2 = this;

      var _ref3 = _slicedToArray(_ref2, 2);

      var start = _ref3[0];
      var end = _ref3[1];

      this.__actualIndex__ = start;
      var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
      var modelsEnd = Math.min(this.models.length - 1, end + this.visibleOutboundItemsCount);
      var rangeOfModels = this.models.slice(modelsStart, modelsEnd);
      //if (this.scrollPositionY > 1000) debugger;
      var views = rangeOfModels.map(function (model, index) {
        var view = _this2.getView(model, modelsStart + Number(index));
        view.el.setAttribute('data-index', view.indexInModelList);
        return view;
      });
      this.renderViews(views);
      if (BufferedListView.DEV_MODE) this.renderDebugInfos();
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
        var viewsToRemove = _.reject(currentViews, function (view) {
          return views.includes(view);
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
      if (!view) {
        view = this.viewsPool.borrows();
        if (!view) throw new Error('No views availables. Actually borrowed: ' + this.viewsPool.getCountBorrowed());
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
      this.viewsPool.returns(view);
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

      $('#debug-container').html('\n<div>Actual pool usage: ' + this.viewsPool.getCountBorrowed() + ' / ' + this.viewsPool.getCountAvailables() + '</div>\n<div>Visible range: (' + startIndex + ', ' + endIndex + ')</div>\n<div>Visible models: (' + Math.max(0, startIndex - this.visibleOutboundItemsCount) + ', ' + Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount) + ')\n<div>Current start index: ' + this.__actualIndex__ + '</div>');
    }
  }]);

  return BufferedListView;
}(Backbone.View);