import { combineReducers } from 'redux';
import cartReducer from './CartReducer';


const rootReducer = combineReducers({
  counter: cartReducer // `counter` is the key you're using in `useSelector`
});

export default rootReducer;
