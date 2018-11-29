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

function saveNote(id, note, locally) {
    locally = locally?true:false;

    console.log("SaveNote: note.heading: "+note.heading)
    if (!window.localStorage.getItem('note:'+id)) {
        let meta = {
            prevNote: 'x',
            nextNote: 'x'
        };

        meta.prevNote = JSON.parse(window.localStorage.getItem('note:meta')).lNote;

        console.log("prev: "+meta.prevNote+', current: '+id)

        let p_meta = JSON.parse(window.localStorage.getItem('note:' + meta.prevNote + ':meta'));

        p_meta.nextNote = id;

        window.localStorage.setItem('note:' + meta.prevNote + ':meta', JSON.stringify(p_meta))
        window.localStorage.setItem('note:' + id + ':meta', JSON.stringify(meta))
        window.localStorage.setItem('note:' + id, JSON.stringify(note))

        changeMeta({
            lNote:id
        })

        _global.last_note = id;

        return
    }

    _global.notes[id] = note;

    if(!locally)
        window.localStorage.setItem('note:'+id, JSON.stringify(note))
}

function getNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem('note:' + id))
        return -1

    if (_global.notes[id]) return _global.notes[id];

    return JSON.parse(window.localStorage.getItem(id))
}

function delNote(id) {
    if (!_global.notes[id] && !window.localStorage.getItem(id))
        return -1

    let p_meta = 'x';
    let n_meta = 'x';

    let meta = JSON.parse(window.localStorage.getItem('note:' + id + ':meta'))

    if (meta.prevNote == 'x' && meta.nextNote == 'x') {
        delNotes();
        return;
    }

    if (meta.prevNote != 'x')
        p_meta = JSON.parse(window.localStorage.getItem('note:' + meta.prevNote + ':meta'))

    if (meta.nextNote != 'x')
        n_meta = JSON.parse(window.localStorage.getItem('note:' + meta.nextNote + ':meta'))

    p_meta.nextNote = meta.nextNote;
    n_meta.prevNote = meta.prevNote;

    if (meta.prevNote != 'x')
        window.localStorage.setItem('note:' + meta.prevNote + ':meta', JSON.stringify(p_meta))

    if (meta.nextNote != 'x')
        window.localStorage.setItem('note:' + meta.nextNote + ':meta', JSON.stringify(n_meta))

    if (id == _global.last_note) {
        _global.last_note = meta.prevNote;
        changeMeta({
            lNote: _global.last_note
        });
    }

    if (id == _global.first_note) {
        _global.first_note = meta.nextNote;
        changeMeta({
            fNote: _global.first_note
        });
    }

    window.localStorage.removeItem('note:' + id + ':meta')
    window.localStorage.removeItem('note:' + id)
}

function delNotes() {
    window.localStorage.clear()
}

function displayNotes(from, no_notes, iterator) {

    //if (typeof(from) == 'number') from = toString(from);

    let note_id = from;
    let note = JSON.parse(window.localStorage.getItem('note:' + note_id));

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
            note_id = JSON.parse(window.localStorage.getItem('note:' + note_id + ':meta')).nextNote;
        else if (iterator == FROM_BEGINNING)
            note_id = JSON.parse(window.localStorage.getItem('note:' + note_id + ':meta')).prevNote;

        if (note_id == 'x') return;

        note = JSON.parse(window.localStorage.getItem('note:' + note_id));
        _global.curr_base_id = note_id;

        if (++inc > no_notes)
            return;
    }

}