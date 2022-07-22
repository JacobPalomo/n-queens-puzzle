const path = require('path')
const express = require('express')
const app = express()
const CONSTANTS = require('./utils/constants')

const { PORT } = CONSTANTS

const publicPath = path.resolve(__dirname, 'public')
app.use(express.static(publicPath))

app.get('/', (req, res) => {
	res.status(200).sendFile(path.join(__dirname + '/views/index.view.html'))
})

app.get('/solve', (req, res) => {
	res.status(200).sendFile(
		path.join(__dirname + '/views/chessboard.view.html')
	)
})

app.listen(PORT, () => {
	console.log(`Server si running on http://localhost:${PORT} ...`)
})
