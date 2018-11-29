const FROM_LAST = 1;
const FROM_BEGINNING = 0;

let _global = {}

_global.active = true;
_global.focused_note = '';

_global.last_note = 1
_global.first_note = 1
_global.base_id = 1
_global.curr_base_id = 1

_global.notes = {}

_global.tags = []

let welcome_note = {
    heading: "Welcome to Beautiful notes!",
    body: ["A simple notes writing application that enables users to write their notes in an elegant manner. This note acts as the beginning of a new #writing #experiance!"],
    tags: ["writing", "experiance"]
}

function __initiator__() {
    if (!window.localStorage.getItem('note:meta')) {
        window.localStorage.setItem('note:meta', JSON.stringify({
            fNote: 1,
            lNote: 1,
            baseId: 1
        }));
        window.localStorage.setItem('note:1', JSON.stringify(welcome_note))
        window.localStorage.setItem('note:1:meta', JSON.stringify({
            prevNote: 'x',
            nextNote: 'x'
        }))

        _global.notes[1] = welcome_note;

        save_tags(1, welcome_note.tags);
    }

    _global.base_id = JSON.parse(window.localStorage.getItem('note:meta')).baseId;
    _global.last_note = JSON.parse(window.localStorage.getItem('note:meta')).lNote;
    _global.first_note = JSON.parse(window.localStorage.getItem('note:meta')).fNote;

    // Load tags
    //_global.tags = JSON.parse(window.localStorage.getItem('tag:meta'))

    displayNotes(_global.first_note, 5, FROM_LAST);
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        displayNotes(_global.curr_base_id, 5, FROM_LAST);
    }
};

/*
    ======================================

    tag:meta
    tag:[name] -> tag details

    ======================================
*/

function load_tags() {
    _global.tags = JSON.parse(window.localStorage('tag:meta'))

}

/*let a = []

let promise = new Promise(function(resolve, reject) {
    a.add('abc')
    setTimeout(function(){
        resolve('Returned')
    }, 6000)
})

promise.then(function(value) {
    console.log(value)
})*/

Array.prototype.add = function (elem) {
    if(this.indexOf(elem) === -1){
        this.unshift(elem)
        return 1
    } else 
        return -1
}

Array.prototype.remove = function (elem) {
    const index = this.indexOf(elem);
    this.splice(index, 1);
}

function delete_tag(tagname){
    _global.tags.remove(tagname)
    window.localStorage.setItem('tag:meta', JSON.stringify(_global.tags))
    console.log('tagID= tag:' + tagname)
    window.localStorage.removeItem('tag:'+tagname)
}

function clean_tags() {
    let promise = new Promise(function(resolve, reject) {
        let tag_json = {}
        for(let tag of _global.tags)
            tag_json[tag] = 0

        for(let note in _global.notes){
            let tags = _global.notes[note].tags
            
            for(let j = 0; j < tags.length; j++)
                tag_json[tags[j]]++
        }

        console.log('TAGS PRESENT: '+JSON.stringify(tag_json))

        for(let tag in tag_json)
            if(tag_json[tag] == 0)
                delete_tag(tag)

        resolve('Cleaing done!')
    })
    
    promise.then(function(value) {
        console.log(value)
    })
}