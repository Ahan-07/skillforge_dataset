const fs = require("fs");
const path = require("path");

const manifest = require("./manifest.json");

const cache = new Map();

function resolveManifestPath(relativePath = "") {
  return path.resolve(__dirname, relativePath);
}

function loadJSON(relativePath) {
  const fullPath = resolveManifestPath(relativePath);
  if (cache.has(fullPath)) return cache.get(fullPath);
  const value = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  cache.set(fullPath, value);
  return value;
}

function normalizeKey(value = "") {
  return String(value || "").trim().toLowerCase();
}

function buildAliasMap(sectionName) {
  const section = manifest[sectionName] || {};
  const aliases = new Map();

  for (const [key, config] of Object.entries(section)) {
    const normalizedKey = normalizeKey(key);
    aliases.set(normalizedKey, key);
    const labels = [
      config?.label,
    ].filter(Boolean);

    for (const label of labels) {
      aliases.set(normalizeKey(label), key);
      aliases.set(normalizeKey(label).replace(/[^a-z0-9]/g, ""), key);
    }
  }

  return aliases;
}

const aliasMaps = {
  roadmaps: buildAliasMap("roadmaps"),
  prerequisite_tests: buildAliasMap("prerequisite_tests"),
  roles: buildAliasMap("roles"),
};

function findEntryKey(sectionName, candidate = "") {
  const section = manifest[sectionName] || {};
  const aliases = aliasMaps[sectionName];
  const key = normalizeKey(candidate);
  if (!key) return null;

  if (section[key]) return key;
  if (aliases?.has(key)) return aliases.get(key);

  const compact = key.replace(/[^a-z0-9]/g, "");
  if (aliases?.has(compact)) return aliases.get(compact);

  return Object.keys(section).find((entryKey) => {
    const normalized = normalizeKey(entryKey);
    return key.includes(normalized) || normalized.includes(key) || compact.includes(normalized.replace(/[^a-z0-9]/g, ""));
  }) || null;
}

function getRoadmap(key) {
  const entryKey = findEntryKey("roadmaps", key);
  if (!entryKey) return null;
  return loadJSON(manifest.roadmaps[entryKey].path).roadmap || null;
}

function getPrerequisiteTest(key) {
  const entryKey = findEntryKey("prerequisite_tests", key);
  if (!entryKey) return null;
  return loadJSON(manifest.prerequisite_tests[entryKey].path).prerequisite_test || null;
}

function getRolePath(key) {
  const entryKey = findEntryKey("roles", key);
  if (!entryKey) return null;
  return loadJSON(manifest.roles[entryKey].path).role || null;
}

function listKeys(sectionName) {
  return Object.keys(manifest[sectionName] || {});
}

module.exports = {
  manifest,
  findEntryKey,
  getRoadmap,
  getPrerequisiteTest,
  getRolePath,
  listKeys,
};
