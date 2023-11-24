let parseNumber = (value) => {
    let number = value
    if (value.startsWith('-')) {
        return -parseNumber(value.substring(1))
    }
    if (value.startsWith('+')) {
        number = value.substring(1)
    }
    try {
        return parseInt(number, 10)
    } catch (error) {
        console.error(error)
        return 0
    }
}

let calculateChanceOfSuccess = (modifier, dc) => {
    let min = 1 + modifier
    let max = 20 + modifier
    let overMin = dc - min
    if (overMin <= 0) {
        // can't fail if we don't need to roll better than a 1 to pass
        return 1.0
    }
    // otherwise we need 5% better rolls to pass for each integer we're short
    let failure = overMin * 0.05
    if (failure > 1) {
        // if we need to roll higher than 20 to pass we always fail
        return 0.0
    }
    return 1 - failure
}

let checkSuccess = (modifierInput, dc) => {
    modifierInput.addEventListener('change', () => {
        let success = calculateChanceOfSuccess(
            parseNumber(modifierInput.value),
            dc
        )
        console.log(success)
    })
}

window.addEventListener('DOMContentLoaded', () => {
    let evCalculator = document.querySelector('#ev-calculator')
    let stealth = document.querySelector('#ev-stealth-1')
    let tools = document.querySelector('#ev-tools-1')
    let perception = document.querySelector('#ev-perception-1')
    checkSuccess(stealth, 10)
    checkSuccess(tools, 10)
    checkSuccess(perception, 10)
})
