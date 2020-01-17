// 
var recentCoords = {}
// get localstorage
if(localStorage.getItem("recentCoords") !== null){
    recentCoords = JSON.parse(localStorage.getItem("recentCoords"))
}
// if localstorge exists, and date is less than 5 minutes ago
// if(recentCoords.date ){
// call function to get new Coords.
findPageLocation();
// }
//Static Map Function for single location
//Inputs to change here:  Update latitude and longitude variables "41" and "-72" to input ids of restaurants or lat long
function getMapPicture(lat, long) {
    var mainMapURL = "https://open.mapquestapi.com/staticmap/v5/map?";
    var apiKey = "&key=rv6UkjMZNdE70qdwfiiGWvFoMoySvljp";
    var latitude = "&locations=" + lat + ",";
    var longitude = long;

    //Create n numbers of imgs and name IDs before this to mapData-1, -2 etc n of i to index [i]
    //#mapData ID needs to be updated to where you want the map displayed 
    var mapURLCombined = mainMapURL + apiKey + latitude + longitude;
    $("#mapData").attr("src", mapURLCombined);
}

//Geolocation Function to find page or user location coordinates
//Add this script to HTML:  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
//Output of this will be inputs to other functions
var pageLatitude = '';
var pageLongitude = '';

function findPageLocation() {
    function success(position) {
        pageLatitude = position.coords.latitude;
        pageLongitude = position.coords.longitude;
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

//Static Map Function with 5 locations on single map
//Add this script to HTML:  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
function getSinglePicture(fiveCoordString) {
    var mainMapURL = "https://open.mapquestapi.com/staticmap/v5/map?";
    var apiKey = "&key=rv6UkjMZNdE70qdwfiiGWvFoMoySvljp";
    var allFiveLocations = "&locations=" + fiveCoordString;

    //Create n numbers of imgs and name IDs before this to mapData-1, -2 etc n of i to index [i]
    //#mapData ID needs to be updated to where you want the map displayed 
    var mapURLCombined = mainMapURL + apiKey + allFiveLocations;
    $("#mapData").attr({
        "src": mapURLCombined,
        "style": "height: 25em; width: 430px; border-radius: 10px;"
    });
    $("#MapImg").css("width: 430px;")
    
}