require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  
app.use(express.json())
  
app.use(requestLogger)

app.use(cors())

app.use(express.static('build'))


//route to root of web page
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

//route to all notes
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//route to individual note
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

//delete request
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

//generate id for note
// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id))
//         : 0
//     return maxId + 1
// }

//add new note
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note ({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })
    
    note.save().then(savedNote => {
      response.json(savedNote)
    })
  })


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})