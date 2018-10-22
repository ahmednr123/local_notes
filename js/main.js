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

_global.notes = [{}];

document.addEventListener('click', (el) => {
    let content = $('#'+el.target.getAttribute('note')).childNodes[1];
    content.innerHTML = '';
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
