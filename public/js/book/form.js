document.saveForm.addEventListener('submit', onSubmit);
function onSubmit(e) {
	e.preventDefault();
	var title = this.title.value.trim();
	var writer = this.writer.value.trim();
	var content = this.content.value.trim();
	if(!title) {
		alert('도서명을 입력하세요.');
		this.title.focus();
		return false;
	}
	this.submit();
}

// 	/언어/book/		www.myshop.co.kr		:3000
// 	/book/ 				api.myshop.co.kr		:3001
// 	/							admin.myshop.co.kr	:3002

if(document.querySelector('#btRemoveCover')) 
	document.querySelector('#btRemoveCover').addEventListener('click', onRemoveFile);
if(document.querySelector('#btRemoveFile'))
	document.querySelector('#btRemoveFile').addEventListener('click', onRemoveFile);

function onRemoveFile(e) {
	if(confirm('파일을 삭제하시겠습니까?\n삭제하신 파일은 되돌릴 수 없습니다.')) {
		var idx = this.dataset['idx'];
		var parent = this.parentNode;
		axios.delete('/api/book/file/'+idx).then(onSucess).catch(onError);
	}
	function onSucess(r) {
		if(r.data.code == 200) parent.remove();
	}
	function onError(err) {
		console.log(err);
		console.log(err.response);
	}
}