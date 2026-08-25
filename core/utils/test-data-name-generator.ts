const pad = (value: number): string => String(value).padStart(2, '0');

export function utcTimestamp(date: Date = new Date()): string {
  const day = `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
  const time = `${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}`;
  return `${day}-${time}`;
}

export function testDataName(tcID: string, entity: string, date: Date = new Date()): string {
  return `AT-${tcID}-${entity}-${utcTimestamp(date)}`;
}

export function testDataSlug(tcID: string, entity: string, date: Date = new Date()): string {
  return testDataName(tcID, entity, date)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}
