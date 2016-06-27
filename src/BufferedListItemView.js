import View from 'View';

export default class BufferedListItemView extends View {
  constructor() {
    super();
    this.$el.addClass('item-view');
  }

  template() {
    return String(this.indexInModelList);
  }
}

BufferedListItemView.tagName = 'li';
BufferedListItemView.DESTROY_METHOD = 'destroy';
BufferedListItemView.INSTANCE_PROPERTIES = [ 'indexInModelList' ];