require([ 'jquery' ], function (jQuery) {
  function addStyle(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.head.appendChild(link);
  }
  jQuery.getJSON('options.json')
    .done(function onOptionsLoaded(possibilities) {
      $('#example').removeClass('hidden');
      var index = Math.round(Math.random() * (possibilities.length - 1));
      var conf = possibilities[index];
      document.getElementById('example-title').textContent = conf.title;
      document.getElementById('example-subtitle').innerHTML = conf.description;

      if ('style' in conf) addStyle(conf['style']);

      require([ conf['ListConstructor'] ], function (importListView) {
        var ListView = importListView.default;

        $.getJSON(conf['data'])
          .done(function onDataLoaded(data) {

            ListView.DEV_MODE = !!document.getElementById('debug-container');

            var list = new ListView({ models: data });
            document.getElementById('example-list-container').appendChild(list.el);
            //list.trigger('attach');
            list.render();
          });
      });
    });

});
