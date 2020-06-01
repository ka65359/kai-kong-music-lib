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
  TableCell
} from "carbon-components-react";
import { setTableSortData } from "store/actions";
import store from "../../store";
import "./_song-table.scss";

const SongTable = ({ rows, headers, onSearchUpdate }) => {
  return (
    <DataTable
      rows={rows}
      headers={headers}
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
