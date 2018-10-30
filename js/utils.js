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

function parseMetaData(str) {
    let data = str.slice(1, str.length - 1)
    let arr = data.split(':')
    let json = {
        prevNote: arr[0],
        nextNote: arr[1]
    }
    return json
}

function strMetaData(json) {
    if (!json) return '[x:x]'
    let str = '[' + json.prevNote + ':' + json.nextNote + ']'
    return str
}

function __initiator__() {}

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