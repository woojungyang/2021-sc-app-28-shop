function onColorChange(el) {
  changeColor($(el).val(), el);
}

function onColorReset(el) {
  var color = $(el.form.defaultColor).val();
  changeColor(color, el);
  $(el.form.code).val(color);
  $(el.form.name).val('');
}

function changeColor(color, el) {
  var color = $(el).val();
  $(el.form).find('.color-wrap.circle').css('background-color', color);
  $(el.form).find('.color-wrap.hexa-code').css('color', color);
  $(el.form).find('.color-wrap.hexa-code').text(color);
}
