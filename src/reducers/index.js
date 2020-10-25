import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth from './auth';

//redux form is a library for helping us manage state of our 
//form component without creating any actions or reducer
export default combineReducers({
  auth,
  form: formReducer
});
