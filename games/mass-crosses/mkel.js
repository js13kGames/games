const SVGNS = 'http://www.w3.org/2000/svg'

export default function mkEl(tag, attrs={}) {
  let el = (tag instanceof Element) ? tag : document.createElement(tag)

  mkEl.extend(el)

  Object.keys(attrs).forEach((att)=>
    att === 'text'
    ? el.appendChild(document.createTextNode(attrs[att]))
    : att === 'parent'
    ? attrs.parent.appendChild(el)
    : att === 'child'
    ? attrs.child.forEach((tag, i)=> {
      if (i%2 === 0) el.mkChild(tag, attrs.child[i+1]||{})
    })
    : att === 'css'
    ? el.setStyle(attrs.css)
    : att.match(/^on/)
    ? el[att] = attrs[att]
    : el.setAttribute(att, attrs[att])
  )

  return el
}

mkEl.svg = function mkSVGEl(tag, attrs) {
  if (tag instanceof Element)
    return mkEl(tag, attrs)
  else
    return mkEl(document.createElementNS(SVGNS, tag), attrs)
}

function mkChild(tag, attrs) {
  attrs = { ...attrs, parent: this }
  if (this instanceof SVGElement)
    return mkEl.svg(tag, attrs)
  else
    return mkEl(tag, attrs)
}

mkEl.extend = function extendElement(el) {
  el.mkChild = mkChild
  el.setStyle = (style)=> Object.entries(style).forEach(([key, val])=> el.style[key] = val )
  return el
}
