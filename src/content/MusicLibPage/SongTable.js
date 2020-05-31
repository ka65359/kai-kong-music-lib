import React from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from "carbon-components-react";
import "./_song-table.scss";

const SongTable = ({ rows, headers }) => {
  return (
    <DataTable
      rows={rows}
      headers={headers}
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
                      <TableCell key={cell.id}>{cell.value}</TableCell>
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

export default SongTable;
