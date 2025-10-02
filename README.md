## Project info

# to run
1) npm install
2) npm run dev
3) copy the link and paste it in the browser

## TODO (starting from the most important feature):
- reconfigure the quiz question to get it from the "study_quiz_processed_questions_db.json"
- wrong questions will be asked again in a random order in the set of remaining questions

# TODOs for Joshua (im currently working on scrapping the quiz questions from canvas)
- scrape the neutral comments, which may include images, for the questions' options too
- don't clean the text of the neutral comments?
- processed the quiz question by the study quizes and process by topics

--> typical example: https://canvas.umn.edu/courses/511424/quizzes/1055567/history?version=3 (SQ topic 3 level 2 attempt 3, question 9)

quiz_title: 
SQ topic 3 level 2 (Chapter 4): BIOL 1009 (070-082) General Biology (Fall 2025)_3

- these images are in url form. (and it downloads the img when fetched) - figure out a solution for this
- display those images onto the quiz webite too
