const NUMBER_OF_CELLS = 6

const enemySmall = {
  title: 'An Unknown Alien',
  text: 'An unknown alien attacks!',
  health: 5,
  damage: 1,
  delay: 1500,
  weaponIcon: '-',
  icon: '@enemy',
  loot: { rare: 5, metals: 5, energy: 5 },
  defeated() {
    if (getById('upgrade-battery').className === 'btn hidden') {
      typist('hostile aliens detected, upgrade explorer', () => {
        getById('upgrade-battery').className = 'btn active'
        getById('upgrade-shield').className = 'btn active'
        getById('upgrade-weapon').className = 'btn active'
      })
    }
  },
}

const enemyBig = {
  title: 'A Large Alien',
  text: 'A large unknown alien attacks!',
  health: 20,
  damage: 2,
  delay: 1500,
  weaponIcon: '*',
  icon: '@enemy',
  loot: { rare: 15, metals: 15, energy: 10 },
  defeated() {
    if (getById('upgrade-battery').textContent === 'battery II') {
      typist('strong hostile aliens detected, upgrade explorer', () => {
        getById('upgrade-battery').className = 'btn active'
        getById('upgrade-shield').className = 'btn active'
        getById('upgrade-weapon').className = 'btn active'
      })
    }
  },
}

const enemyHive = {
  title: 'A hive full of hideous aliens',
  text: 'You enter a hive. Millions of alien creatures reside here. Get ready to fight',
  health: 75,
  damage: 10,
  delay: 1500,
  weaponIcon: '*',
  icon: '@enemy',
  loot: { rare: 50, metals: 50, energy: 25 },
  defeated() {
    const hub = network[getNearestHub(this.tile)]
    this.tile.symbol = 'X'
    connectToBase(this.tile, hub)
    addToNetwork(this.tile)
    display()

    if (getById('upgrade-battery').textContent === 'battery III') {
      typist('powerful hostile aliens detected, upgrade explorer', () => {
        getById('upgrade-battery').className = 'btn active'
        getById('upgrade-shield').className = 'btn active'
        getById('upgrade-weapon').className = 'btn active'
      })
    }
  },
}

const outpostEvent = {
  title: 'A hive ruin turned into an outpost',
  text: 'This hive ruin is now an outpost for you. There are some resources available',
  loot: { energy: 10 },
}

function EnemyFactory(enemy) {
  this.title = enemy.title
  this.text = enemy.text
  this.health = enemy.health || 0
  this.damage = enemy.damage || 0
  this.delay = enemy.delay || 1000
  this.weaponIcon = enemy.weaponIcon || '·'
  this.icon = enemy.icon || '@enemy'
  this.loot = {} || { energy:10 }
  this.defeated = enemy.defeated || function(){}
  Object.assign(this.loot, enemy.loot)
}

