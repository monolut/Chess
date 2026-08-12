function move(game, fromRow, fromCol, toRow, toCol) {
  game.selectSquare(fromRow, fromCol);
  game.moveSelectedPiece(toRow, toCol);
}

function setupOpening(game, ui) {
  move(game, 6, 4, 4, 4);
  move(game, 1, 4, 3, 4);
  move(game, 7, 6, 5, 5);
  move(game, 0, 1, 2, 2);
  move(game, 7, 5, 3, 1);
  move(game, 0, 6, 2, 5);
  ui.render();
}

function setupHistory(game, ui) {
  move(game, 6, 4, 4, 4);
  move(game, 1, 3, 3, 3);
  move(game, 4, 4, 3, 3);
  game.selectSquare(0, 3);
  ui.render();
}

function setupCheck(game, ui) {
  move(game, 6, 5, 5, 5);
  move(game, 1, 4, 3, 4);
  move(game, 6, 6, 4, 6);
  move(game, 0, 3, 4, 7);
  ui.render();
}

function runDemoScenario(game, ui) {
  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo");

  if (!demo) {
    return;
  }

  if (demo === "opening") {
    setupOpening(game, ui);
  }

  if (demo === "history") {
    setupHistory(game, ui);
  }

  if (demo === "check") {
    setupCheck(game, ui);
  }
}

export { runDemoScenario };