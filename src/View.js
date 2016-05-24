import jQuery from 'jquery';

export default class View {
  get isAttached() {
    return !!this.el && !!this.el.parentNode;
  }

  constructor() {
    this.$el = jQuery(this.el = document.createElement(this.constructor.tagName || 'div'));
    this.$el.addClass('view');
    this.el.__view__ = this;
  }

  destroy() {
    if (this.el) {
      this.el.__view__ = null;
      this.remove();
    }
    this.el = this.$el = this.model = null;
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
    return String(this.indexInModelList);
  }

  render() {
    this.el.innerHTML = this.template();
  }
}