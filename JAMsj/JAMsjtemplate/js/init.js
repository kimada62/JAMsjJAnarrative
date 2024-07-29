// Declare variables
let mapOptions = { 'centerLngLat': [-121.89, 37.34], 'startingZoomLevel': 10 };

// DONE? - correlate markers with button(color-wise or something else and explain the difference in color)
// TODO 1- make sure that you are showing the responses in a way that is easy to understand
// TODO 2- think about the project as a older community member who is using this website
        // TODO 2a- for example adding summaries of the responses in a way that is easy to understand (chart, graph, etc.)

		// Initialize the map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/0a04ace0-88e8-431f-b423-737da252d6b6/style.json?key=uqJNwQO9lP1VKm74Hia6',
    center: mapOptions.centerLngLat,
    zoom: mapOptions.startingZoomLevel
});

// Add sticky header functionality
document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('scroll', function () {
        var winTop = window.scrollY;
        if (winTop >= 30) {
            document.body.classList.add('sticky-header');
        } else {
            document.body.classList.remove('sticky-header');
        }
    });
});

// Function to add a marker to the map
function addMarker(data) {
    console.log(data);
    let longitude = parseFloat(data.lng);
    let latitude = parseFloat(data.lat);
    let jamsjImprovement = data["Do you think the museum is successful in capturing all of the complexities of the Japanese American narrative?"];
    let jamsjElaborate = data["Regarding the previous question, please explain why you feel that way. If you answered no, what other narratives do you want to be present in the museum and why?"];
    let memories = data["What memories, activities, conversations and/or experiences have you had in your local Japan Town that has impacted your identity and the local community."];
    let location = data["What is your zipcode?"];
    let age = data["How old are you?"];
    let gen = data["What generation Japanese American do you identify as?"];
    let img;
    let markerColor;
    let popup_message;

    if (jamsjImprovement == "No") {
        popup_message = `<h3>JAMjs is not successfully capturing the whole JA experience</h2>
           <h3>Generation</h3><p>${gen}</p>
            <h3>Age</h3><p>${age}</p>
            <h3>Elaboration</h3><p>${jamsjElaborate}</p>
            <h3>Memories in San Jose Japan Town</h3><p>${memories}</p>`;
        img = "motto";
        markerColor = "red";
    } else if (jamsjImprovement == "Yes") {
        popup_message = `<h3>JAMjs is successfully capturing the whole JA experience</h2>
            <h3>Generation</h3><p>${gen}</p>
            <h3>Age</h3><p>${age}</p>
            <h3>Elaboration</h3><p>${jamsjElaborate}</p>
            <h3>Memories in San Jose Japan Town</h3><p>${memories}</p>`;
        img = "jamgood";
        markerColor = "green";
    } else if (jamsjImprovement == "I don't know") {
        popup_message = `<h3>Survey taker who is not sure with JA representation at JAMjs</h2>
            <h3>Generation</h3><p>${gen}</p>
            <h3>Age</h3><p>${age}</p>
            <h3>Elaboration</h3><p>${jamsjElaborate}</p>
            <h3>Memories in San Jose Japan Town</h3><p>${memories}</p>`;
        img = "idk";
        markerColor = "gray";
    }

    // Define the range for the latitude offset
    const offsetRange = 0.002; // Latitude offset range
    // Generate a random offset for latitude and apply it directly
    latitude += (Math.random() - 0.5) * 2 * offsetRange;
    longitude += (Math.random() - 0.5) * 2 * offsetRange;

	//this is the new code for the custom marker, feel free to customize it
	// note the use of the .style properties to style the marker with CSS
	const customMarkerWithImage = document.createElement('div');
	customMarkerWithImage.style.backgroundImage = `url(./images/${img}.png)`;
	customMarkerWithImage.style.width = '50px';
	customMarkerWithImage.style.height = '50px';
	customMarkerWithImage.style.backgroundSize = 'cover';
	customMarkerWithImage.style.cursor = 'pointer';
	customMarkerWithImage.style.color = markerColor;

    new maplibregl.Marker({element: customMarkerWithImage})
        .setLngLat([longitude, latitude])
        .setPopup(new maplibregl.Popup().setHTML(popup_message))
        .addTo(map);

    createButtons(latitude, longitude, gen, jamsjImprovement);
    return location;
}

// Function to create buttons
function createButtons(lat, lng, buttonText, needsImprovement) {
    const newButton = document.createElement("button");
    newButton.id = "button" + buttonText;
    if (needsImprovement == "No") {
        newButton.className = "noButton";
    } else if (needsImprovement == "Yes") {
        newButton.className = "yesButton";
    } else if (needsImprovement == "I don't know") {
        newButton.className = "idkButton";
    }
    newButton.innerHTML = buttonText;
    newButton.setAttribute("lat", lat);
    newButton.setAttribute("lng", lng);
    newButton.addEventListener('click', function () {
        map.flyTo({
            center: [lng, lat],
        });
    });
    document.getElementById("contents").appendChild(newButton);
}

// Fetch and process data
const myData = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnJhFxji3KAAAxQm2H8BHYgf7Gw3zShbNi-BN5ShkEnNwCygT5EHPN-7iWbtK3yeDWebdCUK-fRNSS/pub?gid=451161521&single=true&output=csv";
map.on('load', function () {
    Papa.parse(myData, {
        download: true,
        header: true,
        complete: results => {
            console.log(results.data);
            processData(results.data);
        }
    });
});

// Process data
function processData(results) {
    console.log(results); // for debugging: this can help us see if the results are what we want
    results.forEach(feature => {
        addMarker(feature);
    });

    };
 

    