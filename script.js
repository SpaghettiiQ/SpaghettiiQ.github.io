const addBtn = document.getElementById('addBtn')
var addBtnHold = false

addBtn.addEventListener('mousedown', function() {
	addBtn.classList.add('pop');
	addBtnHold = true;
})

addBtn.addEventListener('click', function() {
	addBtn.classList.add('pop');
	addBtnHold = false;
	setTimeout(function() {
		addBtn.classList.remove('pop');
		}, 100)
})

addBtn.addEventListener('mouseleave', function() {
	if (addBtnHold) {
		addBtn.classList.remove('pop');
	}
})

window.addEventListener('mouseup', function() {
	addBtn.classList.remove('pop');
})