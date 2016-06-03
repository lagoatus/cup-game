var spotOne = document.getElementById('spotOne');
var spotTwo = document.getElementById('spotTwo');
var spotThree = document.getElementById('spotThree');
var guessing = false;
var speed;
var speedFactor;
var shuffles;
var score = 0;
var highScores;

function init() {
  if (localStorage.scores){
    highScores = JSON.parse(localStorage.scores);
  } else {
    highScores = [{n:'AAA',s: 1000}, {n: 'ABB', s: 1200}, {n: 'BBB', s: 1400}, {n: 'CCC', s: 1600}, {n: 'DDD', s: 1800}];
  }
}


function spotIt (i){
   var spot = ['#spotOne', '#spotTwo', '#spotThree'];
   $(spot[i]).find('div').attr('id', 'winner');
   $(spot[i]).find('img').attr('src', 'images/slash/owlslash250.png');
   setTimeout(function(){$(spot[i]).find('img').attr('src', 'images/slash/slash250.png');
   },1000);
 }


var Shuffler = {

  options: [],
  classTime: 0,

  getOptions: function() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var that = this;
    vars.forEach(function(item, idx){
      var pair = item.split("=");
      that.options[idx] = pair[1];
    });
  },

  parseOptions: function(options) {
    if (this.options[1] === "Slow") {
      speed = 450;
      speedFactor = 500;
    } else if (this.options[1] === "Medium") {
      speed = 350;
      speedFactor = 1000;
    } else {
      speed = 250;
      speedFactor = 2000;
    }
    this.classTime = speed - 20;
    shuffles = parseInt(this.options[0]);
    return speed, speedFactor, shuffles;
  },

   assignRightAnswer: function () {
       var randomNumber = Math.floor(Math.random()*3);
       spotIt(randomNumber);
     },

  shuffle: function(s, i) {
     setTimeout(function () {
        Shuffler.pickRandomShuffle();
        if (--i) {
          Shuffler.shuffle(speed, i);
        } else {
          guessing = true;
        }
     }, s);
  },

  runGame: function() {
    this.getOptions();
    this.parseOptions(this.options);
    this.assignRightAnswer();
    setTimeout(function() {
      Shuffler.shuffle(speed, shuffles)}, 1000)
  },

  pickRandomShuffle: function() {
    var randomNumber = Math.floor(Math.random()*3);
    if (randomNumber === 0) {
      this.animateFirstToThird(spotOne.children[0], spotThree.children[0]);
    } else if (randomNumber === 1) {
      this.animateSecondToOne(spotOne.children[0], spotTwo.children[0]);
    } else if (randomNumber === 2) {
      this.animateSecondToThird(spotTwo.children[0], spotThree.children[0]);
    }
  },

  animateFirstToThird: function(childOfSpotOne, childOfSpotThree) {
    childOfSpotThree.style.animation = 'threeToOnes ' + speed + 'ms';
    childOfSpotOne.style.animation = 'oneToThrees ' + speed + 'ms';
    setTimeout(function(){
      childOfSpotOne.style.animation = null;
      childOfSpotThree.style.animation = null;
      spotOne.appendChild(childOfSpotThree);
      spotThree.appendChild(childOfSpotOne);
    }, this.classTime);
  },

  animateSecondToOne: function(childOfSpotOne, childOfSpotTwo) {
    childOfSpotTwo.style.animation = 'twoToOnes ' + speed + 'ms';
    childOfSpotOne.style.animation = 'oneToTwos ' + speed + 'ms';
    setTimeout(function(){
      childOfSpotTwo.style.animation = null;
      childOfSpotOne.style.animation = null;
      spotOne.appendChild(childOfSpotTwo);
      spotTwo.appendChild(childOfSpotOne);
    }, this.classTime);
  },

  animateSecondToThird: function(childOfSpotTwo, childOfSpotThree) {
    childOfSpotTwo.style.animation = 'twoToThrees ' + speed + 'ms';
    childOfSpotThree.style.animation = 'threeToTwos ' + speed + 'ms';
    setTimeout(function(){
      childOfSpotTwo.style.animation = null;
      childOfSpotThree.style.animation = null;
      spotTwo.appendChild(childOfSpotThree);
      spotThree.appendChild(childOfSpotTwo);
    }, this.classTime);
  }
};

var Responder = {
  feedback: document.getElementById('feedback'),
  popup: document.getElementById('popup'),

  winHS: function() {
    this.popup.setAttribute('class', 'popup');
    this.feedback.innerHTML = '<p class="win">New High Score! <br />Your score is ' + score + '.<br />Whooo are you?.</p> <br /><form id="form"><input id="username" type="text" name="player" placeholder="---" maxlength="3"> <br /> <input id="submitun" type ="submit" value="submit"></form>';
    this.formListen();
  },

  winNHS: function() {
    this.popup.setAttribute('class', 'popup');
    this.feedback.innerHTML = '<a href="scores.html" class="win">You win! <br />Your score is ' + score + '.<br />Click to see high scores.</a>';
  },

  lose: function() {
    this.popup.setAttribute('class', 'popup');
    this.feedback.innerHTML = '<a href="scores.html" class="lose">You lose! <br />Your score is ' + score + '.<br />Click to see high scores.</a>';
  },


  spotClick: function() {
    if(guessing) {
      Responder.reveal();
      console.log(this);

      if($(this).find('div').attr('id') === 'winner'){
        score = speedFactor * shuffles;
        if (Responder.isHighScore(score)) {
          Responder.winHS();
        } else {
          Responder.winNHS();
        }
      } else {
        Responder.lose();
      }
    }
    guessing = false;
    return score;
  },


  reveal: function() {
    var winnerReveal = document.getElementById('winner');

    winnerReveal.children[0].src = 'images/slash/owlslash250.png';
  },

  isHighScore: function(score) {
    var curScore = {n: '', s: score};
    highScores.push(curScore);
    highScores = highScores.sort(function(a, b) {
      return a.s-b.s;
    });

    while (highScores.length > 10) {
      highScores.shift();
    }

    if (highScores.indexOf(curScore) > -1) {
      return true;
    } else {
      return false;
    }
  },

  formListen: function() {
    var form = document.getElementById('form');
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      var n= event.target.username.value;
      for (var i=0; i < highScores.length; i++) {
        if (highScores[i].n === '') {
          highScores[i].n = n.toUpperCase();
        }
        localStorage.setItem('scores', JSON.stringify(highScores));
        window.location = 'scores.html';
      }
    });
  }
};

$('#spotOne').on('click', Responder.spotClick);
$('#spotTwo').on('click', Responder.spotClick);
$('#spotThree').on('click', Responder.spotClick);

init();
setTimeout(function(){
  Shuffler.runGame();
}, 500);
