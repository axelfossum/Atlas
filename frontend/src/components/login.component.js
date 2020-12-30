import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import '../styles/custom.css';
import axios from 'axios';
import UserContext from '../context/UserContext';
import ErrorNotice from "./error-notice.component";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const onSubmit = async (e) => {
        try{
            e.preventDefault();

            const loginUser = {email, password};

            const loginRes = await axios.post('http://localhost:5000/user/login/', loginUser);
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user
            });
            localStorage.setItem('auth-token', loginRes.data.token);
            history.push('/');
        }
        catch(err){
            err.response.data.msg && setError(err.response.data.msg);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-5 mx-auto pt-5">
                    <h1 className="text-center mb-4">Sign in</h1>
                    {error && (
                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                    )}
                    <form onSubmit={onSubmit}>
                        <div className="form-group justify-content-center mb-4">
                            <label>E-mail: </label>
                            <input type="email"
                                id="register-email"
                                required
                                className="form-control"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group justify-content-center mb-4">
                            <label>Password: </label>
                            <input type="password"
                                id="register-password"
                                required
                                className="form-control"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-purple btn-block btn-lg shadow">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
}