import React from "react";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent
} from "carbon-components-react/lib/components/UIShell";
import UserAvatar20 from "@carbon/icons-react/lib/user--avatar/20";

const WelcomeHeader = () => (
  <Header aria-label="My Music Library">
    <SkipToContent />
    <HeaderName>My Music Library</HeaderName>
    <HeaderNavigation aria-label="My Music Library"></HeaderNavigation>
    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="User Avatar">
        <UserAvatar20 />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
  </Header>
);

export default WelcomeHeader;
