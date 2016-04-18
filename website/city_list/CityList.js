define('city_list/CityList', [ 'city_list/CityItemView', 'BufferedListView', 'exports' ], function (importCityItemView, importBufferedListView, exports) {
  var CityItemView = importCityItemView.default;
  var BufferedListView = importBufferedListView.default;

  function CityList(options) {
    BufferedListView.call(this, Object.assign({
      listHeight: 'auto',
      listItemHeight: 30,
      idModelPropertyName: 'id'
    }, options));
    this.$el.attr('id', 'city-list-view');
  }

  CityList.prototype = Object.create(BufferedListView.prototype, {
    getItemConstructor: {
      value: function getItemConstructor() {
        return CityItemView;
      }
    }
  });
  CityList.prototype.constructor = CityList;

  exports.default = CityList;

});