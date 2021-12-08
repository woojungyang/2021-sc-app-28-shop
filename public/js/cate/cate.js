var core = {};
var plugins = ['contextmenu', 'dnd', 'search', 'state', 'wholerow', 'types'];

var types = {
  default: {
    max_depth: 2,
  },
};

core.themes = {
  variant: 'large',
  striped: true,
};

core.check_callback = true;

core.data = {
  url: function (node) {
    return '/api/tree';
  },
  data: function (node) {
    return { id: node.id };
  },
};

function onCreateTree(e, data) {
  let parents = data.node.parents;
  parents.pop();
  axios
    .post('/api/tree', {
      id: data.node.id,
      name: data.node.text,
      parents: parents.join(','),
    })
    .then(onUpdateTree)
    .catch(function (err) {
      console.log(err);
    });
}

function onDeleteTree(e, data) {
  axios
    .delete('/api/tree', { data: { id: data.node.id } })
    .then(onUpdateTree)
    .catch(function (err) {
      console.log(err);
    });
}

// json 교체 - 공통모듈
function onUpdateTree() {
  axios
    .put('/api/tree', { node: $('#jstreeWrap').jstree().get_json('#') })
    .then(function (r) {
      $('#jstreeWrap').jstree().refresh();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function onChangeTree(e, data) {
  // DB 교체
  data.node.state.selected = false;
  axios
    .put('/api/tree/' + data.node.id, { data: data.node })
    .then(onUpdateTree)
    .catch(function (err) {
      console.log(err);
    });
}

$('#jstreeWrap')
  .jstree({ core: core, plugins: plugins, types })
  .on('create_node.jstree', onCreateTree)
  .on('rename_node.jstree', onChangeTree)
  .on('move_node.jstree', onChangeTree)
  .on('delete_node.jstree', onDeleteTree);
