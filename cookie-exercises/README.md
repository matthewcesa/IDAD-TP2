# Cookie Club

CookieClciker is a cookie clicker game built with Vue 3. Click to bake cookies, invest in upgrades, and compare your progress with other players.

## Features

- Create an account and sign in with a username and password.
- Save accounts and game progress in the browser.
- Earn cookies by clicking and through automatic production.
- Buy progressively more expensive upgrades and increase the cookie multiplier.
- View a leaderboard ranked by total cookies collected.
- Challenge other players and compare scores.
- Use the admin area to change player scores or reset one or all games.
- Vue Router handles navigation; Vuex manages game state.

## Requirements

- Node.js
- npm

## Install and run

From the `cookie-exercises` directory:

```sh
npm install
npm run dev
```

Vite prints the local URL to open in your browser, usually `http://localhost:5173`.

## Demo administrator account

- Username: `Admin`
- Password: `cookieadmin`

This administrator account is created automatically when the game starts with empty browser storage. A player account can be created from the sign-in screen.

## Storage and limitations

Accounts, passwords, scores, and games are stored in the browser's `localStorage`. Data is not shared between browsers or devices. This local sign-in is for demonstration purposes and does not provide server-grade account security; do not use a sensitive password.

## Technologies used 

- Vue 3
- Vuex
- Vue Router
