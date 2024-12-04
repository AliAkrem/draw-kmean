export function createUniqueMantineColorGenerator() {
  const colors = [
    "red",
    "green",
    "yellow",
    "orange",
    "teal",
    "pink",
    "purple",
    "grape",
    "violet",
    "indigo",
    "cyan",
    "lime",
  ];
  const shades = [8];
  let usedColors = new Set(); // Tracks used colors

  function getRandomUniqueMantineColor(idx?: number) {
    if (idx != null) {
      return `${colors[idx]}.8`;
    }

    if (usedColors.size >= colors.length * shades.length) {
      throw new Error("No more unique colors available.");
    }

    let color;
    do {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomShade = shades[Math.floor(Math.random() * shades.length)];
      color = `${randomColor}.${randomShade}`;
    } while (usedColors.has(color));

    usedColors.add(color);
    return color;
  }
  function reset() {
    usedColors = new Set(); // Clear the set
  }

  return { getRandomUniqueMantineColor, reset };
}
