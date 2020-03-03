$(document).ready(function() {
  const $tweetArea = $(".new-tweet textarea");

  // Listens for input being typed into textarea and updates counter
  $tweetArea.on("input", function() {
    let $counter = $(this)
      .next()
      .next();

    let charCount = 140 - $tweetArea.val().length;
    $counter.text(charCount);

    // These classes apply appropriate display behaviour to the counter (turn red and bigger if > 140 chars && keep them aligned)
    if (charCount < 0) {
      $counter.removeClass("counter-XY-pos");
      $counter.addClass("bad");
    } else {
      $counter.removeClass("bad");
      $counter.addClass("counter-XY-pos");
    }
  });
});
