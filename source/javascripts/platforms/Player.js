if (platforms === undefined) {
  var platforms = {}
}

/*
 * Game units are treated as 0-380 and 0-360
 * as originally on Scratch. When drawn these
 * are rescaled to fit the canvas, which itself
 * is scaled to fit this aspect ratio.
 */
//const WIDTH = 480
//const HEIGHT = 360
const SIZE = 25.0 / 2.0
const GRAVITY = 0.5
const SIDE_ACCEL = 0.7
const JUMP_VEL = 15
const FRICTION = 0.93

const KEY_CODES = {
  right: "KeyD",
  left: "KeyA",
  up: "KeyW",
  down: "KeyS"
}

class Player {
  reset() {
    this.x = WIDTH / 2
    this.y = HEIGHT / 2
    this.dx = 0
    this.dy = 0
    this.keys = new Map()
  }

  constructor() {
    this.reset()
    document.body.addEventListener('keydown', (event) => {
      // Use code and not key because on non QWERTY
      // keyboards the position of the actual WASD keys
      // move.
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
      this.keys.set(event.code, true)
    })
    document.body.addEventListener('keyup', (event) => {
      this.keys.set(event.code, false)
    })
  }

  update(spheres) {
    // check if the right size of the player is touching any Spheres
    let touchingRight = false
    for (let i = -10; i < 10; i++) {
      touchingRight = touchingRight || spheres.some(
        s => s.touching(
          this.x + SIZE / 2,
          this.y + (i * (SIZE / 30))))
    }
    // convert truthiness to true/false for the keys Map and
    // only go right if we're not touching something on the right
    let right = !!this.keys.get(KEY_CODES.right) && !touchingRight

    let touchingLeft = false
    for (let i = -100; i < 100; i++) {
      touchingLeft = touchingLeft || spheres.some(
        s => s.touching(
          this.x - SIZE / 2,
          this.y + (i * (SIZE / 300))))
    }
    let left = !!this.keys.get(KEY_CODES.left) && !touchingRight

    let touchingDown = false
    for (let i = -100; i < 100; i++) {
        touchingDown = touchingDown || spheres.some(
          s => s.touching(
            this.x + (i * (SIZE / 300)),
            this.y + SIZE / 2))
    }
    // don't apply gravity if touching a Sphere
    let fall = !touchingDown

    // check if we have hit a sphere with our head
    let touchingUp = false
    for (let i = -100; i < 100; i++) {
      touchingUp = touchingUp || spheres.some(
        s => s.touching(
          this.x + (i * (SIZE / 300)),
          this.y - SIZE / 2))
    }
    let ceiling = touchingUp

    /*
     * The player should bounce off spheres in side collisions
     */
    let reboundLeft = touchingRight
    let reboundRight = touchingLeft
    let reboundJump = !touchingUp && (reboundLeft || reboundRight)

    // jumping is automatic
    let jump = touchingDown || reboundJump

    /*
     * The down key is for faster falling, the up key
     * might be used in the future
     */
    let up = !!this.keys.get(KEY_CODES.up)
    let down = !!this.keys.get(KEY_CODES.down) && !touchingDown

    if (right) {
      this.dx += SIDE_ACCEL
    }
    if (left) {
      this.dx -= SIDE_ACCEL
    }
    if (fall) {
      this.dy += GRAVITY
      if (down) {
        this.dy += GRAVITY * 4
      }
    }
    if (jump && !ceiling) {
      this.dy = -JUMP_VEL
    }
    if (reboundLeft && !reboundRight) {
      this.dx = -Math.abs(this.dx)
    }
    if (reboundRight && !reboundLeft) {
      this.dx = Math.abs(this.dx)
    }
    if (ceiling) {
      this.dy = Math.abs(this.dy)
    }
    this.x += this.dx
    this.y += this.dy
    // TODO: Death
    this.x = Math.min(Math.max(this.x, 0), WIDTH)
    this.y = Math.min(Math.max(this.y, 0), HEIGHT)
    this.dx *= FRICTION
    this.dy *= FRICTION
  }

  draw(canvas, ctx, draw) {
    // map from the 0-480 and 0-360 game units
    // to the canvas size
    let scale = {
      x: canvas.width / 480,
      y: canvas.height / 360
    }
    let radius = SIZE * scale.x
    draw.fillCircle(
      this.x * scale.x,
      this.y * scale.y,
      radius,
      'blue'
    )
  }
}

platforms.Player = Player
