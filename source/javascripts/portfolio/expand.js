document.addEventListener('DOMContentLoaded', () => {

function hide(element) {
  element.classList.remove('expanded')
  element.classList.add('hidden')
  element.setAttribute('aria-expanded', 'false')
}

function show(element) {
  element.classList.add('expanded')
  element.classList.remove('hidden')
  element.setAttribute('aria-expanded', 'true')
}

// Hide all expanded divs
// This way if JS is blocked then the divs are visible by default

items = document.querySelectorAll('.expanded')
console.log(items)
items.forEach(i => i.classList.add('js-works'))
items.forEach(hide)

document.addEventListener('focusin', (event) => {
  let item = event.target
  item.classList.add('selected')
  let hidden = item.querySelectorAll('.hidden')
  hidden.forEach(show)
})

document.addEventListener('focusout', (event) => {
  let item = event.target
  item.classList.remove('selected')
  let hidden = item.querySelectorAll('.expanded')
  hidden.forEach(hide)
})

})
