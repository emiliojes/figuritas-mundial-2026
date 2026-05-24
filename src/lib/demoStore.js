const USERS_KEY = 'demo_users';
const GROUPS_KEY = 'demo_groups';
const SESSION_KEY = 'demo_session';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}
function saveUsers(u) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}
function getGroups() {
  return JSON.parse(localStorage.getItem(GROUPS_KEY) || '{}');
}
function saveGroups(g) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(g));
}

export function demoRegister(email, password, displayName) {
  const users = getUsers();
  if (Object.values(users).find(u => u.email === email)) {
    throw { code: 'auth/email-already-in-use' };
  }
  const uid = 'user_' + Math.random().toString(36).substring(2, 10);
  users[uid] = { uid, email, displayName, password, stickers: {}, createdAt: new Date().toISOString() };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, uid);
  return users[uid];
}

export function demoLogin(email, password) {
  const users = getUsers();
  const user = Object.values(users).find(u => u.email === email && u.password === password);
  if (!user) throw { code: 'auth/invalid-credential' };
  localStorage.setItem(SESSION_KEY, user.uid);
  return user;
}

export function demoLogout() {
  localStorage.removeItem(SESSION_KEY);
}

export function demoGetSession() {
  const uid = localStorage.getItem(SESSION_KEY);
  if (!uid) return null;
  const users = getUsers();
  return users[uid] || null;
}

export function demoGetUser(uid) {
  return getUsers()[uid] || null;
}

export function demoUpdateStickers(uid, stickers) {
  const users = getUsers();
  if (users[uid]) {
    users[uid].stickers = stickers;
    saveUsers(users);
  }
}

export function demoCreateGroup(name, creatorUid) {
  const groups = getGroups();
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const id = 'group_' + Math.random().toString(36).substring(2, 10);
  groups[id] = { id, name, code, members: [creatorUid], createdBy: creatorUid, createdAt: new Date().toISOString() };
  saveGroups(groups);
  return groups[id];
}

export function demoJoinGroup(code, uid) {
  const groups = getGroups();
  const group = Object.values(groups).find(g => g.code === code.toUpperCase());
  if (!group) throw new Error('no-group');
  if (group.members.includes(uid)) throw new Error('already-member');
  group.members.push(uid);
  saveGroups(groups);
  return group;
}

export function demoGetMyGroups(uid) {
  return Object.values(getGroups()).filter(g => g.members.includes(uid));
}

export function demoGetGroup(id) {
  return getGroups()[id] || null;
}

export function demoGetUsers(uids) {
  const users = getUsers();
  return uids.map(uid => users[uid]).filter(Boolean);
}
