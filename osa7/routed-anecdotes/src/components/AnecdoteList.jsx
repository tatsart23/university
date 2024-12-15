import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AnecdoteList = ({ anecdotes }) => {
  const navigate = useNavigate();
  

  const viewMore = (id) => {
    console.log('view', id);
    navigate(`/anecdote/${id}`);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            {anecdote.content} <button onClick={() => viewMore(anecdote.id)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define prop types
AnecdoteList.propTypes = {
  anecdotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      content: PropTypes.string.isRequired,
    })
  ),
};


export default AnecdoteList;
