if (platforms === undefined) {
  var platforms = {}
}

/*
 * Rescale the canvas so drawings are not blurry due to non
 * 1 pixel ratios
 *
 * Adapted from: https://stackoverflow.com/questions/42588501/how-do-i-fix-blurry-shape-edges-in-html5-canvas
 */
platforms.rescaleCanvas = function(canvas) {
  // The viewport is in portrait mode, so var width
  // should be based off viewport width
  if (window.innerHeight > window.innerWidth) {
    // Make the canvas 100% of the viewport width
    var width = Math.round(1.0 * window.innerWidth)
  }
  // The viewport is in landscape mode, so var width
  // should be based off viewport height
  else {
    // Make the canvas 100% of the viewport height
    var width = Math.round(1.0 * window.innerHeight)
  }

  // We want a 4:3 aspect ratio
  let height = width * (3.0/4.0)

  let gameWrapper = document.getElementById('gameWrapper')
  gameWrapper.style.height = width + "px"
  gameWrapper.style.height = height + "px"

  let pixelRatio = window.devicePixelRatio || 1
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio
}
