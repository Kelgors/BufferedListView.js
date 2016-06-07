import View from 'View';

export default class BufferedListItemView extends View {
  constructor() {
    super();
    this.$el.addClass('item-view');
  }
}
BufferedListItemView.tagName = 'li';
BufferedListItemView.DESTROY_METHOD = 'destroy';