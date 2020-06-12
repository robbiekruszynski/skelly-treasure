import React from "react";
import { ethers } from "ethers";
import "./IntroScreen.scss";
import NavBar from "./NavBar";
import {
  BrowserRouter as Router,
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";

export const IntroScreen = ({ history }) => {
  let ethereum = window.ethereum;

  return (
    <div className="MainContainer">
      <NavBar />
      <div className="IntroBody">
        <p>Skelly Treasure</p>
        <Link>
          <button
            onClick={() => {
              history.push("/game");
            }}
          >
            click for game
          </button>
          <button
            variant="contained"
            color="primary"
            // class="enableEthereumButton"
            onClick={() => ethereum.enable()}
          >
            Wallet Check
          </button>
        </Link>
      </div>
    </div>
  );
};
