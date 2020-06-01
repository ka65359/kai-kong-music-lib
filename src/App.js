import React, { Component } from "react";
import {
  Content,
  SideNav,
  SideNavItems,
  SideNavLink
} from "carbon-components-react/lib/components/UIShell";
import WelcomeHeader from "./components/WelcomeHeader";
import MusicLibPage from "./content/MusicLibPage";
import Catalog32 from "@carbon/icons-react/lib/catalog/20";
import FavoriteFilled32 from "@carbon/icons-react/lib/favorite--filled/20";
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
            <SideNavLink
              renderIcon={Catalog32}
              aria-current="page"
              href="javascript:void(0)">
              Library
            </SideNavLink>
            <SideNavLink
              renderIcon={FavoriteFilled32}
              href="javascript:void(0)">
              Favorites
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
