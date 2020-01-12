// api to be passed in header
var zomatoAPIKey = "2f37220a29eeef45196157298a495add"
var cuisineType = "Mexican"
var selectedLatitude = 41
var selectedLongitude = -72
var cuisineIDs = []

// button clicks. some may be moved to foundation_scripts or index_scripts
$("#dropdownMenu2~.dropdown-menu>.dropdown-item").on("click", function (event) {
    event.preventDefault();
    cuisineType = $(this).text();
    $("#dropdownMenu2").text(cuisineType);
});
$(".top-bar-right").on("click", function (event) {
    event.preventDefault();
    if (cuisineType === "") {
        searchRestaurant();
    } else {
        getCuisineList();
    };
})
// Future functionality: function gets categories and IDs (categories like delivery, breakfast, nightlife, etc)
// API has no parameters
function getCategoryID() {
    var categoryAPIURL = "https://developers.zomato.com/api/v2.1/categories"
    AJAXControll = false
    function useCategoryResponse(categoryResponse) {
        console.log(categoryResponse)
    }
    callAJAX(categoryAPIURL, useCategoryResponse)
}
// Future functionality: function gets city information such as city-id by Name, or by Lat/Lon 
// API parameters q (query by city name), lat (latitude), lon (longitude), count (max results)
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
    function useCuisineResponse() {
        // populate ... with response
        // or use City ID to call a search
    }
    callAJAX(cityAPIURL, useCuisineResponse)
}

// function gets list of cuisines with IDs within a city or at specified coordinates
// API parameters: city_id (id of the city to search), lat (lattitude), lon (longitude), [city_id or lat & lon required]
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
    callAJAX(cuisineAPIURL, useCuisineResponse)
}
// function called once cuisine API call is successfully complete
// gets cuisine IDs of user selected cuisine type and then calls search restaurant
function useCuisineResponse(response) {
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

// function to search for restaurants, no parameters are required
// variables are built to support future functionality of user input choices
// optional parameters: q (search key word), count (max results up to 20), lat (latitude), lon (longitude),
// radius (around lat/lon in Meters), cuisines (list of comma separated cuisine IDs), category (category IDs),
// sort (sort by cost, rating, real_distance), order (used with sort asc, desc)
function searchRestaurant() {
    var searchAPIURL = "https://developers.zomato.com/api/v2.1/search?count="
    // var searchKeyWord = ""
    // var searchByCategory = ""
    var maxRestaurants = 5
    var sortBy = "&sort=rating"
    var searchByCuisines = ""
    var searchByLat = "&lat=" + selectedLatitude
    var searchByLon = "&lon=" + selectedLongitude
    var orderBy = "&order=desc"
    var searchRadius = 100
    // if there are IDs returned from cuisine search API call
    if (cuisineIDs !== []) {
        // combine them into a string separated by ","
        cuisineIDs.forEach(function (element, index) {
            if (index === 0) {
                searchByCuisines = element.cuisine_id
            } else {
                searchByCuisines += "," + element.cuisine_id
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
getCuisineList();

// called on successful completion of restaurant search, populates restaurant data into HTML
function populateRestaurantInfo(response) {
    var restList = response.restaurants;
    // for each restaurant found...
    restList.forEach((element, index) => {
        var divID = "#TopRated" + (index + 1)
        var restObj = element.restaurant
        console.log(restObj)
        $(divID + ">img").attr({
            "src": restObj.featured_image,
            "style": "width: 100% !important; height: 50% !important;"
        });
        $(divID + " h5:first-of-type").text(restObj.name).attr("style","white-space:nowrap; overflow:hidden;")
        $(divID + " h5:last-of-type").text("Rating: " + restObj.user_rating.aggregate_rating)
        $(divID + " a:first-of-type").attr("href",restObj.url)
        $(divID + " a:last-of-type").attr("href",restObj.menu_url)

    });
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

