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

let base_id = '1'

let welcome_note = {
    heading: "Welcome to Beautiful notes!",
    body: ["A simple notes writing application that enables users to write their notes in an elegant manner. This note acts as the beginning of a new #writing #experiance!"],
    tags: ["writing", "experiance"]
}

function __initiator__() {
    if (!window.localStorage.getItem('bnote:meta')) {
        window.localStorage.setItem('bnote:meta', '[1:1:1]');
        window.localStorage.setItem('bnote:1', JSON.stringify(welcome_note))
        _global.notes['1'] = welcome_note;

    }
}