const defaultDeleteText = "Delete data";
const confirmationText = "Are you sure?";

function msToTime(duration) {
	var seconds = Math.floor((duration / 1000) % 60);
	var minutes = Math.floor((duration / (1000 * 60)) % 60);
	var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
  
	return hours + "h " + minutes + "m " + seconds + "s";
}

function configureGraph(response) {
	let textElement = document.getElementById("pills-day");
	textElement.textContent = "";
	let data = [];
	
	response.map((hour) => {
		let totalTime = 0;
		hour.hostMap.map((item) => {
			totalTime += item.duration;
		});
		data.push({hour: hour.hour, activeTime: totalTime});
	});

	let canvas = document.createElement("canvas");
	canvas.id = "daychart";

	new Chart(
		canvas,
		{
		  type: 'bar',
		  data: {
				labels: data.map(row => row.hour),
				datasets: [
					{
						label: 'Minutes active per hour',
						data: data.map(row => row.activeTime / 60000),
					}
				]
			}
		}
	);
	textElement.append(canvas);
}

document.getElementById('sendMessage').addEventListener('click', function() {
	chrome.runtime.sendMessage({command: "getDayData"}, function(response) {
		configureGraph(response);
	});
});

document.getElementById('deleteData').addEventListener('click', function() {
	if (this.textContent === defaultDeleteText) {
		this.textContent = confirmationText;
		this.className = "btn btn-danger";
		return;
	} else {
		chrome.runtime.sendMessage({command: "deleteData"}, function(response) {
			document.getElementById("pills-day").textContent = "";
		});
		this.textContent = defaultDeleteText;
		this.className = "btn btn-primary";
	}
});
