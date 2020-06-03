////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/**
 * @author Kai
 * @version 1.0.0
 * @module WelcomeHeader
 * @description Displays header including the Add song button
 * @exports WelcomeHeader
 *
 * @typedef {Object} WelcomeHeader
 *
 */
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure, withState, withHandlers } from "recompose";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent
} from "carbon-components-react/lib/components/UIShell";
import UserAvatar20 from "@carbon/icons-react/lib/user--avatar/20";
import AddSong32 from "@carbon/icons-react/lib/add--alt/20";
import AddSong from "../AddSong";
import * as constants from "../../constants/musicLib";

const enhance = compose(
  pure,
  connect(() => ({}), {}),
  lifecycle({
    componentWillMount() {},
    componentDidMount() {},
    componentWillUnmount() {}
  }),
  withState("addModalOpen", "setAddModalOpen", false),
  withState("song", "setSong", _.cloneDeep(constants.songDefaultState)),
  withHandlers({
    onsetAddModalOpen: ({ setAddModalOpen }) => (val) => {
      setAddModalOpen(() => {
        return val;
      });
    },
    onsetSong: ({ setSong }) => (val) => {
      setSong(() => {
        return val;
      });
    }
  })
);

const WelcomeHeader = ({
  addModalOpen,
  onsetAddModalOpen,
  song,
  onsetSong
}) => {
  return (
    <div>
      <Header aria-label="My Music Library">
        <SkipToContent />
        <HeaderName>My Music Library</HeaderName>
        <HeaderNavigation aria-label="My Music Library"></HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Add Song"
            title="Add Song"
            onClick={() => onsetAddModalOpen(true)}>
            <AddSong32 />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="User Actions" title="User Actions">
            <UserAvatar20 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <AddSong
        addModalOpen={addModalOpen}
        setAddModalOpen={onsetAddModalOpen}
        song={song}
        setSong={onsetSong}
        prefix="kai-add"
      />
    </div>
  );
};

/**
 * These values come from state and store.
 *
 * @type {Object}  WelcomeHeader
 */
WelcomeHeader.propTypes = {
  addModalOpen: PropTypes.boolean,
  onsetAddModalOpen: PropTypes.func.isRequired,
  song: PropTypes.object.isRequired,
  onsetSong: PropTypes.func.isRequired
};

export default enhance(WelcomeHeader);
