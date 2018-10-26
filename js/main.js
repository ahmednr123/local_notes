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

_global.notes = {
    "a01": {
        heading: "Hello this is a note!",
        body: ["Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle. By the same illusion which lifts the horizon of the sea to the level of the spectator on a hillside, the sable cloud beneath was dished out."],
        tags: ["illusion"]
    },
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

        if (el.value.length > 1 && e.keyCode == 13) {
            let id = el.getAttribute('note');
            let text = splitTextarea(el);
            new_textarea(id, el, text);

            el.style.height = '1px'
            el.style.height = (el.scrollHeight) + 'px';

            e.preventDefault();
        } else if (el.selectionStart == 0 && e.keyCode == 8) {

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
        }

    })
    el.addEventListener('keyup', (e) => {
        //=======saveNote()========//
        let textareas = el.parentNode.getElementsByTagName('textarea');
        let note_id = el.getAttribute('note'); // BUILD A FUNCTION TO RETRIEVE CURRENT NOTE ID
        _global.notes[note_id].body = [];
        _global.notes[note_id].heading = textareas[0].value;
        for (let i = 1; i < textareas.length; i++) {
            _global.notes[note_id].body.push(textareas[i].value);
        }
        // UPDATE saveNote() AND USE THAT INSTEAD
        //=========================//
        updateTags(el.getAttribute('note'))
        el.style.height = '1px'
        el.style.height = (el.scrollHeight) + 'px';
    })
}

function createNote() {
    let note_id = "a03" // Setup _global meta data for notes and extract next ID
    let note_elm = document.createElement('div');
    note_elm.setAttribute('class', 'note');
    note_elm.setAttribute('id', note_id);
    note_elm.innerHTML = "<div class='content' note='" + note_id + "'></div>"

    // Heading textarea (Change the newTextarea() function
    let textareaNode = document.createElement("textarea");
    textareaNode.setAttribute("class", "note_head_textarea");
    textareaNode.setAttribute("spellcheck", "false");
    textareaNode.setAttribute("note", note_id);
    textareaNode.setAttribute("tabindex", "-1");

    let newTextarea = note_elm.getElementsByClassName('content')[0].appendChild(textareaNode);
    // ==================== //
        
    _global.notes[note_id] = newNote();

    $('#notes').insertBefore(note_elm, $('#notes').childNodes[0]);
    //autoadjust(note_elm);
    noteListener(note_elm);
    
    // newTextarea
    tunnel(() => {
        newTextarea.style.height = '17px';
        _global.focused_note = note_id;
        newTextarea.focus();
    });

    autoadjust(newTextarea);
    // ============ 

    return note_elm;
}

// CLEAN UP
function updateTags(note_id) {
    let arr = getHashtags();
    
    if(arr.length > 0){
        if(!$('#'+note_id).getElementsByClassName('note_tags')[0]){
            let tag_elem = document.createElement('span');
            tag_elem.setAttribute('class', 'note_tags');
            tag_elem.setAttribute('note', note_id);
            $('#'+note_id).appendChild(tag_elem);
        }
    } else {
        if($('#'+note_id).getElementsByClassName('note_tags')[0])
            $('#'+note_id).getElementsByClassName('note_tags')[0].remove();
        return;
    }
    
    let tag_element = $('#' + note_id).getElementsByClassName('note_tags')[0];
    _global.notes[note_id].tags = arr;
    tag_element.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        let tag = arr[i];
        tag_element.innerHTML += '<span class="hashtag" note="' + note_id + '" >' + tag + '</span>';
    }
}

function getHashtags() {
    let note_id = _global.focused_note;
    let content = [_global.notes[note_id].heading];
    content = content.concat(_global.notes[note_id].body);

    let arr = [];
    let buffer = '';
    let hash = false;

    for (let text of content) {
        for (let i = 0; i <= text.length; i++) {
            if (text[i] == '#') {
                hash = true;
                continue;
            }
            if (hash) {
                if (!/^[a-z0-9]+$/i.test(text[i]) || i == text.length) {
                    arr.push(buffer);
                    buffer = '';
                    hash = false;
                } else {
                    buffer += text[i];
                }
            }
        }
    }

    return arr;
}

function make_editable(id) {
    let note = _global.notes[id]
    let note_html = $('#'+id).getElementsByClassName('content')[0];
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
    let note_html = $('#' + id).getElementsByClassName('content')[0];
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

$('#new_note').addEventListener('click', () => {
    createNote();
});

document.addEventListener('dblclick', (el) => {
    if (el.target.hasAttribute('note') && _global.focused_note != el.target.getAttribute('note')){
        console.log('pita');
        make_editable(el.target.getAttribute('note'));
    }
})

function noteListener(el) {
    el.addEventListener('focusout', () => {
        if (_global.active) {
            let id = el.id;
            console.log('[focusout] ID: ' + id)
            let textareas = el.getElementsByClassName('content')[0].getElementsByTagName('textarea');

            let note = newNote();

            note.heading = textareas[0].value;

            if (textareas.length > 1) {
                for (let i = 1; i < textareas.length; i++) {
                    note['body'].push(textareas[i].value)
                }
            }

            if(el.getElementsByClassName('note_tags')[0]){
                let tags = el.getElementsByClassName('note_tags')[0].innerHTML;
                tags = tags.split();
                tags = tags.map((tag) => tag.slice(1, tag.length));
                note.tags = tags;
            }

            el.style.border = "1px solid #393f50";

            make_html(id, note);
        }
    });
}

$forEach('.note', (el) => {
    noteListener(el)
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