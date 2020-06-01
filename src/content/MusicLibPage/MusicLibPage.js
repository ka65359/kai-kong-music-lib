import React, { useState } from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure } from "recompose";
import _ from "lodash";
import { DataTableSkeleton, Pagination } from "carbon-components-react";
import Favorite32 from "@carbon/icons-react/lib/favorite/20";
import FavoriteFilled32 from "@carbon/icons-react/lib/favorite--filled/20";
import {
  setDataFetching,
  setAllSongs,
  clearAllSongs,
  setTableSearchStr,
  setSongUpdating
} from "store/actions";
import { getAllSongs, updateSong } from "store/actions/musicLib";
import store from "../../store";
import SongTable from "./SongTable";

const mapDispatchToProps = {
  getAllSongs,
  setAllSongs,
  clearAllSongs,
  updateSong,
  setSongUpdating,
  setTableSearchStr
};

const enhance = compose(
  pure,
  connect(
    (state) => ({
      songs: state.ui.musicLib.songs,
      searchStr: state.ui.musicLib.searchStr,
      tableSortData: state.ui.musicLib.tableSortData,
      dataFetching: state.ui.musicLib.dataFetching,
      songUpdating: state.ui.musicLib.songUpdating,
      playlists: state.ui.musicLib.playlists
    }),
    mapDispatchToProps
  ),
  lifecycle({
    UNSAFE_componentWillMount() {
      // subscribe to eventlisteners
      //window.addEventListener("click", onClickHandler);
      // populate song data
      store.dispatch(setDataFetching(true));
      store.dispatch(getAllSongs());
    },
    componentDidMount() {},
    componentWillUnmount() {
      // remove eventlisteners
      //window.removeEventListener("click", onClickHandler);
    },
    shouldComponentUpdate(nextProps) {
      if (this.props !== nextProps) {
        return true;
      }
    }
  })
);

export const MusicLibPage = ({
  songs,
  searchStr,
  tableSortData,
  dataFetching,
  updateSong,
  songUpdating,
  setSongUpdating,
  setTableSearchStr
  /* playlists,
  setAllSongs,
  clearAllSongs*/
}) => {
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const headers = [
    {
      key: "Title",
      header: "Title"
    },
    {
      key: "Artist",
      header: "Artist"
    },
    {
      key: "Album",
      header: "Album"
    },
    {
      key: "AlbumImage",
      header: "",
      isSortable: false
    },
    {
      key: "Genre",
      header: "Genre"
    },
    {
      key: "Favorite",
      header: "Favorite",
      isSortable: false
    }
  ];

  const toggleFavorite = (row) => {
    if (!songUpdating.includes(row._id)) {
      setSongUpdating(row._id);
      row.Favorite = !row.Favorite;
      updateSong(row);
    }
  };

  const getFavButton = (row) => {
    let icon = row.Favorite ? <FavoriteFilled32 /> : <Favorite32 />;
    let classStr = "kai-fav-icon kai-fav-" + row._id;

    return (
      <div className={classStr} onClick={() => toggleFavorite(row)}>
        {icon}
      </div>
    );
  };

  const getSongTitleLink = (row) => {
    return (
      <a
        href={row.Play_Link}
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

  const getRowItems = (rows) =>
    rows.map((row) => ({
      ...row,
      id: row._id,
      key: row._id,
      Title: row.Play_Link ? getSongTitleLink(row) : row.Title,
      titleText: row.Title,
      Artist: row.Artist,
      Album: row.Album,
      Genre: row.Genre,
      Favorite: getFavButton(row),
      AlbumImage: getAlbumImage(row)
    }));

  let loading = <div></div>;
  if (dataFetching) {
    loading = (
      <DataTableSkeleton
        columnCount={headers.length + 1}
        rowCount={10}
        headers={headers}
      />
    );
  }

  const rows = getRowItems(songs);

  const getFilteredRows = (searchStr, rows) => {
    if (!searchStr) {
      return rows;
    }
    searchStr = searchStr.toLowerCase();
    const searchFields = ["titleText", "Artist", "Album"];
    const re = new RegExp(`.*${searchStr}.*`);
    let filteredRows = [];
    for (let j = 0; j < rows.length; j++) {
      for (let i = 0; i < searchFields.length; i++) {
        let testStr = rows[j][searchFields[i]].toLowerCase();
        if (typeof testStr == "string") {
          testStr = testStr.toLowerCase();
        }
        if (testStr.match(re)) {
          filteredRows.push(rows[j]);
          break;
        }
      }
    }
    return filteredRows;
  };

  const sortSongs = (rows, sortDirection, key) => {
    if (
      key == "Album_Link" ||
      key == "Album_Image" ||
      key == "Play_Link" ||
      key == "Favorite"
    ) {
      console.error("Sorting by " + key + " is disabled.");
      return rows;
    }
    const compare = (a, b) => {
      a = a[key];
      b = b[key];

      if (typeof a == "string") {
        a = a.toLowerCase();
      } else if (typeof a == "object") {
        a = _.get(a, "props.children", "");
      }
      if (typeof b == "string") {
        b = b.toLowerCase();
      } else if (typeof b == "object") {
        a = _.get(b, "props.children", "");
      }
      return a > b ? 1 : -1;
    };
    let sortedRows;
    if (sortDirection !== "DESC") {
      sortedRows = rows.sort((a, b) => {
        return compare(a, b);
      });
    } else {
      sortedRows = rows.sort((a, b) => {
        return compare(b, a);
      });
    }
    return sortedRows;
  };

  let displayedRows = rows;
  if (tableSortData.key) {
    displayedRows = sortSongs(
      rows,
      tableSortData.sortDirection,
      tableSortData.key
    );
  }
  if (searchStr) {
    displayedRows = getFilteredRows(searchStr, displayedRows);
  }

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter music-lib-page">
      <div className="bx--row music-lib-page__r1">
        <div className="bx--col-lg-16">
          {loading}
          <SongTable
            headers={headers}
            rows={displayedRows.slice(
              firstRowIndex,
              firstRowIndex + currentPageSize
            )}
            sortKey={tableSortData.key}
            sortDir={tableSortData.sortDirection}
            onSearchUpdate={(evt) => setTableSearchStr(evt.target.value)}
          />
          <Pagination
            totalItems={displayedRows.length}
            backwardText="Previous page"
            forwardText="Next page"
            pageSize={currentPageSize}
            pageSizes={[5, 10, 15, 25]}
            itemsPerPageText="Items per page"
            onChange={({ page, pageSize }) => {
              if (pageSize !== currentPageSize) {
                setCurrentPageSize(pageSize);
              }
              setFirstRowIndex(pageSize * (page - 1));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default enhance(MusicLibPage);
