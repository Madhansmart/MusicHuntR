import React , {Component} from 'react';
import { connect } from 'react-redux';
import './MusicPlayer.css';
class MusicPlayer extends Component{
  constructor(props){
    super(props);
    this.state = {
      isPlaying : true,
      currentTime : "00:00",
      totalTime : "00:00",
      isMuted : false,
      isFavourite : false,
      volume : "1",
      songSrc : new Audio(this.props.songData.track_url+"/download")
    }
  }
  songControls = (option)=> {
    console.log("playing");
    let song = this.state.songSrc;
    switch(option){
        case "play" :
          song.play();
          song.volume = this.state.volume;
          this.setState({isPlaying : false});
          break;
        case "pause":
          song.pause();
          this.setState({isPlaying : true});
          break;
        case "fav":
          break;
        case "unfav":
        default :
    }
  }

  setVolume = (vol)=> {
      let song = this.state.songSrc;
      song.volume = vol;
      this.setState({volume : vol});
  }
  setFav = (fav)=> {
      if(fav==="fav"){
        this.setState({isFavourite : true});
      }
      else{
          this.setState({isFavourite : false});
      }
  }
  timeUpdate = ()=>{
      setInterval(()=>{
          if(this.currentTime < this.totalTime){
            this.setState({currentTime : this.state.currentTime+1});
          }
      },1000)
  }
  addPlayListToPlayer = (name, artist, cover, musicSrc) =>{
      let obj = {
        name : name,
        singer : artist,
        cover : cover,
        musicSrc :  musicSrc+"/download"
      }
      this.props.setPlayList(obj);
  }
  play = (name, artist, cover, musicSrc) => {
    let obj = {
      name : name,
      singer : artist,
      cover : cover,
      musicSrc :  musicSrc+"/download"
    }
    this.props.setSongsList(obj);
  }
  render(){
    return(
      <div className="row music-player mx-auto">
        <div className="col"><img className="music-img" src={this.props.songData.track_image_file} alt="img"/></div>
        <div className="col music-title">{this.props.songData.track_title}</div>
        <div className="col music-title-album">{this.props.songData.album_title}</div>
        <div className="col music-play" onClick={this.play.bind(this,this.props.songData.track_title,
                                                   this.props.songData.artist_name,
                                                   this.props.songData.track_image_file,
                                                   this.props.songData.track_url)}><i className="fa fa-play" aria-hidden="true"></i></div>
          {/*this.state.isPlaying ?
            <div className="col" onClick={this.songControls.bind(this,"play")}>
              <i className="fa fa-play" aria-hidden="true"></i>
            </div>:
            <div className="col" onClick={this.songControls.bind(this,"pause")}>
              <i className="fa fa-pause" aria-hidden="true"></i>
            </div>
           */}
        {/*}<div className="col">{this.state.currentTime}/{this.props.songData.track_duration}</div>*/}
        {/*
          this.state.volume === "0"?
              <div className="col" onClick={this.setVolume.bind(this,"0.2")}>
                <span>
                  <i className="fa fa-volume-off"></i>
                  <i className="fa fa-ban"></i>
                </span>
              </div>:
                this.state.volume === "0.2" ?
                    <div className="col" onClick={this.setVolume.bind(this,"0.6")}><i className="fa fa-volume-off" aria-hidden="true"></i></div>:
                      this.state.volume === "0.6"?
                            <div className="col" onClick={this.setVolume.bind(this,"1")}><i className="fa fa-volume-down" aria-hidden="true"></i></div>:
                                <div className="col" onClick={this.setVolume.bind(this,"0")}><i className="fa fa-volume-up" aria-hidden="true"></i></div>
            */}
        {/*this.state.isFavourite ?
          <div className="col" onClick={this.setFav.bind(this,"unfav")}><i className="fa fa-heart" aria-hidden="true"></i></div>:
          <div className="col" onClick={this.setFav.bind(this,"fav")}><i className="fa fa-heart-o" aria-hidden="true"></i></div>*/}
          <div className="col">
              <div className="dropdown">
                  <div data-toggle="dropdown">
                    <i className="fa fa-ellipsis-v"></i>
                  </div>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="/" onClick={this.addPlayListToPlayer.bind(this,this.props.songData.track_title,
                                                               this.props.songData.artist_name,
                                                               this.props.songData.track_image_file,
                                                               this.props.songData.track_url)}>
                        Add To PlayList
                    </a>
                    <a className="dropdown-item" href="/">Download </a>
                  </div>
              </div>
          </div>
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
    },
    setSongsList : (song) => {
      dispatch({
        type : 'SET_SONGSLIST',
        payload : song
      })
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MusicPlayer);
