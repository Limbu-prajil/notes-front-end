import React from 'react'
import Note from './Note'
import noteService from './services/notes'
import Notification from './Notification'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      newNote: '',
      showAll: true,
      error: ''
    }
    console.log('constructor')
  }
  componentDidMount() {
    console.log('did mount')
    noteService
      .read()
      .then(notes => { //The module would be more convenient to use if it returned an array including the notes instead of an HTTP response.
        console.log('promise fulfilled')
        this.setState({ notes }) //{ notes: notes }
      })
      .catch(error => {
        this.setState({
          error: `Note unfortunately not found from serverr.`
        })
        setTimeout(() => {
          this.setState({error: null})
        }, 3000)
      })
  }
  addNote = (event) => {
    console.log('make note');
    event.preventDefault()
    const noteObject = {
      content: this.state.newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }
    noteService
      .create(noteObject)
      .then(newNoteObj => {
        console.log('Posted note.');
        this.setState({
          notes: this.state.notes.concat(newNoteObj),
          newNote: ''
        })
      })
      .catch(error => {
        this.setState({
          error: `Note '${noteObject.content}' have been already unfortunately added to server.`,
          notes: this.state.notes
        })
        setTimeout(() => {
          this.setState({error: null})
        }, 3000)
      })
  }
  handleNoteChange = (event) => {
    this.setState({ newNote: event.target.value })
  }
  toggleVisible = () => {
    this.setState({ showAll: !this.state.showAll })
  }
  toggleImportanceOf = (idd) => {
    return () => {
      const note = this.state.notes.find(n => n.id === idd)
      const changedNote = { ...note, important: !note.important }
      noteService
        .update(idd, changedNote)
        .then(changedNote => {
          /*this.setState({
          notes: this.state.notes.map(note => note.id !== idd ? note : changedNote)
          })*/
          const notes = this.state.notes.filter(n => n.id !== idd)
          this.setState({
            notes: notes.concat(changedNote)
          })
        })
        .catch(error => {
          this.setState({
            error: `Note '${note.content}' have been already unfortunately removed from server.`,
            notes: this.state.notes.filter(n => n.id !== idd)
          })
          setTimeout(() => {
            this.setState({error: null})
          }, 3000)
        })
    }
  }
  render() {
    const notesToShow = this.state.showAll ? this.state.notes : this.state.notes.filter(note => note.important === true)
    const label = this.state.showAll ? 'Only important' : 'All'
    console.log('render')
    return (
      <div>
        <h1>Notes</h1>
        <Notification message={this.state.error}/>
        <div>
          <button onClick={this.toggleVisible}>
            Show {label}
          </button>
        </div>
        <ul>
          {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={this.toggleImportanceOf(note.id)}/>)}
        </ul>
        <form onSubmit={this.addNote}>
          <input value={this.state.newNote} onChange={this.handleNoteChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}
export default App;
