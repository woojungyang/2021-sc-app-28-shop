function onColorChange(el) {
  changeColor($(el).val(), el);
}

function onColorReset(el) {
  var color = $(el.form.defaultColor).val();
  var name = $(el.form.defaultName).val();
  changeColor(color, el);
  $(el.form.color).val(color);
  $(el.form.name).val(name);
  $(el.form).find('.tag').text(name);
}

function onTxtChange(el) {
  var txt = el.value;
  $(el.form).find('.tag').text(txt);
}

function changeColor(color, el) {
  var hslColor = hexToHSL(color);
  var txtColor = hslColor.l > 0.5 ? '#000000' : '#ffffff';
  $(el.form).find('.tag').css('background-color', color);
  $(el.form).find('.tag').css('color', txtColor);
}

function onSubmit(el) {
  var f = el.form;
  if (f.name.value.trim() === '') {
    alert('컬러명을 입력하세요.');
    f.name.focus();
    return false;
  }
  f.submit();
}

function onColorDelete(el) {
  var f = el.form;
  if (confirm('삭제하시겠습니까?')) {
    f._method.value = 'DELETE';
    f.submit();
  }
}

$(document).ready(function () {
  $('.bt-reset').trigger('click');
});
