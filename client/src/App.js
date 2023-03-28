
import './App.css';
import { Route, Routes } from 'react-router-dom';
import PrivatesRoutes from "./utils/PrivateRoutes"
import Home from "./pages/Home"
import Chats from "./pages/Chats"
function App() {

  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<Home />} ></Route>
        <Route element={<PrivatesRoutes />}>
          <Route path='/chats' element={<Chats />}></Route>
        </Route>
      </Routes>
    </div>

  );
}
export default App;
