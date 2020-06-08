import React from "react";
import logo from "./ethereumLogo.png";
import { addresses, abis } from "@project/contracts";
import { gql } from "apollo-boost";
import { ethers } from "ethers";
import { useQuery } from "@apollo/react-hooks";
import GameScreen from "./components/GameScreen";
// import { BrowserRouter, Router, Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { IntroScreen } from "./components/IntroScreen";

import "./App.css";

function App() {
  return (
    <Router>
      <Route path="/game" component={GameScreen} />
      <Route path="/home" component={IntroScreen} />
    </Router>
  );
}

export default App;
