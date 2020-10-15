  
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])


  useEffect(() => {

    axios.get(baseUrl)
        .then(res => {
          res.found = true
          console.log('res efect ',res)
         setResources(res.data)})
  },
  [baseUrl])



  const create = async (resource) => {

    const response = await axios.post(baseUrl, resource)
    const resourcesCopy = resources
    resourcesCopy.push(response.data)
    setResources(resourcesCopy)
    console.log('lisäötty ', resources)

    return resources

  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}



const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  let [notes, noteService] = useResource('http://localhost:3005/notes')
  let [persons, personService] = useResource('http://localhost:3005/persons')

  console.log('notes ',notes)
  
  console.log('persons ',persons)

  const handleNoteSubmit = async (event) => {
    event.preventDefault()
    notes = await noteService.create({ content: content.value })
    window.location.reload(false)
  }
 
  const handlePersonSubmit = async (event) => {
    event.preventDefault()
    persons = await personService.create({ name: name.value, number: number.value})
    window.location.reload(false)
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App