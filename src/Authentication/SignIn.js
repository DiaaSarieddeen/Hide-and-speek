import React from 'react';
import { useState } from 'react';
import { auth ,provider} from '../firebase';
import { signInWithEmailAndPassword ,signInWithPopup} from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import './SignIn.css';
import {useNavigate} from "react-router-dom";
import Chat from "../Chat/Chat"
  const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    



    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    const LogIn = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => { //this function means that we will wait till we get the result so we get back to user credentials
                console.log("successful registration");
            })
            .catch((error) => {
                console.log("There is an error.");
            })
    }

    return (
        <div className='centerDiv'>


            <div className="flip-card">
                <div className='flip-card-inner'>
                    <div className='flip-card-front'>
                        <div className='flip-card-front-content'>
                            <h1>SignIn with Your email</h1>
                            <FontAwesomeIcon icon={faEnvelope} bounce />
                        </div>
                    </div>

                    <div className='flip-card-back'>
                        <div className='flip-card-back-content'>
                            <form className="formContent" onSubmit={LogIn}>
                                <div className='formContent'>
                                    <div className='labelDiv'>
                                        <p>Email:</p>
                                        <p>Password:</p>
                                    </div>

                                    <div className='InputDiv'>
                                        <input type="email" className='Email' placeholder="please enter your email" value={email} onChange={onChangeEmail} />
                                        <input type="password" className='password' placeholder='please enter a password' value={password} onChange={onChangePassword} />
                                    </div>

                                    <div>
                                        <input type="button" value='Sign In' id="submitBtn"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}



export default SignIn;