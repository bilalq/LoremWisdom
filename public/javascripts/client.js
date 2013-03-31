var request = function (method, callback) {
  $.ajax({
    type: 'GET',
    url: '/' + method,
    success: callback
  });
};

$(document).ready(function() {

  // Handle live loading demos
  var fact = $('.fact');
  var quote = $('.quote');
  function updateBoxes() {
    request('facts', function(response) {
      var response = response[0];
      fact.fadeToggle(function() {
        $(this).text(response.text);
      }).fadeToggle();
    });
    request('quotes', function(response) {
      var response = response[0];
      quote.fadeToggle(function() {
        $(this).html(response.quote + "<br><br> -" + response.author);
      }).fadeToggle();
    });
  }
  updateBoxes();
  setInterval(updateBoxes, 5000);

  // Make buttons work
  function scrollToBottom() {
    $('html, body').animate({scrollTop: $(document).height()}, 1000);
  }

  $('.demo.button').on('click', scrollToBottom);

});
