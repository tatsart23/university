import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import AnecdoteList from "./components/AnecdoteList";
import Menu from "./components/Menu";
import About from "./components/About";
import Createnew from "./components/Createnew";
import Anecdote from "./components/Anecdote";


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        {notification && <div style={{ border: "1px solid green", padding: "10px", marginBottom: "10px" }}>{notification}</div>}
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<Createnew addNew={addNew} setNotification={setNotification} />} />
          <Route path="/anecdote/:id" element={<Anecdote anecdotes={anecdotes} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;