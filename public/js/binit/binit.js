$('form[name="binitForm"]').submit(onInitBoard);
$('.binit-Update-form').submit(onInitBoard);

function onInitBoard(e) {
  e.preventDefault();
  console.log(this);
  var f = this;
  var title = f.title;
  var titleValue = title.value.trim();
  if (titleValue === '') {
    alert('제목은 필수 사항입니다.');
    title.focus();
    return false;
  }
  f.submit();
}

function onChangeBoard(_method, el) {
  el.form._method.value = _method;
  el.form.submit();
}
