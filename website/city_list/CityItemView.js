define('city_list/CityItemView', [ 'BufferedListItemView', 'exports' ], function (importBufferedListItemView, exports) {
  var BufferedListItemView = importBufferedListItemView.default;

  function CityItemView() {
    BufferedListItemView.call(this);
  }

  CityItemView.DESTROY_METHOD = BufferedListItemView.DESTROY_METHOD;

  CityItemView.prototype = Object.create(BufferedListItemView.prototype, {
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