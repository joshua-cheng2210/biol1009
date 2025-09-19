## Project info

# to run
1) npm install
2) npm run dev
3) copy the link and paste it in the browser

## TODO (starting from the most important feature):
- make it so that you can select the quiz you would like to be tested on.
- after selecting the quiz, user will go to the quiz page and the questions will be displayed one by one. answers will be displayed right after the user chose their options. 
- improved the home page layout
- wrong quetions will be asked again in a random order in the set of remaining questions
- after all the questions are answered or the user decided to end the quiz, show some stats
- remove unnecessary code

# TODOs for Joshua (im currently working on scrapping the quiz questions from canvas)
- some questions have images, scrape those images too - done
- provide a unique question number only if the question and the question_image_url are the same - done
- scrape the neutral comments too

<div class="quiz_comment">
<p class="correct_comments">Good work!</p>
<p class="neutral_comments">First, remember that nucleic acid strands bind to each other with
an anti-parallel orientation.&nbsp; In other words, they bind so that the 5’ end of one
strand is hydrogen bonded to the 3’ end of the other strand.&nbsp; Also, remember that U
(for RNA) or T (for DNA) hydrogen bonds with A, and G hydrogen bonds with C.&nbsp; So, you
have:<br>
<br>DNA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
5’ GAGGCTT
3’<br>RNA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
3’ CUCCGAA 5’<br> <br>If you then follow the convention of writing nucleic acid molecules
down starting at their 5’ end, the sequence for the RNA molecule is: 5’ AAGCCUC 3’</p>
</div>
- some answer options have images, scrape those too
- some answer comments have images, scrape those too
- these images are in url form. (and it downloads the img when fetched) - figure out a solution for this
- display those images onto the quiz webite too

# completed TODOs