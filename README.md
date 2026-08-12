# ♟️ Chess

A small browser-based chess game built with **HTML, CSS and vanilla JavaScript**.

The project implements a playable two-player chess game with a custom chess engine, interactive board, move validation, captured pieces and move history.

## ✨ Features

* ♟️ Two-player local chess game
* 🎯 Legal move validation
* 🖱️ Drag & drop piece movement
* 👆 Click-to-move support
* 💡 Highlighting of available moves
* 👑 Check detection
* 🏁 Game state detection
* 📜 Move history
* ⚔️ Captured pieces tracking
* 🔄 Restart game functionality
* 📱 Responsive browser interface

The UI also displays the current player, game state and last move.

## 🛠️ Tech Stack

* **HTML5** — application structure
* **CSS3** — styling and responsive layout
* **JavaScript (ES Modules)** — game logic and UI
* **Node.js** — running tests

No frontend frameworks or external chess libraries are used.

## 📁 Project Structure

```text
Chess/
├── index.html
├── package.json
├── styles/
│   └── main.css
├── src/
│   ├── main.js
│   └── modules/
│       ├── board.js
│       ├── chess-game.js
│       ├── chess-ui.js
│       ├── demo-scenarios.js
│       └── pieces.js
└── tests/
    └── chess.test.js
```

The chess logic is separated into several modules responsible for the board, game state, pieces, UI and demo scenarios.

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/monolut/Chess.git
cd Chess
```

### Run the game

The project is a static browser application, so no backend or build step is required.

You can open `index.html` directly in a browser, or use a local development server.

For example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Run tests

Install Node.js if it is not already installed, then run:

```bash
npm test
```

The project defines its test command as `node tests/chess.test.js`.

## 🎮 How to Play

1. Start the game.
2. White moves first.
3. Select a piece by clicking it or dragging it.
4. Available legal moves are highlighted.
5. Make a move by selecting a destination square.
6. Continue alternating turns between White and Black.
7. The interface keeps track of captured pieces and the complete move history.

The board interface provides indicators for legal moves, selected pieces and a king in check.

## 🧩 Architecture

The project keeps the chess rules separate from the presentation layer.

### `chess-game.js`

Responsible for the main game state and chess rules.

### `board.js`

Handles the chessboard representation and board-related operations.

### `pieces.js`

Contains the chess piece logic and movement rules.

### `chess-ui.js`

Connects the chess engine with the browser interface and handles user interaction.

### `main.js`

Application entry point that initializes the game and UI.

This modular structure keeps the core game logic independent from the DOM as much as possible.

## 🎯 Project Goals

This project was created as a small practical JavaScript project focused on:

* Object-oriented programming
* Modular JavaScript
* State management
* DOM manipulation
* Implementing non-trivial game rules
* Writing and testing game logic without external libraries

<img width="1920" height="1157" alt="Снимок экрана — 2026-08-13 в 00 04 57" src="https://github.com/user-attachments/assets/a21561a0-57df-4e93-a13c-5f20cabe09ca" />


