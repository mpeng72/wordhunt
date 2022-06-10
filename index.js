const wordCheckList = new Map();
//reading in wordlist
function generateSolutions()
{
    var request = new XMLHttpRequest();
    request.open("GET", "wordlist.txt", false);
    request.send(null);
    text = request.responseText;        
    var splitText = text.split("\n");
    for(var i = 0;i<splitText.length;i++)
    {
        var temp = splitText[i].substring(0,splitText[i].length-1);
        if(temp.length>=3)wordCheckList.set(temp, 1);
    }
    
}

//helper function that returns 0 whenever a map has no value
function getMapValue(map, key) {
    return map.get(key) || 0;
}



//declare size of NxN gameboard
var boardSize = 4;

//temporary function to generate random letters - Need to update
function genLetters()
{
    let charcode = Math.round(65 + Math.random()*25)
    return String.fromCharCode(charcode)
}

//Creates an NxN html table with random characters in it
function createBoard(boardSize)
{
    var i, j
    var id = "board";
    var table = '<table id="' + id + '"class="gameboard">';

    for(i = 0;i<boardSize;i++)
    {
        table += '<tr>'; 
        for(j = 0;j<boardSize;j++)
        {
            var position = i.toString() + j.toString(); 
            table += '<td>' + genLetters() +  '</td>';
        }
    }
    table += '</table>'
    document.write(table);

    //assign classname of "not clickable"
    for(let cell of document.querySelectorAll("td"))
    {
        cell.className = "clickable";
    }
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
    scoretable += '<tr id = "scoreboardtd" + >' + '<td>'+ score + '</td>' + '</tr>' + '</table>';
    document.write(scoretable);
}

//appends the character that was last selected onto the ans
function appendCharacter(lastSelectedChar)
{
    var answerboard = document.getElementById("answerboardtd");
    answerboard.textContent += lastSelectedChar;
    var str = answerboard.textContent;
    checkWord(str);
}

function checkWord(str)
{
    if(getMapValue(wordCheckList,str)>=1)
    {
        wordCheckList.set(str,0); //prevent answer being selected twice
        var scoreboard = document.getElementById("scoreboardtd");

        console.log("test");
        
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

//driver program
function playGame()
{
    createScoreBoard();
    generateSolutions();
    createBoard(4); 
    createAnswerboard();
    var mouseCheck = false;
    var currCell;

    for(let cell1 of document.querySelectorAll("td"))
    {
        cell1.onmousedown = function()
        {
            checkIfSwipable(cell1);
            mouseCheck = true;
            cell1.className = "clicked";
            appendCharacter(cell1.textContent);
            for(let cell2 of document.querySelectorAll("td"))
            {
                    cell2.onmouseenter = function()
                    {
                        if(mouseCheck && cell2.className == "clickable")
                        {
                            cell2.className = "clicked";
                            checkIfSwipable(cell2);
                            appendCharacter(cell2.textContent);   
                        }
                    }
            }
        }

        //if mouse up then reset the gameboard and answerboard
        window.addEventListener('mouseup', function(){
            for(let cell2 of document.querySelectorAll("td"))cell2.className="clickable";
            mouseCheck = false;
            resetAnswerboard();
        })

    }

}


function checkIfSwipable(cell1)
{
    //turn everything unclickable except cell
    for(let cell2 of document.querySelectorAll("td"))
    {
        if (cell2!= cell1 && cell2.className!="clicked")
        {
            cell2.className = "notclickable";
        }
    }

    var r = cell1.closest('tr').rowIndex
    var c = cell1.cellIndex
    var board = document.getElementById("board");
    var boardAsArray = board.getElementsByTagName("tr");
    var row = boardAsArray[r].getElementsByTagName("td");


    //Current Squares
    if(c-1>=0 && row[c-1].className!="clicked")
        row[c-1].className="clickable";
    if(c+1<boardSize && row[c+1].className!="clicked")
        row[c+1].className="clickable";

    //Below Squares
    if(r-1>=0)
    {
        var rowBelow = boardAsArray[r-1].getElementsByTagName("td");
        
        //Make the three squares in the row below clickable if they are not already clicked
        
        if(rowBelow[c].className!="clicked")
            rowBelow[c].className = "clickable";
        if(c+1<boardSize && rowBelow[c+1].className != "clicked") 
            rowBelow[c+1].className = "clickable"; 
        if(c-1>=0 && rowBelow[c-1].className != "clicked")
            rowBelow[c-1].className = "clickable"; 
    }

    //Above squares
    if(r+1<boardSize)
    {
        var rowAbove = boardAsArray[r+1].getElementsByTagName("td");

        //Make the three squares in the row aobve clickable if they are not already clicked
        if(rowAbove[c].className!="clicked")
            rowAbove[c].className = "clickable";
        if(c+1<boardSize && rowAbove[c+1].className != "clicked") 
            rowAbove[c+1].className = "clickable"; 
        if(c-1>=0 && rowAbove[c-1].className != "clicked")
            rowAbove[c-1].className = "clickable"; 
    }
}


playGame();