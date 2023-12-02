
import './App.css'
import Editor from './components/Editor'
import {Navigate, Route,BrowserRouter as Router, Routes} from 'react-router-dom'
import {v4 as uuid} from 'uuid'
function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`}/>} />
        <Route path="/docs/:id" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App
