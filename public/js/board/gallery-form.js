$('form[name="galleryForm"]').submit(onFormSubmit);
function onFormSubmit(e) {
  e.preventDefault();
  var f = this;
  var titleEl = f.title;
  var writerEl = f.writer;
  var contentEl = f.content;
  var title = titleEl.value.trim();
  var writer = writerEl.value.trim();
  var content = contentEl.value.trim();

  if (title === '') {
    alert('제목은 필수 사항입니다.');
    titleEl.focus();
    return false;
  }
  if (writer === '') {
    alert('작성자는은 필수 사항입니다.');
    writerEl.focus();
    return false;
  }
  if (content === '') {
    alert('내용은 필수 사항입니다.');
    contentEl.focus();
    return false;
  }
  f.submit;
}
