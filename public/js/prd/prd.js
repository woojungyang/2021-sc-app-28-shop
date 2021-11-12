//JSTREE
var allData = null;
var selData = [];
var core = {};
var plugins = ['wholerow', 'changed', 'checkbox'];

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

$('#jstreeWrap')
  .jstree({ core: core, plugins: plugins })
  .on('changed.jstree', onChangeTree)
  .on('loaded.jstree', onLoadedTree);

function onChangeTree(e, data) {
  var allData = $('#jstreeWrap').jstree()._model.data;
  const selectedTree = [];
  for (var v of data.selected) {
    if (!allData[v].children.length) selectedTree.push(v);
  }
  selData = selectedTree;
}

function onLoadedTree(e, data) {
  allData = data.instance._model.data;
}

$('.prd-wrapper .bt-modal-close').click(onCloseModal);
function onCloseModal() {
  $('.prd-wrapper .modal-wrapper').hide();
  var html = '';
  for (var v of selData) {
    html += '<div class="data">' + allData[v].text + '</div>';
  }
  $('.prd-wrapper .selected-tree').html(html);
}

$('.form-wrapper .bt-cate').click(onClickCate);
function onClickCate() {
  $('.prd-wrapper .modal-wrapper').show();
}

/************************ Quill *******************************/
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: 'snow',
});

$('form[name="prdCreateForm"]').submit(onSubmitPrdCreateForm);
function onSubmitPrdCreateForm(e) {
  e.preventDefault();
  var title = this.title.value.trim();
  if (title === '') {
    this.title.focus();
    return false;
  }
  this.content.value = quill.root.innerHTML;
  this.submit();
}
