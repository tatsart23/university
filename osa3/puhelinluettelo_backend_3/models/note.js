const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const noteSchema = new mongoose.Schema({
  name: { type: String, minlength:[3, 'Nimen oltava enemmän kuin 3 merkkiä'], required: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Regular Expression for validating phone numbers
        const phoneRegex = /^[0-9]{2,3}-[0-9]{5,}$/
        return phoneRegex.test(value)
      },
      message: (props) =>
        `${props.value} is not a valid phone number. Valid format is XX-XXXXX or XXX-XXXXX.`,
    },
  },
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)