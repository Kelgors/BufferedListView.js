define('city_list/CityList', [ 'city_list/CityItemView', 'buffered-list', 'exports' ], function (importCityItemView, BufferedList, exports) {
  var CityItemView = importCityItemView.default;
  var BufferedListView = BufferedList.BufferedListView;

  function CityList(options) {
    BufferedListView.call(this, Object.assign({
      listHeight: 'auto',
      listItemHeight: 30,
      idModelPropertyName: 'id'
    }, options));
    this.$el.attr('id', 'city-list-view');
  }

  CityList.prototype = Object.create(BufferedListView.prototype, {
    constructor: {
      value: CityList,
      enumerable: false
    },
    getItemConstructor: {
      value: function getItemConstructor() {
        return CityItemView;
      }
    }
  });
  CityList.prototype.constructor = CityList;

  exports.default = CityList;

});