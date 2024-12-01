import React from "react";

export default function Letter({value,word,checkForLetter,triedLetters}){

  
  let wordToGuess=[...word]
  let tried=[...triedLetters]
    let style="";
  if(wordToGuess.some(letter=>letter.value==value.toLowerCase()) && tried.includes(value)){
    style="letterInWord"
  }
  else if(wordToGuess.some(letter=>letter.value!==value.toLowerCase())&& tried.includes(value)){
    style="notInWord"
  }
  else style="button";


    return(
        <button className={style} onClick={()=>checkForLetter(value)}> {value} </button>
    )
}