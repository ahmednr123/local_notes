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


    ====================================================
    META DATA
   	====================================================
   	Used to traverse notes one after the other.
   	[prevNote:nextNote]
   	If prevNotes or nextNote is null it is given a value
   	of -1
*/

function new_textarea(id, target, text) {
    let textareaNode = document.createElement("textarea");
    textareaNode.setAttribute("class", "note_parah_textarea");
    textareaNode.setAttribute("spellcheck", "false");
    textareaNode.setAttribute("note", id);
    textareaNode.setAttribute("tabindex", "-1");

    insertAfter(textareaNode, target);
    textareaNode.value = text;
    textareaNode.setSelectionRange(0, 0);

    tunnel(() => {
        textareaNode.style.height = '17px';
        textareaNode.style.height = (textareaNode.scrollHeight) + 'px';
        textareaNode.focus();
    });

    noteListener(textareaNode);
}

function noteListener(el) {
    //updateTags(el.getAttribute('note'));
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
        // Making the first character uppercase doesnt work as expected!
        if (el.value.charAt(0) !== el.value.charAt(0).toUpperCase())
            el.value = el.value.charAt(0).toUpperCase() + el.value.slice(1, el.value.length);

        let textareas = el.parentNode.getElementsByTagName('textarea');
        let note_id = _global.focused_note;

        let note = newNote();
        note.heading = textareas[0].value;

        for (let i = 1; i < textareas.length; i++)
            note.body.push(textareas[i].value);

        saveNote(note_id, note, true);

        let tags = updateTags(el.getAttribute('note'));

        note.tags = tags?tags:[];

        saveNote(note_id, note);

        //el.style.height = '1px';
        el.style.height = (el.scrollHeight) + 'px';
    })
}

function rawNote(note, id) {
    let note_id = id;

    if (!id)
        note_id = getId(); // Setup _global meta data for notes and extract next ID

    let note_elm = document.createElement('div');
    let html = '';

    note_elm.setAttribute('class', 'note');
    note_elm.id = note_id;

    html += "<div class='content' note='" + note_id + "'>";

    if (note.heading.length > 0) {
        html += "<span class='note_head' note='" + note_id + "' >" + note.heading + "</span>";

        for (let i = 0; i < note.body.length; i++)
            html += "<span class='note_parah' note='" + note_id + "' >" + note.body[i] + "</span>";

        if(note.tags.length > 0){
            let temp = ""
            temp += "</div>";
            temp += "<div class='note_tags' note='" + note_id + "'>";

            for (let i = 0; i < note.tags.length; i++){
                temp += "<span class='hashtag'>" + note.tags[i] + "</span>";
            }

            html += temp;
        }
    }

    html += "</div>";

    note_elm.innerHTML = html;

    return note_elm;
}

function createNote(note) {
    let note_id = getId(); // Setup _global meta data for notes and extract next ID

    _global.notes[note_id] = newNote();

    let note_elm = rawNote(_global.notes[note_id], note_id);

    let textareaNode = document.createElement("textarea");
    textareaNode.setAttribute("class", "note_head_textarea");
    textareaNode.setAttribute("spellcheck", "false");
    textareaNode.setAttribute("note", note_id);
    textareaNode.setAttribute("tabindex", "-1");

    note_elm.getElementsByClassName('content')[0].appendChild(textareaNode);

    let last_date = $('.date_element')
    let now = new noteDate();

    if(last_date.innerHTML == now.getString()) {
        insertAfter(note_elm, last_date)
    } else {
        let new_date = dateElement(now.getString())
        $('#notes').insertBefore(note_elm, $('#notes').childNodes[0]);
        $('#notes').insertBefore(new_date, $('#notes').childNodes[0]);
    }

    //$('#notes').insertBefore(note_elm, $('#notes').childNodes[0]);
    noteFocusout(note_elm);
    //noteListener(note_elm);

    tunnel(() => {
        textareaNode.style.height = '17px';
        _global.focused_note = note_id;
        textareaNode.focus();
    });

    noteListener(textareaNode);

    let date_elem = $('#'+now.getString())
    let notes = parseInt(date_elem.getAttribute('notes'))
    date_elem.setAttribute('notes', ++notes)

    return note_elm;
}

