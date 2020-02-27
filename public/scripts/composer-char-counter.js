$(document).ready(function() {
  console.log("Linked");
  const $tweetArea = $(".new-tweet textarea");

  $tweetArea.on("keydown keyup", function() {
    let $counter = $(this)
      .next()
      .next();

    let charCount = 140 - $tweetArea.val().length;
    $counter.text(charCount);

    //TODO: EXPLAIN THESE CLASSES
    if (charCount < 0) {
      $counter.removeClass("counter-XY-pos");
      $counter.addClass("bad");
    } else {
      $counter.removeClass("bad");
      $counter.addClass("counter-XY-pos");
    }
  });
});
