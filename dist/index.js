"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pool = function () {
  function Pool(ObjectContructor, size) {
    var initSize = arguments.length <= 2 || arguments[2] === undefined ? size : arguments[2];

    _classCallCheck(this, Pool);

    this.size = size;
    this.ObjectContructor = ObjectContructor;
    this.borrowedObjects = [];
    this.availableObjects = [];
  }

  _createClass(Pool, [{
    key: "destroy",
    value: function destroy() {
      this.borrowedObjects = null;
      this.availableObjects = [];
      this.ObjectContructor = null;
    }
  }, {
    key: "borrows",
    value: function borrows() {
      var object = null;
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
  }, {
    key: "returns",
    value: function returns(borrowedObject) {
      if (!(borrowedObject instanceof this.ObjectContructor)) {
        throw new Error("Can't return object which is not a " + this.ObjectConstructor.name);
      }
      var index = this.borrowedObjects.indexOf(borrowedObject);
      if (index === -1) {
        if (this.availableObjects.includes(borrowedObject)) {
          throw new Error(this.ObjectContructor.name + " already returned !");
        } else {
          throw new Error("Object given in Pool#returns() is not referenced in this Pool instance.");
        }
      }
      this.borrowedObjects.splice(index, 1);
      try {
        borrowedObject.dispose();
      } catch (err) {} finally {
        //console.log('finally');
        this.availableObjects.push(borrowedObject);
      }
    }
  }, {
    key: "hasAvailables",
    value: function hasAvailables() {
      return this.size === -1 || this.borrowedObjects.length < this.size;
    }
  }, {
    key: "getCountAvailables",
    value: function getCountAvailables() {
      return this.availableObjects.length;
    }
  }, {
    key: "getCountBorrowed",
    value: function getCountBorrowed() {
      return this.borrowedObjects.length;
    }
  }]);

  return Pool;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BufferedListItemView = function () {
  function BufferedListItemView() {
    _classCallCheck(this, BufferedListItemView);

    this.$el = $(this.el = document.createElement('li'));
    this.$el.addClass('item-view');
    this.$ = this.$el.find.bind(this.$el);
    this.el.__view__ = this;
  }

  _createClass(BufferedListItemView, [{
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
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

    _this.visibleOutboundItemsCount = typeof options.visibleOutboundItemsCount !== 'number' ? 2 : options.visibleOutboundItemsCount;

    _this.models = options.models || [];
    _this.viewsPool = new Pool(options.ItemContructor || _this.getItemConstructor(), options.maxPoolSize || -1);
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
  }, {
    key: 'getItemConstructor',
    value: function getItemConstructor() {
      return BufferedListItemView;
    }
  }, {
    key: 'template',
    value: function template() {
      return '<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>';
    }
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
  }, {
    key: 'queryListHeight',
    value: function queryListHeight() {
      return this.$el.outerHeight();
    }
  }, {
    key: 'updateListScrollerHeight',
    value: function updateListScrollerHeight() {
      this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight);
    }
  }, {
    key: 'defineRangeOfModelsVisibles',
    value: function defineRangeOfModelsVisibles() {
      var modelsIndex = Math.floor(this.scrollPositionY / this.listItemHeight);
      var modelsCount = Math.ceil(this.listHeight / this.listItemHeight);
      var modelsLength = Math.min(this.models.length - 1, modelsIndex + modelsCount);
      return [modelsIndex, modelsLength];
    }
  }, {
    key: 'renderItemsRange',
    value: function renderItemsRange(_ref) {
      var _this2 = this;

      var _ref2 = _slicedToArray(_ref, 2);

      var start = _ref2[0];
      var end = _ref2[1];

      this.__actualIndex__ = start;
      var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
      var modelsEnd = Math.min(this.models.length, end + this.visibleOutboundItemsCount);
      var rangeOfModels = this.models.slice(start, end);
      var views = rangeOfModels.map(function (model, index) {
        var view = _this2.getView(model, start + Number(index));
        view.el.setAttribute('data-index', view.indexInModelList);
        return view;
      });
      this.renderViews(views);
      if (BufferedListView.DEV_MODE) this.renderDebugInfos();
    }
  }, {
    key: 'renderVisibleItems',
    value: function renderVisibleItems() {
      this.renderItemsRange(this.defineRangeOfModelsVisibles());
    }
  }, {
    key: 'renderDebugInfos',
    value: function renderDebugInfos() {
      $('#debug-container').html('<div>Actual pool usage: ' + this.viewsPool.getCountBorrowed() + ' / ' + this.viewsPool.getCountAvailables() + '</div><div>Current start index: ' + this.__actualIndex__ + '</div>');
    }
  }, {
    key: 'getView',
    value: function getView(model, indexInModelList) {
      var view = this.viewsMap.get(model.id);
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
  }, {
    key: 'removeViews',
    value: function removeViews(views) {
      for (var index = 0; index < views.length; index++) {
        this.removeView(views[index]);
      }
    }
  }, {
    key: 'removeView',
    value: function removeView(view) {
      this.viewsMap.delete(view.model.id);
      view.model = null;
      view.remove();
      this.viewsPool.returns(view);
    }
  }, {
    key: 'addViews',
    value: function addViews(views) {
      for (var index = 0; index < views.length; index++) {
        this.addView(views[index], index);
      }
    }
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
  }]);

  return BufferedListView;
}(Backbone.View);