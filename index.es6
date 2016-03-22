
function createString() {
  const count = 30;
  return Array(count+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, count);
}
const view = new BufferedListView();
view.models = new Array(3200);
for (let index = 0; index < view.models.length; index++) {
  view.models[index] = { id: _.uniqueId(), content: String(index) };
}
$('#c1').append(view.el);

view.render();
