const boardSize = 4;
var board = new Array(boardSize);
var result = new Set();
var splitText = [];
var currentWord = "";
var vis = Array(boardSize);
var alreadySwiped = new Map();
var temp = "";

function createBoardArr()
{
    generateSolutions();
    while(result.size<150)
    {
        for(var i = 0;i<4;i++)
        {
            board[i] = new Array(4);
            for(var j = 0;j<4;j++)
            {
                board[i][j]=genLetters();
            }
        }
        result = new Set();
        var trie = new Trie(splitText);

        for(var i = 0;i<boardSize;i++)
        {
            vis[i]=Array(boardSize).fill(false);
        }

        for(var i = 0;i<board.length;i++)
        {
            for(var j = 0;j<board[i].length;j++)
            {
                dfs(i,j,"", trie.root);
            }
        }
    }
    var resultsArr = Array.from(result);
    resultsArr.sort((a,b) => a.length - b.length);
    for(let ele of resultsArr)
    {
        console.log(ele);
    }

}

//Implement Trie Data Structure
class Trie{
    constructor(words){
        this.root = {}
        this.isWord = false;
        for(let word of words)
            this.addWord(word);
    }
    
    addWord(word){
        let curr = this.root
        for(let c of word)
        {
            if(!curr[c])curr[c]={};
            curr=curr[c];
        }
        curr.isWord = true;
    }

}

//returns score of string based on length
function getScore(s)
{
    if(s.length ==3) return 100;
    else if(s.length==4) return 400;
    else if(s.length==5) return 800;
    else if(s.length==6) return 1400;
    else if(s.length==7) return 1800;
    else if(s.length==8) return 2200;
    else if(s.length==9) return 2600;
    else if(s.length==10) return 3000;
    return 0;
}

 //dfs on trie
 function dfs(r,c,curr, node)
 {
    if(r<0||c<0||r>=board.length||c>=board[r].length || vis[r][c] || !node[board[r][c]]) return;

    var letter = board[r][c];
    curr += letter;
    node = node[letter];


    vis[r][c]=true;
    //recursively check vertical, horizontal, and diagonal cells
    dfs(r+1,c,curr, node);
    dfs(r-1,c,curr, node);
    dfs(r,c+1,curr, node);
    dfs(r,c-1,curr, node);
    dfs(r+1,c+1,curr, node);
    dfs(r+1,c-1,curr, node);
    dfs(r-1,c+1,curr, node);
    dfs(r-1,c-1,curr, node);

    vis[r][c]=false;
    if(node.isWord)
    {
        if(curr.length>=3)
        {
            result.add(curr);
        }
    }

 }

//reading in wordlist
function generateSolutions()
{
    var request = new XMLHttpRequest();
    request.open("GET", "wordlist.txt", false);
    request.send(null);
    text = request.responseText;        
    splitText = text.split(/\s+/);
}

