define('country_list/CountryList', [ 'country_list/CountryItemView', 'buffered-list', 'exports' ], function (importCountryItemView, BufferedList, exports) {
  var CountryItemView = importCountryItemView.default;
  var BufferedListView = BufferedList.BufferedListView;

  function CountryList(options) {
    BufferedListView.call(this, Object.assign({
      listHeight: 'auto',
      listItemHeight: 30,
      idModelPropertyName: 'code'
    }, options));
    this.$el.attr('id', 'country-list-view');
  }

  CountryList.prototype = Object.create(BufferedListView.prototype, {
    constructor: {
      value: CountryList,
      enumerable: false
    },
    getItemConstructor: {
      value: function getItemConstructor() {
        return CountryItemView;
      }
    }
  });
  CountryList.prototype.constructor = CountryList;

  exports.default = CountryList;

});