import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../styles/custom.css';
import Modal from 'react-bootstrap/Modal';
import ErrorNotice from "./error-notice.component";


function Course(props){
    return (
        <div className="course-item mb-2">
            <h6>{props.title}</h6>
            <button type="button" className="btn btn-link mr-2" onClick={() => props.editCourse(props.title)}>Edit</button>
            <button type="button" className="btn btn-link" onClick={() => props.removeCourse(props.title)}>Remove</button>
        </div>
    );

}

export default function Account(){
    const [newCourse, setNewCourse] = useState('');
    const [shouldRefresh, setShouldRefresh] = useState(true);
    const [userData, setUserData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [originalCourse, setOriginalCourse] = useState('');
    const [editCourseText, setEditCourseText] = useState('');
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchData(){
            let token = localStorage.getItem('auth-token');

            const tokenRes = await axios.post('http://localhost:5000/user/tokenIsValid', null,
                { headers: { 'x-auth-token': token } });
            
            if(tokenRes.data){
                const userRes = await axios.get('http://localhost:5000/user/getuser/', { 
                    headers: {'x-auth-token': token} 
                });
                setUserData(userRes.data);
            }


        }

        fetchData();
    }, [shouldRefresh]);


    const onAddCourse = async (e) => {
        try{
            e.preventDefault();
            
            const token = localStorage.getItem('auth-token');
            const course = {newCourse};
            setNewCourse('');   // Clear course input field
            setShouldRefresh(!shouldRefresh);    // Value doesn't matter. This is only used to trigger a re-render (using useEffect)
            await axios.post('http://localhost:5000/user/add-course/', course, { headers: {'x-auth-token': token} });
        }
        catch(err){
            console.log(err);
        }
    }

    function onRemoveCourse(course){
        try{
            const token = localStorage.getItem('auth-token');
            setShouldRefresh(!shouldRefresh);    // Value doesn't matter. This is only used to trigger a re-render (using useEffect)
            axios.delete('http://localhost:5000/user/remove-course/'+course, { headers: {'x-auth-token': token} });
        }
        catch(err){
            console.log(err);
        }
    }

    function toggleModal(course){
        setShowModal(!showModal);
        setEditCourseText(course);
        setOriginalCourse(course);
    }

    const onEditCourse = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('auth-token');
        const update = {originalCourse, editCourseText};
        await axios.post('http://localhost:5000/user/update-course/', update, { headers: {'x-auth-token': token} })
            .then(response => {
                console.log(response);
                toggleModal('');
                setShouldRefresh(!shouldRefresh);
            })
            .catch((err) => {
                err.response.data.msg && setError(err.response.data.msg);
            });
    }

    return (
        <div className="container-fluid px-5 pt-5">
            <div className="row">
                <div className="col-3">
                    <h2 className="mb-5">User Settings</h2>
                    <h5 className="mb-3">Courses</h5>
                    <form onSubmit={onAddCourse}>
                        <input type="text" className="add-course-field" value={newCourse} onChange={e => setNewCourse(e.target.value)}/>
                        <button className="btn btn-purple btn px-3 ml-2 float-right">Add</button> 
                    </form>
                    <div className="overflow-scroll">
                        {userData && userData.courses.map(course => <Course key={course} title={course} removeCourse={onRemoveCourse} editCourse={toggleModal}/>)}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => toggleModal('')} className="mt-15">
                <Modal.Body>
                    <div className="text-center">
                        {error && (
                            <ErrorNotice message={error} clearError={() => setError(undefined)} />
                        )}
                        <form onSubmit={onEditCourse}>
                            <input type="text" className="form-control mb-3" value={editCourseText} onChange={e => setEditCourseText(e.target.value)}/>
                            <button type="button" className="btn btn-secondary mr-3" onClick={() => toggleModal('')}>Cancel</button>
                            <button className="btn btn-success">Change</button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );

}