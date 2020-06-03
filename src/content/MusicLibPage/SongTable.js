////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/**
 * @author Kai
 * @version 1.0.0
 * @module SongTable
 * @description A table to display data about songs.
 * @exports SongTable
 *
 * @typedef {Object} SongTable
 * @param  {Object[]}  songs          All songs in the database
 * @param  {Object[]}  rows           Table rows for the current page
 * @param  {Object[]}  headers        Table headers
 * @param  {function}  onSearchUpdate Callback when the search bar value is changed
 *
 */
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure, withState, withHandlers } from "recompose";
import _ from "lodash";
import PropTypes from "prop-types";
import {
  DataTable,
  TableContainer,
  TableToolbar,
  TableToolbarSearch,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
  Modal
} from "carbon-components-react";
import {
  ChevronUp20,
  ChevronDown20,
  UpToTop20,
  TrashCan20,
  Edit20
} from "@carbon/icons-react";
import { setTableSortData, setAllSongs, setSongUpdating } from "store/actions";
import { updateSong, deleteSong } from "store/actions/musicLib";
import AddSong from "../../components/AddSong";
import * as constants from "../../constants/musicLib";
import store from "../../store";
import "./_song-table.scss";

const mapDispatchToProps = {
  setTableSortData,
  setAllSongs,
  updateSong,
  setSongUpdating,
  deleteSong
};

const enhance = compose(
  pure,
  connect(
    (state) => ({
      songUpdating: state.ui.musicLib.songUpdating
    }),
    mapDispatchToProps
  ),
  lifecycle({
    shouldComponentUpdate() {
      return true;
    }
  }),
  withState("editModalOpen", "setEditModalOpen", false),
  withState("editSong", "setEditSong", _.cloneDeep(constants.songDefaultState)),
  withState("delModalOpen", "setDelModalOpen", false),
  withState("currentSong", "setCurrentSong", {}),
  withHandlers({
    onsetEditModalOpen: ({ setEditModalOpen }) => (val) => {
      setEditModalOpen(() => {
        return val;
      });
    },
    onsetEditSong: ({ setEditSong }) => (val) => {
      setEditSong(() => {
        return val;
      });
    },
    onsetDelModalOpen: ({ setDelModalOpen }) => (val) => {
      setDelModalOpen(() => {
        return val;
      });
    },
    onsetCurrentSong: ({ setCurrentSong }) => (val) => {
      setCurrentSong(() => {
        return val;
      });
    }
  })
);

