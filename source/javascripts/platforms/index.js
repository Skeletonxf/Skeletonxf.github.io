if (platforms === undefined) {
  var platforms = {}
}

// run entire script after full page has loaded
window.addEventListener('load', () => {

let canvas = document.getElementById('game')

// optimise rendering by telling the browser the canvas is opaque
let ctx = canvas.getContext('2d', { alpha: false })

platforms.rescaleCanvas(canvas)
window.addEventListener('resize', () => {
  platforms.rescaleCanvas(canvas)
})

platforms.initialise()
platforms.gameLoop(canvas, ctx)

})
