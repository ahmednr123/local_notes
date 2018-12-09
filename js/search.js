//let autocomplete = $('#angel');

search.addEventListener('keyup', (e) => {

    if (search.value.length == 0 || search.value.trim().length == 0) return

    let tags = autocomplete.innerHTML.split(' ') //.trim().split(' ')
    let possible_notes_json = {}
    let possible_notes = []

    let largest = 0

    for(let i = 0; i < tags.length; i++){
        for(let j = 0; j < _global.tags.length; j++){
            let tag_name = _global.tags[j]
            console.log(tag_name)
            if(tags[i] == tag_name){
                let notes = JSON.parse(window.localStorage.getItem('tag:'+tags[i]))
                if(notes == null)
                    notes = JSON.parse(window.localStorage.getItem('tag:_'+tags[i]))
                console.log('FROM SEARCH: '+typeof(notes))
                console.log('FROM SEARCH: '+notes)
                notes.map((note_id) => {
                    console.log('FROM INSIDE SEARCH: '+notes)
                    if(!possible_notes_json[note_id])
                        possible_notes_json[note_id] = 0
                    
                    possible_notes_json[note_id]++

                    if(largest < possible_notes_json[note_id]) 
                        largest = possible_notes_json[note_id]
                    
                    possible_notes.add(note_id)
                })
            }
        }
    }

    let start = _global.last_note
    let go_on = true
    let iter = 0
    $forEach('.date_element', (el) => {
        el.style.display = 'none'
    })
    while(go_on) {
        displayNotes(start, 1, FROM_LAST)
        if(possible_notes.indexOf(start) !== -1 && (possible_notes_json[start] == largest)){
            console.log(start)
            $('#'+start).style.display = 'block'
            $('#'+_global.notes[start].date).style.display = 'block'
        } else if (_global.notes[start]) {
            $('#'+start).style.display = 'none'
        }

        start = JSON.parse(window.localStorage.getItem('note:'+start+':meta')).prevNote
        
        if(start == 'x' || iter++ >= MAX_SEARCH) 
            go_on = false
    }
})