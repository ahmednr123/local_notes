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