import Realm from 'realm';

class itemDatabase extends Realm.Object {}
itemDatabase.schema = {
  name: 'ItemDB',
  primaryKey: 'id',
  properties: {
    id: { type: 'int' },
    name: { type: 'string' },
    quantity: { type: 'int', default: 1 },
    category: { type: 'string', default: 'Other' },
    expirationDate: { type: 'date' },
    createdTimestamp: { type: 'date' },
    image: { type: 'string', optional: true },
    notes: { type: 'string', optional: true },
    barcode: { type: 'string', optional: true },
    binned: { type: 'bool', default: false },
    used: { type: 'bool', default: false },
  },
};

class usageDatabase extends Realm.Object {}
usageDatabase.schema = {
  name: 'UsageDB',
  primaryKey: 'id',
  properties: {
    id: 'string',
    itemName: 'string',
    binned: { type: 'int', default: 0 },
    eaten: { type: 'int', default: 0 },
    createdTimestamp: { type: 'date', default: new Date() },
  },
};

export const realm = new Realm({
  schema: [itemDatabase, usageDatabase],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const oldObjects = oldRealm.objects('ItemDB');
      const newObjects = newRealm.objects('ItemDB');

      for (let i = 0; i < oldObjects.length; i++) {
        newObjects[i].quantity = 1; // ✅ int
        newObjects[i].category = 'Other';
        newObjects[i].binned = false;
        newObjects[i].used = false;
      }
    }
  },
});