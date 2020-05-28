import React, { Component } from "react";
import { Content } from "carbon-components-react/lib/components/UIShell";
import WelcomeHeader from "./components/WelcomeHeader";
import MusicLibPage from "./content/MusicLibPage";
import "./app.scss";

class App extends Component {
  render() {
    return (
      <>
        <WelcomeHeader />
        <Content>
          <MusicLibPage />
        </Content>
      </>
    );
  }
}

export default App;
