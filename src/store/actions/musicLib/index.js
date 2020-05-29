import { setDataFetching, setAllSongs, setSongData } from "store/actions";
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
        /*
        Playlists
        [{
          "_id": "5eceff709236d3040015a0d7",
          "Name": "Monitored full-range function",
          "ID": 3473083,
          "_mock": true,
          "Songs":[{"_id": "5eceff2a9236d3040015a0c5", "Title": "Et voluptatum velit", "ID": 378868,…]
          }
        }]
        */
        dispatch(setDataFetching(false));
        dispatch(setAllSongs(json));
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
        /*
        Playlists
        [{
          "_id": "5eceff709236d3040015a0d7",
          "Name": "Monitored full-range function",
          "ID": 3473083,
          "_mock": true,
          "Songs":[{"_id": "5eceff2a9236d3040015a0c5", "Title": "Et voluptatum velit", "ID": 378868,…]
          }
        }]
        */
        dispatch(setSongData(payload));
      });
  };
};
