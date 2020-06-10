import React from "react";
import logo from "./ethereumLogo.png";
import { addresses, abis } from "@project/contracts";
import { gql } from "apollo-boost";
import { ethers } from "ethers";
import { useQuery } from "@apollo/react-hooks";
import GameScreen from "./components/GameScreen";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { IntroScreen } from "./components/IntroScreen";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game" exact component={GameScreen} />
        <Route path="/home" exact component={IntroScreen} />
        <Route path="/" exact render={() => <div>404</div>} />
      </Switch>
    </Router>
  );
}

export default App;
