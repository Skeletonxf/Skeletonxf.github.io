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

let calculateChanceOfSuccess = (modifier, dc, reliableTalent) => {
    let max = 20 + modifier
    if (reliableTalent === false) {
        let min = 1 + modifier
        let overMin = dc - min
        if (overMin <= 0) {
            // can't fail if we don't need to roll better than a 1 to pass
            return {
                chance: 1.0,
                min: min,
                max: max,
                pass: 1.0
            }
        }
        // otherwise we need 5% better rolls to pass for each integer we're short
        let failure = overMin * 0.05
        if (failure > 1) {
            // if we need to roll higher than 20 to pass we always fail
            return {
                chance: 0.0,
                min: min,
                max: max,
                pass: 'NA'
            }
        }
        return {
            chance: 1 - failure,
            min: min,
            max: max,
            pass: 1 + overMin
        }
    } else {
        // With reliable talent the lowest we can roll is a 10
        let min = 10 + modifier
        if (min >= dc) {
            // can't fail if we don't need to roll better than a 10 to pass
            return {
                chance: 1.0,
                min: min,
                max: max,
                pass: 1.0
            }
        }
        if (max < dc) {
            // if we need to roll higher than 20 to pass we always fail
            return {
                chance: 0.0,
                min: min,
                max: max,
                pass: 'NA'
            }
        }
        // If we needed higher than a 10 to pass anyway we can ignore reliable
        // talent because it can't turn any rolls from failure to success
        let overMin = dc - (1 + modifier)
        let failure = overMin * 0.05
        return {
            chance: 1 - failure,
            min: min,
            max: max,
            pass: 1 + overMin
        }
    }
}

let percentage = (probability) => {
    return `${Math.round(probability * 100)}%`
}

let percentage2 = (probability) => {
    return `${(probability * 100).toFixed(2)}%`
}

let checkSuccess = (modifierInput, dc, output, onSuccessChance, reliableTalent) => {
    let onChange = () => {
        let success = calculateChanceOfSuccess(
            parseNumber(modifierInput.value), dc, reliableTalent
        )
        output.lowest.textContent = success.min
        output.highest.textContent = success.max
        output.pass.textContent = success.pass
        output.chance.textContent = percentage(success.chance)
        onSuccessChance(success.chance)
    }
    modifierInput.addEventListener('change', onChange)
    onChange()
}

window.addEventListener('DOMContentLoaded', () => {
    let analysis = (dc, results, evResults, payouts, reliableTalent, stealth, tools, perception) => {
        let stealthResults = results.querySelector('.stealth-results')
        let toolsResults = results.querySelector('.tools-results')
        let perceptionResults = results.querySelector('.perception-results')
        let outputFor = (results) => {
            return {
                lowest: results.querySelector('.lowest'),
                highest: results.querySelector('.highest'),
                pass: results.querySelector('.to-pass'),
                chance: results.querySelector('.chance-to-pass'),
            }
        }
        let stealthOutput = outputFor(stealthResults)
        let toolsOutput = outputFor(toolsResults)
        let perceptionOutput = outputFor(perceptionResults)
        let success3 = evResults.querySelector('.success-3')
        let success2 = evResults.querySelector('.success-2')
        let success1 = evResults.querySelector('.success-1')
        let success0 = evResults.querySelector('.success-0')
        let expectedValue = evResults.querySelector('.ev')
        let stealthSuccess = 0
        let toolsSuccess = 0
        let perceptionSuccess = 0
        let outcomes = () => {
            let stealthFail = (1 - stealthSuccess)
            let toolsFail = (1 - toolsSuccess)
            let perceptionFail = (1 - perceptionSuccess)
            let allSuccess = stealthSuccess * toolsSuccess * perceptionSuccess
            let allFail = stealthFail * toolsFail * perceptionFail
            let exactlyTwoSuccess = 0 +
                (stealthFail * toolsSuccess * perceptionSuccess) +
                (stealthSuccess * toolsFail * perceptionSuccess) +
                (stealthSuccess * toolsSuccess * perceptionFail)
            let exactlyOneSuccess = 1 - allSuccess - allFail - exactlyTwoSuccess
            success3.textContent = percentage2(allSuccess)
            success2.textContent = percentage2(exactlyTwoSuccess)
            success1.textContent = percentage2(exactlyOneSuccess)
            success0.textContent = percentage2(allFail)
            let expectedValueCalculation = allSuccess * payouts[0] +
                exactlyTwoSuccess * payouts[1] +
                exactlyOneSuccess * payouts[2] +
                allFail * payouts[3]
            expectedValue.textContent = expectedValueCalculation.toFixed(2)
        }
        checkSuccess(
            stealth,
            dc,
            stealthOutput,
            (p) => {
                stealthSuccess = p
                outcomes()
            },
            reliableTalent
        )
        checkSuccess(
            tools,
            dc,
            toolsOutput,
            (p) => {
                toolsSuccess = p
                outcomes()
            },
            reliableTalent
        )
        checkSuccess(
            perception,
            dc,
            perceptionOutput,
            (p) => {
                perceptionSuccess = p
                outcomes()
            },
            reliableTalent
        )
    }
    {
        let stealth = document.querySelector('#ev-stealth-1')
        let tools = document.querySelector('#ev-tools-1')
        let perception = document.querySelector('#ev-perception-1')
        analysis(
            10,
            document.querySelector('#dc-10-1'),
            document.querySelector('#dc-10-expected-value-1'),
            [ 25, 0, -25, -50 ],
            false,
            stealth,
            tools,
            perception
        )
        analysis(
            15,
            document.querySelector('#dc-15-1'),
            document.querySelector('#dc-15-expected-value-1'),
            [ 75, 25, -25, -100 ],
            false,
            stealth,
            tools,
            perception
        )
        analysis(
            20,
            document.querySelector('#dc-20-1'),
            document.querySelector('#dc-20-expected-value-1'),
            [ 175, 75, -25, -200 ],
            false,
            stealth,
            tools,
            perception
        )
        analysis(
            25,
            document.querySelector('#dc-25-1'),
            document.querySelector('#dc-25-expected-value-1'),
            [ 975, 475, -25, -1000 ],
            false,
            stealth,
            tools,
            perception
        )
    }
    {
        let stealth = document.querySelector('#ev-stealth-2')
        let tools = document.querySelector('#ev-tools-2')
        let perception = document.querySelector('#ev-perception-2')
        analysis(
            10,
            document.querySelector('#dc-10-2'),
            document.querySelector('#dc-10-expected-value-2'),
            [ 25, 0, -25, -50 ],
            true,
            stealth,
            tools,
            perception
        )
        analysis(
            15,
            document.querySelector('#dc-15-2'),
            document.querySelector('#dc-15-expected-value-2'),
            [ 75, 25, -25, -100 ],
            true,
            stealth,
            tools,
            perception
        )
        analysis(
            20,
            document.querySelector('#dc-20-2'),
            document.querySelector('#dc-20-expected-value-2'),
            [ 175, 75, -25, -200 ],
            true,
            stealth,
            tools,
            perception
        )
        analysis(
            25,
            document.querySelector('#dc-25-2'),
            document.querySelector('#dc-25-expected-value-2'),
            [ 975, 475, -25, -1000 ],
            true,
            stealth,
            tools,
            perception
        )
    }
})
