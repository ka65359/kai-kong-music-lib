module.exports = Object.freeze({
  songDefaultState: {
    Title: "",
    Artist: "",
    Album: "",
    Album_Link: "",
    Genre: { selectedItem: {} },
    Favorite: false,
    Play_Link: "",
    isValid: true,
    fieldValid: {
      Title: true,
      Album_Link: true,
      Play_Link: true
    }
  }
});
