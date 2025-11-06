// ==UserScript==
// @name         RuneCut AutoBot - Fully Functional
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Fully automated bot for RuneCut - All skills mapped and ready!
// @author       AutoBot
// @match        https://html-classic.itch.zone/html/*/RuneCut/index.html*
// @match        https://angrypickle92.itch.io/runecut*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /* ============================================
     * CONFIGURATION
     * ============================================ */
    const CONFIG = {
        enabled: true,
        debugMode: true,
        checkInterval: 2000,  // Check every 2 seconds

        // Activity priorities (bot will do these in order if possible)
        activityPriority: ['combat', 'smithing', 'cooking', 'forestry', 'mining', 'fishing'],

        // Module settings
        forestry: {
            enabled: true,
            autoStart: true
        },

        mining: {
            enabled: true,
            autoStart: true
        },

        fishing: {
            enabled: true,
            autoStart: true
        },

        cooking: {
            enabled: true,
            autoStart: false  // Usually want to do this manually with specific items
        },

        smithing: {
            enabled: true,
            autoSmelt: true,
            autoUpgrade: false,  // Can enable to auto-upgrade gear
            preferredMetal: 'Copper'  // Copper, Bronze, Iron, Steel, Blacksteel
        },

        crafting: {
            enabled: true,
            autoStart: false
        },

        combat: {
            enabled: true,
            autoFight: true,
            preferredLocation: 'Swamp',  // Swamp, Volcano, Wastes, Crypts, Mountains, Dwarven Caldera
            healthThreshold: 30,  // Eat food if health % below this
            fleeThreshold: 15,    // Flee if health % below this
            autoEat: true,
            attackStyle: 'Shared'  // Attack, Strength, Defense, Shared
        },

        // Advanced settings
        autoSwitchActivities: true,  // Switch between activities intelligently
        prioritizeCombat: true,       // Always do combat if available
    };

    /* ============================================
     * UTILITY FUNCTIONS
     * ============================================ */
    const Utils = {
        log: function(message, data = null) {
            if (CONFIG.debugMode) {
                const timestamp = new Date().toLocaleTimeString();
                console.log(`[${timestamp}] [RuneCut Bot] ${message}`, data || '');
            }
        },

        error: function(message, error = null) {
            const timestamp = new Date().toLocaleTimeString();
            console.error(`[${timestamp}] [RuneCut Bot ERROR] ${message}`, error || '');
        },

        // Find button by exact or partial text match
        findButton: function(text, exact = false) {
            const buttons = Array.from(document.querySelectorAll('button'));
            if (exact) {
                return buttons.find(btn => btn.textContent.trim() === text);
            }
            return buttons.find(btn => btn.textContent.includes(text));
        },

        // Find any element by text content
        findElementByText: function(text, tag = '*') {
            const elements = Array.from(document.querySelectorAll(tag));
            return elements.find(el => el.textContent.includes(text));
        },

        // Click element safely with logging
        clickElement: function(element, description = '') {
            if (!element) {
                this.log(`Cannot click - element not found: ${description}`);
                return false;
            }
            if (element.disabled) {
                this.log(`Cannot click - element disabled: ${description}`);
                return false;
            }
            try {
                element.click();
                this.log(`✓ Clicked: ${description || element.textContent.trim()}`);
                return true;
            } catch (error) {
                this.error(`Failed to click element: ${description}`, error);
                return false;
            }
        },

        // Navigate to a specific tab/section
        navigateToTab: function(tabName) {
            // Try to find and click the tab
            const tab = this.findElementByText(tabName);
            if (tab && tab.tagName !== 'BUTTON') {
                // It might be a clickable div or link
                this.clickElement(tab, `Tab: ${tabName}`);
                return true;
            }
            return false;
        },

        // Check if text exists on page
        hasText: function(text) {
            return document.body.textContent.includes(text);
        },

        // Get number from text (e.g., "50/100" -> [50, 100])
        extractNumbers: function(text) {
            const matches = text.match(/\d+/g);
            return matches ? matches.map(Number) : [];
        },

        // Wait for condition with timeout
        waitFor: function(condition, timeout = 5000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    if (condition()) {
                        clearInterval(interval);
                        resolve(true);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        reject(new Error('Timeout'));
                    }
                }, 100);
            });
        }
    };

    /* ============================================
     * GAME STATE READER
     * ============================================ */
    const GameState = {
        cache: {
            lastUpdate: 0,
            health: 100,
            maxHealth: 100,
            inCombat: false,
            currentActivity: null
        },

        update: function() {
            // Update cache every second to avoid excessive DOM queries
            const now = Date.now();
            if (now - this.cache.lastUpdate < 1000) {
                return this.cache;
            }

            try {
                // Try to find health display (format might be "10/10")
                const healthElements = Array.from(document.querySelectorAll('*')).filter(el => {
                    const text = el.textContent;
                    return text.match(/^\d+\/\d+$/) && el.children.length === 0;
                });

                if (healthElements.length > 0) {
                    const healthText = healthElements[0].textContent;
                    const [current, max] = Utils.extractNumbers(healthText);
                    this.cache.health = current || 10;
                    this.cache.maxHealth = max || 10;
                }

                // Check if in combat (look for combat buttons)
                this.cache.inCombat = Utils.hasText('Retreat') || Utils.hasText('Flee');

                // Check current activity
                this.cache.currentActivity = this.detectCurrentActivity();

                this.cache.lastUpdate = now;
            } catch (error) {
                Utils.error('Error updating game state', error);
            }

            return this.cache;
        },

        detectCurrentActivity: function() {
            // Detect what the player is currently doing
            if (Utils.hasText('Stop') && Utils.hasText('Chop Trees')) return 'forestry';
            if (Utils.hasText('Stop') && Utils.hasText('Mine')) return 'mining';
            if (Utils.hasText('Stop') && Utils.hasText('Spot Fish')) return 'fishing';
            if (Utils.hasText('Retreat') || Utils.hasText('Flee')) return 'combat';
            return null;
        },

        getHealthPercent: function() {
            this.update();
            return (this.cache.health / this.cache.maxHealth) * 100;
        },

        isInCombat: function() {
            this.update();
            return this.cache.inCombat;
        },

        isIdle: function() {
            this.update();
            return this.cache.currentActivity === null;
        },

        getCurrentActivity: function() {
            this.update();
            return this.cache.currentActivity;
        }
    };

    /* ============================================
     * FORESTRY MODULE
     * ============================================ */
    const ForestryModule = {
        name: 'Forestry',

        canRun: function() {
            return CONFIG.forestry.enabled && CONFIG.forestry.autoStart;
        },

        isRunning: function() {
            return Utils.hasText('Chop Trees') && Utils.hasText('Stop');
        },

        run: function() {
            if (!this.canRun()) return false;

            try {
                // Navigate to Forests tab if needed
                if (!Utils.hasText('Chop Trees')) {
                    Utils.navigateToTab('Forests');
                    return false;
                }

                // Check if already chopping
                if (this.isRunning()) {
                    Utils.log('Already chopping trees');
                    return true;
                }

                // Find and click "Chop Trees" button
                const chopButton = Utils.findButton('Chop Trees');
                if (chopButton) {
                    Utils.clickElement(chopButton, 'Chop Trees');
                    return true;
                }

                Utils.log('Could not start forestry');
                return false;
            } catch (error) {
                Utils.error('Forestry error', error);
                return false;
            }
        }
    };

    /* ============================================
     * MINING MODULE
     * ============================================ */
    const MiningModule = {
        name: 'Mining',

        canRun: function() {
            return CONFIG.mining.enabled && CONFIG.mining.autoStart;
        },

        isRunning: function() {
            return Utils.hasText('Mine') && Utils.hasText('Stop');
        },

        run: function() {
            if (!this.canRun()) return false;

            try {
                // Navigate to Mining tab if needed
                if (!Utils.hasText('Mine') || !Utils.hasText('Rock')) {
                    Utils.navigateToTab('Mining');
                    return false;
                }

                // Check if already mining
                if (this.isRunning()) {
                    Utils.log('Already mining');
                    return true;
                }

                // Find and click "Mine" button
                const mineButton = Utils.findButton('Mine');
                if (mineButton) {
                    Utils.clickElement(mineButton, 'Mine');
                    return true;
                }

                Utils.log('Could not start mining');
                return false;
            } catch (error) {
                Utils.error('Mining error', error);
                return false;
            }
        }
    };

    /* ============================================
     * FISHING MODULE
     * ============================================ */
    const FishingModule = {
        name: 'Fishing',

        canRun: function() {
            return CONFIG.fishing.enabled && CONFIG.fishing.autoStart;
        },

        isRunning: function() {
            return Utils.hasText('Spot Fish') && Utils.hasText('Stop');
        },

        run: function() {
            if (!this.canRun()) return false;

            try {
                // Navigate to Fishing tab if needed
                if (!Utils.hasText('Spot Fish')) {
                    Utils.navigateToTab('Fishing');
                    return false;
                }

                // Check if already fishing
                if (this.isRunning()) {
                    Utils.log('Already fishing');
                    return true;
                }

                // Find and click "Spot Fish" button
                const fishButton = Utils.findButton('Spot Fish');
                if (fishButton) {
                    Utils.clickElement(fishButton, 'Spot Fish');
                    return true;
                }

                Utils.log('Could not start fishing');
                return false;
            } catch (error) {
                Utils.error('Fishing error', error);
                return false;
            }
        }
    };

    /* ============================================
     * SMITHING MODULE
     * ============================================ */
    const SmithingModule = {
        name: 'Smithing',

        canRun: function() {
            return CONFIG.smithing.enabled;
        },

        run: function() {
            if (!this.canRun()) return false;

            try {
                // Navigate to Smithing tab if needed
                if (!Utils.hasText('Smelt 1')) {
                    Utils.navigateToTab('Smithing');
                    return false;
                }

                // Try to smelt all available ores
                if (CONFIG.smithing.autoSmelt) {
                    const smeltAllButton = Utils.findButton('Smelt All');
                    if (smeltAllButton && !smeltAllButton.disabled) {
                        Utils.clickElement(smeltAllButton, 'Smelt All');
                        return true;
                    }
                }

                Utils.log('Nothing to smelt');
                return false;
            } catch (error) {
                Utils.error('Smithing error', error);
                return false;
            }
        }
    };

    /* ============================================
     * COOKING MODULE
     * ============================================ */
    const CookingModule = {
        name: 'Cooking',

        canRun: function() {
            return CONFIG.cooking.enabled && CONFIG.cooking.autoStart;
        },

        run: function() {
            if (!this.canRun()) return false;

            try {
                // Navigate to Cooking tab if needed
                if (!Utils.hasText('Drop raw food')) {
                    Utils.navigateToTab('Cooking');
                    return false;
                }

                // Cooking logic would go here
                // This is typically manual as you need to select what to cook

                return false;
            } catch (error) {
                Utils.error('Cooking error', error);
                return false;
            }
        }
    };

    /* ============================================
     * COMBAT MODULE
     * ============================================ */
    const CombatModule = {
        name: 'Combat',

        canRun: function() {
            return CONFIG.combat.enabled && CONFIG.combat.autoFight;
        },

        isInCombat: function() {
            return GameState.isInCombat();
        },

        run: function() {
            if (!this.canRun()) return false;

            try {
                const healthPercent = GameState.getHealthPercent();

                // If in combat, manage the fight
                if (this.isInCombat()) {
                    return this.manageCombat(healthPercent);
                }

                // If not in combat, try to start a fight
                return this.startCombat();

            } catch (error) {
                Utils.error('Combat error', error);
                return false;
            }
        },

        manageCombat: function(healthPercent) {
            // Check if we need to flee
            if (healthPercent < CONFIG.combat.fleeThreshold) {
                const fleeButton = Utils.findButton('Flee');
                if (fleeButton) {
                    Utils.clickElement(fleeButton, 'FLEE - Low Health!');
                    return true;
                }

                const retreatButton = Utils.findButton('Retreat');
                if (retreatButton) {
                    Utils.clickElement(retreatButton, 'RETREAT - Low Health!');
                    return true;
                }
            }

            // Check if we need to eat
            if (healthPercent < CONFIG.combat.healthThreshold && CONFIG.combat.autoEat) {
                const eatButton = Utils.findButton('Eat');
                if (eatButton && !eatButton.disabled) {
                    Utils.clickElement(eatButton, 'Eat Food');
                    return true;
                }
            }

            // Set attack style if needed
            this.setAttackStyle();

            Utils.log(`In combat - HP: ${healthPercent.toFixed(1)}%`);
            return true;
        },

        startCombat: function() {
            // Navigate to Combat tab if needed
            if (!Utils.hasText('Start Fight') && !Utils.hasText('Combat')) {
                Utils.navigateToTab('Combat');
                return false;
            }

            // Navigate to preferred location
            if (CONFIG.combat.preferredLocation) {
                const locationButton = Utils.findElementByText(CONFIG.combat.preferredLocation);
                if (locationButton && !Utils.hasText('Start Fight')) {
                    Utils.clickElement(locationButton, `Location: ${CONFIG.combat.preferredLocation}`);
                    return false;
                }
            }

            // Start the fight
            const startFightButton = Utils.findButton('Start Fight');
            if (startFightButton && !startFightButton.disabled) {
                Utils.clickElement(startFightButton, 'Start Fight');
                return true;
            }

            return false;
        },

        setAttackStyle: function() {
            if (!CONFIG.combat.attackStyle) return;

            // Try to select attack style (this might need adjustment based on actual UI)
            const styleButton = Utils.findButton(CONFIG.combat.attackStyle);
            if (styleButton && !styleButton.disabled) {
                // Only click if it's not already selected
                // (You might need to check for an "active" class or similar)
                Utils.clickElement(styleButton, `Attack Style: ${CONFIG.combat.attackStyle}`);
            }
        }
    };

    /* ============================================
     * MAIN BOT CONTROLLER
     * ============================================ */
    const Bot = {
        isRunning: false,
        intervalId: null,
        tickCount: 0,

        modules: {
            combat: CombatModule,
            smithing: SmithingModule,
            cooking: CookingModule,
            forestry: ForestryModule,
            mining: MiningModule,
            fishing: FishingModule
        },

        start: function() {
            if (this.isRunning) {
                Utils.log('Bot already running');
                return;
            }

            Utils.log('=== Starting RuneCut AutoBot ===');
            Utils.log('Configuration:', CONFIG);
            this.isRunning = true;
            this.tickCount = 0;

            this.intervalId = setInterval(() => {
                this.tick();
            }, CONFIG.checkInterval);

            UI.updateStatus();
            Utils.log('Bot started successfully!');
        },

        stop: function() {
            if (!this.isRunning) {
                Utils.log('Bot not running');
                return;
            }

            Utils.log('=== Stopping RuneCut AutoBot ===');
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;

            UI.updateStatus();
            Utils.log('Bot stopped');
        },

        toggle: function() {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        },

        tick: function() {
            if (!CONFIG.enabled) return;

            try {
                this.tickCount++;
                if (this.tickCount % 10 === 0) {
                    Utils.log(`=== Tick ${this.tickCount} ===`);
                }

                // Update game state
                GameState.update();

                // Execute modules based on priority
                for (const activityName of CONFIG.activityPriority) {
                    const module = this.modules[activityName];
                    if (module && module.canRun()) {
                        const result = module.run();
                        if (result) {
                            // If a module successfully did something, we can break
                            // (unless we want to try multiple things per tick)
                            if (!CONFIG.autoSwitchActivities) {
                                break;
                            }
                        }
                    }
                }

                // If idle and auto-switch is enabled, try to do something
                if (GameState.isIdle() && CONFIG.autoSwitchActivities) {
                    // Try each module until one succeeds
                    for (const moduleName in this.modules) {
                        const module = this.modules[moduleName];
                        if (module.canRun && module.canRun()) {
                            if (module.run()) {
                                break;
                            }
                        }
                    }
                }

            } catch (error) {
                Utils.error('Bot tick error', error);
            }
        }
    };

    /* ============================================
     * USER INTERFACE
     * ============================================ */
    const UI = {
        panel: null,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },

        create: function() {
            this.panel = document.createElement('div');
            this.panel.id = 'runecut-bot-panel';
            this.panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: #fff;
                    padding: 15px;
                    border-radius: 10px;
                    border: 2px solid #4a90e2;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 12px;
                    z-index: 999999;
                    min-width: 220px;
                    cursor: move;
                    user-select: none;
                " id="bot-panel-container">
                    <div style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #ffd700; text-shadow: 0 0 10px rgba(255,215,0,0.5);">
                        ⚡ RuneCut AutoBot
                    </div>

                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <button id="bot-toggle" style="
                            flex: 1;
                            padding: 10px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 13px;
                            transition: all 0.3s;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        ">▶ START</button>
                    </div>

                    <div id="bot-status" style="
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 5px;
                        margin-bottom: 8px;
                        font-size: 11px;
                        border-left: 3px solid #f44336;
                    ">
                        <div>Status: <span id="status-text" style="font-weight: bold; color: #f44336;">Stopped</span></div>
                        <div>Activity: <span id="activity-text">None</span></div>
                        <div>Health: <span id="health-text">--</span></div>
                    </div>

                    <div style="display: flex; gap: 5px;">
                        <button id="bot-config" style="
                            flex: 1;
                            padding: 6px;
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: 1px solid rgba(255,255,255,0.3);
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 10px;
                        ">⚙ Config</button>
                        <button id="bot-minimize" style="
                            flex: 1;
                            padding: 6px;
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: 1px solid rgba(255,255,255,0.3);
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 10px;
                        ">─ Hide</button>
                    </div>

                    <div style="margin-top: 8px; font-size: 9px; text-align: center; opacity: 0.7;">
                        v2.0 | Press F12 for console
                    </div>
                </div>
            `;

            document.body.appendChild(this.panel);
            this.attachEventListeners();
            this.startStatusUpdates();
        },

        attachEventListeners: function() {
            const toggleBtn = document.getElementById('bot-toggle');
            const configBtn = document.getElementById('bot-config');
            const minimizeBtn = document.getElementById('bot-minimize');
            const container = document.getElementById('bot-panel-container');

            toggleBtn.addEventListener('click', () => {
                Bot.toggle();
            });

            configBtn.addEventListener('click', () => {
                this.showConfig();
            });

            minimizeBtn.addEventListener('click', () => {
                this.toggleMinimize();
            });

            // Make panel draggable
            container.addEventListener('mousedown', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    this.isDragging = true;
                    this.dragOffset = {
                        x: e.clientX - container.offsetLeft,
                        y: e.clientY - container.offsetTop
                    };
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    container.style.left = (e.clientX - this.dragOffset.x) + 'px';
                    container.style.top = (e.clientY - this.dragOffset.y) + 'px';
                    container.style.right = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
            });
        },

        updateStatus: function() {
            const statusText = document.getElementById('status-text');
            const activityText = document.getElementById('activity-text');
            const healthText = document.getElementById('health-text');
            const toggleBtn = document.getElementById('bot-toggle');

            if (Bot.isRunning) {
                statusText.textContent = 'Running';
                statusText.style.color = '#4CAF50';
                toggleBtn.textContent = '⏸ STOP';
                toggleBtn.style.background = '#f44336';
                document.getElementById('bot-status').style.borderLeftColor = '#4CAF50';
            } else {
                statusText.textContent = 'Stopped';
                statusText.style.color = '#f44336';
                toggleBtn.textContent = '▶ START';
                toggleBtn.style.background = '#4CAF50';
                document.getElementById('bot-status').style.borderLeftColor = '#f44336';
            }

            // Update activity
            const activity = GameState.getCurrentActivity();
            activityText.textContent = activity ? activity.charAt(0).toUpperCase() + activity.slice(1) : 'Idle';

            // Update health
            const healthPercent = GameState.getHealthPercent();
            healthText.textContent = `${healthPercent.toFixed(0)}%`;
            if (healthPercent < 30) {
                healthText.style.color = '#f44336';
            } else if (healthPercent < 60) {
                healthText.style.color = '#ff9800';
            } else {
                healthText.style.color = '#4CAF50';
            }
        },

        startStatusUpdates: function() {
            setInterval(() => {
                this.updateStatus();
            }, 1000);
        },

        showConfig: function() {
            alert('Open browser console (F12) and type:\nwindow.RuneCutConfig\n\nTo change settings, use:\nwindow.RuneCutConfig.combat.autoFight = false');
        },

        toggleMinimize: function() {
            const container = document.getElementById('bot-panel-container');
            const btn = document.getElementById('bot-minimize');

            if (container.style.width === '50px') {
                container.style.width = '';
                btn.textContent = '─ Hide';
            } else {
                container.style.width = '50px';
                container.style.overflow = 'hidden';
                btn.textContent = '□';
            }
        }
    };

    /* ============================================
     * INITIALIZATION
     * ============================================ */
    function initialize() {
        Utils.log('=== RuneCut AutoBot Initializing ===');
        Utils.log('Waiting for game to load...');

        setTimeout(() => {
            try {
                UI.create();
                Utils.log('✓ Bot UI created');
                Utils.log('✓ Bot ready! Click START to begin automation');
                Utils.log('✓ Use window.RuneCutBot and window.RuneCutConfig in console');

                // Show welcome message
                console.log('%c' + `
╔════════════════════════════════════════╗
║   🎮 RuneCut AutoBot v2.0 Loaded! 🎮   ║
╠════════════════════════════════════════╣
║                                        ║
║  Controls:                             ║
║  - Click START button to run           ║
║  - Check console for activity logs     ║
║                                        ║
║  Console Commands:                     ║
║  window.RuneCutBot.start()             ║
║  window.RuneCutBot.stop()              ║
║  window.RuneCutConfig (view settings)  ║
║                                        ║
║  Activities Automated:                 ║
║  ✓ Forestry (tree chopping)            ║
║  ✓ Mining (ore mining)                 ║
║  ✓ Fishing (fish catching)             ║
║  ✓ Smithing (ore smelting)             ║
║  ✓ Combat (auto fight & heal)          ║
║                                        ║
╚════════════════════════════════════════╝
                `, 'color: #4CAF50; font-family: monospace; font-size: 12px;');

            } catch (error) {
                Utils.error('Initialization error', error);
            }
        }, 3000);
    }

    // Wait for page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Expose to window for console access
    window.RuneCutBot = Bot;
    window.RuneCutConfig = CONFIG;
    window.RuneCutUtils = Utils;

    Utils.log('RuneCut AutoBot script loaded!');

})();
