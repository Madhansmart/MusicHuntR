import React , {Component} from 'react';
import './Section.css';
import $ from 'jquery';
import { albumsList } from '../../Main/UserFunctions';
import { getAllTracksByAlbumId } from '../../Main/UserFunctions';
// import { getFavouriteByTrackId }  from '../../Main/UserFunctions';
import { getFavouriteTracksByUser } from '../../Main/UserFunctions';
import { searchAlbumByTitle } from '../../Main/UserFunctions';
import { setFavouriteByUser } from '../../Main/UserFunctions';
import { removeFavouriteByUser } from '../../Main/UserFunctions';
import { getProfileDetails } from '../../Main/UserFunctions';
import { setProfileDetails } from '../../Main/UserFunctions';
// import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import image2base64 from 'image-to-base64';
import Files from 'react-files'
import MusicPlayer from './MusicPlayer/MusicPlayer'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
  } from 'react-router-dom';
// var elasticsearch = require('elasticsearch');
const b64toBlob = require('b64-to-blob');
// var client = new elasticsearch.Client({
//   host: 'localhost:5000',
//   log: 'trace'
// });
class Home extends Component{
    render(){
        return(
            <div className="home">
                <Album/>
                <Favourite/>
            </div>
        )
    }
}

class Album extends Component{
    constructor(props) {
        super(props);
        this.state = {
          currentCard: 0,
          position: 0,
          loaderdata : ["","","",""],
          cardStyle: {
            transform: 'translateX(0px)'
          },
          width: 0,
          albumData : [],
          isAlbumCreate : false,
          isDataAlive : false,
          albumTitle  : "Albums",
          isDataLoaded : false
        };
      }
      async componentDidMount() {
        if(this.props.albumData!==undefined){
           this.setState({albumData : this.props.albumData, isDataAlive : true, isDataLoaded : true});
        }
        else{
          let response =await albumsList();
          if(response===undefined){
            console.log("server unavailable");
          }
          else{
            this.setState({albumData : response, isDataAlive : true, isDataLoaded : true});
          }
        }
      }

      createAlbumActive = ()=>{
          this.setState({isAlbumCreate : true});
      }

      createAlbum = (albumObj)=> {
        let albumCopy = this.state.albumData.slice();
        let count = 0;
        for(let i=0; i<albumCopy.length; i++){
            if(albumCopy[i].title === albumObj.albumName){
              count++;
            }
        }
        if(count)
        var obj = {
          albumImg : "",
          description : albumObj.albumDesc,
          songs : [],
          title : albumObj.albumName
        }
        albumCopy.push(obj);
        this.setState({albumData : albumCopy, isAlbumCreate : false});
      }
      setAlbumTitle = (index) => {
          this.setState({albumTitle : this.state.albumData[index].album_title});
      }

    render(){
        let createShown = {
          display : this.props.albumTitle ==="Albums"?"block":"none"
        }
        let mainPageShown = {
          display : this.state.isDataAlive ? "block" : "none"
        }
        if(!this.state.isAlbumCreate){
            return(
              <div>
              {this.state.isDataLoaded ?
                  <div className="album container-fluid" style={mainPageShown}>
                      <div className="cards-slider row">
                          <div className="col-md-9"><h3><Link to="/MusicHuntR/album">{this.props.title!==undefined?this.props.title : "Albums"}</Link>{this.state.albumTitle!=="Albums"?<span>&nbsp;&#x3e;&nbsp;{this.state.albumTitle}</span>:""}</h3></div>
                            <div className="btn btn-success create-albm-btn" style={createShown} onClick={this.createAlbumActive}>Create Album</div>
                      </div>
                      <hr className="album-hr"/>
                      <div className="album-content">
                          <Card cardStyle={this.state.cardStyle} albumData={this.state.albumData} albumTitle={this.setAlbumTitle}/>
                      </div>
                  </div>:
                  <div className="container-fluid">
                    <div className="loader-box row">
                      {this.state.loaderdata.map((val, index)=>{
                          return(
                            <div className="col" key={index}>
                              <div className="loader-card">
                                <div className="loader-img mx-auto"></div>
                                <div className="loader-title mx-auto"></div>
                                <div className="loader-title mx-auto"></div>
                                <div className="loader-fav ml-auto"></div>
                              </div>
                            </div>
                          )
                      })}
                    </div>
                  </div>
              }
              </div>
            )
          }
          else{
            return <CreateAlbum createAlbum={this.createAlbum}/>
          }
    }
}

class CreateAlbum extends Component{
  constructor(props){
    super(props);
    this.state = {
      albumName : "",
      albumDesc : "",
      albumImg : "",
      songs : []
    }
  }

