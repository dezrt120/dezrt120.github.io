# RuneCut AutoBot - Quick Setup Guide

A complete automation bot for the RuneCut incremental RPG game.

## 🚀 Quick Start (5 Minutes)

### 1. Install Tampermonkey
- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 2. Install the Script
1. Click the Tampermonkey icon in your browser toolbar
2. Click **"Create a new script"**
3. Delete all the default code
4. Copy the entire contents of `runecut-autobot.user.js`
5. Paste into the editor
6. Press **Ctrl+S** (or Cmd+S on Mac) to save

### 3. Open the Game
1. Go to: **https://angrypickle92.itch.io/runecut**
2. Look for a green control panel in the top-right corner
3. You should see "RuneCut AutoBot" with a START button

### 4. Initial Setup Required ⚠️
**The bot will NOT work yet** - you need to map the game elements first!

Read `RUNECUT_MAPPING_GUIDE.md` for complete instructions.

---

## 📋 Files Overview

| File | Purpose |
|------|---------|
| `runecut-autobot.user.js` | Main script - install this in Tampermonkey |
| `RUNECUT_MAPPING_GUIDE.md` | **READ THIS** - How to find and map game elements |
| `RUNECUT_SETUP.md` | This file - Quick setup instructions |

---

## ⚙️ Features

### Automated Skills
- ✅ **Forestry** - Auto-chop trees
- ✅ **Mining** - Auto-mine ores
- ✅ **Fishing** - Auto-catch fish
- ✅ **Crafting** - Auto-craft items
- ✅ **Smithing** - Auto-smith equipment
- ✅ **Cooking** - Auto-cook food
- ✅ **Combat** - Auto-fight monsters with health management
- ✅ **Construction** - Template ready
- ✅ **Royal Service** - Template ready
- ✅ **Enchanting** - Template ready
- ✅ **Destruction** - Template ready

### Control Features
- 🎮 Easy START/STOP button
- 🔧 Configurable settings for each module
- 📊 Console logging for debugging
- ⚡ Adjustable check intervals
- 🎯 Priority-based crafting/smithing/cooking

---

## 🔧 Configuration

Edit settings at the top of the script in the `CONFIG` object:

```javascript
const CONFIG = {
    enabled: true,                    // Master on/off switch
    debugMode: true,                  // Show console logs
    checkInterval: 1000,              // How often to check (ms)

    // Enable/disable specific modules
    modules: {
        forestry: true,
        mining: true,
        fishing: true,
        crafting: true,
        smithing: true,
        cooking: true,
        combat: true
    },

    // Forestry settings
    forestry: {
        enabled: true,
        preferredTree: 'oak',         // Which tree to cut
        autoUpgrade: true             // Auto-switch to better trees
    },

    // Combat settings
    combat: {
        enabled: true,
        autoFight: true,
        targetMonster: 'weakest',     // 'weakest', 'strongest', or name
        healthThreshold: 50,          // Stop fighting below this %
        autoEat: true,
        foodToEat: 'best'
    }
};
```

---

## 🎯 How to Map Game Elements

**This is the most important step!** The bot comes with a template, but you need to tell it how to interact with the game.

### The Mapping Process (for each module):

#### 1. Open Developer Console
- Press **F12** on your keyboard
- Click the **"Console"** tab

#### 2. Find Game Elements
```javascript
// Example: Find all buttons
document.querySelectorAll('button')

// Example: Find element by text
Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Oak Tree'))

// Example: Find by class or ID
document.querySelector('.tree-button')
document.getElementById('oak-tree')
```

#### 3. Update the Script
Find the corresponding function and update it:

```javascript
// BEFORE (template)
findTreeButton: function(treeName) {
    // TODO: Map actual tree buttons
    return null;
}

// AFTER (mapped)
findTreeButton: function(treeName) {
    return document.querySelector(`[data-tree="${treeName}"]`);
}
```

#### 4. Test Your Changes
```javascript
// In console:
ForestryModule.run()  // Test forestry module
```

### 📖 Full Mapping Tutorial
See **`RUNECUT_MAPPING_GUIDE.md`** for detailed instructions on mapping each module.

---

## 🎮 Using the Bot

### Start/Stop via UI
1. Click the **START** button in the control panel (top-right)
2. Click **STOP** to pause the bot

### Console Commands
```javascript
// Start/stop bot
window.RuneCutBot.start()
window.RuneCutBot.stop()
window.RuneCutBot.toggle()

// Change settings on-the-fly
window.RuneCutConfig.combat.autoFight = false
window.RuneCutConfig.checkInterval = 2000  // Slower

// Test individual modules
ForestryModule.run()
MiningModule.run()
CombatModule.run()
```

---

## 🐛 Troubleshooting

