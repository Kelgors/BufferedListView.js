require([ 'jquery' ], function (jQuery) {
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

      require([ constructorName ], function (importListView) {
        var ListView = importListView.default;

        $.getJSON(conf['data'])
          .done(function onDataLoaded(data) {

            ListView.DEV_MODE = !!document.getElementById('debug-container');

            var list = new ListView({ models: data });
            list.attachTo(document.getElementById('example-list-container'));
            //list.trigger('attach');
            list.render();
          });
      });
    });

});
