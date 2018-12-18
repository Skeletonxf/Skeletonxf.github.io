if (platforms === undefined) {
  var platforms = {}
}

let gameState = {
  menu: true
}

function menu(canvas, ctx) {
  let draw = new platforms.Draw(canvas, ctx)
  draw.clear()
  let w = canvas.width
  let h = canvas.height
  let gradient = ctx.createLinearGradient(
    w / 2,
    0,
    w / 2,
    h
  )
  gradient.addColorStop(0, 'lightblue')
  gradient.addColorStop(1, 'darkblue')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  draw.fillRect(
    w / 8,
    (h / 2) - (h / 8),
    (3*w) / 4,
    (h / 4),
    'lightblue'
  )
  draw.strokeRect(
    5,
    w / 8,
    (h / 2) - (h / 8),
    (3*w) / 4,
    (h / 4),
    'darkblue'
  )
  draw.text(
    'Press enter to start',
    w / 4,
    (h / 2) + (h / 32),
    w / 2,
    'black'
  )
}

platforms.initialise = function() {
  document.body.addEventListener('keypress', (event) => {
    var key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
      gameState.menu = false
    }
  })
}

platforms.gameLoop = function(canvas, ctx) {
  window.requestAnimationFrame(() => { platforms.gameLoop(canvas, ctx) })

  if (gameState.menu) {
    menu(canvas, ctx)
    return
  }

  let w = canvas.width
  let h = canvas.height
  let w2 = w / 2
  let w4 = w / 4
  let h2 = h / 2
  let h4 = h / 4
  let w8 = w / 8
  let h8 = h / 8
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'red'
  ctx.fillRect(Math.floor(w4), Math.floor(h4), Math.floor(w2), Math.floor(h2))
  ctx.fillRect(Math.floor(w8), Math.floor(h8), Math.floor(w8), Math.floor(h8))
}
