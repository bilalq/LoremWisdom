var request = function (method, options, callback) {
  if (typeof(options) == "function") {
      callback = options;
      options = {};
  }

  $.ajax({
    type: 'GET',
    data: options,
    url: '/' + method,
    success: callback
  });
};

$(document).ready(function() {

  // Handle live loading demos
  var fact = $('.fact');
  var quote = $('.quote');
  var paragraph = $('.paragraph');

  request('facts', {limit: 15}, function(response) {
    cycle(function(item) {
      fact.fadeToggle(function() {
        $(this).text(item.text);
      }).fadeToggle();
    }, response, 5000);
  });

  request('quotes', {limit: 15}, function(response) {
    cycle(function(item) {
      quote.fadeToggle(function() {
        $(this).html(item.quote + "<br><br> -" + item.author);
      }).fadeToggle();
    }, response, 5000);
  });

  request('paragraph', function(response) {
    paragraph.html(response.paragraph);
  });

  function cycle(manip, data, time, i) {
    if (i == null) {
      i = 0;
    }
    manip(data[i]);
    i = ++i % data.length;
    setTimeout(function() { cycle(manip, data, time, i);}, time);
  }

  // Make buttons work
  function scrollToBottom() {
    $('html, body').animate({scrollTop: $(document).height()}, 1000);
  }

  $('.demo.button').on('click', scrollToBottom);

});
