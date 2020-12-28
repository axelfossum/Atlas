import React, { Component } from 'react';
import '../styles/custom.css';

export default class About extends Component {

    render(){
        return (
            <div className="container-fluid px-5 pt-5 text-center">
                <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6">
                        <h2>What is Atlas?</h2>
                        <p className="mb-5">
                            Atlas is an online tool for planning your studies. Think of Atlas as a bulletin board on which you can map out your 
                            studies using cards similar to post-it notes. How you choose to use this is completely up to you.
                            <br/><br/>
                            You need to create an account to use this tool.
                        </p>
                        <h5>Creators</h5>
                        <p className="creators mb-5">
                            Gabriel Christensson | Kungliga Tekniska Högskolan (KTH)<br/>
                            Axel Fossum | Lunds Tekniska Högskola (LTH)
                        </p>
                    </div>
                    <div class="col-3"></div>
                </div>
                
            </div>
        );
    }

}