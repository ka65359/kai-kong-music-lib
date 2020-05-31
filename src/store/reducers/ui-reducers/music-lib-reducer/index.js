import _ from "lodash";
import { createReducer } from "redux-act";
import {
  setDataFetching,
  setAllSongs,
  clearAllSongs,
  setSongData,
  setTableSearchStr,
  setTableSortData,
  addSongToLibrary,
  removeSongFromLibrary,
  setPlaylists,
  clearPlaylists
  /*addPlaylist,
  removePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist*/
} from "store/actions";

export const initialState = {
  dataFetching: false,
  songs: [],
  searchStr: "",
  tableSortData: { key: "title", dir: "ASC" },
  playlists: []
};

export default createReducer(
  {
    [setDataFetching]: (state, payload) => {
      let rslt = Object.assign({}, state, {
        dataFetching: payload
      });
      return rslt;
    },
    [clearAllSongs]: (state) => {
      let rslt = Object.assign({}, state, {
        songs: initialState.songs
      });
      return rslt;
    },
    [setAllSongs]: (state, payload) => {
      if (!payload) {
        console.error("New value is empty, reverting to intial");
        payload = initialState.songs;
      }
      let rslt = Object.assign({}, state, {
        songs: payload
      });
      return rslt;
    },
    [setSongData]: (state, payload) => {
      let songs = _.cloneDeep(state.songs);
      songs.map((song) => {
        return song._id !== payload._id ? song : payload;
      });
      let rslt = Object.assign({}, state, {
        songs: songs
      });
      return rslt;
    },
    [setTableSearchStr]: (state, payload) => {
      let rslt = Object.assign({}, state, {
        searchStr: payload
      });
      return rslt;
    },
    [setTableSortData]: (state, payload) => {
      let rslt = Object.assign({}, state, {
        tableSortData: payload
      });
      return rslt;
    },
    [removeSongFromLibrary]: (state, payload) => {
      let rslt = Object.assign({}, state, {
        songs: payload
      });
      return rslt;
    },
    [addSongToLibrary]: (state, payload) => {
      if (!payload) {
        console.error("New value is empty, reverting to intial");
        payload = initialState.songs;
      }
      let rslt = Object.assign({}, state, {
        songs: payload
      });
      return rslt;
    },
    [clearPlaylists]: (state) => {
      let rslt = Object.assign({}, state, {
        playlists: initialState.playlists
      });
      return rslt;
    },
    [setPlaylists]: (state, payload) => {
      if (!payload) {
        console.error("New value is empty, reverting to intial");
        payload = initialState.playlists;
      }
      let rslt = Object.assign({}, state, {
        playlists: payload
      });
      return rslt;
    }
  },
  initialState
);
