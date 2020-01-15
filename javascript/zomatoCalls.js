// api to be passed in header
var zomatoAPIKey = "2f37220a29eeef45196157298a495add";
// define cuisine variable for optional usage
var cuisineType = "";
// array to store more than one ID from zomato for optional cuisines to search
var cuisineIDs = [];
// array for coordinates of all returned restaurants
var restaurantsCoord = [];
// concatenated string of coordinates of 5 restaurants for combined map API call
var fiveCoordString = "";

// click for least restrictive restaurant search
$("#findNear").on("click", function (event) {
    // prevent default form submission (incase element ends up in a form)
    event.preventDefault();
    // clear out cusine type, if previously selected since multi criteria not yet possible/allowed
    cuisineType = "";
    // Future fucntionality to allow for one/more cusine type searches, 
    if (cuisineType === "") {
        // if no type defined, just search all restaurants
        searchRestaurant();
    } else {
        // if list of cuisines exists, search IDs first
        getCuisineList();
    };
})
// click for specific cuisine pictures
$("body").on("click", ".cuisine", function (event) {
    // prevent default form submission (in case element ends up in a form)
    event.preventDefault();
    // get cuisine type from text in child H5 element
    cuisineType = $(this).children("h5").text();
    // call function to get cuisine ID to search restaurants
    getCuisineList();
})
// Future functionality: function to get categories and IDs (categories like delivery, breakfast, nightlife, etc)
// API has no parameters
function getCategoryID() {
    // API URL
    var categoryAPIURL = "https://developers.zomato.com/api/v2.1/categories"
    // function to use response from AJAX call
    function useCategoryResponse(categoryResponse) {
    }
    //  AJAX call to URL with call back for success
    callAJAX(categoryAPIURL, useCategoryResponse);
}
// Future functionality: function gets city information such as city-id by Name, or by Lat/Lon 
// API parameters q (query by city name), lat (latitude), lon (longitude), count (max results)
function getCityInfo() {
    // base URL
    var cityAPIURL = "https://developers.zomato.com/api/v2.1/cities?count=";
    // varible for city name to search for
    var searchCity = "";
    // varibles to search by lat/lon coordinates
    var searchCityLongitude = 0;
    var searchCityLatitude = 0;
    // varible for max results for API to return, for future dynamic adjustment
    var maxSearchResult = 1;
    // add # of requested results to base URL
    cityAPIURL = cityAPIURL + maxSearchResult;
    // if searching by city name, update URL
    if (searchCity !== "") {
        cityAPIURL = cityAPIURL + "&q=" + searchCity;
    }
    // if lat/lon provided, update URL
    else if (searchCityLatitude !== 0 && searchCityLongitude !== 0) {
        cityAPIURL = cityAPIURL + "&lat=" + searchCityLatitude + "&long=" + searchCityLongitude;
    } else {
        // error code goes here (to be a modal)
        // return out of function after error
    }
    // function to process successful response from AJAX call
    function useCityResponse() {
        // populate ... with response
        // or use City ID(s) to call a restaurant search
    }
    // call City search URL with AJAX and pass function to use on success
    callAJAX(cityAPIURL, useCityResponse)
}

// function gets list of cuisines with IDs within a city or at specified coordinates
// API parameters: city_id (id of the city to search), lat (lattitude), lon (longitude), [city_id or lat & lon required]
function getCuisineList() {
    var cuisineAPIURL = "https://developers.zomato.com/api/v2.1/cuisines?";
    var searchCuisineCity = "";
    var searchCuisineLat = pageLatitude;
    var searchCuisineLon = pageLongitude;
    if (searchCuisineCity !== "") {
        cuisineAPIURL += "city_id=" + searchCuisineCity;
    }
    else {
        cuisineAPIURL = cuisineAPIURL + "lat=" + searchCuisineLat + "&lon=" + searchCuisineLon;
    }
    callAJAX(cuisineAPIURL, useCuisineResponse)
}
// function called once cuisine API call is successfully complete
// gets cuisine IDs of user selected cuisine type and then calls search restaurant
function useCuisineResponse(response) {
    cuisineIDs = [];
    response.cuisines.forEach(element => {
        if (element.cuisine.cuisine_name === cuisineType) {
            cuisineIDs.push({
                cuisine_id: element.cuisine.cuisine_id,
                cuisine_name: element.cuisine.cuisine_name
            })
        }
    });
    searchRestaurant();
}