  updateAlbumDetails = (e)=>{
    this.setState({[e.target.name] : e.target.value});
  }

  render(){
    return(
      <div className="create-album-main container">
      <h2>Create Your Album </h2>
      <hr/>
        <div className="row">
              <div className="col">
                <form>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="abmName">Name</label>
                            <input type="text" className="form-control ml-auto" id="abmName" placeholder="Enter Album Name" onChange={this.updateAlbumDetails} name="albumName" autoComplete="current-username" required />
                        </div>
                        <div className="col ml-auto">
                            <label htmlFor="abmDesc">Description</label>
                            <input type="text" className="form-control ml-auto" id="abmName" placeholder="Enter Album Name" onChange={this.updateAlbumDetails} name="albumDesc" autoComplete="current-username" required />
                        </div>
                    </div>
                    <div className="form-group text-center create-abm-upload">
                        <Files
                            className='files-dropzone album-img-upload btn btn-primary btn-sm'
                            // onChange={this.onFilesChange}
                            // onError={this.onFilesError}
                            accepts={['image/*']}
                            multiple
                            maxFiles={10}
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable
                        >
                            Upload Album Cover
                        </Files>
                      </div>
                      <div className="form-group text-center create-abm-upload">
                          <Files
                              className='files-dropzone album-songs-upload btn btn-primary btn-sm'
                              // onChange={this.onFilesChange}
                              // onError={this.onFilesError}
                              accepts={['audio/*']}
                              multiple
                              maxFiles={10}
                              maxFileSize={10000000}
                              minFileSize={0}
                              clickable
                          >
                              Upload Songs
                          </Files>
                      </div>
                      <div className="btn btn-sm btn-outline-success" onClick={this.props.createAlbum.bind(this,this.state)}>Create</div>
                </form>
            </div>
            <div className="col">
                uploaded image and songs will display here
            </div>
        </div>
      </div>
    )
  }
}

class Card extends Component{
    constructor(props){
        super(props);
        this.state = {
          albumsData : [],
          tracksData : [],
          isSongsShown : false,
          favouriteCount : 0,
          userFavouriteTracks : [],
          tracksBoolval : [],
          isUserActive : false
        }
    }
    async componentDidMount(){
      let user = localStorage.getItem("musicHuntUser");
      if(user!==undefined && user !== null){
        let boolval = [];
        let albumOfUser = await getFavouriteTracksByUser({userName : user}).then(response=>{return response.albumId});
        if(albumOfUser!==undefined){
              let userfavouriteAlbumArr = this.props.albumData.slice();
              let newUserFavouriteAlbum = userfavouriteAlbumArr.map((val)=>{
                var newObj = Object.assign({},val);
                let countBool = 0;
                albumOfUser.forEach(valRes=>{
                  if(valRes===val.album_id){
                    countBool++;
                  }
                })
                newObj.isFavourite = countBool>0?true : false;
                return newObj;
              })
              for(let i=0; i<newUserFavouriteAlbum.length; i++){
                if(newUserFavouriteAlbum[i].isFavourite){
                  let slicedVal = newUserFavouriteAlbum[i];
                  newUserFavouriteAlbum.splice(i,1);
                  newUserFavouriteAlbum.unshift(slicedVal);
                }
              }
              console.log(newUserFavouriteAlbum);
              console.log(boolval);
              for(let i=0; i<newUserFavouriteAlbum.length; i++){
                boolval.push(newUserFavouriteAlbum[i].isFavourite);
              }
              this.setState({userFavouriteTracks : newUserFavouriteAlbum, tracksBoolval : boolval, isUserActive : true});
        }
        else{
          let userFavouriteTracks = this.props.albumData.slice();
          console.log(userFavouriteTracks);
          this.setState({userFavouriteTracks : userFavouriteTracks, isUserActive : true});
        }
      }
      else{
        let userFavouriteTracks = this.props.albumData.slice();
        console.log(userFavouriteTracks);
        this.setState({userFavouriteTracks : userFavouriteTracks});
      }
    }

