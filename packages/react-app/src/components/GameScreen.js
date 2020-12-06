import React, { Component } from "react";
import logo from "./logo192.png";
import { questions } from "./Questions.js";

class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMessage: "Move with WASD, Open chests with Space, Answer questions to kill the monster!",
      x: 50,
      y: 50,
      a: false,
      d: false,
      w: false,
      s: false,
      monsterX: 50,
      monsterY: 90,
      monsterSpeed: 0.25,
      monsterAvatar: "<0_0>",
      mostRecentHorizontal: 'none',
      mostRecentVertical: 'none',
      charPosition: '',
      interval: this.startGame(),
      timer: 0,
      numChests: 10,
      currentChest: undefined,
      moving: true,
      prompts: [],
      choices: [],
      prompt: "",
      choicesDiv: "",
      selectedAnswers: []
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
      this.checkForEndGame();
      let x = this.state.x;
      let y = this.state.y;
      let deltaX = 0;
      let deltaY = 0;
      if (this.state.moving) {
        if (this.state.a) {
          deltaX -= 1;
        }
        if (this.state.w) {
          deltaY += 1;
        }
        if (this.state.s) {
          deltaY -= 1;
        }
        if (this.state.d) {
          deltaX += 1;
        }
        if ((x <= 0 && deltaX < 0) || (x >= 100 && deltaX > 0)){
          deltaX = 0;
        }
        if ((y <= 0 && deltaY < 0) || (y >= 100 && deltaY > 0)){
          deltaY = 0;
        }
        if (deltaX != 0) x = this.state.x + (deltaX/(Math.abs(deltaX) + Math.abs(deltaY)));
        if (deltaY != 0) y = this.state.y + (deltaY/(Math.abs(deltaX) + Math.abs(deltaY)));
        if (x != this.state.x || y != this.state.y) this.setState({x, y});
        this.updateMonster();
      }
      let timer = this.state.timer + 1;
      this.setState({timer})
      this.positionChar();
    }, 33);
  }

  checkForEndGame() {
    // check if dead, or if win conditions are met
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
        this.setState({currentChest: i});
        this.startQuestion();
      }
    }
  }

  startQuestion() {
    this.setState({moving: false});
    const modal = document.querySelector("#questionModal");
    modal.style.display = "block";
    this.showQuestion();
  }

  exitQuestion() {
    this.setState({moving: true});
    let prompts = [...this.state.prompts];
    const firstPrompt = prompts.shift();
    prompts.push(firstPrompt);
    let choices = [...this.state.choices];
    const firstChoice = choices.shift();
    choices.push(firstChoice);
    let modal = document.querySelector("#questionModal");
    modal.style.display = "none";
    this.setState({prompts});
    this.setState({choices});
  }

  showQuestion() {
    const prompt = this.state.prompts[0];
    let selectedAnswers = [];
    const choicesDiv = this.state.choices[0].map((choice, key) => {
      selectedAnswers.push(false);
    return <div onClick={() => this.toggleAnswer(key)} className="choice" key={key}><p>{choice.answer}</p></div>;
    });
    this.setState({ selectedAnswers });
    this.setState({ prompt });
    this.setState({ choicesDiv });
  }

  toggleAnswer(answerId) {
    let selectedAnswers = [...this.state.selectedAnswers];
    selectedAnswers[answerId] = !selectedAnswers[answerId];
    this.setState({ selectedAnswers });
  }

  checkAnswers() {
    const correctAnswers = this.state.choices[0].map((choice) => {
      return choice.correct;
    });
    let correct = true;
    for(let i = 0; i < this.state.selectedAnswers.length; i++) {
      if (correctAnswers[i] !== this.state.selectedAnswers[i]) {
        correct = false;
      }
    }
    if (correct) {
      this.handleCorrectAnswer();
      this.setState({flashMessage: "Correct -- The monster is stunned!"});
    } else {
      this.setState({flashMessage: "Incorrect answers detected, or correct answers missing."});
    }
    this.exitQuestion();
  }

  handleCorrectAnswer() {
    let chestList = [...this.state.chestsClosed];
    chestList[this.state.currentChest] = false;
    document.getElementById(`chest${this.state.currentChest}`).innerHTML = '|X|';
    this.setState({chestsClosed: chestList });
    this.knockAndStun();
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

  updateMonster(direction = 0) {
    // update monster state to track player, absolute value change of pixel distance being the monsterSpeed
    let deltaX = Math.round(this.state.x - this.state.monsterX);
    let deltaY = Math.round(this.state.y - this.state.monsterY);
    let magnitude = Math.abs(deltaX) + Math.abs(deltaY);
    let ratio = magnitude == 0 ? [0,0] : [deltaX/magnitude, deltaY/magnitude];
    let newMonsterX = this.state.monsterX + ratio[0] * (this.state.monsterSpeed + direction);
    let newMonsterY = this.state.monsterY + ratio[1] * (this.state.monsterSpeed + direction);
    this.setState({monsterX: newMonsterX, monsterY: newMonsterY});
  }

  knockAndStun() {
    this.updateMonster(-10);
    const monsterSpeed = this.state.monsterSpeed + 0.1;
    this.setState({monsterSpeed: 0});
    setTimeout(() => this.setState({monsterSpeed}), 1000);
  }

  render() {
    return (
      <div className="GameScreen" style={{ position: "relative"}}>
        <button onClick={() => this.endGame()}>Pause</button>
        <p style={{ margin: "0"}}>{this.state.flashMessage}</p>
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
          <p>{this.state.prompt}</p>
          <div>{this.state.choicesDiv}</div>
          <p onClick={() => this.checkAnswers()}>Submit</p>
        </div>
        <div
          id="monsterDiv"
          style={{
            position: "absolute",
            left: `${Math.floor(this.state.monsterX)}%`,
            bottom: `${Math.floor(this.state.monsterY)}%`,
            width: "100px",
            height: "100px",
            border: "1px solid red"
          }}
        >
          <p>{this.state.monsterAvatar}</p>
        </div>
        <div
          id="charDiv"
          style={{
            position: "absolute",
            left: `${Math.floor(this.state.x)}%`,
            bottom: `${Math.floor(this.state.y)}%`,
            width: "100px",
            height: "100px",
            border: "1px solid blue"
          }}
        >
          <img 
            src={logo} 
            alt="" 
            style={{
              width: "100%",
            }}/>
          <p>{this.state.charPosition}</p>
        </div>
      </div>
    );
  }
}

export default GameScreen;
