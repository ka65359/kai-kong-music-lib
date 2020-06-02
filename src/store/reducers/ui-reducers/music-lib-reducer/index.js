import { createReducer } from "redux-act";
import {
  setCurrentPage,
  setDataFetching,
  setAllSongs,
  clearAllSongs,
  setSongData,
  setSongUpdating,
  clearSongUpdating,
  setTableSearchStr,
  setTableSortData
} from "store/actions";

export const initialState = {
  currentPage: "library",
  dataFetching: false,
  songs: [],
  songUpdating: [],
  searchStr: "",
  tableSortData: { key: "", sortDirection: "" }
};

export default createReducer(
  {
    [setCurrentPage]: (state, payload) => {
      let libElem = document.getElementsByClassName(
        window.kaiAppData.libraryLinkName
      );
      let favElem = document.getElementsByClassName(
        window.kaiAppData.favoritesLinkName
      );
      if (payload == "library") {
        if (libElem.length) {
          libElem[0].ariaCurrent = "page";
        }
        if (favElem.length) {
          favElem[0].ariaCurrent = "";
        }
      } else if (payload == "favorites") {
        if (libElem.length) {
          libElem[0].ariaCurrent = "";
        }
        if (favElem.length) {
          favElem[0].ariaCurrent = "page";
        }
      }
      let rslt = Object.assign({}, state, {
        currentPage: payload
      });
      return rslt;
    },
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
    [setSongUpdating]: (state, payload) => {
      let final = Array.from(state.songUpdating);
      final.push(payload);
      let rslt = Object.assign({}, state, {
        songUpdating: final
      });
      return rslt;
    },
    [clearSongUpdating]: (state, payload) => {
      let final = Array.from(state.songUpdating);
      final = final.filter((item) => item !== payload);
      let rslt = Object.assign({}, state, {
        songUpdating: final
      });
      return rslt;
    },
    [setSongData]: (state, payload) => {
      let songs = Array.from(state.songs);
      let index = songs.findIndex((song) => song._id === payload._id);
      songs[index] = payload;
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
    }
  },
  initialState
);
