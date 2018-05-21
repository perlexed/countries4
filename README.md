
Countries: The Game
-------------------

Try in here: [http://perlexed.net/countries](http://perlexed.net/countries)

### Trivia

A geographic game. Player has to write as much countries as he can in a limited time.
Tries are not limited

2- and 10-minutes game modes are available.

Player can view statistics of all the games along with his personal history.

### Technical details

The game is an Single Page Application (SPA).

[Redux](https://redux.js.org/) is the backbone of the data flow, [React](https://reactjs.org/) is used for views rendering.

State is saved on each action, so it's safe to refresh page in any moment with no risk of losing data.

When user loads the app for the first time, he's identified by the unique cookie.
With this cookie he can view his history.

Statistics data is collected asynchronously to the backend, where it's stored in the MySQL.

### Country matching

The country name checking logic is made to consider the following nuances:
- Along the official full country name some countries has short name
- Common aliases are given to the several countries. E.g. `Северная Корея` will match the
  `Корейская Народно-Демократическая Республика`, despite the fact that `Северная Корея` is not the country's
  full name nor the short name
- Punctuation is ignored
- For the long input strings some typos are allowed (a strict version of a [fuzzy search](https://en.wikipedia.org/wiki/Approximate_string_matching)) 
- Matching logic is covered by the tests, and can easily be extended with test cases in the
  `test/nameCheckingRules.js` 

INSTALLATION
------------

1. Clone the project
2. Copy `config.sample.php` to the `config.php`, uncomment database settings and fill them with the actual data
3. Load dependencies:
    ```
    composer install
    npm install
    ```
4. Start `webpack watch`/`webpack static` for the development/production js build
