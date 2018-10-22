const stageOneState = {
  create: function () {
    // GameManager.setMaze(mazes.stageOneMaze);
    // GameManager.setNextPhase('stageTwo');
    GameManager.gameConfig({
      maze: mazes.stageOneMaze,
      gametime: 20,
      coinsToWin: 2,
      nextPhaseName: 'stageTwo'
    });
    GameManager.create();
  },

  update: function () {
    GameManager.update();
  }
}

const stageTwoState = {
  create: function () {
    GameManager.gameConfig({
      maze: mazes.stageTwoMaze,
      gametime: 30,
      coinsToWin: 3,
      nextPhaseName: 'end'
    });
    GameManager.create();
  },

  update: function () {
    GameManager.update();
  }
}
