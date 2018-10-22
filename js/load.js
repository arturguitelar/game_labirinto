// responsável por carregar todos os recursos do jogo
const loadState = {
  preload: function () {
    // texto do loading
    const loadingTxt = game.add.text(
      game.world.centerX, 150, 'LOADING...',
      {
        font: '15px emulogic',
        fill: '#fff'
      }
    );
    loadingTxt.anchor.set(.5);

    // configurando a barra de loading
    const progressBar = game.add.sprite(
      game.world.centerX, 250, 'progressBar'
    );
    progressBar.anchor.set(.5);

    game.load.setPreloadSprite(progressBar);

    // recursos a serem carregados no loading
    // imagens estáticas - (nome de referência, endereço da imagem)
    game.load.image('bg', 'img/bg.png');
    game.load.image('block', 'img/block.png');
    game.load.image('end', 'img/end.png');
    game.load.image('part', 'img/part.png');

    // spritesheets
    // - (nome de referência, endereço da imagem, tamanho do grid em x, tamanho do grid em y)
    game.load.spritesheet('coin', 'img/coin.png', 32, 32);
    game.load.spritesheet('enemy', 'img/enemy.png', 24, 40);
    game.load.spritesheet('player', 'img/player.png', 24, 32);

    // audio - (nome de referência, endereço do audio)
    game.load.audio('getitem', 'sfx/getitem.ogg');
    game.load.audio('loseitem', 'sfx/loseitem.ogg');
    game.load.audio('music', 'sfx/music.ogg');

    // recurso de sistema de física
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function () {
    // coloquei aqui dessa forma porque incomodava o loading passando tão rápido
    // parecia mais um bug... 
    // Então o evento irá simular uma 'espera' antes de chamar o menu de fato.
    // param 500 = .5s
    // game.state.start('menu');
    game.time.events.add(500, function () {
      game.state.start('menu');
    }, this);
  }
};
