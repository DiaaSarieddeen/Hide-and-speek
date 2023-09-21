import SignIn from './Authentication/SignIn';
import SignUp from './Registration/SignUp';
import { signInWithGoogle } from './Authentication/SignInWithGoogle';
import { LoginRegisterGoogle } from './Chat/LoginRegister';
import { Chat } from './Chat/Chat';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<LoginRegisterGoogle />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
