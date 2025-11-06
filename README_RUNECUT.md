# 🎮 RuneCut AutoBot

A comprehensive Tampermonkey automation bot for the RuneCut incremental RPG game.

## 📦 What's Included

This package provides everything you need to create a fully automated bot for RuneCut:

- **runecut-autobot.user.js** - Complete Tampermonkey script with modular architecture
- **RUNECUT_SETUP.md** - Quick start guide and installation instructions
- **RUNECUT_MAPPING_GUIDE.md** - Detailed tutorial on mapping game elements

## ✨ Features

### Automated Modules
- 🌲 **Forestry** - Auto-chop trees with upgrade support
- ⛏️ **Mining** - Auto-mine ores
- 🎣 **Fishing** - Auto-catch fish
- 🔨 **Smithing** - Auto-smith equipment
- 🍳 **Cooking** - Auto-cook food with priority system
- 🎨 **Crafting** - Auto-craft items
- ⚔️ **Combat** - Auto-fight with health management & food eating
- 🏗️ **Construction** - Template included
- 👑 **Royal Service** - Template included
- ✨ **Enchanting** - Template included
- 💥 **Destruction** - Template included

### Bot Features
- ✅ Easy-to-use START/STOP control panel
- ✅ Fully configurable settings
- ✅ Debug logging for troubleshooting
- ✅ Modular architecture (easy to extend)
- ✅ Priority-based crafting system
- ✅ Auto-upgrade to better resources
- ✅ Safe action checking (won't spam clicks)

## 🚀 Quick Start

### 1️⃣ Install Tampermonkey
Install the Tampermonkey browser extension for your browser:
- [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 2️⃣ Install the Script
1. Open Tampermonkey dashboard
2. Create new script
3. Copy contents of `runecut-autobot.user.js`
4. Save (Ctrl+S)

### 3️⃣ Map Game Elements
**⚠️ IMPORTANT:** The script needs to be configured for your game!

Read **`RUNECUT_MAPPING_GUIDE.md`** for step-by-step instructions on:
- How to find game elements using browser DevTools
- How to update the script with correct selectors
- How to test your changes
- Examples for each module

### 4️⃣ Play!
1. Visit https://angrypickle92.itch.io/runecut
2. Look for the green control panel (top-right)
3. Click START to begin automation

## 📖 Documentation

| File | Description |
|------|-------------|
| **RUNECUT_SETUP.md** | Installation, configuration, and quick reference |
| **RUNECUT_MAPPING_GUIDE.md** | Complete tutorial on mapping game elements |
| **runecut-autobot.user.js** | The actual bot script |

## 🎯 How It Works

### Architecture
```
RuneCut AutoBot
├── Configuration (CONFIG object)
│   ├── Module enable/disable switches
│   ├── Module-specific settings
│   └── Timing/behavior settings
│
├── Utility Functions (Utils)
│   ├── Logging
│   ├── Element finding
│   ├── Safe clicking
│   └── Wait helpers
│
├── Game State Manager (GameState)
│   ├── Read player stats
│   ├── Check action status
│   ├── Get inventory
│   └── Detect combat state
│
├── Automation Modules
│   ├── ForestryModule
│   ├── MiningModule
│   ├── FishingModule
│   ├── CraftingModule
│   ├── SmithingModule
│   ├── CookingModule
│   └── CombatModule
│
├── Bot Controller
│   ├── Main loop
│   ├── Module execution
│   └── Start/stop logic
│
└── UI Control Panel
    ├── START/STOP button
    └── Status display
```

### The Mapping Process
1. **Inspect** game elements using browser DevTools (F12)
2. **Find** unique selectors for buttons and UI elements
3. **Test** selectors in browser console
4. **Update** script functions with correct selectors
5. **Verify** bot can interact with game

## ⚙️ Configuration Examples

### Enable/Disable Modules
```javascript
CONFIG.modules.forestry = true;   // Enable forestry
CONFIG.modules.combat = false;    // Disable combat
```

### Adjust Bot Speed
```javascript
CONFIG.checkInterval = 2000;  // Check every 2 seconds (slower)
CONFIG.checkInterval = 500;   // Check every 0.5 seconds (faster)
```

### Combat Settings
```javascript
CONFIG.combat = {
    enabled: true,
    autoFight: true,
    targetMonster: 'Goblin',      // Fight specific monster
    healthThreshold: 70,          // Retreat at 70% HP
    autoEat: true,
    foodToEat: 'Cooked Fish'
};
```

### Crafting Priority
```javascript
CONFIG.crafting = {
    enabled: true,
    priorityOrder: [
        'Iron Sword',
        'Iron Armor',
        'Wooden Shield'
    ]
};
```

## 🎮 Console Commands

Control the bot from browser console (F12):

```javascript
// Start/stop bot
window.RuneCutBot.start()
window.RuneCutBot.stop()
window.RuneCutBot.toggle()

// Modify configuration on-the-fly
window.RuneCutConfig.checkInterval = 3000
window.RuneCutConfig.combat.healthThreshold = 80

// Test individual modules
ForestryModule.run()
MiningModule.run()
CombatModule.run()

// Debug game state
GameState.getPlayerStats()
GameState.isInCombat()
GameState.getInventory()
```

## 🔍 Troubleshooting

### Bot Not Working?
1. Open console (F12) and check for errors
2. Verify modules are enabled in CONFIG
3. Check that you've mapped the game elements
4. Make sure you're on the game page (not just the itch.io page)

### How to Map Elements?
See **`RUNECUT_MAPPING_GUIDE.md`** for complete tutorial with examples.

### Finding Selectors
```javascript
// In browser console (F12):
document.querySelectorAll('button')  // Find all buttons
document.querySelector('.tree-oak')  // Find by class
document.getElementById('chop-btn')  // Find by ID

// Find by text content
Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Chop'))
```

## 📋 Mapping Checklist

- [ ] Install Tampermonkey
- [ ] Install script
- [ ] Read RUNECUT_MAPPING_GUIDE.md
- [ ] Map Forestry module
- [ ] Map Mining module
- [ ] Map Fishing module
- [ ] Map Combat module
- [ ] Map Crafting/Smithing/Cooking
- [ ] Configure priorities
- [ ] Test and optimize
- [ ] Enjoy automation!

## 🎓 Learning Resources

### For Beginners
- **What is Tampermonkey?** - A browser extension that runs custom JavaScript on websites
- **What is a selector?** - A way to find specific elements on a webpage (like buttons)
- **How do I find selectors?** - Use browser DevTools (F12) and the inspect tool

### Guides Included
1. **RUNECUT_SETUP.md** - Start here for installation
2. **RUNECUT_MAPPING_GUIDE.md** - Complete mapping tutorial with examples
3. This README - Overview and quick reference

## 🔒 Responsible Use

- This bot is for **educational and personal use**
- Respect the game developer's work
- Consider supporting the developer if you enjoy the game
- Don't use bots to harm other players or break ToS
- Be aware that automation may affect game balance

## 💡 Tips

1. **Start simple** - Map one module at a time
2. **Test frequently** - Verify each change works before moving on
3. **Use logging** - Enable debugMode to see what the bot is doing
4. **Read the guides** - They contain detailed examples and solutions
5. **Be patient** - Mapping takes time but only needs to be done once

## 🤝 Contributing

This is a personal project template, but feel free to:
- Customize for your own use
- Share improvements with others
- Learn from the code structure
- Build similar bots for other games

## 📝 Version History

- **v1.0.0** - Initial release with full module templates and comprehensive guides

## 🎯 What's Next?

1. ✅ Install the script
2. 📖 Read **RUNECUT_MAPPING_GUIDE.md**
3. 🔧 Map your first module (Forestry recommended)
4. 🧪 Test it works
5. 🚀 Map remaining modules
6. 🎮 Enjoy automated gameplay!

---

**Game:** [RuneCut by AngryPickle92](https://angrypickle92.itch.io/runecut)

**Documentation:**
- Setup Guide: `RUNECUT_SETUP.md`
- Mapping Tutorial: `RUNECUT_MAPPING_GUIDE.md`

**Need Help?** Start with the mapping guide - it has detailed examples for every module!
