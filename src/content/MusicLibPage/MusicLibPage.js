import React, { useState } from "react";
import RepoTable from "./RepoTable";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Link, DataTableSkeleton, Pagination } from "carbon-components-react";

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

const LinkList = ({ url, homepageUrl }) => (
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
);

const getRowItems = (rows) =>
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
  }));

const RepoPage = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  /*
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
if (this.readyState === 4) {
  console.log(this.responseText);
}
});

xhr.open("GET", "https://kaimusic-187c.restdb.io/rest/songs");
xhr.setRequestHeader("content-type", "application/json");
const key = "83a235df14c0d1972f4a394a896951f69e05f"
xhr.setRequestHeader("x-apikey", key);
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);





 */

  return (
    <div className="bx--grid bx--grid--full-width bx--grid--no-gutter repo-page">
      <div className="bx--row repo-page__r1">
        <div className="bx--col-lg-16">
          <Query query={REPO_QUERY}>
            {({ loading, error, data: { organization } }) => {
              // Wait for the request to complete
              if (loading)
                return (
                  <DataTableSkeleton
                    columnCount={headers.length + 1}
                    rowCount={10}
                    headers={headers}
                  />
                );

              // Something went wrong with the data fetching
              if (error) return `Error! ${error.message}`;

              // If we're here, we've got our data!
              const { repositories } = organization;
              setTotalItems(repositories.totalCount);
              const rows = getRowItems(repositories.nodes);

              return (
                <>
                  <RepoTable
                    headers={headers}
                    rows={rows.slice(
                      firstRowIndex,
                      firstRowIndex + currentPageSize
                    )}
                  />
                  <Pagination
                    totalItems={totalItems}
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
                </>
              );
            }}
          </Query>
        </div>
      </div>
    </div>
  );
};

export default RepoPage;
