import { createAction } from "redux-act";

export const setDataFetching = createAction(
  "Flag for if data is being fetched"
);
export const setAllSongs = createAction("Set all songs in the library");
export const clearAllSongs = createAction("Clear all songs in the library");
export const setSongData = createAction(
  "Update the data for an individual song"
);
export const setSongUpdating = createAction(
  "Flag if song is in the process of being updated"
);
export const clearSongUpdating = createAction(
  "Flag if song is done being updated"
);
export const setTableSearchStr = createAction("Set song table's search string");
export const setTableSortData = createAction("Set song table's sort data");
