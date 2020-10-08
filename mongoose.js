const mongoose = require('mongoose')


if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
  
  const password = process.argv[2]
  
  const url =
    `mongodb+srv://fullstack:${password}@cluster0.1xcb0.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  function displayPersons(){
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
  }
  
  function createPerson(name, number){
    const person = new Person({
      name: name,
      number: number,
    })
    
    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })
  }

  if(process.argv.length < 4){
    displayPersons();
  }

  if(process.argv.length > 4){
    createPerson(process.argv[3], process.argv[4]);
  }
  