function updateTags(note_id) {
    let arr = getHashtags();

    if (arr.length > 0) {
        if (!$('#' + note_id).getElementsByClassName('note_tags')[0]) {
            let tag_elem = document.createElement('span');
            tag_elem.setAttribute('class', 'note_tags');
            tag_elem.setAttribute('note', note_id);
            $('#' + note_id).appendChild(tag_elem);
        }
    } else {
        if ($('#' + note_id).getElementsByClassName('note_tags')[0])
            $('#' + note_id).getElementsByClassName('note_tags')[0].remove();
        return;
    }

    let tag_element = $('#' + note_id).getElementsByClassName('note_tags')[0];
    //for (let val of arr)
    _global.notes[note_id].tags = arr
    tag_element.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        let tag = arr[i];
        tag_element.innerHTML += '<span class="hashtag" note="' + note_id + '" >' + tag + '</span>';
    }

    return arr;
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
                    arr.push(buffer.toLowerCase());
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
    let note_html = $('#' + id).getElementsByClassName('content')[0];
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
        noteListener(el);
    })
}

function make_html(id, note) {
    let note_html = $('#' + id).getElementsByClassName('content')[0];
    let html = '';

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

document.addEventListener('contextmenu', (ev) => {
    if (!ev.target.hasAttribute('note') && ev.target.id != 'note')
        closeContextMenu();
    else {
        if (window.getSelection) {
            let str = window.getSelection().toString()
            if (str.length > 0) {

            } else {
                ev.preventDefault();
                id = ev.target.getAttribute('note');
                contextMenu(ev.pageX, ev.pageY, id);
                return false;
            }
        }

    }
})

document.addEventListener('click', (ev) => {
    if (ev.target.parentNode.tagName == 'CMENU') {
        //DO CONTEXT MENU THINGS
        let note_id = ev.target.parentNode.getAttribute('note');
        closeContextMenu();
        delNote(note_id);
        removeNote($('#' + note_id))
        //$('#' + note_id).remove();
    }
    if (!ev.target.hasAttribute('note') || ev.target.id != 'note')
        closeContextMenu();
})

document.addEventListener('dblclick', (el) => {
    if (el.target.hasAttribute('note') && _global.focused_note != el.target.getAttribute('note'))
        make_editable(el.target.getAttribute('note'));
})

function noteFocusout(el) {
    el.addEventListener('focusout', () => {
        if (_global.active) {
            
            let empty = false;
            let id = el.id;
            let textareas = el.getElementsByClassName('content')[0].getElementsByTagName('textarea');

            let note = newNote();

            if (textareas[0].value.length <= 1) empty = true;
            note.heading = textareas[0].value;

            if (textareas.length > 1) {
                for (let i = 1; i < textareas.length; i++) {
                    note['body'].push(textareas[i].value)
                }
            }

            //if (el.getElementsByClassName('note_tags')[0]) {
                //let tag_elems = el.getElementsByClassName('note_tags')[0].getElementsByClassName('hashtag');
                //let tags = []

                /*for(let i = 0; i < tag_elems.length; i++)
                    tags.push(tag_elems[i].innerHTML)*/

                note.tags = _global.notes[id].tags;
                
                if(!empty)
                    save_tags(parseInt(id), note.tags)
            //}

            el.style.border = "1px solid #393f50";

            make_html(id, note);

            if (empty)
                removeNote(el)
                //el.remove(); 

            if (!empty)
                clean_tags()
            
        }
    });
}

// COMMANDS

__initiator__();

/*$forEach('.note', (el) => {
    noteListener(el)
})*/