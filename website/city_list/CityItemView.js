define('city_list/CityItemView', [ 'buffered-list', 'exports' ], function (BufferedList, exports) {
  var BufferedListItemView = BufferedList.BufferedListItemView;

  function CityItemView() {
    BufferedListItemView.call(this);
  }

  CityItemView.DESTROY_METHOD = BufferedListItemView.DESTROY_METHOD;
  CityItemView.tagName = BufferedListItemView.tagName;

  CityItemView.prototype = Object.create(BufferedListItemView.prototype, {
    constructor: {
      value: CityItemView,
      enumerable: false
    },
    template: {
      value: function template() {
        return [
          [ '<img src="country_list/flag-list/', this.model.countryCode.toLowerCase(), '.svg" width="28" height="21">' ].join(''),
          [ '<span class="city-name">', this.model.cityName, ' (', this.model.countryCode, ')</span>' ].join('')
        ].join('');
      }
    }
  });

  exports.default = CityItemView;

});