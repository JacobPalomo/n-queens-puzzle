;(() => {
	const title = document.querySelector('title')
	const queensList = document.querySelector('#queens-list')
	const coords = document.querySelector('.coords')
	const canvas = document.querySelector('#canvas')
	const ctx = canvas.getContext('2d')

	const errorSpan = document.querySelector('.error')

	const n = location.search.split('=')[1]

	title.textContent += ` ${n}`

	/* CONFIGURAMOS EL TAMAÑO DEL CANVAS */
	const setCanvasSize = () => {
		const screenSize = window.innerWidth
		const outerMargin = screenSize * 0.2

		canvas.width = screenSize - outerMargin
		canvas.height = screenSize - outerMargin
		coords.style.height = coords.offsetWidth + 'px'

		coords.children[0].innerHTML = ''
		coords.children[1].innerHTML = ''
		for (let i = 0; i < n; i++) {
			const span = document.createElement('span')
			span.textContent = i + 1
			coords.children[0].appendChild(span)
		}

		for (let i = 0; i < n; i++) {
			const span = document.createElement('span')
			span.textContent = i + 1
			coords.children[1].appendChild(span)
		}

		const vlis = coords.children[1].children
		for (let i = 0; i < vlis.length; i++) {
			vlis[i].style.height = coords.offsetHeight / n + 'px'
		}
		const hlis = coords.children[0].children
		for (let i = 0; i < hlis.length; i++) {
			hlis[i].style.width = coords.offsetWidth / n + 'px'
		}
	}

	setCanvasSize()

	/* PINTAMOS EL TABLERO */
	const drawChessboard = () => {
		setCanvasSize(canvas)

		const cellSize = canvas.width / n
		let currentColor = false
		const colors = {
			true: '#FECFA0',
			false: '#D28C45',
		}

		for (let i = 0; i < n; i++) {
			if (n % 2 === 0) {
				currentColor = !currentColor
			}
			for (let e = 0; e < n; e++) {
				currentColor = !currentColor
				ctx.fillStyle = colors[currentColor]
				ctx.fillRect(cellSize * e, cellSize * i, cellSize, cellSize)
			}
		}
	}

	const isValidCoordinate = (chessboard, row, col) => {
		let horizontal, vertical
		for (horizontal = 0; horizontal < col; horizontal++) {
			if (chessboard[row][horizontal]) {
				return false
			}
		}

		for (
			vertical = row, horizontal = col;
			vertical >= 0 && horizontal >= 0;
			vertical--, horizontal--
		) {
			if (chessboard[vertical][horizontal]) {
				return false
			}
		}

		for (
			vertical = row, horizontal = col;
			horizontal >= 0 && vertical < n;
			vertical++, horizontal--
		) {
			if (chessboard[vertical][horizontal]) {
				return false
			}
		}

		return true
	}

	const canResolve = (chessboard, col) => {
		if (col >= n) {
			return true
		}

		for (let row = 0; row < n; row++) {
			if (isValidCoordinate(chessboard, row, col)) {
				chessboard[row][col] = 1

				if (canResolve(chessboard, col + 1)) {
					return true
				}

				chessboard[row][col] = 0
			}
		}

		return false
	}

	const writeSolution = (chessboard) => {
		queensList.innerHTML = ''
		let queenCounter = 0
		for (let row = 0; row < n; row++) {
			for (let col = 0; col < n; col++) {
				if (chessboard[row][col] === 1) {
					queenCounter++
					const li = document.createElement('li')
					li.textContent = `Reina ${queenCounter}: [${row + 1}, ${
						col + 1
					}]`
					queensList.appendChild(li)
				}
			}
		}
	}

	const resolve = () => {
		let chessboard = new Array()
		let row = new Array()
		for (let i = 0; i < n; i++) {
			row = new Array()
			for (let j = 0; j < n; j++) {
				row.push(0)
			}
			chessboard.push(row)
		}

		if (canResolve(chessboard, 0) == false) {
			if (errorSpan.classList.contains('hidden')) {
				errorSpan.classList.remove('hidden')
			}
			errorSpan.textContent = `No tiene solución para n = ${n}.`
			return false
		}

		errorSpan.classList.add('hidden')

		writeSolution(chessboard)
		drawChessboard(chessboard)
		drawQueens(chessboard)
		return true
	}

	/* DIBUJAMOS LAS REINAS */
	const drawQueens = (chessboard) => {
		const queen = new Image()
		queen.src = '../assets/chess-queen.svg'

		const queenSize = canvas.width / n
		queen.onload = function () {
			for (let x = 0; x < n; x++) {
				for (let y = 0; y < n; y++) {
					const posX = x * queenSize
					const posY = y * queenSize
					if (chessboard[x][y] !== 0) {
						ctx.drawImage(queen, posX, posY, queenSize, queenSize)
					}
				}
			}
			ctx.beginPath()
			ctx.stroke()
		}
	}

	drawChessboard()
	resolve()

	window.addEventListener('resize', () => {
		setCanvasSize()
		drawChessboard()
		resolve()
	})
})()
