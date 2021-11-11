var core = {};
var plugins = ['contextmenu', 'dnd', 'search', 'state', 'wholerow', 'changed', 'types'];

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

function onChangedTree(e, data) {
  console.log(data.node.id);
}

function onCreateTree(e, data) {
  axios
    .post('/api/tree', { id: data.node.id })
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

function onUpdateTree() {
  axios
    .put('/api/tree', { node: $('#jstreeWrap').jstree(true).get_json('#') })
    .then(function (r) {
      $('#jstreeWrap').jstree().refresh();
    })
    .catch(function (err) {
      console.log(err);
    });
}

$('#jstreeWrap')
  .jstree({ core: core, plugins: plugins, types })
  .on('create_node.jstree', onCreateTree)
  .on('rename_node.jstree', onUpdateTree)
  .on('move_node.jstree', onUpdateTree)
  .on('delete_node.jstree', onDeleteTree);
