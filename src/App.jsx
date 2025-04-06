import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './componets/home/Home'
import Header from './componets/header/Header'
import Product from './componets/product/Product'
import SignUp from './componets/Authentication/SignUp'
import LogIn from './componets/Authentication/LogIn'
import CartDetails from './componets/Cart/CartDetails'
import SearchResults from './componets/header/SearchResults'



function App() {


  return (
    <>

      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/product/:id' element={<Product/>} />
          <Route path='/SignUp' element={<SignUp/>}/>
          <Route path='/login' element={<LogIn/>}/>
          <Route path="/cartDetails" element={<CartDetails />} />
          <Route path='/search/:query' element={<SearchResults/>} />
        </Routes>
      </BrowserRouter>
   
    </>
  )
}

export default App
