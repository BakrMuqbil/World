import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

import { parse } from "csv-parse";
const app = express();
const port = 3000;

 let quiz = [];
 const parser=parse({columns: true} , function(err, record){
  console.log(record);
   quiz= record;
});
fs.createReadStream("./capitals.csv" )
  .pipe(parser);


let totalCorrect = 0;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = [];


app.get("/", async (req, res) => {
totalCorrect = 0;
await nextQuestion();
console.log(currentQuestion);
res.render("index.ejs", { question: currentQuestion });
});

app.post("/submit", (req, res) => {
let answer = req.body.answer.trim();
let isCorrect = false;
if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
totalCorrect++;
console.log(totalCorrect);
isCorrect = true;
}

nextQuestion();
res.render("index.ejs", {
question: currentQuestion,
wasCorrect: isCorrect,
totalScore: totalCorrect,
});
});

async function nextQuestion() {
const randomCountry = quiz[Math.floor(Math.random() * quiz.length+1)];

currentQuestion = randomCountry;
}

app.listen(port, () => {
console.log(`Server is running at http://localhost:${port}`);
});