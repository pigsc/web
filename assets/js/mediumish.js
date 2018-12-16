jQuery(document).ready(function($){
  var offset = 1250;
  var duration = 800;

  jQuery(window).scroll(function() {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.back-to-top').fadeIn(duration);
    } else {
      jQuery('.back-to-top').fadeOut(duration);
    }
  });
  jQuery('.back-to-top').click(function(event) {
    event.preventDefault();
    jQuery('html, body').animate({scrollTop: 0}, duration);
    return false;
  })

  // alertbar later
  $(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 280) {
      $('.alertbar').fadeIn();
    } else {
      $('.alertbar').fadeOut();
    }
  });

  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('nav').outerHeight();

  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    var brandrow = $('.brandrow').css("height");

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
    return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
      // Scroll Down
      $('nav').removeClass('nav-down').addClass('nav-up');
      $('.nav-up').css('top', - $('nav').outerHeight() + 'px');

    } else {
      // Scroll Up
      if(st + $(window).height() < $(document).height()) {
        $('nav').removeClass('nav-up').addClass('nav-down');
        $('.nav-up, .nav-down').css('top', '0px');
      }
    }

    lastScrollTop = st;
  }


  $('.site-content').css('margin-top', $('header').outerHeight() + 'px');
});

function paramsToQueryString(params) {
  return Object.keys(params).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])}).join('&');
}

var YoutubeAPI = new function YoutubeAPI() {
  var self = this;
  var apiKey = 'AIzaSyDQNjzAN3YJHjm8Hyc-x1gW3GEQIWHjdeI';

  self.request = function(url, params) {
    var queryString = paramsToQueryString(params);

    return fetch(url + '?' + queryString, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }).then(function(response) {
      return response.json();
    });
  };

  self.latestVideos = function(params) {
    if (params.playlist) {
      https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLB03EA9545DD188C3&key=MY_API_KEY

      return self.request('https://www.googleapis.com/youtube/v3/playlistItems', {
        key: apiKey,
        part: 'snippet',
        // channelId: 'UC9OluGthYmZo0vsF9IjicFg',
        playlistId: params.playlist,
        // type: 'video',
        // order: params.order || 'date',
        maxResults: params.limit || 3,
      });
    } else {
      return self.request('https://www.googleapis.com/youtube/v3/search', {
        key: apiKey,
        part: 'snippet',
        channelId: 'UC9OluGthYmZo0vsF9IjicFg',
        type: 'video',
        order: params.order || 'date',
        maxResults: params.limit || 3,
      });
    }
  };

  self.videoStats = function(videoId) {
    return self.request('https://www.googleapis.com/youtube/v3/videos', {
      key: apiKey,
      id: videoId,
      part: 'statistics',
    });
  };
};

document.querySelectorAll('[data-youtube-videos]').forEach(function(youtubeVideosElement) {
  var playlist = youtubeVideosElement.dataset.youtubeVideosPlaylist;
  var order = youtubeVideosElement.dataset.youtubeVideosOrder;
  var limit = youtubeVideosElement.dataset.youtubeVideosLimit;

  var youtubeVideos = new Vue({
    el: youtubeVideosElement,
    data: {
      items: [],
      statistics: {},
      playlist: playlist || null,
    },
    mounted() {
      YoutubeAPI.latestVideos({ playlist: playlist, order: order, limit: limit }).then(function(json) {
        youtubeVideos.items = json.items;

        youtubeVideos.items.forEach(function(item) {
          var videoId = youtubeVideos.videoId(item);

          YoutubeAPI.videoStats(videoId).then(function(json) {
            var statistics = json.items[0].statistics;
            youtubeVideos.$set(youtubeVideos.statistics, videoId, statistics)
          });
        });
      });
    },
    methods: {
      timeAgo(time) {
        return timeago().format(time);
      },
      videoId(item) {
        return item.id.videoId || item.snippet.resourceId.videoId;
      },
      numberWithCommas(n) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      videoUrl(item) {
        if (playlist) {
          return 'https://www.youtube.com/watch?v=' + youtubeVideos.videoId(item) + '&list=' + youtubeVideos.playlist;
        } else {
          return 'https://www.youtube.com/watch?v=' + youtubeVideos.videoId(item);
        }
      },
      playlistUrl() {
        if (youtubeVideos && youtubeVideos.playlist) {
          return 'https://www.youtube.com/playlist?list=' + playlist;
        }
      },
    },
  });
});
