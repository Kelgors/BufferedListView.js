define("arrays", ["exports"], function (exports) {
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
});
define('View', ['exports', 'jquery'], function (exports, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

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

  exports.default = View;
});
define('BufferedListItemView', ['exports', 'View'], function (exports, _View2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _View3 = _interopRequireDefault(_View2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var BufferedListItemView = function (_View) {
    _inherits(BufferedListItemView, _View);

    function BufferedListItemView() {
      _classCallCheck(this, BufferedListItemView);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListItemView).call(this));

      _this.$el.addClass('item-view');
      return _this;
    }

    return BufferedListItemView;
  }(_View3.default);

  exports.default = BufferedListItemView;

  BufferedListItemView.tagName = 'li';
  BufferedListItemView.DESTROY_METHOD = 'destroy';
});
define('BufferedListView', ['exports', 'jquery', 'bullet', 'View', 'BufferedListItemView', 'arrays'], function (exports, _jquery, _bullet, _View2, _BufferedListItemView, _arrays) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _bullet2 = _interopRequireDefault(_bullet);

  var _View3 = _interopRequireDefault(_View2);

  var _BufferedListItemView2 = _interopRequireDefault(_BufferedListItemView);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var BufferedListView = function (_View) {
    _inherits(BufferedListView, _View);

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

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this, options));

      _jquery2.default.extend(_this, _bullet2.default);
      Object.defineProperty(_this, '_currentVisibleRange', {
        configurable: true, writable: false,
        value: (0, _arrays.createConstantArray)(0, 0)
      });

      _this.isRendered = false;
      _this.listContainerSelector = options.listContainerSelector || '.list-container:first > .list-display';
      _this.scrollerContainerSelector = options.scrollerContainerSelector || '.list-container:first';
      _this.scrollPositionY = 0;
      _this.listHeight = options.listHeight || 'auto';
      _this.listHeightAutoMode = _this.listHeight === 'auto';
      _this.listItemHeight = options.listItemHeight;
      _this.idModelPropertyName = options.idModelPropertyName || 'id';

      _this.visibleOutboundItemsCount = typeof options.visibleOutboundItemsCount !== 'number' ? 2 : options.visibleOutboundItemsCount;

      _this.models = options.models || [];
      _this.ItemConstructor = options.ItemConstructor || _this.getItemConstructor();
      _this.viewsMap = new Map();

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
        (0, _jquery2.default)(window).off('resize', this._onWindowResize);
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
    }, {
      key: 'getItemConstructor',
      value: function getItemConstructor() {
        return _BufferedListItemView2.default;
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
        (0, _jquery2.default)(element).append(this.$el);
        if (this.el.parentNode) this.trigger('attach');
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
        this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight + 'px');
      }
    }, {
      key: 'defineRangeOfModelsVisibles',
      value: function defineRangeOfModelsVisibles() {
        var start = Math.floor(this.scrollPositionY / this.listItemHeight);
        var length = Math.ceil(this.listHeight / this.listItemHeight);
        var end = Math.min(this.models.length - 1, start + length);
        return [start, end];
      }
    }, {
      key: 'renderItemsRange',
      value: function renderItemsRange(_ref) {
        var _this2 = this;

        var _ref2 = _slicedToArray(_ref, 2);

        var start = _ref2[0];
        var end = _ref2[1];

        if (this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
        var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
        var modelsEnd = Math.min(this.models.length, end + this.visibleOutboundItemsCount);
        var rangeOfModels = this.models.slice(modelsStart, modelsEnd);
        var views = rangeOfModels.map(function (model, index) {
          var view = _this2.getView(model, modelsStart + Number(index));
          view.el.setAttribute('data-index', view.indexInModelList);
          return view;
        });
        this.renderViews(views);
        Object.defineProperty(this, '_currentVisibleRange', {
          configurable: true, writable: false,
          value: (0, _arrays.createConstantArray)(start, end)
        });
        if (this.constructor.DEV_MODE) this.renderDebugInfos();
      }
    }, {
      key: 'renderVisibleItems',
      value: function renderVisibleItems() {
        this.renderItemsRange(this.defineRangeOfModelsVisibles());
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
          var viewsToRemove = currentViews.filter(function (view) {
            return !views.includes(view);
          });
          var viewsToAdd = views;
          this.removeViews(viewsToRemove);
          this.addViews(viewsToAdd);
        }
      }
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
        this.viewsMap.delete(view.model[this.idModelPropertyName]);
        view[this.ItemConstructor.DESTROY_METHOD]();
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
          (0, _jquery2.default)($container.children().get(index)).after(view.el);
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
    }, {
      key: 'renderDebugInfos',
      value: function renderDebugInfos() {
        var _defineRangeOfModelsV = this.defineRangeOfModelsVisibles();

        var _defineRangeOfModelsV2 = _slicedToArray(_defineRangeOfModelsV, 2);

        var startIndex = _defineRangeOfModelsV2[0];
        var endIndex = _defineRangeOfModelsV2[1];

        (0, _jquery2.default)('#debug-container').html('\n<div>Visible range: (' + startIndex + ', ' + endIndex + ')</div>\n<div>Visible models: (' + Math.max(0, startIndex - this.visibleOutboundItemsCount) + ', ' + Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount) + ')');
      }
    }]);

    return BufferedListView;
  }(_View3.default);

  exports.default = BufferedListView;
});