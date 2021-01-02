import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';
import '../styles/custom.css';
import accountImg from '../styles/img/user.svg';

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
        history.push('/');
    };
    const account = () => { history.push('/account'); }

    return (
        <div>
            {userData.user ? (
                <>
                <button type="button" onClick={account} className="btn btn-outline-secondary account-btn">
                    <img src={accountImg} width="20" height="20" alt="" className="mx-2 account-icon"></img>
                </button>
                <button type="button" onClick={logout} className="btn px-4 btn-purple ml-3">Sign out</button> 
                </>
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