import SignIn from './Authentication/SignIn';
import SignUp from './Registration/SignUp';
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
