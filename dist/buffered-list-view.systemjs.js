'use strict';

System.register('Pool', [], function (_export, _context) {
  "use strict";

  var _createClass, Pool;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function set_constant(instance, key, value) {
    Object.defineProperty(instance, key, {
      writable: false, configurable: false,
      value: value
    });
  }

  return {
    setters: [],
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

      Pool = function () {
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
          set_constant(this, 'awaitCallbacks', []);
        }

        _createClass(Pool, [{
          key: 'destroy',
          value: function destroy() {
            this._destroyChildren(this.borrowedObjects);
            this._destroyChildren(this.availableObjects);
            if (this.awaitCallbacks.length) {
              this.awaitCallbacks.splice(0, this.awaitCallbacks.length);
            }
          }
        }, {
          key: '_destroyChildren',
          value: function _destroyChildren(arrayOfObjects) {
            var methodName = this.objectDestroyMethodName || this.objectClearMethodName;
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
          key: 'await',
          value: function await() {
            var _this = this;

            if (this.hasAvailables()) return Promise.resolve(this.borrows());
            return new Promise(function (resolve, reject) {
              _this.awaitCallbacks.push(resolve);
            });
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
            if (this._onObjectBorrowed) this._onObjectBorrowed();
            return object;
          }
        }, {
          key: 'returns',
          value: function returns(borrowedObject) {
            if (!this.objectConstructorIsFactory && !(borrowedObject instanceof this.ObjectConstructor)) {
              throw new Error('Can\'t return object which is not a ' + this.ObjectConstructor.name);
            }
            var index = this.borrowedObjects.indexOf(borrowedObject);
            if (index === -1) {
              if (this.availableObjects.indexOf(borrowedObject) > -1) {
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
            if (this._onObjectReturned) this._onObjectReturned();
          }
        }, {
          key: 'hasAvailables',
          value: function hasAvailables() {
            return this.size === -1 || this.borrowedObjects.length < this.size;
          }
        }, {
          key: 'getCountAvailables',
          value: function getCountAvailables() {
            return (this.size === -1 ? Number.MAX_SAFE_INTEGER : this.size) - this.getCountBorrowed();
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
        }, {
          key: '_onObjectReturned',
          value: function _onObjectReturned() {
            console.log('_onObjectReturned');
            if (this.awaitCallbacks.length && this.hasAvailables()) {
              var resolver = this.awaitCallbacks.shift();
              resolver(this.borrows());
            }
          }
        }]);

        return Pool;
      }();

      _export('default', Pool);
    }
  };
});
'use strict';

System.register('BufferedListItemView', ['View'], function (_export, _context) {
  var View, BufferedListItemView;

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
      BufferedListItemView = function (_View) {
        _inherits(BufferedListItemView, _View);

        function BufferedListItemView() {
          _classCallCheck(this, BufferedListItemView);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListItemView).call(this));

          _this.$el.addClass('item-view');
          return _this;
        }

        return BufferedListItemView;
      }(View);

      _export('default', BufferedListItemView);

      BufferedListItemView.tagName = 'li';
      BufferedListItemView.CLEAR_METHOD = 'clear';
      BufferedListItemView.DESTROY_METHOD = 'destroy';
    }
  };
});
'use strict';

System.register('BufferedListView', ['jquery', 'bullet', 'Pool', 'View', 'BufferedListItemView', 'arrays'], function (_export, _context) {
  var $, Bullet, Pool, View, BufferedListItemView, createConstantArray, _slicedToArray, _createClass, BufferedListView;

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
    }, function (_bullet) {
      Bullet = _bullet.default;
    }, function (_Pool) {
      Pool = _Pool.default;
    }, function (_View2) {
      View = _View2.default;
    }, function (_BufferedListItemView) {
      BufferedListItemView = _BufferedListItemView.default;
    }, function (_arrays) {
      createConstantArray = _arrays.createConstantArray;
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

      BufferedListView = function (_View) {
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
         * @param {Number} options.maxPoolSize                - The max views at the same time. The pool is working in lazy loading. If you put 100 and only 36 items are shown, only 36 item views are created
         * @param {String} options.idModelPropertyName        - The propetyName which identify each objects
         * @param {Function} options.ItemConstructor          - The constructor for each child views (default: call getItemConstructor())
        **/

        function BufferedListView() {
          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          _classCallCheck(this, BufferedListView);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this, options));

          $.extend(_this, Bullet);
          Object.defineProperty(_this, '_currentVisibleRange', {
            configurable: true, writable: false,
            value: createConstantArray(0, 0)
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
          var ItemConstructor = options.ItemConstructor || _this.getItemConstructor();
          _this.viewsPool = new Pool(ItemConstructor, options.maxPoolSize || -1, {
            clearMethodName: ItemConstructor.CLEAR_METHOD,
            destroyMethodName: ItemConstructor.DESTROY_METHOD
          });
          _this.viewsMap = new Map();

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
            $(window).off('resize', this._onWindowResize);
            this.viewsPool.destroy();
            if (this.el) delete this.el.__view__;
            if (this.$el) this.remove();
            delete this._onWindowResize;
            delete this.models;
            delete this.el;
            delete this.$el;
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
            var modelsEnd = Math.min(this.models.length - 1, end + this.visibleOutboundItemsCount);
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
              view = this.viewsPool.borrows();
              if (!view) throw new Error('No views availables. Actually borrowed: ' + this.viewsPool.getCountBorrowed());
              view.model = model;
              view.indexInModelList = indexInModelList;
              view.render();
              this.viewsMap.set(model[this.idModelPropertyName], view);
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
            this.viewsMap.delete(view.model[this.idModelPropertyName]);
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

            $('#debug-container').html('\n<div>Actual pool usage: ' + this.viewsPool.getCountBorrowed() + ' / ' + this.viewsPool.getCountAvailables() + '</div>\n<div>Visible range: (' + startIndex + ', ' + endIndex + ')</div>\n<div>Visible models: (' + Math.max(0, startIndex - this.visibleOutboundItemsCount) + ', ' + Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount) + ')');
          }
        }]);

        return BufferedListView;
      }(View);

      _export('default', BufferedListView);
    }
  };
});
'use strict';

