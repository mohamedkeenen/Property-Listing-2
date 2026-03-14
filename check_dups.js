
const { filterOptions } = require('./g:/KEEN Enterprises/Project/Portal/property-listing/data/mockData.ts');

for (const [key, list] of Object.entries(filterOptions)) {
  if (Array.isArray(list)) {
    const seen = new Set();
    const dups = list.filter(item => {
      const val = typeof item === 'string' ? item : item.value;
      if (seen.has(val)) return true;
      seen.add(val);
      return false;
    });
    if (dups.length > 0) {
      console.log(`Array ${key} has duplicates:`, dups);
    }
  }
}
