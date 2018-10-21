document.addEventListener('click', (el) => {
	console.log(el.target.offsetHeight - 42);
})

// Notes structure: [ID]:{heading, body, tags}
// ID structure: bnote:[id]
// Local storage

function saveNote (id, heading, body, tags) {
	if(!window.localStorage.getItem(id)){
		let note = {heading, body, tags}
		window.localStorage.setItem(id, JSON.stringify(note))
		return
	}

	let noteJson = JSON.parse(window.localStorage.getItem(id))
	noteJson.heading = heading
	noteJson.body = body
	noteJson.tags = tags

	window.localStorage.setItem(id, JSON.stringify(noteJson))
}

function getNote (id) {
	if(!window.localStorage.getItem(id))
		return -1

	return JSON.parse(window.localStorage.getItem(id))
}

function delNote (id) {
	if(!window.localStorage.getItem(id))
		return -1

	window.localStorage.removeItem(id)
}

function delNotes () {
	window.localStorage.clear()
}

function getNotes (from, to) {

}