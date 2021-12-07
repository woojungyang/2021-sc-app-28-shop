function onColorChange(el) {
  changeColor($(el).val(), el);
}

function onColorReset(el) {
  var color = $(el.form.defaultColor).val();
  var name = $(el.form.defaultName).val();
  changeColor(color, el);
  $(el.form.code).val(color);
  $(el.form.name).val(name);
}

function changeColor(color, el) {
  $(el.form).find('.color-wrap .circle').css('background-color', color);
  $(el.form).find('.color-wrap .hexa-code').css('color', color);
  $(el.form).find('.color-wrap .hexa-code').text(color);
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

$(document).ready(function () {
  $('.bt-reset').trigger('click');
});
