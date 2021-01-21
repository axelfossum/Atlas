import React, { Component } from 'react';
import '../styles/custom.css';
import axios from 'axios';


const Task = props => {
    return (
                <tr>
                    <td>{props.task.title}</td>
                    <td>{props.task.course}</td>
                    <td>{props.task.deadline.substring(0,10) + " " + props.task.deadline.substring(11,16)}</td>
                    <td>
                        <button className="btn p-0 btn-link" onClick={() => props.toggleFinish(props.task._id)}>Revert</button>
                        <div className="d-inline mx-2 btn-divider">|</div>
                        <button className="btn p-0 btn-link" onClick={() => {props.toggleDelete(props.task._id)}}>✗ Delete</button>
                    </td>
                </tr>
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

        axios.post('http://localhost:5000/update/'+ id + '/finished/', task)
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
            <div className="container-fluid px-5 pt-4 main-atlas">
                <div className="card shadow">
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th score="col">Title</th>
                                    <th score="col">Course</th>
                                    <th score="col">Deadline</th>
                                    <th score="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(currentTask => <Task key={currentTask._id} task={currentTask} toggleDelete={this.toggleDelete}
                                toggleFinish={this.toggleFinish} />) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}