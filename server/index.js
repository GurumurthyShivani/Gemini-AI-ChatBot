let express = require("express")
let cors = require("cors")
require("dotenv").config()
let{GoogleGenerativeAI} = require("@google/generative-ai")
let App = express()
App.use(cors()) //Middlware
App.use(express.json())


let genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
let model = genAI.getGenerativeModel({model:"gemini-1.5-flash"})

App.post('/ask' , 
    async (req,res)=>{
    try{
        let{question} = req.body
        let data= await model.generateContent(question)
        let finalData = data.response.text()
        res.send({
            _status:true,
            _message:"Content found.."  ,
            finalData
        })
    }catch (error) {
        if (error.status === 429) {
            res.status(429).send({
                _status: false,
                _message: "Rate limit exceeded. Please wait and try again."
            })
        } else {
            res.status(500).send({ _status: false, _message: "Something went wrong" })
        }
    }
    
})



App.listen(process.env.PORT,() => {
    console.log("server started");
})