const { DependencyContainer } = require("./app");

const main = async () => {
  const container = new DependencyContainer();
  const hapi = container.makeServer();

  await hapi.preRun();
  await hapi.runServer();

  process.on("unhandledRejection", async (err) => {
    await hapi.postRun(err);
    process.exit(1);
  });
};

main();
