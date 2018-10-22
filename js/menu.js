const bgMusic = {
  // MUSIC
  create: function () {
    this.music = game.add.audio('music');
    this.music.loop = true;
    this.music.volume = .2;
  },

  play: function () {
    this.music.play();
  },

  stop: function () {
    this.music.stop();
  }
};

const menuState = {
  create: function () {
    // botando a música pra tocar
    bgMusic.create();
    bgMusic.play();

    // zerando o valor de um possível score global
    game.global.score = 0;

    // verificando o localStorage do navegador para armazenar o highScore
    const keyStorage = 'labirinto_highScore';
    if (!localStorage.getItem(keyStorage)) {
      localStorage.setItem(keyStorage, 0);
    }

    if (game.global.highScore > localStorage.getItem(keyStorage)) {
      localStorage.setItem(keyStorage, game.global.highScore);
    } else {
      game.global.highScore = localStorage.getItem(keyStorage);
    }

    // textos da tela
    const highScoreTxt = game.add
      .text(game.world.centerX, 350, 'HIGH SCORE: ' + game.global.highScore, {
        font: '20px emulogic',
        fill: '#D26111'
      });
    highScoreTxt.anchor.set(.5);

    const labirintoTxt = game.add
      .text(game.world.centerX, 150, 'LABIRINTO', {
        font: '40px emulogic',
        fill: '#fff'
      });
    labirintoTxt.anchor.set(.5);

    const pressStartTxt = game.add
      .text(game.world.centerX, 550, 'PRESS START', {
        font: '20px emulogic',
        fill: '#fff'
      });
    pressStartTxt.anchor.set(.5);

    // animação do texto PRESS START
    // 1000 = 1s = tempo da animação em milisegundos
    game.add.tween(pressStartTxt).to({ y: 250 }, 1000).start();

    // animação do texto HIGH SCORE
    // param alpha: 0 ate 1
    // param 500 = .5s = tempo de animação em milisegundos
    // a animação é executada em loop
    game.add.tween(highScoreTxt)
      .to({alpha: 1}, 500)
      .to({alpha: 0}, 500)
      .loop().start();

    // adicionando evento para habilitar o PRESS START pelo botão enter do teclado
    //  - (tempo para disparar o evento, função que irá executar, contexto)
    game.time.events.add(1000, function () {
      const enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      enterKey.onDown.addOnce(this.startGame, this);
    }, this);
  },

  startGame: function () {
    // parando a música
    bgMusic.stop();

    // start stage one
    game.state.start('stageOne');
  }
};
