// ==UserScript==
// @name         RuneCut AutoBot
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automated bot for RuneCut game - handles Forestry, Mining, Crafting, and more
// @author       Your Name
// @match        https://angrypickle92.itch.io/runecut
// @match        https://v6p9d9t4.ssl.hwcdn.net/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /* ============================================
     * CONFIGURATION SECTION
     * ============================================
     * Edit these settings to customize bot behavior
     */
    const CONFIG = {
        enabled: true,                    // Master switch for the bot
        debugMode: true,                  // Show console logs
        checkInterval: 1000,              // How often to check game state (ms)

        // Module enable/disable switches
        modules: {
            forestry: true,
            mining: true,
            fishing: true,
            crafting: true,
            smithing: true,
            cooking: true,
            construction: true,
            royalService: true,
            enchanting: true,
            destruction: true,
            combat: true
        },

        // Forestry settings
        forestry: {
            enabled: true,
            preferredTree: 'oak',         // Which tree to cut (will need to find actual IDs)
            autoUpgrade: true             // Automatically switch to better trees
        },

        // Mining settings
        mining: {
            enabled: true,
            preferredOre: 'copper',       // Which ore to mine
            autoUpgrade: true
        },

        // Fishing settings
        fishing: {
            enabled: true,
            preferredSpot: 'normal',
            autoUpgrade: true
        },

        // Crafting settings
        crafting: {
            enabled: true,
            itemsToCraft: [],             // List of items to craft automatically
            priorityOrder: []             // Order of crafting priority
        },

        // Smithing settings
        smithing: {
            enabled: true,
            itemsToSmith: [],
            priorityOrder: []
        },

        // Cooking settings
        cooking: {
            enabled: true,
            itemsToCook: [],
            priorityOrder: []
        },

        // Combat settings
        combat: {
            enabled: true,
            autoFight: true,
            targetMonster: 'weakest',     // 'weakest', 'strongest', or specific monster name
            healthThreshold: 50,          // Stop fighting if health below this %
            autoEat: true,
            foodToEat: 'best'             // 'best', 'worst', or specific food name
        }
    };

    /* ============================================
     * UTILITY FUNCTIONS
     * ============================================ */

    const Utils = {
        log: function(message, data = null) {
            if (CONFIG.debugMode) {
                console.log(`[RuneCut Bot] ${message}`, data || '');
            }
        },

        error: function(message, error = null) {
            console.error(`[RuneCut Bot ERROR] ${message}`, error || '');
        },

        // Find elements by text content
        findElementByText: function(text, tag = '*') {
            const elements = document.querySelectorAll(tag);
            return Array.from(elements).find(el => el.textContent.trim().includes(text));
        },

        // Find button by text
        findButton: function(text) {
            return this.findElementByText(text, 'button');
        },

        // Click element safely
        clickElement: function(element) {
            if (element && !element.disabled) {
                element.click();
                return true;
            }
            return false;
        },

        // Wait for element to appear
        waitForElement: function(selector, timeout = 5000) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }

                const observer = new MutationObserver(() => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error('Timeout waiting for element'));
                }, timeout);
            });
        }
    };

    /* ============================================
     * GAME STATE MANAGER
     * ============================================
     * This section reads the current game state
     */

    const GameState = {
        // Cache for game elements
        elements: {},

        // Get player stats
        getPlayerStats: function() {
            // TODO: Map these selectors to actual game elements
            // Example: return { health: ..., level: ..., experience: ... }
            return {
                health: this.findStat('health'),
                maxHealth: this.findStat('maxHealth'),
                level: this.findStat('level'),
                experience: this.findStat('experience')
            };
        },

        // Get skill level
        getSkillLevel: function(skillName) {
            // TODO: Map to actual skill level elements
            return 0;
        },

        // Check if player is in combat
        isInCombat: function() {
            // TODO: Determine how to detect combat state
            return false;
        },

        // Check if action is in progress
        isActionInProgress: function() {
            // TODO: Determine how to detect if player is doing something
            return false;
        },

        findStat: function(statName) {
            // TODO: Implement stat finding logic
            return 0;
        },

        // Get inventory items
        getInventory: function() {
            // TODO: Map inventory system
            return [];
        }
    };

    /* ============================================
     * MODULE: FORESTRY
     * ============================================ */

    const ForestryModule = {
        name: 'Forestry',

        run: function() {
            if (!CONFIG.forestry.enabled) return;

            try {
                // Check if already chopping
                if (GameState.isActionInProgress()) {
                    Utils.log('Already performing an action');
                    return;
                }

                // TODO: Find and click the tree to chop
                // Example implementation (you'll need to adjust):
                const treeButton = this.findTreeButton(CONFIG.forestry.preferredTree);

                if (treeButton) {
                    Utils.clickElement(treeButton);
                    Utils.log('Started chopping tree');
                }
            } catch (error) {
                Utils.error('Forestry module error', error);
            }
        },

        findTreeButton: function(treeName) {
            // TODO: Map actual tree buttons
            // Example: return Utils.findButton('Oak Tree');
            return null;
        }
    };

    /* ============================================
     * MODULE: MINING
     * ============================================ */

    const MiningModule = {
        name: 'Mining',

        run: function() {
            if (!CONFIG.mining.enabled) return;

            try {
                if (GameState.isActionInProgress()) {
                    Utils.log('Already performing an action');
                    return;
                }

                const oreButton = this.findOreButton(CONFIG.mining.preferredOre);

                if (oreButton) {
                    Utils.clickElement(oreButton);
                    Utils.log('Started mining ore');
                }
            } catch (error) {
                Utils.error('Mining module error', error);
            }
        },

        findOreButton: function(oreName) {
            // TODO: Map actual ore buttons
            return null;
        }
    };

    /* ============================================
     * MODULE: FISHING
     * ============================================ */

    const FishingModule = {
        name: 'Fishing',

        run: function() {
            if (!CONFIG.fishing.enabled) return;

            try {
                if (GameState.isActionInProgress()) {
                    Utils.log('Already performing an action');
                    return;
                }

                const fishButton = this.findFishingButton();

                if (fishButton) {
                    Utils.clickElement(fishButton);
                    Utils.log('Started fishing');
                }
            } catch (error) {
                Utils.error('Fishing module error', error);
            }
        },

        findFishingButton: function() {
            // TODO: Map actual fishing buttons
            return null;
        }
    };

    /* ============================================
     * MODULE: CRAFTING
     * ============================================ */

    const CraftingModule = {
        name: 'Crafting',

        run: function() {
            if (!CONFIG.crafting.enabled) return;

            try {
                // Check inventory for materials
                // Craft items based on priority

                for (const item of CONFIG.crafting.priorityOrder) {
                    if (this.canCraft(item)) {
                        this.craftItem(item);
                        break;
                    }
                }
            } catch (error) {
                Utils.error('Crafting module error', error);
            }
        },

        canCraft: function(itemName) {
            // TODO: Check if player has materials
            return false;
        },

        craftItem: function(itemName) {
            // TODO: Find and click craft button
            Utils.log(`Crafting ${itemName}`);
        }
    };

    /* ============================================
     * MODULE: SMITHING
     * ============================================ */

    const SmithingModule = {
        name: 'Smithing',

        run: function() {
            if (!CONFIG.smithing.enabled) return;

            try {
                for (const item of CONFIG.smithing.priorityOrder) {
                    if (this.canSmith(item)) {
                        this.smithItem(item);
                        break;
                    }
                }
            } catch (error) {
                Utils.error('Smithing module error', error);
            }
        },

        canSmith: function(itemName) {
            // TODO: Check if player has materials
            return false;
        },

        smithItem: function(itemName) {
            // TODO: Find and click smith button
            Utils.log(`Smithing ${itemName}`);
        }
    };

    /* ============================================
     * MODULE: COOKING
     * ============================================ */

    const CookingModule = {
        name: 'Cooking',

        run: function() {
            if (!CONFIG.cooking.enabled) return;

            try {
                for (const item of CONFIG.cooking.priorityOrder) {
                    if (this.canCook(item)) {
                        this.cookItem(item);
                        break;
                    }
                }
            } catch (error) {
                Utils.error('Cooking module error', error);
            }
        },

        canCook: function(itemName) {
            // TODO: Check if player has ingredients
            return false;
        },

        cookItem: function(itemName) {
            // TODO: Find and click cook button
            Utils.log(`Cooking ${itemName}`);
        }
    };

    /* ============================================
     * MODULE: COMBAT
     * ============================================ */

    const CombatModule = {
        name: 'Combat',

        run: function() {
            if (!CONFIG.combat.enabled) return;

            try {
                const stats = GameState.getPlayerStats();

                // Check if health is too low
                if (stats.health / stats.maxHealth * 100 < CONFIG.combat.healthThreshold) {
                    if (CONFIG.combat.autoEat) {
                        this.eatFood();
                    }
                    return;
                }

                // If not in combat, start fighting
                if (!GameState.isInCombat() && CONFIG.combat.autoFight) {
                    this.attackMonster();
                }
            } catch (error) {
                Utils.error('Combat module error', error);
            }
        },

        attackMonster: function() {
            // TODO: Find and click monster to attack
            Utils.log('Attacking monster');
        },

        eatFood: function() {
            // TODO: Find and click food to eat
            Utils.log('Eating food');
        }
    };

    /* ============================================
     * MAIN BOT CONTROLLER
     * ============================================ */

    const Bot = {
        isRunning: false,
        intervalId: null,

        modules: [
            ForestryModule,
            MiningModule,
            FishingModule,
            CraftingModule,
            SmithingModule,
            CookingModule,
            CombatModule
        ],

        start: function() {
            if (this.isRunning) {
                Utils.log('Bot is already running');
                return;
            }

            Utils.log('Starting RuneCut Bot...');
            this.isRunning = true;

            // Run main loop
            this.intervalId = setInterval(() => {
                this.tick();
            }, CONFIG.checkInterval);

            Utils.log('Bot started successfully');
        },

        stop: function() {
            if (!this.isRunning) {
                Utils.log('Bot is not running');
                return;
            }

            Utils.log('Stopping bot...');
            clearInterval(this.intervalId);
            this.isRunning = false;
            Utils.log('Bot stopped');
        },

        tick: function() {
            if (!CONFIG.enabled) return;

            try {
                // Run all enabled modules
                for (const module of this.modules) {
                    if (CONFIG.modules[module.name.toLowerCase()]) {
                        module.run();
                    }
                }
            } catch (error) {
                Utils.error('Bot tick error', error);
            }
        },

        toggle: function() {
            if (this.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        }
    };

    /* ============================================
     * UI CONTROLS
     * ============================================
     * Creates a control panel for the bot
     */

    const UI = {
        panel: null,

        create: function() {
            // Create control panel
            this.panel = document.createElement('div');
            this.panel.id = 'runecut-bot-panel';
            this.panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.9);
                    color: #0f0;
                    padding: 15px;
                    border-radius: 8px;
                    border: 2px solid #0f0;
                    font-family: monospace;
                    font-size: 12px;
                    z-index: 999999;
                    min-width: 200px;
                ">
                    <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; text-align: center;">
                        RuneCut AutoBot
                    </div>
                    <button id="bot-toggle" style="
                        width: 100%;
                        padding: 8px;
                        margin-bottom: 5px;
                        background: #0f0;
                        color: #000;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    ">START</button>
                    <div id="bot-status" style="
                        padding: 8px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 4px;
                        margin-top: 5px;
                        text-align: center;
                    ">Status: Stopped</div>
                </div>
            `;

            document.body.appendChild(this.panel);

            // Add event listeners
            const toggleBtn = document.getElementById('bot-toggle');
            toggleBtn.addEventListener('click', () => {
                Bot.toggle();
                this.updateStatus();
            });
        },

        updateStatus: function() {
            const statusDiv = document.getElementById('bot-status');
            const toggleBtn = document.getElementById('bot-toggle');

            if (Bot.isRunning) {
                statusDiv.textContent = 'Status: Running';
                statusDiv.style.color = '#0f0';
                toggleBtn.textContent = 'STOP';
                toggleBtn.style.background = '#f00';
            } else {
                statusDiv.textContent = 'Status: Stopped';
                statusDiv.style.color = '#f00';
                toggleBtn.textContent = 'START';
                toggleBtn.style.background = '#0f0';
            }
        }
    };

    /* ============================================
     * INITIALIZATION
     * ============================================ */

    function initialize() {
        Utils.log('Initializing RuneCut Bot...');

        // Wait for game to load
        setTimeout(() => {
            try {
                UI.create();
                Utils.log('Bot UI created. Click START to begin automation.');

                // Optional: Auto-start the bot
                if (CONFIG.enabled) {
                    // Bot.start();
                }
            } catch (error) {
                Utils.error('Initialization error', error);
            }
        }, 3000);
    }

    // Start the bot when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Expose bot to window for console control
    window.RuneCutBot = Bot;
    window.RuneCutConfig = CONFIG;

    Utils.log('RuneCut Bot loaded! Use window.RuneCutBot to control from console.');

})();
