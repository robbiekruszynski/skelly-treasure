import React from "react";
import { ethers } from "ethers";

import {
  BrowserRouter as Router,
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";

export const IntroScreen = ({ history }) => {
  let ethereum = window.ethereum;

  return (
    <div>
      <p>Intro Screen Render</p>
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
  );
};
