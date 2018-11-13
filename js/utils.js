function newNote() {
    return {
        heading: "",
        body: [],
        tags: []
    }
}

function changeMeta(meta) {
    let json = JSON.parse(window.localStorage.getItem('bnote:meta'))

    if (meta.fNote)
        json.fnote = meta.fNote;

    if (meta.lNote)
        json.lnote = meta.lNote;

    if (meta.baseId)
        json.baseId = meta.baseId;

    window.localStorage.setItem('bnote:meta', JSON.stringify(json))
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

function getId() {
    return ++_global.base_id;
}

function getBaseId() {
    return _global.curr_base_id;
}

function contextMenu(x, y, id) {
    console.log(id);
    closeContextMenu();
    $('#' + id).style.opacity = '0.2';
    let contextmenu = $('cmenu');
    console.log('x: ' + x + ', y: ' + y)
    contextmenu.setAttribute('note', id)
    contextmenu.style.top = y + 'px';
    contextmenu.style.left = x + 'px';
    contextmenu.style.display = 'block';
}

function closeContextMenu() {
    let contextmenu = $('cmenu');
    if (contextmenu.style.display == 'block') {
        $('#' + contextmenu.getAttribute('note')).style.opacity = '1';
        contextmenu.removeAttribute('note');
        contextmenu.style.display = 'none';
    }
}