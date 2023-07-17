import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import Messenger from './pages/Messenger/messenger';
import Login from './pages/Login/Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/home" element={<Home/>} />
      <Route exact path="/messenger" element={<Messenger/>} />
      <Route exact path="/" element={<Login/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
