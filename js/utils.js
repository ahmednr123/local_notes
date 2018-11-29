function newNote() {
    return {
        heading: "",
        body: [],
        tags: []
    }
}

function changeMeta(meta) {
    let json = JSON.parse(window.localStorage.getItem('note:meta'))

    if (meta.fNote)
        json.fNote = meta.fNote;

    if (meta.lNote)
        json.lNote = meta.lNote;

    if (meta.baseId)
        json.baseId = meta.baseId;

    window.localStorage.setItem('note:meta', JSON.stringify(json))
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
	console.log("before: "+ _global.base_id);
	let id = ++_global.base_id;
	console.log("after: "+_global.base_id)
	changeMeta({
		baseId:id
	})
    return id;
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

function save_tags(id, tags) {
    for(let i = 0; i < tags.length; i++){
        _global.tags.add(tags[i])

        let temp = []
        if(window.localStorage.getItem('tag:' + tags[i]))
            temp = JSON.parse(window.localStorage.getItem('tag:' + tags[i]))
        temp.add(id)

        window.localStorage.setItem('tag:'+tags[i], JSON.stringify(temp))
        window.localStorage.setItem('tag:meta', JSON.stringify(_global.tags))
    }
}