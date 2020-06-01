import React from "react";
import _ from "lodash";
import Checkbox from "carbon-components-react/lib/components/Checkbox";
import Modal from "carbon-components-react/lib/components/Modal";
import TextInput from "carbon-components-react/lib/components/TextInput";
import { createSong } from "store/actions/musicLib";
import store from "../../store";

const AddSongModal = ({
  addModalOpen,
  setAddModalOpen,
  song,
  setSong,
  songDefaultState
}) => {
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
    const urlRegex = new RegExp(/^(https?):\/\/[^\s$.?#].[^\s]*$/);
    const imgRegex = new RegExp(
      /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|bmp|gif|png)/
    );
    song.isValid = true;
    if (!song.Title) {
      song.isValid = false;
      song.fieldValid.Title = false;
    } else {
      song.fieldValid.Title = true;
    }
    if (song.Album_Link && !song.Album_Link.match(imgRegex)) {
      song.isValid = false;
      song.fieldValid.Album_Link = false;
    } else {
      song.fieldValid.Album_Link = true;
    }
    if (song.Play_Link && !song.Play_Link.match(urlRegex)) {
      song.isValid = false;
      song.fieldValid.Play_Link = false;
    } else {
      song.fieldValid.Play_Link = true;
    }
    return song;
  };

  const closeDialog = () => {
    setAddModalOpen(false);
    setSong(_.cloneDeep(songDefaultState));
  };

  return (
    <Modal
      open={addModalOpen}
      className="kai-add-song-modal"
      iconDescription="Closed"
      modalAriaLabel="Add Song to Library"
      modalLabel="Add Song"
      modalHeading="Add Song to Library"
      onRequestClose={() => {
        closeDialog();
      }}
      onRequestSubmit={() => handleAddSong(setAddModalOpen, song, setSong)}
      primaryButtonText="Add"
      secondaryButtonText="Cancel">
      <div className="kai-add-song-container">
        <TextInput
          className="kai-textbox"
          id="kai-add-song-title"
          invalid={!song.fieldValid.Title}
          invalidText="This field is required"
          labelText=<span>
            Title <span className="kai-required-star">*</span>
          </span>
          onChange={(evt) => handleFieldChanged("Title", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          value={song.Title}
          type="text"
        />
        <br />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-artist"
          labelText="Artist"
          onChange={(evt) => handleFieldChanged("Artist", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          value={song.Artist}
          type="text"
        />
        <br />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-album"
          labelText="Album"
          onChange={(evt) => handleFieldChanged("Album", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          value={song.Album}
          type="text"
        />
        <br />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-album-link"
          invalid={!song.fieldValid.Album_Link}
          invalidText="Please enter a valid image URL (supported: bmp, gif, jpg, jpeg, png)"
          labelText="Album Image"
          onChange={(evt) => handleFieldChanged("Album_Link", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          placeholder="Ex. http://www.example.com/image.jpg"
          helperText="A link to the album cover image"
          value={song.Album_Link}
          type="text"
        />
        <br />
        <TextInput
          className="kai-textbox"
          id="kai-add-song-play-link"
          invalid={!song.fieldValid.Play_Link}
          invalidText="Please enter a valid URL"
          labelText="Play Link"
          onChange={(evt) => handleFieldChanged("Play_Link", evt)}
          onBlur={() => {
            setSong(checkIsValid(song));
          }}
          placeholder="Ex. http://www.example.com/"
          helperText="A link to play the song"
          value={song.Play_Link}
          type="text"
        />
        <br />
        <Checkbox
          className="kai-checkbox"
          id="kai-add-song-favorite"
          labelText="Favorite"
          onChange={(evt) => handleFieldChanged("Favorite", evt, "checkbox")}
          checked={song.Favorite}
        />
      </div>
    </Modal>
  );
};

export default AddSongModal;
