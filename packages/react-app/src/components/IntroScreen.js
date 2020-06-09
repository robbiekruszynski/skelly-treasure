import React from "react";
import {
  BrowserRouter as Router,
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";

export const IntroScreen = ({ history }) => {
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
      </Link>
    </div>
  );
};
