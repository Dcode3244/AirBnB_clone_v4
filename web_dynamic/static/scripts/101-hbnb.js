$(document).ready(function () {

  let states = {};
  $('.locations > UL > H2 > INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let cities = {};
  $('.locations > UL > UL > LI INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let amenities = {};
  $('.amenities INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities H4').html('&nbsp;');
    } else {
      $('.amenities H4').text(Object.values(amenities).join(', '));
    }
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

  // fetch data about places based on amenities
  $('BUTTON').click(function () {
    $.post({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({
	'states': Object.keys(states),
	'cities': Object.keys(cities),
        'amenities': Object.keys(amenities)
      }),
      headers: {
        "Content-Type": "application/json",
      },
      dataType: 'json',
      success: appendPlaces
    });
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
      <div class="reviews" data-place="${place.id}">
        <h2></h2>
        <ul></ul>
      </div>
    </article>`
    )
    fetchReviews(place.id);
  );
}

function fetchReviews(placeId) {
  $.get(
    'http://0.0.0.0:5001/api/v1/places/${placeId}/reviews',
    (data) => {
      $(`.reviews[data-place="${placeId}"] h2`)
        .text("test")
        .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
      $(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind(
	"click",
	{ placeId },
	function (e) {
	  const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);
	  if (rev.css("display") === "none") {
	    rev.css("display", "block");
	    data.forEach((r) => {
	      $.get(
		'http://0.0.0.0:5001/api/v1/users/${r.user_id}`,
		(u) =>
		  $(".reviews ul").append(`
		<li>
		  <h3>From ${u.first_name + " " + u.last_name} the ${
		    r.created_at
		  }</h3>
		  <p>${r.text}</p>
		</li>`),
		"json"
	      );
	    });
	  } else {
	    rev.css("display", "none");
	  }
	}
      );
    },
    dataType: "json"
  );
}
