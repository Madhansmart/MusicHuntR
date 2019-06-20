import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore , combineReducers, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';

const musicPlayListReducer = (state={
  audioLists : [],
  currentPlaying : 0,
  lastPlayed : 0,
  defaultPlayIndex : 0,
  songsList : [],
  playIndex : 0,
  isUserActive : false,
  isSongs : false
}, action) => {
    switch(action.type){
        case 'SET_CURRENT':
          state = {
            ...state,
            currentPlaying : action.payload
          }
          break;
        case 'SET_PLAYLIST':
          state = {
            ...state,
            audioLists : [...state.audioLists,action.payload],
            isSongs : false
          }
          break;
        case 'SET_LAST_PLAYED':
          state = {
            ...state,
            lastPlayed : action.payload
          }
          break;
        case 'SET_SONGSLIST':
          state = {
            ...state,
            songsList : [{...action.payload}],
            isSongs : true
          }
          break;
        case 'SET_USER_ACTIVE':
          state = {
            ...state,
            isSongs : action.payload
          }
         break;
        default :
          state  = {
            ...state            
          }
          break;
    }
    return state;
}


const myLogger = (state) => (next) => (action) => {
  console.log("Logged Action", action);
  next(action);
}
const store = createStore(combineReducers({musicPlayListReducer}), {}, applyMiddleware(myLogger));

store.subscribe(() => {
  console.log("Updated Store" , store.getState());
})

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
