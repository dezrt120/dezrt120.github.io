# 🎮 RuneCut AutoBot v2.0 - FULLY FUNCTIONAL

> **Status: ✅ WORKING** - All major modules are mapped and functional!

A complete, ready-to-use Tampermonkey automation bot for the RuneCut incremental RPG game.

## 🚀 Quick Start (2 Minutes!)

### 1️⃣ Install Tampermonkey
Get the browser extension:
- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 2️⃣ Install the Bot Script
1. Open Tampermonkey dashboard (click the icon, then "Dashboard")
2. Click "Create a new script" (+ icon)
3. Delete all the default code
4. Copy **ALL** the code from `runecut-autobot.user.js`
5. Paste it in
6. Hit **Ctrl+S** (or Cmd+S on Mac) to save

### 3️⃣ Play the Game
1. Go to: **https://html-classic.itch.zone/html/14955607-1422326/RuneCut/index.html**
2. You'll see a blue control panel appear in the top-right corner
3. Click the **▶ START** button
4. Watch the magic happen! 🎉

## ✨ What This Bot Does

### 🟢 Fully Automated Skills
The bot will automatically:

- **🌲 Forestry** - Continuously chop trees for logs and XP
- **⛏️ Mining** - Automatically mine ores
- **🎣 Fishing** - Keep catching fish
- **🔨 Smithing** - Smelt all ores automatically
- **⚔️ Combat** - Fight monsters with intelligent health management:
  - Auto-start fights in your preferred location
  - Eat food when health drops below 30%
  - Flee if health drops below 15%
  - Continues fighting automatically

### 🎛️ Control Panel Features
The bot includes a draggable control panel showing:
- **Status** - Running/Stopped
- **Current Activity** - What the bot is doing right now
- **Health** - Your current HP percentage (color-coded)
- **START/STOP** button - Easy control
- **Config** button - Quick access to settings
- **Hide** button - Minimize the panel

### 🧠 Smart Features
- **Priority System** - Does important tasks first (Combat > Smithing > Gathering)
- **Activity Switching** - Automatically switches between tasks
- **Safety Checks** - Won't spam clicks or break the game
- **Real-time Logging** - See everything happening in console (F12)
- **Configurable** - Change settings on-the-fly

## ⚙️ Configuration

The bot comes pre-configured with sensible defaults, but you can customize everything!

### Quick Config via Console

Press **F12** to open console, then type:

```javascript
// View current settings
window.RuneCutConfig

// Disable combat
window.RuneCutConfig.combat.enabled = false

// Change combat location
window.RuneCutConfig.combat.preferredLocation = 'Volcano'

// Adjust health thresholds
window.RuneCutConfig.combat.healthThreshold = 50  // Eat at 50% HP
window.RuneCutConfig.combat.fleeThreshold = 20    // Flee at 20% HP

// Change bot speed
window.RuneCutConfig.checkInterval = 3000  // Check every 3 seconds

// Disable a skill
window.RuneCutConfig.forestry.autoStart = false

// Change activity priority
window.RuneCutConfig.activityPriority = ['forestry', 'mining', 'fishing']
```

### Default Configuration

```javascript
{
  // Activity priority (bot does these in order)
  activityPriority: ['combat', 'smithing', 'cooking', 'forestry', 'mining', 'fishing'],

  checkInterval: 2000,  // Check game state every 2 seconds

  // Combat settings
  combat: {
    enabled: true,
    autoFight: true,
    preferredLocation: 'Swamp',
    healthThreshold: 30,   // Eat food below 30% HP
    fleeThreshold: 15,     // Flee below 15% HP
    autoEat: true,
    attackStyle: 'Shared'
  },

  // Gathering skills
  forestry: { enabled: true, autoStart: true },
  mining: { enabled: true, autoStart: true },
  fishing: { enabled: true, autoStart: true },

  // Processing skills
  smithing: { enabled: true, autoSmelt: true },
  cooking: { enabled: true, autoStart: false },
  crafting: { enabled: true, autoStart: false }
}
```

## 🎮 Using the Bot

### Starting the Bot
**Method 1:** Click the **▶ START** button on the control panel

**Method 2:** Open console (F12) and type:
```javascript
window.RuneCutBot.start()
```

### Stopping the Bot
**Method 1:** Click the **⏸ STOP** button

**Method 2:** In console:
```javascript
window.RuneCutBot.stop()
```

