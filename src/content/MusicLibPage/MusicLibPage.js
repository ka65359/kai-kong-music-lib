import React, { useState } from "react";
import { connect } from "react-redux";
import { compose, lifecycle, pure } from "recompose";
import { DataTableSkeleton, Pagination } from "carbon-components-react";
import { setDataFetching, setAllSongs, clearAllSongs } from "store/actions";
import { getAllSongs } from "store/actions/musicLib";
import store from "../../store";
import RepoTable from "./RepoTable";

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
      store.dispatch(setDataFetching(true)); // TODO: store.dispatch?
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
      key: "name",
      header: "Name"
    },
    {
      key: "createdAt",
      header: "Created"
    },
    {
      key: "updatedAt",
      header: "Updated"
    },
    {
      key: "issueCount",
      header: "Open Issues"
    },
    {
      key: "stars",
      header: "Stars"
    },
    {
      key: "links",
      header: "Links"
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

  /*const getRowItems = (rows) =>
    rows.map((row) => ({
      ...row,
      key: row.id,
      title: row.title,
      artist: row.artist,
      album: row.album,
      genre: row.genre,
      fav: row.favorite,
      albumImage: row.album_image,
      links: <LinkList play={row.play_link} albumLink={row.album_link} />
    }));*/

  let loading = <div></div>;
  if (dataFetching) {
    // TODO: insert loader tag
    loading = (
      <DataTableSkeleton
        columnCount={headers.length + 1}
        rowCount={10}
        headers={headers}
      />
    );
  }

  const rows = songs;

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          {loading}
          <RepoTable
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
