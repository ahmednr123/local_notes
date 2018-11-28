_global.auto_active = true;

$('#_search').addEventListener('keyup', () => {
	if($('#_search').value.length > 0 && _global.auto_active){
		$('#angel').innerHTML = $('#_search').value;
		$('#angel').innerHTML += 'aaa';
	}
})

$('#_search').addEventListener('keydown', (e) => {
	if($('#_search').value.length <= 1 && e.keyCode == 8){
		$('#angel').innerHTML = '';
		_global.auto_active = false;
	} else {
		_global.auto_active = true;
	}
})