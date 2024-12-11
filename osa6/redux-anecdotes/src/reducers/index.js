import { combineReducers } from 'redux';
import anecdotesReducer from './anecdoteReducer';
import filterReducer from './filterReducer';

const rootReducer = combineReducers({
  anecdotes: anecdotesReducer,
  filter: filterReducer
});

export default rootReducer;
