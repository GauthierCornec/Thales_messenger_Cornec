import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import Messenger from './pages/Messenger/messenger';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route exact path="/messenger" element={<Messenger/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
