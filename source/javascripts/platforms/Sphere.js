if (platforms === undefined) {
  var platforms = {}
}

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
    this.size = 1
  }

  update(speed) {
    this.angle = this.speedFunction(this.angle, speed)
    // either rotate around another Sphere or
    // rotate around the mid point of the
    // 0-480 and 0-360 'game units'
    let x
    let y
    if (this.anchor === null) {
      x = 240
      y = 180
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
    draw.fillRect(this.x * scale.x, this.y * scale.y, 5, 5, 'black')
  }
}

platforms.Sphere = Sphere
