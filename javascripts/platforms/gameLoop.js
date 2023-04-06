if (platforms === undefined) {
  var platforms = {}
}

let gameState = {
  menu: true,
  score: 0,
  paused: false,
  spheres: [],
  player: null
}

function drawGradientBackground(canvas, ctx, draw) {
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
}

function menu(canvas, ctx, draw) {
  draw.clear()
  let w = canvas.width
  let h = canvas.height

  drawGradientBackground(canvas, ctx, draw)

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
    if (event.key === "Enter") {
      gameState.menu = false
      gameState.score = 0
      {
        gameState.spheres = []
        let root = new platforms.Sphere(null, 0, 100, (angle, speed) => {
          return (angle + 0.005) % (2 * Math.PI)
        })
        gameState.spheres.push(root)
        let sphere1 = new platforms.Sphere(root, 180, 150, (angle, speed) => {
          return (angle + 0.01 + (0.001 * Math.sin(angle))) % (2 * Math.PI)
        })
        gameState.spheres.push(sphere1)
        let sphere2 = new platforms.Sphere(sphere1, 180, 100, (angle, speed) => {
          return (angle - 0.01) % (2 * Math.PI)
        })
        gameState.spheres.push(sphere2)
        gameState.player.reset()
      }
    }
  })
  gameState.player = new platforms.Player()
}

function game(canvas, ctx, draw) {
  let w = canvas.width
  let h = canvas.height
  draw.clear()
  drawGradientBackground(canvas, ctx, draw)

  if (gameState.player.alive) {
    gameState.score += 1
  }
  let logScore = Math.floor(Math.sqrt(3 * gameState.score))
  draw.text(logScore + '', w / 4, 50, w / 2, 'black')

  let speed = 0

  gameState.spheres.forEach(s => s.update(speed))
  gameState.spheres.forEach(s => s.draw(canvas, ctx, draw))

  touched = gameState.player.update(gameState.spheres)
  ;[...touched].forEach(s => s.shrink())
  gameState.player.draw(canvas, ctx, draw)
}

platforms.gameLoop = function(canvas, ctx) {
  window.requestAnimationFrame(() => { platforms.gameLoop(canvas, ctx) })

  let draw = new platforms.Draw(canvas, ctx)

  if (gameState.menu) {
    menu(canvas, ctx, draw)
    return
  }

  game(canvas, ctx, draw)
}
