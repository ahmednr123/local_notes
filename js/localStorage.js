/*
	NOTES STRUCTURE 
	=====================================
	[ID]:{heading, body, tags}


	ID STRUCTURE 
	=====================================
	note - bnote:[id] - {note}
    note meta - bnote:[id]:meta - {prevNote, nextNote}
    global meta - bnote:meta - {beginingNote, lastNote, baseID}
*/

function saveNote(id, note) {
    /*if (!window.localStorage.getItem(id)) {
        let meta = parseMetaData();
        meta.prevNote = JSON.parse(_global._meta).nextNote;
        meta.nextNote = 'x';

        let p_meta = window.localStorage.getItem('bnote:' + meta.prevNote + ':meta')

        p_meta.nextNote = id;

        window.localStorage.setItem('bnote:' + meta.prevNote + ':meta', JSON.stringify(p_meta))
        window.localStorage.setItem('bnote:' + id + ':meta', JSON.stringify(meta))
        window.localStorage.setItem('bnote:' + id, JSON.stringify(note))
        return
    }*/

    _global.notes[id] = note;
    //window.localStorage.setItem(id, JSON.stringify(note))
}

function getNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem('bnote:' + id))
        return -1

    if (_global.notes[id]) return _global.notes[id];

    return JSON.parse(window.localStorage.getItem(id))
}

function delNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem(id))
        return -1

    let meta = JSON.parse(window.localStorage.getItem('bnote:' + id + ':meta'))
    let p_meta = JSON.parse(window.localStorage.getItem('bnote:' + meta.prevNote + ':meta'))
    let n_meta = JSON.parse(window.localStorage.getItem('bnote:' + meta.nextNote + ':meta'))

    p_meta.nextNote = meta.nextNote;
    n_meta.prevNote = meta.prevNote;

    window.localStorage.setItem('bnote:' + meta.prevNote + ':meta', JSON.stringify(p_meta))
    window.localStorage.setItem('bnote:' + meta.nextNote + ':meta', JSON.stringify(n_meta))

    window.localStorage.removeItem('bnote:' + id + ':meta')
    window.localStorage.removeItem('bnote:' + id)
}

function delNotes() {
    window.localStorage.clear()
}

function displayNotes(from, no_notes) {

    if(typeof(from) == 'number') from = toString(from);

    let stop = false;
    let note_id = from;
    let note = window.localStorage.getItem('bnote:' + note_id);

    let inc = 0;

    if(!note) return -1;

    while(1){
        let note_elm = rawNote(note, note_id);

        let note_wrapper = $('#notes');
        list.insertBefore(note_elm, note_wrapper.childNodes[0]);
        note_id = parseMetaData(window.localStorage.getItem('bnote:' + note_id + ':meta')).nextNote;
        
        if(note_id != 'x')
            note = window.localStorage.getItem('bnote:' + note_id);
        else
            return;
    
        if(++inc > no_notes)
            return;
    }
    
}