    setFavouriteFirst(newUserFavouriteAlbum){
      console.log(newUserFavouriteAlbum);
        let user = localStorage.getItem("musicHuntUser");
        if(user!==undefined && user !== null){
          for(let i=0; i<newUserFavouriteAlbum.length; i++){
            if(newUserFavouriteAlbum[i].isFavourite){
              let slicedVal = newUserFavouriteAlbum[i];
              newUserFavouriteAlbum.splice(i,1);
              newUserFavouriteAlbum.unshift(slicedVal);
            }
          }
          let boolval = [];
          for(let i=0; i<newUserFavouriteAlbum.length; i++){
            boolval.push(newUserFavouriteAlbum[i].isFavourite);
          }
          this.setState({tracksBoolval : boolval, userFavouriteTracks : newUserFavouriteAlbum});
        }
    }

    getTracks = (index)=>{
        getAllTracksByAlbumId(this.props.albumData[index].album_id).then(response => {
              if(response.dataset===undefined){
                  console.log("server unavailable");
              }
              else{
                this.props.albumTitle(index);
                this.setState({tracksData : response.dataset,isSongsShown : true});
              }
        })
    }

    setFavour = (index,albumId)=> {
      let user = localStorage.getItem("musicHuntUser")
      if(user!==null && user!==undefined){
          let obj = {
            userName : user,
            albumId :albumId
          }
          setFavouriteByUser(obj).then(response=> {});
          let copyOfFavouriteAlbum = this.state.userFavouriteTracks.slice();
          copyOfFavouriteAlbum[index].isFavourite = true;
          this.setFavouriteFirst(copyOfFavouriteAlbum);
      }
    }

    removeFavour = (index, albumId) => {
      let user = localStorage.getItem("musicHuntUser")
      if(user!==null && user!==undefined){
          let obj = {
            userName : user,
            albumId : albumId
          }
          removeFavouriteByUser(obj).then(response => {});
          let copyOfFavouriteAlbum = this.state.userFavouriteTracks.slice();
          copyOfFavouriteAlbum[index].isFavourite = false;
          this.setFavouriteFirst(copyOfFavouriteAlbum);
      }
    }

