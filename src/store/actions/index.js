import { createAction } from "redux-act";

export const clearAStateProp = createAction("sample redux clear action");
export const setAStateProp = createAction("sample redux set action");

export const setSongs = createAction("Set all songs in the library");
export const clearSongs = createAction("Clear all songs in the library");
