const fs = require("fs");
const path = require("path");
const logger = console; // Use console for logging, replace with any custom logger if available

class CloneAK12Mod {
  constructor() {
    this.newAK12Id = null;
    this.newMagId = null;
  }

  load(database) {
    this.database = database;
    this.cloneAK12();
    this.cloneAK12Mag();
    this.addItemsToPeacekeeper();
  }

  cloneAK12() {
    const originalAK12Id = "6499849fc93611967b034949"; // AK-12 ID
    const originalAK12 = this.database.templates.items[originalAK12Id];
    if (!originalAK12) {
      logger.error("Original AK-12 item not found.");
      return;
    }

    const newAK12 = JSON.parse(JSON.stringify(originalAK12));
    newAK12._id = this.generateNewId();
    newAK12._props.Name = "Custom AK-12 5.7x28mm";
    newAK12._props.ShortName = "CAK-12 5.7";
    newAK12._props.Description = "A custom clone of the AK-12, modified to use 5.7x28mm ammunition.";
    newAK12._props.Caliber = "Caliber5.7x28"; // Ensure this caliber exists in your database

    this.newAK12Id = newAK12._id; // Store the new AK-12 ID
    this.database.templates.items[newAK12._id] = newAK12;
    logger.info(`Custom AK-12 cloned with ID: ${this.newAK12Id}`);
  }

  cloneAK12Mag() {
    const originalMagId = "5bed61680db834001d2c45ab"; // AK-12 30-round magazine ID
    const originalMag = this.database.templates.items[originalMagId];
    if (!originalMag) {
      logger.error("Original AK-12 30-round magazine not found.");
      return;
    }

    const newMag = JSON.parse(JSON.stringify(originalMag));
    newMag._id = this.generateNewId();
    newMag._props.Name = "Custom 5.7x28mm 30-round Mag";
    newMag._props.ShortName = "5.7x28mm Mag";
    newMag._props.Description = "A custom 30-round magazine for the modified AK-12, using 5.7x28mm ammunition.";
    newMag._props.Cartridges[0]._props.filters[0].Filter = ["Caliber5.7x28"]; // Ensure this caliber exists in your database

    this.newMagId = newMag._id; // Store the new magazine ID
    this.database.templates.items[newMag._id] = newMag;
    logger.info(`Custom 5.7x28mm 30-round magazine cloned with ID: ${this.newMagId}`);
  }

  generateNewId() {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; // Simple method for unique ID generation
  }

  addItemsToPeacekeeper() {
    const traderId = "5935c25fb3acc3127c3d8cd9"; // Peacekeeper's trader ID
    const traders = this.database.traders;
    const peacekeeper = traders[traderId];
    if (!peacekeeper) {
      logger.error("Peacekeeper not found in database.");
      return;
    }

    if (!this.newAK12Id || !this.newMagId) {
      logger.error("New AK-12 or magazine ID not set.");
      return;
    }

    const ak12Item = {
      _id: this.generateNewId(),
      _tpl: this.newAK12Id, // ID of the new AK-12
      parentId: "hideout",
      slotId: "hideout",
      upd: { UnlimitedCount: true, StackObjectsCount: 999999 }
    };

    const magItem = {
      _id: this.generateNewId(),
      _tpl: this.newMagId, // ID of the new magazine
      parentId: "hideout",
      slotId: "hideout",
      upd: { UnlimitedCount: true, StackObjectsCount: 999999 }
    };

    peacekeeper.assort.items.push(ak12Item);
    peacekeeper.assort.items.push(magItem);

    const barterScheme = [
      {
        count: 100,
        _tpl: "5696686a4bdc2da3298b456a" // Adjust based on actual currency used
      }
    ];

    peacekeeper.assort.barter_scheme[ak12Item._id] = [barterScheme];
    peacekeeper.assort.barter_scheme[magItem._id] = [barterScheme];

    peacekeeper.assort.loyal_level_items[ak12Item._id] = 1; // Set to level 1
    peacekeeper.assort.loyal_level_items[magItem._id] = 1; // Set to level 1

    logger.info(`Custom AK-12 added to Peacekeeper with ID: ${ak12Item._id}`);
    logger.info(`Custom magazine added to Peacekeeper with ID: ${magItem._id}`);
  }

  postDBLoad(container) {
    this.load(container.resolve("DatabaseServer").getTables());
    logger.info("CloneAK12Mod: Mod has been loaded successfully.");
  }
}

module.exports = { mod: new CloneAK12Mod() };
