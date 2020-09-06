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
    "Deci ce vom [zice] noi în fața [tuturor] acestor [lucruri]? Dacă [Dumnezeu] este pentru [noi], cine va fi împotriva noastră? (Romani 8:31)",
    "Căci suntem în [clipa] când [judecata] stă să înceapă de la [Casa] lui Dumnezeu. Și, dacă începe cu [noi], care va fi [sfârșitul] celor ce nu [ascultă] de [Evanghelia] lui Dumnezeu? (1 Petru 4:17)",
    "El zicea cu [glas] tare: „Temeți-vă de Dumnezeu și dați-I [slavă], căci a venit [ceasul] judecății Lui; și închinați-vă Celui ce a făcut [cerul] și [pământul], [marea] și [izvoarele] [apelor]!” (Apocalipsa 14:7)",
    "Apoi a urmat un alt [înger], al [doilea], și a zis: „A căzut, [a căzut] Babilonul, cetatea cea mare, care a adăpat toate neamurile din vinul mâniei curviei ei!” (Apocalipsa 14:8)",
    "Apoi a urmat un alt [înger], al [treilea], și a zis cu glas tare: „Dacă se [închină] cineva [fiarei] și [icoanei] ei și primește [semnul] ei pe [frunte] sau pe [mână], va bea și el din [vinul] mâniei lui Dumnezeu, turnat neamestecat în [paharul] mâniei Lui; și va fi chinuit în [foc] și în [pucioasă], înaintea [sfinților îngeri] și înaintea [Mielului]. Și fumul chinului lor se suie în sus în vecii vecilor. Și nici [ziua], nici [noaptea] n-au odihnă cei ce se închină [fiarei] și [icoanei] ei și oricine primește [semnul] numelui ei! (Apocalipsa 14:9-11)",
    "Aici este [răbdarea] sfinților, care păzesc [poruncile] lui [Dumnezeu] și [credința] lui [Isus.]” (Apocalipsa 14:12)",
    "Căci sunt bine încredințat că nici [moartea], nici [viața], nici [îngerii], nici [stăpânirile], nici [puterile], nici lucrurile de [acum], nici cele [viitoare], nici [înălțimea], nici [adâncimea], nicio altă [făptură], nu vor fi în stare să ne [despartă] de dragostea lui Dumnezeu care este în Isus Hristos, Domnul [nostru]. (Romani 8:38,39) ",
    "În adevăr, cei ce [trăiesc] după îndemnurile firii [pământești] umblă după lucrurile [firii] pământești; pe când cei ce trăiesc după [îndemnurile] Duhului umblă după lucrurile [Duhului]. (Romani 8:5)",
    "Căci suntem în [clipa] când [judecata] stă să înceapă de la [Casa] lui Dumnezeu. Și, dacă începe cu [noi], care va fi [sfârșitul] celor ce nu [ascultă] de [Evanghelia] lui Dumnezeu? (1 Petru 4:17)",
    "Pot [totul] în [Hristos] care mă [întăreşte]. (Filipeni 4:13)",
    "Cine are [poruncile] Mele şi le [păzeşte] acela [Mă iubeşte]; şi cine Mă iubeşte va fi iubit de Tatăl Meu. Eu îl voi iubi şi Mă voi arăta lui. (Ioan 14:21)",
    "Atunci [toţi] cei ce [se încred] în Tine se vor [bucura], se vor [înveseli] totdeauna, căci Tu îi vei [ocroti]. Tu vei fi bucuria celor ce [iubesc] Numele Tău. (Psalmii 5:11)",
    "Încredinţează-ţi [soarta] în [mâna] Domnului, şi El te va [sprijini]. El nu va [lăsa] niciodată să se [clatine] cel neprihănit. (Psalmii 55:22)",
    "În [adevăr], [însuşirile] [nevăzute] ale Lui, [puterea] Lui [veşnică] şi [dumnezeirea] Lui se văd [lămurit], de la facerea lumii, când te uiţi cu băgare de seamă la ele în lucrurile făcute de El. Aşa că nu se pot dezvinovăţi. (Romani 1:20)",
    "Acum, dar, rămân acestea trei: [credinţa], [nădejdea] şi [dragostea]; dar cea mai mare dintre ele este [dragostea]. (1 Corinteni 13:13)",
    "Cei ce [cunosc] Numele Tău [se încred] în Tine, căci Tu nu [părăseşti] pe cei ce Te [caută], Doamne! (Psalmii 9:10)",
    "Isus Hristos este [acelaşi] [ieri] şi [azi] şi [în veci]! (Evrei 13:8)",
    "Şi Dumnezeu a zis: Iată că v-am dat orice [iarbă] care face [sămânţă] şi care este pe faţa întregului pământ şi orice [pom] care are în el rod cu [sămânţă]: aceasta să fie [hrana] voastră. (Genesa 1:29)",
    "Căci [Domnul Dumnezeu] este un [soare] şi un [scut], [Domnul] dă [îndurare] şi [slavă], şi nu lipseşte de [niciun bine] pe cei ce duc o viaţă fără prihană. (Psalmii 84:11)",
    "Nu te teme, căci Eu sunt [cu tine]; nu te uita cu îngrijorare, căci Eu sunt [Dumnezeul tău]; Eu te [întăresc], tot Eu [îţi vin în ajutor]. Eu [te sprijin] cu dreapta Mea biruitoare. (Isaia 41:10)",
    "Căci mie nu mi-e ruşine de [Evanghelia lui Hristos]; fiindcă ea este [puterea lui Dumnezeu] pentru mântuirea fiecăruia care crede: [întâi] a [iudeului], apoi a [grecului]. (Romani 1:16)",
    "El te va acoperi cu [penele] Lui şi te vei ascunde sub [aripile] Lui. Căci [scut] şi [pavăză] este [credincioşia] Lui! (Psalmii 91:4)"
  ];
  var number_of_texts = all_texts.length;
  var random_index = Math.floor(Math.random() * (number_of_texts));
  var text_definition = all_texts[random_index];

  var reg = /([^[]+(?=]))/g;
  //var reg =/(?<=\[).+?(?=\])/g;    Old Version not working on Safari rollback in case the above expression doesn't work for all cases
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("js/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}