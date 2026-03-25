import { useState } from 'react'
import './App.css'
import axios from 'axios'
import ReactMarkdown from "react-markdown";
import Loading from './Loading'

function App() {
  let [loadingStatus, setLoadingStatus] = useState(false)
  let [question, setQuestion] = useState()
  let [data, setData] = useState("")

  let handleSubmit = (e) => {
    e.preventDefault()     //will not refresh the page
    setLoadingStatus(true)

    axios.post(`https://gemini-ai-chatbot-backend-qetz.onrender.com`, { question })
      .then((res) => res.data)
      .then((finalRes) => {
        console.log(finalRes);
        if (finalRes._status) {
          setData(finalRes.finalData)
        }
        else {
          setData(finalRes._message) // shows "Rate limit exceeded"
        }
      })
      .catch((err) => {
        if (err.response?.status === 429) {
          setData("⚠️ Too many requests. Please wait a moment and try again.")
        }
      })
      .finally(() => setLoadingStatus(false))
  }


  return (
    <> 
      <div className='sm:w-auto  mt-10 ml-50 lg:w-[800px]'>
        <div className='h-[60px] border-1 text-white bg-cyan-700 font-bold text-3xl mb-4'><p className='mt-2'>Gemini AI ChatBot</p></div>


        <div className='max-w-[1320px] border-cyan-950 border-1 mx-auto grid  grid-cols-[30%_auto] gap-5 p-5'>

          <form onSubmit={handleSubmit} action="" className='shadow-lg p-4'>

            <textarea placeholder='Enter your question' onChange={(e) => setQuestion(e.target.value)} className='w-[100%] h-[200px] p-3 border-1 '></textarea>

            <button className='bg-cyan-700 text-white w-[100%] py-2 rounded-2xl cursor-pointer'>Generate</button>

          </form>

          <div className='border-l-1 border-[#ccc]'>
            <div className='h-[300px] text-left overflow-scroll overflow-x-hidden p-3'>
              {loadingStatus ? <Loading /> : <ReactMarkdown>{data}</ReactMarkdown>}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
