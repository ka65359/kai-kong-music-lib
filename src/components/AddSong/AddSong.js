////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/**
 * @author Kai
 * @version 1.0.0
 * @module AddSongModal
 * @description Displays the create or edit song dialog
 * @exports AddSongModal
 *
 * @typedef {Object} AddSongModal
 *
 * @param  {Boolean}      addModalOpen    Whether or not the dialog is open
 * @param  {String}       prefix          Namespace to make ids unique
 * @param  {Function}     setAddModalOpen Set dialog open state
 * @param  {Object}       song            Song object with data as entered in the dialog
 * @param  {Function}     setSong         Set the song data
 * @param  {Boolean}      isEditMode      Whether or not the dialog is in edit mode
 * @param  {Function}     confirmCallback The callback when the Submit button is clicked
 *
 */
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Checkbox from "carbon-components-react/lib/components/Checkbox";
import ComboBox from "carbon-components-react/lib/components/ComboBox";
import Modal from "carbon-components-react/lib/components/Modal";
import TextInput from "carbon-components-react/lib/components/TextInput";
import { createSong } from "store/actions/musicLib";
import store from "../../store";
import * as constants from "../../constants/musicLib";

const AddSongModal = ({
  addModalOpen,
  prefix,
  setAddModalOpen,
  song,
  setSong,
  isEditMode,
  confirmCallback
}) => {
  /**
   * Check if the song data is valid and determine whether or
   * not to close the dialog.
   *
   * @method validateSongData
   *
   * @param  {Function}         setAddModalOpen Set dialog open status
   * @param  {Object}           song            Current song data to validate
   * @param  {Function}         setSong         Update local song data
   */
  const validateSongData = (setAddModalOpen, song, setSong) => {
    song = checkIsValid(song);
    if (!song.isValid) {
      setSong(song);
    } else {
      setAddModalOpen(false);
      setSong(song);
    }
  };

  // Get the data when a field is changed and update the local
  // song data
  const handleFieldChanged = (field, evt, type) => {
    if (type == "checkbox") {
      song[field] = evt;
      if (field == "Favorite") {
        song.favVal = evt;
      }
    } else if (type == "dropdown") {
      song[field] = evt;
    } else {
      song[field] = evt.target.value;
      if (field === "Title") {
        song.titleText = evt.target.value;
      }
    }
    setSong(song);
  };

  // Validation checks
  const checkIsValid = (song) => {
    const urlRegex = new RegExp(/^(https?):\/\/[^\s$.?#].[^\s]*$/);
    const imgRegex = new RegExp(
      /(http(s?):)([/|.|\w|\s|%|-])*\.(?:jpg|jpeg|bmp|gif|png)/
    );
    song.isValid = true;
    // Title is required
    if (!song.Title) {
      song.isValid = false;
      song.fieldValid.Title = false;
    } else {
      song.fieldValid.Title = true;
    }
    // Album link must be to a valid image URL
    if (song.Album_Link && !song.Album_Link.match(imgRegex)) {
      song.isValid = false;
      song.fieldValid.Album_Link = false;
    } else {
      song.fieldValid.Album_Link = true;
    }
    // Play Link must be a valid URL
    if (song.Play_Link && !song.Play_Link.match(urlRegex)) {
      song.isValid = false;
      song.fieldValid.Play_Link = false;
    } else {
      song.fieldValid.Play_Link = true;
    }
    return song;
  };

  const closeDialog = () => {
    setSong(_.cloneDeep(constants.songDefaultState));
    setAddModalOpen(false);
  };

  const handleSubmit = (setAddModalOpen, song, setSong, confirmCallback) => {
    validateSongData(setAddModalOpen, song, setSong);
    if (typeof confirmCallback === "function") {
      confirmCallback(song);
    } else {
      store.dispatch(createSong(song));
      setSong(_.cloneDeep(constants.songDefaultState));
    }
  };

  const genreOptions = [
    {
      id: "alt",
      label: "Alternative"
    },
    {
      id: "country",
      label: "Country"
    },
    {
      id: "electronic",
      label: "Electronic"
    },
    {
      id: "hiphop",
      label: "Hip Hop"
    },
    {
      id: "metal",
      label: "Metal"
    },
    {
      id: "pop",
      label: "Pop"
    },
    {
      id: "punk",
      label: "Punk"
    },
    {
      id: "rb",
      label: "R&B"
    },
    {
      id: "rap",
      label: "Rap"
    },
    {
      id: "rock",
      label: "Rock"
    }
  ];

  const getGenreOption = (label) => {
    let arr = genreOptions.filter((item) => item.label == label);
    return arr.length ? arr[0] : {};
  };

  return (
    <Modal
      open={addModalOpen}
      className={isEditMode ? "kai-edit-song-modal" : "kai-add-song-modal"}
      iconDescription="Closed"
      modalAriaLabel={isEditMode ? "Edit current song" : "Add song to library"}
      modalLabel={isEditMode ? "Edit Song" : "Add Song"}
      modalHeading={isEditMode ? "Edit current song" : "Add song to library"}
      onRequestClose={() => {
        closeDialog();
      }}
      onRequestSubmit={() =>
        handleSubmit(setAddModalOpen, song, setSong, confirmCallback)
      }
      primaryButtonText={isEditMode ? "Save" : "Add"}
      secondaryButtonText="Cancel">
      <div className="kai-add-song-container">
        <TextInput
          className="kai-textbox"
          id={prefix + "kai-add-song-title"}
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
          id={prefix + "kai-add-song-artist"}
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
          id={prefix + "kai-add-song-album"}
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
          id={prefix + "kai-add-song-album-link"}
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
        <ComboBox
          ariaLabel="Choose a genre"
          direction="top"
          className="kai-dropdown"
          id={prefix + "kai-genre-dropdown"}
          items={genreOptions}
          selectedItem={
            isEditMode && typeof song.Genre == "string"
              ? getGenreOption(song.Genre)
              : _.get(song, "Genre.selectedItem", {})
          }
          onChange={(selectedItem) =>
            handleFieldChanged("Genre", selectedItem, "dropdown")
          }
          placeholder="Filter..."
          titleText="Genre"
        />
        <br />
        <TextInput
          className="kai-textbox"
          id={prefix + "kai-add-song-play-link"}
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
          id={prefix + "kai-add-song-favorite"}
          labelText="Favorite"
          onChange={(evt) => handleFieldChanged("Favorite", evt, "checkbox")}
          checked={song.Favorite}
        />
      </div>
    </Modal>
  );
};

/**
 * Add song dialog. Described in header comments.
 *
 * @type {Object}  AddSongModal
 */
AddSongModal.propTypes = {
  addModalOpen: PropTypes.boolean,
  setAddModalOpen: PropTypes.func.isRequired,
  song: PropTypes.object.isRequired,
  setSong: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  isEditMode: PropTypes.boolean,
  confirmCallback: PropTypes.func
};

export default AddSongModal;
