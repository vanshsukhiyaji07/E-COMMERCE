export  const SET_CART_ITEM = "SET_CART_ITEM";

const addtocart = (count) => {
    return {
      type: "ADDTOCART",
      payload: count // cart count number
    };
  };
  
  export default addtocart;
  
  