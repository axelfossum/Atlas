import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AuthOptions(){
    const { userData, setUserData } = useContext(UserContext);

    const history = useHistory();

    const register = () => { history.push('/register'); }
    const login = () => { history.push('/login'); }
    const logout = () => {
        setUserData({
            token: undefined,
            user: undefined
        });
        localStorage.setItem('auth-token', ''); 
    };

    return (
        <div>
            {userData.user ? (
                <button type="button" onClick={logout} className="btn px-4 btn-purple">Sign out</button> 
                ) : (
                    <>
                    <button type="button" onClick={login} className="btn px-4 btn-purple">Sign in</button>
                    <button type="button" onClick={register} className="btn px-4 btn-outline-secondary ml-2">Register</button>
                    </>
                )
            }
        </div>
    );
}