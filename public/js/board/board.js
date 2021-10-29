$('.board-container.list-page.gallery-type .list').click(onBoardListClick);
function onBoardListClick() {
  console.log('hi');
   location.href = $(this).data('link') + '?boardType=gallery'
}
