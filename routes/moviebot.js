const express = require('express')
const axios = require('axios')
const router = express.Router()




router.get('/', (req, res) => {
  res.send('movie bot api');
})

let getQuoteDetails = async (quote) => {
  let res = await axios.get(`http://api.quodb.com/search/${quote}?titles_per_page=1&phrases_per_title=1&page=1`)
  let data = res.data.docs[0]
  return {
    title: data.title,
    title_id: data.title_id,
    phrase_id: data.phrase_id,
    image: `http://static.quodb.com/Covers/${data.image}`,
    phrase: data.phrase
  }
}

let getNextQuoteDetails = async(dt) => {
  let res = await axios.get(`http://api.quodb.com/quotes/${dt.title_id}/${dt.phrase_id}`)
  return res.data.docs[3].phrase
}


router.post('/getNextQuote', (req,res) => {
  let data = {}
  getQuoteDetails(req.body.quote)
    .then(dt => {
      data = dt
      return getNextQuoteDetails(dt)
    })
    .then(dt => {
      data.next_phrase = dt
      res.json(data)
    })
    .catch( er => {
      console.log(er)
      res.json({
        err: true
      })
    })
})

module.exports = router;
