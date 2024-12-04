import { useState } from 'react'
import React from "react";
import {nanoid} from "nanoid";
import Letter from "./Letter"
import ConfettiExplosion from 'react-confetti-explosion';
export default function App() {

  const [wordToGuess,setWordToGuess] = useState("");
  const [guessed,setGuessed] = useState(parseInt(localStorage.getItem("guess")) || 0);
  const [triesLeft,setTriesLeft] = useState(5);
  const [checkEnd,setCheckEnd] = useState(false);
  const [gameStarted,setGameStarted] = useState(false);
  const [triedLetters,setTriedLetters] = useState([]);
  const [inputValue,setInputValue] = useState("");
  const [gameReset,setGameReset] = useState(0);
  const [wordsArray,setWordsArray] = useState([]);
  const [barColor,setBarColor] = useState(0)
  const [randomWord,setRandomWord] = useState(false);

  // localStorage.setItem("guessedCount",1);
  React.useEffect(()=>{
    if(randomWord){
       fetch("https://random-word-api.herokuapp.com/word")
    .then(res=>res.json())
    .then(data=>setWordToGuess(data[0].split("").map(letter=>{
      return {
        value: letter,
        isShown: false
      }
    })));
    }
    if(wordsArray.length!==0){
      let randomWordIndex=Math.floor(Math.random()*wordsArray.length);
      setWordToGuess(wordsArray[randomWordIndex].split("").map(letter=>{
        if(letter!==" "){
          return{
            value: letter.toLowerCase(),
            isShown: false
          }
        }
        else return {
          value: "",
          isShown: true
        }
      }))
    }
    
    // fetch("https://random-word-api.herokuapp.com/word")
    // .then(res=>res.json())
    // .then(data=>setWordToGuess(data[0].split("").map(letter=>{
    //   return {
    //     value: letter,
    //     isShown: false
    //   }
    // })));
    
  },[gameStarted,gameReset])
  React.useEffect(()=>{
    setBarColor(prevBarColor=>prevBarColor+50)
  },[triesLeft])
   let wordToRender=[];
  React.useEffect(()=>{
    if(wordToGuess){
      if(wordToGuess.every(letter=>letter.isShown)){
        console.log(guessed);
        const newGuessed=guessed+1
        localStorage.setItem("guess",newGuessed)
        setGuessed((guessed)=>guessed+1);
        setCheckEnd("win");
      }
    }
  },[wordToGuess])
 if(wordToGuess){
  for(let i=0; i<wordToGuess.length; i++){
    if(checkEnd=="lose"){
      if(wordToGuess[i].isShown){
        if(wordToGuess[i].value==""){
          wordToRender.push(<span className='spaced'></span>);
        }
        else wordToRender.push(<span key={nanoid()} className='letterInWord'>{wordToGuess[i].value}</span>);
    } 
    else if(!wordToGuess[i].isShown){
      wordToRender.push(<span className='notInWord'>{wordToGuess[i].value}</span>)
    }
  }
  else if(wordToGuess[i].isShown){
            if(wordToGuess[i].value==""){
              wordToRender.push(<span className='spaced'></span>);
            }
           else wordToRender.push(wordToGuess[i].value)
    }
    else wordToRender.push(" _");

  }
}
 console.log(wordToRender);
 if(triesLeft===0 && checkEnd!=="lose"){
  setTimeout(() => {
       setCheckEnd("lose");

  }, 500);
 }
 function checkForLetter(value){
  
  if(!triedLetters.includes(value)){
    if(wordToGuess.every(letter=>letter.value!==value.toLowerCase() && triesLeft)){
      setTriesLeft(triesLeft=>triesLeft-1);
      
    }
    else setWordToGuess((oldWordToGuess)=>{
      return oldWordToGuess.map(oldLetter=>{
      return oldLetter.value==value.toLowerCase() ? {...oldLetter, isShown: true} : oldLetter
      })
    })
    setTriedLetters(tried=>[...tried,value])
  }
}
  function restartGame(){
    setCheckEnd(false);
    setWordsArray([]);
    setBarColor(0);
    setRandomWord(false);
    setGameStarted(false);
    setTriesLeft(5);
    setWordToGuess("");
    setTriedLetters([]);
  }
 function handleInput(event){
  const englishPattern = /^[a-zA-Z]+$/;

  if(event.key==="Enter"){
    if(inputValue.length>=3 && ![...inputValue].every(letter=>letter=="" || letter==" ") && inputValue[0]!==" " && englishPattern.test(inputValue)){
      let correct=true;
      for(let i=1; i<inputValue.length; i++){
        correct = inputValue[i]==" " && inputValue[i]==inputValue[i-1] ? false : true  
      }
      if(correct){
        setWordsArray(prev=>[...prev,inputValue]);
        setInputValue("");
      }
    }
  }
 }
  let keysArray=[];
  function removeWord(indexWord){
    setWordsArray(words=>{
     const newWords=[...words];
     newWords.splice(indexWord,1);
     console.log(newWords);
     return newWords;
    })
  }
  function restartSameGame(){
    setCheckEnd(false);
    setBarColor(0);
    setGameReset(resets=>resets+1);
    setTriesLeft(5);
    setWordToGuess("");
    setTriedLetters([]);
  }
  function makeRandom(){
    setRandomWord(true);
    setGameStarted(true);
    
  }
  function setNewWords(){
    setRandomWord(false);
    setCheckEnd(false);
    setBarColor(0);
    setGameStarted(false);
    setTriesLeft(5);
    setWordToGuess("");
    setTriedLetters([]);
  }
  for(let i=65; i<=90; i++){
    keysArray.push(String.fromCharCode(i));
  }
  let keysElements=keysArray.map(letter=>{
    return <Letter word={wordToGuess} key={nanoid()} triedLetters={triedLetters}  checkForLetter={checkForLetter}  value={letter}/>
  })
  function checkGameConditions(){
    if(wordsArray.length>=5){
      setGameStarted(true);
    }
  }
   if(!gameStarted){

    const words=wordsArray.map((word,index)=>{
      return <li onClick={()=>removeWord(index)}  key={nanoid()}>{word}</li>
    })
    return(
      <div className='startCont'>
        <h1>Choose Your Own Words and Play  a Nice Game of Hangman!</h1>
        <h4>At Least 5 Words :)</h4>
          <input value={inputValue} placeholder='Press Enter to Add Word...' onKeyDown={handleInput} onChange={(e)=>setInputValue(e.target.value)}></input>
          <button onClick={checkGameConditions}>Start Game</button>
          <button onClick={makeRandom}> Random Word</button>
          <div className='wordsStart'>
            <h2>Words</h2>
            <ul>{words}</ul>
            </div>

      </div>
    )
  }
 else if(checkEnd!=="lose") { 
  return (
    <>
    <div className="container">
    {checkEnd==="win" && <ConfettiExplosion/>}
    <h1 style={{fontWeight: "700"}}>Score: {guessed}</h1>
       <h2 className='renderWord'>{wordToRender}</h2>
       <div className={`hangman hangman${triesLeft}`}></div>
             <div className={`triesLeft`} style={{width: `${triesLeft/5*100-5}%`,backgroundColor: `rgb(255,${300-barColor},${300-barColor})`}}></div>
      {!checkEnd &&<div className="keysCont">
        {keysElements}
        </div>
 }
 <div className='btnsCont'>
 <button className='gameBtnPlayAgain' onClick={restartSameGame}>Play Again</button>
  <button className='gameBtnPlayAgain' onClick={setNewWords}>Change Words</button>
  <button className='gameBtnPlayAgain' onClick={restartGame}>New Game</button>
 </div>
  

    </div>
    </>
  )
  }
  else if(checkEnd==="lose") {
    return(
      <div className='loseScreen'>
      {console.log(wordToRender)}
    {checkEnd==="lose" && <h1 style={{color: "red"}}>You Lost</h1>}
    <h2 className='renderWord'>{wordToRender}</h2>
    <div className='btnsCont'>
 <button className='gameBtnPlayAgain' onClick={restartSameGame}>Play Again</button>
  <button className='gameBtnPlayAgain' onClick={setNewWords}>Change Existing Words</button>
  <button className='gameBtnPlayAgain' onClick={restartGame}>New Game</button>
 </div>

    </div>
  )
}

}

