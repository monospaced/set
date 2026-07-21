import browserslist from "@measured/set-config/browserslist";
import autoprefixer from "autoprefixer";

export default {
  plugins: [autoprefixer({ overrideBrowserslist: browserslist })],
};