const eventMan = {
  enemy: {},

  loadEnemy(enemy, tile) {
    eventMan.enemy = new EnemyFactory(enemy)
    eventMan.enemy.tile = tile
  },

  activePanel: undefined,

  gameOver() {
    const panels = document.getElementsByClassName('hideit')
    getById('messages').style.top = '0px'

    while (panels.length > 0) {
      panels[0].parentNode.removeChild(panels[0])
    }

    getById('messages').textContent = ''
    typist('All systems online!')
    typist('Another alien world conquered')
    typist('···················')
    typist('Thank you for playing')
    typist('Thank you to everyone at 13kGames for a fun competition')
  },

  closeButton() {
    if (!eventMan.hasOwnProperty('closeBtn')) {
      eventMan.closeBtn = document.createElement('div')
      eventMan.closeBtn.setAttribute('id', 'close-button')
      eventMan.closeBtn.setAttribute('class', 'btn active')
      eventMan.closeBtn.textContent = 'close'
      eventMan.closeBtn.addEventListener('click', eventMan.closePanel)
    }
  },

  closePanel() {
    if (eventMan.closeBtn.className === 'btn active') {
      eventMan.activePanel.parentNode.removeChild(eventMan.activePanel)
      game.resume()
    }
  },

  establishMine(tile, explorer, type, callback) {
    game.pause()
    const eventPanel = document.createElement('div')
    eventPanel.setAttribute('id', 'event')
    eventPanel.setAttribute('data-legend', '')
    document.getElementById('container').appendChild(eventPanel)


    const title = `Found a source of ${type}!`
    const text = `You have found a source of ${type}. You can set up a mining
      operation by unloading droids from the explorer`

    const box = document.getElementById('event')
    box.textContent = text
    box.setAttribute('data-legend', title)

    const midPanel = document.createElement('div')
    midPanel.setAttribute('id', 'event-mid-panel')

    const unload = document.createElement('div')
    unload.setAttribute('class', 'btn')
    unload.textContent = 'unload droid'
    unload.addEventListener('click', () => {
      if (unload.className === 'btn active' && explorer.droids > 0) {
        explorer.droids -= 1
        callback(tile)
        unload.className = 'btn'
      }
    })
    if (explorer.droids > 0) {
      unload.classList.add('active')
    }
    midPanel.appendChild(unload)

    const bottomPanel = document.createElement('div')
    bottomPanel.setAttribute('id', 'event-bottom-panel')
    eventMan.closeButton()
    bottomPanel.appendChild(eventMan.closeBtn)

    box.appendChild(midPanel)
    box.appendChild(bottomPanel)

    eventMan.activePanel = eventPanel
  },

  displayFight(panel) {
    const explorerHealthBar = document.createElement('div')
    explorerHealthBar.setAttribute('id', 'explorer-health-bar')
    explorerHealthBar.textContent = `health ${explorer.health} / ${explorer.healthMax}`

    const enemyHealthBar = document.createElement('div')
    enemyHealthBar.setAttribute('id', 'enemy-health-bar')
    enemyHealthBar.textContent = `health ${eventMan.enemy.health}`

    let explorerShield = document.createElement('div')
    explorerShield.setAttribute('id', 'explorer-shield')
    explorerShield.textContent = `shield ${explorer.shield} / ${explorer.shieldMax}`

    // TABLE IT
    const table = document.createElement('table')
    table.setAttribute('id', 'fight-table')
    const row = document.createElement('tr')
    const cellExplorer = document.createElement('td')
    cellExplorer.setAttribute('id', 'battle-player-icon')
    cellExplorer.textContent = `@explorer ${explorer.displayShield()}`

    row.appendChild(cellExplorer)

    for (let i = 0; i < NUMBER_OF_CELLS; i += 1) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `cell-${i}`)
      cell.setAttribute('class', 'ground-cells')
      row.appendChild(cell)
    }

    const cellEnemy = document.createElement('td')
    cellEnemy.setAttribute('id', 'battle-enemy-icon')
    cellEnemy.textContent = '@enemy'

    row.appendChild(cellEnemy)

    table.appendChild(row)
    panel.appendChild(explorerHealthBar)
    panel.appendChild(enemyHealthBar)
    panel.appendChild(explorerShield)
    panel.appendChild(table)
    return panel
  },

  battleButtons(panel) {
    const weapon = document.createElement('div')
    weapon.textContent = 'weapon'
    weapon.setAttribute('class', 'btn active')
    weapon.addEventListener('click', () => {
      if (weapon.className === 'btn active') {
        setTimeout(eventMan.playerAttack, explorer.weaponSpeed * NUMBER_OF_CELLS, explorer.weapon)
        weapon.classList.remove('active')
        eventMan.animation(explorer.weaponIcon, explorer.symbol, explorer.weaponSpeed)
        cooldown(1000, weapon, 'weapon', [() => {
          weapon.className = 'btn active'
        }])
      }
    })

    const chargeShield = document.createElement('div')
    chargeShield.textContent = 'charge shield'
    chargeShield.setAttribute('class', 'btn active')
    chargeShield.addEventListener('click', () => {
      if (explorer.energy > 0) {
        explorer.chargeShield()
        cooldown(1000, chargeShield, 'charge shield', [() => {
          chargeShield.className = 'btn active'
          document.getElementById('explorer-shield').textContent = `shield ${explorer.shield}/${explorer.shieldMax}`
          document.getElementById("battle-player-icon").textContent = `@explorer${explorer.displayShield()}`
        }])
      }
      else {
        typist('not enough energy to charge shield')
      }
    })

    const plasma = document.createElement('div')
    plasma.textContent = 'plasma'
    plasma.setAttribute('class', 'btn active')
    plasma.addEventListener('click', () => {
      if (plasma.className === 'btn active') {
        plasma.classList.remove('active')
        setTimeout(eventMan.playerAttack, explorer.plasmaSpeed * NUMBER_OF_CELLS, explorer.plasma)
        eventMan.animation(explorer.plasmaIcon, explorer.symbol, explorer.plasmaSpeed)
        cooldown(1000, plasma, 'plasma', [() => {
          plasma.setAttribute('class', 'btn active')
        }])
      }
    })

    const slowdown = document.createElement('div')
    slowdown.textContent = 'slowdown'
    slowdown.setAttribute('class', 'btn active')
    slowdown.addEventListener('click', () => {
      if (slowdown.className === 'btn active') {
        slowdown.classList.remove('active')
        setTimeout(eventMan.playerAttack, explorer.slowdownSpeed
          * NUMBER_OF_CELLS, explorer.slowdown)
        eventMan.animation(explorer.slowdownIcon, explorer.symbol, explorer.slowdownSpeed)
        cooldown(1000, slowdown, 'slowdown', [() => {
          slowdown.setAttribute('class', 'btn active')
        }])
      }
    })

    const blocker = document.createElement('div')
    blocker.textContent = 'block-field'
    blocker.setAttribute('class', 'btn active')
    blocker.addEventListener('click', () => {
      if (blocker.className === 'btn active') {
        blocker.classList.remove('active')
        const tempEnemy = eventMan.enemy.damage
        const tempWeapon = explorer.weapon
        const tempPlasma = explorer.plasma
        explorer.weapon = 0
        explorer.plasma = 0
        eventMan.enemy.damage = 0
        for (let i = 0; i < availableBattleButtons.length; i += 1) {
          if (availableBattleButtons[i] !== chargeShield) {
            availableBattleButtons[i].setAttribute('class', 'btn')
          }
        }
        setTimeout(() => {
          eventMan.enemy.damage = tempEnemy
          explorer.weapon = tempWeapon
          explorer.plasma = tempPlasma
          for (let i = 0; i < availableBattleButtons.length; i += 1) {
            if (availableBattleButtons[i] !== chargeShield) {
              availableBattleButtons[i].setAttribute('class', 'btn active')
            }
          }
        }, explorer.blockerSpeed * NUMBER_OF_CELLS)

        setTimeout(eventMan.playerAttack, explorer.blockerSpeed
          * NUMBER_OF_CELLS, explorer.blocker)
        eventMan.animation(explorer.blockerIcon, explorer.symbol, explorer.blockerSpeed)
        cooldown(explorer.blockerSpeed * NUMBER_OF_CELLS, blocker, 'block-field', [() => {
          blocker.setAttribute('class', 'btn active')
        }])
      }
    })

    const availableBattleButtons = []

    if (explorer.shieldMax) {
      availableBattleButtons.push(chargeShield)
    }
    if (explorer.weapon) {
      availableBattleButtons.push(weapon)
    }
    if (explorer.slowdown) {
      availableBattleButtons.push(slowdown)
    }
    if (explorer.plasma) {
      availableBattleButtons.push(plasma)
    }
    if (explorer.blocker) {
      availableBattleButtons.push(blocker)
    }


    for (let i = 0; i < availableBattleButtons.length; i += 1) {
      panel.appendChild(availableBattleButtons[i])
    }
    return panel
  },

  fight(tile, explorer) {
    game.pause()
    const title = eventMan.enemy.title
    const text = eventMan.enemy.text

    const eventPanel = document.createElement('div')
    eventPanel.setAttribute('id', 'event')
    eventPanel.setAttribute('data-legend', title)
    eventPanel.textContent = text

    let topPanel = document.createElement('div')
    topPanel.setAttribute('id', 'event-top-panel')
    topPanel = eventMan.displayFight(topPanel)

    let midPanel = document.createElement('div')
    midPanel.setAttribute('id', 'event-mid-panel')
    midPanel = eventMan.battleButtons(midPanel)

    eventPanel.appendChild(topPanel)
    eventPanel.appendChild(midPanel)

    eventMan.activePanel = eventPanel
    document.getElementById('container').appendChild(eventPanel)
  },

  animation(icon, shooter, speed) {
    let cellIndex = (shooter === explorer.symbol) ? 0 : NUMBER_OF_CELLS - 1
    /* eslint-disable no-shadow, consistent-return */
    function recursive(icon, shooter, cellIndex, speed) {
      /* eslint-disable no-else-return */
      if (shooter === explorer.symbol) {
        if (cellIndex === NUMBER_OF_CELLS) {
          eventMan.clearCell(cellIndex - 1, icon)
          return true
        } else {
          if (cellIndex > 0) {
            eventMan.clearCell(cellIndex - 1, icon)
          }

          let cell = document.getElementById(`cell-${cellIndex}`)
          cell.textContent = icon
          setTimeout(recursive, speed, icon, shooter, cellIndex + 1, speed)
        }
      } else {
        cellIndex -= 1
        if (cellIndex === 0) {
          eventMan.clearCell(cellIndex + 1, icon)
          return true
        } else if (document.getElementById(`cell-${cellIndex}`).textContent === explorer.blockerIcon
          || document.getElementById(`cell-${NUMBER_OF_CELLS-1}`).textContent === explorer.blockerIcon) {
          for (let i = 0; i < NUMBER_OF_CELLS; i += 1) {
            eventMan.clearCell(i, icon)
          }
          return false
        } else {
          if (cellIndex < NUMBER_OF_CELLS - 1) {
            eventMan.clearCell(cellIndex + 1, icon)
          }
          let cell = document.getElementById(`cell-${cellIndex}`)
          cell.textContent = icon
          setTimeout(recursive, speed, icon, shooter, cellIndex, speed)
        }
      }
    }
    recursive(icon, shooter, cellIndex, speed)
  },

  enemyAttack() {
    eventMan.animation(eventMan.enemy.weaponIcon, eventMan.enemy.icon, 200)
    setTimeout(() => {
      if (explorer.shield > 0) {
        explorer.shield -= eventMan.enemy.damage
        explorer.health = (explorer.shield < 0) ? explorer.health + explorer.shield
          : explorer.health
        explorer.shield = (explorer.shield < 0) ? 0 : explorer.shield
        document.getElementById('explorer-shield').textContent = `shield ${explorer.shield}/${explorer.shieldMax}`
        document.getElementById('battle-player-icon').textContent = `@explorer ${explorer.displayShield()}`
      } else {
        explorer.health = (eventMan.enemy.damage > explorer.health)
          ? 0 : explorer.health - eventMan.enemy.damage
      }
      document.getElementById('explorer-health-bar').textContent = `health ${explorer.health}/${explorer.healthMax}`
      if (explorer.health <= 0) {
        eventMan.enemy.tile.exp = false
        display()
        clearInterval(eventMan.enemy.interval)
        eventMan.activePanel.parentNode.removeChild(eventMan.activePanel)
        game.resume()
        playerDead()
      }
    }, 200 * 6)
  },

  playerAttack(damage) {
    if (damage === 'slow') {
      eventMan.enemy.delay = Math.round(eventMan.enemy.delay * 3)
      clearInterval(enemy.interval)
      eventMan.enemy.interval = setInterval(eventMan.enemyAttack, eventMan.enemy.delay)
    } else if (damage === 'block') {
    } else {
      eventMan.enemy.health -= damage
      if (eventMan.enemy.health <= 0) {
        eventMan.enemy.health = 0
        eventMan.enemyDead()
      } else {
        document.getElementById('enemy-health-bar').textContent
          = `health ${eventMan.enemy.health}`
      }
    }
  },

  clearCell(cellIndex, icon) {
    const cell = document.getElementById(`cell-${cellIndex}`)
    const content = cell.textContent
    cell.textContent = (content === icon) ? '' : content
  },

  displayLoot() {
    game.pause()

    const title = 'After the battle'
    const text = 'Examining the defeated enemy you discover usable resources'

    const eventPanel = document.createElement('div')
    eventPanel.setAttribute('id', 'event')
    eventPanel.setAttribute('data-legend', title)
    eventPanel.textContent = text

    let topPanel = document.createElement('div')
    topPanel.setAttribute('id', 'event-top-panel')
    topPanel = eventMan.displayFight(topPanel)

    Object.entries(eventMan.enemy.loot).forEach(([key, val]) => {
      const btn = document.createElement('div')
      btn.setAttribute('class', 'btn active')
      btn.textContent = `${key} (${eventMan.enemy.loot[key]})`
      topPanel.appendChild(btn)

      btn.addEventListener('click', (event) => {
        const btn = event.target
        if (btn.className === 'btn active') {
          if (btn.textContent.split(' ')[0] === 'energy' && explorer.energy < explorer.energyMax
              && eventMan.enemy.loot.energy > 0) {
            explorer.energy += 1
            eventMan.enemy.loot.energy -= 1
            btn.textContent = `${btn.textContent.split(' ')[0]} (${eventMan.enemy.loot.energy})`
            updateAllPanels()
            if (eventMan.enemy.loot.energy === 0) {
              btn.classList.remove('active')
            }
          } else if (btn.textContent.split(' ')[0] !== 'energy') {
            explorer[btn.textContent.split(' ')[0]] += 1
            eventMan.enemy.loot[key] -= 1
            btn.textContent = `${btn.textContent.split(' ')[0]} (${eventMan.enemy.loot[key]})`
            updateAllPanels()
            if (eventMan.enemy.loot[btn.textContent.split(' ')[0]] === 0) {
              btn.classList.remove('active')
            }
          }
        }
      })
    })

    const bottomPanel = document.createElement('div')
    bottomPanel.setAttribute('id', 'event-bottom-panel')
    eventMan.closeButton()
    eventMan.closeBtn.setAttribute('class', 'btn active')
    bottomPanel.appendChild(eventMan.closeBtn)

    eventPanel.appendChild(topPanel)
    eventPanel.appendChild(bottomPanel)

    eventMan.activePanel = eventPanel
    document.getElementById('container').appendChild(eventPanel)
  },

  enemyDead() {
    clearInterval(eventMan.enemy.interval)
    eventMan.enemy.defeated()
    eventMan.activePanel.parentNode.removeChild(eventMan.activePanel)
    eventMan.displayLoot()
  },
}
