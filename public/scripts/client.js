//* FUNCTION DEFINITIONS ----------------------------------------------

// Escapes unsafe characters before displaying the tweets
const escapeUnsafeChars = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Creates a tweetish card to be added to the app
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

// Scrolls the viewport smoothly to the top
const smoothScrollTop = function() {
  if (
    document.body.scrollTop !== 0 ||
    document.documentElement.scrollTop !== 0
  ) {
    window.scrollBy(0, -50);
    requestAnimationFrame(smoothScrollTop);
  }
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

  // Selects the form that will receive a listener
  const $newTweetForm = $("#submit-form");

  // Binds eventListener to the form. AJAX POST request adds new tweets to DB
  $newTweetForm.submit(function(event) {
    // Prevents page reload behaviour
    event.preventDefault();
    console.log("Button clicked, performing ajax call...");

    // Performs basic VALIDATION on textarea text-content
    const $textArea = $("#submit-form textarea");
    if ($textArea.val().length > 140 || !$textArea.val()) {
      $("#error-msg").fadeIn(".invisible");
      return;
    }

    // AJAX request that adds new tweet to DB
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $newTweetForm.serialize()
    }).then(function() {
      // Resets the textarea, the char counter; clear errorMsg if present
      $textArea.val("");
      $("#error-msg").fadeOut(".invisible");
      // Renders tweets to the page
      loadTweets();
    });
    $("#submit-form > span.counter")[0].innerText = 140;
    $textArea.blur();
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
    });
  };

  // Slide New Tweet box
  const newTweetSlider = function() {
    $("div.motto").click(() => {
      $("section.new-tweet").addClass("active");
      $("section.new-tweet").slideToggle("slow");
      $("#submit-form textarea").focus();
    });
  };

  // Toggles classes that perform animation on "Tweet" button and char counter
  $("textarea").on("focus", () => {
    const $form = $("textarea").parent("form");
    $form.addClass("active");
  });
  $("textarea").on("blur", () => {
    const $form = $("textarea").parent("form");
    $form.removeClass("active");
  });

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

  // When user clicks the UP button page is scrolled up smoothly
  $("#top").click(() => {
    smoothScrollTop();
    // The scroll to top button will fade out
    $("#top").addClass(".invisible");
  });

  // Prevents multiples submissions if enter key is pressed and held.
  $("#submit-form textarea").keydown(event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  });
  // Pressing enter will submit the form; at the same time let users do shift+enter if desirable. The input will still be escaped and serialized, so text won't be displayed with line breaks. That is the desired effect.
  $("#submit-form textarea").keyup(event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      $newTweetForm.submit();
      $(this).blur();
    }
  });

  // Initializes Web Page
  newTweetSlider();
  loadTweets();
});
