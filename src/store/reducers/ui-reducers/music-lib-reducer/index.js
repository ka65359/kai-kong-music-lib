import _ from "lodash";
import { createReducer } from "redux-act";
import {
  setDataFetching,
  setAllSongs,
  clearAllSongs,
  setSongData,
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
