let autocomplete = $('#angel');
let search = $('#_search');

search.addEventListener('keyup', () => {
	if(search.value.length > 0 ) {
		if (search.value.trim().length == 0) return
		let search_value = search.value.toLowerCase() //.trim()
		let input_arr = search_value.split(' ');
		let input = input_arr[input_arr.length - 1]
    autocomplete.innerHTML = search.value;
    
    let regex = new RegExp('^' + input + '.*', 'i');
    
    for(let i = 0; i < _global.tags.length; i++){
			let tag_name = _global.tags[i]
			//if(tag_name[0] == '_') tag_name = tag_name.slice(1)
    	if(tag_name.match(regex)){
      	autocomplete.innerHTML += tag_name.slice(input.length, tag_name.length);
        break;
      }
    }
	}
})

search.addEventListener('keydown', (e) => {
	if (e.keyCode == 39){
		search.value = autocomplete.innerHTML
	}
	if(search.value.length <= 1 && e.keyCode == 8){
		autocomplete.innerHTML = '';
  }
})

let i_got_lazy = setInterval(() => {
	if(search.value.length == 0){
		autocomplete.innerHTML = '';
		$forEach('.note', (el) => {
			el.style.display = 'block'
		})
		$forEach('.date_element', (el) => {
			el.style.display = 'block'
		})
	}
}, 200)