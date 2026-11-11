# StudentQuest - Learning Quiz by *pluto.pop()*

## Overview 

A website that allows students to select topics of interest, and answer questions in a fun, interactive quiz-style format. These are for **non-STEM** subjects, with our application showing **History** as an example subject.

Teachers are able to view their students scores and track progress over a range of subjects.

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
## Future Features

1. Teachers to have a button `Assign to class` to set quizzes for their class
2. More topics to be included from **non-STEM subjects** such as Geography, French, Spanish and etc.
3. Feature rotating **game of the week**