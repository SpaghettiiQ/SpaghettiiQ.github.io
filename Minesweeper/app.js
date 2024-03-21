document.addEventListener('DOMContentLoaded', () => {
    const body = document.body
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const restart = document.querySelector('#restart')
    let width = 10
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameOver = false

    //create Board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            //cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()

    //add Flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '⚑'
                flags++
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    //click on square actions
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }


    //check neighboring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                //const newId = parseInt(currentId) - 1   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                //const newId = parseInt(currentId) +1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                //const newId = parseInt(currentId) -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                //const newId = parseInt(currentId) -1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                //const newId = parseInt(currentId) +1   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                //const newId = parseInt(currentId) -1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                //const newId = parseInt(currentId) +1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                //const newId = parseInt(currentId) +width   ....refactor
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    //game over
    function gameOver(square) {
        result.innerHTML = 'Game Over'
        restart.style.opacity = '1'
        isGameOver = true

        //show ALL the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '<svg width="31" height="31" viewBox="0 0 1000 1001" xmlns="http://www.w3.org/2000/svg"><path id="Path" fill="#181926" stroke="none" d="M 671 167.445984 L 716 168.445984 C 719 168.445984 722 166.445984 722 162.445984 L 722 149.445984 C 722 146.445984 720 143.445984 717 143.445984 L 672 143.445984 C 669 142.445984 666 145.445984 666 148.445984 L 666 161.445984 C 666 164.445984 668 167.445984 671 167.445984 Z M 777 144.445984 C 779 147.445984 782 148.445984 785 146.445984 L 820 125.445984 C 823 123.445984 824 119.445984 822 117.445984 L 815 105.445984 C 814 103.445984 810 102.445984 808 104.445984 L 772 125.445984 C 770 127.445984 769 130.445984 770 133.445984 Z M 718 110.445984 C 719 113.445984 722 115.445984 725 114.445984 L 737 109.445984 C 740 108.445984 742 104.445984 741 101.445984 L 727 66.445984 C 726 63.445984 722 62.445984 720 63.445984 L 707 68.445984 C 704 69.445984 703 72.445984 704 75.445984 Z M 602 304.445984 L 602 241.445984 L 521 241.445984 C 532 203.445984 558 175.445984 608 194.445984 C 638 205.445984 666 223.445984 696 235.445984 C 715 243.445984 746 254.445984 765 238.445984 C 789 218.445984 774 179.445984 765 156.445984 C 760 140.445984 735 147.445984 740 162.445984 C 744 173.445984 763 214.445984 745 220.445984 C 733 224.445984 714 214.445984 703 210.445984 C 673 199.445984 645 181.445984 615 169.445984 C 548 141.445984 510 186.445984 495 241.445984 L 398 241.445984 L 398 303.445984 C 269 346.445984 175 468.445923 175 612.445923 C 175 792.445923 321 938.445923 500 938.445923 C 679 938.445923 825 792.445923 825 612.445923 C 825 468.445923 732 346.445984 602 304.445984 Z"/></svg>'
                square.classList.remove('bomb')
                square.classList.add('checked')
                square.style.paddingTop = '1px'
            }
        })
    }

    //check for win
    function checkForWin() {
        ///simplified win argument
        let matches = 0

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!'
                result.style.color = '#a6e3a1'
                restart.style.opacity = '1'
                isGameOver = true
            }
        }
    }
})