import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetVideo, SET_VIDEO_SPEC, type SetVideoProps } from "./video";

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
    controls: false,
    fit: "intrinsic",
    height: 0,
    id: "",
    loop: true,
    muted: true,
    playsInline: true,
    poster: "",
    preload: undefined,
    src: "https://res.cloudinary.com/monospaced/video/upload/v1786016416/3._Logomark_ek0caz.mp4",
    width: 0,
  } satisfies SetVideoProps,
  render: (args: SetVideoProps) => renderSetVideo(args),
};
