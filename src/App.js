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

  createCell(value = "", possibilities = []) {
    return { value, possibilities };
  }

  setCell(value, iTarget, jTarget) {
    value = value ? Math.floor(value) : "";
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

  getRowValues(iTarget) {
    return this.state.grid[iTarget].map(cell => cell.value);
  }

  getColValues(jTarget) {
    // return this.state.grid.map(row =>
    //   row.filter((cell, j) => jTarget === j).map(cell => cell.value)
    // );
    let values = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (j === jTarget) {
          values.push(this.state.grid[i][j].value);
        }
      }
    }
    return values;
  }

  getBlockValuesOfCell(iTarget, jTarget) {
    let { blockI, blockJ } = this.getBlock(iTarget, jTarget);
    let iMin = blockI * 3;
    let iMax = blockI * 3 + 2;
    let jMin = blockJ * 3;
    let jMax = blockJ * 3 + 2;
    let possibilities = [];
    for (let i = iMin; i <= iMax; i++) {
      for (let j = jMin; j <= jMax; j++) {
        possibilities.push(this.state.grid[i][j].value);
      }
    }
    return possibilities;
    // return this.state.grid.map(row =>
    //   row.filter((cell, j) => jTarget === j).map(cell => cell.value)
    // );
  }

  getBlockValues() {
    let values = [];
    for (let i = 0; i < 9; i += 3) {
      values.push([]);
      for (let j = 0; j < 9; j += 3) {
        values[i].push(this.getBlockValuesOfCell(i, j));
      }
    }
    return values;
  }

  getBlock(i, j) {
    return {
      blockI: Math.floor(i / 3),
      blockJ: Math.floor(j / 3)
    };
  }

  getMissing(values) {
    let possibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let intValues = values.map(value => parseInt(value));
    return possibilities.filter(value => {
      return intValues.indexOf(value) === -1;
    });
  }

  getPossibilities() {
    let newGrid = this.createEmptyGrid();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let value = this.state.grid[i][j].value;
        let possibilities = [];
        if (!value) {
          let associatedValues = [
            ...this.getRowValues(i),
            ...this.getColValues(j),
            ...this.getBlockValuesOfCell(i, j)
          ];
          let possibleValues = this.getMissing(associatedValues);
          let nonRedudantPossibleValues = possibleValues.filter(
            (v, k) => possibleValues.indexOf(v) === k
          );
          possibilities = nonRedudantPossibleValues;
        }
        newGrid[i][j] = this.createCell(value, possibilities);
      }
    }
    this.setState({
      ...this.state,
      grid: newGrid
    });
  }

  render() {
    let gridEl = this.state.grid.map((row, i) => {
      let cells = row.map((cell, j) => {
        let possibilities = cell.possibilities.map((possibility, k) => {
          return (
            <li
              className="Sudoku__possibilities-list__possibility"
              key={k}
              onClick={() => {
                this.setCell(possibility, i, j);
              }}
            >
              {possibility}
            </li>
          );
        });
        let possibilitiesClasses =
          cell.possibilities.length === 1
            ? "Sudoku__possibilities-list Sudoku__possibilities-list--attention"
            : "Sudoku__possibilities-list";
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
            <ul className={possibilitiesClasses}>{possibilities}</ul>
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
        <button onClick={this.getPossibilities.bind(this)}>Get Hints</button>
      </div>
    );
  }
}

export default App;
