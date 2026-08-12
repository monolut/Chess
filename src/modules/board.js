import {
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} from "./pieces.js";

class ChessBoard {
  constructor() {
    this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.enPassantTarget = null;
    this.setupInitialPosition();
  }

  setupInitialPosition() {
    this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.enPassantTarget = null;

    const backRank = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

    for (let col = 0; col < 8; col += 1) {
      this.grid[0][col] = new backRank[col]("black");
      this.grid[1][col] = new Pawn("black");
      this.grid[6][col] = new Pawn("white");
      this.grid[7][col] = new backRank[col]("white");
    }
  }

  clone() {
    const copy = new ChessBoard();
    copy.grid = this.grid.map((row) => row.map((piece) => (piece ? piece.clone() : null)));
    copy.enPassantTarget = this.enPassantTarget ? { ...this.enPassantTarget } : null;
    return copy;
  }

  isInside(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  getPiece(row, col) {
    return this.isInside(row, col) ? this.grid[row][col] : null;
  }

  setPiece(row, col, piece) {
    if (this.isInside(row, col)) {
      this.grid[row][col] = piece;
    }
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    this.setPiece(toRow, toCol, piece);
    this.setPiece(fromRow, fromCol, null);
  }

  findKing(color) {
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = this.getPiece(row, col);
        if (piece instanceof King && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  }
}

export { ChessBoard };