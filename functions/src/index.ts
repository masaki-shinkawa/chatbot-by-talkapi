import * as functions from 'firebase-functions'
import axios, { AxiosResponse } from 'axios'

interface ITalkAPIResult {
  perplexity: number
  reply: string
}

interface ITalkAPIResponse {
  status: number
  message: string
  results: ITalkAPIResult[]
}

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const baseUrl = 'https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk'
const apikey = 'DZZiPHUZSLoE1MsIDf5mjGGW8VSgDfjQ'

export const talkapi = functions.https.onRequest(async (request, response) => {
  functions.logger.info(request.body.message, { structuredData: true })
  const data = new URLSearchParams()
  data.append('apikey', apikey)
  data.append('query', request.body.message)
  const res: AxiosResponse<ITalkAPIResponse> = await axios
    .post(baseUrl, data)
    .catch((e) => e)
  functions.logger.info(res, { structuredData: true })
  response.set(
    'Access-Control-Allow-Origin',
    'https://chatbot-by-talkapi-nuxt.web.app'
  )
  response.set('Access-Control-Allow-Methods', 'HEAD, OPTIONS, POST')
  response.set('Access-Control-Allow-Headers', 'Content-Type, authorization')
  response.send(res.data)
})
