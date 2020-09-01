$(document).ready(function() {
  $(".multiple-choice-test").MultipleChoiceTest();
  $(".category-sorting-test").SortTest();
  $(".blank-words-test").BlankWordsTest();
});

function printDiv(divName) {
     window.print();
}

function shuffle(array) {
  var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

$.fn.MultipleChoiceTest = function(){
  function getRadioValue (radio_button_name) {
    if( $('input[name=' + radio_button_name + ']:radio:checked').length > 0 ) {
        return $('input[name=' + radio_button_name + ']:radio:checked').val();
    }
    else {
        return 0;
    }
  }

  var definition = $(".definition", this);
  var questions = [];

  $( ".question-text" ).each(function() {
    var question_text = $(this).text();
    var question_answer = $(this).parent().children( ".question-answer" ).text();
    questions.push({question_text: question_text, question_answer: question_answer});
  });

  var question_number = 0;
  $( ".question-text" ).each(function(){
    ++question_number;
    var $new_question_text = $("<div>")
                  .addClass("question-text")
                  .html("<div><p>" + $(this).text() + "</p></div>");
    var $new_answers = $("<div>").html(
      '<p><label class="radio inline control-label"><input type="radio" name="question-number-'+ question_number +'" value="True" /><b>✔</b></label>'+
      '<label class="radio inline control-label"><input type="radio" name="question-number-'+ question_number +'" value="False" /><b>&times;</b></label></p>'
      );

    //$(".questions").append($new_question_text);
    //$(".answers").append($new_answers);
    var row_text = '<div class="question-row">' + $new_question_text.html() + '<div class="answer-col">' + $new_answers.html() + '</div></div>';
    $(".questions").append(row_text);
  });

  var alerted_fail = false;
  $(":radio").change(function() {
    var names = {};
    $(':radio').each(function() {
        names[$(this).attr('name')] = true;
    });
    var count = 0;
    $.each(names, function() {
        count++;
    });
    if ($(':radio:checked').length === count) {
      var incorrect_answers = 0; //number of incorrect answers
      for (var question_number = 1; question_number <= questions.length; question_number++) {
        answer = getRadioValue('question-number-' + question_number);
        right_answer = questions[question_number-1].question_answer;

        if(answer != right_answer) {
          incorrect_answers++;
        }
      }

      if(incorrect_answers == 0) {
        $( ".multiple-choice-test-status" )
          .html("<p class='status-succes-text'><b><i class='fa fa-check'></i></b></p>");
        alert("Bravooo!");

        $("[type=radio]").each(function(){
          $(this).attr('disabled',true);
        });
      } else {
        if (alerted_fail == false) {
          alert("Nuuuu");
        }

        setTimeout(function()
        {
          $("[type=radio]").each(function(){
            if($(this).is(':checked')) {
              $(this).prop('checked', false);
            }

          });
        }, 3000);
      }
    }
  }).change();
}

// ASSIGNMENT TEST
$.fn.SortTest = function(){
  var definition = $(".definition", this);
  var items = [];

  $( ".possible-item" ).each( function() {
    var itemName = $(this).text();
    var itemCategory = $(this).parent().children( ".title" ).text();
    items.push({itemName: itemName, itemCategory: itemCategory});
  });

  shuffle(items);

  var number_selected_items = parseInt($( ".number_selected_items" ).text());
  items = items.slice(0,number_selected_items);

  $( ".title" ).each(function(){
    var $newCateg = $("<div>" )
                  .addClass("category ui-widget-header")
                  .html("<div><h4>" + $(this).text() + "</h4></div>");

    $(".sorting-test-categories").append($newCateg);
  });

  for (var index in items){
      var $newItem = $("<div>")
          .addClass( "item ui-widget-content" )
          .html("<div>" + items[index].itemName + "</div>");
    $( ".sorting-test-items" ).append($newItem);
  }

  $(".possible-item").each(function(){
    is_choosen_item = false;
    for (var index in items){
      if($(this).text().trim() == items[index].itemName.trim()) {
        is_choosen_item = true;
      }
    }
    if(!is_choosen_item){
      $(this).remove();
    }
  });

  var numberItemsToDrop = items.length;
  var alerted_fail = false;

  $( ".item" ).draggable({ snap: true, revert: true, cursor: "pointer", containment: ".category-sorting-test" });
  $( ".sorting-test-items" ).droppable({
    drop: function(ev, ui) {
      $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
      $(ui.draggable).removeClass('dropped');

      $( ".blank" ).each(function() {
        if($(this).html() == "") {
          $(this).text("__________");
        }
      });
    }
  });

  $( ".category" ).droppable({
    drop: function(ev, ui) {

      $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
      $(ui.draggable).addClass('dropped');

      numberItemsToDrop = $( ".sorting-test-items div.item:not(.dropped)" ).length;

      var test_completed = true;
      if(numberItemsToDrop == 0) {
        $( ".item" ).each( function() {
          var itemName = $(this).text();
          var itemCategory = $(this).parent().find('h4').text();
          var $category = $(".possible-item:contains('" + itemName + "')").parent('.category');

          var is_proper_category = $category.children(".title").filter(function() {
            return $(this).text().trim() == itemCategory;
          }).length;

          if (is_proper_category === 0) test_completed = false;
        });

        if(test_completed) {
          $( ".sorting-test-status" )
            .html("<p class='status-succes-text'><b><i class='fa fa-check'></i></b></p>");
          alert("Bravo!");

          $(".item").css("pointer-events","none");

        } else {
          if (alerted_fail == false) {
            alert("Nuuu");
          }

          setTimeout(function()
          {
            $(".sorting-test-categories").html("");
            $(".sorting-test-items").html("");
            $(".category-sorting-test").SortTest();

            // on start: assignment test -> restore on-drop tracker.js event
            $(".category.ui-droppable").on("drop", function(event) {
                on_start("A");
            });

          }, 3000);

        }
      }
    }
  });
}

// BLANK WORDS TEST
$.fn.BlankWordsTest = function(){
  var definition = $(".definition", this);

  var text_correct = $( "div.text-with-blank p" ).text();
  var number_extra_words = $( "div.extra-words span" ).length;

  var text_hidden = [];

  $( ".text-hidden" ).each( function() {
    var hidden_word = $(this).text();
    text_hidden.push({hidden_word: hidden_word});
  });


  // -------------------
  // Trying to have the definition in js not HTML. Next step: choose a random text.




  var text_definition = "Lorem [ipsum] dolor [sit] amet.";
  text_correct = text_definition.split("[").join("").split("]").join("");  // replace all [] with nothing
  text_hidden = [
    {hidden_word: "ipsum"},
    {hidden_word: "sit"}
  ];

  $HTML_WIP  = "<div class='text-with-blank'><p>***</p></div>";
  $HTML_WIP2 = "<span class='blank'>__________</span>";
  $text_def = text_definition.replace(/\[(.+?)\]/g, $HTML_WIP2);
  $HTML_WIP3 = $HTML_WIP.split("***").join($text_def);
  $HTML_to_display2 = "<div class='text-with-blank'><p>Lorem <span class='blank'>__________</span> dolor <span class='blank'>_________</span> amet.</p></div>";
  shuffle(text_hidden);

  var $HTML_to_display = $( "div.text-with-blank" );
  $HTML_to_display.find("span").replaceWith(function() { return "<div class='blank'>__________</div>"; });
  $( ".blank-words-left" ).html($HTML_to_display2);






  // --------------------

  for (var index in text_hidden) {
      var $new_word = $("<div>")
          .addClass( "word" )
          .html(text_hidden[index].hidden_word);
    $( ".blank-words-right" ).append($new_word);
  }

  var number_words_to_drop = 0;
  var alerted_fail = false;

  $( ".word" ).draggable({ revert: true, cursor: "pointer", containment: ".blank-words-test" });
  $( ".blank-words-right" ).droppable({
    drop: function(ev, ui) {
      $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
      $(ui.draggable).removeClass('dropped');

      $( ".blank" ).each(function() {
        if($(this).html() == "") {
          $(this).text("__________");
          $(this).droppable('enable');
        }
      });
    }
  });

  $( ".blank" ).droppable({
    drop: function(ev, ui) {

      $(this).text("");

      $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
      $(ui.draggable).addClass('dropped');

      number_words_to_drop = $( ".blank-words-right div.word:not(.dropped)" ).length - number_extra_words;

      $(this).droppable('disable');

      $( ".blank" ).each(function() {
        if($(this).html() == "") {
          $(this).text("__________");
          $(this).droppable('enable');
        }
      });

      if(number_words_to_drop == 0) {
        var text_tried = $( "div.blank-words-left p" ).text();

        if(text_tried == text_correct) {
          $( ".blank-words-status" )
            .html("<p class='status-succes-text'><b> <i class='fa fa-check'></i></b></p>");
          alert("Bravo!");

          $(".word").css("pointer-events","none");
        } else {
          if (alerted_fail == false) {
            alert("Nuuu");
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
