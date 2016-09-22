import View from 'View';

export default class BufferedListItemView extends View {
  constructor() {
    super();
    this.$el.addClass('item-view');
  }

  template() {
    return String(this.indexInModelList);
  }

  onInitialize({ model, parentListView, indexInModelList }) {
    this.model = model;
    this.parentListView = parentListView;
    this.indexInModelList = indexInModelList;
    this.el.setAttribute('data-index', this.indexInModelList);
  }

  onUpdate(event) {
    this.indexInModelList = event.indexInModelList;
    this.el.setAttribute('data-index', this.indexInModelList);
  }
}

BufferedListItemView.tagName = 'li';
BufferedListItemView.DESTROY_METHOD = 'destroy';
BufferedListItemView.INSTANCE_PROPERTIES = {
  indexInModelList: null,
  model: null,
  parentListView: null
};