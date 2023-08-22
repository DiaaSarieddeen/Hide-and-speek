import SignIn from './Authentication/SignIn';
import SignUp from './Registration/SignUp';
import {signInWithGoogle} from './Authentication/SignInWithGoogle';


import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App" >
      <div>
        <SignIn/>
      </div>
      <button onClick={signInWithGoogle}>Sign with Google</button>
      <div>
        <SignUp />
      </div>
    </div>
  );
}

export default App;
