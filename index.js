'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferedListView = function (_Backbone$View) {
  _inherits(BufferedListView, _Backbone$View);

  function BufferedListView() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BufferedListView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BufferedListView).call(this, options));

    _this.el.__view__ = _this;
    _this.scrollerContainerSelector = '#list-container';
    _this.listContainerSelector = '#list-container > .list-display:first';
    _this.scrollPositionY = 0;
    _this.listHeight = 'auto';
    _this.listItemHeight = 31;

    _this.visibleOutboundItemsCount = 2;

    _this.scrollEventCallFrames = 4;

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
    key: 'template',
    value: function template() {
      return '<div id="list-container"><div class="list-content"></div><ul class="list-display"></ul></div>';
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
        //console.log(this.scrollPositionY);
        _this2.renderVisibleItems();
        // if (++eventCalls % this.scrollEventCallFrames === 0) {
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
      //console.log('actual index', modelsIndex);
      this.__actualIndex__ = modelsIndex;
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
      console.log('range', rangeOfModelsVisibles);
      var visibleModels = this.models.slice(rangeOfModelsVisibles[0], rangeOfModelsVisibles[1]);
      var views = visibleModels.map(function (model, index) {
        var view = _this3.getView(model, Number(rangeOfModelsVisibles[0]) + Number(index));
        view.el.setAttribute('data-index', view.indexInModelList);
        return view;
      });
      this.renderViews(views);
      this.renderDebugInfos();
    }
  }, {
    key: 'renderDebugInfos',
    value: function renderDebugInfos() {
      $('#debug-container').html('\n  <div>Actual pool usage: ' + this.viewsPool.getCountBorrowed() + ' / ' + this.viewsPool.getCountAvailables() + '</div>\n  <div>Current start index: ' + this.__actualIndex__ + '</div>\n');
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
      //console.log('add %s views', views.length);
      for (var index = 0; index < views.length; index++) {
        this.addView(views[index], index);
      }
    }
  }, {
    key: 'addView',
    value: function addView(view, index) {
      var $container = this.$listContainer;
      var $children = $container.children();
      //const positionTop = this.scrollPositionY + this.listItemHeight * index;
      var positionTop = this.listItemHeight * view.indexInModelList;
      // console.log('  addViewAt(%s/%s)', index, $children.length);
      // if ($children.get(index) === view.el) {
      //   console.log('    pass over');
      // }
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
        //console.log('viewsToRemove', viewsToRemove);
        this.removeViews(viewsToRemove);
        this.addViews(viewsToAdd);
      }
    }
  }]);

  return BufferedListView;
}(Backbone.View);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ItemView = function () {
  function ItemView() {
    _classCallCheck(this, ItemView);

    this.$el = $(this.el = document.createElement('li'));
    this.$el.addClass('item-view');
    this.$ = this.$el.find.bind(this.$el);
    this.el.__view__ = this;
  }

  _createClass(ItemView, [{
    key: 'remove',
    value: function remove() {
      this.$el.remove();
    }
  }, {
    key: 'template',
    value: function template() {
      var index = this.indexInModelList;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46.4 18.8" height="25">\n      <path d="M8.7 14.9l-.5-1.5v-3.2l.9-.9-.9-.8V5.3l.5-1.4.2.1c.5 0 .8.3.9.8V9l-.3.4.3.3v4.2c-.1.5-.4.9-.9 1h-.2zm3.1-6.4h3.6v-3h-3.6L10.5 5l.1-.2c.1-.5.4-.8.9-.9h4.7c.5.1.8.4.9.9V9l-1.3 1.2h-3.6v3H16l.6 1.7h-5.2c-.5-.1-.8-.4-1-.9V9.8m11.2-2.2h-1.2V6.5h1.2v1.1zm0 4.7h-1.2v-1.2h1.2v1.2zm.3.2h-1.7v-1.7h1.7v1.7zm-1.2-.5h.7v-.7h-.7v.7zm1.2-4.1h-1.7V6.2h1.7v1.7zm-1.2-.5h.7v-.7h-.7v.7zM25 4.8c.2-.5.5-.8 1-.9h4.7c.5.1.8.4.9.9V9l-.3.3.3.3v4.2c-.1.5-.4.8-.9 1H26c-.5-.1-.8-.4-1-.9V9.7l.3-.3L25 9V5m1.7 8.2H30v-2.9l.9-.9-.9-.9v-3h-3.3v2.9l-.9.9.9.9v3zm11.1 1.7h-4.5c-.5-.1-.8-.4-1-.9V9.8l.3-.3-.3-.5V4.8c.1-.5.4-.8.9-.9H38c.5.1.8.4.9.9V9l-.3.3.3.3v4.2c-.1.5-.4.8-.9 1h-.2zM34 13.2h3.3v-2.9l.9-.9-.9-.9v-3H34v2.9l-.9.9.9.9v3zm9.9 5.6H2.5C1 18.8 0 18.1 0 17.1V1.7C0 .7 1.1 0 2.5 0h41.3c1.5 0 2.5.7 2.5 1.7v15.4c.1 1-1 1.7-2.4 1.7zM1.8 16.9c.1.1.4.1.7.1h41.3c.4 0 .6-.1.8-.1v-15c-.1-.1-.4-.1-.8-.1H2.5c-.4 0-.6.1-.8.1v15z"></path>\n    </svg>\n    ' + index + '\n    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 23.4 25.4" enable-background="new 0 0 23.4 25.4" xml:space="preserve" height="24">\n      <path d="M14.8,25.4H2.7c-1.5,0-2.7-1.2-2.7-2.7V7.4C0,6,1.2,4.8,2.7,4.8h8.1c0.2,0,0.4,0.1,0.5,0.2l6,6.3c0.1,0.1,0.2,0.3,0.2,0.5v10.9C17.4,24.2,16.2,25.4,14.8,25.4z M2.7,6.3C2,6.3,1.5,6.8,1.5,7.4v15.3c0,0.6,0.5,1.2,1.2,1.2h12.1c0.6,0,1.2-0.5,1.2-1.2V12.2l-5.5-5.9H2.7z"></path>\n      <path d="M20.7,20.6h-1.6c-0.4,0-0.8-0.3-0.8-0.8s0.3-0.8,0.8-0.8h1.6c0.6,0,1.2-0.5,1.2-1.2V7.4l-5.5-5.9H8.6C7.9,1.5,7.4,2,7.4,2.7v0.7c0,0.4-0.3,0.8-0.8,0.8S5.9,3.7,5.9,3.3V2.7C5.9,1.2,7.1,0,8.6,0h8.1c0.2,0,0.4,0.1,0.5,0.2l6,6.3c0.1,0.1,0.2,0.3,0.2,0.5V18C23.4,19.4,22.2,20.6,20.7,20.6z"></path>\n      <path d="M14.3,15.2H3.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h11.1c0.3,0,0.5,0.2,0.5,0.5S14.5,15.2,14.3,15.2z"></path>\n      <path d="M11.4,12.2H3.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h8.2c0.3,0,0.5,0.2,0.5,0.5S11.7,12.2,11.4,12.2z"></path>\n      <path d="M10.9,9.2H3.2C2.9,9.2,2.7,9,2.7,8.7s0.2-0.5,0.5-0.5h7.8c0.3,0,0.5,0.2,0.5,0.5S11.2,9.2,10.9,9.2z"></path>\n      <path d="M14.3,18.2H3.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h11.1c0.3,0,0.5,0.2,0.5,0.5S14.5,18.2,14.3,18.2z"></path>\n      <path d="M14.3,21.1H3.2c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h11.1c0.3,0,0.5,0.2,0.5,0.5S14.5,21.1,14.3,21.1z"></path>\n      <path d="M19.8,10.4h-4.4c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h4.4c0.3,0,0.5,0.2,0.5,0.5S20.1,10.4,19.8,10.4z"></path>\n      <path d="M16.9,7.4h-4.4c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h4.4c0.3,0,0.5,0.2,0.5,0.5S17.2,7.4,16.9,7.4z"></path>\n      <path d="M16.5,4.4H8.7c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h7.8c0.3,0,0.5,0.2,0.5,0.5S16.8,4.4,16.5,4.4z"></path>\n      <path d="M19.8,13.4h-2.5c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h2.5c0.3,0,0.5,0.2,0.5,0.5S20.1,13.4,19.8,13.4z"></path>\n      <path d="M19.8,16.4h-2.5c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h2.5c0.3,0,0.5,0.2,0.5,0.5S20.1,16.4,19.8,16.4z"></path>\n      <path d="M16.7,12.6h-4.1c-1.5,0-2.7-1.2-2.7-2.7V5.5c0-0.4,0.3-0.8,0.8-0.8s0.8,0.3,0.8,0.8V10c0,0.6,0.5,1.2,1.2,1.2h4.1c0.4,0,0.8,0.3,0.8,0.8S17.1,12.6,16.7,12.6z"></path>\n      <path d="M22.6,7.8h-4.1c-1.5,0-2.7-1.2-2.7-2.7V0.8c0-0.4,0.3-0.8,0.8-0.8s0.8,0.3,0.8,0.8v4.4c0,0.6,0.5,1.2,1.2,1.2h4.1c0.4,0,0.8,0.3,0.8,0.8S23,7.8,22.6,7.8z"></path>\n    </svg>';
    }
  }, {
    key: 'render',
    value: function render() {
      this.$el.html(this.template());
    }
  }]);

  return ItemView;
}();
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