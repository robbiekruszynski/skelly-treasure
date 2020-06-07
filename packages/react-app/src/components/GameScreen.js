import React, { Component } from "react";

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
      interval: this.startGame()
    }
  }

  componentDidMount() {
    console.log('hello');
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
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
    }, 100);
  }

  endGame() {
    clearInterval(this.state.interval);
  }

  handleKeyUp = (event) => {
    switch(event.key) {
      case("a"):
        this.setState({a: false})
        break;
      case("w"):
        this.setState({w: false})
        break;
      case("s"):
        this.setState({s: false})
        break;
      case("d"):
        this.setState({d: false})
        break;
    }
  }

  handleKeyDown = (event) => {
    switch(event.key) {
      case("a"):
        this.setState({a: true})
        break;
      case("w"):
        this.setState({w: true})
        break;
      case("s"):
        this.setState({s: true})
        break;
      case("d"):
        this.setState({d: true})
        break;
    }
  }
  render() {
    return (
      <div className="GameScreen" style={{position:'relative'}}>
        <button onClick={() => this.endGame()}>Stop!</button>
        <p>Game</p>
        <p>x: {this.state.x}</p>
        <p>y: {this.state.y}</p>
        <div id="charDiv" style={{position: 'absolute', left: `${this.state.x}%`, bottom: `${this.state.y}%`, width: '100px'}}>
          <p>Me!</p>
        </div>
      </div>
    );
  }
}

export default GameScreen;
