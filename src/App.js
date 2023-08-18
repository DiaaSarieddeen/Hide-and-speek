import SignIn from './Authentication/SignIn';
import SignUp from './Registration/SignUp';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App" >
      <div>
        <SignIn />
      </div>
      <div>
        <SignUp />
      </div>
    </div>
  );
}

export default App;
