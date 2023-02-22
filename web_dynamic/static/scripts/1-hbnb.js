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
});
