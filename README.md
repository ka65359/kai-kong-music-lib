# kai-kong-music-lib

A simple music library app.

Instructions
1. Clone the repo
2. Run `npm install`
3. Run `npm run postinstall`
4. Run `npm run start`
5. To successfully run this app from localhost you will need to use the `--disable-web-security` in chrome to avoid CORS errors.
Note: To see information about what other scripts are available run `npm run scripts`.

This project uses the following technologies:
- Basic web application (`react`)
    - Hosted on port `4001` by default - configure in `.env`
- Server hosted API (`express`)
    - Hosted on port `4400` by default - configure in `.env`
- Linting (`eslint`, `stylelint`)
- Formatting on commit (`prettier`)
- Test support (`jest`)
- Store and state management (`react-redux`)
