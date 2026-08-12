class ChessPiece {
  constructor(color) {
    this.color = color;
    this.hasMoved = false;
  }

  clone() {
    const copy = new this.constructor(this.color);
    copy.hasMoved = this.hasMoved;
    return copy;
  }

  getLinearMoves(board, fromRow, fromCol, directions) {
    const moves = [];

    for (const [deltaRow, deltaCol] of directions) {
      let row = fromRow + deltaRow;
      let col = fromCol + deltaCol;

      while (board.isInside(row, col)) {
        const occupant = board.getPiece(row, col);

        if (!occupant) {
          moves.push({ row, col });
        } else {
          if (occupant.color !== this.color) {
            moves.push({ row, col });
          }
          break;
        }

        row += deltaRow;
        col += deltaCol;
      }
    }

    return moves;
  }
}

class King extends ChessPiece {
  get type() {
    return "king";
  }

  get symbol() {
    return this.color === "white" ? "♔" : "♚";
  }

  getPseudoLegalMoves(board, fromRow, fromCol) {
    const moves = [];
    const steps = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];

    for (const [deltaRow, deltaCol] of steps) {
      const row = fromRow + deltaRow;
      const col = fromCol + deltaCol;
      if (!board.isInside(row, col)) {
        continue;
      }

      const occupant = board.getPiece(row, col);
      if (!occupant || occupant.color !== this.color) {
        moves.push({ row, col });
      }
    }

    if (!this.hasMoved) {
      const row = fromRow;
      const kingsideRook = board.getPiece(row, 7);
      if (
        kingsideRook instanceof Rook &&
        kingsideRook.color === this.color &&
        !kingsideRook.hasMoved &&
        !board.getPiece(row, 5) &&
        !board.getPiece(row, 6)
      ) {
        moves.push({ row, col: 6, special: "castle-kingside" });
      }

      const queensideRook = board.getPiece(row, 0);
      if (
        queensideRook instanceof Rook &&
        queensideRook.color === this.color &&
        !queensideRook.hasMoved &&
        !board.getPiece(row, 1) &&
        !board.getPiece(row, 2) &&
        !board.getPiece(row, 3)
      ) {
        moves.push({ row, col: 2, special: "castle-queenside" });
      }
    }

    return moves;
  }
}

class Queen extends ChessPiece {
  get type() {
    return "queen";
  }

  get symbol() {
    return this.color === "white" ? "♕" : "♛";
  }

  getPseudoLegalMoves(board, fromRow, fromCol) {
    return this.getLinearMoves(board, fromRow, fromCol, [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1],
    ]);
  }
}

class Rook extends ChessPiece {
  get type() {
    return "rook";
  }

  get symbol() {
    return this.color === "white" ? "♖" : "♜";
  }

  getPseudoLegalMoves(board, fromRow, fromCol) {
    return this.getLinearMoves(board, fromRow, fromCol, [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ]);
  }
}

class Bishop extends ChessPiece {
  get type() {
    return "bishop";
  }

  get symbol() {
    return this.color === "white" ? "♗" : "♝";
  }

  getPseudoLegalMoves(board, fromRow, fromCol) {
    return this.getLinearMoves(board, fromRow, fromCol, [
      [-1, -1], [-1, 1], [1, -1], [1, 1],
    ]);
  }
}

class Knight extends ChessPiece {
  get type() {
    return "knight";
  }

  get symbol() {
    return this.color === "white" ? "♘" : "♞";
  }

  getPseudoLegalMoves(board, fromRow, fromCol) {
    const moves = [];
    const jumps = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];

    for (const [deltaRow, deltaCol] of jumps) {
      const row = fromRow + deltaRow;
      const col = fromCol + deltaCol;
      if (!board.isInside(row, col)) {
        continue;
      }

      const occupant = board.getPiece(row, col);
      if (!occupant || occupant.color !== this.color) {
        moves.push({ row, col });
      }
    }

    return moves;
  }
}

class Pawn extends ChessPiece {
  get type() {
    return "pawn";
  }

  get symbol() {
    return this.color === "white" ? "♙" : "♟";
  }

  getPseudoLegalMoves(board, fromRow, fromCol) {
    const moves = [];
    const direction = this.color === "white" ? -1 : 1;
    const startRow = this.color === "white" ? 6 : 1;
    const oneStepRow = fromRow + direction;

    if (board.isInside(oneStepRow, fromCol) && !board.getPiece(oneStepRow, fromCol)) {
      moves.push({ row: oneStepRow, col: fromCol });

      const twoStepRow = fromRow + direction * 2;
      if (fromRow === startRow && !board.getPiece(twoStepRow, fromCol)) {
        moves.push({ row: twoStepRow, col: fromCol, special: "double-step" });
      }
    }

    for (const deltaCol of [-1, 1]) {
      const targetRow = fromRow + direction;
      const targetCol = fromCol + deltaCol;
      if (!board.isInside(targetRow, targetCol)) {
        continue;
      }

      const occupant = board.getPiece(targetRow, targetCol);
      if (occupant && occupant.color !== this.color) {
        moves.push({ row: targetRow, col: targetCol });
      }

      const enPassant = board.enPassantTarget;
      if (
        enPassant &&
        enPassant.row === targetRow &&
        enPassant.col === targetCol &&
        enPassant.captureRow === fromRow &&
        enPassant.captureCol === targetCol
      ) {
        moves.push({ row: targetRow, col: targetCol, special: "en-passant" });
      }
    }

    return moves;
  }
}

export {
  Bishop,
  ChessPiece,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
};