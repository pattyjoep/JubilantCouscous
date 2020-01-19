// variable for local storage coords
var recentCoords = {}
// variables for coords used by restaurant finder
var pageLatitude = ''
var pageLongitude = ''
// if local storage exists...
if (localStorage.getItem("recentCoords") !== null ) {
    // parse to an object
    recentCoords = JSON.parse(localStorage.getItem("recentCoords"));
    // if the local storage is within the past ten minutes...
    if(moment().subtract().minutes('10').isBefore(recentCoords.date)) {
        // use coords from local storage
        pageLatitude = recentCoords.coords.lat;
        pageLongitude = recentCoords.coords.lon;
    } else {
        // if local storage was set more than 10 minutes ago, call function to get user's location
        findPageLocation();
    }
}
else {
    // if localstorage item does not exist call function to get users location
    findPageLocation();
}
//Future functionality: Static Map Function for single location
function getMapPicture(lat, long) {
    // base url & api key
    var mainMapURL = "https://open.mapquestapi.com/staticmap/v5/map?";
    var apiKey = "&key=rv6UkjMZNdE70qdwfiiGWvFoMoySvljp";
    // add in lat & long based on function parameters
    var latitude = "&locations=" + lat + ",";
    var longitude = long;
    // create full api url string
    var mapURLCombined = mainMapURL + apiKey + latitude + longitude;
    //#mapData update Image element with api string
   $("#mapData").attr("src", mapURLCombined);
}

//Geolocation Function to find page or user location coordinates
function findPageLocation() {
    // on success of browser finding user's location...
    function success(position) {
        pageLatitude = position.coords.latitude;
        pageLongitude = position.coords.longitude;
        // set found coords to object with current time
        recentCoords = {
            "coords": {
                "lat": position.coords.latitude,
                "lon": position.coords.longitude
            },
            "date": moment()
        }
        // set coords with time stamp to local storage
        localStorage.setItem("recentCoords",JSON.stringify(recentCoords))
    }
    // on failure of browser to get user's location
    // this is actually not a valid notification and should be addressed
    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    // if browser does not have the capability to find the user's location...
    if (!navigator.geolocation) {
        // this is not a valid notification and needs to be addressed
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        // otherwise try to get user's location and proceed with success or failure functions
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

//Static Map Function with 5 locations on single map
function getSinglePicture(fiveCoordString) {
    // base URL and API key
    var mainMapURL = "https://open.mapquestapi.com/staticmap/v5/map?";
    var apiKey = "&key=rv6UkjMZNdE70qdwfiiGWvFoMoySvljp";
    // add combined coords string from function parameter to API paramenter string
    var allFiveLocations = "&locations=" + fiveCoordString;
    // create full url with combined coords from parameter
    var mapURLCombined = mainMapURL + apiKey + allFiveLocations;
    // set IMG source url to map API url, and style image element.
    $("#mapData").attr({
        "src": mapURLCombined,
        "style": "height: 25em; width: 430px; border-radius: 10px;"
    });
    // style div container of map image element
    // $("#MapImg").css("width: 430px;")
    $("#MapImg").css("width: 100%;")
    
}