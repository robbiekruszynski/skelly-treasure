import React, { Component } from "react";
import logo from "./logo192.png";
import { questions } from "./Questions.js";

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
      interval: this.startGame(),
      timer: 0,
      numChests: 10,
      moving: true,
      prompts: [],
      choices: []
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    this.prepGame();
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
      if (this.state.moving) {
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
      }
      let timer = this.state.timer + 1;
      this.setState({timer})
      this.positionChar();
    }, 50);
  }

  endGame() {
    clearInterval(this.state.interval);
  }

  prepGame() {
    this.renderChests();
    this.randomizeQuestions();
  }

  renderChests() {
    let userChar = document.querySelector('#charDiv');
    let chestsClosed = [];
    for (let i = 0; i < this.state.numChests; i++) {
      let div = document.createElement('div');
      div.innerHTML = '|_|';
      div.id = `chest${i}`;
      div.style.position = "absolute";
      div.style.left = `${Math.floor(Math.random() * 100)}%`; // '65%'
      div.style.bottom = `${Math.floor(Math.random() * 100)}%`;
      div.style.width = '100px';
      userChar.parentNode.insertBefore( div, userChar );
      chestsClosed.push(true);
    }
    this.setState({chestsClosed});
  }

  randomizeQuestions() {
    let prompts = [];
    let choices = [];
    questions
      .sort(() => Math.random() - 0.5)
      .forEach(function(q) {
        prompts.push(q.question);
        choices.push(q.responses);
      });
    this.setState({ prompts });
    this.setState({ choices });
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
      case(" "): 
        this.checkForChests();
        break;
      default:
        break;
    }
  }

  checkForChests() {
    for (let i = 0; i < this.state.numChests; i++) {
      let chest = document.querySelector(`#chest${i}`);
      // "87%" -- > 87
      if (Math.pow(Math.abs(parseInt(chest.style.left) - this.state.x), 2) + Math.pow(Math.abs(parseInt(chest.style.bottom) - this.state.y), 2) < Math.pow(5, 2) && this.state.chestsClosed[i]) {
        this.startQuestion();
      }
    }
  }

  startQuestion() {
    this.setState({moving: false});
    let modal = document.querySelector("#questionModal");
    modal.style.display = "block";
  }

  exitQuestion() {
    this.setState({moving: true});
    let modal = document.querySelector("#questionModal");
    modal.style.display = "none";
  }
  
  positionChar() {
    // VALUES FOR outputNum BY KEYPRESS
    // a: 1
    // d: 2
    // w: 4
    // aw: 5
    // dw: 6
    // s: 8
    // as: 9
    // ds: 10
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
      0: 'none',
      1: 'west',
      2: 'east',
      4: 'north',
      5: 'northwest',
      6: 'northeast',
      8: 'south',
      9: 'southwest',
      10: 'southeast'
    }

    // PLACEHOLDER LOGIC -- With sprites added, position[outputNum] could be an array of images for the avatar. Then it could just be:
    // let charPosition = position[outputNum][Math.floor(this.state.timer / 4) % position[outputNum].length]
    // I just think this looks *cool*
    let shiftedPos = position[outputNum].slice(Math.floor(this.state.timer / 4) % position[outputNum].length) + position[outputNum].slice(0,Math.floor(this.state.timer / 4) % position[outputNum].length)
    this.setState({charPosition: shiftedPos});
  }

  render() {
    return (
      <div className="GameScreen" style={{ position: "relative" }}>
        <button onClick={() => this.endGame()}>Pause</button>
        <p>Game</p>
        <div 
          id="questionModal"
          style={{
            position: "aboslute",
            display: "none",
            marginLeft: "15%",
            marginBottom: "15%",
            width: "30%",
            height: "30%",
            backgroundColor: "rgba(0,0,0,0.7)"
          }}
        >
          <p onClick={() => this.exitQuestion()}>close</p>
          <p>Question!</p>
        </div>
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
