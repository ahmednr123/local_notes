/* 
    UX FUNCTIONALITY
    =====================================================
    Note remains in html format until when its edited, 
    then the html is converted to textarea.
    
    The Note is divided into three parts: heading, body
    and tags. The heading is formatted in yellow color
    with bold font. The body remains white, and the tags
    are blue.
    
    The heading is a seperate textarea, including each 
    individual parahs of the body. Everytime the user 
    hits enter a new textarea must be created and if the
    textarea is empty and the user hits backspace the
    textarea is deleted and the focus move to the previous
    textarea.
    
    The tags are updated only if the user uses a "#" in
    the body. Tags section cannot be edited by the user.
    
    Functions:
    Double click - edit note
    ====================================================
*/

let _global = {notes:[]}

_global.notes = {"a01":{heading: "Hello this is a note!", body: ["Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out."], tags: ["illusion"]}};

function make_editable (id) {
    let note = _global.notes['a01']
    let note_html = $('#'+id).childNodes[1];
    let html = '';
    
    html += '<textarea class="note_head_textarea" note="'+id+'">'+note.heading+'</textarea>'
    
    for(let parah of note.body)
        html += '<textarea class="note_parah_textarea" note="'+id+'">'+parah+'</textarea>'
        
    note_html.innerHTML = html;
    
    $forEach('textarea', (el) => {
        el.style.height = '1px'
        el.style.height = (el.scrollHeight) + 'px';
    })
    
    _global.focused_note = id;
    $('#'+id).focus();
}

function make_html (id, note) {
    let _note = _global.notes['a01']
    let note_html = $('#'+id).childNodes[1];
    let html = '';
    
    _note.heading = note.heading;
    _note.body = note.body;
    _note.tags = note.tags;
    
    html += '<span class="note_head" note="'+id+'">'+note.heading+'</span>';
    
    for(let parah of note.body)
        html += '<span class="note_parah" note="'+id+'">'+parah+'</span>';
        
    note_html.innerHTML = html;
    _global.focused_note = '';
}

_global.focused_note = '';

document.addEventListener('click', (el) => {
    if(el.target.hasAttribute('note') && _global.focused_note != el.target.getAttribute('note'))
        make_editable(el.target.getAttribute('note'));
})

$forEach('.note', (el) => {
    el.addEventListener('focusout', () => {
        let id = el.id;
        console.log('[focusout] ID: '+id)
        let textareas = el.childNodes[1].childNodes;
        
        let note = {heading:'', body:[], tags:[]}
        
        note.heading = textareas[0].innerHTML;
        
        if(textareas.length > 1){
            for(let i = 1; i < textareas.length; i++){
                note['body'].push(textareas[i].innerHTML)
            }
        }
        
        let tags = el.getElementsByClassName('note_tags')[0].innerHTML;
        tags = tags.split();
        tags = tags.map((tag) => tag.slice(1, tag.length));
        note.tags = tags;
        
        make_html(id, note);
    });
})

// Notes structure: [ID]:{heading, body, tags}
// ID structure: bnote:[id]
// Local storage

function saveNote (id, heading, body, tags) {
	if(!window.localStorage.getItem(id)){
		let note = {heading, body, tags}
		window.localStorage.setItem(id, JSON.stringify(note))
		return
	}

	let noteJson = JSON.parse(window.localStorage.getItem(id))
	noteJson.heading = heading
	noteJson.body = body
	noteJson.tags = tags

	window.localStorage.setItem(id, JSON.stringify(noteJson))
}

function getNote (id) {
	if(!window.localStorage.getItem(id))
		return -1

	return JSON.parse(window.localStorage.getItem(id))
}

function delNote (id) {
	if(!window.localStorage.getItem(id))
		return -1

	window.localStorage.removeItem(id)
}

function delNotes () {
	window.localStorage.clear()
}

function getNotes (from, to) {

}
