import { ChessBoard } from "./board.js";
import {
  King,
  Pawn,
  Queen,
} from "./pieces.js";

class ChessGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = new ChessBoard();
    this.currentTurn = "white";
    this.moveHistory = [];
    this.capturedByWhite = [];
    this.capturedByBlack = [];
    this.selectedSquare = null;
    this.legalMoves = [];
    this.gameState = "playing";
    this.winner = null;
    this.lastMoveText = "None";
  }

  selectSquare(row, col) {
    const piece = this.board.getPiece(row, col);
    if (!piece || piece.color !== this.currentTurn) {
      this.clearSelection();
      return [];
    }

    this.selectedSquare = { row, col };
    this.legalMoves = this.getLegalMovesForPiece(row, col);
    return this.legalMoves;
  }

  clearSelection() {
    this.selectedSquare = null;
    this.legalMoves = [];
  }

  getPiece(row, col) {
    return this.board.getPiece(row, col);
  }

  getLegalMovesForPiece(row, col) {
    const piece = this.board.getPiece(row, col);
    if (!piece || piece.color !== this.currentTurn) {
      return [];
    }

    const pseudoMoves = piece.getPseudoLegalMoves(this.board, row, col);
    return pseudoMoves.filter((move) => this.isMoveLegal(row, col, move.row, move.col, move.special));
  }

  isMoveLegal(fromRow, fromCol, toRow, toCol, special = null) {
    const piece = this.board.getPiece(fromRow, fromCol);
    if (!piece) {
      return false;
    }

    if (piece instanceof King && special?.startsWith("castle")) {
      if (this.isKingInCheck(piece.color, this.board)) {
        return false;
      }

      const pathCols = special === "castle-kingside" ? [5, 6] : [3, 2];
      for (const pathCol of pathCols) {
        const simulation = this.board.clone();
        simulation.movePiece(fromRow, fromCol, fromRow, pathCol);
        if (this.isKingInCheck(piece.color, simulation)) {
          return false;
        }
      }
    }

    const simulation = this.board.clone();
    this.applyMoveToBoard(simulation, fromRow, fromCol, toRow, toCol, special, false);
    return !this.isKingInCheck(piece.color, simulation);
  }

  moveSelectedPiece(toRow, toCol) {
    if (!this.selectedSquare || this.gameState === "checkmate" || this.gameState === "stalemate") {
      return { moved: false };
    }

    const move = this.legalMoves.find((item) => item.row === toRow && item.col === toCol);
    if (!move) {
      return { moved: false };
    }

    const fromRow = this.selectedSquare.row;
    const fromCol = this.selectedSquare.col;
    const piece = this.board.getPiece(fromRow, fromCol);

    const capture = this.applyMoveToBoard(this.board, fromRow, fromCol, toRow, toCol, move.special, true);
    if (capture) {
      if (this.currentTurn === "white") {
        this.capturedByWhite.push(capture);
      } else {
        this.capturedByBlack.push(capture);
      }
    }

    const promotion = piece instanceof Pawn && (toRow === 0 || toRow === 7);
    if (promotion) {
      this.board.setPiece(toRow, toCol, new Queen(piece.color));
      this.board.getPiece(toRow, toCol).hasMoved = true;
    }

    this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    this.updateGameState();

    this.lastMoveText = this.buildMoveText(piece, fromRow, fromCol, toRow, toCol, capture, move.special, promotion);
    this.moveHistory.push(this.lastMoveText);
    this.clearSelection();

    return { moved: true };
  }

  applyMoveToBoard(board, fromRow, fromCol, toRow, toCol, special, keepEnPassant) {
    const piece = board.getPiece(fromRow, fromCol);
    if (!piece) {
      return null;
    }

    let capturedPiece = board.getPiece(toRow, toCol);

    if (special === "en-passant") {
      const captureRow = fromRow;
      const captureCol = toCol;
      capturedPiece = board.getPiece(captureRow, captureCol);
      board.setPiece(captureRow, captureCol, null);
    }

    board.movePiece(fromRow, fromCol, toRow, toCol);
    const movedPiece = board.getPiece(toRow, toCol);
    movedPiece.hasMoved = true;

    if (piece instanceof King && special === "castle-kingside") {
      board.movePiece(fromRow, 7, fromRow, 5);
      board.getPiece(fromRow, 5).hasMoved = true;
    }

    if (piece instanceof King && special === "castle-queenside") {
      board.movePiece(fromRow, 0, fromRow, 3);
      board.getPiece(fromRow, 3).hasMoved = true;
    }

    if (keepEnPassant) {
      board.enPassantTarget = null;

      if (piece instanceof Pawn && special === "double-step") {
        const direction = piece.color === "white" ? -1 : 1;
        board.enPassantTarget = {
          row: fromRow + direction,
          col: fromCol,
          captureRow: toRow,
          captureCol: toCol,
        };
      }
    }

    return capturedPiece;
  }

  isKingInCheck(color, board = this.board) {
    const kingPosition = board.findKing(color);
    if (!kingPosition) {
      return false;
    }

    return this.isSquareAttacked(kingPosition.row, kingPosition.col, color === "white" ? "black" : "white", board);
  }

  isSquareAttacked(targetRow, targetCol, byColor, board = this.board) {
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = board.getPiece(row, col);
        if (!piece || piece.color !== byColor) {
          continue;
        }

        if (piece instanceof Pawn) {
          const direction = piece.color === "white" ? -1 : 1;
          for (const deltaCol of [-1, 1]) {
            if (row + direction === targetRow && col + deltaCol === targetCol) {
              return true;
            }
          }
          continue;
        }

        if (piece instanceof King) {
          if (Math.abs(targetRow - row) <= 1 && Math.abs(targetCol - col) <= 1) {
            return true;
          }
          continue;
        }

        const moves = piece.getPseudoLegalMoves(board, row, col);
        if (moves.some((move) => move.row === targetRow && move.col === targetCol)) {
          return true;
        }
      }
    }

    return false;
  }

  hasAnyLegalMove(color) {
    const savedTurn = this.currentTurn;
    this.currentTurn = color;

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = this.board.getPiece(row, col);
        if (piece && piece.color === color) {
          const moves = this.getLegalMovesForPiece(row, col);
          if (moves.length > 0) {
            this.currentTurn = savedTurn;
            return true;
          }
        }
      }
    }

    this.currentTurn = savedTurn;
    return false;
  }

  updateGameState() {
    const color = this.currentTurn;
    const inCheck = this.isKingInCheck(color);
    const hasMoves = this.hasAnyLegalMove(color);

    if (inCheck && !hasMoves) {
      this.gameState = "checkmate";
      this.winner = color === "white" ? "black" : "white";
      return;
    }

    if (!inCheck && !hasMoves) {
      this.gameState = "stalemate";
      this.winner = null;
      return;
    }

    if (inCheck) {
      this.gameState = "check";
      this.winner = null;
      return;
    }

    this.gameState = "playing";
    this.winner = null;
  }

  getGameStateLabel() {
    if (this.gameState === "checkmate") {
      return `Checkmate - ${this.capitalize(this.winner)} wins`;
    }

    if (this.gameState === "stalemate") {
      return "Stalemate";
    }

    if (this.gameState === "check") {
      return `${this.capitalize(this.currentTurn)} is in check`;
    }

    return "In progress";
  }

  getCheckedKingPosition() {
    if (this.gameState !== "check" && this.gameState !== "checkmate") {
      return null;
    }
    return this.board.findKing(this.currentTurn);
  }

  buildMoveText(piece, fromRow, fromCol, toRow, toCol, capture, special, promotion) {
    if (piece instanceof King && special === "castle-kingside") {
      return "O-O";
    }

    if (piece instanceof King && special === "castle-queenside") {
      return "O-O-O";
    }

    const fileNames = "abcdefgh";
    const pieceMarks = {
      king: "K",
      queen: "Q",
      rook: "R",
      bishop: "B",
      knight: "N",
      pawn: "",
    };

    const from = `${fileNames[fromCol]}${8 - fromRow}`;
    const to = `${fileNames[toCol]}${8 - toRow}`;
    let text = `${pieceMarks[piece.type]}${from}${capture ? "x" : "->"}${to}`;

    if (special === "en-passant") {
      text += " e.p.";
    }

    if (promotion) {
      text += "=Q";
    }

    if (this.gameState === "checkmate") {
      text += "#";
    } else if (this.gameState === "check") {
      text += "+";
    }

    return text;
  }

  capitalize(value) {
    return value ? value[0].toUpperCase() + value.slice(1) : "";
  }
}

export { ChessGame };