// matriz para criação do labirinto
// 0 = espaços em branco (espaço livre para andar)
// 1 = blocos (bloqueios)
// 2 = player
// 3 = moedas
const stageTwoMaze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,3,0,0,0,0,0,3,1],
  [1,0,1,3,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,0,2,0,0,1,3,1,0,0,1],
  [1,0,0,0,0,0,1,1,3,1,0,0,0,1,1],
  [1,1,0,1,0,0,3,1,1,1,0,1,0,1,1],
  [1,0,0,1,0,0,0,0,0,0,0,1,3,0,1],
  [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
  [1,0,3,0,0,1,3,0,3,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const stageTwoState = {
  create: function () {
    console.log('objeto stage one', this);
    // controle de fluxo do update
    this.onGame = true;

    // exibindo imagem de background
    game.add.sprite(0, 0, 'bg');

    // musica de fundo
    bgMusic.play();

    // sfx
    this.sfxCreator();

    // matriz do labirinto
    this.maze = stageTwoMaze;

    // responsável por criar e armazenar os blocos
    this.blocks = game.add.group();
    // habilitando física para colisão nos blocos
    this.blocks.enableBody = true;

    // responsável pelas possíveis posições da moeda
    this.coinPositions = [];

    for (let row in this.maze) {
      for (let col in this.maze[row]) {
        const tile = this.maze[row][col];

        // 50 corresponde ao tamanho de cada bloco
        const x = col * 50;
        const y = row * 50;

        if (tile === 1) {
          // se o valor no indice atual for 1 então é um bloco
          const block = this.blocks.create(x, y, 'block');

          // fixando posição do bloco para que não seja empurrado pelo player
          block.body.immovable = true;
        } else if (tile === 2) {
          // se o valor for 2 então é o player
          this.playerCreator(x, y);

          // animações do player
          this.playerAnimations();  
        } else if (tile === 3) {
          // se o valor é 3 então é a moeda
          // 25 é o valor da metade do tamanho do grid da moeda, 
          // para que o frame que for renderizado fique centralizado
          const position = {
            x: x + 25,
            y: y + 25
          };

          this.coinPositions.push(position);
        }
      }
    }

    // Inimigo
    this.enemyCreator();

    // animações do inimigo
    this.enemyAnimations();

    // inteligência artificial do inimigo
    // começa se movendo para baixo
    this.enemy.direction = 'DOWN';

    // criando moeda
    this.coinCreator();

    // animações da moeda
    this.coinAnimation();

    // criando score
    this.score();

    // criando highScore
    this.highScore();

    // partículas
    this.particleCreator(); 

    // timer
    this.timerCreator();
    this.timerStart();
  },

  update: function () {
    if (this.onGame) {
      // colisão do player com os blocos
      // (objeto colisor, objeto com que vai colidir)
      game.physics.arcade.collide(this.player, this.blocks);
  
      // colisão entre o player e as moedas
      // (objeto colisor, objeto com que vai colidir, função callback,
      // função verificadora opcional, contexto)    
      game.physics.arcade.overlap(this.player, this.coin, this.getCoin, null, this);
  
      // colisão entre player e enemy
      // idem overlap
      game.physics.arcade.overlap(this.player, this.enemy, this.loseCoin, null, this);
  
      // movimentação do inimigo
      this.enemyMovement();
  
      // movimento do player
      this.playerMovement();
  
      // passou de fase
      if (this.coins >= 1) {
        this.toNextPhase('end');
      }

      // condição de derrota
      if (this.time <= 0) {
        this.gameOver();
        this.timerStop();
      }
    }
  },

  // MUSIC & SOUNDS
  playBgMusic: function () {
    bgMusic.create();
    bgMusic.playMusic();
  },

  sfxCreator: function () {
    // som da moeda
    this.coinSnd = game.add.audio('getitem');
    this.coinSnd.volume = .5;

    // som de perda de item
    this.loseSnd = game.add.audio('loseitem');
    this.loseSnd.volume = .5;
  },

  // PLAYER
  playerCreator: function (posX, posY) {
    // 25 é o valor da metade do tamanho do grid do player, 
    // para que o frame que for renderizado fique centralizado
    this.player = game.add.sprite(posX + 25, posY + 25, 'player');
    this.player.anchor.set(.5);
    game.physics.arcade.enable(this.player);

    // controles do game
    // armazenando as entradas de setas do teclado
    this.controls = game.input.keyboard.createCursorKeys();
  },

  playerAnimations: function () {
    // (nome da animação, array de sequência, velocidade / framerate, loop)
    // pra baixo
    this.player.animations
      .add('goDown', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
    // pra cima
    this.player.animations
      .add('goUp', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
    // esquerda
    this.player.animations
      .add('goLeft', [16, 17, 18, 19, 20, 21, 22, 23], 12, true);
    // direita
    this.player.animations
      .add('goRight', [24, 25, 26, 27, 28, 29, 30, 31], 12, true);  
  },

  playerMovement: function () {
    // reset de movimento do personagem
    this.playerStopMovement();

    // movimentos do personagem
    // para a esquerda
    if (this.controls.left.isDown && !this.controls.right.isDown) {
      this.player.body.velocity.x = -100;
      this.player.direction = 'left';
    }
    // para a direita
    else if (this.controls.right.isDown && !this.controls.left.isDown) {
      this.player.body.velocity.x = 100;
      this.player.direction = 'right';      
    }

    // para cima
    if (this.controls.up.isDown && !this.controls.down.isDown) {
      this.player.body.velocity.y = -100;
      this.player.direction = 'up';      
    }
    // para baixo
    else if (this.controls.down.isDown && !this.controls.up.isDown) {
      this.player.body.velocity.y = 100;
      this.player.direction = 'down';
    }

    // rodando animações
    switch (this.player.direction) {
      case 'left':
        this.player.animations.play('goLeft');
        break;

      case 'right':
        this.player.animations.play('goRight');
        break;

      case 'up':
        this.player.animations.play('goUp');
        break;

      case 'down':
        this.player.animations.play('goDown');
        break;
    }

    // parar animações
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.playerStopAnimations();
    }
  },

  playerStopMovement: function () {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
  },

  playerStopAnimations: function () {
    this.player.animations.stop();
    this.player.frame = 0;
  },

  // ENEMY
  enemyCreator: function () {
    this.enemy = game.add.sprite(75, 75, 'enemy');
    this.enemy.anchor.set(.5);

    // física do inimigo
    game.physics.arcade.enable(this.enemy);
  },

  enemyAnimations: function () {
    // (nome da animação, array de sequência, velocidade / framerate, loop)
    // pra baixo
    this.enemy.animations
      .add('goDown', [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
    // pra cima
    this.enemy.animations
      .add('goUp', [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
    // esquerda
    this.enemy.animations
      .add('goLeft', [16, 17, 18, 19, 20, 21, 22, 23], 12, true);
    // direita
    this.enemy.animations
      .add('goRight', [24, 25, 26, 27, 28, 29, 30, 31], 12, true);
  },

  enemyMovement: function () {
    // verifica se o inimigo está passando pelo centro de uma célula
    // 25 = metade da célula, 50 = tamanho total da célula / grid
    if (Math.floor(this.enemy.x - 25) % 50 === 0 && Math.floor(this.enemy.y - 25) % 50 === 0) {
      // indentificando em que célula ele se encontra
      const enemyCol = Math.floor(this.enemy.x / 50);
      const enemyRow = Math.floor(this.enemy.y / 50);

      let validPath = [];

      // "olha" em volta para verificar células vazias para movimentar-se
      // lembrar que 1 representa os blocos
      // verifica a célula da esquerda é um caminho válido
      if (this.maze[enemyRow][enemyCol - 1] !== 1 && this.enemy.direction !== 'RIGHT') {
        validPath.push('LEFT');
      }

      // verifica a célula da direita é um caminho válido
      if (this.maze[enemyRow][enemyCol + 1] !== 1 && this.enemy.direction !== 'LEFT') {
        validPath.push('RIGHT');
      }

      // verifica a acima é um caminho válido
      if (this.maze[enemyRow - 1][enemyCol] !== 1 && this.enemy.direction !== 'DOWN') {
        validPath.push('UP');
      }

      // verifica a célula abaixo é um caminho válido
      if (this.maze[enemyRow + 1][enemyCol] !== 1 && this.enemy.direction !== 'UP') {
        validPath.push('DOWN');
      }

      // atualiza para uma direção aleatória
      this.enemy.direction = validPath[Math.floor(Math.random() * validPath.length)];
    }

    // movendo de fato
    switch (this.enemy.direction) {
      case 'LEFT':
        this.enemy.x -= 1;
        this.enemy.animations.play('goLeft');
        break;

      case 'RIGHT':
        this.enemy.x += 1;
        this.enemy.animations.play('goRight');
        break;

      case 'UP':
        this.enemy.y -= 1;
        this.enemy.animations.play('goUp');
        break;

      case 'DOWN':
        this.enemy.y += 1;
        this.enemy.animations.play('goDown');
        break;
    }
  },

  enemyStopAnimations: function () {
    this.enemy.animations.stop();
  },

  // MOEDA
  coinCreator: function () {
    // criando a moeda
    this.coin = {};
    this.coin.position = this.coinNewPosition();
    this.coin = game.add
      .sprite(this.coin.position.x, this.coin.position.y, 'coin');
    this.coin.anchor.set(.5);

    // fisica da moeda
    game.physics.arcade.enable(this.coin);
  },

  coinAnimation: function () {
    // toca animação da moeda girando
    // (nome da animação, array de sequência, velocidade / framerate, loop)
    this.coin.animations
      .add('spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true)
      .play(); 
  },

  coinStopAnimations: function () {
    this.coin.animations.stop();
  },

  coinNewPosition: function () {
    // sorteia uma posição dentro da array
    let pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];

    // certifica que a posição sorteada é diferente da posição atual
    while (this.coin.position === pos) {
      pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
    }

    return pos;
  },

  getCoin: function () {
    // atualiza pontuação do player
    this.coins++;
    this.coinsTxt.text = this.updateScoreTxt();

    // particulas
    this.particleEmission(this.coin);

    // toca sfx
    this.coinSnd.play();

    // atualiza placar de score global
    game.global.score += 5;
    this.highScoreTxt.text = 'SCORE: ' + this.formatDisplayNumbers(game.global.score);

    // conferindo se o score atual é maior que o highscore
    if (game.global.score > game.global.highScore) {
      game.global.highScore = game.global.score;
    }

    // reposiciona a moeda
    this.coin.position = this.coinNewPosition();
  },

  loseCoin: function () {
    if (this.coins > 0) {
      // atualiza pontuação do player
      this.coins = 0;
      this.coinsTxt.text = this.updateScoreTxt();

      // particulas
      this.particleEmission(this.player);

      // sfx
      this.loseSnd.play();

      // reposiciona a moeda
      this.coin.position = this.coinNewPosition();
    }
  },

  // SCORE
  score: function () {
    // coletar moedas
    this.coins = 0;
    this.coinsTxt = game.add
      .text(15, 15, this.updateScoreTxt(), {
        font: '15px emulogic', fill: '#fff'
      });
  },

  highScore: function () {
    this.highScoreTxt = game.add
      .text(game.world.centerX, 15, 'HIGH SCORE: ' 
        + this.formatDisplayNumbers(game.global.highScore), {
          font: '15px emulogic',
          fill: '#fff'
        });
    this.highScoreTxt.anchor.set(.5, 0);
  },

  updateScoreTxt: function () {
    return 'COINS: ' + this.formatDisplayNumbers(this.coins);
  },

  formatDisplayNumbers: function (value) {
    if (value < 10) {
      return '00' + value.toString();
    } else if (value < 100) {
      return '0' + value.toString();
    }
    return value.toString();
  },

  // PARTÍCULAS
  particleCreator: function () {
    // primeiro precisa criar um objeto emissor
    // (pos x, pos y, qtd. max de partículas que serão carregadas na memória) 
    this.emitter = game.add.emitter(0, 0, 15);

    // para daí indicar qual imagem será utilizada como partícula
    this.emitter.makeParticles('part');

    // variação de velocidade das partículas
    this.emitter.setXSpeed(-50, 50);
    this.emitter.setYSpeed(-50, 50);

    // essas partículas não serão sujeitas a gravidade
    this.emitter.gravity.y = 0;
  },

  particleEmission: function (target) {
    this.emitter.x = target.position.x;
    this.emitter.y = target.position.y;
    // (intervalo regular ou não, tempo de vida da particula em ms,
    //  valor do interalo se for false, quantas partículas de cada vez)
    this.emitter.start(true, 500, null, 15);
  },

  // TIMER
  timerCreator: function () {
    // tempo em segundos
    this.time = 20;

    this.timerTxt = game.add
      .text(game.world.width - 15, 15, 'TIME: ' + this.formatDisplayNumbers(this.time), {
        font: '15px emulogic',
        fill: '#fff'
      });
    this.timerTxt.anchor.set(1, 0);
  },

  timerStart: function () {
    // evento de tempo
    // 1000 = 1s - tempo em milissegundos
    this.timer = game.time.events.loop(1000, function () {
      this.time--;
      this.timerTxt.text = 'TIME: ' + this.formatDisplayNumbers(this.time);
    }, this);
  },

  timerStop: function () {
    game.time.events.remove(this.timer);
  },

  // PAUSEGAME
  pauseGame: function () {
    this.onGame = false;

    this.timerStop();

    this.playerStopMovement();
    this.playerStopAnimations();

    this.enemyStopAnimations();

    this.coinStopAnimations();
  },

  // NEXTPHASE
  toNextPhase: function (nextPhaseName) {
    // pausando as coisas
    this.onGame = false;
    this.pauseGame();

    // pausando a musica
    bgMusic.stop();
     // texto de gameover
    const levelCompleteTxt = game.add
      .text(game.world.centerX, 150, 'LEVEL COMPLETE', {
        font: '20px emulogic',
        fill: '#fff'
      });
    levelCompleteTxt.anchor.set(.5);

    // bonus para o jogador
    const bonus = this.time * 5;
    game.global.score += bonus;
    this.highScoreTxt.text = 'SCORE: ' + this.formatDisplayNumbers(game.global.score);

    if (game.global.score > game.global.highScore) {
      game.global.highScore = game.global.score;
    }

    const bonusTxt = game.add
      .text(game.world.centerX, 200, 
        'TIME BONUS: ' + this.formatDisplayNumbers(bonus), {
        font: '15px emulogic',
        fill: '#fff'
      });
    bonusTxt.anchor.set(.5);

    // final score
    const finalScoreTxt = game.add
      .text(game.world.centerX, 300, 
        'FINAL SCORE: ' + this.formatDisplayNumbers(game.global.score), {
        font: '30px emulogic',
        fill: '#fff'
      });
    finalScoreTxt.anchor.set(.5);

    // tempo para passar de fase
    // (tempo em ms, callback, contexto)
    game.time.events.add(5000, function () {
      game.state.start(nextPhaseName);
    }, this);
  },

  // GAMEOVER
  gameOver: function () {
    // pausando as coisas
    this.pauseGame();

    // pausando a musica
    bgMusic.stop();

    // texto de gameover
    const gameOverTxt = game.add
      .text(game.world.centerX, 150, 'GAME OVER', {
        font: '30px emulogic',
        fill: '#fff'
      });
    gameOverTxt.anchor.set(.5);

    // texto de melhor score
    const bestScoreTxt = game.add
      .text(game.world.centerX, 350, 
        'BEST SCORE: ' + this.formatDisplayNumbers(game.global.highScore), {
        font: '20px emulogic',
        fill: '#fff'
      });
    bestScoreTxt.anchor.set(.5);

    // tempo para retornar ao menu
    // (tempo em ms, callback, contexto)
    game.time.events.add(5000, function () {
      game.state.start('menu');
    }, this);
  }
};
