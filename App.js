import './index.css';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import pic from "./pics/unnamed.png"
import radar from "./pics/Screen Shot 2020-11-20 at 5.40.54 PM.png"
import game from "./pics/1276724420.jpg.0.jpg"


//import video1 from "./video/20201119_214625.mp4";
import video1 from "./video/map.mov";
import video2 from "./video/notif.mov";

function App() {
  return (
    <Navbar>
      <Game />
      <Pic />
      <NavItem icon={<CaretIcon />}>
        <DropdownMenu></DropdownMenu>
      </NavItem>
    </Navbar>
  );
}

function Pic(){
  return(
    <div>
        <img src={pic} className="logo"/>
    </div>
  )
}
function Radar(){
  return(
    <div>
        <img src={radar} className="chart-radar"/>
    </div>
  )
}

function Game(){
  return(
    <div>
        <img src={game} className="game"/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>

      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <h1 className="title">FAN BASE</h1>
          <DropdownItem
          leftIcon={<ChevronIcon />}
          goToMenu="chat">
            Chat
          </DropdownItem>
          <DropdownItem
            leftIcon={<ChevronIcon />}
            goToMenu="imap">
            Interactive Map
          </DropdownItem>
          <DropdownItem
            leftIcon={<ChevronIcon />}
            goToMenu="data-feed">
            Data Feed
          </DropdownItem>
        
          

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'imap'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}/>

          <Video/>
          <Video2 />
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'data-feed'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>

          </DropdownItem>
          <DropdownItem goToMenu="active-players"><Team teamname='Dallas Stars'/></DropdownItem>
          <DropdownItem goToMenu="active-players2"><Team teamname='Tampa Bay Lightning'/></DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-players'}
        timeout={500}
        classNames="menu-tiertiary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="data-feed" leftIcon={<ArrowIcon />}>
          
          </DropdownItem>
          <h2>Performance Ratings</h2>
          <DropdownItem goToMenu="active-player-stats"><PlayerRatings player='Tyler Seguin' rating='95%'/></DropdownItem>
          <DropdownItem goToMenu="active-player-stats2"><PlayerRatings player='Jamie Benn' rating='90%'/></DropdownItem>
          <DropdownItem goToMenu="active-player-stats3"><PlayerRatings player=' Miro Heiskanen' rating='85%'/></DropdownItem>
          <DropdownItem goToMenu="active-player-stats4"><PlayerRatings player='Alexander Radulov' rating='70%'/></DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-player-stats'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players" leftIcon={<ArrowIcon />}>

          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="67%" pass="89%" xgoals="2" shifttime="20" player="Tyler Seguin"/>
          <Radar />
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-player-stats2'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players" leftIcon={<ArrowIcon />}>
          
          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="20%" pass="72%" xgoals="0.5" shifttime="19" player="Jamie Benn"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-player-stats3'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players" leftIcon={<ArrowIcon />}>
          
          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="90%" pass="59%" xgoals="3" shifttime="21" player="Miro Heiskanen"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-player-stats4'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players" leftIcon={<ArrowIcon />}>
           
          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="67%" pass="10%" xgoals='0' shifttime="15" player="Alexander Radulov"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-players2'}
        timeout={500}
        classNames="menu-tiertiary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="data-feed" leftIcon={<ArrowIcon />}>
          </DropdownItem>
          <h2>Performance Ratings</h2>
          <DropdownItem goToMenu="active-players2-stats"><PlayerRatings player=' Nikita Kucherov' rating='92%'/></DropdownItem>
          <DropdownItem goToMenu="active-player-stats2"><PlayerRatings player='Steven Stamkos' rating='88%'/></DropdownItem>
          <DropdownItem goToMenu="active-player-stats3"><PlayerRatings player=' Brayden Point' rating='70%'/></DropdownItem>
          <DropdownItem goToMenu="active-player-stats4"><PlayerRatings player=' Victor Hedman' rating='68%'/></DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-players2-stats'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players2" leftIcon={<ArrowIcon />}>

          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="90%" pass="89%" xgoals="2" shifttime="22" player="Nikita Kucherov"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-players2-stats2'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players2" leftIcon={<ArrowIcon />}>
          
          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="67%" pass="90%" xgoals="1.2" shifttime="17" player="Steven Stamkos"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-players2-stats3'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players2" leftIcon={<ArrowIcon />}>
          
          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="78%" pass="90%" xgoals="1.3" shifttime="19" player="Brayden Point"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'active-players2-stats4'}
        timeout={500}
        classNames="menu-4"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="active-players2" leftIcon={<ArrowIcon />}>
           
          </DropdownItem>
          <h2>Overview</h2>
          <PlayerStats shot="62%" pass="78%" xgoals="0.98" shifttime="19" player="Victor Hedman"/>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'betting-pool'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="chat" leftIcon={<ArrowIcon />}>
          </DropdownItem>
          <p className="bet">Dallas Stars at Tampa Bay Lightning</p>
          <RadioButtonsGroup></RadioButtonsGroup>
          
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'add-member'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="chat" leftIcon={<ArrowIcon />}>
          </DropdownItem>
          <p className="join-msg">Share Link:</p>
          <p className="join-link">https://SportsNet/Fan-Base/x2ijs/join</p>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'chat'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
          </DropdownItem>
          <DropdownItem
          leftIcon={<PlusIcon />}
          goToMenu="add-member"
          className="add-member">
            Add a member
          </DropdownItem>
          <DropdownItem
            leftIcon={<ChevronIcon />}
            goToMenu="betting-pool"
            className='bet-pool'>
            Betting Pool
          </DropdownItem>
          <p className='chat-header'>Group X</p>
          <div className="chat-box"> 
            <p className="friend-msg">this game has been wild, stars looks like they're in trouble</p>
            <p className="username">Michael</p>
            <p className="friend-msg">IK.. HAVE FAITH!!</p>
            <p className="username">Bianca</p>
            <p className="my-msg">Tampa is getting too confident here</p>
            <p className="username-me">Caitlan</p>
            <p className="friend-msg">Lots of hockey left</p>
            <p className="username">Wael</p>

            <SendMsg/>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

function SendMsg(){
  return(
    <input className="type-msg" placeholder="Say Something..." ></input>
  );
}

function PlayerRatings(props){
  return(<p>{props.player} : {props.rating}</p>)
}
function Team(props){
  return(<p>{props.teamname}</p>)
}

function PlayerStats(props){
  return(
    <div>
      <h2>{props.player}</h2>
      <p>Shooting %: {props.shot}</p>
      <p>Passing %: {props.pass}</p>
      <p>Expected Goals : {props.xgoals} goals</p>
      <p>Ice Time: {props.shifttime} min</p>
    </div>
  );
}

function RadioButtonsGroup() {
  return (
    <div className='radio-btn'>
        <input type="radio" value="Yes" name="bet" /> Dallas Stars: -176 
        <input type="radio" value="No" name="bet" /> Tampa Bay: +286
    </div>
  );
}

function RadioButtonsGroup2() {
  return (
    <div className='radio-btn2'>
        <input type="radio" value="Yes" name="bet2" /> Yes
        <input type="radio" value="No" name="bet2" /> No
    </div>
  );
}

function Video() {
  return(
    <div className="movie" width='100px'>
      <video src={video1}  autoplay="true" className="video-map"/>
    </div>
  );
}

function Video2() {
  return(
    <div className="movie2" width='300px'>
      <video src={video2}  autoplay="true" className="video-notif"/>
    </div>
  );
}



export default App;