const board = new Array(4);

for(var i = 0;i<4;i++)
{
    board[i] = new Array(4);
    for(var j = 0;j<4;j++)
    {
        board[i][j]=genLetters();
    }
}
const map1  = new Map();

var fs = require('fs');
var text = fs.readFileSync('wordlist.txt', 'utf8');
var words = text.split("\n");
 
for(var i = 0;i<words.length;i++)
{
    var temp = words[i].substring(0,words[i].length-1);
    words[i]=temp;
    //if(temp.length>=3)map1.set(temp, 1);
}

function genLetters()
{
    let charcode = Math.round(65 + Math.random()*25)
    return String.fromCharCode(charcode)
}


const Row = 4, Col = 4;
var vis = Array(Row);
for(var i = 0;i<Row;i++)
{
    vis[i]=Array(Col).fill(false);
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
        if(curr.length>=3)result.add(curr);
    }

}

const result = new Set();
const trie = new Trie(words);
const start = Date.now();
for(var i = 0;i<board.length;i++)
{
    for(var j = 0;j<board[i].length;j++)
    {
        dfs(i,j,"", trie.root);
    }
}

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

var totalScore = 0;
for(let ele of result)
{
    console.log(ele);
    var score = getScore(ele);
    totalScore += score;
}

for(var i = 0;i<4;i++)
{
    for(var j = 0;j<4;j++)
    {
        process.stdout.write(board[i][j] + " ");
    }
    process.stdout.write("\n");
}
console.log("There are this many words: " + result.size)

console.log("Total obtainable score is: " + totalScore);
const duration = Date.now() - start;
console.log("Time spent in ms: " + duration);









