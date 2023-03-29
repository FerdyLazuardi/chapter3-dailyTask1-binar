const express = require('express')
const app = express()
const PORT = 3000;
const fs = require('fs')

app.use(express.json())

const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`))

// url utama
app.get('/', (req, res)=> {
    res.send('Hello world dari server');
})

app.get('/person', (req, res)=> {
    res.status(200).json({
        status : '200',
        data : {
            persons : persons
        }
    })
})

app.get('/person/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find((p) => p.id == id);
    if (!person) {
      return res.status(404).json({
        status: 'error',
        message: 'Person not found',
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        person
      }
    });
  });  

app.get('/person/age/:age', (req, res) => {
  const age = req.params.age;
  const person = persons.find((p) => p.age == age);

  if (person.length == 0) {
    return res.status(404).json({
      status: 'error',
      message: 'Person not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      person
    }
  });
});  

app.get('/person/', (req, res) => {
  const name = req.query.name;
  console.log(name)
  const person = persons.find(el => el.name === name);

 res.status(200).json({
    status: 'success',
    data: {
      person
    }
  });
})

app.delete('/person/:id', (req, res) => {
  const id = req.params.id * 1;

  const index = persons.findIndex(element => element.id === id);
  const person = persons.find(el => el.id === id);

  if (!person) {
      res.status(400).json({
          status: 'failed',
          message: `person dengan id ${id} tersebut invalid/gak ada`
      })
  } 

  if (index !== -1) {
      persons.splice(index, 1);
  }

  fs.writeFile(
      `${__dirname}/person.json`,
      JSON.stringify(persons),
      errr => {
          res.status(200).json({
              status: 'success',
              message: `data dari id ${id} nya berhasil dihapus`
          })
      }
  )
})

app.post('/person', (req, res) => {
    const newId = Math.floor(Math.random() * 1000);
    const newPerson = Object.assign({ id : newId}, req.body)

    persons.push(newPerson);
    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(201).json({
                status : 'success',
                data : {
                    person : newPerson
                }
            })
        }
    )
})

app.put('/person/:id', (req, res) => {
  const id = req.params.id * 1;
  const person = persons.findIndex(el => el.id === id);
  const umur = req.body.age;
  const nama = req.body.name;
  const newPerson = {
    id: id,
    name: req.body.name,
    age: req.body.age
  }

  if (!person) {
    return res.status(404).json({
        status: 'fail',
        message: 'Data tidak ditemukan'
    });
  } else if(umur <= 20){
    return res.status(404).json({
      status : 'fail',
      message : `umur ${req.body.age} tahun belum cukup, minimal 20 tahun`
    })
  } else if(nama == null || umur == null){
    return res.status(404).json({
      status : 'fail',
      message : `nama atau umur belum diisi`
    })
  }

  persons.splice(person, 1, newPerson)

    fs.writeFile(
        `${__dirname}/person.json`,
        JSON.stringify(persons),
        errr => {
            res.status(200).json({
                status: 'success',
                message: `data dari id ${id} nya berhasil diupdate`,
                data: newPerson
            })
        }
    )
});


// memulai server
app.listen(PORT, ()=> {
    console.log(`App running on localhost : ${PORT}`)
})