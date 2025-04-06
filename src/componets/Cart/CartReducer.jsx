const initialState = 0;

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADDTOCART":
      return action.payload; // just a number (cart count)
    default:
      return state;
  }
};

export default cartReducer;
