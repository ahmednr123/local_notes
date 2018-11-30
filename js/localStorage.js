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

    if (!window.localStorage.getItem('note:'+id)) {
        let meta = {
            prevNote: 'x',
            nextNote: 'x'
        };
        
        let now = new noteDate()
        note.date = now.getString()

        _global.notes[id] = {}
        _global.notes[id].date = note.date

        meta.prevNote = JSON.parse(window.localStorage.getItem('note:meta')).lNote;

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

    _global.notes[id].heading = note.heading;
    _global.notes[id].body = note.body;
    _global.notes[id].tags = note.tags;
    note.date = _global.notes[id].date

    console.log(JSON.stringify(note))

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

    let note_id = from;
    let note = JSON.parse(window.localStorage.getItem('note:' + note_id));

    let inc = 0;

    if (!note || $('#'+note_id)) return -1;

    while (1) {
        _global.notes[note_id] = note;

        let note_elm = rawNote(note, note_id);

        let note_wrapper = $('#notes');

        if(_global.last_date != note.date){
            let new_date = dateElement(note.date)
            new_date.setAttribute('notes', 1)
            //note_wrapper.insertBefore(new_date, note_wrapper.childNodes[0])
            note_wrapper.append(new_date)
            _global.last_date = note.date
        } else {
            let date_elem = $('#'+note.date)
            let notes = parseInt(date_elem.getAttribute('notes'))
            date_elem.setAttribute('notes', ++notes)
        }

        //note_wrapper.insertBefore(note_elm, note_wrapper.childNodes[0]);
        note_wrapper.append(note_elm)
        noteListener(note_elm);

        if (iterator == FROM_BEGINNING)
            note_id = JSON.parse(window.localStorage.getItem('note:' + note_id + ':meta')).nextNote;
        else if (iterator == FROM_LAST )
            note_id = JSON.parse(window.localStorage.getItem('note:' + note_id + ':meta')).prevNote;

        if (note_id == 'x') return;

        note = JSON.parse(window.localStorage.getItem('note:' + note_id));
        _global.curr_base_id = note_id;

        if (++inc > no_notes)
            return;
    }

}