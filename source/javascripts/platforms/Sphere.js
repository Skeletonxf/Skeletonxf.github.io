if (platforms === undefined) {
  var platforms = {}
}

/*
 * Game units are treated as 0-380 and 0-360
 * as originally on Scratch. When drawn these
 * are rescaled to fit the canvas, which itself
 * is scaled to fit this aspect ratio.
 */
const WIDTH = 480
const HEIGHT = 360
const MAX_SIZE = 23

class Sphere {
  constructor(anchor, angle, radius, speedFunction) {
    this.anchor = anchor
    this.angle = angle
    this.speedFunction = speedFunction
    // save default angle for resetting
    this._angle = angle
    this.radius = radius
    this.x = 0
    this.y = 0
    this.size = 1 // size is the % of full size, ie 1 is 100% of MAX_SIZE
  }

  update(speed) {
    this.angle = this.speedFunction(this.angle, speed)
    // either rotate around another Sphere or
    // rotate around the mid point of the
    // 0-480 and 0-360 'game units'
    let x
    let y
    if (this.anchor === null) {
      x = WIDTH / 2
      y = HEIGHT / 2
    } else {
      x = this.anchor.x
      y = this.anchor.y
    }
    this.x = x + (Math.sin(this.angle) * this.radius)
    this.y = y + (Math.cos(this.angle) * this.radius)
  }

  reset() {
    this.angle = this._angle
    this.size = 1
  }

  draw(canvas, ctx, draw) {
    // map from the 0-480 and 0-360 game units
    // to the canvas size
    let scale = {
      x: canvas.width / 480,
      y: canvas.height / 360
    }
    let position = this.getPosition()
    let radius = this.size * MAX_SIZE * scale.x
    draw.fillCircle(
      position.x * scale.x,
      position.y * scale.y,
      radius,
      'black'
    )
  }

  /*
   * Scratch clamps sprites so that they cannot go off screen.
   *
   * This is not a restriction in the real world but the clamping
   * is actually vital to the gameplay so is reproduced here.
   */
  getPosition() {
    return {
      x: Math.min(Math.max(this.x, 0), WIDTH),
      y: Math.min(Math.max(this.y, 0), HEIGHT)
    }
  }

  /*
   * Check if a coordinate in game units is within this Sphere
   * considering this Sphere's size and position in game units
   */
  touching(x, y) {
    let radius = this.size * MAX_SIZE
    let position = this.getPosition()
    return ((position.x - x) ** 2) + ((position.y - y) ** 2) <= (radius ** 2)
  }

  shrink() {
    this.size = this.size * 0.99
  }
}

platforms.Sphere = Sphere
