import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import '../styles/custom.css';
import axios from 'axios';
import UserContext from '../context/UserContext';
import ErrorNotice from "./error-notice.component";

export default function Register() {
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [error, setError] = useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const onSubmit = async (e) => {
        e.preventDefault();

        try{
            const newUser = {
                firstname,
                lastname,
                email,
                password,
                passwordConfirm
            };

            await axios.post('http://localhost:5000/user/register/', newUser);
            const loginRes = await axios.post('http://localhost:5000/user/login/', { email, password });
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
                    <h1 className="text-center mb-4">Register</h1>
                    {error && (
                        <ErrorNotice message={error} clearError={() => setError(undefined)} />
                    )}
                    <form onSubmit={onSubmit}>
                        <div className="form-group justify-content-center mb-4">
                            <label>First name: </label>
                            <input type="text"
                                id="register-firstname"
                                className="form-control"
                                onChange={e => setFirstname(e.target.value)}
                            />
                        </div>
                        <div className="form-group justify-content-center mb-4">
                            <label>Last name: </label>
                            <input type="text"
                                id="register-lastname"
                                className="form-control"
                                onChange={e => setLastname(e.target.value)}
                            />
                        </div>
                        <div className="form-group justify-content-center mb-4">
                            <label>E-mail: </label>
                            <input type="email"
                                id="register-email"
                                className="form-control"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group justify-content-center mb-4">
                            <label>Password: </label>
                            <input type="password"
                                id="register-password"
                                className="form-control"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group justify-content-center mb-4">
                            <label>Confirm password: </label>
                            <input type="password"
                                placeholder="Confirm password"
                                className="form-control"
                                onChange={e => setPasswordConfirm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-purple btn-block btn-lg shadow">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
}