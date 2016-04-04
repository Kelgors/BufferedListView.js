import $ from 'jquery';

export default class BufferedListItemView {
  constructor() {
    this.$el = $(this.el = document.createElement('li'));
    this.$el.addClass('item-view');
    this.$ = this.$el.find.bind(this.$el);
    this.el.__view__ = this;
  }

  destroy() {
    if (this.$el) this.remove();
    if (this.el) delete this.el.__view__;
    delete this.model;
    delete this.$;
    delete this.$el;
    delete this.el;
  }

  clear() {
    this.remove();
    this.el.innerHTML = '';
    this.model = null;
  }

  remove() {
    this.$el.remove();
  }

  template() {
    return String(this.indexInModelList);
  }

  render() {
    this.$el.html(this.template());
  }
}

BufferedListItemView.CLEAR_METHOD = 'clear';
BufferedListItemView.DESTROY_METHOD = 'destroy';