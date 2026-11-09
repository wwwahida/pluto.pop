DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS questions;


CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  security_question VARCHAR(255), 
  security_answer_hash VARCHAR(255),
  role VARCHAR(10) NOT NULL CHECK (role IN ('student', 'teacher'))
);

CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    organisation VARCHAR(100) NOT NULL, 
    class_name VARCHAR(50) NOT NULL
);

CREATE TABLE students (
  student_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  teacher_id INT NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE
); 

CREATE TABLE scores (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  topic VARCHAR(50) NOT NULL,
  score INT NOT NULL
);

CREATE TABLE questions (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  topic VARCHAR(50) NOT NULL,
  question_type VARCHAR(10) NOT NULL CHECK (question_type IN ('date', 'figure', 'place')),
  question TEXT NOT NULL,
  answer VARCHAR(100) NOT NULL,
  alt_answers TEXT[] NOT NULL DEFAULT '{}',   
  fun_fact TEXT,
  image_url VARCHAR(255)
);

INSERT INTO questions (topic, question_type, question, answer, alt_answers, fun_fact, image_url)
VALUES
('ww2', 'date', 'In which year did World War II begin?',
 '1939', '{}',
 'Germany invaded Poland on 1 September 1939, and Britain and France declared war on Germany two days later.',
 '/assets/images/question1.jpg'),

('ww2', 'date', 'In which year was the Battle of Britain fought?',
 '1940', '{}',
 'The RAF defended Britain against the German Luftwaffe, and its pilots became known as The Few.',
 '/assets/images/question2.jpg'),

('ww2', 'date', 'In which year did the D-Day landings take place?',
 '1944', '{}',
 'On 6 June 1944, more than 150,000 Allied troops landed in Normandy in the largest seaborne invasion in history.',
 '/assets/images/question3.jpg'),

('ww2', 'date', 'In which year did World War II end?',
 '1945', '{}',
 'Victory in Europe (VE) Day was 8 May 1945, and Japan formally surrendered in September 1945.',
 '/assets/images/question4.jpg'),

('ww2', 'figure', 'Who became British Prime Minister in May 1940 and led the country for most of the war?',
 'Winston Churchill', ARRAY['Churchill'],
 'Churchill took over from Neville Chamberlain just as Germany launched its invasion of France and the Low Countries.',
 '/assets/images/question5.jpg'),

('ww2', 'figure', 'Who was the Supreme Allied Commander during the D-Day invasion of Normandy?',
 'Dwight D. Eisenhower', ARRAY['Eisenhower', 'Dwight Eisenhower', 'Ike'],
 'Eisenhower later became the 34th President of the United States.',
 '/assets/images/question6.jpg'),

('ww2', 'figure', 'Who was the leader of the Soviet Union during World War II?',
 'Joseph Stalin', ARRAY['Stalin', 'Josef Stalin'],
 'The Soviet Union joined the Allies after Germany invaded it in June 1941.',
 '/assets/images/question7.jpg'),

('ww2', 'place', 'Which US naval base in Hawaii was attacked by Japan on 7 December 1941?',
 'Pearl Harbor', ARRAY['Pearl Harbour'],
 'The United States declared war on Japan the very next day.',
 '/assets/images/question8.jpg'),

('ww2', 'place', 'From which French port were over 300,000 Allied troops evacuated in May and June 1940?',
 'Dunkirk', ARRAY['Dunkerque'],
 'Hundreds of small civilian boats helped the navy rescue the troops.',
 '/assets/images/question9.jpg'),

('ww2', 'place', 'Which Soviet city was the setting for a huge battle (1942-43) that became a turning point on the Eastern Front?',
 'Stalingrad', ARRAY['Volgograd'],
 'The German 6th Army surrendered there in February 1943.',
 '/assets/images/question10.jpg');