System.register('View', ['jquery'], function (_export, _context) {
  var jQuery, _createClass, View;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_jquery) {
      jQuery = _jquery.default;
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

      View = function () {
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

      _export('default', View);
    }
  };
});
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

System.register('buffered-list-view.jquery', ['jquery', 'BufferedListView', 'BufferedListItemView'], function (_export, _context) {
  var $, BufferedListView, BufferedListItemView, _createClass, AUTHORIZED_LISTVIEW_OPTIONS_KEYS, jQueryBufferedListViewContainer;

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_jquery) {
      $ = _jquery.default;
    }, function (_BufferedListView) {
      BufferedListView = _BufferedListView.default;
    }, function (_BufferedListItemView2) {
      BufferedListItemView = _BufferedListItemView2.default;
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

      AUTHORIZED_LISTVIEW_OPTIONS_KEYS = ["listContainerSelector", "scrollerContainerSelector", "listHeight", "listItemHeight", "visibleOutboundItemsCount", "models", "maxPoolSize", "idModelPropertyName", "ItemConstructor"];

      jQueryBufferedListViewContainer = function () {
        function jQueryBufferedListViewContainer($element) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          _classCallCheck(this, jQueryBufferedListViewContainer);

          this.$container = $element;
          this.options = options;
          this.createListView();
          this.render();
        }

        _createClass(jQueryBufferedListViewContainer, [{
          key: 'getAttribute',
          value: function getAttribute(key) {
            return this.options[key];
          }
        }, {
          key: 'setAttribute',
          value: function setAttribute(key, value) {
            var oldValue = this.options[key];
            this.options[key] = value;
            if (typeof this['_' + key + 'Changed'] === 'function') {
              this['_' + key + 'Changed'].call(this, oldValue, value);
            }
          }
        }, {
          key: 'createListView',
          value: function createListView() {
            options.ItemConstructor = this.generateItemView(this.getAttribute('template'));
            this.listview = new BufferedListView(options);
          }
        }, {
          key: 'recreateListView',
          value: function recreateListView() {
            if (this.listview) this.listview.destroy();
            this.createListView();
            this.render();
          }
        }, {
          key: 'render',
          value: function render() {
            if (this.listview.$el.parent().get(0) !== this.$container.get(0)) {
              this.$container.append(this.listview.$el);
            }
            this.listview.render();
          }
        }, {
          key: 'generateItemView',
          value: function generateItemView(template) {
            var $$ItemView = function (_BufferedListItemView) {
              _inherits($$ItemView, _BufferedListItemView);

              function $$ItemView() {
                _classCallCheck(this, $$ItemView);

                return _possibleConstructorReturn(this, Object.getPrototypeOf($$ItemView).apply(this, arguments));
              }

              _createClass($$ItemView, [{
                key: 'clear',
                value: function clear() {
                  this.model = null;
                }
              }]);

              return $$ItemView;
            }(BufferedListItemView);

            $$ItemView.CLEAR_METHOD = 'clear';
            $$ItemView.DESTROY_METHOD = 'clear';
            $$ItemView.prototype.template = template;
            return $$ItemView;
          }
        }, {
          key: '_htmlChanged',
          value: function _htmlChanged(oldValue, newValue) {
            if (oldValue !== newValue) {
              this.recreateListView();
            }
          }
        }, {
          key: '_dataChanged',
          value: function _dataChanged(oldValue, newValue) {
            this.listview.setModels(newValue);
          }
        }]);

        return jQueryBufferedListViewContainer;
      }();

      /*
      * $('#list-view-container').bufferedListView({
      *   data: []
      * });
      * set $('#list-view-container').bufferedListView('data', []);
      * get $('#list-view-container').bufferedListView('data');
      */
      $.fn.bufferedListView = function bufferedListView(key, value) {
        if (typeof key === 'string') {
          if (!this.prop('buffered-list-view')) return this;
          if (value !== undefined) {
            this.prop('buffered-list-view').setAttribute(key, value);
            return this;
          }
          return this.prop('buffered-list-view').getAttribute(key);
        }
        var options = key;
        this.prop('buffered-list-view', new jQueryBufferedListViewContainer(this, options));
        return this;
      };
    }
  };
});