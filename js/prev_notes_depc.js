_global.active = false
let state = {}

function addTextarea(e, _id, _content){
    let html = '<textarea class="notes_textarea" id="textarea-'+_id+'">'+ _content +'</textarea><div class="note_delete" id="del-'+_id+'">Delete</div>'
    e.innerHTML = html
}

function edit(e){
    e = e.target
    console.log(e)
    let cracker = e.id.split('-')[0]
    //console.log(e)
    if(_global.active && !state[parseInt(e.id)] && cracker !== 'textarea'){
        closeNotes()
        let content = e.innerHTML
        //let textBox = addTextarea(e.id, content)
        //e.innerHTML = textBox
        addTextarea(e, e.id, content)
        state[parseInt(e.id)] = true
    } else if(!_global.active) {
        alert('aTry again!')
    }
}

function closeNotes(){
    let notes = $('.note','all')
    for(let i=0;i<notes.length;i++){
        if(state[parseInt(notes[i].id)] && _global.active){
            _global.active = false
            xhrRequest('/updateNote?note='+JSON.stringify({id:parseInt(notes[i].id), text:$('#textarea-'+notes[i].id).value}), (response) => {
                _global.active = true
                if(response === 'OK'){
                    notes[i].innerHTML = $('#textarea-'+notes[i].id).value
                    state[parseInt(notes[i].id)] = false
                } else {
                    alert('Error! Try again!')
                }
            })
        }
    }
}

xhrRequest('/getNotes', (data) => {
    let json = JSON.parse(data)
    for(let i in json.notes){
        $('#notes').innerHTML += "<div class='note' id='"+json.notes[i].id+"'>"+json.notes[i].text+"</div>"
        state[json.notes[i].id] = false
    }
    
    _global.active = true
    $forEach('.note', function(e){
        e.addEventListener('click', edit)
    })
})

$().addEventListener('click', function(e){
    let name = e.target.id.split('-')[0]
    let _id = e.target.id.split('-')[1]
    if(name == 'del'){
        _global.active = false
        xhrRequest('/deleteNote?id='+_id, (response) => {
            _global.active = true
            if(response === 'OK'){
                $('#notes').removeChild($('#'+_id))
            } else {
                alert('Error! Try again!')
            }
        })
    } else if(!e.target.classList.contains('note') && name != 'textarea' ){
        closeNotes()
    }
})

$('#create').addEventListener('click', function(){
    closeNotes()
    _global.active = false
    xhrRequest('/addNote', (_id) =>{
        _global.active = true
        console.log(_id)
        if(_id !== 'err'){
            let note = document.createElement('div')
            note.classList.add('note')
            note.id = _id
            state[_id] = true
            addTextarea(note , note.id, '...')
            note.addEventListener('click', edit)
            $('#notes').appendChild(note)
        } else {
            alert('Error! Try again!')
        }
    })
})