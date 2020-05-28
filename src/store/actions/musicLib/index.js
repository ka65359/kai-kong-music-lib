import { setDataFetching, setAllSongs } from "store/actions";
//import store from "../../../store";
/*
var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
if (this.readyState === 4) {
  console.log(this.responseText);
}
});

xhr.open("GET", "https://kaimusic-187c.restdb.io/rest/songs");
xhr.setRequestHeader("content-type", "application/json");
const key = "83a235df14c0d1972f4a394a896951f69e05f"
xhr.setRequestHeader("x-apikey", key);
xhr.setRequestHeader("cache-control", "no-cache");

xhr.send(data);
*/

export const getAllSongs = () => {
  // TODO: env.process or whatever it is for env variables check express config
  const key = "83a235df14c0d1972f4a394a896951f69e05f";
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
      .then((json) => {
        /*
        https://kaimusic-187c.restdb.io/media/0000000000000000000000000_30-30-nightlife-3?s=o
        xhr.open("GET", "https://kaimusic-187c.restdb.io/rest/songs/5eceff2a9236d3040015a0b5");
        songs
        {
          "_id": "5eceff2a9236d3040015a0b5",
          "Title": "Consequatur est aut",
          "ID": 695609,
          "Artist": "Jayden Medhurst",
          "Album": "Optional multimedia emulation",
          "Album_Image":[
          "0000000000000000000000000_30-30-nightlife-3"
          ],
          "Favorite": 0,
          "_mock": true
        }

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
