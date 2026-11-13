# StudentQuest - Learning Quiz by *pluto.pop()*

## Overview 

StudyQuest is a hub website where students can view their specific subjects and take part in quizzes and games related to topics they’re studying. Students can earn XP and view leaderboards, introducing a gamified and competitive aspect to learning that will help motivate them to revise.

Teachers are able to set and create quizzes, view their students' scores and track progress over a range of classes. 

This site is for **non-STEM** subjects, with our application showing **History** as an example subject.

## Getting Started

### Prerequisites 

- __Node.js__

- __npm__

- A cloud-based database management hosting platform (e.g. [Supabase](https://supabase.com/), [Neon](https://neon.com/), etc...)

### Installation requirements
1. Clone the repo by running:  `git clone your_github_url`

2. `cd` into the __server__ folder

3. Install all the dependencies by running `npm install` on your terminal
    - This project uses:

        - __Express__

        - __Cors__

        - __dotenv__

        - __nodemon__

        - __jest__

        - __pg__

        - __bcrypt__

4. Setup your database

    - Create a database on [Supabase](https://supabase.com/) or other cloud-based database management systems platform

    - Retrieve the database URL and copy it

    - Create a `.env` file in the root directory with the following:
        - `DB_URL=<your_database_url>`

    - Replace `<your_database_url>` with the database URL you just copied from Supabase

    - Run `npm run setup-db` to setup the database

5. Run the server
    - Run `npm run dev` to run the server in development mode
    - Run `npm run start` to run the server in production mode

## Docker
StudyQuest can also be run using Docker, allowing the application to run inside a container without needing to install the project dependencies locally.

### Prerequisities
- Docker installed and running
- A PostgreSQL database (e.g. Supabase or Neon)
- A .env file containing the required environment variables

### Running with Docker
1. Ensure your .env file is configured in the project root:
```
DB_URL=<your_database_url>
JWT_SECRET=<your_jwt_secret>
PORT=3000
```
2. Build the Docker image from the project root:

    ```docker build -t studyquest-api```

3. Run the Docker container: 

    ```docker run --env-file .env -p 3000:3000 --name studyquest-api studyquest-api```

4. Open your browser and navigate to:

    ```http://localhost:3000```
    
    The application should now be accessible through Docker

## Backend

The backend is a REST API built with Node.js and Express, using PostgreSQL for storage. It handles user accounts, authentication and quiz questions, and returns JSON.

### Project structure

```
api/
  controllers/   request handling
  database/      connection and setup
  middleware/    authentication and logging
  model/         database queries
  routers/       URL to controller mapping
  utils/         shared helpers
app.js           creates the Express app
index.js         starts the server
```

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/game` | Get all questions |
| GET | `/game/:topic` | Get questions for a topic |
| POST | `/game` | Create a question |
| PUT | `/game/:id` | Update a question |
| DELETE | `/game/:id` | Delete a question |
| GET | `/users` | Get all users |
| GET | `/users/:role` | Get users by role |
| POST | `/users` | Create a user |
| DELETE | `/users/:id` | Delete a user |

## Database Schema

The database contains multiple tables. An example of one is shown below. These are created with __Postgres__.

`questions` - table name

```sql
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  topic VARCHAR(50) NOT NULL,
  question_type VARCHAR(10) NOT NULL CHECK (question_type IN (‘date’, ‘figure’, ‘place’)),
  question TEXT NOT NULL,
  answer VARCHAR(100) NOT NULL,
  alt_answers TEXT[] NOT NULL DEFAULT ‘{}’,
  fun_fact TEXT,
  image_url VARCHAR(255)
;
```
## Testing

| Command | What it runs |
|---|---|
| `npm run unitTests` | Controller and model tests, with mocked dependencies |
| `npm run integrationTests` | Route tests against a real database |
| `npm run coverage` | Coverage report for the unit tests |

Unit tests mock the database, so need no setup to run. Integration tests need a `.env` with `DB_URL` and a set-up database, and they add and remove temporary test rows.

## Frontend

The frontend is built with HTML, CSS and Javascript. It's served by the Express app from the `public/` folder. It talks to the backend API using `fetch`.

```
public/
  assets/images/   subject and badge images
  startpage.html   landing page
  login.html       login and registration
  login.js         login page logic
  subjectpage.html subject selection
  historyPage.html history topic page
  gamepage.html    quiz game page
  gamePage.js      quiz game logic
  style.css        shared styles
```

### Pages

| Page | Purpose |
|---|---|
| Start page | Entry point to the site |
| Login | Sign in or create an account |
| Subject page | Choose a subject to study |
| History page | Topic page for the History subject |
| Game page | Answer quiz questions and earn XP |

## Future Features

1. Teachers to have a button `Assign to class` to set quizzes for their class
2. Teachers to be able to show and hide leaderboards for their classes
3. Teachers would have the ability to lock games until certain quizzes are completed
4. More topics to be included from **non-STEM subjects** such as Geography, French, Spanish and etc.
5. Feature rotating **game of the week**