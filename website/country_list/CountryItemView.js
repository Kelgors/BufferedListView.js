define('country_list/CountryItemView', [ 'BufferedListItemView', 'exports' ], function (importBufferedListItemView, exports) {
  var BufferedListItemView = importBufferedListItemView.default;

  function CountryItemView() {
    BufferedListItemView.call(this);
  }

  CountryItemView.CLEAR_METHOD = BufferedListItemView.CLEAR_METHOD;
  CountryItemView.DESTROY_METHOD = BufferedListItemView.DESTROY_METHOD;

  CountryItemView.prototype = Object.create(BufferedListItemView.prototype, {
    template: {
      value: function template() {
        return [
          [ '<img src="country_list/flag-list/', this.model.code.toLowerCase(), '.svg" width="28" height="21">' ].join(''),
          [ '<span class="country-name">', this.model.name, '</span>' ].join('')
        ].join('');
      }
    }
  });

  exports.default = CountryItemView;

});