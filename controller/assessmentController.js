const Assessment = require("../model/assessment");

async function addNewQuestion(req, res) {
   try {
      console.log(req.body);
      const { ageGroup, quesCategory, question } = req.body;

      const { structure, questionText, questionType, answerImage, questionImage, questionSound, questionSoundText, questionOnlyText, totalOptions, option, correctAnswer } = question;

      requireQuesFields = { structure, questionText, answerImage, questionType, questionImage, questionSound, questionSoundText, questionOnlyText, totalOptions, option, correctAnswer };

      const quest = await Assessment.create({ ageGroup, quesCategory, question: requireQuesFields });

      res.status(200).json({
         message: "Success",
         question: quest
      })
   }
   catch (error) {
      console.log(error.errors);
      res.status(404).json({ message: "Fail in adding question", error: error.errors });
   }
}

async function getAll(req, res) {
   try {
      const allQuestions = await Assessment.find().populate('quesCategory', 'categoryName totalQuestions');
      allQuestions.sort((a, b) => {
         if (a.quesCategory.categoryName < b.quesCategory.categoryName) return -1;
         if (a.quesCategory.categoryName > b.quesCategory.categoryName) return 1;
         return 0;
      });
      if (allQuestions.length === 0) res.status(201).json({ message: "No questions found." })
      else {
         res.status(200).json({ message: "Success", questions: allQuestions });
      }
   }
   catch (error) {
      console.log(error.errors);
      res.status(404).json({ message: "Fail in fetching question age wise / common", error: error.errors });
   }
}

async function getQuestionById(req, res) {
   try {
      const { id } = req.params;
      const question = await Assessment.findById(id);
      if (!question) res.status(201).json({ message: "No question found." })
      else {
         res.status(200).json({ message: "Success", questions: question });
      }
   }
   catch (error) {
      console.log(error.errors);
      res.status(404).json({ message: "Fail in fetching question age wise / common", error: error.errors });
   }
}

async function getQuestionAgeWise(req, res) {
   try {
      const { ageGroup } = req.body;
      // let ageGroup = "common";
      const response = [];
      const ageQuestions = await Assessment.find({ ageGroup }).populate('quesCategory', 'categoryName');

      // const ageQuestions = await Assessment.find({ ageGroup, quesCategory: "Task 5 (Sorting) - Big Small" });
      // const age = await Assessment.find({ ageGroup, quesCategory: "Task 6 (Egg Farm Task)" });
      if (ageGroup !== "common") {
         const commonQuestions = await Assessment.find({ ageGroup: "common" }).populate('quesCategory', 'categoryName');
         if (ageQuestions.length === 0 && commonQuestions.length === 0) res.status(201).json({ message: "No questions for this age group." })
         else {
            response.push(...commonQuestions);
            response.push(...ageQuestions);
            response.sort((a, b) => {
               if (a.quesCategory.categoryName < b.quesCategory.categoryName) return -1;
               if (a.quesCategory.categoryName > b.quesCategory.categoryName) return 1;
               return 0;
            });

            // res.status(200).json({ message: "Success", questions: [...ageQuestions] });
            res.status(200).json({ message: "Success", questions: response });
         }
      }
      else {
         if (ageQuestions.length === 0) res.status(201).json({ message: "No questions for this age group." })
         else {
            response.push(ageQuestions);
            response.sort((a, b) => {
               if (a.quesCategory.categoryName < b.quesCategory.categoryName) return -1;
               if (a.quesCategory.categoryName > b.quesCategory.categoryName) return 1;
               return 0;
            });
            res.status(200).json({ message: "Success", questions: response });
         }
      }
   }
   catch (error) {
      console.log(error);
      res.status(404).json({ message: "Fail in fetching question age wise / common", error });
   }
}

async function deleteQuestion(req, res) {
   try {
      const { id } = req.params;
      const question = await Assessment.findByIdAndDelete(id);
      res.status(200).json({ message: "Deleted Successfully", question });
   } catch (error) {
      console.log(error.errors);
      res.status(404).json({ message: "Fail in deleting question", error: error.errors });
   }
}

module.exports = { addNewQuestion, getQuestionAgeWise, getAll, deleteQuestion, getQuestionById }