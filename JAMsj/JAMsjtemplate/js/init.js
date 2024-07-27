// declare variables

// correlate markers with button(color-wise or something else and explain the difference in color)
// make sure that you are showing the responses in a way that is easy to understand
// think about the project as someone who is using this website

$(function(){
    $(window).scroll(function(){
      var winTop = $(window).scrollTop();
      if(winTop >= 30){
        $("body").addClass("sticky-header");
      }else{
        $("body").removeClass("sticky-header");
     }//if-else
    });//win func.
});//ready func.;
//why is there // in code?

let mapOptions = {'centerLngLat': [-121.89, 37.34],'startingZoomLevel':10}

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/0a04ace0-88e8-431f-b423-737da252d6b6/style.json?key=uqJNwQO9lP1VKm74Hia6',
    center: mapOptions.centerLngLat,
    zoom: mapOptions.startingZoomLevel
});

function addMarker(data){
    console.log(data)
    let longitude = parseFloat(data.lng);
    let latitude = parseFloat(data.lat);
    let jamsjImprovement = data ["Do you think the museum is successful in capturing all of the complexities of the Japanese American narrative?"];
    let jamsjElaborate = data["Regarding the previous question, please explain why you feel that way. If you answered no, what other narratives do you want to be present in the museum and why?"];
    let memories = data ["What memories, activities, conversations and/or experiences have you had in your local Japan Town that has impacted your identity and the local community."]
    let location = data ["What is your zipcode?"];
    let age = data ["How old are you?"];
    let gen = data ["What generation Japanese American do you identify as?"];
    let img;
   

    if (jamsjImprovement == "No"){
         popup_message = `<h2>JAMjs is not successfully capturing the whole JA experience</h2> 
         <h3>Age</h3>
            <p>${age}</p>
         <h3>Generation</h3>
            <p>${gen}</h3>
         <h3>Elaboration</h3>
            <p>${jamsjElaborate}</p>
         <h3>Memories in San Jose Japan Town</h3>
            <p>${memories}<p/>`
         console.log(jamsjImprovement)
         createButtons(latitude,longitude,gen,jamsjImprovement); 
         img = "motto"
    }
    else if (jamsjImprovement == "Yes")
    {
        popup_message = `<h2>JAMjs is successfully capturing the whole JA experience</h2> 
         <h3>Age</h3>
            <p>${age}</p>
         <h3>Generation</h3>
            <p>${gen}</h3>
         <h3>Elaboration</h3>
            <p>${jamsjElaborate}</p>
         <h3>Memories in San Jose Japan Town</h3>
            <p>${memories}<p/>`
         img = "jamgood"
         
         
         createButtons(latitude,longitude,gen,jamsjImprovement); 
         markerImage= "aquamarine"
    }
    else if(jamsjImprovement == "I don't know"){
        popup_message = `<h2>Survery taker who is not sure with JA represenation at JAMjs</h2>
        <p>Location worth preserving: ${location}</p>
          <h3>Age</h3>
            <p>${age}</p>
         <h3>Generation</h3>
            <p>${gen}</h3>
        <h3>Elaboration</h3>
        <p>${jamsjElaborate}</p>
     <h3>Memories in San Jose Japan Town</h3>
        <p>${memories}<p/>`
        //<h3>${jamjselaborate}</h3>`
        console.log(jamsjImprovement)
        createButtons(latitude,longitude,gen,jamsjImprovement); 
        // REMEMBER THIS FOR FINAL
        img = "idk"

         createButtons(latitude,longitude,gen,jamsjImprovement); 
         markerColor= "gray"
    }
    console.log(markerColor)
      // Define the range for the latitude offset
    const offsetRange = 0.002; // Latitude offset range
      // Generate a random offset for latitude and apply it directly
    latitude += (Math.random() - 0.5) * 2 * offsetRange;
    longitude += (Math.random() - 0.5) * 2 * offsetRange;
    console.log(`${latitude}, ${longitude}`)
    new maplibregl.Marker(
            {color: markerColor}
        )  
        .setLngLat([longitude, latitude])
        .setPopup(new maplibregl.Popup()
            .setHTML(popup_message))
        .addTo(map)
    return location;
}
function createButtons(lat,lng,buttonText,needsimprovement){
    const newButton = document.createElement("button");
    newButton.id = "button"+buttonText;
    if (needsimprovement == "No"){
        //newButton.style.setProperty("background-color","green")
        //newButton.style.setProperty("color","white")
        newButton.className = "noButton"

    }
    else if(needsimprovement == "Yes")
    {
        newButton.className = "YesButton"
    }
    else if(needsimprovement == "I don't know"){
        newButton.className = "idkButton"
    }
    newButton.innerHTML = buttonText;
    newButton.setAttribute("lat",lat);
    newButton.setAttribute("lng",lng);
    newButton.addEventListener('click', function(){
        map.flyTo({
            center: [lng,lat],
        })
    })
    document.getElementById("contents").appendChild(newButton);
}


const myData = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnJhFxji3KAAAxQm2H8BHYgf7Gw3zShbNi-BN5ShkEnNwCygT5EHPN-7iWbtK3yeDWebdCUK-fRNSS/pub?gid=451161521&single=true&output=csv"
map.on('load', function() {
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
     Papa.parse(myData, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: results=> {
            console.log(results.data)
            processData(results.data)
         }
    });
});

function processData(results){
    console.log(results) //for debugging: this can help us see if the results are what we want
    results.forEach(feature => {
        // for debugging: are we seeing each feature correctly?
        // assumes your geojson has a "title" and "message" attribute
        addMarker(feature);
        //let message = feature[ "How was your experience watching the movie?"]
        //addMarker(latitude,longitude,title,message);
    });
};



