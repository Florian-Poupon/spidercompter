/* eslint-env node */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")?.[1] ?? "";
const inferredGithubBase = repoName ? `/${repoName}/` : "./";
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
const base = process.env.VITE_BASE_PATH ?? (isGithubPagesBuild ? inferredGithubBase : "./");

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
});
