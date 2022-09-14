import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Quadrado(props) {
  return (
    <button
      className="Quadrado"
      onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderQuadrado(i) {
    return (
      <Quadrado 
        value={this.props.Quadrados[i]} 
        onClick={() => { this.props.onClick(i) }} 
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderQuadrado(0)}
          {this.renderQuadrado(1)}
          {this.renderQuadrado(2)}
        </div>
        <div className="board-row">
          {this.renderQuadrado(3)}
          {this.renderQuadrado(4)}
          {this.renderQuadrado(5)}
        </div>
        <div className="board-row">
          {this.renderQuadrado(6)}
          {this.renderQuadrado(7)}
          {this.renderQuadrado(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  /**
   * Em classes JS voce sempre precisa chamar 'super' ao definir o construtor de uma subclasse. Todos os componentes de classe React que possuem um método construtor devem inicia-lo com uma chamada 'super(props)'
   */
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        Quadrados: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    } 
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const Quadrados = current.Quadrados.slice()
    if(calculateWinner(Quadrados) || Quadrados[i]) return
    Quadrados[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        Quadrados: Quadrados
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.Quadrados)
    const status = winner ? `Vencedor: ${winner}` : `Próximo jogador: ${this.state.xIsNext ? 'X' : 'O'}`

    const movimento = history.map((step, move) => {
      const desc = move ? `Ir para movimento #${move}` : 'Ir para o início do jogo'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            Quadrados={current.Quadrados}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{movimento}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(Quadrados) {
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
    if (Quadrados[a] && Quadrados[a] === Quadrados[b] && Quadrados[a] === Quadrados[c]) return Quadrados[a]
  }
  return null
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
