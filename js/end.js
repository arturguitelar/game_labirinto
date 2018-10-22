const endState = {
  create: function () {
    // imagem de termino caso vença o jogo
    game.add.sprite(0, 0, 'end');

    const pressStartTxt = game.add
      .text(game.world.centerX, 250, 'PRESS ENTER', {
        font: '30px emulogic', fill: '#f00'
      });
    pressStartTxt.anchor.set(.5);
    pressStartTxt.alpha = 0;
    
    // efeito de fade out no texto, tempo: 500ms
    game.time.events.add(3000, function () {
      game.add
      .tween(pressStartTxt)
      .to({ alpha:1 }, 500).to({ alpha: 0 })
      .loop().start();
    }, this);

    // evento para tecla start
    const enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.addOnce(this.backToMenu, this);
  },

  backToMenu: function () {
    game.state.start('menu');
  }
};
