$(document).ready(function () {
  let amenities = {};
  $('INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities H4').text(Object.values(amenities).join(', '));
  });

  // get status of API
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  // fetch data about places
  $.post({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: appendPlaces
  });
});

function appendPlaces (data) {
  $("section.places").empty();
  data.forEach((place) =>
    $("section.places").append(
    `<article>
      <div class="title_box">
	<h2>${place.name}</h2>
	<div class="price_by_night">$${place.price_by_night}</div>
      </div>
      <div class="information">
	<div class="max_guest">${place.max_guest} Guest${
	    		place.max_guest !== 1 ? "s" : ""
	}</div>
	<div class="number_rooms">${place.number_rooms} Bedroom${
			place.number_rooms !== 1 ? "s" : ""
	}</div>
	<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
			place.number_bathrooms !== 1 ? "s" : ""
	}</div>
      </div> 
      <div class="description">
	${place.description}
      </div>
    </article>`
    )
  );
}
