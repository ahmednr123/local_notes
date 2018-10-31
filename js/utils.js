function newMetaData() {
    return {
        prevNote: 0,
        nextNote: 0
    }
}

function parseMetaData(str) {
    let data = str.slice(1, str.length - 1)
    let arr = data.split(':')
    let json = {
        prevNote: parseInt(arr[0]),
        nextNote: parseInt(arr[1])
    }

    if (arr[2]) json.base = arr[2];

    return json
}

function strMetaData(json) {
    let str = '[' + json.prevNote + ':' + json.nextNote

    if (json.base) str += ':' + json.base;

    str += ']';

    return str;
}

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