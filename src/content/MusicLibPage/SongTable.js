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
  OverflowMenuItem
} from "carbon-components-react";
import {
  ChevronUp20,
  ChevronDown20,
  UpToTop20,
  TrashCan20,
  Edit20
} from "@carbon/icons-react";
import { setTableSortData } from "store/actions";
import store from "../../store";
import "./_song-table.scss";

const SongTable = ({ rows, headers, onSearchUpdate }) => {
  const moveRowUp = (row) => {
    // Access rows update order
    // call setAllSongs - should this be stored in DB?
    console.debug(row);
  };
  const moveRowDown = (row) => {
    // Access rows update order
    // call setAllSongs - should this be stored in DB?
    console.debug(row);
  };
  const moveToTop = (row) => {
    // Access rows update order
    // call setAllSongs - should this be stored in DB?
    console.debug(row);
  };
  const editSong = (row) => {
    // call updateSong
    console.debug(row);
  };
  const removeSong = (row) => {
    // call removeSongFromLibrary
    console.debug(row);
  };

  const getMenuItemWithIcon = (icon, label, className, callBack, row) => {
    return (
      <span className={className} onClick={() => callBack(row)}>
        {icon}
        &nbsp;&nbsp;
        {label}
      </span>
    );
  };

  return (
    <DataTable
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
          store.dispatch(setTableSortData({ sortDirection, key })); // only the first time in
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
          description="A collection of music.">
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
                        className="kai-move-up-icon"
                        onClick={() => moveRowUp(row)}>
                        {<ChevronUp20 />}
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <span
                        className="kai-move-down-icon"
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
                            "kai-overflow-item-icon",
                            moveToTop,
                            row
                          )}
                          onClick={function noRefCheck() {}}
                          onKeyDown={function noRefCheck() {}}
                        />
                        <OverflowMenuItem
                          className="some-class"
                          itemText={getMenuItemWithIcon(
                            <Edit20 />,
                            "Edit",
                            "kai-overflow-item-icon",
                            editSong,
                            row
                          )}
                          onClick={function noRefCheck() {}}
                          onKeyDown={function noRefCheck() {}}
                        />
                        <OverflowMenuItem
                          className="some-class"
                          disabled={false}
                          hasDivider
                          isDelete
                          itemText={getMenuItemWithIcon(
                            <TrashCan20 />,
                            "Delete",
                            "kai-overflow-item-icon",
                            removeSong,
                            row
                          )}
                          onClick={function noRefCheck() {}}
                          onKeyDown={function noRefCheck() {}}
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
  );
};

SongTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  onSearchUpdate: PropTypes.func.isRequired
};

export default SongTable;
