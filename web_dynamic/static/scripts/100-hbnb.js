$(function () {
  const amenities = {};
  $('.amenities input[type=checkbox]').change(function (e) {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if (e.target.checked) {
      amenities[id] = name;
    } else {
      delete amenities[id];
    }
    $('.amenities h4').text(Object.values(amenities).join(', '));
  });

  const states = {};
  $('input[type=checkbox].s_input').change(function (e) {
    const s_id = $(this).attr('data-id');
    const s_name = $(this).attr('data-name');
    if (e.target.checked) {
      states[s_id] = s_name;
    } else {
      delete states[s_id]
    }
  })

  const cities = {};
  $('input[type=checkbox].c_input').change(function (e) {
    const c_id = $(this).attr('data-id');
    const c_name = $(this).attr('data-name');
    if (e.target.checked) {
      cities[c_id] = c_name;
    } else {
      delete cities[c_id]
    }
  })

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: successHandler
  });

  $('button').click(function () {
    const amenityIds = Object.keys(amenities);
    const stateIds = Object.keys(states);
    const cityIds = Object.keys(cities);
    $('section.places').empty();
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      type: 'POST',
      data: JSON.stringify({ 'amenities': amenityIds, 'states': stateIds, 'cities': cityIds }),
      contentType: 'application/json',
      dataType: 'json',
      success: successHandler
    });
  });
});

function successHandler (data) {
  $('SECTION.places').append(data.map(place => {
    return `<ARTICLE>
                  <DIV class="title_box">
                    <H2>${place.name}</H2>
                    <DIV class="price_by_night">
                      $${place.price_by_night}
                    </DIV>
                  </DIV>
                  <DIV class="information">
                    <DIV class="max_guest">
                      <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                      </BR>
                      ${place.max_guest} Guests
                    </DIV>
                    <DIV class="number_rooms">
                      <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                      </BR>
                      ${place.number_rooms} Bedrooms
                    </DIV>
                    <DIV class="number_bathrooms">
                      <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                      </BR>
                      ${place.number_bathrooms} Bathrooms
                    </DIV>
                  </DIV>
                  <DIV class="description">
                    ${place.description}
                  </DIV>
                </ARTICLE>`;
  }));
}
