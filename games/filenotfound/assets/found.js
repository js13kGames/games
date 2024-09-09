(() => {
  const $path = document.querySelector('#path')
  const $folderView = document.querySelector('#folder-view')
  const $fileView = document.querySelector('#file-view')
  const $imageView = document.querySelector('#image-view')
  const $notfoundView = document.querySelector('#notfound-view')
  const $glitch = document.querySelector('#glitch')
  const glitchCtx = $glitch.getContext('2d')
  let glitchInterval = null

  const $files = document.querySelector('#files')
  const $image = document.querySelector('#image')
  const $file = document.querySelector('#file')

  const fileTypes = ['folder', 'file', 'image']

  const storageKey = 'filenotfound-found'

  const predefined = {
    files: {
      readme: `
        I need your help - my computer seems to be broken.
        When I try to do anything I'm getting the FileNotFound error and everything glitches.
        Your task is to find the file that doesn't exist.
        Glitch effect intensifies when you are getting closer.
        Shorter directories names seems to be more corrupted ;)
        Look around for easter eggs.
      `
    },
    images: {
      39668021: new Path2D('M 320 260 Q 220 20 400 240 Q 560 20 460 260 Q 760 300 460 340 Q 580 580 400 380 Q 300 600 320 360 Q 40 360 320 260 L 400 240 L 460 260 L 460 340 L 400 380 L 320 360 Z'),
      535261415: new Path2D('M10 10 h 80 v 80 h -80 Z'),
      1746917462: new Path2D('M10 10 h 80 v 80 h -80 Z'),
      3617: new Path2D('M10 10 h 80 v 80 h -80 Z'),
      132845411: new Path2D('M10 10 h 80 v 80 h -80 Z'),
      110: new Path2D('M10 10 h 80 v 80 h -80 Z')
    },
    glitch: {
      '1048769573': 0.8,
      '-1992680255': 0.7,
      '589690535': 0.6,
      '-243077372': 0.5,
      '-1669118946': 0.4,
      '1660893052': 0.3,
      '1431115383': 0.1
    }
  }

  const exts = {
    file: '.txt',
    image: '.png'
  }

  const hashString = str => str.split('').reduce((hash, char) => (((hash << 5) - hash) + char.charCodeAt(0)) | 0, 0)

  const changeView = view => {
    $folderView.hidden = view !== 'folder'
    $fileView.hidden = view !== 'file'
    $imageView.hidden = view !== 'image'
    $notfoundView.hidden = view !== 'notfound'
  }

  const randomString = (random, minLength = 1, maxLength = 15) => {
    const length = Math.floor(random() * (maxLength - minLength)) + minLength
    const start = 'a'.charCodeAt(0)
    const end = 'z'.charCodeAt(0)
    const name = Array(length).fill(0).map(() => String.fromCharCode(Math.floor(random() * (end - start)) + start)).join('')
    return name
  }

  const addToFound = (name, path) => {
    const found = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (found.find(f => f.path === path)) {
      return
    }
    found.push({ name, path })
    localStorage.setItem(storageKey, JSON.stringify(found))
  }

  const getFound = () => {
    try {
      const found = JSON.parse(localStorage.getItem(storageKey))
      return found
    } catch (e) {
      console.error(e)
      localStorage.removeItem(storageKey)
      window.location.hash = ''
    }
    return []
  }

  const getFileType = name => {
    if (['main'].includes(name)) {
      return 'folder'
    }

    if (['readme'].includes(name)) {
      return 'file'
    }

    const hash = Math.abs(hashString(name))
    const type = fileTypes[hash % 3]
    return type
  }

  const generateFileLink = name => {
    const hash = window.location.hash.slice(1)
    const parts = [...hash.split('/'), name].filter(e => e)
    return '#/' + parts.join('/')
  }

  const createFile = (name, type, path = null) => {
    const $file = document.createElement('li')
    $file.classList.add('item')
    const $a = document.createElement('a')
    $a.classList.add('link', type)
    $a.textContent = name + (exts[type] || '')
    $file.appendChild($a)
    $a.href = path || generateFileLink(name)
    return $file
  }

  const renderFolder = files => {
    while ($files.firstChild) {
      $files.removeChild($files.firstChild)
    }

    files.forEach(({ name, type, path }) => {
      const $f = createFile(name, type, path)
      $files.appendChild($f)
    })
  }

  const generateFolder = () => {
    const fileCount = Math.abs(hashString(window.location.hash)) % 25 + 10
    const random = new Math.seedrandom(window.location.hash)
    const files = Array(fileCount).fill(0).map(() => {
      const name = randomString(random)
      const type = getFileType(name)
      return { name, type }
    })
    const folders = files.filter(f => f.type === 'folder')
    const notFolders = files.filter(f => f.type !== 'folder')
    
    const sortedFiles = [
      ...folders.sort((a, b) => a.name.localeCompare(b.name)),
      ...notFolders.sort((a, b) => a.name.localeCompare(b.name))
    ]

    renderFolder(sortedFiles)
  }

  const showRoot = () => {
    const files = [{
      name: 'main',
      type: 'folder'
    }, {
      name: 'readme',
      type: 'file'
    }, localStorage.getItem(storageKey)
      ? {
        name: 'found',
        type: 'folder'
      }
      : null
    ].filter(f => f)

    renderFolder(files)
  }

  const showFound = () => {
    const found = getFound()
    const files = found.map(({ name, path }) => ({
      name,
      path,
      type: 'flink'
    }))

    renderFolder(files)
  }

  const renderFile = text => {
    $file.textContent = text
  }

  const generateFile = name => {
    if (name in predefined.files) {
      renderFile(predefined.files[name])
      return
    }

    const hash = Math.abs(hashString(name))
    const random = new Math.seedrandom(hash)
    const wordCount = random() * 500 + 100 | 0
    const words = Array(wordCount).fill(0).map(() => randomString(random, 3, 20))
    const text = words.join(' ')
    renderFile(text)
  }

  const renderImage = (src, name) => {
    $image.src = src
    $image.alt = name
  }

  const generateImage = name => {
    const $canvas = document.createElement('canvas')
    $canvas.width = 500
    $canvas.height = 500
    const ctx = $canvas.getContext('2d')

    const hash = Math.abs(hashString(name))

    const random = new Math.seedrandom(hash)

    const getColor = () => `hsl(${random() * 360 | 0}, ${50}%, ${50}%)`
    
    if (hash in predefined.images) {
      ctx.strokeStyle = getColor()
      ctx.stroke(predefined.images[hash])
      addToFound(name, window.location.hash)
    } else {
      const figureCount = random() * 30 + 5 | 0
      for (let i = 0; i < figureCount; i += 1) {
        ctx.beginPath()
        const color = getColor()
        ctx.fillStyle = color
        ctx.strokeStyle = color
        const x = random() * 500 | 0
        const y = random() * 500 | 0
        if (random() < 0.5) {
          const w = random() * 50 + 5 | 0
          const h = random() * 50 + 5 | 0
          ctx.rect(x, y, w, h)
        } else {
          const r = random() * 50 + 5 | 0
          ctx.arc(x, y, r, 0, Math.PI * 2)
        }
        if (random() < 0.5) {
          ctx.fill()
        } else {
          ctx.stroke()
        }
        ctx.closePath()
      }
    }

    renderImage($canvas.toDataURL(), name)
  }

  const glitch = () => {
    const hash = hashString(window.location.hash)
    const factor = predefined.glitch[hash] || 0.9

    if (Math.random() < factor) {
      return
    }
    glitchCtx.fillStyle = `hsl(${Math.random() * 360 | 0}, ${50}%, ${50}%)`
    const x = Math.random() * $glitch.width | 0
    const y = Math.random() * $glitch.height | 0
    const w = Math.random() * $glitch.width | 0
    const h = Math.random() * $glitch.height | 0
    glitchCtx.fillRect(x - w / 2, y - h / 2, w, h)
    setTimeout(() => {
      glitchCtx.clearRect(0, 0, $glitch.width, $glitch.height)
    }, 50)
  }

  const updatePath = () => {
    const hash = window.location.hash.slice(1)
    if (!hash.match(/^\/[a-z]*(\/[a-z]+)*$/)) {
      window.location.hash = ''
    }

    while ($path.firstChild) {
      $path.removeChild($path.firstChild)
    }

    const parts = hash.split('/')

    if (parts.slice(0, -1).some(part => getFileType(part) !== 'folder')) {
      window.location.hash = ''
      return
    }

    parts.forEach((name, i) => {
      const type = getFileType(name)
      const ext = exts[type] || '/'
      const $a = document.createElement('a')
      const href = '#' + parts.slice(0, i + 1).join('/')
      $a.classList.add('link')
      $a.href = href
      $a.textContent = name + ext
      $path.appendChild($a)
    })
  }

  const onHashChange = () => {
    updatePath()

    if (glitchInterval) {
      clearInterval(glitchInterval)
    }

    const thisFileName = window.location.hash.split('/').slice(-1)[0]
    if (thisFileName === '') {
      showRoot()
      changeView('folder')
      return
    }

    if (thisFileName === 'found') {
      showFound()
      changeView('folder')
      return
    }

    const thisFileType = getFileType(thisFileName)
    
    glitchInterval = setInterval(glitch, 100)
    const isNotFound = hashString(window.location.hash) === 1431115383 // :)
    if (isNotFound) {
      addToFound(thisFileName, window.location.hash)
      changeView('notfound')
      return
    }
    
    const typeMachine = {
      folder: generateFolder,
      file: generateFile,
      image: generateImage
    }

    typeMachine[thisFileType](thisFileName)
    changeView(thisFileType)
  }

  window.addEventListener('hashchange', onHashChange)

  const resizeGlitch = () => {
    $glitch.width = window.innerWidth
    $glitch.height = window.innerHeight
  }

  window.addEventListener('resize', resizeGlitch)
  resizeGlitch()

  onHashChange()
})()
