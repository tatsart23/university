import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationProvider, useNotification } from './NotificationContext';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

const fetchAnecdotes = async () => {
  const response = await fetch('http://localhost:3001/anecdotes');
  if (!response.ok) {
    throw new Error('Anekdoottien hakeminen epäonnistui');
  }
  return response.json();
};

// Sovelluksen pääkomponentti
const App = () => {
  const { showNotification } = useNotification();  // Notifikaation näyttämisen logiikka

  const queryClient = useQueryClient();

  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: fetchAnecdotes,
    retry: false,
  });

  const voteAnecdote = async (id) => {
    const response = await fetch(`http://localhost:3001/anecdotes/${id}`);
    if (!response.ok) throw new Error('Äänestys epäonnistui');
    const anecdote = await response.json();
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const updateResponse = await fetch(`http://localhost:3001/anecdotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAnecdote),
    });
    if (!updateResponse.ok) throw new Error('Äänestys epäonnistui');
    return updateResponse.json();
  };

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes) =>
        oldAnecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      );
      showNotification(`Anekdoottia äänestettiin!`);
    },
  });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error in server</div>;

  return (
    <div>
      <h3>Anecdotes</h3>
      <Notification />
      <AnecdoteForm showNotification={showNotification} />
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => voteMutation.mutate(anecdote.id)}>Vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AppWrapper() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}
