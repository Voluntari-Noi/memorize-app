$(document).ready(function() {
  $(".blank-words-test").BlankWordsTest();
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

$.fn.BlankWordsTest = function() {
  var texts = [];
  var text_definition = "[Cuvântul] Tău este o [candelă] pentru [picioarele] mele și o [lumină] pe [cărarea] mea.";
  var reg = /(?<=\[).+?(?=\])/g;
  var text_correct = text_definition.split("[").join("").split("]").join("");  // replace all [] with nothing
  var text_hidden = text_definition.match(reg);  // Extract the list of hidden words

  var $HTML_WIP = "<div class='text-with-blank'><p>***</p></div>";
  var $HTML_WIP2 = "<span class='blank'>__________</span>";
  var $text_def = text_definition.replace(/\[(.+?)\]/g, $HTML_WIP2);
  var $HTML_WIP3 = $HTML_WIP.split("***").join($text_def);
  var $HTML_to_display2 = $HTML_WIP3;

  shuffle(text_hidden);

  var $HTML_to_display = $("div.text-with-blank");
  $HTML_to_display.find("span").replaceWith(function() {return "<div class='blank'>__________</div>";});
  $(".blank-words-left").html($HTML_to_display2);

  for (var index in text_hidden) {
    var $new_word = $("<div>").addClass("word").html(text_hidden[index]);
    $(".blank-words-right").append($new_word);
  }

  var number_words_to_drop = 0;
  var alerted_fail = false;

  $(".word").draggable({ revert: true, cursor: "pointer", containment: ".blank-words-test" });
  $(".blank-words-right").droppable({
    drop: function(ev, ui) {
      $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
      $(ui.draggable).removeClass('dropped');

      $(".blank").each(function() {
        if($(this).html() == "") {
          $(this).text("__________");
          $(this).droppable('enable');
        }
      });
    }
  });

  $(".blank").droppable({
    drop: function(ev, ui) {
      $(this).text("");

      $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
      $(ui.draggable).addClass('dropped');

      number_words_to_drop = $(".blank-words-right div.word:not(.dropped)").length;

      $(this).droppable('disable');

      $(".blank").each(function() {
        if($(this).html() == "") {
          $(this).text("__________");
          $(this).droppable('enable');
        }
      });

      if(number_words_to_drop == 0) {
        var text_tried = $("div.blank-words-left p").text();

        if(text_tried == text_correct) {
          $(".blank-words-status").html("<p class='status-succes-text'><b> <i class='fa fa-check'></i></b></p>");
          swal("🎉 Felicitări! ", "Ai învățat un verset!");
          $(".word").css("pointer-events","none");
        } else {
          if(alerted_fail == false) {
            swal("Ai greșit!❌", "Încearcă din nou.");
          }

          setTimeout(function()
          {
            $(".word").appendTo('.blank-words-right');
            $(".word").removeClass('dropped');

            $( ".blank" ).each(function() {
              if($(this).html() == "") {
              $(this).text("__________");
              $(this).droppable('enable');
              }
            });
          }, 3000);
        }
      }
    }
  });
}
