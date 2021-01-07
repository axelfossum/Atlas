import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../styles/custom.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom'
import { relativeTimeThreshold } from 'moment';

const Task = props => {
    return (
            <div className="card mr-4 my-3 col-md-3 shadow">
                <div className="card-body">
                    <div className="row">
                        <div className="col-10">
                            <h5 className="card-title">{props.task.title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{props.task.course}</h6>
                            <h6 className="card-subtitle mb-2 text-muted">{props.task.deadline.substring(0,10) + " " + props.task.deadline.substring(11,16)}</h6>
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-outline-success btn-lg" onClick={() => props.toggleFinish(props.task._id)}>✓</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p className="card-text overflow-auto">{props.task.description}</p>
                            <button className="btn p-0 btn-link" onClick={() => props.showModal(props.task._id)}>✎ Edit</button>
                            <div className="d-inline mx-2 btn-divider">|</div>
                            <button className="btn p-0 btn-link" onClick={() => {props.toggleDelete(props.task._id)}}>✗ Delete</button>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default class ActiveTasksList extends Component {
    constructor(props){
        super(props);

        this.state = {
            showModal: false,
            showConfirmDelete: false,
            isLoaded: false,
            tasks: [],
            currentTask_id: '',
            currentTaskTitle: '',
            currentTaskCourse: '',
            currentTaskDescription: '',
            currentTaskDeadline: new Date(),
            addingNewTask: false,
            timezoneOffset: new Date().getTimezoneOffset()*60*1000,
            isLoggedIn: false
        };

        this.toggleDelete = this.toggleDelete.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onChangeCurrentTaskTitle = this.onChangeCurrentTaskTitle.bind(this);
        this.onChangeCurrentTaskCourse = this.onChangeCurrentTaskCourse.bind(this);
        this.onChangeCurrentTaskDeadline = this.onChangeCurrentTaskDeadline.bind(this);
        this.onChangeCurrentTaskDescription = this.onChangeCurrentTaskDescription.bind(this);
        this.onEditTask = this.onEditTask.bind(this);
        this.toggleFinish = this.toggleFinish.bind(this);
        this.sortByDueTime = this.sortByDueTime.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);

    }
    
    componentDidMount(){

        const token = localStorage.getItem('auth-token');
        if(token){
            this.setState({
                isLoggedIn: true
            });
        }

        axios.get('http://localhost:5000/', { headers: {'x-auth-token': token} })
            .then(response => {
                this.setState({
                    isLoaded: true,
                    tasks: response.data.filter(el => el.finished === false)
                });
            })
            .catch(err => {
                console.log(err);
            });

    }

    toggleDelete(id){
        this.setState({
            currentTask_id: id,
            showConfirmDelete: !this.state.showConfirmDelete
        });
    }

    sortByDueTime(){
        const token = localStorage.getItem('auth-token');
        axios.get('http://localhost:5000/sortByDate', { headers: {'x-auth-token': token} })
        .then(res =>{
            this.setState({
                tasks: res.data.filter(el => el.finished === false)
            })
        })
        .catch(err => {
            console.log("hej");
            console.log(err);
        });
    }


    confirmDelete(e){
        e.preventDefault();

        axios.delete('http://localhost:5000/'+this.state.currentTask_id)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.log(err)); 
        

        this.setState({
            showConfirmDelete: !this.state.showConfirmDelete,
            tasks: this.state.tasks.filter(el => el._id !== this.state.currentTask_id)
        });

        window.location= '/';
    }

    toggleFinish(id){
        const task = {
            finished: !this.state.tasks.find(task => task._id === id).finished
        }

        axios.post('http://localhost:5000/update/'+ id, task)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.log(err));

        this.setState({
            tasks: this.state.tasks.filter(el => el._id !== id)
        });
    }

    toggleModal(id){
        if(id !== ''){
            this.setState({
                addingNewTask: false,
                currentTask_id: id,
                currentTaskTitle: this.state.tasks.find(task => task._id === id).title,
                currentTaskCourse: this.state.tasks.find(task => task._id === id).course,
                currentTaskDeadline: new Date(Date.parse(this.state.tasks.find(task => task._id === id).deadline) + this.state.timezoneOffset),
                currentTaskDescription: this.state.tasks.find(task => task._id === id).description,
            });
        } else {
            this.reset()
            this.setState({
                addingNewTask: true
            });
        }

        this.setState({
            showModal: !this.state.showModal,
        });
        
    }

    reset(){
        this.setState({
            currentTask_id: '',
            currentTaskTitle: '',
            currentTaskCourse: '',
            currentTaskDescription: '',
            currentTaskDeadline: new Date()
        })     
    }

    onChangeCurrentTaskTitle(e){
        this.setState({
           currentTaskTitle: e.target.value 
        });
    }

    onChangeCurrentTaskCourse(e){
        this.setState({
            currentTaskCourse: e.target.value
        });
    }

    onChangeCurrentTaskDeadline(deadline){
        this.setState({
            currentTaskDeadline: deadline
        });
    }

    onChangeCurrentTaskDescription(e){
        this.setState({
            currentTaskDescription: e.target.value
        });
    }

    onEditTask(e){
        e.preventDefault();

        const task = {
            title: this.state.currentTaskTitle,
            description: this.state.currentTaskDescription,
            course: this.state.currentTaskCourse,
            finished: false
        }

        const token = localStorage.getItem('auth-token');

        if(this.state.addingNewTask){
            task.deadline = new Date(Date.parse(this.state.currentTaskDeadline) - this.state.timezoneOffset);
            axios.post('http://localhost:5000/add/', task, { headers: {'x-auth-token': token} })
            .then(res => console.log(res.data))
            .catch(err => console.log('ErrorAddPost: ' + err));
        } else {
            task.deadline = new Date(Date.parse(this.state.currentTaskDeadline));
            axios.post('http://localhost:5000/update/'+this.state.currentTask_id, task, { headers: {'x-auth-token': token} })
            .then(res => console.log(res.data))
            .catch(err => console.log('ErrorUpdatePost: ' + err));
        }

        window.location= '/';
    }

    render(){
        const {isLoaded, tasks, isLoggedIn} = this.state;

        if(!isLoggedIn){
            return (
                <div className="container-fluid px-5 pt-10 text-center">
                    <h1 className="h1-lg mb-4">
                        Welcome to Atlas!
                    </h1>
                    <div className="mb-7">
                        <img src={process.env.PUBLIC_URL + '/pen-small.svg'} alt="" width="150" height="150"></img>
                    </div>
                    <div>
                        <Link to="/login">
                            <button type="button" className="btn btn-purple btn-lg px-5 mr-4 shadow">Sign in</button>
                        </Link>
                        <Link to="/register">
                            <button type="button" className="btn btn-secondary btn-lg px-5 shadow">Register</button>
                        </Link>
                    </div>
                </div>
            );
        }

        if(!isLoaded && isLoggedIn){
            return (
                <div className="container-fluid px-5 pt-4">
                    Loading...
                </div>
            );
        }

        let finalBtn;
        if(this.state.addingNewTask){
            finalBtn = <button className="btn btn-purple">Add new task</button>;
        } else {
            finalBtn = <button className="btn btn-purple">Save changes</button>;
        }

        return (
            <div className="container-fluid px-5 pt-4 main-atlas">
                <div className="row my-3">
                    <button className="btn btn-purple btn-lg shadow" onClick={() => this.toggleModal('')}>+ &nbsp;Add new task</button>
                    <button className="btn btn-gray btn-lg shadow" onClick={() => this.sortByDueTime()}>Sort by duetime</button>
                </div>
                <div className="row">
                    {tasks.map(currentTask => <Task key={currentTask._id} task={currentTask} 
                    toggleDelete={this.toggleDelete} showModal={this.toggleModal} toggleFinish={this.toggleFinish}/>) }
                </div>

                <Modal show={this.state.showModal} onHide={() => this.toggleModal('')} size="lg">
                    <form onSubmit={this.onEditTask}>
                        <Modal.Body>
                            <div className="p-2">
                                <div className="row mt-2 mb-3">
                                    <div className="col form-group">
                                        <label>Title: </label>
                                        <input type="text"
                                            required
                                            className="form-control"
                                            value={this.state.currentTaskTitle}
                                            onChange={this.onChangeCurrentTaskTitle}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col form-group">
                                        <label>Course: </label>
                                        <input type="text"
                                            required
                                            className="form-control"
                                            value={this.state.currentTaskCourse}
                                            onChange={this.onChangeCurrentTaskCourse}
                                        />
                                    </div>
                                    <div className="col form-group">
                                        <label>Deadline: </label><br/>
                                        <DatePicker
                                            className="form-control"
                                            selected={this.state.currentTaskDeadline}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            onChange={this.onChangeCurrentTaskDeadline}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description: </label>
                                    <textarea
                                        className="form-control"
                                        value={this.state.currentTaskDescription}
                                        onChange={this.onChangeCurrentTaskDescription}
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-light" onClick={() => this.toggleModal('')}>Cancel</button>
                            {finalBtn}
                        </Modal.Footer>
                    </form>
                </Modal>
                <Modal show={this.state.showConfirmDelete} onHide={() => this.toggleDelete('')}>
                    <form onSubmit={this.confirmDelete}>
                        <Modal.Body>
                            <div className="p-2 text-center">
                                Are you sure you want to delete this task?
                                <br/>
                                <br/>
                                <button type="button" className="btn btn-secondary mr-2" onClick={() => this.toggleDelete(this.state.currentTask_id)}>Cancel</button>
                                <button className="btn btn-danger ml-2">Confirm</button>
                            </div>
                        </Modal.Body>
                    </form>
                </Modal>
            </div>
        );
    }

}