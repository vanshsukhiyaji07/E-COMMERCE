import { createStore } from 'redux';
import rootReducer from '../Cart/RootReducer';


const store = createStore(rootReducer);

export default store;
