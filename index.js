function genLetters()
{
    let charcode = Math.round(65 + Math.random()*25)
    return String.fromCharCode(charcode)
}
var boardSize = 4;
function createBoard(boardSize)
{
    var i, j
    var id = "gameboard";
    var table = '<table id="' + id + '"class="gameboard">';

    for(i = 0;i<boardSize;i++)
    {
        table += '<tr>'; 
        for(j = 0;j<boardSize;j++)
        {
            table += '<td>'+ genLetters() +  '</td>';
        }
    }
    table += '</table>'
    document.write(table);
}
function makeUnselectable()
{
    for(let cell of document.querySelectorAll("td"))
    {
        cell.setAttribute("unselectable","on");
    }
}

//driver program
function playGame()
{
    createBoard(4); 
    for(let cell of document.querySelectorAll("td"))
    {
        cell.onmousedown = function()
        {
            cell.className = "clicked";
        }
        cell.onmouseup = function()
        {
            for(let cell2 of document.querySelectorAll("td.clicked"))cell2.className="";
        }

    }
}

playGame();