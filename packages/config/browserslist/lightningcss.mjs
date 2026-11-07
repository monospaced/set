import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

import query from "./index.mjs";

const lightningcssTargets = browserslistToTargets(browserslist(query));

export default lightningcssTargets;
