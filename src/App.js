import React , { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import MainContent from './Main/MainContent';
import Section from './Components/Section/Section';
import b64toBlob from 'b64-to-blob';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router
  } from 'react-router-dom';

import logo from './Images/logo.png';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      isUserActive : false,
      userName : "",
      audioLists : [],
      autoPlay : false,
      profile_img : ""
    }
  }

  componentDidMount = ()=> {
      if(localStorage.getItem("musicHuntuser")!==undefined && localStorage.getItem("musicHuntUser")!==null){
        let contentType = 'image/jpg';
        let b64Data = localStorage.getItem("musicHuntUserProfile");
        if(localStorage.getItem("musicHuntUserProfile")!=="undefined" && localStorage.getItem("musicHuntUserProfile")!==null){
          let blob = b64toBlob(b64Data, contentType);
          let blobUrl = URL.createObjectURL(blob);
          this.setState({isUserActive : true, userName : localStorage.getItem("musicHuntUser"), profile_img :blobUrl});
        }
        this.setState({isUserActive : true});
      }
      toast.configure({
        autoClose: 1000,
      });
      console.log(this.props.musicPlayListReducer.audioLists);
  }

  alertToSignIn = ()=>{
    toast.success("Login to set your favourite tracks", {
        position: toast.POSITION.TOP_RIGHT
    });
  }

  render(){
    return (
      <div className="App">
      <ToastContainer autoClose={1500}/>
        <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
          <img src={logo} alt="Music Hunt" className="nav-img"/>
          <a className="navbar-brand" href="/"><h3>Music Hunt</h3></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
          {this.state.isUserActive}
          {this.state.isUserActive  ?
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                {this.state.profile_img==="" ?
                  <span className="fa fa-user-circle-o"></span>:
                  <img src={this.state.profile_img} className="navbar-image" alt="profile"/>
               }
                </a>
              </li>
            </ul>:<div></div>}
          </div>
        </nav>
        <div className="section-content-main">
          <Section/>
          <Router>
            <MainContent/>
          </Router>
        </div>
        <div className="container">
          <div className="row">
          {console.log(this.props.musicPlayListReducer.isSongs)}
          { this.props.musicPlayListReducer.audioLists.length >0 || this.props.musicPlayListReducer.songsList.length >0?
              this.props.musicPlayListReducer.isSongs ?
                  <ReactJkMusicPlayer panelTitle="Songs"
                                      audioLists={this.props.musicPlayListReducer.songsList}
                                      defaultPosition={{top:600,left:100}}
                                      draggable={true}
                                      bounds= ""
                                      autoPlay={true}/>:
              <ReactJkMusicPlayer audioLists={this.props.musicPlayListReducer.audioLists} defaultPosition={{top:600,left:100}} draggable={true} bounds= "" autoPlay={false}/>:""
          }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    musicPlayListReducer : state.musicPlayListReducer
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    setCurrent : (val) => {
      dispatch({
          type : 'SET_CURRENT',
          payload : val
      });
    },
    setPlayList : (playList) => {
      dispatch({
        type : 'SET_PLAYLIST',
        payload : playList
      })
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
