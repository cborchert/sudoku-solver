import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    grid: this.createEmptyGrid()
  };

  createEmptyGrid() {
    let grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(this.createEmptyRow());
    }
    return grid;
  }

  createEmptyRow() {
    let row = [];
    for (let i = 0; i < 9; i++) {
      row.push(this.createCell());
    }
    return row;
  }

  createCell(value = null, possibilities = []) {
    return { value, possibilities };
  }

  setCell(value, iTarget, jTarget) {
    value = value ? Math.floor(value) : null;
    this.setState({
      ...this.state,
      grid: this.state.grid.map((row, i) => {
        return row.map((cell, j) => {
          if (i === iTarget && j === jTarget) {
            return this.createCell(value);
          } else {
            return cell;
          }
        });
      })
    });
  }

  render() {
    let gridEl = this.state.grid.map((row, i) => {
      let cells = row.map((cell, j) => {
        let possibilities = cell.possibilities.map((possibility, k) => {
          return (
            <li
              key={k}
              onClick={() => {
                this.setCell(possibility, i, j);
              }}
            >
              {possibility}
            </li>
          );
        });
        return (
          <div key={j} className="Sudoku__cell" data-cell={`${i}_${j}`}>
            <input
              value={cell.value}
              type="number"
              placeholder="?"
              min="1"
              max="9"
              step="1"
              className="Sudoku__possibilities-list__possibility"
              onChange={e => {
                this.setCell(e.target.value, i, j);
              }}
            />
            <ul className="Sudoku__possibilities-list">{possibilities}</ul>
          </div>
        );
      });
      return (
        <div key={i} className="Sudoku__row">
          {cells}
        </div>
      );
    });
    return (
      <div className="Sudoku">
        <div className="Sudoku__grid">{gridEl}</div>
        <button>Single Iteration</button>
      </div>
    );
  }
}

export default App;
