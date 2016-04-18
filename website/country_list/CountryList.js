define('country_list/CountryList', [ 'country_list/CountryItemView', 'BufferedListView', 'exports' ], function (importCountryItemView, importBufferedListView, exports) {
  var CountryItemView = importCountryItemView.default;
  var BufferedListView = importBufferedListView.default;

  function CountryList(options) {
    BufferedListView.call(this, Object.assign({
      listHeight: 'auto',
      listItemHeight: 30,
      idModelPropertyName: 'code'
    }, options));
    this.$el.attr('id', 'country-list-view');
  }

  CountryList.prototype = Object.create(BufferedListView.prototype, {
    getItemConstructor: {
      value: function getItemConstructor() {
        return CountryItemView;
      }
    }
  });
  CountryList.prototype.constructor = CountryList;

  exports.default = CountryList;

});