// jsTree
var allData = null;
var selData = [];
var core = {};
var plugins = ['wholerow', 'changed', 'checkbox'];

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
  .on('loaded.jstree', onLoadedTree)
  .on('changed.jstree', onChangeTree);

function onLoadedTree(e, data) {
  allData = data.instance._model.data;
  console.log(Object.entries(allData));
  Object.entries(allData).forEach(function (v) {
    v[1].state.selected = false;
  });
  $('#jstreeWrap').jstree('check_node', cateArr);
  onCloseModal();
}

function onChangeTree(e, data) {
  const selectedTree = [];
  for (var v of data.selected) {
    if (!allData[v].children.length) {
      selectedTree.push(v);
    }
  }
  selData = selectedTree;
}

$('.prd-wrapper .bt-modal-close').click(onCloseModal);
function onCloseModal() {
  $('.prd-wrapper .modal-wrapper').hide();
  var html = '';
  var title = '';
  var cate = [];
  for (var v of selData) {
    cate.push(v);
    title = '';
    for (let i = 0; i < allData[v].parents.length - 2; i++) {
      title += allData[allData[v].parents[i]].text + '/';
    }
    title += allData[v].text;
    html += '<div class="tree-data">' + title + '</div>';
    $('.prd-wrapper form[name="prdCreateForm"] input[name="cate"]').val(
      cate.join(',')
    );
  }
  $('.prd-wrapper .selected-tree').html(html);
}

$('.prd-wrapper .bt-cate').click(onClickCate);
function onClickCate() {
  $('.prd-wrapper .modal-wrapper').show();
}

/******************** quill ********************/
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

function onDeleteFile(id, el) {
  if (confirm('파일을 삭제하시겠습니까?\n삭제하신 파일은 되돌릴 수 없습니다.')) {
    axios
      .delete('/admin/api/file/' + id + '?modelName=ProductFile')
      .then(onSucess)
      .catch(onError);
  }
  function onSucess(r) {
    if (r.data.code == 200) {
      var html =
        '<div class="file-wrap"><input type="file" name="' +
        $(el).data('name') +
        '" class="form-control-file my-2" /></div>';
      $(el).parent().after(html);
      $(el).parent().remove();
    }
  }
  function onError(err) {
    console.log(err);
    if (err.response.data.msg) alert(err.response.data.msg);
  }
}