// function to search for restaurants, no parameters are required
// variables are built to support future functionality of user input choices
// optional parameters: q (search key word), count (max results up to 20), lat (latitude), lon (longitude),
// radius (around lat/lon in Meters), cuisines (list of comma separated cuisine IDs), category (category IDs),
// sort (sort by cost, rating, real_distance), order (used with sort asc, desc)
function searchRestaurant() {
    var searchAPIURL = "https://developers.zomato.com/api/v2.1/search?count=";
    // var searchKeyWord = ""
    // var searchByCategory = ""
    var maxRestaurants = 5;
    var sortBy = "&sort=rating";
    var searchByCuisines = "";
    var searchByLat = "&lat=" + pageLatitude;
    var searchByLon = "&lon=" + pageLongitude;
    var orderBy = "&order=desc";
    var searchRadius = 100;
    // if there are IDs returned from cuisine search API call
    if (cuisineIDs !== []) {
        // combine them into a string separated by ","
        cuisineIDs.forEach(function (element, index) {
            if (index === 0) {
                searchByCuisines = element.cuisine_id;
            } else {
                searchByCuisines += "," + element.cuisine_id;
            }
        });
    }

    // Future user input functionality
    // if (userDefinedMax) {maxRestaurants = userDefinedMax}
    // if (userDefinedSort) {sortBy = "&sort=" + userDefinedSort}
    // if (userDefinedOrder) {orderBy = "&order=" + userDefinedOrder}
    // if (userDefinedRadius) {searchRadius = userDefinedRadius}

    // radius input expected in miles, transform to meters for API requriments
    searchRadius = searchRadius * 1610;
    // build parameters into API url
    searchAPIURL = searchAPIURL + maxRestaurants + sortBy + orderBy + "&radius=" + searchRadius + searchByLat + searchByLon;
    if (searchByCuisines !== "") { searchAPIURL = searchAPIURL + "&cuisines=" + searchByCuisines };

    // Other future use input funtionality
    // if (searchByCategory !== "") { searchAPIURL = searchAPIURL + "&category=" + searchByCategory };
    // if (searchKeyWord !== "") { searchAPIURL = searchAPIURL + "&q=" + searchKeyWord };

    // call restaurant API search and run populateRestaurantInfo on success
    callAJAX(searchAPIURL, populateRestaurantInfo)
}


// called on successful completion of restaurant search, populates restaurant data into HTML
function populateRestaurantInfo(response) {
    restaurantsCoord = [];
    var restList = response.restaurants;
    // for each restaurant found...
    restList.forEach((element, index) => {
        var normInd = (index + 1)
        var divID = "#TopRatedName" + normInd
        var restObj = element.restaurant
        $(divID + "~a>img").attr({
            "src": restObj.featured_image,
            "style": "width: 100% !important; height: 7em !important;"
        });
        $(divID).text(normInd + ": " + restObj.name).attr("style", "white-space:nowrap; overflow:hidden;")
        $(divID + "~h5").text("Rating: " + restObj.user_rating.aggregate_rating)
        // $(divID + "~a").attr("href",restObj.url)
        $(divID + "~a.button").attr("href", restObj.menu_url)
        var thisRestCoord = restObj.location.latitude + "," + restObj.location.longitude + "|flag-" + normInd;
        restaurantsCoord.push(thisRestCoord);
    });
    $(".results").removeClass("hide");
    // format to be lat,long|flag-i||lat,long|flag-i
    restaurantsCoord = restaurantsCoord.join("||")
};


// function to just do ajax call and return the response
function callAJAX(url, callback) {
    $.ajax({
        url: url,
        // set api key into request header
        beforeSend: function (xhr) { xhr.setRequestHeader('user-key', zomatoAPIKey); },
        // on success send response object back to callback function
        success: function (response) { callback(response) },
        type: "GET"
    })
}

