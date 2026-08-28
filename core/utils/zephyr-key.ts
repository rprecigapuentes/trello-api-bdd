export const zephyrKey = (tags: string[]): string => {
  const tag = tags.find((t) => /^@SCRUM-T\d+$/.test(t));
  if (!tag) throw new Error('Scenario is missing its @SCRUM-T<n> tag, needed for the tcID');
  return tag.slice(1);
};
