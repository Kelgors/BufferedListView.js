"use strict";function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function createConstantArray(){for(var e=arguments.length,t=Array(e),i=0;e>i;i++)t[i]=arguments[i];for(var n=new Array(t.length),r=0;r<t.length;r++)Object.defineProperty(n,r,{configurable:!1,writable:!1,enumerable:!0,value:t[r]});return n}var _slicedToArray=function(){function e(e,t){var i=[],n=!0,r=!1,o=void 0;try{for(var s,l=e[Symbol.iterator]();!(n=(s=l.next()).done)&&(i.push(s.value),!t||i.length!==t);n=!0);}catch(a){r=!0,o=a}finally{try{!n&&l["return"]&&l["return"]()}finally{if(r)throw o}}return i}return function(t,i){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),View=function(){function e(){_classCallCheck(this,e),this.$el=jQuery(this.el=document.createElement(this.constructor.tagName||"div")),this.$el.addClass("view"),this.el.__view__=this}return _createClass(e,[{key:"isAttached",get:function(){return!!this.el&&!!this.el.parentNode}}]),_createClass(e,[{key:"destroy",value:function(){this.el&&(this.el.__view__=null,this.remove()),this.el=this.$el=this.model=null}},{key:"$",value:function(){return this.$el.find.apply(this.$el,arguments)}},{key:"clear",value:function(){this.remove(),this.el.innerHTML="",this.model=null}},{key:"remove",value:function(){this.el.parentNode&&this.el.parentNode.removeChild(this.el)}},{key:"template",value:function(){return String(this.indexInModelList)}},{key:"render",value:function(){this.el.innerHTML=this.template()}}]),e}(),BufferedListItemView=function(e){function t(){_classCallCheck(this,t);var e=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this));return e.$el.addClass("item-view"),e}return _inherits(t,e),t}(View);BufferedListItemView.tagName="li",BufferedListItemView.DESTROY_METHOD="destroy";var BufferedListView=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];_classCallCheck(this,t);var i=_possibleConstructorReturn(this,Object.getPrototypeOf(t).call(this,e));return $.extend(i,Bullet),Object.defineProperty(i,"_currentVisibleRange",{configurable:!0,writable:!1,value:createConstantArray(0,0)}),i.isRendered=!1,i.listContainerSelector=e.listContainerSelector||".list-container:first > .list-display",i.scrollerContainerSelector=e.scrollerContainerSelector||".list-container:first",i.scrollPositionY=0,i.listHeight=e.listHeight||"auto",i.listHeightAutoMode="auto"===i.listHeight,i.listItemHeight=e.listItemHeight,i.idModelPropertyName=e.idModelPropertyName||"id",i.visibleOutboundItemsCount="number"!=typeof e.visibleOutboundItemsCount?2:e.visibleOutboundItemsCount,i.models=e.models||[],i.ItemConstructor=e.ItemConstructor||i.getItemConstructor(),i.viewsMap=new Map,i._onWindowResize=i.onResize.bind(i),$(window).on("resize",i._onWindowResize),i.listHeightAutoMode&&i.once("attach",function(){i.listHeight=i.queryListHeight(),i.isRendered&&(i.updateListScrollerHeight(),i.renderVisibleItems())}),i}return _inherits(t,e),_createClass(t,[{key:"destroy",value:function(){$(window).off("resize",this._onWindowResize),this.el&&delete this.el.__view__,this.$el&&this.remove(),this._onWindowResize=null,this.$listContainer=null,this.$scrollerContainer=null,this.models=null,this.$el=null,this.el=null}},{key:"setModels",value:function(){var e=arguments.length<=0||void 0===arguments[0]?[]:arguments[0];this.models=e,this.updateListScrollerHeight(),this.renderVisibleItems()}},{key:"getItemConstructor",value:function(){return BufferedListItemView}},{key:"template",value:function(){return'<div class="list-container"><div class="list-content"></div><ol class="list-display"></ol></div>'}},{key:"render",value:function(){this.$el.html(this.template()),this.isRendered=!0,this.$listContainer=this.$(this.listContainerSelector),this.$scrollerContainer=this.$(this.scrollerContainerSelector),this.$scrollerContainer.on("scroll",this.onScroll.bind(this)),this.isAttached&&(this.listHeightAutoMode&&(this.listHeight=this.queryListHeight()),this.updateListScrollerHeight(),this.renderVisibleItems())}},{key:"attachTo",value:function(e){$(e).append(this.$el),this.el.parentNode&&this.trigger("attach")}},{key:"scrollToIndex",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=e*this.listItemHeight;t.animate?this.$scrollerContainer.animate({scrollTop:i},t.duration||300):this.$scrollerContainer.scrollTop(i)}},{key:"queryListHeight",value:function(){return this.$el.outerHeight()}},{key:"updateListScrollerHeight",value:function(){this.$scrollerContainer.find(".list-content").height(this.models.length*this.listItemHeight)}},{key:"defineRangeOfModelsVisibles",value:function(){var e=Math.floor(this.scrollPositionY/this.listItemHeight),t=Math.ceil(this.listHeight/this.listItemHeight),i=Math.min(this.models.length-1,e+t);return[e,i]}},{key:"renderItemsRange",value:function(e){var t=this,i=_slicedToArray(e,2),n=i[0],r=i[1];if(this._currentVisibleRange[0]!==n||this._currentVisibleRange[1]!==r){var o=Math.max(0,n-this.visibleOutboundItemsCount),s=Math.min(this.models.length-1,r+this.visibleOutboundItemsCount),l=this.models.slice(o,s),a=l.map(function(e,i){var n=t.getView(e,o+Number(i));return n.el.setAttribute("data-index",n.indexInModelList),n});this.renderViews(a),Object.defineProperty(this,"_currentVisibleRange",{configurable:!0,writable:!1,value:createConstantArray(n,r)}),this.constructor.DEV_MODE&&this.renderDebugInfos()}}},{key:"renderVisibleItems",value:function(){this.renderItemsRange(this.defineRangeOfModelsVisibles())}},{key:"renderViews",value:function(e){var t=this.$listContainer.children().toArray().map(function(e){return e.__view__});if(0===t.length)this.addViews(e);else{var i=t.filter(function(t){return!e.includes(t)}),n=e;this.removeViews(i),this.addViews(n)}}},{key:"getView",value:function(e,t){var i=this.viewsMap.get(e[this.idModelPropertyName]);if("undefined"==typeof this.idModelPropertyName)throw new Error("BufferedListView#idModelPropertyName must be defined");if("undefined"==typeof e[this.idModelPropertyName])throw new Error("The model."+this.idModelPropertyName+" is undefined. There is no chance to show more than one view.");return i||(i=this.createView(e,t),this.viewsMap.set(e[this.idModelPropertyName],i)),i}},{key:"createView",value:function(e,t){var i=new this.ItemConstructor;return i.model=e,i.indexInModelList=t,i.render(),i}},{key:"removeViews",value:function(e){for(var t=0;t<e.length;t++)this.removeView(e[t])}},{key:"removeView",value:function(e){this.viewsMap["delete"](e.model[this.idModelPropertyName]),e[this.ItemConstructor.DESTROY_METHOD]()}},{key:"addViews",value:function(e){for(var t=0;t<e.length;t++)this.addView(e[t],t)}},{key:"addView",value:function(e,t){var i=this.$listContainer,n=i.children(),r=this.listItemHeight*e.indexInModelList;e.el.style.top=String(r)+"px",n.length<=t?i.append(e.el):0===t?i.prepend(e.el):$(i.children().get(t)).after(e.el)}},{key:"onResize",value:function(e){this._onResize(e),this.renderVisibleItems()}},{key:"onScroll",value:function(e){this._onScroll(e)}},{key:"_onResize",value:function(e){this.listHeightAutoMode&&(this.listHeight=this.queryListHeight())}},{key:"_onScroll",value:function(e){this.scrollPositionY=this.$scrollerContainer.scrollTop(),this.renderVisibleItems()}},{key:"renderDebugInfos",value:function(){var e=this.defineRangeOfModelsVisibles(),t=_slicedToArray(e,2),i=t[0],n=t[1];$("#debug-container").html("\n<div>Visible range: ("+i+", "+n+")</div>\n<div>Visible models: ("+Math.max(0,i-this.visibleOutboundItemsCount)+", "+Math.min(this.models.length-1,n+this.visibleOutboundItemsCount)+")")}}]),t}(View);   // render view
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
    value: function renderItemsRange(_ref) {
      var _this3 = this;

      var _ref2 = _slicedToArray(_ref, 2);

      var start = _ref2[0];
      var end = _ref2[1];

      if (this._currentVisibleRange[0] === start && this._currentVisibleRange[1] === end) return;
      var modelsStart = Math.max(0, start - this.visibleOutboundItemsCount);
      var modelsEnd = Math.min(this.models.length - 1, end + this.visibleOutboundItemsCount);
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