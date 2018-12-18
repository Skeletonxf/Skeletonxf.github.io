if (platforms === undefined) {
  var platforms = {}
}

class Draw {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
  }

  fillRect(x, y, w, h, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
  }

  strokeRect(lineWidth, x, y, w, h, color) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth
    this.ctx.strokeRect(
      Math.floor(x) + 0.50,
      Math.floor(y) + 0.50,
      Math.floor(w),
      Math.floor(h)
    )
  }

  text(msg, x, y, w, color) {
    this.ctx.font = '48px serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = color
    this.ctx.fillText(msg, x + (w/2), y, w)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

platforms.Draw = Draw
