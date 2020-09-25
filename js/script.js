function reloadView() {
  var dificultate = localStorage.getItem("dificultate");
  if (dificultate == undefined || dificultate.length == 0) {
    $(".alege-dificultate").addClass("visible");
    $(".memtest").addClass("hidden");
    $(".alege-dificultate").removeClass("hidden");
    $(".memtest").removeClass("visible");
  } else {
    $(".alege-dificultate").addClass("hidden");
    $(".memtest").addClass("visible");
    $(".alege-dificultate").removeClass("visible");
    $(".memtest").removeClass("hidden");
    $(".dificultate-selectata").removeClass("color-test");
    $(".dificultate-selectata").removeClass("color-usor");
    $(".dificultate-selectata").removeClass("color-mediu");
    $(".dificultate-selectata").removeClass("color-greu");
    $(".dificultate-selectata").addClass("color-" + dificultate);
    $(".dificultate-selectata").text(dificultate);
    $(".blank-words-test").BlankWordsTest();
  }
}
function getHashCode(str) {
  var hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
$(document).ready(function () {
  reloadView();
  $(".dificultate").on("click", function () {
    console.log("Dificultate" + $(this).text());
    localStorage.setItem("dificultate", $(this).text());
    reloadView();
  });
  $(".dificultate-selectata").on("click", function () {
    clearLocalStorage();
  });
});
function clearLocalStorage() {
  localStorage.clear();
  reloadView();
}
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
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
function getUsage(str) {
  var strHash = getHashCode(str);
  var usage = localStorage.getItem(strHash);
  if (usage == undefined)
    usage = "0";
  if (usage.length == 0)
    usage = "0";
  console.log(usage + "   " + strHash + "   " + str);
  return parseInt(usage) + (strHashF == lastVerseHash ? 1 : 0);
}
function showVerse(all_texts) {
  $(".blank-words-right").html("");
  $(".blank-words-left").html("");
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
  $HTML_to_display.find("span").replaceWith(function () { return "<div class='blank'>__________</div>"; });
  $(".blank-words-left").html($HTML_to_display2);

  for (var index in text_hidden) {
    var $new_word = $("<div>").addClass("word").html(text_hidden[index]);
    $(".blank-words-right").append($new_word);
  }

  var number_words_to_drop = 0;
  var alerted_fail = false;

  $(".word").draggable({ revert: true, cursor: "pointer", containment: ".blank-words-test" });
  $(".blank-words-right").droppable({
    drop: function (ev, ui) {
      $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
      $(ui.draggable).removeClass('dropped');

      $(".blank").each(function () {
        if ($(this).html() == "") {
          $(this).text("__________");
          $(this).droppable('enable');
        }
      });
    }
  });

  $(".blank").droppable({
    drop: function (ev, ui) {
      $(this).text("");

      $(ui.draggable).detach().css({ top: 0, left: 0 }).appendTo(this);
      $(ui.draggable).addClass('dropped');

      number_words_to_drop = $(".blank-words-right div.word:not(.dropped)").length;

      $(this).droppable('disable');

      $(".blank").each(function () {
        if ($(this).html() == "") {
          $(this).text("__________");
          $(this).droppable('enable');
        }
      });

      if (number_words_to_drop == 0) {
        var text_tried = $("div.blank-words-left p").text();
        console.log(text_definition);
        var tdHash = getHashCode(text_definition);
        var usage = parseInt(getUsage(text_definition)) + 1;
        localStorage.setItem(tdHash, usage);
        localStorage.setItem("last-verse", tdHash);
        if (text_tried == text_correct) {
          $(".blank-words-status").html("<p class='status-succes-text'><b> <i class='fa fa-check'></i></b></p>");
          swal("🎉 Felicitări! ", "Ai învățat un verset!");
          $(".word").css("pointer-events", "none");
        } else {
          if (alerted_fail == false) {
            swal("Ai greșit!❌", "Încearcă din nou.");
          }

          setTimeout(function () {
            $(".word").appendTo('.blank-words-right');
            $(".word").removeClass('dropped');

            $(".blank").each(function () {
              if ($(this).html() == "") {
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
var minVerseUsage = 0;
var lastVerseHash = 0;
function filterOnlyLessGuessedVerses(verse) {
  var verseUsage = getUsage(verse);
  return verseUsage == minVerseUsage;
}
var d = new Date();
$.fn.BlankWordsTest = function () {
  var jsonStr = httpGet("assets/versete.json?v=" + d.getTime());
  var jsonObj = JSON.parse(jsonStr);
  var dificultate_selectata = localStorage.getItem("dificultate");
  jsonObj.memoreaza.forEach(elem => {
    if (elem.dificultate == dificultate_selectata) {
      console.log("Showing verse for dificulty:" + elem.dificultate);
      console.log(elem);
      var usages = elem.versete.map(item => getUsage(item));
      minVerseUsage = Math.min(...usages);
      lastVerseHash = localStorage.getItem("last-verse")
      console.log(minVerseUsage);
      console.log(usages);
      showVerse(elem.versete.filter(filterOnlyLessGuessedVerses));
    } else {
      console.log(elem.dificultate + " " + dificultate_selectata);
    }
  });
  var all_texts = [
    "[Cuvântul] Tău este o [candelă] pentru [picioarele] mele și o [lumină] pe [cărarea] mea. (Psalmii 119:105)",
    "Să [ascultăm], dar, [încheierea] tuturor [învățăturilor]: Teme-te de [Dumnezeu] și păzește [poruncile] Lui. Aceasta este [datoria] oricărui om. (Eclesiast 12:13)",
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
    "Pot [totul] în [Hristos] care mă [întăreşte]. (Filipeni [4]:[1][3])",
    "Cine are [poruncile] Mele şi le [păzeşte] acela [Mă iubeşte]; şi cine Mă iubeşte va fi iubit de Tatăl Meu. Eu îl voi iubi şi Mă voi arăta lui. (Ioan 14:21)",
    "Atunci [toţi] cei ce [se încred] în Tine se vor [bucura], se vor [înveseli] totdeauna, căci Tu îi vei [ocroti]. Tu vei fi bucuria celor ce [iubesc] Numele Tău. (Psalmii 5:11)",
    "Încredinţează-ţi [soarta] în [mâna] Domnului, şi El te va [sprijini]. El nu va [lăsa] niciodată să se [clatine] cel neprihănit. (Psalmii 55:22)",
    "În [adevăr], [însuşirile] [nevăzute] ale Lui, [puterea] Lui [veşnică] şi [dumnezeirea] Lui se văd [lămurit], de la facerea lumii, când te uiţi cu băgare de seamă la ele în lucrurile făcute de El. Aşa că nu se pot dezvinovăţi. (Romani 1:20)",
    "Acum, dar, rămân acestea trei: [credinţa], [nădejdea] şi dragostea; dar cea mai mare dintre ele este [dragostea]. (1 Corinteni 13:13)",
    "Cei ce [cunosc] Numele Tău [se încred] în Tine, căci Tu nu [părăseşti] pe cei ce Te [caută], Doamne! (Psalmii 9:10)",
    "Isus Hristos este [acelaşi] [ieri] şi [azi] şi [în veci]! (Evrei [1][3]:[8])",
    "Şi Dumnezeu a zis: Iată că v-am dat orice [iarbă] care face [sămânţă] şi care este pe faţa întregului pământ şi orice [pom] care are în el rod cu [sămânţă]: aceasta să fie [hrana] voastră. (Genesa 1:29)",
    "Căci [Domnul Dumnezeu] este un [soare] şi un [scut], [Domnul] dă [îndurare] şi [slavă], şi nu lipseşte de [niciun bine] pe cei ce duc o viaţă fără prihană. (Psalmii 84:11)",
    "Nu te teme, căci Eu sunt [cu tine]; nu te uita cu îngrijorare, căci Eu sunt [Dumnezeul tău]; Eu te [întăresc], tot Eu [îţi vin în ajutor]. Eu [te sprijin] cu dreapta Mea biruitoare. (Isaia 41:10)",
    "Căci mie nu mi-e ruşine de [Evanghelia lui Hristos]; fiindcă ea este [puterea lui Dumnezeu] pentru mântuirea fiecăruia care crede: [întâi] a [iudeului], apoi a [grecului]. (Romani 1:16)",
    "El te va acoperi cu [penele] Lui şi te vei ascunde sub [aripile] Lui. Căci [scut] şi [pavăză] este [credincioşia] Lui! (Psalmii 91:4)",
    "[Încrede-te] în Domnul din toată [inima] ta şi nu te bizui pe [înţelepciunea] ta! [Recunoaşte-L] în toate [căile tale], şi El îţi va netezi [cărările]. (Proverbe 3:5,6)",
    "Să nu te părăsească [bunătatea] şi [credincioşia]: leagă-ţi-le la gât, scrie-le pe tăbliţa inimii tale. (Proverbe 3:3)",
    "Încredinţează-ţi [lucrările] în mâna Domnului şi îţi vor izbuti [planurile]. (Proverbe [1][6]:[3])",
    "Fiindcă atât de mult a iubit Dumnezeu [lumea], că a dat pe singurul Lui Fiu, pentru ca oricine crede în El să nu piară, ci să aibă [viaţa veşnică]. (Ioan [3]:[1][6])",
    "Încredeţi-vă în [Domnul] pe vecie, căci [Domnul Dumnezeu] este [Stânca veacurilor]. (Isaia 26:4)",
    "[O inimă veselă] [este] [un bun leac], dar [un duh mâhnit] [usucă oasele]. (Proverbe 17:22)",
    "Veniţi la Mine, toţi cei [trudiţi] şi [împovăraţi], şi Eu vă voi da odihnă. (Matei [1][1]:[2][8])",
    "Căci pentru mine a trăi este [Hristos], şi a muri este un [câştig]. (Filipeni [1]:[2][1])",
    "Ceea ce face [farmecul] unui om este [bunătatea] lui; şi mai mult preţuieşte un [sărac] decât un [mincinos]. (Proverbe [19]:[22])",
    "Păzeşte-ţi [inima] mai mult decât [orice], căci din [ea] ies [izvoarele vieţii]. (Proverbe [4]:[2][3])",
    "Să nu fiţi iubitori de bani. [Mulţumiţi-vă cu ce aveţi], căci El însuşi a zis: „[Nicidecum n-am să te las], [cu niciun chip nu te voi părăsi.]” (Evrei [1][3]:[5])",
    "Chiar dacă ar fi să [umblu] prin [valea umbrei morţii], nu mă tem de niciun rău, căci Tu eşti cu mine. [Toiagul] şi [nuiaua Ta] mă mângâie. (Psalmii [2][3]:[4])",
    "Cei ce seamănă cu [lacrimi] vor secera cu cântări de [veselie]. Cel ce umblă [plângând], când aruncă sămânţa, se întoarce cu [veselie] când îşi strânge snopii. (Psalmii 126:5-6)",
    "... Domnul Dumnezeu şterge [lacrimile] de pe toate feţele şi îndepărtează de pe tot pământul [ocara] poporului Său; da, Domnul a vorbit. (Isaia [25]:[8])",
    "Totuşi, [în toate aceste lucruri], [noi suntem mai mult decât biruitori], prin Acela care ne-a iubit. (Romani [8]:[3][7])",
    "Ferice de cei cu [inima] curată, căci ei vor vedea pe Dumnezeu! (Matei [5]:[8])",
    "[Întăriţi-vă] şi [îmbărbătaţi-vă]! Nu vă [temeţi] şi nu vă [înspăimântaţi] de ei, căci Domnul Dumnezeul tău va merge El însuşi cu tine, nu te va [părăsi] şi nu te va [lăsa]. (Deuteronom 31:6)",
    "Domnul însuşi [va merge înaintea ta], El însuşi [va fi cu tine], nu te va [părăsi] şi nu te va [lăsa]; nu te [teme] şi nu te [înspăimânta]! (Deuteronom 31:8)",
    "Ca [ploaia] [să curgă] [învăţăturile] mele, ca [roua] [să cadă] cuvântul meu, ca [ploaia] [repede] pe verdeaţă, ca [picăturile de ploaie] pe iarbă! (Deuteronom 32:2)",
    "El este [Stânca]; lucrările Lui sunt [desăvârşite], căci toate căile Lui sunt [drepte]; El este un Dumnezeu [credincios] şi [fără nedreptate], El este [drept] şi [curat]. (Deuteronom 32:4)",
    "Nimeni nu este ca [Dumnezeul lui Israel], [El] trece pe ceruri ca să-ţi vină în ajutor, trece cu măreţie pe nori. (Deuteronom [33]:[26])",
    "De ce să fii ca un [om încremenit], ca un [viteaz] care nu ne [poate ajuta]? Şi totuşi Tu eşti în mijlocul nostru, Doamne, şi Numele Tău este chemat peste noi. De aceea nu ne [părăsi]! (Ieremia 14:9)",
    "Acum dau toate aceste ţări în mâinile [robului Meu Nebucadneţar], [împăratul Babilonului]; îi dau chiar şi [fiarele câmpului] ca să-i fie supuse. Toate [neamurile] vor fi supuse [lui], [fiului său] şi [fiului fiului său], până va veni şi vremea ţării lui, şi o vor supune neamuri puternice şi împăraţi mari. (Ieremia 27:6-7)",
    "Gândiţi-vă la [lucrurile de sus], nu la cele de pe pământ. Căci voi aţi murit, şi [viaţa voastră] este ascunsă cu Hristos în Dumnezeu. (Coloseni 3:2-3)",
    "Dar [Domnul oştirilor] va fi înălţat prin [judecată], şi [Dumnezeul cel sfânt] va fi sfinţit prin [dreptate]. (Isaia [5]:[1][6])",
    "Doamne, Tu eşti Dumnezeul meu; pe Tine Te voi înălţa! Laud Numele Tău, căci ai făcut [lucruri minunate]; [planurile Tale] făcute mai dinainte s-au împlinit cu credincioşie. (Isaia [2][5]:[1])",
    "Totuşi Domnul [aşteaptă] [să Se milostivească de voi] şi Se va scula [să vă dea îndurare], căci Domnul este un Dumnezeu [drept]: ferice de toţi cei ce [nădăjduiesc în El]! (Isaia 30:18)",
    "Da, [popor al Sionului], [locuitor al Ierusalimului], nu vei mai [plânge]! El Se va îndura de tine, când vei [striga]; cum va [auzi], te va [asculta]. (Isaia 30:19)",
    "Lucrarea [neprihănirii] va fi [pacea]; [roada neprihănirii]: [odihna] şi [liniştea] pe vecie. (Isaia 32:17)",
    "Doamne, ai milă de noi! Noi nădăjduim în Tine. Fii [ajutorul nostru] în [fiecare dimineaţă] şi [izbăvirea noastră] la [vreme de nevoie]! (Isaia 33:2)",
    "Zilele tale sunt [statornice], [înţelepciunea] şi [priceperea] sunt un [izvor de mântuire]; [frica de Domnul], iată comoara Sionului. (Isaia 33:6)",
    "Căutaţi în [cartea Domnului] şi citiţi! Niciuna din toate acestea nu [va lipsi], nici una, nici alta nu [vor da greş]. Căci gura Domnului [a poruncit] lucrul acesta: Duhul Lui [va strânge] acele sălbăticiuni. (Isaia 34:16)",
    "Spuneţi celor [slabi] de inimă: „Fiţi [tari], şi nu vă temeţi! Iată Dumnezeul vostru, [răzbunarea] va veni, [răsplătirea] lui Dumnezeu; El însuşi [va veni] şi [vă va mântui.]” (Isaia 35:4)",
    "Cei izbăviţi de Domnul [se vor întoarce] şi [vor merge] spre Sion cu cântece de biruinţă. O [bucurie] [veşnică] le va încununa capul, [veselia] şi [bucuria] îi vor apuca, iar [durerea] şi [gemetele] vor fugi! (Isaia 35:10)",
    "Iată, voi trimite pe [solul Meu]; el va pregăti [calea] înaintea Mea. Şi deodată va intra în [Templul] Său [Domnul] pe care-L căutaţi: [Solul] legământului pe care-L doriţi; iată că vine - zice Domnul oştirilor. Cine va putea [să sufere] însă ziua venirii Lui? Cine va rămâne în picioare când Se va arăta El? Căci El va fi ca [focul topitorului] şi ca [leşia înălbitorului]. El [va şedea], [va topi] şi [va curăţa] argintul; [va curăţa] pe fiii lui Levi, îi [va lămuri] cum se lămureşte [aurul] şi [argintul], şi vor aduce Domnului daruri neprihănite. (Maleahi 3:1-3)",
    "„Dar chiar acum, zice Domnul, întoarceți-vă la Mine cu [toată inima], cu [post], cu [plânset] și [bocet]!” Sfâșiați-vă [inimile], nu [hainele], și întoarceți-vă la Domnul Dumnezeul vostru. Căci El este [milostiv] și [plin de îndurare], [îndelung răbdător] și [bogat în bunătate] și-I pare rău de relele pe care le trimite. (Ioel 2:12,13)",
    "„De aceea, daţi-vă şi voi toate [silinţele] ca să uniţi cu [credinţa] voastră [fapta]; cu [fapta], [cunoştinţa]; cu [cunoştinţa], [înfrânarea]; cu [înfrânarea], [răbdarea]; cu [răbdarea], [evlavia]; cu [evlavia], [dragostea de fraţi]; cu [dragostea de fraţi], [iubirea de oameni].” (2 Petru 1:5-7)",
    "Căutaţi în cartea Domnului şi citiţi! Niciuna din toate acestea nu [va lipsi], nici una, nici alta nu [vor da greş]. Căci [gura Domnului] a poruncit lucrul acesta: [Duhul Lui] va strânge acele sălbăticiuni. (Isaia 34:16)",
    "Pot să [se mute] [munţii], pot să [se clatine] [dealurile], dar [dragostea Mea] nu se [va muta] de la tine, şi [legământul Meu de pace] nu se [va clătina], zice Domnul, care are milă de tine. (Isaia 54:10)",
    "Dar dacă [umblăm] [în lumină], după cum El însuşi este în lumină, avem părtăşie unii cu alţii; şi sângele lui Isus Hristos, Fiul Lui, [ne curăţă de orice păcat]. (1 Ioan 1:7)",
    "Cinsteşte pe [tatăl tău] şi pe [mama ta], pentru ca să ţi se lungească zilele în ţara pe care ţi-o dă Domnul Dumnezeul tău. (Exodul 20:12)",
    "Dar mai presus de [toate acestea], îmbrăcaţi-vă cu [dragostea], care este [legătura desăvârşirii]. (Coloseni 3:14)",
    "Iată, Eu vin curând; şi răsplata Mea este cu Mine, ca să dau fiecăruia după fapta lui. (Apocalipsa 22:11)",
    "Iată Eu stau la [uşă] şi bat. Dacă aude cineva glasul Meu şi deschide uşa, voi [intra] la el, voi [cina] cu el, şi el cu Mine. (Apocalipsa 3:20)",
    "Mai mult prețuiește pentru mine [legea gurii Tale], decât o mie de lucruri de [aur] și de [argint]. (Psalmii 119:72)",
    "Mâinile Tale [m-au făcut] și [m-au întocmit]; dă-mi pricepere, ca să învăț poruncile Tale! (Psalmii 119:73)",
    "Domnul a răspuns: „Da, vei avea un viitor [fericit]; da, voi sili pe vrăjmaş să te roage la vreme [de nenorocire] şi la vreme [de necaz]”! (Ieremia 15:11)",
    "Domnul este [tăria mea] și [scutul meu]; în El mi se încrede [inima] și sunt ajutat. De aceea îmi este plină de veselie inima și-L laud prin cântările mele. (Psalmii 28:7)",
    "Cine ne va despărţi pe noi de dragostea lui Hristos? Necazul, sau [strâmtorarea], sau [prigonirea], sau [foametea], sau [lipsa de îmbrăcăminte], sau [primejdia], sau [sabia]?” (Romani 8:35)",
    "Când va veni [Mângâietorul], [Duhul adevărului], are să vă călăuzească în tot [adevărul]; căci El nu va vorbi de la El, ci va vorbi tot ce va fi auzit și vă va descoperi lucrurile viitoare. (Ioan 16:13)",
    "Și viața veșnică este aceasta: să Te cunoască pe [Tine], [singurul Dumnezeu adevărat], și pe [Isus Hristos] pe care L-ai trimis Tu. (Ioan 17:3)",
    "Cei ce [se tem] de Tine mă [văd] și [se bucură], căci [nădăjduiesc] în făgăduințele Tale. (Psalmii 119:74)",
    "Dacă [zicem] că n-am păcătuit, Îl [facem] mincinos, şi Cuvântul Lui nu este în noi. ([1] Ioan [1]:[9])",
    "Și faptele firii pământești sunt cunoscute și sunt acestea: [preacurvia], [curvia], [necurăția], [desfrânarea], [închinarea la idoli], [vrăjitoria], [vrăjbile], [certurile], [zavistiile], [mâniile], [neînțelegerile], [dezbinările], [certurile de partide], [pizmele], [uciderile], [bețiile], [îmbuibările] și alte lucruri asemănătoare cu acestea. Vă spun mai dinainte, cum am mai spus, că cei ce fac astfel de lucruri nu vor moșteni Împărăția lui Dumnezeu. (Galateni 5:19-21)",
    "Căci Eu ştiu gândurile pe care le am cu privire la voi, zice Domnul, gânduri de [pace], şi nu de [nenorocire], ca să vă dau [un viitor] şi [o nădejde]. Voi Mă veţi [chema] şi veţi [pleca]; Mă veţi [ruga], şi vă voi [asculta]. Mă veţi [căuta], şi Mă veţi [găsi], dacă Mă veţi căuta cu toată inima. (Ieremia 29:11-13)",
    "Dar [Domnul oştirilor] va fi [înălţat] prin [judecată], şi [Dumnezeul cel sfânt] va fi [sfinţit] prin [dreptate]. (Isaia 5:16)",
    "Știu, Doamne, că [judecățile Tale] sunt [drepte]: din credincioșie m-ai [smerit]. (Psalmi [119:[7][5])",
    "Fă ca [bunătatea Ta] să-mi fie [mângâierea], cum ai făgăduit robului Tău! (Psalmi 119:76)",
    "Doamne, Tu eşti Dumnezeul meu; pe Tine Te voi înălţa! Laud [Numele Tău], căci ai făcut lucruri [minunate]; [planurile Tale] făcute mai dinainte s-au împlinit cu [credincioşie]. (Isaia 25:1)",
    "Binecuvântă, suflete, pe Domnul şi nu uita niciuna din [binefacerile Lui]! El îţi iartă toate [fărădelegile tale], El îţi vindecă toate [bolile tale]; El îţi izbăveşte [viaţa] din groapă, El te încununează cu [bunătate] şi [îndurare]. (Psalmii 103:2-4)",
    "Domnul Dumnezeu a făcut pe om din [ţărâna pământului], i-a suflat în [nări] [suflare de viaţă], şi omul s-a făcut astfel [un suflet viu]. (Geneza 2:7)",
    "Cuvântul lui Hristos să locuiască din [belşug] în voi în toată [înţelepciunea]. Învăţaţi-vă şi sfătuiţi-vă unii pe alţii cu [psalmi], cu [cântări de laudă] şi cu [cântări duhovniceşti], cântând lui Dumnezeu cu [mulţumire] în [inima] voastră. (Coloseni 3:16)",
    "Noi însă suntem din Dumnezeu; cine cunoaşte pe Dumnezeu [ne ascultă]; cine nu este din Dumnezeu [nu ne ascultă]. Prin aceasta cunoaştem [Duhul adevărului] şi [duhul rătăcirii]. (1 Ioan 4:6) ",
    "Dacă [nelegiuirile noastre] [mărturisesc] împotriva noastră, lucrează pentru Numele Tău, Doamne! Căci [abaterile noastre] sunt multe, [am păcătuit] împotriva Ta. (Ieremia 14:7)",
    "Dar Domnul este [turnul meu] de [scăpare], Dumnezeul meu este [stânca mea] de [adăpost]. (Psalmii 94:22)",
    "Vrăjmășie voi pune între [tine] și [femeie], între [sămânţa ta] și [sămânţa ei]. Aceasta îţi va zdrobi [capul], și tu îi vei zdrobi [călcâiul]. (Genesa 3:15)",
    "[Duhul lui Dumnezeu] să-L cunoaşteţi după aceasta: [orice duh] care mărturiseşte că [Isus Hristos] a venit [în trup] este de la Dumnezeu. (1 Ioan 4:2)",
    "Voi sunteţi [lumina lumii]. O [cetate aşezată] pe un munte nu poate să rămână ascunsă. (Matei [5]:[1][4])",
    "Tu [ştii tot], Doamne! Adu-Ţi aminte de [mine], nu mă [uita], [răzbună-mă] pe prigonitorii mei! Nu mă [lua], după îndelunga Ta [răbdare]. Gândeşte-Te că sufăr [ocara] din pricina Ta! (Ieremia 15:15)"

  ];
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("js/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
