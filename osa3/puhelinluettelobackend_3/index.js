require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

require('express-async-errors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :response-body'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.get('/api/persons', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body

    if (!name || !number) {
      return res.status(400).json({ error: 'Name or number is missing' })
    }

    const existingNote = await Note.findOne({ name })
    if (existingNote) {
      return res.status(400).json({ error: 'Name must be unique' })
    }

    const note = new Note({ name, number })
    const savedNote = await note.save()
    res.status(201).json(savedNote)
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message })
    } else {
      next(error)
    }
  }
})



app.delete('/api/persons/:id', async (req, res) => {
  const { id } = req.params

  const deletedNote = await Note.findByIdAndDelete(id)
  if (!deletedNote) {
    throw new Error('Person not found')
  }

  res.status(204).end()
})

app.put('/api/persons/:id', async (req, res, next) => {
  const { id } = req.params
  const { number } = req.body

  if (!number) {
    return res.status(400).json({ error: 'Number is missing' })
  }

  try {
    const updatedPerson = await Note.findByIdAndUpdate(
      id,
      { number },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedPerson) {
      return res.status(404).json({ error: 'Person not found' })
    }

    res.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res) => {
  const { id } = req.params
  const person = await Note.findById(id)
  if (!person) {
    return res.status(404).json({ error: 'Person not found' })
  }
  res.json(person)
})

const errorHandler = (error, req, res) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Malformatted ID',
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message,
    })
  }

  return res.status(500).json({
    error: 'Something went wrong on the server',
  })
}

app.use(errorHandler)

morgan.token('body', (req) => JSON.stringify(req.body))

morgan.token('response-body', (req, res) => {
  let oldSend = res.send
  res.send = function (data) {
    res.locals.body = data
    oldSend.apply(res, arguments)
  }
  return res.locals.body
})
