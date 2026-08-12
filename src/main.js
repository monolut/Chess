import { ChessGame } from "./modules/chess-game.js";
import { ChessUI } from "./modules/chess-ui.js";
import { runDemoScenario } from "./modules/demo-scenarios.js";

const game = new ChessGame();
const ui = new ChessUI(game);

ui.mount();
runDemoScenario(game, ui);

window.chessApp = { game, ui };