import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  defineSetVideo,
  renderSetVideo,
  SET_VIDEO_SPEC,
  type SetVideoProps,
} from "./video";

defineSetVideo();

const FALLBACK_SRC =
  "https://res.cloudinary.com/monospaced/video/upload/v1786046808/4._Logomark_oskqly.mp4";

const meta = {
  argTypes: specToArgTypes(SET_VIDEO_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_VIDEO_SPEC),
      },
    },
  },
  title: "Graphic/Video",
};

export default meta;

export const Default = {
  args: {
    autoPlay: true,
    controls: true,
    fit: "intrinsic",
    height: 180,
    id: "",
    loop: true,
    muted: true,
    playsInline: true,
    poster: "",
    preload: undefined,
    src: FALLBACK_SRC,
    width: 320,
  } satisfies SetVideoProps,
  render: (args: SetVideoProps) =>
    renderSetVideo({ ...args, src: args.src?.trim() || FALLBACK_SRC }),
};
