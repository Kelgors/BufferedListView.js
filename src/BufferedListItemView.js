class BufferedListItemView {
  constructor() {
    this.$el = $(this.el = document.createElement('li'));
    this.$el.addClass('item-view');
    this.$ = this.$el.find.bind(this.$el);
    this.el.__view__ = this;
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