const SongTable = ({
  rows,
  headers,
  onSearchUpdate,
  songs,
  setTableSortData,
  setAllSongs,
  updateSong,
  deleteSong,
  editModalOpen,
  onsetEditModalOpen,
  editSong,
  onsetEditSong,
  songUpdating,
  setSongUpdating,
  delModalOpen,
  onsetDelModalOpen,
  currentSong,
  onsetCurrentSong
}) => {
  /**
   * Move the row up one in the table
   *
   * @method moveRowUp
   *
   * @param  {Object}    row The row to move
   */
  const moveRowUp = (row) => {
    let index = songs.findIndex((arow) => arow._id === row.id);
    const orow = songs[index];
    if (index > 0) {
      let newIndex = index - 1;
      const temp = songs[newIndex];
      songs[newIndex] = orow;
      songs[index] = temp;
      if (_.get(store.getState(), "ui.musicLib.tableSortData.key")) {
        // TODO: This is nasty, need to find a better way to clear sort manually
        window.kaiAppData.songTableRef.current.state.sortHeaderKey = null;
        setTableSortData({ key: "", sortDirection: "" });
      }
      setAllSongs(songs);
    }
  };
  /**
   * Move the row down one in the table
   *
   * @method moveRowDown
   *
   * @param  {Object}    row The row to move
   */
  const moveRowDown = (row) => {
    let index = songs.findIndex((arow) => arow._id === row.id);
    const orow = songs[index];
    if (index >= 0 && index < songs.length - 1) {
      let newIndex = index + 1;
      const temp = songs[newIndex];
      songs[newIndex] = orow;
      songs[index] = temp;
      if (_.get(store.getState(), "ui.musicLib.tableSortData.key")) {
        // TODO: This is nasty, need to find a better way to clear sort manually
        window.kaiAppData.songTableRef.current.state.sortHeaderKey = null;
        setTableSortData({ key: "", sortDirection: "" });
      }
      setAllSongs(songs);
    }
  };
  /**
   * Move the row to the top of the table
   *
   * @method moveToTop
   *
   * @param  {Object}    row The row to move
   */
  const moveToTop = (row) => {
    let index = songs.findIndex((arow) => arow._id === row.id);
    if (index > 0) {
      const temp = songs[index];
      songs.splice(index, 1);
      songs.unshift(temp);
      if (_.get(store.getState(), "ui.musicLib.tableSortData.key")) {
        // TODO: This is nasty, need to find a better way to clear sort manually
        window.kaiAppData.songTableRef.current.state.sortHeaderKey = null;
        setTableSortData({ key: "", sortDirection: "" });
      }
      setAllSongs(songs);
    }
  };
  // REST call to update
  const updateSongData = (song) => {
    if (!songUpdating.includes(song._id)) {
      setSongUpdating(song._id);
      updateSong(song);
    }
  };
  // Open delete confirmation dialog
  const removeSong = (row) => {
    let elem = document.getElementsByClassName("kai-delete-song-modal");
    if (elem.length) {
      elem[0].style.top = window.scrollY - 20 + "px";
    }
    onsetCurrentSong(row);
    onsetDelModalOpen(true);
  };

  // Create HTML for menu item with an icon followed by a label
  const getMenuItemWithIcon = (icon, label, className) => {
    return (
      <span className={"kai-clickable-icon " + className}>
        {icon}
        &nbsp;&nbsp;
        {label}
      </span>
    );
  };

  // Generate confirm delete dialog HTML
  const getConfirmDeleteDialog = () => {
    const closeDialog = () => {
      onsetCurrentSong({});
      onsetDelModalOpen(false);
    };
    return (
      <Modal
        open={delModalOpen}
        className="kai-delete-song-modal"
        iconDescription="Closed"
        modalAriaLabel="Delete Song from Library"
        modalLabel="Delete Song"
        modalHeading="Delete Song from Library"
        onRequestClose={() => {
          closeDialog();
        }}
        onRequestSubmit={() => {
          deleteSong({ currentSong, songs });
          closeDialog();
        }}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel">
        Are you sure you want to delete this song?
      </Modal>
    );
  };

  // Create Edit song dialog HTML
  const getEditDialog = () => {
    return (
      <AddSong
        isEditMode={true}
        addModalOpen={editModalOpen}
        setAddModalOpen={onsetEditModalOpen}
        confirmCallback={updateSongData}
        song={editSong}
        setSong={onsetEditSong}
        prefix="kai-edit"
      />
    );
  };

  /**
   * Set song data to prepopulate edit dialog and open it.
   *
   * @method handleEditClicked
   *
   * @param  {Object}          row The row to edit
   */
  const handleEditClicked = (row) => {
    let index = songs.findIndex((song) => song._id === row.id);
    if (index >= 0) {
      editSong._id = songs[index]._id;
      editSong.Title = songs[index].titleText;
      editSong.Artist = songs[index].Artist;
      editSong.Album = songs[index].Album;
      editSong.Album_Link = songs[index].Album_Link;
      editSong.Genre = songs[index].Genre;
      editSong.Favorite = songs[index].favVal;
      editSong.Play_Link = songs[index].Play_Link;
    }
    onsetEditSong(editSong);
    onsetEditModalOpen(true);
  };

  // This is necessary so we can manually clear the sort header when user moves a song
  if (_.get(window, "kaiAppData.songTableRef")) {
    delete window.kaiAppData.songTableRef;
  }
  if (!window.kaiAppData) {
    window.kaiAppData = {};
  }
  window.kaiAppData.songTableRef = React.createRef();

  return (
    <div>
      <DataTable
        ref={window.kaiAppData.songTableRef}
        rows={rows}
        headers={headers}
        overflowMenuOnHover={false}
        isSortable
        sortRow={(a, b, { sortDirection, key }) => {
          // Don't use built in sorting, instead take the event and update sort state
          if (
            _.get(
              store.getState(),
              "ui.musicLib.tableSortData.sortDirection",
              ""
            ) !== sortDirection ||
            _.get(store.getState(), "ui.musicLib.tableSortData.key", "") !== key
          ) {
            setTableSortData({ sortDirection, key }); // only the first time in
          }
        }}
        render={({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps
        }) => (
          <TableContainer
            title="My Music Library"
            description="A collection of music">
            <TableToolbar>
              <TableToolbarSearch
                onChange={onSearchUpdate}
                placeHolderText="Search title, artist, or album"
              />
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.header}
                      {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {_.get(cell, "value.selectedItem.label", cell.value)}
                        </TableCell>
                      ))}
                      <TableCell className="bx--table-column">
                        <span
                          title="Move song up"
                          className="kai-clickable-icon kai-move-up-icon"
                          onClick={() => moveRowUp(row)}>
                          {<ChevronUp20 />}
                        </span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span
                          title="Move song down"
                          className="kai-clickable-icon kai-move-down-icon"
                          onClick={() => moveRowDown(row)}>
                          {<ChevronDown20 />}
                        </span>
                      </TableCell>
                      <TableCell className="bx--table-column-menu">
                        <OverflowMenu flipped className="kai-overflow-menu">
                          <OverflowMenuItem
                            className="some-class-kai"
                            itemText={getMenuItemWithIcon(
                              <UpToTop20 />,
                              "Move to top",
                              "kai-overflow-item-icon"
                            )}
                            onClick={() => moveToTop(row)}
                            onKeyDown={() => moveToTop(row)}
                          />
                          <OverflowMenuItem
                            className="some-class"
                            itemText={getMenuItemWithIcon(
                              <Edit20 />,
                              "Edit",
                              "kai-overflow-item-icon"
                            )}
                            onClick={() => handleEditClicked(row)}
                            onKeyDown={() => handleEditClicked(row)}
                          />
                          <OverflowMenuItem
                            className="some-class"
                            disabled={false}
                            hasDivider
                            isDelete
                            itemText={getMenuItemWithIcon(
                              <TrashCan20 />,
                              "Delete",
                              "kai-overflow-item-icon"
                            )}
                            onClick={() => removeSong(row)}
                            onKeyDown={() => removeSong(row)}
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
      {getEditDialog()}
      {getConfirmDeleteDialog()}
    </div>
  );
};

/**
 * All but the first four properties are from state or store.
 *
 * @type {Object}
 */
SongTable.propTypes = {
  songs: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  onSearchUpdate: PropTypes.func.isRequired,
  setTableSortData: PropTypes.func.isRequired,
  setAllSongs: PropTypes.func.isRequired,
  updateSong: PropTypes.func.isRequired,
  deleteSong: PropTypes.func.isRequired,
  editModalOpen: PropTypes.bool.isRequired,
  onsetEditModalOpen: PropTypes.func.isRequired,
  editSong: PropTypes.object.isRequired,
  onsetEditSong: PropTypes.func.isRequired,
  songUpdating: PropTypes.bool.isRequired,
  setSongUpdating: PropTypes.func.isRequired,
  delModalOpen: PropTypes.bool.isRequired,
  onsetDelModalOpen: PropTypes.func.isRequired,
  currentSong: PropTypes.object.isRequired,
  onsetCurrentSong: PropTypes.func.isRequired
};

export default enhance(SongTable);
