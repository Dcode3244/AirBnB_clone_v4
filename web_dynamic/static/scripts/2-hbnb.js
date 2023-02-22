$(function () {
  const amenities = {};
  $('input[type=checkbox]').change(function (e) {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if (e.target.checked) {
      amenities[id] = name;
    } else {
      delete amenities[id];
    }
    $('.amenities h4').text(Object.values(amenities).join(', '));
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
});
