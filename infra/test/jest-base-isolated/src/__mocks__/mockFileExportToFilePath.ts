export default {
  process: (src: unknown, filename: string) =>
    `module.exports = ${JSON.stringify(filename)};`,
};
