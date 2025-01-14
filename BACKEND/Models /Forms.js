import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    creator: { type: String, required: true }, // user who created the form
    form_title: { type: String }, // Title of the form
    form_description: { type: String }, // Description of the form
    questions: [
        {
            ques_id: { type: String }, // Unique identifier for the question
            question_text: { type: String, required: true }, // The actual question text (e.g., "What is your name?")
            ans_type: { type: String, required: true }, // Type of answer expected (e.g., "Short_answer", "Multiple_choice", "Checkbox", "Linear_scale")
            mcq_options: [ // Only relevant if ans_type is "Multiple_choice"
                {
                    option_id: { type: String },
                    option_text: { type: String }
                }
            ],
            checkbox_options: [ // Only relevant if ans_type is "Checkbox"
                {
                    option_id: { type: String },
                    option_text: { type: String }
                }
            ],
            linear_scale_value: { // Only relevant if ans_type is "Linear_scale"
                from: { type: Number }, // Starting point of the scale (e.g., 1)
                to: { type: Number } // Ending point of the scale (e.g., 5)
            }
        }
    ],
    submissions: [
        {
            user_id: { type: String, required: true }, // Unique identifier for the user who submitted the form
            userEmail: { type: String, required: true }, // get from user authentication
            submissionTime: { type: String, required: true },
            answers: [
                {
                    ques_id: { type: String, required: true }, // Reference to the question ID
                    answer: { type: [String], required: true } // Answer given by the user, could be a string or an array depending on the question type
                }
            ]
        }
    ]
})

const formModel = mongoose.models.form || mongoose.model("form", formSchema)
export default formModel