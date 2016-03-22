'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
    key: 'destroy',
    value: function destroy() {
      this.borrowedObjects = null;
      this.availableObjects = [];
      this.ObjectContructor = null;
    }
  }, {
    key: 'borrows',
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
    key: 'returns',
    value: function returns(borrowedObject) {
      if (!(borrowedObject instanceof this.ObjectContructor)) {
        throw new Error('Can\'t return object which is not a ' + this.ObjectConstructor.name);
      }
      var index = this.borrowedObjects.indexOf(borrowedObject);
      if (index === -1) {
        if (this.availableObjects.includes(borrowedObject)) {
          throw new Error(this.ObjectContructor.name + ' already returned !');
        } else {
          throw new Error('Object given in Pool#returns() is not referenced in this Pool instance.');
        }
      }
      this.borrowedObjects.splice(index, 1);
      try {
        borrowedObject.dispose();
      } catch (err) {} finally {
        console.log('finally');
        this.availableObjects.push(borrowedObject);
      }
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
  }]);

  return Pool;
}();

var BufferedListView = function (_Backbone$View) {
  _inherits(BufferedListView, _Backbone$View);

  function BufferedListView() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BufferedListView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this, options));

    _this.scrollerContainerSelector = '#list-container';
    _this.listContainerSelector = '#list-container > .list-display:first';
    _this.scrollPositionY = 0;
    _this.listHeight = 'auto';
    _this.listItemHeight = 30;

    _this.visibleOutboundItemsCount = 2;

    _this.scrollEventCallFrames = 4;

    _this.template = function () {
      return '<div id="list-container"><div class="list-content"></div><ul class="list-display"></ul></div>';
    };

    _this.models = options.models || [];
    _this.viewsPool = new Pool(ItemView, 100);
    _this.viewsMap = new Map();
    if (_this.listHeight === 'auto') {
      _this.waitToBeAttached = true;
      _this.once('attach', function () {
        this.listHeight = this.$listContainer.outerHeight();
        this.renderVisibleItems();
      });
    }
    return _this;
  }

  _createClass(BufferedListView, [{
    key: 'destroy',
    value: function destroy() {
      this.$el.contents().remove();
      this.models = null;
      this.viewsPool.destroy();
      this.el = this.$el = null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      this.$el.html(this.template());
      this.$listContainer = this.$(this.listContainerSelector);
      this.$scrollerContainer = this.$(this.scrollerContainerSelector);

      var eventCalls = 0;
      this.$scrollerContainer.on('scroll', function () {
        _this2.scrollPositionY = _this2.$scrollerContainer.scrollTop();
        _this2.renderVisibleItems();
        // if (++eventCalls % 4 === 0) {
        // }
      });
      if (this.waitToBeAttached && !this.el.parentNode) {} else {
        setTimeout(function () {
          if (_this2.listHeight === 'auto') {
            _this2.listHeight = _this2.queryListHeight();
            _this2.updateListContentHeight();
          }
          _this2.renderVisibleItems();
        }, 1000);
      }
    }
  }, {
    key: 'queryListHeight',
    value: function queryListHeight() {
      return this.$el.outerHeight();
    }
  }, {
    key: 'updateListContentHeight',
    value: function updateListContentHeight() {
      this.$scrollerContainer.find('.list-content').height(this.models.length * this.listItemHeight);
    }
  }, {
    key: 'defineRangeOfModelsVisibles',
    value: function defineRangeOfModelsVisibles() {
      var listContentHeight = this.models.length * this.listItemHeight;
      //const listPositionIndex = Math.floor(this.scrollPositionY / this.listItemHeight);
      var modelsIndex = Math.floor(this.scrollPositionY / this.listItemHeight);
      console.log('actual index', modelsIndex);
      var modelsCount = Math.floor(this.listHeight / this.listItemHeight) + this.visibleOutboundItemsCount * 2;
      modelsIndex = Math.max(0, modelsIndex - this.visibleOutboundItemsCount);
      var modelsLength = Math.min(this.models.length - 1, modelsIndex + modelsCount + this.visibleOutboundItemsCount);
      if (this.scrollPositionY > 100) {
        //debugger;
      }
      return [modelsIndex, modelsLength];
    }
  }, {
    key: 'renderVisibleItems',
    value: function renderVisibleItems() {
      var _this3 = this;

      var rangeOfModelsVisibles = this.defineRangeOfModelsVisibles();
      console.log('scrollPositionY', this.scrollPositionY);
      //this.$listContainer.css('transform', `translateY(-${this.scrollPositionY}px)`);
      console.log('range', rangeOfModelsVisibles);
      var visibleModels = this.models.slice(rangeOfModelsVisibles[0], rangeOfModelsVisibles[1]);
      var views = visibleModels.map(function (model) {
        return _this3.getView(model);
      });
      this.renderViews(views);
    }
  }, {
    key: 'getView',
    value: function getView(model) {
      var view = this.viewsMap.get(model.id);
      if (!view) {
        view = this.viewsPool.borrows();
        if (!view) debugger;
        view.model = model;
        this.viewsMap.set(model.id, view);
        view.render();
      }
      return view;
    }
  }, {
    key: 'removeViews',
    value: function removeViews(views) {
      //console.log('remove %s views', views.length);
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
      console.log('add %s views', views.length);
      for (var index = 0; index < views.length; index++) {
        this.addView(views[index], index);
      }
    }
  }, {
    key: 'addView',
    value: function addView(view, index) {
      var $container = this.$listContainer;
      var $children = $container.children();
      // console.log('  addViewAt(%s/%s)', index, $children.length);
      // if ($children.get(index) === view.el) {
      //   console.log('    pass over');
      // }
      if ($children.length <= index) {
        $container.append(view.el);
      } else if (index === 0) {
        $container.prepend(view.el);
      } else {
        $($container.get(index)).before(view.el);
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
        //console.log('viewsToRemove', viewsToRemove);
        this.removeViews(viewsToRemove);
        this.addViews(viewsToAdd);
      }
    }
  }]);

  return BufferedListView;
}(Backbone.View);

var ItemView = function (_Marionette$ItemView) {
  _inherits(ItemView, _Marionette$ItemView);

  function ItemView() {
    _classCallCheck(this, ItemView);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(ItemView).call(this, { tagName: 'li', className: 'item-view' }));

    _this4.el.__view__ = _this4;
    return _this4;
  }

  _createClass(ItemView, [{
    key: 'serializeModel',
    value: function serializeModel() {
      return this.model;
    }
  }, {
    key: 'template',
    value: function template(model) {
      return model.content;
    }
  }]);

  return ItemView;
}(Marionette.ItemView);

function createString() {
  var count = 30;
  return Array(count + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, count);
}
var view = new BufferedListView();
view.models = new Array(3200);
for (var index = 0; index < view.models.length; index++) {
  view.models[index] = { id: _.uniqueId(), content: String(index) };
}
$('#c1').append(view.el);

view.render();