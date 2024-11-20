const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://Sartovuo:${password}@cluster0.fgrwr.mongodb.net/fullstack-open?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Note = mongoose.model('Note', noteSchema)

/*const note = new Note({
  name,
  number,
})*/

if (process.argv.length < 4) {
    console.log('phonebook:')
    Note.find({}).then(result => {
      result.forEach(note => {
        console.log(`${note.name} ${note.number}`)
      })
      mongoose.connection.close()
    })
  } else {
    const name = process.argv[3]
    const number = process.argv[4]
  
    const note = new Note({
      name: name,
      number: number,
    })
  
    note.save().then(result => {
      console.log('added ' + name + ' number ' + number + ' to phonebook')
      mongoose.connection.close()
    })
  }
  
/*note.save().then(result => {
  console.log('added ' + name + ' number ' + number + ' to phonebook')
  mongoose.connection.close()
})

Note.find({}).then(result => {
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
});*/