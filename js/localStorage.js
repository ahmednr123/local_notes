/*
	NOTES STRUCTURE 
	=====================================
	[ID]:{heading, body, tags}


	ID STRUCTURE 
	=====================================
	bnote:[id]
*/

function saveNote(id, note) {
    if (!window.localStorage.getItem(id)) {

        window.localStorage.setItem('bnote:' + id + ':meta', )
        window.localStorage.setItem('bnote:' + id, JSON.stringify(note))
        return
    }

    _global.notes[id] = note;
    window.localStorage.setItem(id, JSON.stringify(note))
}

function getNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem(id))
        return -1

    return JSON.parse(window.localStorage.getItem(id))
}

function delNote(id) {
    if (!window.localStorage.getItem(id))
        return -1

    window.localStorage.removeItem(id)
}

function delNotes() {
    window.localStorage.clear()
}

function getNotes(from, to) {

}