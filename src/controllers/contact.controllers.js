import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios"

const handleContactMeForm = asyncHandler(async (req, res) => {

    // add the validations later

    const {name, email,message} = req.body


    
    return res.status(201).json(new ApiResponse(201,{}, "I have got your details"))
})