### "Bot not doing anything"
1. Open console (F12) and check for errors
2. Verify you've mapped the game elements
3. Check that modules are enabled in CONFIG
4. Make sure you're on the correct game page

### "Console shows errors"
- The selectors you mapped are probably incorrect
- Re-check your element selectors using the guide
- Test selectors directly in console before adding to script

### "Actions too fast/slow"
```javascript
// Adjust speed (in milliseconds)
window.RuneCutConfig.checkInterval = 2000;  // Check every 2 seconds
```

### "Bot clicks wrong things"
- Your selectors are too broad
- Make them more specific (use IDs, data attributes, or unique classes)

---

## 📚 Learning Resources

### Understanding Tampermonkey
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- Scripts run automatically when you visit matching URLs
- Scripts can read/modify page content and interact with elements

### Understanding JavaScript Selectors
```javascript
// Get element by ID
document.getElementById('myButton')

// Get element by class
document.querySelector('.my-class')

// Get element by attribute
document.querySelector('[data-tree="oak"]')

// Get all matching elements
document.querySelectorAll('.tree-button')

// Find by text content
Array.from(document.querySelectorAll('button'))
    .find(el => el.textContent.includes('Chop'))
```

### Understanding the Game
- Play manually first to understand mechanics
- Each skill has different interfaces
- Some actions block others (can't mine while chopping)
- Combat has health management
- Crafting requires materials

---

## 🗺️ Mapping Checklist

Use this checklist as you map each module:

### Forestry Module
- [ ] Find tree selection buttons
- [ ] Find action/chop button
- [ ] Detect if action is in progress
- [ ] Test in console
- [ ] Update script
- [ ] Test with bot

### Mining Module
- [ ] Find ore selection buttons
- [ ] Find mine button
- [ ] Detect if action is in progress
- [ ] Test in console
- [ ] Update script
- [ ] Test with bot

### Fishing Module
- [ ] Find fishing spot buttons
- [ ] Find fish/cast button
- [ ] Detect if action is in progress
- [ ] Test in console
- [ ] Update script
- [ ] Test with bot

### Combat Module
- [ ] Find monster selection
- [ ] Find attack button
- [ ] Get player health display
- [ ] Get combat status
- [ ] Find food items
- [ ] Implement eat function
- [ ] Test in console
- [ ] Update script
- [ ] Test with bot

### Crafting/Smithing/Cooking
- [ ] Find item list
- [ ] Find craft buttons
- [ ] Detect available materials
- [ ] Implement crafting logic
- [ ] Test in console
- [ ] Update script
- [ ] Test with bot

---

## 💡 Tips for Success

1. **Start Small** - Map one module at a time, starting with Forestry
2. **Test Often** - Test every change in the console before saving
3. **Use Logging** - Add `Utils.log()` to track what the bot is doing
4. **Be Patient** - Mapping takes time but only needs to be done once
5. **Document** - Keep notes on what selectors work
6. **Save Often** - Save your script frequently as you make changes

---

## 🔒 Safety & Fair Play

- This bot is for **personal use and learning**
- Use responsibly and respect the game developer
- Consider the impact on game balance
- Support the developer if you enjoy the game
- Don't use bots to grief other players or break game rules

---

## 🆘 Getting Help

1. **Check the console** - Most issues show error messages
2. **Re-read the mapping guide** - The answer is usually there
3. **Test selectors in console** - Verify they return the correct elements
4. **Start fresh** - If stuck, reload the page and try again

---

## 📝 Example Workflow

Here's a typical workflow for setting up the bot:

```
Day 1: Setup
├─ Install Tampermonkey
├─ Install script
├─ Read mapping guide
└─ Learn to use Developer Console

Day 2: Map Forestry
├─ Find tree buttons in game
├─ Test selectors in console
├─ Update script
└─ Test bot with Forestry only

Day 3: Map Mining & Fishing
├─ Map Mining module
├─ Map Fishing module
└─ Test all three skills

Day 4: Map Combat
├─ Find combat elements
├─ Map health system
├─ Map food eating
└─ Test combat automation

Day 5: Map Crafting Skills
├─ Map Crafting
├─ Map Smithing
├─ Map Cooking
└─ Test all modules together

Day 6: Fine-tune
├─ Adjust timings
├─ Add priority lists
├─ Optimize behavior
└─ Enjoy automation!
```

---

## ✅ Next Steps

1. ✅ Install Tampermonkey
2. ✅ Install the script
3. ✅ Visit the game to verify script loads
4. 📖 **Read `RUNECUT_MAPPING_GUIDE.md`** (IMPORTANT!)
5. 🔧 Map your first module (start with Forestry)
6. 🧪 Test and iterate
7. 🚀 Automate all the things!

---

**Ready to get started?** Open `RUNECUT_MAPPING_GUIDE.md` and begin mapping! 🎯
