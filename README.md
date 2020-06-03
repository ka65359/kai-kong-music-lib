# My Music Library
This music library allows users to organize and view song data.
The application is hosted on IBM Cloud and can be accessed [here](http://kai-kong-music-lib.mybluemix.net/).

## Available Features
- Add a song
    - Click the **+** icon on the right side of the header
    - The following fields are available:
        - Title
        - Artist
        - Album
        - Album Link - a complete URL to an image file
        - Genre
        - Play Link - a complete URL to a page that will play the song (ie. youtube)
        - Favorite
- Filter displayed songs based on title, artist, and album text
- Navigate to song library view
    - **Note:** Navigation is displayed in a panel on the left
    - The table displays the song title (as link if a play link is specified), artist, album, an album image, and the genre
    - The table supports sorting on the title, artist, album, and genre fields
    - Pagination support
- Each song in the table has the following options available:
    - Favorite or unfavorite
    - Move up, down, or to the top of the song list
    - Edit song data
    - Delete song (a confirmation dialog will be displayed)
    - **Note:** Move to top, edit, and delete actions are in the overflow menu at the end of each row
- Navigate to favorite songs view
    - Unfavoriting a song in this view will cause the song to be removed from this table
    
---

## Future enhancements
There are still many features to add, here are some of the big ticket items.
- Persist song order - current DB API limitation
- Playlist support and associated bulk actions (add, remove songs)
- Bulk actions like Delete and Move to the top for table items

There are also some smaller enhancements.
- Show larger album image preview on hover
- Allow the user to add a new Genre during create
- Shuffle songs in the list

Other enhancement details can be found [here](https://github.com/ka65359/kai-kong-music-lib/issues/6)

### Known issue
- If you start filtering while on the second (or later) page and there aren't enough results to get that page you are given an empty table. 
    - Workaround: Click the page back button as many times as needed to get back to the first page.

---

## Instructions to run locally
1. Clone the repo
2. Run `npm install`
4. Run `npm run start`
    - If you see issues regarding `/core` not being found, run `npm run postinstall`
5. To successfully run this app from localhost you will need to use the `--disable-web-security` in chrome to avoid CORS errors.
**Note:** To see information about what other scripts are available run `npm run scripts`.

## Technologies
- Basic web application (`react`)
    - Hosted on port `4001` by default - configure in `.env`
- Server hosted API (`express`)
    - Hosted on port `4400` by default - configure in `.env`
- Store and state management (`react-redux`)
- Component Library (`carbon-components-react`)
- Linting (`eslint`, `stylelint`)
- Formatting on commit (`prettier`)
- Test support (`jest`)
- Javascript documentation (`jsdoc`, `docdash`)
    - Hosted on server API port `/docs` (ex. `localhost:4400/docs`)
