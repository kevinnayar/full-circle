export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export function getRandomDarkColor() {
  const letters = '012';
  const start1 = letters[Math.floor(Math.random() * letters.length)];
  const start2 = letters[Math.floor(Math.random() * letters.length)];
  const color = getRandomColor();

  return `#${start1}${start2}${color.slice(3)}`;
}

export function getRandomLightColor() {
  const letters = 'DEF';
  const start1 = letters[Math.floor(Math.random() * letters.length)];
  const start2 = letters[Math.floor(Math.random() * letters.length)];
  const color = getRandomColor();

  return `#${start1}${start2}${color.slice(3)}`;
}

export function getDarkBgColor() {
  return '#141414';
}

export function getLightBgColor() {
  return '#dedede';
}
