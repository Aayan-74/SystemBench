function parseRegistryFile(content) {
  const registryEntries = {};
  const lines = content.split('\n');
  
  let currentKey = null;
  
  for (const line of lines) {
    // Parse registry keys
    if (line.startsWith('[')) {
      currentKey = line.replace(/[\[\]]/g, '').trim();
      registryEntries[currentKey] = {};
    }
    // Parse registry values
    else if (currentKey && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      registryEntries[currentKey][key.trim()] = value;
    }
  }
  
  return registryEntries;
}
