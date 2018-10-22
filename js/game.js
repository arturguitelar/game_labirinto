const game = new Phaser.Game(750, 500, Phaser.CANVAS);

game.global = {
  score: 0,
  highScore: 0
};

// carregando os states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);

// registro das fases
game.state.add('stageOne', stageOneState);
game.state.add('stageTwo', stageTwoState);

// tela de vitória final
game.state.add('end', endState);

// inicializando o game
game.state.start('boot');