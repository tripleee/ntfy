import Dexie from "dexie";
import session from "./Session";
import sessionReplica from "./SessionReplica";

// Uses Dexie.js
// https://dexie.org/docs/API-Reference#quick-reference
//
// Notes:
// - As per docs, we only declare the indexable columns, not all columns

const getDbBase = (username) => {
  // The IndexedDB database name is based on the logged-in user
  const dbName = username ? `ntfy-${username}` : "ntfy";
  const db = new Dexie(dbName);

  db.version(2).stores({
    subscriptions: "&id,baseUrl,[baseUrl+mutedUntil]",
    notifications: "&id,subscriptionId,time,new,[subscriptionId+new]", // compound key for query performance
    users: "&baseUrl,username",
    prefs: "&key",
  });

  return db;
};

export const getDbAsync = async () => {
  const username = await sessionReplica.username();

  return getDbBase(username);
};

const getDb = () => getDbBase(session.username());

export default getDb;