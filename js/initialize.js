let _global = {}

_global.active = true;
_global.focused_note = '';

_global.notes = {
    "a1": {
        heading: "Welcome to Beautiful notes!",
        body: ["A simple notes writing application that enables users to write their notes in an elegant manner. This note acts as the beginning of a new #writing #experiance!"],
        tags: ["writing", "experiance"]
    },
};

let base_id = 'a1'

let welcome_note = {
    heading: "Welcome to Beautiful notes!",
    body: ["A simple notes writing application that enables users to write their notes in an elegant manner. This note acts as the beginning of a new #writing #experiance!"],
    tags: ["writing", "experiance"]
}

function __initiator__() {}