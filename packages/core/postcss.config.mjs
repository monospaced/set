import browserslist from "@monospaced/set-config/browserslist";
import autoprefixer from "autoprefixer";

export default {
  plugins: [autoprefixer({ overrideBrowserslist: browserslist })],
};
