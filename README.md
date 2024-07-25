# API Testing (starter)

## Usage

- Run `git clone <repo-link>`
- Run `cd server`
- Run `npm install`

### Setup the database

- Create an `.env` file within `server` & add the following:
  
    ```bash
    PORT=<pick a port>
    ## use elephant SQL for DB_URL
    DB_URL=<link-db>
    ```
- Run `npm run seed-db` to setup the database
  
### Run the server 

- Run `npm run dev` to start the API & the app should run on `3000` (if that's the port you've set in the `.env` file)

**Note:** The `docker-compose.yaml` file is needed to setup a test database when implementing tests.
