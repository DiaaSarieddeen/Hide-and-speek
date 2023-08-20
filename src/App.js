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
      <h1>{localStorage.getItem("name")}</h1>
      <h1>{localStorage.getItem("email")}</h1>
      <img src={localStorage.getItem("profile")}/>
      </div>
      <div>
        <SignUp />
      </div>
    </div>
  );
}

export default App;
