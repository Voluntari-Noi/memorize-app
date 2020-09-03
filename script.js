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
  var all_texts = [
    "[Cuvântul] Tău este o [candelă] pentru [picioarele] mele și o [lumină] pe [cărarea] mea. (Psalmii 119:105)",
    "Să [ascultăm], dar, [încheierea] tuturor [învățăturilor]: Teme-te de [Dumnezeu] și păzește [poruncile] Lui. Aceasta este [datoria] oricărui om. (Eclesiastul 12:13)",
    "Omul [socotește] că toate [căile] lui sunt fără [prihană], dar Cel ce [cercetează] inimile este [Domnul]. (Proverbe 21:2)",
    "Puii de [leu] duc [lipsă] și li-e [foame], dar cei ce [caută] pe Domnul nu duc lipsă de [niciun] bine. (Psalmii 34:10)",
    "Domnul va [sfârși] ce a [început] pentru mine. Doamne, [bunătatea] Ta ține în [veci]: nu părăsi [lucrările] mâinilor Tale. (Psalmii 138:8)",
    "Împrietenește-te dar cu [Dumnezeu] și vei avea [pace]; te vei [bucura] astfel iarăși de [fericire]. (Iov 22:21)",
    "În adevăr, cei ce [trăiesc] după îndemnurile firii [pământești] umblă după lucrurile [firii] pământești; pe când cei ce trăiesc după [îndemnurile] Duhului umblă după lucrurile [Duhului]. (Romani 8:5)"
  ];
  var number_of_texts = all_texts.length;
  var random_index = Math.floor(Math.random() * (number_of_texts));
  var text_definition = all_texts[random_index];

/*

Romani 8
31. Deci ce vom zice noi în fața tuturor acestor lucruri? Dacă Dumnezeu este pentru noi, cine va fi împotriva noastră?
Romani 8
38. Căci sunt bine încredințat că nici moartea, nici viața, nici îngerii, nici stăpânirile, nici puterile, nici lucrurile de acum, nici cele viitoare,
39. nici înălțimea, nici adâncimea, nicio altă făptură, nu vor fi în stare să ne despartă de dragostea lui Dumnezeu care este în Isus Hristos, Domnul nostru.
Evrei 13
8. Isus Hristos este același ieri și azi și în veci!
1 Petru 4
17. Căci suntem în clipa când judecata stă să înceapă de la Casa lui Dumnezeu. Și, dacă începe cu noi, care va fi sfârșitul celor ce nu ascultă de Evanghelia lui Dumnezeu?
Apocalipsa 14
7. El zicea cu glas tare: „Temeți-vă de Dumnezeu și dați-I slavă, căci a venit ceasul judecății Lui; și închinați-vă Celui ce a făcut cerul și pământul, marea și izvoarele apelor!”
8. Apoi a urmat un alt înger, al doilea, și a zis: „A căzut, a căzut Babilonul, cetatea cea mare, care a adăpat toate neamurile din vinul mâniei curviei ei!”
9. Apoi a urmat un alt înger, al treilea, și a zis cu glas tare: „Dacă se închină cineva fiarei și icoanei ei și primește semnul ei pe frunte sau pe mână,
10. va bea și el din vinul mâniei lui Dumnezeu, turnat neamestecat în paharul mâniei Lui; și va fi chinuit în foc și în pucioasă, înaintea sfinților îngeri și înaintea Mielului.
11. Și fumul chinului lor se suie în sus în vecii vecilor. Și nici ziua, nici noaptea n-au odihnă cei ce se închină fiarei și icoanei ei și oricine primește semnul numelui ei!
12. Aici este răbdarea sfinților, care păzesc poruncile lui Dumnezeu și credința lui Isus.”
*/

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
