class ChessUI {
  constructor(game) {
    this.game = game;
    this.boardElement = document.getElementById("chessboard");
    this.turnIndicator = document.getElementById("turn-indicator");
    this.gameStateElement = document.getElementById("game-state");
    this.lastMoveElement = document.getElementById("last-move");
    this.whiteCaptures = document.getElementById("white-captures");
    this.blackCaptures = document.getElementById("black-captures");
    this.moveHistory = document.getElementById("move-history");
    this.restartButton = document.getElementById("restart-button");
    this.dragSource = null;
  }

  mount() {
    this.createBoard();
    this.attachEvents();
    this.render();
  }

  createBoard() {
    this.boardElement.innerHTML = "";
    const fileNames = "abcdefgh";

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const square = document.createElement("div");
        square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
        square.dataset.row = String(row);
        square.dataset.col = String(col);
        square.dataset.file = String(col);
        square.dataset.rank = String(8 - row);
        square.dataset.fileLabel = fileNames[col];

        if (col === 0) {
          const rank = document.createElement("span");
          rank.className = "coordinate-rank";
          rank.textContent = String(8 - row);
          square.appendChild(rank);
        }

        square.addEventListener("click", () => this.handleSquareClick(row, col));
        square.addEventListener("dragover", (event) => event.preventDefault());
        square.addEventListener("drop", (event) => this.handleDrop(event, row, col));

        this.boardElement.appendChild(square);
      }
    }
  }

  attachEvents() {
    this.restartButton.addEventListener("click", () => {
      this.game.reset();
      this.render();
    });
  }

  handleSquareClick(row, col) {
    const selected = this.game.selectedSquare;
    const piece = this.game.getPiece(row, col);

    if (selected && this.tryMove(row, col)) {
      return;
    }

    if (piece && piece.color === this.game.currentTurn) {
      this.game.selectSquare(row, col);
    } else {
      this.game.clearSelection();
    }

    this.render();
  }

  handleDrop(event, row, col) {
    event.preventDefault();
    if (!this.dragSource) {
      return;
    }

    this.game.selectSquare(this.dragSource.row, this.dragSource.col);
    this.tryMove(row, col);
    this.dragSource = null;
    this.render();
  }

  tryMove(row, col) {
    const result = this.game.moveSelectedPiece(row, col);
    if (!result.moved) {
      return false;
    }
    this.render();
    return true;
  }

  render() {
    this.renderBoard();
    this.renderStatus();
    this.renderCaptures();
    this.renderHistory();
  }

  renderBoard() {
    const checkedKing = this.game.getCheckedKingPosition();

    for (const square of this.boardElement.children) {
      const row = Number(square.dataset.row);
      const col = Number(square.dataset.col);
      const piece = this.game.getPiece(row, col);

      square.classList.remove("selected", "legal", "capture", "in-check");
      const existingPiece = square.querySelector(".piece");
      if (existingPiece) {
        existingPiece.remove();
      }

      if (
        this.game.selectedSquare &&
        this.game.selectedSquare.row === row &&
        this.game.selectedSquare.col === col
      ) {
        square.classList.add("selected");
      }

      const move = this.game.legalMoves.find((item) => item.row === row && item.col === col);
      if (move) {
        square.classList.add(piece ? "capture" : "legal");
      }

      if (checkedKing && checkedKing.row === row && checkedKing.col === col) {
        square.classList.add("in-check");
      }

      if (piece) {
        const pieceElement = document.createElement("div");
        pieceElement.className = "piece";
        pieceElement.textContent = piece.symbol;
        pieceElement.draggable = piece.color === this.game.currentTurn && this.game.gameState !== "checkmate" && this.game.gameState !== "stalemate";
        pieceElement.addEventListener("dragstart", () => this.handleDragStart(row, col, pieceElement));
        pieceElement.addEventListener("dragend", () => {
          pieceElement.classList.remove("dragging");
        });
        square.appendChild(pieceElement);
      }
    }
  }

  handleDragStart(row, col, pieceElement) {
    this.dragSource = { row, col };
    this.game.selectSquare(row, col);
    pieceElement.classList.add("dragging");
    this.render();
  }

  renderStatus() {
    this.turnIndicator.textContent = this.capitalize(this.game.currentTurn);
    this.gameStateElement.textContent = this.game.getGameStateLabel();
    this.lastMoveElement.textContent = this.game.lastMoveText;
  }

  renderCaptures() {
    this.renderCaptureRow(this.whiteCaptures, this.game.capturedByWhite);
    this.renderCaptureRow(this.blackCaptures, this.game.capturedByBlack);
  }

  renderCaptureRow(element, captures) {
    element.innerHTML = "";
    if (captures.length === 0) {
      const placeholder = document.createElement("span");
      placeholder.className = "empty-state";
      placeholder.textContent = "None";
      element.appendChild(placeholder);
      return;
    }

    for (const piece of captures) {
      const item = document.createElement("span");
      item.className = "captured-piece";
      item.textContent = piece.symbol;
      element.appendChild(item);
    }
  }

  renderHistory() {
    this.moveHistory.innerHTML = "";

    if (this.game.moveHistory.length === 0) {
      const item = document.createElement("li");
      item.className = "empty-state";
      item.textContent = "No moves yet.";
      this.moveHistory.appendChild(item);
      return;
    }

    this.game.moveHistory.forEach((move, index) => {
      const item = document.createElement("li");
      const turnNumber = Math.floor(index / 2) + 1;
      const prefix = index % 2 === 0 ? `${turnNumber}. ` : "";
      item.textContent = `${prefix}${move}`;
      this.moveHistory.appendChild(item);
    });
  }

  capitalize(value) {
    return value[0].toUpperCase() + value.slice(1);
  }
}

export { ChessUI };