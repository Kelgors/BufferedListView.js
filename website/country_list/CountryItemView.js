define('country_list/CountryItemView', [ 'buffered-list', 'exports' ], function (BufferedList, exports) {
  var BufferedListItemView = BufferedList.BufferedListItemView;

  function CountryItemView() {
    BufferedListItemView.call(this);
  }

  CountryItemView.tagName = BufferedListItemView.tagName;
  CountryItemView.DESTROY_METHOD = BufferedListItemView.DESTROY_METHOD;

  CountryItemView.prototype = Object.create(BufferedListItemView.prototype, {
    constructor: {
      value: CountryItemView,
      enumerable: false
    },
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