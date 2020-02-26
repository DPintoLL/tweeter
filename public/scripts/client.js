// jQuery's document ready function:
$(() => {
  // import Moment library to handle time

  // const tweetData = [
  //   {
  //     user: {
  //       name: "Newton",
  //       avatars: "https://i.imgur.com/73hZDYK.png",
  //       handle: "@SirIsaac"
  //     },
  //     content: {
  //       text:
  //         "If I have seen further it is by standing on the shoulders of giants"
  //     },
  //     created_at: 1461116232227
  //   },
  //   {
  //     user: {
  //       name: "Descartes",
  //       avatars: "https://i.imgur.com/nlhLi3I.png",
  //       handle: "@rd"
  //     },
  //     content: {
  //       text: "Je pense , donc je suis"
  //     },
  //     created_at: 1461113959088
  //   }
  // ];

  const createTweetElement = tweetData => {
    const article = `
    <article class="tweet-card">
      <header>
        <img class="user-img" src="${
          tweetData.user.avatars
        }" alt="user avatar"/>
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

  const renderTweets = tweetArr => {
    tweetArr.forEach(element => {
      const newTweet = createTweetElement(element);
      $("#tweets-container").prepend(newTweet);
    });
  };

  // AJAX POST request that sends the form data (new tweets) to the server.
  $(function() {
    // Selects the Form
    const $newTweetForm = $("#submit-form");

    // Add eventListener and prevent default
    $newTweetForm.submit(function(event) {
      event.preventDefault();
      console.log("Button clicked, performing ajax call...");

      // AJAX method
      $.ajax("/tweets", {
        method: "POST",
        data: $newTweetForm.serialize()
      }).then(function() {
        console.log("Successfully posted new tweet to /tweets");
      });
    });
  });

  // Fetches tweets from the JSON DB through the GET/tweets endpoint
  const loadTweets = function() {
    $.ajax("/tweets", { method: "GET" }).then(tweets => {
      console.log("Successfully retrieved tweets from GET/tweets ", tweets);
      renderTweets(tweets);
    });
  };

  loadTweets();
});
