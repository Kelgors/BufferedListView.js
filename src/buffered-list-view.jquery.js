import $ from 'jquery';
import BufferedListView from 'BufferedListView';
import BufferedListItemView from 'BufferedListItemView';

const AUTHORIZED_LISTVIEW_OPTIONS_KEYS = [
  "listContainerSelector",
  "scrollerContainerSelector",
  "listHeight",
  "listItemHeight",
  "visibleOutboundItemsCount",
  "models",
  "maxPoolSize",
  "idModelPropertyName",
  "ItemConstructor"
];

class jQueryBufferedListViewContainer {
  constructor($element, options = {}) {
    this.$container = $element;
    this.options = options;
    this.createListView();
    this.render();
  }

  getAttribute(key) {
    return this.options[key];
  }

  setAttribute(key, value) {
    const oldValue = this.options[key];
    this.options[key] = value;
    if (typeof this[`_${key}Changed`] === 'function') {
      this[`_${key}Changed`].call(this, oldValue, value);
    }
  }

  createListView() {
    options.ItemConstructor = this.generateItemView(this.getAttribute('template'));
    this.listview = new BufferedListView(options);
  }

  recreateListView() {
    if (this.listview) this.listview.destroy();
    this.createListView();
    this.render();
  }

  render() {
    if (this.listview.$el.parent().get(0) !== this.$container.get(0)) {
      this.$container.append(this.listview.$el);
    }
    this.listview.render();
  }

  generateItemView(template) {
    class $$ItemView extends BufferedListItemView {
      clear() { this.model = null; }
    }
    $$ItemView.CLEAR_METHOD = 'clear';
    $$ItemView.DESTROY_METHOD = 'clear';
    $$ItemView.prototype.template = template;
    return $$ItemView;
  }

  _htmlChanged(oldValue, newValue) {
    if (oldValue !== newValue) {
      this.recreateListView();
    }
  }

  _dataChanged(oldValue, newValue) {
    this.listview.setModels(newValue);
  }
}

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
  const options = key;
  this.prop('buffered-list-view', new jQueryBufferedListViewContainer(this, options));
  return this;
};