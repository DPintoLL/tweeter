$(document).ready(function() {
  console.log("Linked");
  const $tweetArea = $(".new-tweet textarea");

  $tweetArea.on("keydown", function() {
    let $counter = $(this)
      .next()
      .next();

    let charCount = 140 - $tweetArea.val().length;
    $counter.text(charCount);

    if (charCount < 0) {
      $counter.addClass("bad");
    } else {
      $counter.removeClass("bad");
    }
  });
});
