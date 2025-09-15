let newBody = document.getElementsByTagName("body");
newBody.textContent = "";

const myStarWarsRequest = new XMLHttpRequest();
myStarWarsRequest.open("GET", "https://swapi.dev/api/films/");
myStarWarsRequest.addEventListener("load", () => {
	console.log("success");
	const myStarWarsData = myStarWarsRequest.responseText;
	cleanStarWarsData = JSON.parse(myStarWarsData);
	let myNewData = cleanStarWarsData.results;
	console.log(myNewData);
	myNewData.forEach((starWarsRecords) => {
		let moviesTitles = starWarsRecords.title;

		let paragraphElement = document.createElement("p");
		paragraphElement.setAttribute("class", "noble");
		paragraphElement.textContent = "NO Scrubs";
		// paragraphElement.textContent = moviesTitles;
		newBody.append(paragraphElement);
	});
});

myStarWarsRequest.addEventListener("error", () => console.log("error"));

myStarWarsRequest.send();

// class MyClass {}