### Monitoring Activity
- **Control Panel** - Shows current status and activity
- **Browser Console (F12)** - Detailed logs of all actions
- **Status Updates** - Real-time health and activity tracking

### Console Commands

```javascript
// Bot control
window.RuneCutBot.start()
window.RuneCutBot.stop()
window.RuneCutBot.toggle()

// View configuration
window.RuneCutConfig

// Modify settings
window.RuneCutConfig.combat.autoFight = false
window.RuneCutConfig.debugMode = true

// Access utilities
window.RuneCutUtils.log('Custom message')
window.RuneCutUtils.findButton('Chop Trees')

// Check game state
GameState.getHealthPercent()
GameState.isInCombat()
GameState.getCurrentActivity()
```

## 🎯 How It Works

### Intelligent Activity Management

1. **Priority System**: Bot checks activities in priority order
2. **State Detection**: Reads what you're currently doing
3. **Auto-Switching**: When idle, starts the next priority task
4. **Combat First**: Prioritizes combat if enabled
5. **Resource Processing**: Smelts ores when available

### Combat System

The bot intelligently manages combat:

1. **Navigate** to your preferred location (Swamp by default)
2. **Start Fight** - Clicks "Start Fight" button
3. **Monitor Health** - Constantly checks your HP
4. **Auto-Eat** - Eats food when HP drops below 30%
5. **Emergency Flee** - Flees if HP drops below 15%
6. **Repeat** - After combat, starts next fight

### Gathering Skills

For Forestry, Mining, and Fishing:

1. Navigate to the correct tab
2. Start the activity (Chop Trees / Mine / Spot Fish)
3. Let it run in the background
4. Switch to other activities as needed

## 📊 Activity Priority Examples

### Focus on Combat
```javascript
window.RuneCutConfig.activityPriority = ['combat']
window.RuneCutConfig.forestry.autoStart = false
window.RuneCutConfig.mining.autoStart = false
// Now bot ONLY does combat
```

### Peaceful Skilling
```javascript
window.RuneCutConfig.combat.enabled = false
window.RuneCutConfig.activityPriority = ['smithing', 'forestry', 'mining', 'fishing']
// No combat, just gathering and processing
```

### Balanced Gameplay
```javascript
window.RuneCutConfig.activityPriority = ['combat', 'smithing', 'forestry', 'mining', 'fishing']
// Default - combat first, then processing, then gathering
```

## 🔧 Troubleshooting

### Bot Not Starting?
1. **Check console** (F12) for errors
2. **Reload the page** (Ctrl+R)
3. **Verify script is enabled** in Tampermonkey
4. **Check URL** - must be on the game page, not itch.io homepage

### Bot Not Doing Anything?
1. **Check if modules are enabled**:
   ```javascript
   window.RuneCutConfig.forestry.enabled
   window.RuneCutConfig.combat.enabled
   ```
2. **Enable debug mode**:
   ```javascript
   window.RuneCutConfig.debugMode = true
   ```
3. **Check console** for activity logs

### Combat Not Working?
1. **Verify combat is enabled**:
   ```javascript
   window.RuneCutConfig.combat.autoFight = true
   ```
2. **Check you have food** (for auto-eat)
3. **Try different location**:
   ```javascript
   window.RuneCutConfig.combat.preferredLocation = 'Volcano'
   ```

### Bot Running Too Fast/Slow?
```javascript
// Slower (every 5 seconds)
window.RuneCutConfig.checkInterval = 5000

// Faster (every 1 second)
window.RuneCutConfig.checkInterval = 1000
```

### Health Not Showing?
This is normal if you haven't unlocked combat yet. The health display will work once you can fight.

## 🎓 Advanced Usage

### Custom Activity Loop

```javascript
// Only do forestry and mining, alternate between them
window.RuneCutConfig.activityPriority = ['forestry', 'mining']
window.RuneCutConfig.combat.enabled = false
window.RuneCutConfig.fishing.enabled = false
window.RuneCutConfig.autoSwitchActivities = true
```

### Combat Farming Build

```javascript
// Pure combat with aggressive settings
window.RuneCutConfig.combat.healthThreshold = 50  // Eat early
window.RuneCutConfig.combat.fleeThreshold = 25    // Safe flee point
window.RuneCutConfig.combat.preferredLocation = 'Mountains'  // Harder enemies
window.RuneCutConfig.forestry.autoStart = false
window.RuneCutConfig.mining.autoStart = false
```

