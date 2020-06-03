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
 * @param  {Object[]}  rows           Table rows
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
import Favorite32 from "@carbon/icons-react/lib/favorite/20";
import FavoriteFilled32 from "@carbon/icons-react/lib/favorite--filled/20";
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
  const moveRowUp = (row) => {
    let index = rows.findIndex((arow) => arow._id === row.id);
    const orow = rows[index];
    if (index > 0) {
      let newIndex = index - 1;
      const temp = rows[newIndex];
      rows[newIndex] = orow;
      rows[index] = temp;
      if (_.get(store.getState(), "ui.musicLib.tableSortData.key")) {
        // TODO: This is nasty, need to find a better way to clear sort manually
        window.kaiAppData.songTableRef.current.state.sortHeaderKey = null;
        setTableSortData({ key: "", sortDirection: "" });
      }
      setAllSongs(rows);
    }
  };
  const moveRowDown = (row) => {
    let index = rows.findIndex((arow) => arow._id === row.id);
    const orow = rows[index];
    if (index >= 0 && index < rows.length - 1) {
      let newIndex = index + 1;
      const temp = rows[newIndex];
      rows[newIndex] = orow;
      rows[index] = temp;
      if (_.get(store.getState(), "ui.musicLib.tableSortData.key")) {
        // TODO: This is nasty, need to find a better way to clear sort manually
        window.kaiAppData.songTableRef.current.state.sortHeaderKey = null;
        setTableSortData({ key: "", sortDirection: "" });
      }
      setAllSongs(rows);
    }
  };
  const moveToTop = (row) => {
    let index = rows.findIndex((arow) => arow._id === row.id);
    if (index > 0) {
      const temp = rows[index];
      rows.splice(index, 1);
      rows.unshift(temp);
      if (_.get(store.getState(), "ui.musicLib.tableSortData.key")) {
        // TODO: This is nasty, need to find a better way to clear sort manually
        window.kaiAppData.songTableRef.current.state.sortHeaderKey = null;
        setTableSortData({ key: "", sortDirection: "" });
      }
      setAllSongs(rows);
    }
  };
  const updateSongData = (song) => {
    if (!songUpdating.includes(song._id)) {
      setSongUpdating(song._id);
      updateSong(song);
    }
  };
  const removeSong = (row) => {
    let elem = document.getElementsByClassName("kai-delete-song-modal");
    if (elem.length) {
      elem[0].style.top = window.scrollY - 20 + "px";
    }
    onsetCurrentSong(row);
    onsetDelModalOpen(true);
  };

  const getMenuItemWithIcon = (icon, label, className) => {
    return (
      <span className={"kai-clickable-icon " + className}>
        {icon}
        &nbsp;&nbsp;
        {label}
      </span>
    );
  };

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

  const getVal = (cell, songs) => {
    let id = cell.id.split(":")[0];
    let rows = songs.filter((song) => id == song.id);
    if (!rows.length) {
      console.error("Associated row not found");
    }
    let row = rows[0];
    let val = _.get(cell, "value.selectedItem.label", cell.value);
    const toggleFavorite = (row) => {
      if (!songUpdating.includes(row._id)) {
        setSongUpdating(row._id);
        row.Favorite = !row.Favorite;
        row.favVal = row.Favorite;
        updateSong(row);
      }
    };

    const getFavButton = (row) => {
      let icon = row.favVal ? <FavoriteFilled32 /> : <Favorite32 />;
      let classStr = "kai-fav-icon kai-fav-" + row._id;

      return (
        <div
          className={classStr}
          title="Toggle favorite"
          onClick={() => toggleFavorite(row)}>
          {icon}
        </div>
      );
    };

    const getSongTitleLink = (row) => {
      if (typeof row.Title !== "string") {
        return row.Title;
      }
      return (
        <a
          href={row.Play_Link}
          className="kai-title-link"
          title="Play Song"
          rel="external noopener noreferrer"
          target="_blank">
          {row.Title}
        </a>
      );
    };

    const getAlbumImage = (row) => {
      if (row.Album_Image) {
        return (
          <img
            className="kai-table-album-img"
            alt={row.Album}
            title={row.Album}
            src={`https://kaimusic-187c.restdb.io/media/${row.Album_Image}?s=t`}
          />
        );
      } else if (row.Album_Link) {
        return (
          <img
            className="kai-table-album-img-link"
            alt={row.Album}
            title={row.Album}
            src={row.Album_Link}
          />
        );
      }
      return <div></div>;
    };
    /*   console.log("*******************");
      console.log(cell.info.header);
      console.log(val);*/
    if (cell.info.header == "Title") {
      val = row.Play_Link ? getSongTitleLink(row) : row.titleText;
    } else if (cell.info.header == "Favorite") {
      val = getFavButton(row);
    } else if (cell.info.header == "AlbumImage") {
      val = getAlbumImage(row);
    }
    return <div>{val}</div>;
  };

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
                          {getVal(cell, songs)}
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

SongTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  onSearchUpdate: PropTypes.func.isRequired
};

export default enhance(SongTable);
