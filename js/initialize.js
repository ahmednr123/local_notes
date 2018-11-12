let _global = {}

_global.active = true;
_global.focused_note = '';

_global.notes = {
    "1": {
        heading: "Welcome to Beautiful notes!",
        body: ["A simple notes writing application that enables users to write their notes in an elegant manner. This note acts as the beginning of a new #writing #experiance!"],
        tags: ["writing", "experiance"]
    },
};

_global.base_id = '1'
_global.curr_base_id = '1'

let welcome_note = {
    heading: "Welcome to Beautiful notes!",
    body: ["A simple notes writing application that enables users to write their notes in an elegant manner. This note acts as the beginning of a new #writing #experiance!"],
    tags: ["writing", "experiance"]
}

function __initiator__() {
    if (!window.localStorage.getItem('bnote:meta')) {
        window.localStorage.setItem('bnote:meta', JSON.stringify({begNote:'1', lastNote:'1', baseId: '1'}));
        window.localStorage.setItem('bnote:1', JSON.stringify(welcome_note))
        _global.notes['1'] = welcome_note;
        
    }
    

    displayNotes(_global.curr_base_id, 5);
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        displayNotes(_global.curr_base_id, 5);
    }
};