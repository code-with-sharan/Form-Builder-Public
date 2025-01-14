import express from 'express'
import { createNewForm, saveForm, backFromEditForm, sendQuesDataToFrontend, saveResponse, getAllFormsId_Title_Desc, deleteForm, getUserEmailAndSubmTime, getQnAdata, checkIfFormSaved } from '../Controllers/formControllers.js'

const fromRouter = express.Router()

fromRouter.post("/createNew", createNewForm)
fromRouter.post("/saveForm", saveForm)
fromRouter.post("/backFromEditForm", backFromEditForm)
fromRouter.post("/getQuesData", sendQuesDataToFrontend)
fromRouter.post("/submitResponse", saveResponse)
fromRouter.post("/getAllFormsData", getAllFormsId_Title_Desc)
fromRouter.post("/deleteForm", deleteForm)
fromRouter.post("/getUserEmailAndSubmTime", getUserEmailAndSubmTime)
fromRouter.post("/getQnAdata", getQnAdata)
fromRouter.post("/checkIfFormSaved", checkIfFormSaved)

export default fromRouter