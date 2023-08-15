import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Signup.css';
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const Register = (event) => {
        event.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const email1 = document.getElementById("emailInput").value;
                const email2 = document.getElementById("emailInputConfirmation").value;
                const pass1 = document.getElementById("passwordInput").value;
                const pass2 = document.getElementById("passwordInputConfirmation").value;
                if (email1 === email2 && pass1 === pass2) {

                    window.alert("User is successfully created.");
                }
                else if (email1 !== email2 && pass1 === pass2) {
                    window.alert("Email doesn't match.");
                }
                else if (pass1 !== pass2 && email1 === email2) {
                    window.alert("Password doesn't match.");
                }
                else {
                    window.alert("Email and Password don't match.");
                }

            })
            .catch((error) => {
                console.log("Can't create user.", error);
            })
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <>
            <div className="flip-card">
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className='flip-card-front-content'>
                            <h1>Don't have An Account? Create One.</h1>
                            <FontAwesomeIcon icon={faUserPlus} fade />
                        </div>
                    </div>

                    <div className="flip-card-back">
                        <form onSubmit={Register} method="POST">
                            <div className="labels">
                                <p>Email:</p>
                                <p>Confirm Email:</p>
                                <p>Password:</p>
                                <p>Confirm Password:</p>
                            </div>

                            <div className="InputFields">
                                <input type="email" placeholder="Please enter your email" value={email} id="emailInput"
                                    onChange={onChangeEmail} aria-required="true" required></input>
                                <input type="email" placeholder="Please confirm your email" id="emailInputConfirmation" aria-required="true" required></input>
                                <input type="password" placeholder="Please enter a password" value={password}
                                    onChange={onChangePassword} id="passwordInput" aria-required="true" required></input>
                                <input type="password" placeholder="Please confirm your password" id="passwordInputConfirmation" aria-required="true" required></input>
                            </div>


                            <button type="submit" id="submitButton">Sign up</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;