### Resource Gathering Build

```javascript
// Focus on gathering, minimal combat
window.RuneCutConfig.combat.enabled = false
window.RuneCutConfig.smithing.autoSmelt = true
window.RuneCutConfig.activityPriority = ['smithing', 'forestry', 'mining', 'fishing']
```

## 📋 Features Checklist

- ✅ Forestry automation (tree chopping)
- ✅ Mining automation (ore collection)
- ✅ Fishing automation (fish catching)
- ✅ Smithing automation (ore smelting)
- ✅ Combat automation (fighting & healing)
- ✅ Health monitoring & display
- ✅ Activity detection & switching
- ✅ Priority-based task management
- ✅ Emergency flee system
- ✅ Auto-eat when low health
- ✅ Draggable control panel
- ✅ Real-time status updates
- ✅ Console logging & debugging
- ✅ Fully configurable settings
- ✅ No mapping required - works out of the box!

## 🎨 UI Features

- **Draggable Panel** - Click and drag to reposition
- **Color-Coded Health** - Red (low), Orange (medium), Green (high)
- **Status Indicators** - Know exactly what's happening
- **Minimize Function** - Hide panel while bot runs
- **Styled Interface** - Clean, modern design

## 💡 Tips & Tricks

1. **Start Small** - Enable one activity at a time to learn how it works
2. **Watch Console** - Open F12 to see detailed bot activity
3. **Adjust Priorities** - Reorder activities based on your goals
4. **Combat Safety** - Set conservative health thresholds when learning
5. **AFK Play** - Bot can run while you're away (but monitor it!)
6. **Save Often** - Use the game's save feature regularly

## 🔒 Safety & Ethics

- **Personal Use** - This bot is for your own entertainment and learning
- **Fair Play** - Be respectful of the game developer
- **No Exploitation** - Don't use bot to grief or harm others
- **Support Devs** - If you enjoy the game, consider supporting the developer
- **Educational** - Great for learning JavaScript and DOM manipulation!

## 🐛 Known Limitations

- **Cooking** - Not fully automated (requires item selection)
- **Crafting** - Not fully automated (requires item selection)
- **Construction/Royal Service/Alchemy** - Not implemented (game-dependent)
- **Inventory Management** - Doesn't auto-sort or organize items
- **Bank Usage** - Doesn't interact with banking (if game has it)

## 🔄 Version History

### v2.0.0 (Current)
- ✅ **Fully functional and mapped** - No configuration needed!
- ✅ All major activities working (Forestry, Mining, Fishing, Smithing, Combat)
- ✅ Intelligent health management
- ✅ Activity detection and auto-switching
- ✅ Beautiful UI with drag & drop
- ✅ Comprehensive console commands
- ✅ Real-time status updates

### v1.0.0 (Previous)
- Template version requiring manual mapping
- Educational guides included

## 📝 FAQ

**Q: Do I need to map anything?**
A: No! This version is fully mapped and ready to use.

**Q: Will this get me banned?**
A: This is a single-player game. There's no anti-cheat system.

**Q: Can I modify the bot?**
A: Absolutely! The code is well-commented and easy to customize.

**Q: Does it work on mobile?**
A: No, Tampermonkey requires a desktop browser.

**Q: Can I run multiple bots?**
A: Only one bot per game window. Multiple windows = multiple bots.

**Q: How do I update the bot?**
A: Replace the old script with new code in Tampermonkey, then save.

## 🎯 What's Next?

1. ✅ Install the bot (follow Quick Start)
2. ✅ Start it up and watch it work
3. ✅ Customize settings to your playstyle
4. ✅ Open console to see all the details
5. ✅ Enjoy automated RuneCut!

## 📞 Support

- **Check Console First** - Most issues show error messages (F12)
- **Try Default Settings** - Reset config to defaults if something breaks
- **Read This README** - Most questions are answered here
- **Experiment** - The bot is safe to experiment with!

---

## 🚀 Ready to Go!

The bot is **100% functional** and requires **zero configuration**. Just:

1. Install Tampermonkey
2. Copy the script
3. Visit the game
4. Click START
5. Profit! 🎉

**Game URL**: https://html-classic.itch.zone/html/14955607-1422326/RuneCut/index.html

**Happy Botting!** 🤖⚡

---

*Made with ❤️ for the RuneCut community*

*v2.0.0 - Fully Functional Edition*
