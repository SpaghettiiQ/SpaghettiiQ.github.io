let Tasks = [

]

class Task {
	constructor(text, deadline) {
		this.text = text;
		this.deadline = deadline;
		this.completed = false;
	}
}


function createTask() {
	const text = document.getElementById('textInput').textContent.trim();
	const time = document.getElementById('timeInput').value;
	let timeParse = /(\d\d):(\d\d)/;
	let result  = timeParse.exec(time);
	let hours = Number(result[1]);
	let minutes = Number(result[2]);
	console.log(result[0])

	if (!text.length > 0) {
		document.getElementById('textInput').classList.add('requiredAlert');
		return;
	}
	const date = calendar._selectedDate;
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);

	document.getElementById('textInput').textContent = "";
	calendar.setDate(new Date());

	Tasks.push(new Task(text, date))
	console.log("created a task:");
	console.log(Tasks);
	updateUi();
}

function updateUi() {
	var divs = document.getElementsByClassName('task');

	for (var i = divs.length - 1; i >= 0; i--) {
		divs[i].parentNode.removeChild(divs[i]);
	}

	var temp

	for (i = 0; i < Tasks.length; i++) {
		temp = document.createElement('task');
		temp.className = 'task';
		temp.innerHTML = Tasks[i].text + " | " + Tasks[i].deadline;
		document.getElementById('taskList').appendChild(temp);
	}
}