//generates letters based on the scrabble letter distribution
function genLetters()
{
    var characters = "AAAAAAAAABBCCDDDDEEEEEEEEE" + 
    "EEEFFGGIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRR" +
    "RRRRSSSSTTTTTTUUUUVVWWXYYZ";
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

//Creates an NxN html table with random characters in it
function createBoard()
{
    createBoardArr();
    var i, j
    var id = "board";
    var table = '<table id="' + id + '"class="gameboard">';

    for(i = 0;i<boardSize;i++)
    {
        table += '<tr>'; 
        for(j = 0;j<boardSize;j++)
        {
            var c = board[i][j];
            var position = i.toString() + j.toString(); 
            table += '<td>' + c +  '</td>';
        }
    }
    table += '</table>'
    document.write(table);
}

//makes text in boxes unselectable to prevent dragging errors
function makeUnselectable()
{
    for(let cell of document.querySelectorAll("td"))
    {
        cell.setAttribute("unselectable","on");
    }
}

function createAnswerboard()
{
    var ans = "";
    var answertable = '<table class="answerboardtable">'
    answertable += '<tr id = "answerboardtd" + >' + '<td>'+ ans + '</td>' + '</tr>' + '</table>';
    document.write(answertable);
}

function createScoreBoard()
{
    var score = 0;
    var scoretable = '<table class="scoreboardtable">'
    scoretable += '<tr>' + '<td  id = "scoreboardtd" + >'+ score + '</td>' +
    '<td id = "scoreboardtimer">'+"Click here to begin game" + '</td>'+'</tr>' + '</table>';
    document.write(scoretable);
}

//appends the character that was last selected onto the ans
function appendCharacter(lastSelectedChar)
{
    var answerboard = document.getElementById("answerboardtd");
    answerboard.textContent += lastSelectedChar;
    var str = answerboard.textContent;
    currentWord = str;
    if(alreadySwiped.has(currentWord))
    {
        temp = answerboard.textContent;
        answerboard.textContent = "already found";
    }
    checkWord(str);
}

function checkWord(str)
{
    if(result.has(str))
    {        
        for(let cell1 of document.querySelectorAll("td.clicked"))
        {
            cell1.className="found";
        }
    }
}

function resetAnswerboard()
{
    var answerboard = document.getElementById("answerboardtd");
    answerboard.textContent = "";
}

function checkIfSwipable(cell1)
{
    //turn everything unclickable except cell
    for(let cell2 of document.querySelectorAll("td"))
    {
        if (cell2!= cell1 && cell2.className!="clicked" && cell2.className!="found")
        {
            cell2.className = "";
        }
    }

    var r = cell1.closest('tr').rowIndex
    var c = cell1.cellIndex
    var board = document.getElementById("board");
    var boardAsArray = board.getElementsByTagName("tr");
    var row = boardAsArray[r].getElementsByTagName("td");


    //Current Squares
    if(c-1>=0 && row[c-1].className=="")
        row[c-1].className="clickable";
    if(c+1<boardSize && row[c+1].className=="")
        row[c+1].className="clickable";

    //Below Squares
    if(r-1>=0)
    {
        var rowBelow = boardAsArray[r-1].getElementsByTagName("td");
        
        //Make the three squares in the row below clickable if they are not already clicked
        
        if(rowBelow[c].className=="")
            rowBelow[c].className = "clickable";
        if(c+1<boardSize && rowBelow[c+1].className =="") 
            rowBelow[c+1].className = "clickable"; 
        if(c-1>=0 && rowBelow[c-1].className =="")
            rowBelow[c-1].className = "clickable"; 
    }

    //Above squares
    if(r+1<boardSize)
    {
        var rowAbove = boardAsArray[r+1].getElementsByTagName("td");

        //Make the three squares in the row aobve clickable if they are not already clicked
        if(rowAbove[c].className=="")
            rowAbove[c].className = "clickable";
        if(c+1<boardSize && rowAbove[c+1].className =="") 
            rowAbove[c+1].className = "clickable"; 
        if(c-1>=0 && rowAbove[c-1].className =="")
            rowAbove[c-1].className = "clickable"; 
    }
}

function beginTimer()
{
    document.getElementById("scoreboardtimer").onclick = "#";
    for(let cell of document.querySelectorAll("td"))
    {
        cell.className = "clickable";
    }
    var sec = 5;
    var timer = setInterval(function(){
        document.getElementById('scoreboardtimer').innerHTML="Time:" + sec+'s';
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            document.getElementById('scoreboardtimer').innerHTML="Click here to reset the game";
            document.getElementById("scoreboardtimer").onclick = function()
            {
                window.location.reload();
            }
        }
    },1000)
}

//actually playing the game
function game()
{
    beginTimer();
    var mouseCheck = false;
    var found = 0;
    var currCell;
    
    for(let cell1 of document.querySelectorAll("td.clickable"))
    {
        cell1.onmousedown = function()
        {
            checkIfSwipable(cell1);
            mouseCheck = true;
            cell1.className = "clicked";
            appendCharacter(cell1.textContent);
            for(let cell2 of document.querySelectorAll("td"))
            {
                cell2.onmouseleave = function()
                {
                    var answerboard = document.getElementById("answerboardtd");
                    if(answerboard.textContent == "already found")
                    {
                        answerboard.textContent = temp;
                    }
                }
                cell2.onmouseenter = function()
                {
                    if(mouseCheck && cell2.className == "clickable")
                    {
                        cell2.className = "clicked";
                        checkIfSwipable(cell2);
                        appendCharacter(cell2.textContent);   
                        if(cell2.className!="found")
                        {
                            for(let cell3 of document.querySelectorAll("td.found"))
                            {
                                cell3.className = "clicked";
                            }
                        }
                    }
                }
            }
        }
    }
    //if mouse up then reset the gameboard and answerboard
    window.addEventListener('mouseup', function(){
        for(let foundCells of this.document.querySelectorAll("td"))
        {
            if(foundCells.className == "found")
            {
                found = true;
            }
        }
        if(found)
        {
            alreadySwiped.set(currentWord,1);
            result.delete(currentWord);
            var scoreboard = document.getElementById("scoreboardtd");
            var score = scoreboard.textContent;
            var scoreInt = getScore(currentWord);
            scoreInt += parseInt(score);
            score = scoreInt + '';
            scoreboard.textContent = score;
        }
        for(let cell2 of document.querySelectorAll("td"))cell2.className="clickable";
        mouseCheck = false;
        currentWord = '';
        found = false;
        resetAnswerboard();
    })
}

//driver function
function playGame()
{
    createScoreBoard();
    createBoard(); 
    createAnswerboard();
    makeUnselectable();
    var startGame = document.getElementById("scoreboardtimer");
    startGame.onclick = function()
    {
        game(); 
    }
}

playGame();
