/*_global.auto_active = true;

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
})*/

let autocomplete = $('#angel');
let search = $('#_search');

search.addEventListener('keyup', () => {
	if(search.value.length > 0 ) {
		let input = search.value;
    autocomplete.innerHTML = input;
    
    let regex = new RegExp('^' + input + '.*', 'i');
    
    for(let i = 0; i < _global.tags.length; i++){
    	if(_global.tags[i].match(regex)){
      	autocomplete.innerHTML += _global.tags[i].slice(input.length, _global.tags[i].length);
        break;
      }
    }
	}
})

search.addEventListener('keydown', (e) => {
	if(search.value.length <= 1 && e.keyCode == 8){
		autocomplete.innerHTML = '';
  }
})