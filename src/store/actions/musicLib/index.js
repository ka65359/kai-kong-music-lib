import {
  setDataFetching,
  setAllSongs,
  setSongData,
  clearSongUpdating
} from "store/actions";
const key = "83a235df14c0d1972f4a394a896951f69e05f"; // DEV-MODE KEY!!
//const key = "5ed16aa12032862ff2ce265d";

export const getAllSongs = () => {
  return (dispatch) => {
    return fetch("https://kaimusic-187c.restdb.io/rest/songs", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-apikey": key
      }
    })
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else {
            return [];
          }
        },
        (error) => {
          if (error) {
            console.error(error);
            throw new Error(error);
          }
        }
      )
      .then((json) => {
        dispatch(setDataFetching(false));
        dispatch(setAllSongs(json));
      });
  };
};

export const createSong = (payload) => {
  let JSONBody = {};
  JSONBody.Title = payload.Title;
  JSONBody.Artist = payload.Artist;
  JSONBody.Album = payload.Album;
  JSONBody.Genre = payload.Genre.selectedItem.label;
  // RestDB.io must not include payload fields with required regex that have no value
  if (payload.Album_Link) {
    JSONBody.Album_Link = payload.Album_Link;
  }
  if (payload.Play_Link) {
    JSONBody.Play_Link = payload.Play_Link;
  }
  JSONBody.Favorite = payload.Favorite;
  return (dispatch) => {
    return fetch("https://kaimusic-187c.restdb.io/rest/songs", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-apikey": key
      },
      body: JSON.stringify(JSONBody)
    })
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else {
            return {};
          }
        },
        (error) => {
          if (error) {
            console.error(error);
            throw new Error(error);
          }
        }
      )
      .then(() => {
        dispatch(getAllSongs());
      });
  };
};

export const updateSong = (payload) => {
  if (payload._mock) {
    delete payload._mock;
  }
  return (dispatch) => {
    return fetch("https://kaimusic-187c.restdb.io/rest/songs/" + payload._id, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-apikey": key
      }
    })
      .then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else {
            return {};
          }
        },
        (error) => {
          if (error) {
            console.error(error);
            throw new Error(error);
          }
        }
      )
      .then(() => {
        dispatch(clearSongUpdating(payload._id));
        dispatch(setSongData(payload));
      });
  };
};

export const deleteSong = (payload) => {
  return (dispatch) => {
    return fetch(
      "https://kaimusic-187c.restdb.io/rest/songs/" + payload.row.id,
      {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "x-apikey": key
        }
      }
    ).then(
      (response) => {
        if (response.ok) {
          let index = payload.songs.findIndex(
            (arow) => arow._id === payload.row.id
          );
          if (index > 0) {
            payload.songs.splice(index, 1);
            dispatch(setAllSongs(payload.songs));
          }
        }
      },
      (error) => {
        if (error) {
          console.error(error);
          throw new Error(error);
        }
      }
    );
  };
};
