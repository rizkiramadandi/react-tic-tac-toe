import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) return
    const turn = this.state.xIsNext ? 'X' : 'O'
    squares[i] = turn
    this.setState({
      history: history.concat([
        {
          squares: squares,
          whoseTurn: turn,
          whichIndex: i
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  restart() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]

    const winner = calculateWinner(current.squares)
    let status
    if (
      !winner &&
      current.squares.filter((v) => v !== null).length ===
        current.squares.length
    )
      status = `Draw`
    else if (winner) status = `Winner ${winner}`
    else status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`

    const moves = history.map((step, move) => {
      const desc = move ? `Move #${move} (${step.whoseTurn} Turn on Index ${step.whichIndex})` : 'Game start'
      return (
        <li key={move}>
          {desc}
          <button className="history-btn" onClick={() => this.jumpTo(move)}>
            Go
          </button>
        </li>
      )
    })

    return (
      <div>
        <div className="game">
          <div className="games">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-restart" onClick={() => this.restart()}>
              Restart
            </div>
          </div>
          <div className="game-history">
            <div className="game-history-title">Game History</div>
            <ol className="history">{moves}</ol>
          </div>
        </div>
        <div className="game-info">{status}</div>
      </div>
    )
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game />)

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
