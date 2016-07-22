import jQuery from 'jquery';
import SafeObject from 'SafeObject';

export default class View extends SafeObject {

  get isAttached() {
    return !!this.el && !!this.el.parentNode;
  }

  constructor() {
    super();
    this.$el = jQuery(this.el = document.createElement(this.constructor.tagName || 'div'));
    this.$el.addClass('view');
    this.el.__view__ = this;
  }

  destroy() {
    if (this.el) {
      this.el.__view__ = null;
      this.remove();
    }
    super.destroy();
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

View.INSTANCE_PROPERTIES = {
  el: null,
  $el: null,
  model: null
};