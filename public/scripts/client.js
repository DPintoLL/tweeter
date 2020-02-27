//TODO: --------------------------------------------------------------
//TODO: Clear the textarea after tweet is submitted
//TODO: Handle 'enter' and 'shift+enter' inside textarea
//TODO: Fix code duplication on the scrollToTop function
//DONE: IMPORTANT: Fix CharCounter
//DONE: empty the tweet container and render the db again
//DONE: Long Tweets should overflow to next line
//DONE: Fixed counter XY positioning

//* FUNCTION DEFINITIONS ----------------------------------------------

// Escapes unsafe characters before displaying the tweets
const escapeUnsafeChars = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = tweetData => {
  const sanitizedText = escapeUnsafeChars(tweetData.content.text);
  // Using Moment library to handle date formatting
  const article = `
  <article class="tweet-card">
    <header>
      <img class="user-img" src="${tweetData.user.avatars}" alt="user avatar"/>
      <span class="user-name">${tweetData.user.name}</span>
      <span class="alias">${tweetData.user.handle}</span>
    </header>
      <div class="tweet-body">
        <p>${sanitizedText}</p>
      </div>
    <footer>
      <span class="days-ago">${moment(tweetData.created_at).fromNow()}</span>
      <div class="icons">
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </div>
    </footer>
  </article>`;

  return article;
};

//* ON DOCUMENT READY --------------------------------------------------
$(() => {
  // Receives the JSON response (array of tweet objects)
  const renderTweets = tweetArr => {
    tweetArr.forEach(element => {
      const newTweet = createTweetElement(element);
      $("#tweets-container").prepend(newTweet);
    });
  };

  // Selects the form to append listener
  const $newTweetForm = $("#submit-form");

  // Binds eventListener to the form. AJAX POST request adds new tweets to DB
  $newTweetForm.submit(function(event) {
    // Prevents page reload behaviour
    event.preventDefault();
    console.log("Button clicked, performing ajax call...");

    // Performs basic VALIDATION on textarea text-content
    const $textArea = $("#submit-form textarea").val();
    if ($textArea.length > 140 || $textArea === "" || $textArea === null) {
      console.log("Bad request.");
      // $("#error-msg").removeClass("invisible");
      $("#error-msg").fadeIn(".invisible");
      // alert("Please write a Tweetish up to 140 characters.");
      return;
    }
    // AJAX request that adds new tweet to DB
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $newTweetForm.serialize()
    }).then(function() {
      console.log("Successfully posted new tweet to /tweets");
      loadTweets();
    });
  });

  // Listener that allows closing the error message
  $("#error-close").click(() => {
    $("#error-msg").fadeOut(".invisible");
  });

  // Fetches tweets from the JSON DB through the GET/tweets endpoint
  const loadTweets = function() {
    $.ajax("/tweets", { method: "GET" }).then(tweets => {
      console.log("Successfully retrieved tweets from GET/tweets ", tweets);

      // Empties tweets container so that timestamps are properly refreshed
      $("#tweets-container").empty();
      renderTweets(tweets);

      //! OLD - USED TO render the single latest tweet back to be prepended
      // const newTweetToBeRendered = [];
      // newTweetToBeRendered.push(tweets[tweets.length - 1]);
      // renderTweets(newTweetToBeRendered);
    });
  };

  // Slide New Tweet box
  const newTweetSlider = function() {
    $("div.motto").click(() => {
      $("section.new-tweet").slideToggle("fast");
    });
  };

  // Displays the Go Up button when user scrolls
  $(document).scroll(function() {
    let y = $(this).scrollTop();
    // If user scrolls down more than 120px displays the button
    if (y > 120) {
      $(".top-visible").fadeIn();
    } else {
      $(".top-visible").fadeOut();
    }
  });

  // When user clicks the button scrolls to the top of the page
  $("#top").click(() => {
    // $(document).scrollTop(0);
    let position =
      document.body.scrollTop || document.documentElement.scrollTop;
    if (position) {
      //   window.scrollBy(0, -Math.max(1, Math.floor(position / 10)));
      scrollAnimation = setTimeout("scrollToTop()", 5);
    } else clearTimeout(scrollAnimation);
    // The scroll to top button will fade out
    $("#top").addClass(".invisible");
  });

  newTweetSlider();
  loadTweets();
});

function scrollToTop() {
  var position = document.body.scrollTop || document.documentElement.scrollTop;
  if (position) {
    window.scrollBy(0, -Math.max(1, Math.floor(position / 10)));
    scrollAnimation = setTimeout("scrollToTop()", 5);
  } else clearTimeout(scrollAnimation);
}
