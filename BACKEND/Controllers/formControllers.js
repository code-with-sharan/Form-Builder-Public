import formModel from "../Models /Forms.js"
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs for each question
import jwt from 'jsonwebtoken';

const getUserIdFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
}

const createNewForm = async (req, res) => {
    const newForm = new formModel({ creator: getUserIdFromToken(req) })
    newForm.save()

    try {
        res.json({ success: true, message: "Form created", data: newForm._id });
    } catch (error) {
        res.json({ success: false, message: "Error creating form" });
    }
}

const saveForm = async (req, res) => { // Edit Form
    try {
        const { formId } = req.body; // Get formId from request params
        const userId = getUserIdFromToken(req)
        const quesArray = req.body.question
        const { formTitle, formDescription } = req.body.fromHeaders

        const updatedForm = await formModel.findByIdAndUpdate(
            formId,
            {
                creator: userId,
                form_title: formTitle || "Untitled",
                form_description: formDescription,
                questions: []
            },
            { new: true } // Return the updated document
        )

        quesArray.forEach((object) => {
            const questionData = {
                ques_id: uuidv4(), // Generate a unique ID for the question
                question_text: object.question_text,
                ans_type: object.ans_type,
                mcq_options: [],
                checkbox_options: [],
                linear_scale_value: {}
            };

            if (object.ans_type === "Multiple_choice") {
                questionData.mcq_options = object.mcq_options.map((option, index) => ({
                    option_id: uuidv4(),
                    option_text: option.option_text
                }))
            }

            if (object.ans_type === "Checkboxes") {
                questionData.checkbox_options = object.checkbox_options.map((option) => ({
                    option_id: uuidv4(),
                    option_text: option.option_text
                }))
            }

            if (object.ans_type === "Linear_scale") {
                questionData.linear_scale_value = {
                    from: object.linear_scale_value.from,
                    to: object.linear_scale_value.to
                }
            }

            updatedForm.questions.push(questionData);
        })

        await updatedForm.save();

        res.json({ success: true, message: "Form saved successfully", data: updatedForm._id });
    } catch (error) {
        console.error('Error details:', error);
        res.json({ success: false, message: "Error saving form" });
    }
}

const backFromEditForm = async (req, res) => {
    try {
        const { formId } = req.body; // Get formId from request params
        const { formTitle, formDescription } = req.body.fromHeaders

        const updatedForm = await formModel.findByIdAndUpdate(
            formId,
            {
                form_title: formTitle,
                form_description: formDescription,
            },
            { new: true } // Return the updated document
        )

        await updatedForm.save();

        res.json({ success: true, message: "Title and description saved successfully" });
    } catch (error) {
        console.error('Error details:', error);
        res.json({ success: false, message: "Error saving form" });
    }
}

const sendQuesDataToFrontend = async (req, res) => {
    const { formId } = req.body
    try {
        let formTitle, formDescription, questionArr;
        const form = await formModel.findById(formId)
        if (!form) {
            res.json({ success: false, message: "No form found with this id" });
        } else {    
            formTitle = form.form_title
            formDescription = form.form_description
            questionArr = form.questions
            res.json({ success: true, message: "Data sent to frontend successfully", formTitle, formDescription, questionArr });
        }
    } catch (error) {
        res.json({ success: false, message: "Error sending data" });
    }
}

const saveResponse = async (req, res) => {
    try {
        const { formId } = req.body
        const { answer, email } = req.body.data

        // check if the email is already present in the submissions array
        const form = await formModel.findById(formId);
        const isEmailPresent = form.submissions.some(submission => submission.userEmail === email);
        if (isEmailPresent) {
            res.json({ success: false, message: "You have already submitted the form" });
            return;
        }

        const now = new Date();
        const submissionTimeAndDate = now.toLocaleString();

        const submissionData = {
            user_id: getUserIdFromToken(req),
            userEmail: email,
            submissionTime: submissionTimeAndDate,
            answers: answer.map((ans) => ({
                ques_id: ans.ques_id,
                answer: ((ans.answer !== "") ? ans.answer : "No answer")
            }))
        }

        form.submissions.push(submissionData);
        await form.save();

        res.json({ success: true, message: "Your response has been submitted" });
    } catch (error) {
        console.error("Error saving form:", error)
        res.json({ success: false, message: "Error submititng response!" });
    }
}

const getAllFormsId_Title_Desc = async (req, res) => {
    try {
        let formData = []

        const userId = getUserIdFromToken(req); // Get user ID from token
        if (!userId) {
            return res.json({ success: false, message: "No token provided or invalid token" });
        }

        const forms = await formModel.find({ creator: userId });
        if (forms.length === 0) {
            return res.json({ success: false, message: "No forms found" });
        } else {
            forms.forEach((form) => {
                formData.push({ title: form.form_title, description: form.form_description, formId: form._id, submission: form.submissions });
            });
        }

        res.json({ success: true, message: "Data fetched successfully", data: formData });
    } catch (error) {
        console.error("Error occured:", error)
        res.json({ success: false, message: "Error fetching data" });
    }
}

const deleteForm = async (req, res) => {
    try {
        const formId = req.body.formId
        await formModel.findByIdAndDelete(formId)

        res.json({ success: true, message: "Form deleted successfully" });
    } catch (error) {
        console.error("Error occured:", error)
        res.json({ success: false, message: "Error deleting from" });
    }
}

const getUserEmailAndSubmTime = async (req, res) => {
    try {
        const { formId } = req.body
        let userData = []
        const form = await formModel.findById(formId);

        form.submissions.forEach((submission) => {
            const data = {
                email: submission.userEmail,
                timeAndDate: submission.submissionTime,
                userId: submission.user_id
            }
            userData.push(data)
        })

        res.json({ success: true, message: "Data sending...", userData });

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: "Error sending data" });
    }
}

const getQnAdata = async (req, res) => {
    try {
        const { formId, userId } = req.body
        const qnaArr = []
        const form = await formModel.findById(formId);

        if (!form) {
            return res.json({ success: false, message: "Form not found" });
        }

        const formTitle = form.form_title
        const formDescription = form.form_description

        // to find the response of a particular user
        const userResponse = form.submissions.find(submission => submission.user_id === userId);
        
        if (!userResponse) {
            return res.json({ success: false, message: "User response not found" });
        }

        const submTime = userResponse.submissionTime
        const email = userResponse.userEmail

        userResponse.answers.forEach((ans) => {
            const question = form.questions.find(ques => ans.ques_id === ques.ques_id);
            
            if (!question) {
                throw new Error(`Question not found for ID: ${ans.ques_id}`);
            }

            const data = {
                question: question.question_text,
                answer: [...ans.answer] // Create a copy of the answer array
            }
            qnaArr.push(data)
        })

        res.json({ success: true, message: "QnA data sending...", submTime, qnaArr, email, formTitle, formDescription });
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: "Error sending data" });
    }
}

const checkIfFormSaved = async (req, res) => {

    try {
        const { formId } = req.body
        const form = await formModel.findById(formId);
        let isFormSavedAtleastOnce = false

        if (form.__v > 0) {
            isFormSavedAtleastOnce = true
        }

        res.json({ success: true, message: "Version fetched", isFormSavedAtleastOnce });
    } catch (error) {
        res.json({ success: false, message: "Error fetching version" });
    }
}

export { createNewForm, saveForm, backFromEditForm, sendQuesDataToFrontend, saveResponse, getAllFormsId_Title_Desc, deleteForm, getUserEmailAndSubmTime, getQnAdata, checkIfFormSaved }