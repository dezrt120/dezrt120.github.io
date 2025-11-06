# RuneCut AutoBot - Mapping Guide

This guide will teach you how to find and map game elements so the bot can interact with them.

## Table of Contents
1. [Setup & Installation](#setup--installation)
2. [Finding Game Elements](#finding-game-elements)
3. [Mapping Each Module](#mapping-each-module)
4. [Testing Your Changes](#testing-your-changes)
5. [Common Patterns](#common-patterns)

---

## Setup & Installation

### Step 1: Install Tampermonkey
1. Install the Tampermonkey browser extension:
   - Chrome: https://chrome.google.com/webstore (search "Tampermonkey")
   - Firefox: https://addons.mozilla.org (search "Tampermonkey")

### Step 2: Install the Script
1. Click the Tampermonkey icon in your browser
2. Click "Create a new script"
3. Delete the default content
4. Copy and paste the entire content from `runecut-autobot.user.js`
5. Press `Ctrl+S` (or `Cmd+S` on Mac) to save

### Step 3: Visit the Game
1. Go to https://angrypickle92.itch.io/runecut
2. The game should load with a green control panel in the top-right corner
3. Open your browser's Developer Console (F12) to see bot logs

---

## Finding Game Elements

### Opening Developer Tools
1. Press `F12` on your keyboard (or right-click and select "Inspect")
2. Click the "Console" tab to see bot messages
3. Click the "Elements" tab to inspect the page structure

### Method 1: Inspect Element
1. Right-click on any button/element in the game
2. Select "Inspect" or "Inspect Element"
3. The HTML code for that element will be highlighted
4. Look for identifiers like:
   - `id="some-id"` - unique identifiers
   - `class="some-class"` - style classes
   - Text content inside the element

### Method 2: Console Selectors
Open the Console tab and try these commands:

```javascript
// Find all buttons
document.querySelectorAll('button')

// Find element by text
Array.from(document.querySelectorAll('*')).find(el => el.textContent.includes('Forestry'))

// Find by class
document.querySelector('.tree-button')

// Find by ID
document.getElementById('oak-tree')
```

### Method 3: Using the Selector Tool
1. In the Elements tab, click the arrow icon (top-left of DevTools)
2. Hover over elements in the game to see their structure
3. Click to lock the selection
4. Note the element's properties in the right panel

---

## Mapping Each Module

### 🌲 FORESTRY MODULE

**What to Find:**
- Tree selection buttons (Oak, Willow, etc.)
- The "Chop" or "Start" button
- Progress indicators
- Wood in inventory

**How to Map:**

1. **Open the game and navigate to Forestry**

2. **Find the tree buttons:**
```javascript
// In console, test different selectors:
document.querySelector('[data-tree="oak"]')  // If game uses data attributes
document.querySelector('.tree-oak')          // If game uses class names
Utils.findButton('Oak Tree')                 // If button has text
```

3. **Update the script:**

Find this function in `runecut-autobot.user.js`:
```javascript
findTreeButton: function(treeName) {
    // TODO: Map actual tree buttons
    return null;
}
```

Replace with your findings:
```javascript
findTreeButton: function(treeName) {
    // Example: If trees are identified by data attribute
    return document.querySelector(`[data-tree="${treeName}"]`);

    // OR if they're buttons with text:
    // return Utils.findButton(treeName + ' Tree');

    // OR if they have specific class names:
    // return document.querySelector(`.tree-${treeName}`);
}
```

4. **Find the action status:**

```javascript
isActionInProgress: function() {
    // Example: Check if there's a progress bar
    return document.querySelector('.progress-bar') !== null;

    // OR check if a specific class is present:
    // return document.querySelector('.chopping') !== null;

    // OR check if button is disabled:
    // const btn = document.querySelector('.chop-button');
    // return btn && btn.disabled;
}
```

---

### ⛏️ MINING MODULE

**What to Find:**
- Ore selection buttons (Copper, Iron, etc.)
- Mining action button
- Progress indicators

**Mapping Process:**

1. Navigate to the Mining section in-game

2. **Test in console:**
```javascript
// Find ore buttons
document.querySelectorAll('button')  // Look through all buttons
document.querySelector('[data-ore="copper"]')  // Test data attributes
```

3. **Update the script:**

```javascript
findOreButton: function(oreName) {
    // Replace with your selector
    return document.querySelector(`[data-ore="${oreName}"]`);
}
```

---

### 🎣 FISHING MODULE

**What to Find:**
- Fishing spot buttons
- Cast/Fish button
- Caught fish display

**Mapping Process:**

1. Navigate to Fishing section

2. **Test selectors:**
```javascript
// Find fishing button
document.querySelector('.fish-button')
Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Fish'))
```

3. **Update the script:**

```javascript
findFishingButton: function() {
    return Utils.findButton('Fish');
    // OR: return document.querySelector('.fishing-action');
}
```

---

### 🔨 CRAFTING/SMITHING/COOKING

**What to Find:**
- Item list/menu
- Craft/Make buttons
- Material requirements display
- Inventory items

**Mapping Process:**

1. Navigate to the crafting section

2. **Find item buttons:**
```javascript
// Find all craftable items
document.querySelectorAll('.craft-item')

// Find specific item
Array.from(document.querySelectorAll('.craft-item')).find(el =>
    el.textContent.includes('Iron Sword')
)
```

3. **Check if you can craft:**
```javascript
canCraft: function(itemName) {
    const itemButton = document.querySelector(`[data-item="${itemName}"]`);
    if (!itemButton) return false;

    // Check if button is enabled/disabled
    return !itemButton.disabled;

    // OR check if materials are available (look for red/green indicators)
    // const indicator = itemButton.querySelector('.material-indicator');
    // return indicator && indicator.classList.contains('available');
}
```

4. **Craft the item:**
```javascript
craftItem: function(itemName) {
    const itemButton = document.querySelector(`[data-item="${itemName}"]`);
    if (itemButton) {
        itemButton.click();
        Utils.log(`Crafting ${itemName}`);
    }
}
```

---

### ⚔️ COMBAT MODULE

**What to Find:**
- Monster buttons/list
- Attack button
- Health bar
- Food items
- Combat status indicator

**Mapping Process:**

1. Navigate to combat area

2. **Find health display:**
```javascript
getPlayerStats: function() {
    // Look for health display
    const healthElement = document.querySelector('.player-health');
    const health = parseInt(healthElement?.textContent) || 100;

    // Or if it's in a different format:
    // const healthText = document.querySelector('.health')?.textContent;
    // // Example: "50/100 HP"
    // const [current, max] = healthText.match(/\d+/g).map(Number);

    return {
        health: current,
        maxHealth: max
    };
}
```

3. **Find monsters:**
```javascript
attackMonster: function() {
    // Find weakest monster
    const monsters = document.querySelectorAll('.monster-button');
    if (monsters.length > 0) {
        monsters[0].click();
    }

    // Or find specific monster by name:
    // const goblin = Utils.findButton('Goblin');
    // if (goblin) goblin.click();
}
```

4. **Check combat status:**
```javascript
isInCombat: function() {
    // Check if combat UI is visible
    return document.querySelector('.combat-active') !== null;

    // OR check if enemy health bar exists
    // return document.querySelector('.enemy-health') !== null;
}
```

5. **Eat food:**
```javascript
eatFood: function() {
    // Find food in inventory
    const food = document.querySelector('.inventory-item[data-type="food"]');
    if (food) {
        food.click();
        Utils.log('Eating food');
    }
}
```

---

## Testing Your Changes

### Step 1: Save and Reload
1. Edit the script in Tampermonkey
2. Press `Ctrl+S` to save
3. Refresh the game page

### Step 2: Check Console Logs
1. Open Developer Console (F12)
2. Look for `[RuneCut Bot]` messages
3. Check for any errors (shown in red)

### Step 3: Test Individual Functions
```javascript
// In console, test your mappings:
window.RuneCutBot.modules[0].run()  // Test Forestry
window.RuneCutBot.modules[1].run()  // Test Mining

// Test specific functions:
ForestryModule.findTreeButton('oak')
GameState.isActionInProgress()
```

### Step 4: Start the Bot
1. Click the START button in the control panel
2. Watch the console for activity
3. Observe if actions are being performed

---

## Common Patterns

### Pattern 1: Finding Buttons by Text
```javascript
// Generic button finder
const button = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.trim() === 'Chop');

// Case-insensitive
const button = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.toLowerCase().includes('chop'));
```

### Pattern 2: Checking Element State
```javascript
// Check if element exists
if (document.querySelector('.progress-bar')) {
    // Action in progress
}

// Check if button is disabled
const btn = document.querySelector('.action-button');
if (btn && !btn.disabled) {
    btn.click();
}

// Check for CSS classes
if (element.classList.contains('active')) {
    // Element is active
}
```

### Pattern 3: Getting Text/Numbers
```javascript
// Get text content
const levelText = document.querySelector('.level').textContent;

// Extract number from text
const level = parseInt(levelText.match(/\d+/)[0]);

// Get number from text like "50/100"
const [current, max] = text.match(/\d+/g).map(Number);
```

### Pattern 4: Finding Parent/Child Elements
```javascript
// Find child element
const parent = document.querySelector('.skill-section');
const button = parent.querySelector('.start-button');

// Find parent from child
const button = document.querySelector('.craft-button');
const container = button.closest('.crafting-container');
```

### Pattern 5: Data Attributes
```javascript
// If game uses data attributes like data-skill="forestry"
const forestrySection = document.querySelector('[data-skill="forestry"]');
const oakTree = document.querySelector('[data-tree="oak"]');

// Get data attribute value
const treeType = element.getAttribute('data-tree');
```

---

## Quick Reference: Console Commands

```javascript
// Control the bot
window.RuneCutBot.start()
window.RuneCutBot.stop()
window.RuneCutBot.toggle()

// Modify config
window.RuneCutConfig.forestry.enabled = false
window.RuneCutConfig.combat.autoFight = true
window.RuneCutConfig.checkInterval = 2000  // Slower checking

// Test specific modules
ForestryModule.run()
MiningModule.run()
CombatModule.run()

// Debug game state
GameState.getPlayerStats()
GameState.isInCombat()
GameState.isActionInProgress()

// Find elements
document.querySelectorAll('button')  // All buttons
document.querySelectorAll('[class*="tree"]')  // Elements with "tree" in class
Array.from(document.querySelectorAll('*')).filter(el =>
    el.textContent.includes('Forestry')
)
```

---

## Troubleshooting

### Bot not doing anything?
1. Check console for errors
2. Verify selectors are correct (test in console)
3. Make sure module is enabled in CONFIG
4. Check that buttons exist on current game page

### Actions happening too fast/slow?
```javascript
// Adjust check interval (in ms)
window.RuneCutConfig.checkInterval = 2000;  // Check every 2 seconds
```

### Bot clicking wrong elements?
1. Inspect the element being clicked
2. Make selectors more specific
3. Add additional checks before clicking

### Can't find element?
1. Make sure you're on the right page/tab in game
2. Check if element is in an iframe
3. Wait for elements to load:
```javascript
Utils.waitForElement('.tree-button').then(button => {
    button.click();
});
```

---

## Next Steps

1. **Map one module at a time** - Start with Forestry, get it working, then move to Mining, etc.

2. **Test frequently** - After each change, save and test in the game

3. **Use console logging** - Add `Utils.log()` statements to track what's happening

4. **Document your findings** - Keep notes on selectors that work

5. **Share and improve** - Once working, you can refine the logic and add features

---

## Example: Complete Forestry Mapping

Here's a complete example of what a mapped Forestry module might look like:

```javascript
const ForestryModule = {
    name: 'Forestry',

    run: function() {
        if (!CONFIG.forestry.enabled) return;

        try {
            // Check if already chopping
            const progressBar = document.querySelector('.forestry-progress');
            if (progressBar) {
                Utils.log('Already chopping tree');
                return;
            }

            // Find the best available tree
            const trees = ['yew', 'maple', 'oak', 'willow', 'normal'];

            for (const tree of trees) {
                const button = document.querySelector(`[data-tree="${tree}"]`);

                if (button && !button.disabled) {
                    button.click();
                    Utils.log(`Started chopping ${tree} tree`);
                    return;
                }
            }

            Utils.log('No trees available');
        } catch (error) {
            Utils.error('Forestry module error', error);
        }
    }
};
```

Good luck with your bot! Remember: map slowly, test often, and have fun! 🎮🤖
