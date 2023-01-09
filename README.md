# GodNooNoo webpages

## How to develop.

To fit with GitHub Pages, the webpage is a static webpage, developed in TypeScript and compiled to JavaScript. Development is done by changing the files in the `src` (input) folder, then compiling them to the `build` (output) folder. The `build` folder is the one that is served by GitHub Pages. through the `index.html` file, therefore these files should not be changed manually.

-   Install Node.js and npm.
-   Install the dependencies with `npm i`.
-   Enable live compilation by running `npx tsc -w`. This recompiles the `build` folder each time you make changes to the files in the `src` folder.
-   Use an extension for running the static website, or run it with node, e.g. `npm run`. I use the extension `ritwickdey.LiveServer` for VSCode.
