// configuração pre-load do jogo
const bootState = {
  preload: function () {
    // img da barra de loading
    game.load.image('progressBar', 'img/progressBar.png');
  },

  create: function () {
    game.state.start('load');
  }
};