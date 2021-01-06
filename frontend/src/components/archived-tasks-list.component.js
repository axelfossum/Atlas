import React, { Component } from 'react';
import '../styles/custom.css';
import axios from 'axios';


const Task = props => {
    return (
            <div className="card mr-4 my-2 col-md-5 shadow">
                    <div className="row">
                        <div className="col-10">
                            <h5 className="card-title">{props.task.title}</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button className="btn p-0 btn-link" onClick={() => props.toggleFinish(props.task._id)}>Revert</button>
                            <div className="d-inline mx-2 btn-divider">|</div>
                            <button className="btn p-0 btn-link" onClick={() => {props.toggleDelete(props.task._id)}}>✗ Delete</button>
                        </div>
                    </div>
            </div>
    );
}

export default class ArchivedTasksList extends Component {
    constructor(props){
        super(props);

        this.state = {
            tasks: [],
            isLoaded: false
        }
        this.toggleDelete = this.toggleDelete.bind(this);
        this.toggleFinish = this.toggleFinish.bind(this);
    }

    toggleDelete(id){
        axios.delete('http://localhost:5000/'+ id)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.log(err)); 

        this.setState({
            tasks: this.state.tasks.filter(el => el._id !== id)
        });
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

    componentDidMount(){
        const token = localStorage.getItem('auth-token');
        axios.get('http://localhost:5000/', { headers: {'x-auth-token': token} })
            .then(response => {
                this.setState({
                    tasks: response.data.filter(el => el.finished === true),
                    isLoaded: true
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render(){
        const {isLoaded, tasks} = this.state;
        if(!isLoaded){
            return (
                <div className="container-fluid px-5 pt-4">
                    Loading...
                </div>
            );
        }
        return (
            <div className="container-fluid px-5 pt-5 text-center">
                <div className="row">
                    {tasks.map(currentTask => <Task key={currentTask._id} task={currentTask} toggleDelete={this.toggleDelete}
                    toggleFinish={this.toggleFinish} />) }
                </div>
            </div>
        );
    }

}