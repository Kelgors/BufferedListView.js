"use strict";

System.register("arrays", [], function (_export, _context) {
  return {
    setters: [],
    execute: function () {
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
      }
      _export("createConstantArray", createConstantArray);

      ;
    }
  };
});
'use strict';

System.register('View', ['jquery', 'SafeObject'], function (_export, _context) {
  var jQuery, SafeObject, _get, _createClass, View;

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

  return {
    setters: [function (_jquery) {
      jQuery = _jquery.default;
    }, function (_SafeObject2) {
      SafeObject = _SafeObject2.default;
    }],
    execute: function () {
      _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);

          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;

          if (getter === undefined) {
            return undefined;
          }

          return getter.call(receiver);
        }
      };

      _createClass = function () {
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

      View = function (_SafeObject) {
        _inherits(View, _SafeObject);

        _createClass(View, [{
          key: 'isAttached',
          get: function get() {
            return !!this.el && !!this.el.parentNode;
          }
        }]);

        function View() {
          _classCallCheck(this, View);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(View).call(this));

          _this.$el = jQuery(_this.el = document.createElement(_this.constructor.tagName || 'div'));
          _this.$el.addClass('view');
          _this.el.__view__ = _this;
          return _this;
        }

        _createClass(View, [{
          key: 'destroy',
          value: function destroy() {
            if (this.el) {
              this.el.__view__ = null;
              this.remove();
            }
            _get(Object.getPrototypeOf(View.prototype), 'destroy', this).call(this);
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
      }(SafeObject);

      _export('default', View);

      View.INSTANCE_PROPERTIES = {
        el: null,
        $el: null,
        model: null
      };
    }
  };
});
'use strict';

System.register('BufferedListItemView', ['View'], function (_export, _context) {
  var View, _createClass, BufferedListItemView;

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

  return {
    setters: [function (_View2) {
      View = _View2.default;
    }],
    execute: function () {
      _createClass = function () {
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

      BufferedListItemView = function (_View) {
        _inherits(BufferedListItemView, _View);

        function BufferedListItemView() {
          _classCallCheck(this, BufferedListItemView);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListItemView).call(this));

          _this.$el.addClass('item-view');
          return _this;
        }

        _createClass(BufferedListItemView, [{
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
          }
        }, {
          key: 'onUpdate',
          value: function onUpdate(event) {
            this.indexInModelList = event.indexInModelList;
          }
        }]);

        return BufferedListItemView;
      }(View);

      _export('default', BufferedListItemView);

      BufferedListItemView.tagName = 'li';
      BufferedListItemView.DESTROY_METHOD = 'destroy';
      BufferedListItemView.INSTANCE_PROPERTIES = {
        indexInModelList: null,
        model: null,
        parentListView: null
      };
    }
  };
});
'use strict';

System.register('BufferedListView', ['jquery', 'View', 'BufferedListItemView', 'arrays', 'KLogger'], function (_export, _context) {
  var $, View, BufferedListItemView, createConstantArray, KLogger, _slicedToArray, _get, _createClass, logger, EventManager, BufferedListView;

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

  return {
    setters: [function (_jquery) {
      $ = _jquery.default;
    }, function (_View2) {
      View = _View2.default;
    }, function (_BufferedListItemView) {
      BufferedListItemView = _BufferedListItemView.default;
    }, function (_arrays) {
      createConstantArray = _arrays.createConstantArray;
    }, function (_KLogger) {
      KLogger = _KLogger.default;
    }],
    execute: function () {
      _slicedToArray = function () {
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

      _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);

          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;

          if (getter === undefined) {
            return undefined;
          }

          return getter.call(receiver);
        }
      };

      _createClass = function () {
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

      logger = new KLogger(KLogger.WARN);
      EventManager = void 0;

      BufferedListView = function (_View) {
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
            if (levelName in KLogger) logger.loglevel = KLogger[levelName];
          }
        }]);

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

          if (EventManager) $.extend(_this, EventManager);else throw 'UndefinedEventManagerError: Please set by calling BufferedListView.setEventManager(eventManager : Object)';
          Object.defineProperty(_this, '_currentVisibleRange', {
            configurable: true, writable: false,
            value: createConstantArray(0, 0)
          });

          _this.listContainerSelector = listContainerSelector || '.list-container:first > .list-display';
          _this.scrollerContainerSelector = scrollerContainerSelector || '.list-container:first';
          _this.listHeight = listHeight || 'auto';
          _this.listHeightAutoMode = _this.listHeight === 'auto';
          _this.listItemHeight = listItemHeight;
          _this.idModelPropertyName = idModelPropertyName || 'id';

          _this.visibleOutboundItemsCount = typeof visibleOutboundItemsCount !== 'number' ? 2 : visibleOutboundItemsCount;

          _this.models = models || [];
          _this.ItemConstructor = ItemConstructor || null;

          _this._onWindowResize = _this.onResize.bind(_this);
          $(window).on('resize', _this._onWindowResize);

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
            $(window).off('resize', this._onWindowResize);
            if (this.el) this.el.__view__ = null;
            _get(Object.getPrototypeOf(BufferedListView.prototype), 'destroy', this).call(this);
          }
        }, {
          key: 'setModels',
          value: function setModels() {
            var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            this.models = models;
            Object.defineProperty(this, '_currentVisibleRange', {
              configurable: true, writable: false,
              value: createConstantArray(-1, -1)
            });
            this.updateListScrollerHeight();
            this.renderVisibleItems();
          }
        }, {
          key: 'getItemConstructor',
          value: function getItemConstructor() {
            return this.ItemConstructor || BufferedListItemView;
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
            this.renderBaseView();
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
          key: 'renderBaseView',
          value: function renderBaseView() {
            this.$el.html(this.template());
          }
        }, {
          key: 'attachTo',
          value: function attachTo(element) {
            $(element).append(this.$el);
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
          value: function renderItemsRange(_ref2) {
            var _this2 = this;

            var _ref3 = _slicedToArray(_ref2, 2);

            var start = _ref3[0];
            var end = _ref3[1];

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
              value: createConstantArray(start, end)
            });
            if (BufferedListView.debugMode) this.renderDebugInfos();
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
            view[this.getItemConstructor().DESTROY_METHOD]();
            view.parentListView = null;
            view.model = null;
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
            $('#debug-container').html('<div>' + this.toDebugInfos().replace('\n', '</div><div>') + '</div>');
          }
        }]);

        return BufferedListView;
      }(View);

      _export('default', BufferedListView);

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
    }
  };
});