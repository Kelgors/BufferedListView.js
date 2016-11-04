import $ from 'jquery';

export default class View {

  get isAttached() {
    return !!this.el && !!this.el.parentNode;
  }

  constructor() {
    this.$el = $(this.el = document.createElement(this.constructor.tagName || 'div'));
    this.$el.addClass('view');
    this.model = null;
    if (typeof DEV_MODE !== 'undefined') this.el.__view__ = this;
  }

  destroy() {
    if (this.el) {
      if ('__view__' in this.el) this.el.__view__ = null;
      this.remove();
    }
  }

  $() {
    return this.$el.find.apply(this.$el, arguments);
  }

  clear() {
    this.remove();
    this.el.innerHTML = '';
    this.model = null;
  }

  remove() {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }

  template() {
    return '';
  }

  render() {
    this.el.innerHTML = this.template();
  }
}
View.DESTROY_METHOD = 'destroy';