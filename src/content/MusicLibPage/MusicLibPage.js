import React, { useState } from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure } from "recompose";
import { DataTableSkeleton, Pagination } from "carbon-components-react";
import { setDataFetching, setAllSongs, clearAllSongs } from "store/actions";
import { getAllSongs } from "store/actions/musicLib";
import store from "../../store";
import SongTable from "./SongTable";

const mapDispatchToProps = {
  getAllSongs,
  setAllSongs,
  clearAllSongs
};

const enhance = compose(
  pure,
  connect(
    (state) => ({
      songs: state.ui.musicLib.songs,
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
  dataFetching
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

  /*const LinkList = ({ url, homepageUrl }) => (
    <ul style={{ display: "flex" }}>
      <li>
        <Link href={url}>GitHub</Link>
      </li>
      {homepageUrl && (
        <li>
          <span>&nbsp;|&nbsp;</span>
          <Link href={homepageUrl}>Homepage</Link>
        </li>
      )}
    </ul>
  );*/

  const getRowItems = (rows) =>
    rows.map((row) => ({
      ...row,
      id: row._id,
      key: row._id,
      title: row.Title,
      artist: row.Artist,
      album: row.Album,
      genre: row.Genre,
      fav: row.Favorite,
      albumImage: (
        <img
          className="kai-table-album-img"
          alt={row.Album}
          title={row.Album}
          src={`https://kaimusic-187c.restdb.io/media/${row.Album_Image}?s=t`}
        />
      )
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

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          {loading}
          <SongTable
            headers={headers}
            rows={rows.slice(firstRowIndex, firstRowIndex + currentPageSize)}
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
