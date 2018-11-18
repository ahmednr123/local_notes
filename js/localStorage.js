/*
	NOTES STRUCTURE 
	=====================================
	[ID]:{heading, body, tags}


	ID STRUCTURE 
	=====================================
	note - bnote:[id] - {note}
    note meta - bnote:[id]:meta - {prevNote, nextNote}
    global meta - bnote:meta - {fNote, lNote, baseId}
*/

function saveNote(id, note) {
    console.log("SaveNote: note.heading: "+note.heading)
    if (!window.localStorage.getItem('bnote:'+id)) {
        let meta = {
            prevNote: 'x',
            nextNote: 'x'
        };

        meta.prevNote = JSON.parse(window.localStorage.getItem('bnote:meta')).lNote;

        console.log("prev: "+meta.prevNote+', current: '+id)

        let p_meta = JSON.parse(window.localStorage.getItem('bnote:' + meta.prevNote + ':meta'));

        p_meta.nextNote = id;

        window.localStorage.setItem('bnote:' + meta.prevNote + ':meta', JSON.stringify(p_meta))
        window.localStorage.setItem('bnote:' + id + ':meta', JSON.stringify(meta))
        window.localStorage.setItem('bnote:' + id, JSON.stringify(note))

        changeMeta({
            lNote:id
        })

        _global.last_note = id;

        return
    }

    _global.notes[id] = note;
    window.localStorage.setItem('bnote:'+id, JSON.stringify(note))
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

    let p_meta = 'x';
    let n_meta = 'x';

    let meta = JSON.parse(window.localStorage.getItem('bnote:' + id + ':meta'))

    if (meta.prevNote == 'x' && meta.nextNote == 'x') {
        delNotes();
        return;
    }

    if (meta.prevNote != 'x')
        p_meta = JSON.parse(window.localStorage.getItem('bnote:' + meta.prevNote + ':meta'))

    if (meta.nextNote != 'x')
        n_meta = JSON.parse(window.localStorage.getItem('bnote:' + meta.nextNote + ':meta'))

    p_meta.nextNote = meta.nextNote;
    n_meta.prevNote = meta.prevNote;

    if (meta.prevNote != 'x')
        window.localStorage.setItem('bnote:' + meta.prevNote + ':meta', JSON.stringify(p_meta))

    if (meta.nextNote != 'x')
        window.localStorage.setItem('bnote:' + meta.nextNote + ':meta', JSON.stringify(n_meta))

    if (id == _global.last_id) {
        _global.last_id = meta.prevNote;
        changeMeta({
            lNote: _global.last_id
        });
    }

    window.localStorage.removeItem('bnote:' + id + ':meta')
    window.localStorage.removeItem('bnote:' + id)
}

function delNotes() {
    window.localStorage.clear()
}

function displayNotes(from, no_notes, iterator) {

    //if (typeof(from) == 'number') from = toString(from);

    let note_id = from;
    let note = JSON.parse(window.localStorage.getItem('bnote:' + note_id));

    let inc = 0;

    if (!note) return -1;

    while (1) {
        console.log("noteID: "+note_id+", note: "+note)
        _global.notes[note_id] = note;

        let note_elm = rawNote(note, note_id);

        let note_wrapper = $('#notes');

        note_wrapper.insertBefore(note_elm, note_wrapper.childNodes[0]);
        noteListener(note_elm);

        if (iterator == FROM_LAST)
            note_id = JSON.parse(window.localStorage.getItem('bnote:' + note_id + ':meta')).nextNote;
        else if (iterator == FROM_BEGINNING)
            note_id = JSON.parse(window.localStorage.getItem('bnote:' + note_id + ':meta')).prevNote;

        if (note_id == 'x') return;

        note = JSON.parse(window.localStorage.getItem('bnote:' + note_id));
        _global.curr_base_id = note_id;

        if (++inc > no_notes)
            return;
    }

}