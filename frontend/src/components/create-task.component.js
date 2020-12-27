import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default class CreateTask extends Component {
    constructor(props){
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeCourse = this.onChangeCourse.bind(this);
        this.onChangeDeadline = this.onChangeDeadline.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            title: '',
            description: '',
            course: '',
            deadline: new Date()
        };

    }

    onChangeTitle(e){
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription(e){
        this.setState({
            description: e.target.value
        });
    }

    onChangeCourse(e){
        this.setState({
            course: e.target.value
        });
    }

    onChangeDeadline(deadline){
        this.setState({
            deadline: deadline
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const task = {
            title: this.state.title,
            course: this.state.course,
            description: this.state.description,
            deadline: this.state.deadline
        }

        axios.post('http://localhost:5000/add/', task)
            .then(res => console.log(res.data))
            .catch(err => console.log('ErrorAddPost: ' + err));

        window.location = '/';
    }

    render(){
        return (
            <div className="container">
                <h3>Add New Task</h3>
                <form onSubmit={this.onSubmit}>

                    <div className="form-group">
                        <label>Title: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.title}
                            onChange={this.onChangeTitle}
                        />
                    </div>

                    <div className="form-group">
                        <label>Course: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.course}
                            onChange={this.onChangeCourse}
                        />
                    </div>

                    <div className="form-group">
                        <label>Deadline: </label>
                        <div>
                            <DatePicker
                                selected={this.state.deadline}
                                showTimeSelect
                                onChange={this.onChangeDeadline}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description: </label>
                        <textarea
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Add task" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        );
    }
}