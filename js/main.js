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

let _global = {}

_global.active = true;
_global.focused_note = '';

_global.tag_buff = '';
_global.tag_writer = false;

_global.notes = {
    "a01": {
        heading: "Hello this is a note!",
        body: ["Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out."],
        tags: ["illusion"]
    }
};

function newNote() {
    return {
        heading: "",
        body: [],
        tags: []
    }
}

// To avoid focusout trigger
function tunnel(func) {
    _global.active = false;
    func();
    _global.active = true;
}

function insertAfter(newNode, referenceNode) {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function new_textarea(id, target, text) {
    let textareaNode = document.createElement("textarea");
    textareaNode.setAttribute("class", "note_parah_textarea");
    textareaNode.setAttribute("spellcheck", "false");
    textareaNode.setAttribute("note", id);
    textareaNode.setAttribute("tabindex", "-1");

    let newTextarea = insertAfter(textareaNode, target);
    newTextarea.value = text;
    newTextarea.setSelectionRange(0, 0);

    tunnel(() => {
        newTextarea.style.height = '17px';
        newTextarea.style.height = (newTextarea.scrollHeight) + 'px';
        newTextarea.focus();
    });

    autoadjust(newTextarea);
}

function autoadjust(el) {
    el.addEventListener('keydown', (e) => {
        //====TAG handler====//
        if (e.key == '#')
            _global.tag_writer = true;
        //==================//

        if (el.value.length > 1 && e.keyCode == 13) {
            let id = el.getAttribute('note');
            let text = splitTextarea(el);
            new_textarea(id, el, text);

            el.style.height = '1px'
            el.style.height = (el.scrollHeight) + 'px';

            e.preventDefault();
        } else if (el.selectionStart == 0 && e.keyCode == 8) {
            //====TAG handler====//
            if (_global.tag_buff.length > 0)
                _global.tag_buff = _global.tag_buff.substring(0, _global.tag_buff.length - 1);
            //==================//

            let text = el.value;
            tunnel(() => {
                e.preventDefault();
                let pointer = el.previousSibling.value.length;
                el.previousSibling.value += text;

                el.previousSibling.style.height = (el.previousSibling.scrollHeight) + 'px';

                el.previousSibling.focus();
                el.previousSibling.setSelectionRange(pointer, pointer);
                el.remove();
            });
        } else {
            //====TAG handler====//

            if (_global.tag_writer) {
                _global.tag_buff += e.key;

                if (e.keyCode == 32 || e.keyCode == 13) {
                    _global.tag_writer = false;
                    _global.notes[_global.focused_note].tags.push(_global.tag_buff);
                    console.log(_global.tag_buff);
                }
            }

            //===================//
        }

    })
    el.addEventListener('keyup', (e) => {
        el.style.height = '1px'
        el.style.height = (el.scrollHeight) + 'px';
    })
}

function make_editable(id) {
    let note = _global.notes[id]
    let note_html = $('#' + id).childNodes[1];
    let html = '';

    html += '<textarea class="note_head_textarea" spellcheck="false" tabindex="-1" note="' + id + '">' + note.heading + '</textarea>'

    for (let parah of note.body)
        html += '<textarea class="note_parah_textarea" spellcheck="false" tabindex="-1" note="' + id + '">' + parah + '</textarea>'

    note_html.innerHTML = html;

    $forEach('textarea', (el) => {
        el.style.height = '1px'
        el.style.height = (el.scrollHeight) + 'px';
    })

    _global.focused_note = id;
    $('#' + id).style.border = "1px solid #f2c94e";

    $forEach('textarea', (el) => {
        autoadjust(el);
    })
}

function make_html(id, note) {
    let _note = _global.notes[id]
    let note_html = $('#' + id).childNodes[1];
    let html = '';

    _note.heading = note.heading;
    _note.body = note.body;
    _note.tags = note.tags;

    html += '<span class="note_head" note="' + id + '">' + note.heading + '</span>';

    for (let parah of note.body)
        html += '<span class="note_parah" note="' + id + '">' + parah + '</span>';

    note_html.innerHTML = html;
    _global.focused_note = '';
}

function splitTextarea(el) {
    let selection = {
        'start': el.selectionStart,
        'end': el.value.length
    }

    let substring = el.value.substring(selection.start, selection.end);
    el.value = el.value.substring(0, selection.start);

    return substring;
}

document.addEventListener('dblclick', (el) => {
    if (el.target.hasAttribute('note') && _global.focused_note != el.target.getAttribute('note'))
        make_editable(el.target.getAttribute('note'));
})

$forEach('.note', (el) => {
    el.addEventListener('focusout', () => {
        if (_global.active) {
            let id = el.id;
            console.log('[focusout] ID: ' + id)
            let textareas = el.childNodes[1].getElementsByTagName('textarea');

            let note = newNote();

            note.heading = textareas[0].value;

            if (textareas.length > 1) {
                for (let i = 1; i < textareas.length; i++) {
                    note['body'].push(textareas[i].value)
                }
            }

            let tags = el.getElementsByClassName('note_tags')[0].innerHTML;
            tags = tags.split();
            tags = tags.map((tag) => tag.slice(1, tag.length));
            note.tags = tags;

            el.style.border = "1px solid #393f50";

            make_html(id, note);
        }
    });
})


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
        window.localStorage.setItem(id, JSON.stringify(note))
        return
    }

    let noteJson = JSON.parse(window.localStorage.getItem(id))
    noteJson.heading = note.heading
    noteJson.body = note.body
    noteJson.tags = note.tags

    _global.notes[id]
    window.localStorage.setItem(id, JSON.stringify(noteJson))
}

function getNote(id) {
    if (!window.localStorage.getItem(id))
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