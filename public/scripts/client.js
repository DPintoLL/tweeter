// jQuery's document ready function:
$(() => {
  // import Moment library to handle time

  const tweetData = [
    {
      user: {
        name: "Newton",
        avatars: "https://i.imgur.com/73hZDYK.png",
        handle: "@SirIsaac"
      },
      content: {
        text:
          "If I have seen further it is by standing on the shoulders of giants"
      },
      created_at: 1461116232227
    },
    {
      user: {
        name: "Descartes",
        avatars: "https://i.imgur.com/nlhLi3I.png",
        handle: "@rd"
      },
      content: {
        text: "Je pense , donc je suis"
      },
      created_at: 1461113959088
    }
  ];

  // <i class="user-img fas fa-user-astronaut fa-2x"></i>
  const createTweetElement = tweetData => {
    // typeof tweet === 'object'
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

  const renderTweets = tweetArr => {
    tweetArr.forEach(element => {
      const newTweet = createTweetElement(element);
      $("#tweets-container").prepend(newTweet);
    });
  };

  renderTweets(tweetData);
});
