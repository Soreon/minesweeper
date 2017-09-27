var gameOver = false;
var domCells = [];
var domLines = [];

function getCell(l, c) { return domCells[l] ? (domCells[l][c] ? domCells[l][c] : null) : null; }
function getSurroundingCells(c) { 
    var l = domLines.indexOf(c.parentNode);
    var c = domCells[l].indexOf(c);
    return [
        getCell(+l-1,   +c),
        getCell(+l-1,   +c+1),
        getCell(+l,     +c+1),
        getCell(+l+1,   +c+1),
        getCell(+l+1,   +c),
        getCell(+l+1,   +c-1),
        getCell(+l,     +c-1),
        getCell(+l-1,   +c-1)
    ]; 
}
function hasBomb(c) { return c.classList.contains('bomb'); }
function isRevealed(c) { return c.classList.contains('revealed'); }
function createGrid(c, l) {
    var trsFragment = document.createDocumentFragment();
    for(var i=0; i<l; i=i+1) {
        var tr = document.createElement('tr');
        var tdsFragment = document.createDocumentFragment();
        domCells[i] = [];
        for(var j=0; j<c; j=j+1) {
            domCells[i][j] = tdsFragment.appendChild(document.createElement('td'));
        }
        tr.appendChild(tdsFragment);
        domLines[i] = trsFragment.appendChild(tr);
    }
    document.getElementsByTagName('table')[0].appendChild(trsFragment);
    initializeGrid(c, l);
}

function initializeGrid(c, l) {
    for(var i=0; i<l; i=i+1) {
        for(var j=0; j<c; j=j+1) {
            var cell = domCells[i][j];
            var leftCell = getCell(i, (j-1));
            var topCell = getCell((i-1), j);
            var topLeftCell = getCell((i-1), (j-1));
            var topRightCell = getCell((i-1), (j+1));
            if(Math.random() * 5 < 1) {
                cell.classList.add('bomb');
                if(leftCell && !hasBomb(leftCell)) leftCell.textContent++;
                if(topCell && !hasBomb(topCell)) topCell.textContent++;
                if(topLeftCell && !hasBomb(topLeftCell)) topLeftCell.textContent++;
                if(topRightCell && !hasBomb(topRightCell)) topRightCell.textContent++;
            }
            if(leftCell && hasBomb(leftCell)) cell.textContent++;
            if(topCell && hasBomb(topCell)) cell.textContent++;
            if(topLeftCell && hasBomb(topLeftCell)) cell.textContent++;
            if(topRightCell && hasBomb(topRightCell)) cell.textContent++;
            if(hasBomb(cell)) {
                cell.textContent='';
                cell.insertAdjacentHTML('beforeend', '<i class="fa fa-bomb" aria-hidden="true"></i>');
            }
        }
    }
}

function cascadeReveal(target){
    if(target && !isRevealed(target)) {
        target.classList.add('revealed');
        if(hasBomb(target)) {
            gameOver = true;
        } else {
            if(target.textContent == "") {
                var surroundingCells = getSurroundingCells(target);
                cascadeReveal(surroundingCells[0]);
                cascadeReveal(surroundingCells[1]);
                cascadeReveal(surroundingCells[2]);
                cascadeReveal(surroundingCells[3]);
                cascadeReveal(surroundingCells[4]);
                cascadeReveal(surroundingCells[5]);
                cascadeReveal(surroundingCells[6]);
                cascadeReveal(surroundingCells[7]);
            }
        }
    }
}


document.addEventListener("click", function(event){
    if(!gameOver) {
        if(event.target.tagName == 'TD' && !event.target.classList.contains('revealed')) {
            cascadeReveal(event.target);
        }
    }
});

document.addEventListener("contextmenu", function(event){
    event.preventDefault();
    if(!gameOver) {
        if(event.target.tagName == 'TD' && !event.target.classList.contains('revealed')) {
            if(event.target.classList.contains("marked")) {
                event.target.classList.remove("marked");
                event.target.textContent = "";
            } else {
                event.target.classList.add("marked");
            }
        }
    }
});

createGrid(30, 30);