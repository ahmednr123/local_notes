function newNote() {
    return {
        heading: "",
        body: [],
        tags: [],
        date_tags: [],
        date: null
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
    if(typeof(func) !== 'function')
        console.log('Debug Error: tunnel(arg) expected argument: function but got: '+typeof(func))
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
    tags = JSON.stringify(tags)
    tags = JSON.parse(tags)
    for(let i = 0; i < tags.length; i++){
        
        _global.tags.add(tags[i])
        console.log('save_tags: tag['+i+']: '+tags[i])

        let temp = []
        if(window.localStorage.getItem('tag:' + tags[i]))
            temp = JSON.parse(window.localStorage.getItem('tag:' + tags[i]))
        temp.add(id)

        window.localStorage.setItem('tag:'+tags[i], JSON.stringify(temp))
        window.localStorage.setItem('tag:meta', JSON.stringify(_global.tags))
    }
}

function getDate() {

    let date = new Date();

    let year = date.getFullYear();

    let month = date.getMonth() + 1;

    let day = date.getDate();

    return {year, month, day}
}

console.log(getDate().year)

function noteDate (dateStr) {

    this.parseString = function (str, dontDoIt) {
        let json = str.split('-')
        json = json.map((val) => parseInt(val))
        
        let year = json[0]
        let month = json[1]
        let day = json[2]

        if(!dontDoIt)
            this.date = {year, month, day}

        return {year, month, day}
    }

    if(dateStr)
        this.date = this.parseString(dateStr, true)
    else
        this.date = getDate()

    this.getString = function () {
        let json = this.date
        console.log('date converted to string: '+ json.year + '-' + json.month + '-' + json.day)
        return json.year + '-' + json.month + '-' + json.day
    }
}

function dateElement(date) {
    if(!date){ 
        console.log('Error: date cannot be empty')
        return -1
    }

    let new_date = document.createElement('div')
    new_date.setAttribute('class', 'date_element')
    new_date.setAttribute('notes','0')
    new_date.setAttribute('id', date)
    new_date.innerHTML = date

    return new_date
}

function removeNote(el) {
    let date = _global.notes[el.id].date
    let notes = parseInt($('#'+date).getAttribute('notes'))
    el.remove()
    $('#'+date).setAttribute('notes', --notes)
    killDateElements()
}

function killDateElements() {
    let dates = document.getElementsByClassName('date_element')
    let badElements = []

    for(let i = 0; i < dates.length; i++)
        if(dates[i].getAttribute('notes') == '0')
            badElements.push(i)

    for(let id of badElements)
        dates[id].remove()
}