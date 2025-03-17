const THIRTY_MINUTES = 30 * 60 * 1000;

async function trackIpUsage(tokenInfo, ipAddress) {
  const now = new Date();
  const ipRecord = tokenInfo.ipAddresses.find(
    (record) => record.ip === ipAddress
  );

  if (ipRecord) {
    const lastUsedAt = new Date(ipRecord.lastUsedAt);
    const timeDifference = now - lastUsedAt;

    if (timeDifference < THIRTY_MINUTES) {
      return true; // Same IP within 30 minutes, don't count as new request
    } else {
      ipRecord.lastUsedAt = now;
    }
  } else {
    tokenInfo.ipAddresses.push({ ip: ipAddress, lastUsedAt: now });
  }

  await tokenInfo.save();
  return false; // Count as a new request
}

module.exports = { trackIpUsage };
