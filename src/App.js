import React, { Component } from "react";
import { Content } from "carbon-components-react/lib/components/UIShell";
import WelcomeHeader from "./components/WelcomeHeader";
import ReactPage from "./content/ReactPage";
import "./app.scss";

class App extends Component {
  render() {
    return (
      <>
        <WelcomeHeader />
        <Content>
          <ReactPage />
        </Content>
      </>
    );
  }
}

export default App;
