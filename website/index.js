require([ 'jquery', 'bullet' ], function (jQuery, Bullet) {
  function addStyle(url) {
    console.log('addStyle', url);
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

      const constructorName = conf['ListConstructor'];

      require([ 'BufferedListView', constructorName ], function (importBufferedListView, importListView) {
        var BufferedListView = importBufferedListView.default;
        var ListView = importListView.default;

        BufferedListView.setEventManager(Bullet);

        $.getJSON(conf['data'])
          .done(function onDataLoaded(data) {
            var list = new ListView({ models: data });
            list.debugMode = !!document.getElementById('debug-container');
            list.attachTo(document.getElementById('example-list-container'));
            //list.trigger('attach');
            list.render();
          });
      });
    });

});
