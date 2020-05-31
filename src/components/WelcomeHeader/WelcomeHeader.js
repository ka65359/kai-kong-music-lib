import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure, withState, withHandlers } from "recompose";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent
} from "carbon-components-react/lib/components/UIShell";
import Checkbox from "carbon-components-react/lib/components/Checkbox";
import Modal from "carbon-components-react/lib/components/Modal";
import TextInput from "carbon-components-react/lib/components/TextInput";
import UserAvatar20 from "@carbon/icons-react/lib/user--avatar/20";
import AddSong32 from "@carbon/icons-react/lib/add--alt/20";
import { createSong } from "store/actions/musicLib";
import store from "../../store";

const AddSongModal = ({ addModalOpen, setAddModalOpen, song, setSong }) => {
  const handleAddSong = (setAddModalOpen, song, setSong) => {
    song = checkIsValid(song);
    if (!song.isValid) {
      setSong(song);
    } else {
      setAddModalOpen(false);
      setSong(song);
      store.dispatch(createSong(song));
    }
  };
  const handleFieldChanged = (field, evt, type) => {
    if (type == "checkbox") {
      song[field] = evt;
    } else {
      song[field] = evt.target.value;
    }
    setSong(song);
  };
  const checkIsValid = (song) => {
    const urlRegex = new RegExp(
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    );
    song.isValid = true;
    if (!song.title) {
      song.isValid = false;
      song.fieldValid.title = false;
    } else {
      song.fieldValid.title = true;
    }
    if (song.albumLink && !song.albumLink.match(urlRegex)) {
      song.isValid = false;
      song.fieldValid.albumLink = false;
    } else {
      song.fieldValid.albumLink = true;
    }
    if (song.playLink && !song.playLink.match(urlRegex)) {
      song.isValid = false;
      song.fieldValid.playLink = false;
    } else {
      song.fieldValid.playLink = true;
    }
    return song;
  }; // TODO: CLOSE DIALOG NEEDS TO CLEAR NEW SONG DATA PREVIOUSLY ENTERED
  return (
    <Modal
      open={addModalOpen}
      className="kai-add-song-modal"
      iconDescription="Closed"
      modalAriaLabel="Add Song to Library"
      modalLabel="Add Song"
      modalHeading="Add Song to Library"
      onRequestClose={() => setAddModalOpen(false)}
      onRequestSubmit={() => handleAddSong(setAddModalOpen, song, setSong)}
      primaryButtonText="Add"
      secondaryButtonText="Cancel">
      <div className="kai-add-song-container">
        <TextInput
          className="kai-textbox"
          id="kai-add-song-title"
          invalid={!song.fieldValid.title}
          invalidText="This field is required"
          labelText=<span>
            Title <span className="kai-required-star">*</span>
          </span>
          onChange={(evt) => handleFieldChanged("title", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          value={song.title}
          type="text"
        />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-artist"
          labelText="Artist"
          onChange={(evt) => handleFieldChanged("artist", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          value={song.artist}
          type="text"
        />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-album"
          labelText="Album"
          onChange={(evt) => handleFieldChanged("album", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          value={song.album}
          type="text"
        />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-album-link"
          invalid={!song.fieldValid.albumLink}
          invalidText="Please enter a valid URL"
          labelText="Album Image Link"
          onChange={(evt) => handleFieldChanged("albumLink", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          placeholder="Ex. http://www.example.com/image.jpg"
          helperText="A link to the album cover image"
          value={song.albumLink}
          type="text"
        />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-play-link"
          invalid={!song.fieldValid.playLink}
          invalidText="Please enter a valid URL"
          labelText="Play Link"
          onChange={(evt) => handleFieldChanged("playLink", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          placeholder="Ex. http://www.example.com/"
          helperText="A link to play the song"
          value={song.playLink}
          type="text"
        />
        <Checkbox
          className="kai-checkbox"
          id="kai-add-song-favorite"
          labelText="Favorite"
          onChange={(evt) => handleFieldChanged("favorite", evt, "checkbox")}
          checked={song.favorite}
        />
      </div>
      <br />
      <br />
      Genre Fav
      <br />
      <br />
    </Modal>
  );
};

const enhance = compose(
  pure,
  connect(() => ({}), {}),
  lifecycle({
    componentWillMount() {},
    componentDidMount() {},
    componentWillUnmount() {},
    shouldComponentUpdate() {}
  }),
  withState("addModalOpen", "setAddModalOpen", false),
  withState("song", "setSong", {
    title: "",
    artist: "",
    album: "",
    albumLink: "",
    genre: "",
    favorite: false,
    playLink: "",
    isValid: true,
    fieldValid: {}
  }),
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
          <HeaderGlobalAction aria-label="User Avatar" title="User Avatar">
            <UserAvatar20 />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <AddSongModal
        addModalOpen={addModalOpen}
        setAddModalOpen={onsetAddModalOpen}
        song={song}
        setSong={onsetSong}
      />
    </div>
  );
};

export default enhance(WelcomeHeader);
