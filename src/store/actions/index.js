import { createAction } from "redux-act";

export const setDataFetching = createAction(
  "Flag for if data is being fetched"
);
export const setAllSongs = createAction("Set all songs in the library");
export const clearAllSongs = createAction("Clear all songs in the library");
export const setSongData = createAction(
  "Update the data for an individual song"
);
export const setTableSearchStr = createAction("Set song table's search string");
export const addSongToLibrary = createAction("Add a song to the song library");
export const removeSongFromLibrary = createAction(
  "Remove a song from the song library"
);
export const setPlaylists = createAction("Set playlists");
export const clearPlaylists = createAction("Clear playlists");
export const addPlaylist = createAction("Add a new playlist");
export const removePlaylist = createAction("Remove an existing playlist");
export const addSongToPlaylist = createAction("Add a song to a playlist");
export const removeSongFromPlaylist = createAction(
  "Remove a song from a playlist"
);
