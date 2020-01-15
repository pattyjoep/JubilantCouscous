//Static Map Function
//Add this script to HTML:  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
//Inputs to change here:  Update latitude and longitude variables "41" and "-72" to input ids of restaurants
function getMapPicture(lat, long) {
    var mainMapURL = "https://open.mapquestapi.com/staticmap/v5/map?";
    var apiKey = "&key=rv6UkjMZNdE70qdwfiiGWvFoMoySvljp";
    var latitude = "&locations=" + lat + ",";
    var longitude = long;

    //Create n numbers of imgs and name IDs before this to mapData-1, -2 etc n of i to index [i]
    //#mapData ID needs to be updated to where you want the map displayed 
    var mapURLCombined = mainMapURL + apiKey + latitude + longitude;
    $("#mapData").attr("src", mapURLCombined);

    //Console log items
    console.log(mainMapURL);
    console.log(apiKey);
    console.log(latitude);
    console.log(longitude);
    console.log(mapURLCombined);
}

//Geolocation Function to find page or user location coordinates
//Add this script to HTML:  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
//Output of this will be inputs to other functions
var pageLatitude = '';
var pageLongitude = '';

function findPageLocation() {

    var status = document.querySelector('#status');
    var mapLink = document.querySelector('#map-link');

    mapLink.href = '';
    mapLink.textContent = '';

    function success(position) {
        pageLatitude = position.coords.latitude;
        pageLongitude = position.coords.longitude;

        console.log(pageLatitude);
        console.log(pageLongitude);
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