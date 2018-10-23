document.addEventListener('DOMContentLoaded', () => {

function hide(element) {
  element.classList.remove('expanded')
  element.classList.add('hidden')
}

function show(element) {
  element.classList.add('expanded')
  element.classList.remove('hidden')
}

// Hide all expanded divs
// This way if JS is blocked then the divs are visible by default

texts = document.querySelectorAll('.expanded')
texts.forEach(e => e.classList.add('js-works'))
texts.forEach(hide)
items = document.querySelectorAll('.item:not(.no-cursor)')
items.forEach(e => e.setAttribute('aria-expanded', 'false'))

document.addEventListener('focusin', (event) => {
  let item = event.target
  item.classList.add('selected')
  if (!item.classList.contains('no-cursor')) {
    item.setAttribute('aria-expanded', 'true')
  }
  let hidden = item.querySelectorAll('.hidden')
  hidden.forEach(show)
})

document.addEventListener('focusout', (event) => {
  let item = event.target
  item.classList.remove('selected')
  if (!item.classList.contains('no-cursor')) {
    item.setAttribute('aria-expanded', 'false')
  }
  let shown = item.querySelectorAll('.expanded')
  shown.forEach(hide)
})

})
