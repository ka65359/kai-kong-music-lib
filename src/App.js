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
import { setCurrentPage } from "store/actions";
import store from "./store";
import "./app.scss";

class App extends Component {
  render() {
    const currentPage = store.getState().ui.musicLib.currentPage;
    if (!window.kaiAppData) {
      window.kaiAppData = {};
    }
    // Necessary for manipulating the currently selected nav-item
    window.kaiAppData.libraryLinkName = "kai-music-lib-library-link";
    window.kaiAppData.favoritesLinkName = "kai-music-lib-favs-link";
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
              className={window.kaiAppData.libraryLinkName}
              renderIcon={Catalog32}
              aria-current={currentPage == "library" ? "page" : ""}
              onClick={() => {
                store.dispatch(setCurrentPage("library"));
              }}>
              Library
            </SideNavLink>
            <SideNavLink
              className={window.kaiAppData.favoritesLinkName}
              renderIcon={FavoriteFilled32}
              aria-current={currentPage == "favorites" ? "page" : ""}
              onClick={() => {
                store.dispatch(setCurrentPage("favorites"));
              }}>
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