    render(){
      let albumcardStyle = {
        flexWrap: window.location.href.includes("album") ? "none"  :"nowrap",
      }
        if(this.state.isSongsShown){
          return (
            <Songs tracksData = {this.state.tracksData}/>
          )
        }
        else{
            return(
                <div className="album-card text-center row" style={albumcardStyle}>
                 {this.state.userFavouriteTracks.map((val, index)=>{
                     return(
                        <div className="card col-md-3" id="card" style={this.props.cardStyle} key={index}>
                          <div className="row" onClick={this.getTracks.bind(this,index)}>
                            <img src={val.album_image_file} className="card-img-top mx-auto img-thumbnail" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title"><b>Title  :</b> {val.album_title}</h5>
                                <span><b>Tracks : </b>{val.album_tracks}</span>
                            </div>
                            </div>
                            <div className="row pull-right card-fa-heart">
                            {this.state.isUserActive?
                              this.state.tracksBoolval[index] ?
                                <i className="fa fa-heart add-favourite" onClick={this.removeFavour.bind(this,index,val.album_id)} title="Remove to favourite"></i>:
                                <i className="fa fa-heart-o add-favourite" onClick={this.setFavour.bind(this,index,val.album_id)} title="Add to favourite"></i>
                              :""
                            }

                            </div>
                        </div>
                     )
                   })}
                 </div>
            )
        }
        }
}

class Songs extends Component{
  constructor(props){
      super();
      this.state = {
          songsData : []
      }
  }
  componentDidMount = ()=> {
    if(this.props.tracksData===undefined){

    }
    else{
      this.setState({songsData : this.props.tracksData});
    }
  }
  render(){
    return(
      <div className="song-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h4>{this.props.title!==undefined ? this.props.title : "SONGS"}</h4>
            </div>
            <div className="col-md-2 mr-auto">
              <h5>{this.state.songsData.length} Songs</h5>
            </div>
          </div>
          <hr/>
          <div className="row text-center song-header">
            <div className="col"></div>
            <div className="col"></div>
            <div className="col"></div>
            <div className="col"></div>
            <div className="col"></div>
          </div>
          <div className="row">
          <div className="col-md-3 ml-auto">
          {this.props.tracksData[0] !== undefined ?
              <img src={this.props.tracksData[0].track_image_file} alt="Album" className="img-thumbnail"/>:""
            }
          </div>
            <div className="col-md-9">
              {this.state.songsData.map((song, index)=>{
                  return(
                      <MusicPlayer songData={song} index={index} key={index}/>
                  )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class AllCards extends Component{
    render(){
        return(
            <div className="allCards"></div>
        )
    }
}

class Favourite extends Component{
  constructor(props){
    super(props);
    this.state = {
      userFavouriteList : [],
      userFavouriteTrackList : [],
      isUserActive : false
    }
  }
  async componentDidMount() {
    let user = localStorage.getItem("musicHuntUser");
    let userAlbumList = [];
    // let tracksList = this.state.userFavouriteTrackList;
    if(user!==null && user !== undefined){
        let favouriteTrackUser =  await getFavouriteTracksByUser({userName : user})
        if(favouriteTrackUser.albumId!==undefined){
              let trackUserArr = await Promise.all(favouriteTrackUser.albumId.map((value)=>{return value;}));
              let userfavouriteTrackArr = await Promise.all(trackUserArr.map((value)=>{
                    let responseArr = getAllTracksByAlbumId(value);
                    return responseArr;
              }))
              let userfavouriteTrackCopy = await Promise.all(userfavouriteTrackArr.map((value)=>{
                if(value.dataset!==undefined){
                  let responseArr = value.dataset.map((val)=>{return val;});
                  return responseArr;
                }
              }))
              if(userfavouriteTrackCopy!==undefined && userfavouriteTrackCopy.length>0){
                  userfavouriteTrackCopy.forEach((val)=>{
                    if(val!==undefined){
                      val.forEach((val1)=>{
                        userAlbumList.push(val1);
                      })
                    }
                  })
                  this.setState({userFavouriteList : userAlbumList, isUserActive : true});
              }
        }
    }
  }
    render(){
        return(
          <div>
          {this.state.isUserActive ?
            <div className="favourites container-fluid">
            <div className="row">
                <div className="mr-auto favourite-title">
                  <h5>Favourites</h5>
                </div>
                <div className="ml-auto favourite-count">
                  {this.state.userFavouriteList.length} Songs
                </div>
            </div>
            <hr />
                {this.state.userFavouriteList.map((val, index) => {
                  return(
                    <MusicPlayer songData={val} key={index}/>
                  )
                })}
            </div>
          :""}
          </div>
        )
    }
}

class Profile extends Component{
  constructor(props){
    super(props);
    this.state = {
      firstName : "",
      lastName : "",
      userName : "",
      email : "",
      password  :"",
      profile_img : "",
      isChanged : true,
      isPasswordChange : false,
      currentPassword : "",
      changedPassword : "",
      updatedDetails : {
        profile_image : "",
        preview_image : "",
        userName : "",
        currentPassword : "",
        changedPassword : ""
      }
    }
  }

  componentDidMount = ()=> {
      let user = localStorage.getItem("musicHuntUser");
      if(user!==null && user!==undefined){
        getProfileDetails(user).then(response => {
          let obj = {
            firstName : response.firstName,
            lastName : response.lastName,
            userName : response.userName,
            email : response.email,
            profile_img : localStorage.getItem("musicHuntUserProfile")!=="undefined" && localStorage.getItem("musicHuntUserProfile")!==undefined ? localStorage.getItem("musicHuntUserProfile") : ""
          }
            let contentType = 'image/jpg';
            let b64Data = localStorage.getItem("musicHuntUserProfile")!=="undefined" && localStorage.getItem("musicHuntUserProfile")!==undefined ?localStorage.getItem("musicHuntUserProfile") : "";
            let blob = b64toBlob(b64Data, contentType);
            let blobUrl = URL.createObjectURL(blob);
            this.setState({
              firstName : obj.firstName,
              lastName : obj.lastName,
              userName : obj.userName,
              email : obj.email,
              profile_img : blobUrl
            });
        })
      }
  }

  onChange = (e) => {
    this.setState({[e.target.name] : e.target.value, isChanged : false});
  }

    togglePassword = () => {
        this.setState({isPasswordChange : true})
    }

    changeUserDetails = ()=> {
      let updatedDetails = this.state.updatedDetails;
      console.log(updatedDetails);
      let count = 0;
      if(localStorage.getItem("musicHuntUser")!==this.state.userName){
          updatedDetails.userName = this.state.userName;
      }
      else{
        updatedDetails.userName = "";
        count++;
      }
      if(this.state.isPasswordChange){
          if(this.state.currentPassword!=="" && this.state.currentPassword!==""){
              if(this.state.currentPassword!==this.state.changedPassword){
                  updatedDetails.currentPassword = this.state.currentPassword;
                  updatedDetails.changedPassword = this.state.changedPassword;
              }
          }
          else{
            console.log("Equal");
          }
      }
      if(count!==2){
        setProfileDetails(updatedDetails).then(res=>{
            console.log(res);
        })
      }


      // if(this.state.isPasswordChange){
      //     // let currentpass = this.state.currentPassword;
      //     // let changedpass = this.state.changedPassword;
      //     let userObj = {
      //       userName : localStorage.getItem("musicHuntUser")!=="undefined"&& localStorage.getItem("musicHuntUser")!==undefined ? localStorage.getItem("musicHuntUser") : this.state.userName,
      //       changedUsername : this.state.userName,
      //       changedPassword : this.state.changedPassword,
      //       email : this.state.email
      //     }
      //     setProfileDetails(userObj).then(res => {
      //       console.log(res);
      //     })
      // }
      // else{
      //   let userObj = {
      //     userName : localStorage.getItem("musicHuntUser")!=="undefined"&& localStorage.getItem("musicHuntUser")!==undefined ? localStorage.getItem("musicHuntUser") : this.state.userName,
      //     changedUsername : this.state.userName,
      //     email : this.state.email
      //   }
      //   setProfileDetails(userObj).then(res => {
      //     console.log(res);
      //   })
      // }
    }

    changeProfileImage = (file)=>{
      let fileObj = file[file.length-1];
      image2base64(fileObj.preview.url).then(response => {
          this.setState({updatedDetails : {
            ...this.state.updatedDetails,
            profile_image : response,
            preview_image : fileObj.preview.url
          },
          isChanged : false})
      })
    }

    onFilesError = (err)=>{
      console.log(err);
    }
    render(){
        return(
            <div className="profile container">
            <form>
              <div className="row">
                <div className="col-md-3">
                  {localStorage.getItem("musicHuntUserProfile")!=="undefined" && localStorage.getItem("musicHuntUserProfile")!==undefined?
                    <div>
                      <div className="row">
                      {this.state.updatedDetails.preview_image!==""?
                        <img src={this.state.updatedDetails.preview_image} className="img-thumbnail profile-image mx-auto" alt="Profile" />
                      :
                        <img src={this.state.profile_img} className="img-thumbnail profile-image mx-auto" alt="Profile 1" />}
                      </div>
                      <div className="row profile-upload-btn">
                      <Files
                          className='files-dropzone'
                          onChange={this.changeProfileImage}
                          onError={this.onFilesError}
                          accepts={['image/*']}
                          multiple
                          maxFiles={10}
                          maxFileSize={200000}
                          minFileSize={0}
                          clickable
                      >
                          <div className="btn btn-sm btn-primary change-image">Change Image</div>
                      </Files>
                      </div>
                    </div>
                      :""
                  }
                </div>
                <div className="col middle-profile">
                    <div className="form-group form-inline">
                      <label htmlFor="firstname" className="mr-auto">First Name</label>
                      <input type="text" className="form-control" id="firstname" name="firstName" onChange={this.onChange.bind(this)} value={this.state.firstName} disabled/>
                    </div>
                    <div className="form-group form-inline">
                      <label htmlFor="lastname" className="mr-auto">Last Name</label>
                      <input type="text" className="form-control" id="lastname" name="lastName" onChange={this.onChange.bind(this)} value={this.state.lastName} disabled/>
                    </div>
                    <div className="form-group form-inline">
                      <label htmlFor="username" className="mr-auto">User Name</label>
                      <input type="text" className="form-control" id="username" name="userName" onChange={this.onChange.bind(this)} value={this.state.userName}/>
                    </div>
                    <div className="form-group form-inline">
                      <label htmlFor="exampleInputEmail1" className="mr-auto">Email address</label>
                      <input type="email" className="form-control" id="email" onChange={this.onChange.bind(this)} value={this.state.email}  placeholder="Enter email" disabled/>
                    </div>
                </div>
                <div className="col profile-section">
                    <div className="btn btn-primary" onClick={this.togglePassword}>Change Password</div>
                    {this.state.isPasswordChange ?
                        <div>
                          <div className="form-group form-inline">
                            <label htmlFor="currentPassword" className="mr-auto">Current Password</label>
                            <input type="password" className="form-control" name="currentPassword" onChange={this.onChange.bind(this)} value={this.state.currentPassword}/>
                          </div>
                          <div className="form-group form-inline">
                            <label htmlFor="changedPassword" className="mr-auto">Password</label>
                            <input type="password" className="form-control" name="changedPassword" onChange={this.onChange.bind(this)} value={this.state.changedPassword}/>
                          </div>
                        </div>:""
                      }
                </div>
              </div>
              <div className="row profile-update-btn">
                  <input type="button" className="btn btn-success mx-auto" onClick={this.changeUserDetails} disabled={this.state.isChanged} value="Save Changes"/>
              </div>
              </form>
            </div>
        )
    }
}

class Section extends Component{
    constructor(props){
        super(props);
        this.state = {
            isUserActive : false,
            activeLink : "Home",
            albumData : [],
            searchExist : false,
            searchKeyWord : "",
            searchErrorText  :"",
            audioLists : [
            {
              name : "First song 1",
              singer : "Madhan",
              cover : "https://freemusiposition: relative;carchive.org/file/images/tracks/Track_-_20110118110252018",
              musicSrc :"http://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/download"
            },
            {
              name : "First song",
              singer : "Madhan",
              cover : "https://freemusicarchive.org/file/images/tracks/Track_-_20110118110252018",
              musicSrc : () => {
                return Promise.resolve("http://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/download")
              }
            }
          ]
        }
    }

    componentDidMount = ()=> {
      if(localStorage.getItem("musicHunt") !==null){
        this.setState({isUserActive : true});
      }
      console.log(this.props);
    }

    logout = ()=> {
      var confirmVal = window.confirm("Are You sure you want to logout");
      if(confirmVal){
        localStorage.clear();
        this.setState({isUserActive : false});
      }
    }

    loginUser = ()=> {
      this.setState({isUserActive : true});
    }

    toggleActive = (value)=>{
        this.setState({activeLink : value});
    }

    setSearchWord = (e)=>{
      this.setState({[e.target.name]:e.target.value});
    }
    async searchAlbum(e){
          if(this.state.searchKeyWord!==""){
            console.log(this.state.searchKeyWord);
              let response =await searchAlbumByTitle(this.state.searchKeyWord);
              if(response==="No Albums Found"){
                  this.setState({searchErrorText : "No Search found for "+this.state.searchKeyWord})
              }
              else{
                  this.setState({albumData : response, searchExist : true, searchErrorText:""})
              }
          }
    }
    searchOnEnter(e){
      if(e.keyCode===13){
        this.searchAlbum();
      }
      else if(this.state.searchKeyWord===""){
        this.setState({searchExist : false,searchErrorText :""});
      }
    }
    render(){
        return(
            <div className="section container-fluid">
                <Router>
                <div className="section-aside">
                    <ul>
                        <Link to="/MusicHuntR">
                            <li className={"section-nav-link " + (this.state.activeLink==='Home'?'active':'')} onClick={this.toggleActive.bind(this,"Home")}>
                                <div className="row">
                                    <div className="mr-auto">Home</div>
                                    <div className="ml-auto"><i className="fa fa-home" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntR/album">
                            <li className={"section-nav-link " + (this.state.activeLink==='Albums'?'active':'')} onClick={this.toggleActive.bind(this,"Albums")}>
                                <div className="row">
                                    <div className="mr-auto">Albums</div>
                                    <div className="ml-auto"><i className="fa fa-folder-open-o" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntR/favourites">
                            <li className={"section-nav-link " + (this.state.activeLink==='Favourites'?'active':'')} onClick={this.toggleActive.bind(this,"Favourites")}>
                                <div className="row">
                                    <div className="mr-auto">Favourites</div>
                                    <div className="ml-auto"><i className="fa fa-heart" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                        <Link to="/MusicHuntR/profile">
                            <li className={"section-nav-link " + (this.state.activeLink==='Profile'?'active':'')} onClick={this.toggleActive.bind(this,"Profile")}>
                                <div className="row">
                                    <div className="mr-auto">Profile</div>
                                    <div className="ml-auto"><i className="fa fa-user-o" aria-hidden="true"></i></div>
                                </div>
                            </li>
                        </Link>
                            <li>
                                <div className="row">
                                    <div className="mr-auto">
                                    {this.state.isUserActive ?
                                      <div onClick={this.logout}>Logout</div>:
                                      <div data-toggle="modal" data-target="#myModal" onClick={this.loginUser}>Login</div>}</div>
                                    <div className="ml-auto"><i className="fa fa-sign-out" aria-hidden="true"></i></div>
                                </div>
                            </li>
                    </ul>
                </div>
                <div className="section-content">
                    <div className="row search-bar">
                        <div className="input-group col-md-12 search-input">
                            <input className="form-control" type="search" placeholder="Search for Albums" name="searchKeyWord" onChange={this.setSearchWord.bind(this)} onKeyDown={this.searchOnEnter.bind(this)} />
                            <div className="input-group-append">
                            <div className="dropdown">
                              <button className="btn btn-primary" type="button" onClick={this.searchAlbum.bind(this)}>
                              <i className="fa fa-search"></i>
                                  {/*<i className="fa fa-angle-down"></i>
                                    <ul className="dropdown-menu">
                                      <li><a href="/">Albums</a></li>
                                      <li><a href="/">Tracks</a></li>
                                    </ul>*/}
                              </button>
                              </div>
                              </div>
                        </div>
                        {this.state.searchErrorText!==""?
                        <div className="search-error-text">{this.state.searchErrorText}</div>:""
                      }
                    </div>
                    <div className="section-content-album">
                    {this.state.searchExist?
                      <Album albumData={this.state.albumData} title="Albums"/>:

                      <Switch>
                          <Redirect exact from="/" to="/MusicHuntR"/>
                          <Route exact path="/MusicHuntR" render={()=><Home/>}/>
                          <Route exact path="/MusicHuntR/album" render = {()=><Album title="Albums"/>}/>
                          <Route exact path="/MusicHuntR/song" render = {()=><Songs/>}/>
                          <Route path="/MusicHuntR/allcards" render={()=><AllCards/>}/>
                          <Route exact path="/MusicHuntR/favourites" render = {()=><Favourite />}/>
                          <Route exact path="/MusicHuntR/profile" render = {()=><Profile />}/>
                      </Switch>
                  }
                    </div>
                </div>
                </Router>
            </div>
        )
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
connect(mapStateToProps,mapDispatchToProps)(Section);
export default Section;
