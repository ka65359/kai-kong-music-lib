import { createReducer } from "redux-act";
import { setSongs, clearSongs } from "store/actions";

export const initialState = {
  songs: []
};

export default createReducer(
  {
    [clearSongs]: (state) => {
      let rslt = Object.assign({}, state, {
        songs: initialState.songs
      });
      return rslt;
    },
    [setSongs]: (state, payload) => {
      if (!payload) {
        console.error("New value is empty, reverting to intial");
        payload = initialState.songs;
      }
      let rslt = Object.assign({}, state, {
        songs: payload
      });
      return rslt;
    }
  },
  initialState
);
