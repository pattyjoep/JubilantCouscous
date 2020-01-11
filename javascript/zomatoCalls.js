// api to be passed in header
var zomatoAPIKey = "2f37220a29eeef45196157298a495add"
var cuisineType = "Mexican"
var selectedLatitude = 41
var selectedLongitude = -72
var cuisineIDs = []

// button clicks. some may be moved to foundation_scripts or index_scripts
$("#dropdownMenu2~.dropdown-menu>.dropdown-item").on("click", function (e) {
    e.preventDefault();
    cuisineType = $(this).text();
    $("#dropdownMenu2").text(cuisineType);
});


// function gets categories and IDs (categories like delivery, breakfast, nightlife, etc)
// api has no parameters
function getCategoryID() {
    var categoryAPIURL = "https://developers.zomato.com/api/v2.1/categories"
    AJAXControll = false
    function useCategoryResponse(categoryResponse) {
        console.log(categoryResponse)
    }
    callAJAX(categoryAPIURL, useCategoryResponse)
}


// function gets city information such as city-id by Name, or by Lat/Lon 
// parameters q (query by city name), lat (latitude), lon (longitude), count (max results)
function getCityInfo() {
    var cityAPIURL = "https://developers.zomato.com/api/v2.1/cities?count="
    var searchCity = ""
    var searchCityLongitude = 0
    var searchCityLatitude = 0
    var maxSearchResult = 1
    cityAPIURL = cityAPIURL + maxSearchResult
    if (searchCity !== "") {
        cityAPIURL = cityAPIURL + "&q=" + searchCity
    }
    else if (searchCityLatitude !== 0 && searchCityLongitude !== 0) {
        cityAPIURL = cityAPIURL + "&lat=" + searchCityLatitude + "&long=" + searchCityLongitude
    } else {
        // error code goes here, remember NO ALERTS
        // return out of function after error
    }
    function useCityResponse() {
        // populate ... with response
        // or use City ID to call a search
    }
    callAJAX(cityAPIURL, useCityResponse)
}

//  function gets list of cusines with IDs within a city or at specified coordinates
// parameters: city_id (id of the city to search), lat (lattitude), lon (longitude), [city_id or lat & lon required]
function getCuisineList() {
    var cuisineAPIURL = "https://developers.zomato.com/api/v2.1/cuisines?";
    var searchCuisineCity = "";
    var searchCuisineLat = selectedLatitude;
    var searchCuisineLon = selectedLongitude;
    if (searchCuisineCity !== "") {
        cuisineAPIURL += "city_id=" + searchCuisineCity;
    }
    else {
        cuisineAPIURL = cuisineAPIURL + "lat=" + searchCuisineLat + "&lon=" + searchCuisineLon
    }
    function useCityResponse(response) {
        cuisineIDs = []
        response.cuisines.forEach(element => {
            if (element.cuisine.cuisine_name === cuisineType) {
                cuisineIDs.push({
                    cuisine_id: element.cuisine.cuisine_id,
                    cuisine_name: element.cuisine.cuisine_name
                })
            }
        });
        searchRestaurant()
    }
    callAJAX(cuisineAPIURL, useCityResponse)

}

// function to search for restaurants, no parameters are required
// parameters: q (search key word), count (max results up to 20), lat (latitude), lon (longitude),
// radius (around lat/lon in Meters), cuisines (list of comma separated cuisine IDs), category (category IDs),
// sort (sort by cost, rating, real_distance), order (used with sort asc, desc)
function searchRestaurant() {
    var searchAPIURL = "https://developers.zomato.com/api/v2.1/search?count="
    var searchKeyWord = ""
    var maxRestaurants = 5
    var sortBy = "&sort=rating"
    var searchByCuisines = ""
    var searchByLat = "&lat=" + selectedLatitude
    var searchByLon = "&lon=" + selectedLongitude
    var orderBy = "&order=desc"
    var searchRadius = 100
    var searchByCategory = ""
    if (cuisineIDs !== []) {
        cuisineIDs.forEach(function(element, index) {
            if (index === 0) { 
                searchByCuisines = element.cuisine_id
            } else {
                searchByCuisines += "," + element.cuisine_id
            }
            
        });
    }
    // if (userDefinedMax) {maxRestaurants = userDefinedMax}
    // if (userDefinedSort) {sortBy = "&sort=" + userDefinedSort}
    // if (userDefinedOrder) {orderBy = "&order=" + userDefinedOrder}
    // if (userDefinedRadius) {searchRadius = userDefinedRadius}
    // get cuisine IDs? or hard code...
    // get category IDs? or hard code...
    // get Lon/Lat by user or by city search....
    searchRadius = searchRadius * 1610
    searchAPIURL = searchAPIURL + maxRestaurants + sortBy + orderBy + "&radius=" + searchRadius + searchByLat + searchByLon
    if (searchKeyWord !== "") { searchAPIURL = searchAPIURL + "&q=" + searchKeyWord }
    if (searchByCuisines !== "") { searchAPIURL = searchAPIURL + "&cuisines=" + searchByCuisines }
    if (searchByCategory !== "") { searchAPIURL = searchAPIURL + "&category=" + searchByCategory }
    function useRestResp(response) {
        console.log(response)
    }
    callAJAX(searchAPIURL, useRestResp)

}
getCuisineList();

// function to just do ajax call and return the response
function callAJAX(url, callback) {
    $.ajax({
        url: url,
        beforeSend: function (xhr) { xhr.setRequestHeader('user-key', zomatoAPIKey); },
        success: function (response) { callback(response) },
        type: "GET"
    })
}

