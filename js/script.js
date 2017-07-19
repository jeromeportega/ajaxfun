
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var streetViewUrl = '<img class="bgimage" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + streetStr + cityStr + '" />';

    $body.append(streetViewUrl);

    var nyTimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=3c6a8dc14dda4ccdb79dd8d3bd6a824f';

    $.getJSON(nyTimesUrl, function(data) {
      $nytHeaderElem.text('New York Times Articles About ' + cityStr);
      articles = data.response.docs;
      for(var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' +
            '<a href="' + article.web_url + '">' + article.headline.main +
                '</a>' +
            '<p>' + article.snippet + '</p>' +
        '</li>');
      }
    }).fail( function() {
      $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      success: function( response ) {
        var articleList = response[1];

        for(var i = 0; i < articleList.length; i++) {
          articleStr = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        };
        clearTimeout(wikiRequestTimout);
      }
    })

    return false;
};

$('#form-container').submit(loadData);
