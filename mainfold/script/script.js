// info of game
let cardgame={
    "you":{"resultspan":"#you-result", "div":"#you","score":0},
    "dealer":{"resultspan":"#dealer-result","div":"#dealer","score":0},
    "cards":["2","3","4","5","6",'7','8','9','10','K','J','Q','A'],
    "cardsvalue":{"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"K":10,"J":10,"Q":10,"A":[1,11]},
    'wins':0,
    'lose':0,
    'draws':0,
    "isStand":false,
    "turnsOver":false,
};


// constant values
const you=cardgame["you"];
const dealer=cardgame["dealer"];
const cards=cardgame["cards"];
const hitsound =new Audio("mainfold/sound/swish.m4a");
const winsound = new Audio("mainfold/sound/cash.mp3");
const lossound = new Audio("mainfold/sound/aww.mp3");

document.querySelector("#hit-button").addEventListener('click',buthit);
document.querySelector("#deal-button").addEventListener('click',butdeal);
document.querySelector("#stand-button").addEventListener("click",butstand);

//hit button function
function buthit(){
    if (cardgame["isStand"]==false){
        let racard=randomcard();
        console.log(racard);
        showcard(racard,you);
        updatescore(racard,you);
        showscore(you);
    }
}

function randomcard(){
    let randomindex=Math.floor(Math.random()*13);
    return cards[randomindex];
}

function showcard(card,activeplayer){
    if (activeplayer["score"] <= 21){
        let cardimg=document.createElement("img");
        cardimg.src=`mainfold/images/${card}.png`;
        document.querySelector(activeplayer["div"]).appendChild(cardimg);
        hitsound.play();
    }
}

//deal button function
function butdeal(){
    cardgame['isStand']=false;
    if(cardgame['turnsOver']==true){
        let yourimg=document.querySelector("#you").querySelectorAll("img");
        let dealerimg=document.querySelector("#dealer").querySelectorAll("img"); 
        for (let i=0;i<yourimg.length;i++){
            yourimg[i].remove();
        }
        for (let i=0;i<dealerimg.length;i++){
            dealerimg[i].remove();
        }
        you["score"]=0;
        dealer["score"]=0;
        document.querySelector("#you-result").textContent=0;
        document.querySelector("#dealer-result").textContent=0;
        document.querySelector("#you-result").style.color="white";
        document.querySelector("#dealer-result").style.color="white";
        document.querySelector("#lastResult").textContent="Let's play";
        document.querySelector("#lastResult").style.color="white"; 
        cardgame['turnsOver']=false;   
    } 
}

//updatescore
function updatescore(card,activeplayer){
    //if adding 11 keeps me below 21,add 11 else add 1
    if (card=="A"){
        if (activeplayer["score"] + cardgame["cardsvalue"][card][1] <=21){
            activeplayer["score"] +=cardgame["cardsvalue"][card][1];
        }else{
            activeplayer["score"] +=cardgame["cardsvalue"][card][0];
        }
    }else{
    activeplayer["score"] += cardgame["cardsvalue"][card];
    }
}

//function to show score in frontend
function showscore(activeplayer){
    if(activeplayer["score"]>21){
        document.querySelector(activeplayer["resultspan"]).textContent =" BUST !!";
        document.querySelector(activeplayer["resultspan"]).style.color="red";
    }else{
        document.querySelector(activeplayer["resultspan"]).textContent = activeplayer["score"]
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
//function for stand button
async function butstand(){
    cardgame["isStand"]=true;
    while(cardgame['dealer']['score']<16){
        let card=randomcard() ;
        showcard(card,dealer);
        updatescore(card,dealer);
        showscore(dealer); 
        await sleep(1000);
    } 
    cardgame['turnsOver']=true;
    let winners=winner();
    showresult(winners);
    
}

//compute the winner and return who lose
//update wins and lose and draws
function winner(){
    let winner;
    if (you["score"] <=21){
        if (you["score"] >dealer["score"] || dealer["score"] >21){  //win
            cardgame["wins"]++;
            winner=you;
        }else if(you['score'] < dealer["score"]){                   //loss
            cardgame["lose"]++;
            winner=dealer;
        }else if(you["score"] == dealer["score"]){                  //draw
            cardgame["draws"]++;
        }
    }else if(you["score"]>21 && dealer["score"] <=21){
        console.log("you lost");
        cardgame['lose']++;
        winner=dealer;
    }else if(you["score"]>21 && dealer["score"] > 21){
        cardgame["draws"]++;
        console.log("you drew");
    }
    console.log("winner is",winner);
    return winner;
}

//to show result in top
function showresult(winners){
        if (cardgame["turnsOver"]==true){
        let message,messangecolor;
        if(winners==you){
            message="you won!";
            messagecolor="green";
            winsound.play();
        }else if(winners==dealer){
            message="you lost!";
            messagecolor="red";
            lossound.play();
        }else {
            message="you drew!";
            messagecolor="yellow";
        }
        document.querySelector("#lastResult").textContent=message;
        document.querySelector("#lastResult").style.color=messagecolor;
        document.querySelector("#wins").textContent=cardgame["wins"];
        document.querySelector("#losses").textContent=cardgame['lose'];
        document.querySelector("#draws").textContent=cardgame['draws'];
    }
}