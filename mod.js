const { ModLoader } = require("modloader");
const { DatabaseServer } = require("tarkov-server");
const { ItemHelper } = require("tarkov-server");

class CloneAK12Mod {
  constructor() {
    this.modLoader = new ModLoader();
    this.database = DatabaseServer.getTables();
    this.itemHelper = new ItemHelper(this.database);

    this.cloneAK12();
    this.cloneMagazine();
    this.addItemsToTrader();
  }

  cloneAK12() {
    const originalAK12 = this.itemHelper.getItemByID("5b5f78dc86f77409407a7f8e"); // ID for AK-12
    const newAK12 = JSON.parse(JSON.stringify(originalAK12));
    newAK12._id = "custom_ak12";
    newAK12._props.Name = "Custom AK-12";
    newAK12._props.ShortName = "CAK-12";
    newAK12._props.Description = "A custom clone of the AK-12.";
    newAK12._props.Caliber = "Caliber57x28NATO"; // Set the caliber to 5.7x28mm
    newAK12._props.Chambers = ["5c5db5f42e221600102610a3"]; // 5.7x28mm chamber ID
    newAK12._props.Cartridges = ["5c5db5f42e221600102610a3"]; // 5.7x28mm cartridge ID

    this.database.templates.items.push(newAK12);
  }

  cloneMagazine() {
    const originalMagID = "5b5f71b386f77409407a7f8e"; // ID for 5.45x39mm 30-round magazine
    const originalMag = this.itemHelper.getItemByID(originalMagID);
    const newMag = JSON.parse(JSON.stringify(originalMag));
    newMag._id = `custom_${originalMagID}`;
    newMag._props.Name = `Custom ${originalMag._props.Name}`;
    newMag._props.ShortName = `C${originalMag._props.ShortName}`;
    newMag._props.Description = `A custom clone of the ${originalMag._props.Name}.`;
    newMag._props.Cartridges = ["5c5db5f42e221600102610a3"]; // 5.7x28mm cartridge ID

    this.database.templates.items.push(newMag);
  }

  addItemsToTrader() {
    const peacekeeper = this.database.traders["5a7c2eca46aef81a7ca2145d"]; // ID for Peacekeeper
    const items = peacekeeper.assort.items;
    const barter_scheme = peacekeeper.assort.barter_scheme;
    const loyal_level_items = peacekeeper.assort.loyal_level_items;

    // Add custom AK-12 to Peacekeeper level 2
    items.push({
      _id: "custom_ak12_offer",
      _tpl: "custom_ak12",
      parentId: "hideout",
      slotId: "hideout",
      upd: { UnlimitedCount: true, StackObjectsCount: 1 }
    });
    barter_scheme["custom_ak12_offer"] = [[{ count: 100, _tpl: "5449016a4bdc2d6f028b456f" }]]; // Set price in USD
    loyal_level_items["custom_ak12_offer"] = 2;

    // Add custom magazine to Peacekeeper level 2
    items.push({
      _id: "custom_mag_offer",
      _tpl: "custom_5b5f71b386f77409407a7f8e",
      parentId: "hideout",
      slotId: "hideout",
      upd: { UnlimitedCount: true, StackObjectsCount: 1 }
    });
    barter_scheme["custom_mag_offer"] = [[{ count: 20, _tpl: "5449016a4bdc2d6f028b456f" }]]; // Set price in USD
    loyal_level_items["custom_mag_offer"] = 2;
  }
}

module.exports = new CloneAK12Mod();
