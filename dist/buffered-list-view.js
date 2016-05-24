"use strict";function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function set_constant(e,t,i){Object.defineProperty(e,t,{writable:!1,configurable:!1,value:i})}function createConstantArray(){for(var e=arguments.length,t=Array(e),i=0;e>i;i++)t[i]=arguments[i];for(var r=new Array(t.length),n=0;n<t.length;n++)Object.defineProperty(r,n,{configurable:!1,writable:!1,enumerable:!0,value:t[n]});return r}var _slicedToArray=function(){function e(e,t){var i=[],r=!0,n=!1,o=void 0;try{for(var s,l=e[Symbol.iterator]();!(r=(s=l.next()).done)&&(i.push(s.value),!t||i.length!==t);r=!0);}catch(a){n=!0,o=a}finally{try{!r&&l["return"]&&l["return"]()}finally{if(n)throw o}}return i}return function(t,i){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,i,r){return i&&e(t.prototype,i),r&&e(t,r),t}}(),Pool=function(){function e(t){var i=arguments.length<=1||void 0===arguments[1]?-1:arguments[1],r=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],n=r.clearMethodName,o=void 0===n?null:n,s=r.destroyMethodName,l=void 0===s?null:s,a=r.isFactory,u=void 0===a?!1:a;_classCallCheck(this,e),this.size=i,set_constant(this,"ObjectConstructor",t),set_constant(this,"objectClearMethodName",o),set_constant(this,"objectDestroyMethodName",l),set_constant(this,"objectConstructorIsFactory",u),set_constant(this,"borrowedObjects",[]),set_constant(this,"availableObjects",[]),set_constant(this,"awaitCallbacks",[])}return _createClass(e,[{key:"destroy",value:function(){this._destroyChildren(this.borrowedObjects),this._destroyChildren(this.availableObjects),this.awaitCallbacks.length&&this.awaitCallbacks.splice(0,this.awaitCallbacks.length)}},{key:"_destroyChildren",value:function(e){var t=this.objectDestroyMethodName||this.objectClearMethodName;if(!t)return void e.splice(0,e.length);for(var i=void 0;i=e.pop();)try{i[t].call(i)}catch(r){if("undefined"==typeof console)throw r;console.log("Error during destroy")}}},{key:"await",value:function(){var e=this;return this.hasAvailables()?Promise.resolve(this.borrows()):new Promise(function(t,i){e.awaitCallbacks.push(t)})}},{key:"borrows",value:function(){var e=null;return this.hasAvailables()&&(e=0===this.availableObjects.length?this.objectConstructorIsFactory?this.ObjectConstructor():new this.ObjectConstructor:this.availableObjects.pop(),this.borrowedObjects.push(e)),this._onObjectBorrowed&&this._onObjectBorrowed(),e}},{key:"returns",value:function(e){if(!(this.objectConstructorIsFactory||e instanceof this.ObjectConstructor))throw new Error("Can't return object which is not a "+this.ObjectConstructor.name);var t=this.borrowedObjects.indexOf(e);if(-1===t){if(this.availableObjects.indexOf(e)>-1)throw new Error(this.ObjectConstructor.name+" already returned !");throw new Error("Object given in Pool#returns() is not referenced in this Pool instance.")}if(this.borrowedObjects.splice(t,1),null!==this.objectClearMethodName)try{e[this.objectClearMethodName].call(e)}catch(i){if("undefined"==typeof console)throw i;console.log("Unable to call method "+this.objectClearMethodName+" on object instance "+String(e))}this.availableObjects.push(e),this._onObjectReturned&&this._onObjectReturned()}},{key:"hasAvailables",value:function(){return-1===this.size||this.borrowedObjects.length<this.size}},{key:"getCountAvailables",value:function(){return(-1===this.size?Number.MAX_SAFE_INTEGER:this.size)-this.getCountBorrowed()}},{key:"getCountBorrowed",value:function(){return this.borrowedObjects.length}},{key:"toString",value:function(){return"Pool<"+this.ObjectConstructor.name+">(borrowed: "+this.getCountBorrowed()+", available: "+this.getCountAvailables()+")"}},{key:"_onObjectReturned",value:function(){if(console.log("_onObjectReturned"),this.awaitCallbacks.length&&this.hasAvailables()){var e=this.awaitCallbacks.shift();e(this.borrows())}}}]),e}(),BufferedListItemView=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this));return e.$el.addClass("item-view"),e}return _inherits(t,e),t}(View);BufferedListItemView.tagName="li",BufferedListItemView.CLEAR_METHOD="clear",BufferedListItemView.DESTROY_METHOD="destroy";var BufferedListView=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];_classCallCheck(this,t);var i=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,e));$.extend(i,Bullet),Object.defineProperty(i,"_currentVisibleRange",{configurable:!0,writable:!1,value:createConstantArray(0,0)}),i.isRendered=!1,i.listContainerSelector=e.listContainerSelector||".list-container:first > .list-display",i.scrollerContainerSelector=e.scrollerContainerSelector||".list-container:first",i.scrollPositionY=0,i.listHeight=e.listHeight||"auto",i.listHeightAutoMode="auto"===i.listHeight,i.listItemHeight=e.listItemHeight,i.idModelPropertyName=e.idModelPropertyName||"id",i.visibleOutboundItemsCount="number"!=typeof e.visibleOutboundItemsCount?2:e.visibleOutboundItemsCount,i.models=e.models||[];var r=e.ItemConstructor||i.getItemConstructor();return i.viewsPool=new Pool(r,e.maxPoolSize||-1,{clearMethodName:r.CLEAR_METHOD,destroyMethodName:r.DESTROY_METHOD}),i.viewsMap=new Map,i._onWindowResize=i.onResize.bind(i),$(window).on("resize",i._onWindowResize),i.listHeightAutoMode&&i.once("attach",function(){i.listHeight=i.queryListHeight(),i.isRendered&&(i.updateListScrollerHeight(),i.renderVisibleItems())}),i}return _inherits(t,e),_createClass(t,[{key:"destroy",value:function(){$(window).off("resize",this._onWindowResize),this.viewsPool.destroy(),this.el&&delete this.el.__view__,this.$el&&this.remove(),delete this._onWindowResize,delete this.models,delete this.el,delete this.$el}},{key:"setModels",value:function(){var e=arguments.length<=0||void 0===arguments[0]?[]:arguments[0];this.models=e,this.updateListScrollerHeight(),this.renderVisibleItems()}},{key:"getItemConstructor",value:function(){return BufferedListItemView}},{key:"template",value:function(){return'<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>'}},{key:"render",value:function(){this.$el.html(this.template()),this.isRendered=!0,this.$listContainer=this.$(this.listContainerSelector),this.$scrollerContainer=this.$(this.scrollerContainerSelector),this.$scrollerContainer.on("scroll",this.onScroll.bind(this)),this.isAttached&&(this.listHeightAutoMode&&(this.listHeight=this.queryListHeight()),this.updateListScrollerHeight(),this.renderVisibleItems())}},{key:"attachTo",value:function(e){$(e).append(this.$el),this.el.parentNode&&this.trigger("attach")}},{key:"scrollToIndex",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=e*this.listItemHeight;t.animate?this.$scrollerContainer.animate({scrollTop:i},t.duration||300):this.$scrollerContainer.scrollTop(i)}},{key:"queryListHeight",value:function(){return this.$el.outerHeight()}},{key:"updateListScrollerHeight",value:function(){this.$scrollerContainer.find(".list-content").height(this.models.length*this.listItemHeight)}},{key:"defineRangeOfModelsVisibles",value:function(){var e=Math.floor(this.scrollPositionY/this.listItemHeight),t=Math.ceil(this.listHeight/this.listItemHeight),i=Math.min(this.models.length-1,e+t);return[e,i]}},{key:"renderItemsRange",value:function(e){var t=this,i=_slicedToArray(e,2),r=i[0],n=i[1];if(this._currentVisibleRange[0]!==r||this._currentVisibleRange[1]!==n){var o=Math.max(0,r-this.visibleOutboundItemsCount),s=Math.min(this.models.length-1,n+this.visibleOutboundItemsCount),l=this.models.slice(o,s),a=l.map(function(e,i){var r=t.getView(e,o+Number(i));return r.el.setAttribute("data-index",r.indexInModelList),r});this.renderViews(a),Object.defineProperty(this,"_currentVisibleRange",{configurable:!0,writable:!1,value:createConstantArray(r,n)}),this.constructor.DEV_MODE&&this.renderDebugInfos()}}},{key:"renderVisibleItems",value:function(){this.renderItemsRange(this.defineRangeOfModelsVisibles())}},{key:"renderViews",value:function(e){var t=this.$listContainer.children().toArray().map(function(e){return e.__view__});if(0===t.length)this.addViews(e);else{var i=t.filter(function(t){return!e.includes(t)}),r=e;this.removeViews(i),this.addViews(r)}}},{key:"getView",value:function(e,t){var i=this.viewsMap.get(e[this.idModelPropertyName]);if("undefined"==typeof this.idModelPropertyName)throw new Error("BufferedListView#idModelPropertyName must be defined");if("undefined"==typeof e[this.idModelPropertyName])throw new Error("The model."+this.idModelPropertyName+" is undefined. There is no chance to show more than one view.");if(!i){if(i=this.viewsPool.borrows(),!i)throw new Error("No views availables. Actually borrowed: "+this.viewsPool.getCountBorrowed());i.model=e,i.indexInModelList=t,i.render(),this.viewsMap.set(e[this.idModelPropertyName],i)}return i}},{key:"removeViews",value:function(e){for(var t=0;t<e.length;t++)this.removeView(e[t])}},{key:"removeView",value:function(e){this.viewsMap["delete"](e.model[this.idModelPropertyName]),this.viewsPool.returns(e)}},{key:"addViews",value:function(e){for(var t=0;t<e.length;t++)this.addView(e[t],t)}},{key:"addView",value:function(e,t){var i=this.$listContainer,r=i.children(),n=this.listItemHeight*e.indexInModelList;e.el.style.top=String(n)+"px",r.length<=t?i.append(e.el):0===t?i.prepend(e.el):$(i.children().get(t)).after(e.el)}},{key:"onResize",value:function(e){this._onResize(e),this.renderVisibleItems()}},{key:"onScroll",value:function(e){this._onScroll(e)}},{key:"_onResize",value:function(e){this.listHeightAutoMode&&(this.listHeight=this.queryListHeight())}},{key:"_onScroll",value:function(e){this.scrollPositionY=this.$scrollerContainer.scrollTop(),this.renderVisibleItems()}},{key:"renderDebugInfos",value:function(){var e=this.defineRangeOfModelsVisibles(),t=_slicedToArray(e,2),i=t[0],r=t[1];$("#debug-container").html("\n<div>Actual pool usage: "+this.viewsPool.getCountBorrowed()+" / "+this.viewsPool.getCountAvailables()+"</div>\n<div>Visible range: ("+i+", "+r+")</div>\n<div>Visible models: ("+Math.max(0,i-this.visibleOutboundItemsCount)+", "+Math.min(this.models.length-1,r+this.visibleOutboundItemsCount)+")")}}]),t}(View),View=function(){function e(){_classCallCheck(this,e),this.$el=jQuery(this.el=document.createElement(this.constructor.tagName||"div")),this.$el.addClass("view"),this.el.__view__=this}return _createClass(e,[{key:"isAttached",get:function(){return!!this.el&&!!this.el.parentNode}}]),_createClass(e,[{key:"destroy",value:function(){this.el&&(this.el.__view__=null,this.remove()),this.el=this.$el=this.model=null}},{key:"$",value:function(){return this.$el.find.apply(this.$el,arguments)}},{key:"clear",value:function(){this.remove(),this.el.innerHTML="",this.model=null}},{key:"remove",value:function(){this.el.parentNode&&this.el.parentNode.removeChild(this.el)}},{key:"template",value:function(){return String(this.indexInModelList)}},{key:"render",value:function(){this.el.innerHTML=this.template()}}]),e}(),AUTHORIZED_LISTVIEW_OPTIONS_KEYS=["listContainerSelector","scrollerContainerSelector","listHeight","listItemHeight","visibleOutboundItemsCount","models","maxPoolSize","idModelPropertyName","ItemConstructor"],jQueryBufferedListViewContainer=function(){function e(t){var i=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];_classCallCheck(this,e),this.$container=t,this.options=i,this.createListView(),this.render()}return _createClass(e,[{key:"getAttribute",value:function(e){return this.options[e]}},{key:"setAttribute",value:function(e,t){var i=this.options[e];this.options[e]=t,"function"==typeof this["_"+e+"Changed"]&&this["_"+e+"Changed"].call(this,i,t)}},{key:"createListView",value:function(){options.ItemConstructor=this.generateItemView(this.getAttribute("template")),this.listview=new BufferedListView(options)}},{key:"recreateListView",value:function(){this.listview&&this.listview.destroy(),this.createListView(),this.render()}},{key:"render",value:function(){this.listview.$el.parent().get(0)!==this.$container.get(0)&&this.$container.append(this.listview.$el),this.listview.render()}},{key:"generateItemView",value:function(e){var t=function(e){function t(){return _classCallCheck(this,t),_possibleConstructorReturn(this,Object.getPrototypeOf(t).apply(this,arguments))}return _inherits(t,e),_createClass(t,[{key:"clear",value:function(){this.model=null}}]),t}(BufferedListItemView);return t.CLEAR_METHOD="clear",t.DESTROY_METHOD="clear",t.prototype.template=e,t}},{key:"_htmlChanged",value:function(e,t){e!==t&&this.recreateListView()}},{key:"_dataChanged",value:function(e,t){this.listview.setModels(t)}}]),e}();$.fn.bufferedListView=function(e,t){if("string"==typeof e)return this.prop("buffered-list-view")?void 0!==t?(this.prop("buffered-list-view").setAttribute(e,t),this):this.prop("buffered-list-view").getAttribute(e):this;var i=e;return this.prop("buffered-list-view",new jQueryBufferedListViewContainer(this,i)),this};e list scrolling is adapted to its content
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
      var _this4 = this;

      var _ref3 = _slicedToArray(_ref2, 2);

      var start = _ref3[0];
      var end = _ref3[1];

      if (this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
      var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
      var modelsEnd = Math.min(this.models.length - 1, end + this.visibleOutboundItemsCount);
      var rangeOfModels = this.models.slice(modelsStart, modelsEnd);
      var views = rangeOfModels.map(function (model, index) {
        var view = _this4.getView(model, modelsStart + Number(index));
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

      $('#debug-container').html('\n<div>Actual pool usage: ' + this.viewsPool.getCountBorrowed() + ' / ' + this.viewsPool.getCountAvailables() + '</div>\n<div>Visible range: (' + startIndex + ', ' + endIndex + ')</div>\n<div>Visible models: (' + Math.max(0, startIndex - this.visibleOutboundItemsCount) + ', ' + Math.min(this.models.length - 1, endIndex + this.visibleOutboundItemsCount) + ')');
    }
  }]);

  return BufferedListView;
}(View);

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

var AUTHORIZED_LISTVIEW_OPTIONS_KEYS = ["listContainerSelector", "scrollerContainerSelector", "listHeight", "listItemHeight", "visibleOutboundItemsCount", "models", "maxPoolSize", "idModelPropertyName", "ItemConstructor"];

var jQueryBufferedListViewContainer = function () {
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