//TODO: --------------------------------------------------------------
//! DONE empty the tweet container and render the db again
//TODO: Handle 'enter' and 'shift+enter' inside textarea
//TODO:

//* Function Definitions

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

// jQuery's document ready function:
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
      alert("Please write a Tweetish up to 140 characters.");
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

  // Fetches tweets from the JSON DB through the GET/tweets endpoint
  const loadTweets = function() {
    $.ajax("/tweets", { method: "GET" }).then(tweets => {
      console.log("Successfully retrieved tweets from GET/tweets ", tweets);
      $("#tweets-container").empty();
      renderTweets(tweets);
      //! OLD - Right now renders the single latest tweet back to be prepended
      // const newTweetToBeRendered = [];
      // newTweetToBeRendered.push(tweets[tweets.length - 1]);
      // renderTweets(newTweetToBeRendered);
    });
  };

  loadTweets();
});
