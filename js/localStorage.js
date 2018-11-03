/*
	NOTES STRUCTURE 
	=====================================
	[ID]:{heading, body, tags}


	ID STRUCTURE 
	=====================================
	bnote:[id]
*/

function saveNote(id, note) {
    /*if (!window.localStorage.getItem(id)) {
        let meta = parseMetaData();
        meta.prevNote = parseMetaData(_global._meta).nextNote;
        meta.nextNote = 'x';

        let p_meta = window.localStorage.getItem('bnote:' + meta.prevNote + ':meta')

        p_meta.nextNote = id;

        window.localStorage.setItem('bnote:' + meta.prevNote + ':meta', strMetaData(p_meta))
        window.localStorage.setItem('bnote:' + id + ':meta', strMetaData(meta))
        window.localStorage.setItem('bnote:' + id, JSON.stringify(note))
        return
    }*/

    _global.notes[id] = note;
    //window.localStorage.setItem(id, JSON.stringify(note))
}

function getNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem(id))
        return -1

    if (_global.notes[id]) return _global.notes[id];

    return JSON.parse(window.localStorage.getItem(id))
}

function delNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem(id))
        return -1

    let meta = parseMetaData(window.localStorage.getItem('bnote:' + id + ':meta'))
    let p_meta = parseMetaData(window.localStorage.getItem('bnote:' + meta.prevNote + ':meta'))
    let n_meta = parseMetaData(window.localStorage.getItem('bnote:' + meta.nextNote + ':meta'))

    p_meta.nextNote = meta.nextNote;
    n_meta.prevNote = meta.prevNote;

    window.localStorage.setItem('bnote:' + meta.prevNote + ':meta', strMetaData(p_meta))
    window.localStorage.setItem('bnote:' + meta.nextNote + ':meta', strMetaData(n_meta))

    window.localStorage.removeItem('bnote:' + id + ':meta')
    window.localStorage.removeItem('bnote:' + id)
}

function delNotes() {
    window.localStorage.clear()
}

function displayNotes(from, no_notes) {

}