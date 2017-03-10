import View from './View';

export default class BufferedListItemView extends View {
  constructor() {
    super();
    this.$el.addClass('item-view');
  }

  destroy() {
    super.destroy();
    this.indexInModelList = null;
    this.model = null;
    this.parentListView = null;
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
    this.model = event.model;
  }
}

BufferedListItemView.tagName = 'li';