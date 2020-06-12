import React, { Component } from "react";
import logo from "./logo192.png";
class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 50,
      y: 50,
      a: false,
      d: false,
      w: false,
      s: false,
      mostRecentHorizontal: 'none',
      mostRecentVertical: 'none',
      charPosition: '',
      interval: this.startGame()
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    this.endGame();
  }

  startGame() {
    return setInterval(() => {
      let x;
      let y;
      if (this.state.a) {
        x = this.state.x - 1;
        this.setState({x});
      }
      if (this.state.w) {
        y = this.state.y + 1;
        this.setState({y});
      }
      if (this.state.s) {
        y = this.state.y - 1;
        this.setState({y});
      }
      if (this.state.d) {
        x = this.state.x + 1;
        this.setState({x});
      }
      this.positionChar();
    }, 100);
  }

  endGame() {
    clearInterval(this.state.interval);
  }

  handleKeyUp = (event) => {
    switch(event.key) {
      case("a"):
        this.setState({a: false});
        if (this.state.mostRecentHorizontal === 'a') {
          this.setState({mostRecentHorizontal: this.state.d ? 'd' : 'none'});
        }
        break;
      case("w"):
        this.setState({w: false});
        if (this.state.mostRecentVertical === 'w') {
          this.setState({mostRecentVertical: this.state.s ? 's' : 'none'});
        }
        break;
      case("s"):
        this.setState({s: false});
        if (this.state.mostRecentVertical === 's') {
          this.setState({mostRecentVertical: this.state.w ? 'w' : 'none'});
        }
        break;
      case("d"):
        this.setState({d: false});
        if (this.state.mostRecentHorizontal === 'd') {
          this.setState({mostRecentHorizontal: this.state.a ? 'a' : 'none'});
        }
        break;
      default:
        break;
    }
  }

  handleKeyDown = (event) => {
    switch(event.key) {
      case("a"):
        this.setState({a: true});
        this.setState({mostRecentHorizontal: 'a'});
        break;
      case("w"):
        this.setState({w: true});
        this.setState({mostRecentVertical: 'w'});
        break;
      case("s"):
        this.setState({s: true});
        this.setState({mostRecentVertical: 's'});
        break;
      case("d"):
        this.setState({d: true});
        this.setState({mostRecentHorizontal: 'd'});
        break;
      default:
        break;
    }
  }

  // a: 1
  // d: 2
  // w: 4
  // aw: 5
  // dw: 6
  // s: 8
  // as: 9
  // ds: 10

  positionChar() {
    let outputNum = 0;
    switch(this.state.mostRecentHorizontal) {
      case('a'):
        outputNum += 1;
        break;
      case('d'):
        outputNum += 2;
        break;
      default:
        break;
    }
    switch(this.state.mostRecentVertical) {
      case('w'):
        outputNum += 4;
        break;
      case('s'):
        outputNum += 8;
        break;
      default:
        break;
    }
    const position = {
      1: 'west',
      2: 'east',
      4: 'north',
      5: 'northwest',
      6: 'northeast',
      8: 'south',
      9: 'southwest',
      10: 'southeast'
    }
    this.setState({charPosition: position[outputNum]})
  }

  render() {
    return (
      <div className="GameScreen" style={{ position: "relative" }}>
        <button onClick={() => this.endGame()}>Stop!</button>
        <p>Game</p>
        <p>x: {this.state.x}</p>
        <p>y: {this.state.y}</p>
        <div
          id="charDiv"
          style={{
            position: "absolute",
            left: `${this.state.x}%`,
            bottom: `${this.state.y}%`,
            width: "100px",
          }}
        >
          <img src={logo} alt="" />
          <p>{this.state.charPosition}</p>
        </div>
      </div>
    );
  }
}

export default GameScreen;
