import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";
import { composeWithDevTools } from 'redux-devtools-extension'
const composeEnhancers = composeWithDevTools({});
const initailStore={
    cartReducer:{
        cartItems:JSON.parse(localStorage.getItem('cartItems')) ??[]
    }
}
export const store = createStore(rootReducer,initailStore, composeEnhancers());