const projectInfo = [
  {
    name: "Femi Portfolio",
    url: "https://femiport.web.app",
  },
];
export default {
  site: {
    title: "Example",
    description: "Static Site Generator in Node.js for EJS Templates",
    basePath: "./",
    ...projectInfo,
  },
  build: {
    outputPath: "./public",
  },
};
