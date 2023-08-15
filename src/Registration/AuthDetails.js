import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const AuthDetails = () => {
    const [Authuser, setUser] = useState(null);

    useEffect = (() => {
        const authUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(authUser);
            }
            else {
                setUser(null);
            }

        })
    });

    return (
        <>
            {
                <div> Authuser ?<> "signed in"</>:<>Signed out</></div>
            }
        </>
    )
}