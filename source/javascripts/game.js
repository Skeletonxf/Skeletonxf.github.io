// run entire script after full page has loaded
window.addEventListener('load', () => {

let game = document.getElementById('map')

let drawLine = null;
let drawWall = null;
let drawMine = null;
{
  let paths = document.getElementById('paths')
  let walls = document.getElementById('walls')
  let mines = document.getElementById('mines')
  let castles = document.getElementById('castles')

  let svgNS = "http://www.w3.org/2000/svg"
  let createLine = function(values) {
    let line = document.createElementNS(svgNS, 'line')
    line.setAttributeNS(null, 'stroke-width', 12)
    for (let property in values) {
      line.setAttributeNS(null, property, values[property]);
    }
    paths.appendChild(line)
  }
  let createCircle = function(values, parent) {
    let circle = document.createElementNS(svgNS, 'circle')
    for (let property in values) {
      circle.setAttributeNS(null, property, values[property]);
    }
    parent.appendChild(circle)
  }


  function bounds(element) {
    return element.getBoundingClientRect()
  }

  drawLine = function(element1, element2) {
    let color = 'darkgreen'
    if (element1.id.includes('water') || element2.id.includes('water')) {
      color = 'skyblue'
    }
    createLine({
      x1: (bounds(element1).x + (bounds(element1).width/2)) - bounds(paths).x,
      y1: (bounds(element1).y + (bounds(element1).height/2)) - bounds(paths).y,
      x2: (bounds(element2).x + (bounds(element2).width/2)) - bounds(paths).x,
      y2: (bounds(element2).y + (bounds(element2).height/2)) - bounds(paths).y,
      stroke: color
    })
  }

  drawWall = function(element) {
    let radius = 35
    if (element.id === '$') {
      radius = 80
    }
    createCircle({
      cx: (bounds(element).x + (bounds(element).width/2)) - bounds(paths).x,
      cy: (bounds(element).y + (bounds(element).height/2)) - bounds(paths).y,
      fill: 'grey',
      r: radius
    }, walls)
  }

  drawMine = function(element, level) {
    let cx = (bounds(element).x + (bounds(element).width/2)) - bounds(paths).x
    let cy = (bounds(element).y + (bounds(element).height/2)) - bounds(paths).y
    let radius = 28
    let increment = -Math.PI/6
    if (element.id === '$') {
      radius = 70
      increment = -Math.PI/12
    }
    // draw mines around the perimeter
    for (let i = 0; i < level; i++) {
      let angle = 2.3*(Math.PI/3) + (i*increment)
      createCircle({
        cx: cx + (Math.sin(angle)*radius),
        cy: cy + (Math.cos(angle)*radius),
        fill: 'gold',
        r: 5
      }, mines)
    }
  }

  drawCastle = function(element) {
    let cx = (bounds(element).x + (bounds(element).width/2)) - bounds(paths).x
    let cy = (bounds(element).y + (bounds(element).height/2)) - bounds(paths).y
    let radius = 24
    if (element.id === '$') {
      radius = 50
    }
    let angle = -Math.PI/3
    createCircle({
      cx: cx + (Math.sin(angle)*radius),
      cy: cy + (Math.cos(angle)*radius),
      fill: 'black',
      r: element.id === '$' ? 12 : 6
    }, castles)
  }
}

let graph = {
  '$': ['inner2', 'inner4', 'inner6', 'inner8', 'inner10', 'inner12'],
  inner1: ['inner2', 'inner12', 'middle1', 'middle2'],
  inner2: ['$', 'inner1', 'inner3', 'middle3'],
  inner3: ['inner2', 'inner4', 'middle4', 'middle5'],
  inner4: ['$', 'inner3', 'inner5', 'middle6'],
  inner5: ['inner4', 'inner6', 'middle7', 'middle8'],
  inner6: ['$', 'inner5', 'inner7', 'middle9'],
  inner7: ['inner6', 'inner8', 'middle10', 'middle11'],
  inner8: ['$', 'inner7', 'inner9', 'middle12'],
  inner9: ['inner8', 'inner10', 'middle13', 'middle14'],
  inner10: ['$', 'inner9', 'inner11', 'middle15'],
  inner11: ['inner10', 'inner12', 'middle16', 'middle17'],
  inner12: ['$', 'inner1', 'inner11', 'middle18'],
  middle1: ['inner1', 'middle18', 'middle2', 'outer1', 'outer2', 'water6'],
  middle2: ['inner1', 'middle1', 'middle3', 'outer1', 'outer2', 'water1'],
  middle3: ['inner2', 'middle2', 'middle4', 'water1'],
  middle4: ['inner3', 'middle3', 'middle5', 'outer3', 'outer4', 'water1'],
  middle5: ['inner3', 'middle4', 'middle6', 'outer3', 'outer4', 'water2'],
  middle6: ['inner4', 'middle5', 'middle7', 'water2'],
  middle7: ['inner5', 'middle6', 'middle8', 'outer5', 'outer6', 'water2'],
  middle8: ['inner5', 'middle7', 'middle9', 'outer5', 'outer6', 'water3'],
  middle9: ['inner6', 'middle8', 'middle10', 'water3'],
  middle10: ['inner7', 'middle9', 'middle11', 'outer7', 'outer8', 'water3'],
  middle11: ['inner7', 'middle10', 'middle12', 'outer7', 'outer8', 'water4'],
  middle12: ['inner8', 'middle11', 'middle13', 'water4'],
  middle13: ['inner9', 'middle12', 'middle14', 'outer9', 'outer10', 'water4'],
  middle14: ['inner9', 'middle13', 'middle15', 'outer9', 'outer10', 'water5'],
  middle15: ['inner10', 'middle14', 'middle16', 'water5'],
  middle16: ['inner11', 'middle15', 'middle17', 'outer11', 'outer12', 'water5'],
  middle17: ['inner11', 'middle16', 'middle18', 'outer11', 'outer12', 'water6'],
  middle18: ['inner12', 'middle17', 'middle1', 'water6'],
  outer1: ['middle1', 'middle2', 'base1', 'water6'],
  outer2: ['middle1', 'middle2', 'base1', 'water1'],
  outer3: ['middle4', 'middle5', 'base2', 'water1'],
  outer4: ['middle4', 'middle5', 'base2', 'water2'],
  outer5: ['middle7', 'middle8', 'base3', 'water2'],
  outer6: ['middle7', 'middle8', 'base3', 'water3'],
  outer7: ['middle10', 'middle11', 'base4', 'water3'],
  outer8: ['middle10', 'middle11', 'base4', 'water4'],
  outer9: ['middle13', 'middle14', 'base5', 'water4'],
  outer10: ['middle13', 'middle14', 'base5', 'water5'],
  outer11: ['middle16', 'middle17', 'base6', 'water5'],
  outer12: ['middle16', 'middle17', 'base6', 'water6'],
  base1: ['outer1', 'outer2', 'water1', 'water6'],
  base2: ['outer3', 'outer4', 'water1', 'water2'],
  base3: ['outer5', 'outer6', 'water2', 'water3'],
  base4: ['outer7', 'outer8', 'water3', 'water4'],
  base5: ['outer9', 'outer10', 'water4', 'water5'],
  base6: ['outer11', 'outer12', 'water5', 'water6'],
  water1: ['base1', 'outer2', 'middle2', 'middle3', 'middle4', 'outer3', 'base2'],
  water2: ['base2', 'outer4', 'middle5', 'middle6', 'middle7', 'outer5', 'base3'],
  water3: ['base3', 'outer6', 'middle8', 'middle9', 'middle10', 'outer7', 'base4'],
  water4: ['base4', 'outer8', 'middle11', 'middle12', 'middle13', 'outer9', 'base5'],
  water5: ['base5', 'outer10', 'middle14', 'middle15', 'middle16', 'outer11', 'base6'],
  water6: ['base6', 'outer12', 'middle17', 'middle18', 'middle1', 'outer1', 'base1']
}

for (let node in graph) {
  graph[node].forEach((n) => {
    // TODO avoid drawing every line twice
    drawLine(document.getElementById(node), document.getElementById(n))
  })
}

let map = {}
{
  let player = 1
  for (let node in graph) {
    let element = document.getElementById(node)
    if (node.includes('base')) {
      map[node] = {
        armies: [{
          quantity: 30,
          type: 'Neutral',
          level: 1,
          id: 0
        }],
        player: 'p' + player,
        wall: true,
        castle: true,
        capital: true,
        justTaken: true
      }
      player += 1
    } else {
      map[node] = {
        armies: [{
          quantity: 10,
          type: 'Neutral',
          level: 1,
          id: 0
        }],
        player: 'neutral',
        wall: false,
        castle: false,
        capital: false,
        justTaken: false
      }
      if (node.includes('water')) {
        map[node].armies[0].quantity = 1000
      }
      if (node.includes('$')) {
        map[node].armies[0].quantity = 50
      }
    }
    map[node].mines = 0
    map[node].purchases = {
      archers: 0,
      calvary: 0,
      infantry: 0,
      castle: false,
      mines: 0
    }
    map[node].arriving = []
    map[node].deployed = []
  }
}

let fullPlayerNames = {
  neutral: 'Neutral',
  p1: 'Player 1',
  p2: 'Player 2',
  p3: 'Player 3',
  p4: 'Player 4',
  p5: 'Player 5',
  p6: 'Player 6'
}

let uiState = 'selectFocus'
let attackFrom = null

for (let node in graph) {
  let element = document.getElementById(node)
  element.addEventListener('click', (event) => {
    if (uiState === 'selectFocus') {
      switchFocusTo(element)
    }
    if (uiState === 'attack') {
      attackTarget(element, attackFrom)
    }
  })
}

function getFullName(id) {
  let fullName = ""
  if (id === "$") {
    fullName = "Mid"
  } else {
    fullName = id.charAt(0).toUpperCase() + id.slice(1)
    let numbers = [
      fullName.indexOf('0'),
      fullName.indexOf('1'),
      fullName.indexOf('2'),
      fullName.indexOf('3'),
      fullName.indexOf('4'),
      fullName.indexOf('5'),
      fullName.indexOf('6'),
      fullName.indexOf('7'),
      fullName.indexOf('8'),
      fullName.indexOf('9')
    ]
    let number = -1
    // take max of non -1 numbers
    numbers.forEach((n) => {
      if ((n !== -1) && ((n < number) || number === -1)) {
        number = n
      }
    })
    if (number !== -1) {
      fullName = fullName.slice(0, number) + " " + fullName.slice(number)
    }
  }
  return fullName
}

var switchFocusTo = null
{
  function updateInfo(node) {
    let fullName = getFullName(node.id)

    document.getElementById('territory-name').textContent = fullName + " Info"
    document.getElementById('territory-controller').textContent = fullPlayerNames[map[node.id].player]
    document.getElementById('territory-mines').textContent = map[node.id].mines + " Mines"
    if (map[node.id].wall) {
      document.getElementById('territory-wall').textContent = "Wall"
    } else {
      document.getElementById('territory-wall').textContent = "No Wall"
    }
    if (map[node.id].castle) {
      document.getElementById('territory-castle').textContent = "Castle"
    } else {
      document.getElementById('territory-castle').textContent = "No Castle"
    }
    document.getElementById('territory-gold-income').textContent = territoryGoldIncome(node.id)

    // purchases
    ;['archers', 'calvary', 'infantry'].forEach((unit) => {
      let buyUnit = document.getElementById(unit)
      if ((map[node.id].player === turnPlayer) && (map[node.id].castle)) {
        buyUnit.removeAttribute('disabled')
        buyUnit.value = map[node.id].purchases[unit]
        buyUnit.previousValue = map[node.id].purchases[unit]
        buyUnit.nodeid = node.id
      } else {
        buyUnit.setAttribute('disabled', 'disabled')
        buyUnit.value = ''
      }
    })

    document.getElementById('build-mines').nodeid = node.id
    updateMinePurchases()

    document.getElementById('build-wall').nodeid = node.id
    updateWallPurchases()

    document.getElementById('build-castle').nodeid = node.id
    updateCastlePurchases()
  }

  function updateArmies(node) {
    let armiesList = document.getElementById('territory-armies-all')
    // clear armies list
    while (armiesList.firstChild) {
      armiesList.removeChild(armiesList.firstChild)
    }

    let selectedList = document.getElementById('territory-armies-selected')
    // clear selected armies list
    while (selectedList.firstChild) {
      selectedList.removeChild(selectedList.firstChild)
    }

    // create button for attack/transfer
    let attackContainer = document.getElementById('armies-attack')
    // delete all old attack buttons
    while (attackContainer.firstChild) {
      attackContainer.removeChild(attackContainer.firstChild)
    }
    let button = document.createElement('button')
    button.textContent = 'Attack/Transfer'
    attackContainer.appendChild(button)

    if (map[node.id].player === turnPlayer) {
      document.getElementById('armies-selected').classList.remove('hidden')
    } else {
      document.getElementById('armies-selected').classList.add('hidden')
    }

    let attacksList = document.getElementById('territory-attacks')
    // clear deployed list
    while (attacksList.firstChild) {
      attacksList.removeChild(attacksList.firstChild)
    }

    function updateButton() {
      if (map[node.id].deployed.length === 0 ||
        map[node.id].deployed.every(d => d.target !== null) ||
        map[node.id].player !== turnPlayer) {
          button.setAttribute('disabled', 'disabled')
        } else {
          button.removeAttribute('disabled')
        }
    }
    updateButton()

    // setup army deployment UI for this territory
    map[node.id].armies.forEach(listArmy)

    function listArmy(army) {
      let li = document.createElement('li')
      let checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      let id = army.type + 'ArmyInTerritory' + army.id
      checkbox.setAttribute('id', id)
      let label = document.createElement('label')
      label.setAttribute('for', id)

      let quantity = document.createElement('input')
      quantity.setAttribute('type', 'number')
      quantity.value = army.quantity

      if (map[node.id].player === turnPlayer) {
        quantity.addEventListener('change', () => {
          // only allow splitting
          if (+quantity.value > army.quantity) {
            quantity.value = army.quantity
            return
          }
          if (+quantity.value < 1) {
            quantity.value = 1
            return
          }
          // split army
          let left = +quantity.value
          let right = +army.quantity - quantity.value

          // find all armies of this type in this territory
          let splitArmies = map[node.id].armies.filter(a => a.type === army.type)
          // find the highest id
          let highestID = splitArmies.reduce((accumulator, current) => {
            return Math.max(accumulator, current.id)
          }, 0)
          army.quantity = left
          let splitArmy = {
            quantity: right,
            type: army.type,
            level: army.level,
            id: highestID + 1
          }
          map[node.id].armies.push(splitArmy)
          listArmy(splitArmy)
        })
      } else {
        quantity.setAttribute('disabled', 'disabled')
      }

      let target = map[node.id].deployed.find((d) => {
        return d.army === army && d.target !== null
      })
      let hasTarget = target !== undefined

      let text = null
      // don't let the player see other player's deloyments
      if (hasTarget && map[node.id].player === turnPlayer) {
        text = document.createTextNode(army.type + ' ' + army.level + ' to ' +
          getFullName(target.target))
      } else {
        text = document.createTextNode(army.type + ' ' + army.level)
      }

      armiesList.appendChild(li)
      li.appendChild(checkbox)
      li.appendChild(label)
      label.appendChild(quantity)
      label.appendChild(text)

      // don't let the player see other player's deloyments
      if (map[node.id].player === turnPlayer) {
        // put all deployed armies back on the selected section
        if (map[node.id].deployed.some((d) => d.army === army)) {
          selectedList.append(li)
          checkbox.checked = true
          if (hasTarget) {
            // put this attack in the deployed section
            attacksList.append(li)
          }
        }
      }

      // don't let the player deploy non player armies
      if (map[node.id].player === turnPlayer) {
        // track deployed armies and don't trust the DOM for the values
        checkbox.addEventListener('change', () => {
          if ((checkbox.checked) && (!hasTarget)) {
            selectedList.append(li)
            map[node.id].deployed.push({
              army: army,
              target: null
            })
          } else {
            armiesList.append(li)
            map[node.id].deployed = map[node.id].deployed.filter(d => d.army !== army)
            hasTarget = false
          }

          // remove target location on now undeployed army
          label.removeChild(text)
          text = document.createTextNode(army.type + ' ' + army.level)
          label.appendChild(text)

          updateButton()

          console.log(map[node.id].deployed)
        })

        button.addEventListener('click', () => {
          let neighbours = graph[node.id]
          let nodes = neighbours.map(id => document.getElementById(id))
          // highlight all possible locations to attack/transfer
          nodes.forEach((n) => {
            n.classList.add('highlight')
          })
          uiState = 'attack'
          document.getElementById('end-turn').setAttribute('disabled', 'disabled')
          // mutate the global variable to let the recieving
          // event know the originating node
          attackFrom = node
        })
      }
    }
  }

  switchFocusTo = function(node) {
    updateInfo(node)
    updateArmies(node)
  }
}

function attackTarget(to, from) {
  if (from) {
    if (graph[from.id].includes(to.id)) {
      // mark all semi deployed armies with the target
      map[from.id].deployed.forEach((d) => {
        if (d.target === null) {
          d.target = to.id
        }
      })
    }
  }
  uiState = 'selectFocus'
  document.getElementById('end-turn').removeAttribute('disabled')
  stopHighlighting()
  // find all armies for this target
  let targetArmies = map[from.id].deployed.filter((d) => {
    return d.target === to.id
  })
  let types = []
  let typeRepeats = []
  // find any repeated types going to the same target
  targetArmies.forEach((d) => {
    if (types.includes(d.army.type)) {
      if (!typeRepeats.includes(d.army.type)) {
        typeRepeats.push(d.army.type)
      }
    } else {
      types.push(d.army.type)
    }
  })
  typeRepeats.forEach((type) => {
    // for each repeated type to a target identify all armies of that type
    let repeatedTypesForTarget = targetArmies.filter((d) => {
      return d.army.type === type
    })
    let first = repeatedTypesForTarget[0]
    // merge these together
    if (first) {
      let totalQuantity = repeatedTypesForTarget.reduce(
        (accumulator, current) => {
          return accumulator + current.army.quantity
      }, 0)
      console.log('before change', map[from.id].armies)
      // raise quantity on remaining one
      first.army.quantity = totalQuantity
    }
    // remove the others
    let removals = []
    map[from.id].deployed = map[from.id].deployed.filter((d) => {
      let keep = d.army.type !== first.army.type || d.target !== first.target || d.army === first.army
      if (!keep) {
        removals.push(d.army)
      }
      return keep
    })
    map[from.id].armies = map[from.id].armies.filter((army) => {
      return !removals.includes(army)
    })
  })
  console.log('done', map[from.id].armies)
  // stay focused on the current node as the player
  // may want to deploy additional units
  // let this refresh the UI to show the new attacks
  switchFocusTo(from)
}

function stopHighlighting() {
  for (let node in map) {
    let element = document.getElementById(node)
    // reset highlighting on changing node focus
    element.classList.remove('highlight')
  }
}

{
  let buyArchers = document.getElementById('archers')
  let buyCalvary = document.getElementById('calvary')
  let buyInfantry = document.getElementById('infantry')

  function buyUnit(unit, input) {
    if ((+input.previousValue) < (+input.value)) {
      let difference = (+input.value) - (+input.previousValue)
      if (players[turnPlayer].gold >= (20*difference)) {
        players[turnPlayer].gold -= (20*difference)
        map[input.nodeid].purchases[unit] += difference
        input.previousValue = input.value
      } else {
        input.value = input.previousValue
      }
    } else {
      let difference = (+input.previousValue) - (+input.value)
      players[turnPlayer].gold += (20*difference)
      map[input.nodeid].purchases[unit] -= difference
      input.previousValue = input.value
    }
  }

  buyArchers.addEventListener('change', () => {
    buyUnit('archers', buyArchers)
    updatePlayerGold()
  })
  buyCalvary.addEventListener('change', () => {
    buyUnit('calvary', buyCalvary)
    updatePlayerGold()
  })
  buyInfantry.addEventListener('change', () => {
    buyUnit('infantry', buyInfantry)
    updatePlayerGold()
  })

  let buyCastle = document.getElementById('build-castle')
  buyCastle.addEventListener('click', () => {
    if (map[buyCastle.nodeid].purchases.castle) {
      players[turnPlayer].gold += 2000
      map[buyCastle.nodeid].purchases.castle = false
    } else {
      if (buyCastle.nodeid && players[turnPlayer].gold >= 2000) {
        players[turnPlayer].gold -= 2000
        map[buyCastle.nodeid].purchases.castle = true
      }
    }
    updatePlayerGold()
    updateCastlePurchases()
  })

  let buyWall = document.getElementById('build-wall')
  buyWall.addEventListener('click', () => {
    if (map[buyWall.nodeid].purchases.wall) {
      players[turnPlayer].gold += 1500
      map[buyWall.nodeid].purchases.wall = false
    } else {
      if (buyWall.nodeid && players[turnPlayer].gold >= 1500) {
        players[turnPlayer].gold -= 1500
        map[buyWall.nodeid].purchases.wall = true
      }
    }
    updatePlayerGold()
    updateWallPurchases()
  })
}

function updateCastlePurchases() {
  let buyCastle = document.getElementById('build-castle')
  let nodeid = buyCastle.nodeid
  buyCastle.textContent = 'Build Castle (2000)'
  buyCastle.setAttribute('disabled', 'disabled')
  if ((nodeid) && (map[nodeid].player === turnPlayer)) {
    if (map[nodeid].purchases.castle) {
      buyCastle.textContent = 'Cancel Castle'
      buyCastle.removeAttribute('disabled')
    } else {
      if ((players[turnPlayer].gold >= 2000) && (!map[nodeid].castle)) {
        buyCastle.removeAttribute('disabled')
      }
    }
  }
}

function updateWallPurchases() {
  let buyWall = document.getElementById('build-wall')
  let nodeid = buyWall.nodeid
  buyWall.textContent = 'Build Wall (1500)'
  buyWall.setAttribute('disabled', 'disabled')
  if ((nodeid) && (map[nodeid].player === turnPlayer)) {
    if (map[nodeid].purchases.wall) {
      buyWall.textContent = 'Cancel Wall'
      buyWall.removeAttribute('disabled')
    } else {
      if ((players[turnPlayer].gold >= 1500) && (!map[nodeid].wall)) {
        buyWall.removeAttribute('disabled')
      }
    }
  }
}

let players = {};
['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach((p) => {
  players[p] = {
    units: {
      archers: 1,
      calvary: 1,
      infantry: 1
    },
    gold: 0,
    goldIncome: 0,
    goldPublic: 0,
    upgrades: {
      archers: false,
      calvary: false,
      infantry: false
    }
  }
})

// mine income rates and upgrade costs
// index by level of mine 0-6
let mineIncome = [ 0, 100, 150, 190, 230, 250, 500 ]
// index by level of mine to buy 1-6
let mineUpgradeCost = [ 200, 300, 450, 600, 750, 1200 ]

{
  let ol = document.getElementById('mine-gold-income-list')
  for (let i = 0; i < 6; i++) {
   let li = document.createElement('li')
    ol.appendChild(li)
    li.appendChild(
      document.createTextNode(mineIncome[i+1] + ' Gold per turn for '+
      mineUpgradeCost[i] + ' Gold')
    )
  }
}


function territoryGoldIncome(node) {
  // passive income for territory
  let income = 150
  if (node.includes('water')) {
    income = 0
  }
  if (map[node].capital) {
    income = 400
  }
  if (node.includes('$')) {
    if (map[node].justTaken) {
      income = 2000
    } else {
      income = 600
    }
  }
  // gain extra gold for mine levels
  return income += mineIncome[map[node].mines]
}

// Updates the UI on mine purchases for a territory
function updateMinePurchases() {
  let buyMines = document.getElementById('build-mines')
  let label = document.getElementById('build-mines-label')
  let nodeid = buyMines.nodeid
  if (nodeid) {
    console.log('mines', map[nodeid].mines, map[nodeid].purchases.mines)
    if (map[nodeid].player === turnPlayer) {
      buyMines.removeAttribute('disabled')
      let mineLevel = map[nodeid].mines + map[nodeid].purchases.mines
      buyMines.value = mineLevel
      buyMines.previousValue = mineLevel
      // do not allow changes if fully upgraded mine
      if (map[nodeid].mines < 6) {
        let nextMineLevel = mineLevel + 1
        if (nextMineLevel <= 6) {
          label.textContent = 'Mines +1: ' + mineUpgradeCost[nextMineLevel - 1]
        } else {
          // do not show upgrades past 6
          label.textContent = 'Mines'
        }
      } else {
        label.textContent = 'Mines'
        buyMines.setAttribute('disabled', 'disabled')
      }
    } else {
      buyMines.setAttribute('disabled', 'disabled')
      // hide purchase information from other players
      buyMines.value = map[nodeid].mines
      label.textContent = 'Mines'
    }
  } else {
    buyMines.setAttribute('disabled', 'disabled')
    buyMines.value = 0
    label.textContent = 'Mines'
  }
}

document.getElementById('build-mines').addEventListener('change', () => {
  let buyMines = document.getElementById('build-mines')
  let nodeid = buyMines.nodeid
  if (nodeid) {
    if ((+buyMines.value) > 6) {
      buyMines.value = buyMines.previousValue
      updateMinePurchases()
      return
    }
    if ((+buyMines.value) < map[nodeid].mines) {
      // do not allow selling mines already built
      buyMines.value = map[nodeid].mines
      buyMines.previousValue = map[nodeid].mines
      updateMinePurchases()
      return
    }
    let mines = map[nodeid].mines
    let purchases = map[nodeid].purchases.mines
    let totalMines = mines + purchases
    // cancel purchase
    if ((+buyMines.value) < totalMines) {
      while ((+buyMines.value) < totalMines) {
        let costOfPurchase = mineUpgradeCost[totalMines - 1]
        players[turnPlayer].gold += costOfPurchase
        map[nodeid].purchases.mines -= 1
        totalMines = mines + map[nodeid].purchases.mines
      }
      buyMines.previousValue = buyMines.value
      updateMinePurchases()
      updatePlayerGold()
      return
    }
    // purchase next level
    if (buyMines.value > totalMines) {
      while ((+buyMines.value) > totalMines) {
        console.log('purchasing')
        let costToPurchase = mineUpgradeCost[totalMines]
        if (players[turnPlayer].gold < costToPurchase) {
          // stop if run out of money
          console.log('no money')
          buyMines.value = totalMines
          buyMines.previousValue = totalMines
          updateMinePurchases()
          updatePlayerGold()
          return
        }
        players[turnPlayer].gold -= costToPurchase
        map[nodeid].purchases.mines += 1
        totalMines = mines + map[nodeid].purchases.mines
      }
      buyMines.previousValue = buyMines.value
      updateMinePurchases()
      updatePlayerGold()
      return
    }
  }
  updateMinePurchases()
})

// cost for next unit upgrade from 2-4
let unitUpgradesCost = [ 1500, 3000, 5000 ]

// updates the UI for the player unit upgrades
function updatePlayerUnitUpgrades() {
  {
    // update levels of units for each player
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach((player) => {
      ['archers', 'calvary', 'infantry'].forEach((unit) => {
        let p = document.getElementById(player + '-' + unit + '-level')
        let unitText = unit.charAt(0).toUpperCase() + unit.slice(1)
        p.textContent = unitText + ' Level ' + players[player].units[unit]
      })
    })
  }

  let upgradesContainer = document.getElementById('turn-player-unit-upgrades')
  let playerUpgrades = 'p' + turnPlayer.charAt(1) + '-player-info'
  // move upgrades to turn player
  document.getElementById(playerUpgrades).appendChild(upgradesContainer);
  ['archers', 'calvary', 'infantry'].forEach((unit) => {
    let upgradeUnit = document.getElementById('turn-player-upgrade-' + unit)
    upgradeUnit.setAttribute('disabled', 'disabled')
    let unitText = unit.charAt(0).toUpperCase() + unit.slice(1)
    if (players[turnPlayer].units[unit] >= 4) {
      upgradeUnit.textContent = unitText + ' Level 4'
      return
    }
    let upgradeText = 'Upgrade ' + unitText
    let upgradeCost = unitUpgradesCost[players[turnPlayer].units[unit] - 1]
    upgradeUnit.textContent = upgradeText + ' (' + upgradeCost + ')'
    if (players[turnPlayer].upgrades[unit]) {
      upgradeUnit.textContent = 'Cancel Upgrade'
      upgradeUnit.removeAttribute('disabled')
    } else {
      if (players[turnPlayer].gold >= upgradeCost) {
        upgradeUnit.removeAttribute('disabled')
      }
    }
  })
}

['archers', 'calvary', 'infantry'].forEach((unit) => {
  let upgradeUnit = document.getElementById('turn-player-upgrade-' + unit)
  upgradeUnit.addEventListener('click', () => {
    let upgradeCost = unitUpgradesCost[players[turnPlayer].units[unit] - 1]
    if (players[turnPlayer].upgrades[unit]) {
      players[turnPlayer].gold += upgradeCost
      players[turnPlayer].upgrades[unit] = false
    } else {
      if (players[turnPlayer].gold >= upgradeCost) {
        players[turnPlayer].gold -= upgradeCost
        players[turnPlayer].upgrades[unit] = true
      }
    }
    updatePlayerUnitUpgrades()
    updatePlayerGold()
  })
})

function applyPlayerGoldIncome() {
  for (let player in players) {
    players[player].goldIncome = 0
  }
  for (let node in map) {
    if (map[node].player !== 'neutral') {
      players[map[node].player].gold += territoryGoldIncome(node)
      players[map[node].player].goldIncome += territoryGoldIncome(node)
    }
  }
  for (let player in players) {
    players[player].goldPublic = players[player].gold
  }
  updatePlayerGold()
}

function getShortTerritoryUnits(army) {
  if (army.type === 'Neutral') {
    return army.quantity
  } else {
    let text = army.quantity + ' ' + army.type.charAt(0).toUpperCase()
    if (army.level > 1) {
      text = text + army.level
    }
    return text
  }
}

function updateMap() {
  let walls = document.getElementById('walls')
  // remove all walls
  while (walls.firstChild) {
    walls.removeChild(walls.firstChild)
  }

  let mines = document.getElementById('mines')
  // remove all mines
  while (mines.firstChild) {
    mines.removeChild(mines.firstChild)
  }

  let castles = document.getElementById('castles')
  // remove all castles
  while (castles.firstChild) {
    castles.removeChild(castles.firstChild)
  }

  for (let node in map) {
    let element = document.getElementById(node);
    // update colors for each node
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach((p) => {
      element.classList.remove(p)
      if (map[node].player === p) {
        element.classList.add(p)
      }
    })
    // update unit counts
    let units = Array.from(element.childNodes).find(
      n => n.classList && n.classList.contains('units'))

    while (units.firstChild) {
      units.removeChild(units.firstChild)
    }

    map[node].armies.forEach((army) => {
      let p = document.createElement('p')
      p.textContent = getShortTerritoryUnits(army)
      units.appendChild(p)
    })

    if (map[node].wall) {
      drawWall(element)
    }

    if (map[node].mines > 0) {
      drawMine(element, map[node].mines)
    }

    if (map[node].castle) {
      drawCastle(element)
    }
  }
}

updateMap()
applyPlayerGoldIncome()

/* Turns */

let turn = 1
let phase = 1
var turnPlayer = 'p0' // needs hoisting

function changeTurnPlayer() {
  let player = +turnPlayer.slice(1)
  player += 1
  if (player > 6) {
    player = 1
    applyTurns()
  }
  turnPlayer = 'p' + player
  switchFocusTo(document.getElementById('base' + player))

  let title = document.getElementById('title')
  title.textContent = 'Player ' + player + "'s Turn - Phase: " + phase
  let playerInfo = document.getElementById('p' + player + '-player-info')
  let endTurnButton = document.getElementById('end-turn')
  // move end turn button to the next player
  playerInfo.append(endTurnButton)
  // refresh player gold info
  updatePlayerGold()
  // refresh player unit upgrades
  updatePlayerUnitUpgrades()
}

document.getElementById('end-turn').addEventListener('click', changeTurnPlayer)

changeTurnPlayer()

// Updates UI showing player's gold.
// The gold of the player at the start of their turn is shown
// as each non turn player's gold.
function updatePlayerGold() {
  let elements = {
    p1: document.getElementById('p1-gold'),
    p2: document.getElementById('p2-gold'),
    p3: document.getElementById('p3-gold'),
    p4: document.getElementById('p4-gold'),
    p5: document.getElementById('p5-gold'),
    p6: document.getElementById('p6-gold')
  }
  for (let id in elements) {
    let element = elements[id]
    let player = players[id]
    if (turnPlayer === id) {
      element.textContent = 'Gold: ' + player.gold +
      ' (+' + player.goldIncome + ')'
    } else {
      element.textContent = 'Gold: ' + player.goldPublic +
      ' (+' + player.goldIncome + ')'
    }
  }
  if (players[turnPlayer]) {
    let turnPlayerNotice = 'Remaining Gold: ' + players[turnPlayer].gold
    document.getElementById('turn-player-remaining-gold').textContent = turnPlayerNotice
  }
}

function applyTurns() {
  phase = phase += 1
  // The update function

  for (let node in map) {
    if (map[node].deployed.length > 0) {
      map[node].deployed.forEach((d) => {
        map[d.target].arriving.push({
          player: map[node].player,
          army: d.army,
          from: node
        })
      })
    }
  }

  // first opposing armies battle on edges
  // find all edge battles
  for (let node in map) {
    if (map[node].arriving.length > 0) {
      if (map[node].deployed.length > 0) {
        map[node].deployed.forEach((d) => {
          map[node].arriving.forEach((a) => {
            // exclude units passing through the same player's territory
            // as they do not fight
            if ((d.target === a.from) && (map[node].player !== a.player)) {
              // armies meet on edge
              d.edgeBattle = true
              a.edgeBattle = true
            }
          })
        })
      }
    }
  }
  // run edge battles
  for (let node in map) {
    // find nodes with at least one edge battle
    if (map[node].arriving.some(a => a.edgeBattle)) {
      // the armies arriving to this node may be from multiple players or nodes
      let arriving = map[node].arriving.filter(a => a.edgeBattle)
      // collect list of each direction an edge battle is in
      let edgeBattles = []
      arriving.forEach((a) => {
        if (!edgeBattles.includes(a.from)) {
          edgeBattles.push(a.from)
        }
      })
      // process each direction in turn
      // the armies fighting on each edge do not need to interact
      // at this point
      edgeBattles.forEach((n) => {
        // collect the armies sent from this node onto the edge
        // in this direction for the battle
        let originating = map[node].deployed.filter(d => (d.target === n && d.edgeBattle))
        // in each direction there can only be 1 player attacking
        // so all incoming armies from this direction is the single opponent
        let incoming = arriving.filter(a => a.from === n)
        console.log('edge battle', originating, incoming)
        edgeBattle(originating, incoming)
      })
      // surviving armies need to then attack/defend on the node
    }
  }

  // remove deployed units from the territory they have left
  // these armies are still arriving at the new territory
  for (let node in map) {
    map[node].armies = map[node].armies.filter((a) => {
      return !map[node].deployed.map(d => d.army).includes(a)
    })
    map[node].deployed = []
  }

  // Battle for each territory with incoming arriving units.
  // Arriving units move into territory if successful.
  for (let node in map) {
    map[node].justTaken = false
    // do normal attack/defender battles (which may involve multiple players)
    if (map[node].arriving.length > 0) {
      let arrivingDefendingUnits = map[node].arriving.filter((a) => {
        // if a player sends units to one of their own territories
        // they join the defenders before battle for simplicity
        return a.player === map[node].player
      })
      arrivingDefendingUnits.forEach((arrivingDefending) => {
        // they join the end of the list of armies at this territory
        map[node].armies.push(arrivingDefending.army)
        // take arriving defending units out of the arriving list
        map[node].arriving = map[node].arriving.filter((a) => {
          return a !== arrivingDefending
        })
        console.log('defending unit arrived', map[node].armies, map[node].arriving)
      })
      // check for any apply wall bonus flags to defenders
      if (map[node].wall) {
        map[node].armies.forEach(a => a.insideWall = true)
      }
      // perform battle for control of the node
      nOnOneBattle(map[node].arriving, map[node].armies)
      if (map[node].armies.some(army => army.quantity > 0)) {
        // defenders hold territory, no update needed
      } else if (map[node].arriving.some(a => a.army.quantity > 0)) {
        // refund attempted purchases if there were any
        ['archers', 'calvary', 'infantry'].forEach(unit => {
          if (map[node].purchases[unit] > 0) {
            players[map[node].player].gold += (20 * map[node].purchases[unit])
            map[node].purchases[unit] = 0
          }
        })
        if (map[node].purchases.castle) {
          map[node].purchases.castle = false
          players[map[node].player].gold += 2000
        }
        if (map[node].purchases.wall) {
          map[node].purchases.wall = false
          players[map[node].player].wall += 1500
        }
        if (map[node].purchases.mines > 0) {
          while (map[node].purchases.mines > 0) {
            let totalMines = map[node].mines + map[node].purchases.mines
            let costOfPurchase = mineUpgradeCost[totalMines - 1]
            players[map[node].player].gold += costOfPurchase
            map[nodeid].purchases.mines -= 1
          }
        }
        // attackers win and take territory
        map[node].player = map[node].arriving.find(a => a.army.quantity > 0).player
        // surviving armies remain in territory
        map[node].armies = map[node].arriving.filter(a => a.army.quantity > 0).map(a => a.army)
        map[node].justTaken = true
      } else {
        // territory turns neutral
        map[node].armies = []
        // if only one player attacked this neutral territory
        // then they gain control of it anyway
        if ((map[node].player === 'neutral') &&
        (new Set(map[node].arriving.map(a => a.player))).size === 1) {
          map[node].player = map[node].arriving[0].player
        } else {
          map[node].player = 'neutral'
        }
      }
    }
  }

  // Clear unsuccessful arriving armies.
  for (let node in map) {
    map[node].arriving = []
  }

  // Remove wall bonus flags.
  for (let node in map) {
    map[node].armies.forEach(a => a.insideWall = null)
  }

  // apply gold income before building new mines
  applyPlayerGoldIncome()

  // apply unit upgrades
  for (let player in players) {
    ['archers', 'calvary', 'infantry'].forEach((unit) => {
      if (players[player].upgrades[unit]) {
        players[player].units[unit] += 1
        players[player].upgrades[unit] = false
      }
    })
  }


  // Apply purchases on territories that remain under the same player's
  // control.
  for (let node in map) {
    ['archers', 'calvary', 'infantry'].forEach(unit => {
      if (map[node].purchases[unit] > 0) {
        let highestID = map[node].armies.reduce((accumulator, current) => {
          return Math.max(accumulator, current.id)
        }, 0)
        map[node].armies.push({
          quantity: map[node].purchases[unit],
          type: unit.charAt(0).toUpperCase() + unit.slice(1),
          level: players[map[node].player].units[unit],
          id: highestID + 1
        })
        map[node].purchases[unit] = 0
      }
    })
    if (map[node].purchases.castle) {
      map[node].purchases.castle = false
      map[node].castle = true
    }
    if (map[node].purchases.wall) {
      map[node].purchases.wall = false
      map[node].wall = true
    }
    if (map[node].purchases.mines > 0) {
      map[node].mines += map[node].purchases.mines
      map[node].purchases.mines = 0
    }
  }

  updateMap()
}

// Kills the armies battling along the edge till one side loses.
// Afterward the victor may have to fight defenders at the node.
function edgeBattle(originating, incoming) {
  // no defending bonus for either
  freeForAll([originating, incoming], null)
}

// n on n cannot happen as it is impossible for multiple
// players to control the same territory.
// What is possible is n on 1 where the defender
// loses while multiple attackers are still fighting for
// the territory.
// Attacking list of arriving armies and Defending list of armies.
function nOnOneBattle(attacking, defending) {
  let attackingPlayers = attacking.reduce((players, arriving) => {
    if (!players.includes(arriving.player) && arriving.army.quantity > 0) {
      players.push(arriving.player)
    }
    return players
  }, [])

  // freeForAll but apply defender rounding advantage at each step
  let attackers = []
  attackingPlayers.forEach((player) => {
    let playerAttackingArmies = attacking.filter((arriving) => {
      return arriving.player === player
    }).map(arriving => arriving.army)
    // collect the list of armies that are attacking by player
    // this should preserve the order given in deployments
    attackers.push(playerAttackingArmies)
  })
  attackers.push(defending)
  console.log('attackers', attackers, attackers.length)
  freeForAll(attackers, attackers.length - 1)
}

// List of list of armies fighting in free for all
// with optionally no one with defending advantage.
// Defender is either index of defender in attackingList
// or null if no defender.
function freeForAll(attackingList, defender) {
  // calculate every tradeForOne
  // sum up 'kills' from every viewpoint fighting every other (round robin)
  // divide by highest value to normalise to 0-1 units dying
  // subtract and loop until at least all but one hit 0 life
  let attackingArmiesCounters = []
  attackingList.forEach((attackingArmies) => {
    attackingArmiesCounters.push({
      armies: attackingArmies,
      counter: 0
    })
  })
  // run till last player's armies standing
  // so there is 1 or 0 winners
  let armies = []
  while (true) {
    // collect armies for next fight
    armies = []
    attackingArmiesCounters.forEach((counter) => {
      // don't push an army if none left for that counter
      if (counter.counter < counter.armies.length) {
        armies.push(counter.armies[counter.counter])
      }
    })
    if (armies.length <= 1) {
      console.log('battle over', armies)
      break
    }
    // check for any dead armies
    let deadArmy = armies.find(army => army.quantity === 0)
    if (deadArmy) {
      // if army is at 0 then pass onto next
      let counter = attackingArmiesCounters.find((counter) => {
        return counter.armies.includes(deadArmy)
      })
      counter.counter += 1
      continue
    }
    // each army attacks all others in round robin style
    armies.forEach(a => a.incomingDamage = 0)
    armies.forEach((army) => {
      armies.forEach((opponent) => {
        if (army !== opponent) {
          army.incomingDamage += 1
          opponent.incomingDamage += battleMultiplier(army, opponent)
        }
      })
    })
    highestDamage = armies.reduce((accumulator, army) => {
      return Math.max(accumulator, army.incomingDamage)
    }, 0)
    // highest damage should never be 0
    // normalise damage into 0-1 range
    armies.forEach(a => a.incomingDamage /= highestDamage)
    // apply damage to each army
    armies.forEach(a => a.quantity -= a.incomingDamage)
    armies.forEach(a => a.incomingDamage = null)
    // set any dead armies to 0
    armies.forEach((army) => {
      if (army.quantity < 0) {
        army.quantity = 0
      }
    })
  }
  // remove non integer quantities from surviving army
  if ((defender !== null) && armies.length === 1) {
    let victor = armies[0]
    if (attackingList[defender].includes(victor)) {
      // defender survives rounding
      victor.quantity = Math.ceil(victor.quantity)
    } else {
      victor.quantity = Math.floor(victor.quantity)
    }
  } else {
    victor.quantity = Math.floor(victor.quantity)
  }
}

// first against second index
let typeAdvantage = {
  Neutral: {
    Neutral: 0,
    Archers: 0,
    Calvary: 0,
    Infantry: 0
  },
  Archers: {
    Neutral: 0,
    Archers: 0,
    Calvary: -1, // weak to calvary
    Infantry: 1 // strong against infantry
  },
  Calvary: {
    Neutral: 0,
    Archers: 1, // strong against archers
    Calvary: 0,
    Infantry: -1 // weak to infantry
  },
  Infantry: {
    Neutral: 0,
    Archers: -1, // weak to archers
    Calvary: 1, // strong against calvary
    Infantry: 0
  }
}
function battleMultiplier(trade, against) {
  let levelDifference = trade.level - against.level
  if (trade.insideWall) {
    levelDifference += 1
  }
  if (against.insideWall) {
    levelDifference -= 1
  }
  return Math.pow(2,
    levelDifference + typeAdvantage[trade.type][against.type])
}

function battleTests() {
  console.log('A4 against I2 multiplier (8)', battleMultiplier({
    type: 'Archers',
    level: 4
  }, {
    type: 'Infantry',
    level: 2
  }))
  console.log('10 A4 against 15 I2 battle')
  let attackers = {
    type: 'Archers',
    level: 4,
    quantity: 10
  }
  let defenders = {
    type: 'Infantry',
    level: 2,
    quantity: 15
  }
  freeForAll([[attackers], [defenders]], 1)
  console.log('FFA result', attackers, defenders)
}
//battleTests()

console.log("done")
})
