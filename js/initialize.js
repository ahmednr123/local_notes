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
    }

    _global.base_id = JSON.parse(window.localStorage.getItem('note:meta')).baseId;
    _global.last_note = JSON.parse(window.localStorage.getItem('note:meta')).lNote;
    _global.first_note = JSON.parse(window.localStorage.getItem('note:meta')).fNote;

    displayNotes(_global.first_note, 5, FROM_LAST);
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        displayNotes(_global.curr_base_id, 5, FROM_LAST);
    }
};

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
        this.push(elem)
        return 1
    } else 
        return -1
}