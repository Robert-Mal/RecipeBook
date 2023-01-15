import { defineConfig } from "cypress";
import { exec } from "child_process";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportHeight: 1080,
    viewportWidth: 1920,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async execute(command: string) {
          return new Promise((resolve, reject) => {
            try {
              resolve(exec(command));
            } catch (e) {
              reject(e);
            }
          });
        },
      });
    },
  },
});
