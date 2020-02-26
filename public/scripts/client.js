// Function Definitions
const createTweetElement = tweetData => {
  // Using Moment library to handle date formatting
  const article = `
  <article class="tweet-card">
  <header>
  <img class="user-img" src="${tweetData.user.avatars}" alt="user avatar"/>
      <span class="user-name">${tweetData.user.name}</span>
      <span class="alias">${tweetData.user.handle}</span>
      </header>
      <div class="tweet-body">
      <p>${tweetData.content.text}</p>
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
  const renderTweets = tweetArr => {
    tweetArr.forEach(element => {
      const newTweet = createTweetElement(element);
      $("#tweets-container").prepend(newTweet);
    });
  };

  //? - NTS: This function is not invoked explicitly, only when the page is loaded (by jQuery's $(document).ready). Should it be invoked somewhere?
  // $(function() {
  // });

  // EventListener for Form Submission. AJAX POST request adds new tweets to DB
  const $newTweetForm = $("#submit-form");
  $newTweetForm.submit(function(event) {
    // Selects the Form and the contents of the textarea
    const $textArea = $("#submit-form textarea").val();

    // Prevents page reload behaviour
    event.preventDefault();

    console.log("Button clicked, performing ajax call...");

    // Performs basic validation on textarea text-content
    if ($textArea.length > 140 || $textArea === "" || $textArea === null) {
      console.log("Bad request.");
      alert("Please write a Tweetish up to 140 characters.");
      return;
    }

    //! TO-DO -----------------------------------------------------
    //! Capture and update timestamps of previous tweets ----------
    // const timeStampsArr = document.querySelectorAll("timeStamps");
    const $timeStampsArr = $(".days-ago");
    // timeStampsArr.forEach(el => (el.val = moment(el.val).fromNow()));
    //! -----------------------------------------------------------

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

      // Right now renders the single latest tweet back to be prepended
      const newTweetToBeRendered = [];
      newTweetToBeRendered.push(tweets[tweets.length - 1]);
      renderTweets(newTweetToBeRendered);
    });
  };

  loadTweets();
});
