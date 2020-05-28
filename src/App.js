import React, { Component } from "react";
import {
  Content,
  SideNav,
  SideNavItems,
  SideNavLink
} from "carbon-components-react/lib/components/UIShell";
import WelcomeHeader from "./components/WelcomeHeader";
import MusicLibPage from "./content/MusicLibPage";
import Playlist32 from "@carbon/icons-react/lib/playlist/20";
import Catalog32 from "@carbon/icons-react/lib/catalog/20";
import "./app.scss";

class App extends Component {
  render() {
    return (
      <>
        <WelcomeHeader />
        <SideNav
          isFixedNav
          expanded={true}
          isChildOfHeader={false}
          aria-label="Side navigation">
          <SideNavItems>
            <SideNavLink renderIcon={Catalog32} href="javascript:void(0)">
              Library
            </SideNavLink>
            <SideNavLink renderIcon={Playlist32} href="javascript:void(0)">
              Playlist 1
            </SideNavLink>
            <SideNavLink renderIcon={Playlist32} href="javascript:void(0)">
              Playlist 2
            </SideNavLink>
          </SideNavItems>
        </SideNav>
        <Content>
          <MusicLibPage />
        </Content>
      </>
    );
  }
}

export default App;
