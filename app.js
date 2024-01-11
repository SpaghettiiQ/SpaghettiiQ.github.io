class Task {
	constructor(text, deadline, uuid) {
		this.uuid = uuid || crypto.randomUUID();
		this.text = text;
		this.deadline = deadline;
		this.completed = false;
	}
}

var Tasks = []

const tasksArray = JSON.parse(localStorage.getItem('tasks'));
const tasksInstances = tasksArray.map(taskData => {
	return new Task(taskData.text, parseISOString(taskData.deadline), taskData.uuid);
});

Tasks = tasksInstances;
updateUi();

function parseISOString(s) {
	let b = s.split(/\D+/);
	return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function completeTask(id) {
	let underscoreIndex = id.indexOf('_');
	let result = id.substring(underscoreIndex + 1);
	Tasks = Tasks.filter(task => task.uuid != result);
	localStorage.tasks = JSON.stringify(Tasks);
	updateUi();
}

function createTask() {
	const text = document.getElementById('textInput').textContent.trim();
	const time = document.getElementById('timeInput').value;
	let timeParse = /(\d\d):(\d\d)/;
	let result  = timeParse.exec(time);
	let hours = Number(result[1]);
	let minutes = Number(result[2]);
	console.log(result[0])

	if ((!text.length > 0) || (document.getElementById('textInput').innerHTML == `<span class="placeholder-text">Text</span>`)) {
		document.getElementsByClassName('textRow')[0].classList.add('requiredAlert');
		return;
	}
	const date = calendar._selectedDate;
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(0);

	const now = new Date();
	if (dates.compare(now, date) === 1) {
		document.getElementById('btns').classList.add('requiredAlert');
		return;
	}

	if (document.getElementById('textInput').classList.contains('focused')) {
		document.getElementById('textInput').innerHTML = "";
	} else {
		document.getElementById('textInput').innerHTML = `<span class="placeholder-text">Text</span>`;
	}
	calendar.setDate(new Date());

	let n = Tasks.push(new Task(text, date))
	localStorage.tasks = JSON.stringify(Tasks);
	updateUi();
	var T = Tasks[n-1].uuid;
	setTimeout(startCountdown(T), 1000);
}

function updateUi() {
	var tasks = document.getElementsByClassName('task');

	for (var i = tasks.length - 1; i >= 0; i--) {
		tasks[i].parentNode.removeChild(tasks[i]);
	}
	console.log(Tasks);

	Tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

	var temp

	if (Tasks.length < 1) {
		document.getElementById('taskList').innerHTML = `
		<li class="task list-group-item">
			There are no currently tasks to show.<br/>You can add some with the Add Task panel.
		</li>
		`
		return;
	}
	for (i = 0; i < Tasks.length; i++) {
		temp = document.createElement('li');

		temp.className = 'task list-group-item';
		temp.innerHTML = `
		<div class="row">
			<div class="task-main col-9 d-flex justify-content-start">
				<button type="button" id="completeBtn_${Tasks[i].uuid}" class="completeBtn btn border-0 rounded-5" onclick="completeTask(this.id)">􀆅</button>
				<div class="task-text">${Tasks[i].text}</div>
			</div>
			<div id="${Tasks[i].uuid}" class="l1 l1_${Tasks[i].uuid} col-3">
				${(Tasks[i].deadline.getHours().toString().length > 1) ? Tasks[i].deadline.getHours() : "0" + Tasks[i].deadline.getHours()}:${(Tasks[i].deadline.getMinutes().toString().length > 1) ? Tasks[i].deadline.getMinutes() : "0" + Tasks[i].deadline.getMinutes()}
				<br/>
				${Tasks[i].deadline.getDate()}.

				${Tasks[i].deadline.getMonth() + 1}.

				${Tasks[i].deadline.getFullYear()}
			</div>
		</div
		`
		/*
		temp.innerHTML = `
			<div class="hstack py-2">
				<div class="w-75 px-3">${Tasks[i].text}</div>
				<button type="button" id="completeBtn_${Tasks[i].uuid}" onclick="completeTask(this.id)" class="completeBtn btn border-0 rounded-5">􀆅</button>
					<div id="${Tasks[i].uuid}" class="l1 l1_${Tasks[i].uuid}" onmouseenter="showDeadline(this.id, true)" onmouseleave="showDeadline(this.id, false)">
						...
					</div>
				</div>

				<div class="l2 l2_${Tasks[i].uuid} hidden">
					${(Tasks[i].deadline.getHours().toString().length > 1) ? Tasks[i].deadline.getHours() : "0" + Tasks[i].deadline.getHours()}:${(Tasks[i].deadline.getMinutes().toString().length > 1) ? Tasks[i].deadline.getMinutes() : "0" + Tasks[i].deadline.getMinutes()}
					<br/>
					${Tasks[i].deadline.getDate()}.

					${Tasks[i].deadline.getMonth() + 1}.

					${Tasks[i].deadline.getFullYear()}
				</div>
			</div>
		`;
		*/
		document.getElementById('taskList').appendChild(temp);
	}
}


// credit to w3schools.com for countdown code
function startCountdown(uuid) {
	if (Tasks[0].uuid !== uuid) {
		return;
	}
	var t = Tasks.find(task => {
		return task.uuid === uuid;
	})

	var countDownDate = t.deadline.getTime();

	var x = setInterval(function() {
		if (Tasks.find(task => {
			return task.uuid === uuid;
		}) == null) {
			clearInterval(x);
		}

	// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = countDownDate - now;

		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		document.getElementById(uuid).innerHTML = days + "d " + hours + "h "
		+ minutes + "m " + seconds + "s ";

		// If the count down is over, write some text
		if (distance < 0) {
			clearInterval(x);
		}
	}, 1000);
};

var dates = {
		convert:function(d) {
				// Converts the date in d to a date-object. The input can be:
				//   a date object: returned without modification
				//  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
				//   a number     : Interpreted as number of milliseconds
				//                  since 1 Jan 1970 (a timestamp)
				//   a string     : Any format supported by the javascript engine, like
				//                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
				//  an object     : Interpreted as an object with year, month and date
				//                  attributes.  **NOTE** month is 0-11.
				return (
						d.constructor === Date ? d :
						d.constructor === Array ? new Date(d[0],d[1],d[2]) :
						d.constructor === Number ? new Date(d) :
						d.constructor === String ? new Date(d) :
						typeof d === "object" ? new Date(d.year,d.month,d.date) :
						NaN
				);
		},
		compare:function(a,b) {
				// Compare two dates (could be of any type supported by the convert
				// function above) and returns:
				//  -1 : if a < b
				//   0 : if a = b
				//   1 : if a > b
				// NaN : if a or b is an illegal date
				// NOTE: The code inside isFinite does an assignment (=).
				return (
						isFinite(a=this.convert(a).valueOf()) &&
						isFinite(b=this.convert(b).valueOf()) ?
						(a>b)-(a<b) :
						NaN
				);
		},
		inRange:function(d,start,end) {
				// Checks if date in d is between dates in start and end.
				// Returns a boolean or NaN:
				//    true  : if d is between start and end (inclusive)
				//    false : if d is before start or after end
				//    NaN   : if one or more of the dates is illegal.
				// NOTE: The code inside isFinite does an assignment (=).
			 return (
						isFinite(d=this.convert(d).valueOf()) &&
						isFinite(start=this.convert(start).valueOf()) &&
						isFinite(end=this.convert(end).valueOf()) ?
						start <= d && d <= end :
						NaN
				);
		}
}