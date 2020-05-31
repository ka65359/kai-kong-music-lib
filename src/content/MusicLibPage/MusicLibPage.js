import React, { useState } from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure } from "recompose";
import { DataTableSkeleton, Pagination } from "carbon-components-react";
import Favorite32 from "@carbon/icons-react/lib/favorite/20";
import FavoriteFilled32 from "@carbon/icons-react/lib/favorite--filled/20";
import {
  setDataFetching,
  setAllSongs,
  clearAllSongs,
  setTableSearchStr
} from "store/actions";
import { getAllSongs, updateSong } from "store/actions/musicLib";
import store from "../../store";
import SongTable from "./SongTable";

const mapDispatchToProps = {
  getAllSongs,
  setAllSongs,
  clearAllSongs,
  updateSong,
  setTableSearchStr
};

const enhance = compose(
  pure,
  connect(
    (state) => ({
      songs: state.ui.musicLib.songs,
      searchStr: state.ui.musicLib.searchStr,
      dataFetching: state.ui.musicLib.dataFetching,
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
  dataFetching,
  updateSong,
  setTableSearchStr
  /* playlists,
  setAllSongs,
  clearAllSongs*/
}) => {
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const headers = [
    {
      key: "title",
      header: "Title"
    },
    {
      key: "artist",
      header: "Artist"
    },
    {
      key: "album",
      header: "Album"
    },
    {
      key: "albumImage",
      header: ""
    },
    {
      key: "genre",
      header: "Genre"
    },
    {
      key: "fav",
      header: "Favorite"
    }
  ];

  const toggleFavorite = (row) => {
    row.Favorite = !row.Favorite;
    updateSong(row);
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
      title: row.Play_Link ? getSongTitleLink(row) : row.Title,
      titleText: row.Title,
      artist: row.Artist,
      album: row.Album,
      genre: row.Genre,
      fav: getFavButton(row),
      albumImage: getAlbumImage(row)
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
    const searchFields = ["titleText", "artist", "album"];
    const re = new RegExp(`.*${searchStr}.*`);
    let filteredRows = [];
    for (let j = 0; j < rows.length; j++) {
      for (let i = 0; i < searchFields.length; i++) {
        if (rows[j][searchFields[i]].match(re)) {
          filteredRows.push(rows[j]);
          break;
        }
      }
    }
    return filteredRows;
  };

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter music-lib-page">
      <div className="bx--row music-lib-page__r1">
        <div className="bx--col-lg-16">
          {loading}
          <SongTable
            headers={headers}
            rows={getFilteredRows(searchStr, rows).slice(
              firstRowIndex,
              firstRowIndex + currentPageSize
            )}
            onSearchUpdate={(evt) => setTableSearchStr(evt.target.value)}
          />
          <Pagination
            totalItems={songs.length}
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
