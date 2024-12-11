import PropTypes from 'prop-types';

const AnecdoteForm = ({ showNotification }) => {
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;

    if (content.length < 5) {
      showNotification('Anekdootin sisällön tulee olla vähintään 5 merkkiä pitkä.');
      return;
    }

    fetch('http://localhost:3001/anecdotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, votes: 0 }),
    })
      .then((res) => res.json())
      .then((newAnecdote) => {
        showNotification(`Uusi anekdootti lisätty: ${newAnecdote.content}`);
        event.target.anecdote.value = '';
      })
      .catch(() => showNotification('Anekdootin lisäys epäonnistui.'));
  };

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

AnecdoteForm.propTypes = {
  showNotification: PropTypes.func.isRequired,
};

export default AnecdoteForm;
