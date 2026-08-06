import { beforeEach, describe, expect, it, vi } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  defineSetVideo,
  renderSetVideo,
  SET_VIDEO_SPEC,
  type SetVideoProps,
} from "./video";

function mountVideo(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

function getWrapper(root: HTMLElement): HTMLElement {
  const wrapper = root.querySelector(".set-video");
  expect(wrapper).toBeTruthy();
  return wrapper as HTMLElement;
}

function getVideo(root: HTMLElement): HTMLVideoElement {
  const video = root.querySelector("video");
  expect(video).toBeTruthy();
  return video as HTMLVideoElement;
}

describe("renderSetVideo", () => {
  it("renders div.set-video and video with required src", () => {
    const root = mountVideo(renderSetVideo({ src: "/clip.mp4" }));
    const wrapper = getWrapper(root);
    const video = getVideo(root);

    expect(wrapper.classList.contains("set-video")).toBe(true);
    expect(video.classList.contains("video")).toBe(true);
    expect(video.getAttribute("src")).toBe("/clip.mp4");
  });

  it("throws when src is empty after trimming", () => {
    expect(() => renderSetVideo({ src: "   " })).toThrow(
      "src must be a non-empty string.",
    );
  });

  it("emits playback attributes only when enabled", () => {
    const enabledRoot = mountVideo(
      renderSetVideo({
        autoPlay: true,
        controls: true,
        loop: true,
        muted: true,
        playsInline: true,
        src: "/clip.mp4",
      }),
    );
    const enabledVideo = getVideo(enabledRoot);

    expect(enabledVideo.hasAttribute("autoplay")).toBe(true);
    expect(enabledVideo.hasAttribute("controls")).toBe(true);
    expect(enabledVideo.hasAttribute("loop")).toBe(true);
    expect(enabledVideo.hasAttribute("muted")).toBe(true);
    expect(enabledVideo.hasAttribute("playsinline")).toBe(true);

    const defaultRoot = mountVideo(renderSetVideo({ src: "/clip.mp4" }));
    const defaultVideo = getVideo(defaultRoot);

    expect(defaultVideo.hasAttribute("autoplay")).toBe(false);
    expect(defaultVideo.hasAttribute("controls")).toBe(false);
    expect(defaultVideo.hasAttribute("loop")).toBe(false);
    expect(defaultVideo.hasAttribute("muted")).toBe(false);
    expect(defaultVideo.hasAttribute("playsinline")).toBe(false);
  });

  it("trims and emits poster, omitting it when empty", () => {
    const posterRoot = mountVideo(
      renderSetVideo({ poster: " /poster.jpg ", src: "/clip.mp4" }),
    );
    expect(getVideo(posterRoot).getAttribute("poster")).toBe("/poster.jpg");

    const emptyRoot = mountVideo(
      renderSetVideo({ poster: "   ", src: "/clip.mp4" }),
    );
    expect(getVideo(emptyRoot).hasAttribute("poster")).toBe(false);
  });

  it("emits preload only when provided", () => {
    const preloadRoot = mountVideo(
      renderSetVideo({ preload: "metadata", src: "/clip.mp4" }),
    );
    expect(getVideo(preloadRoot).getAttribute("preload")).toBe("metadata");

    const defaultRoot = mountVideo(renderSetVideo({ src: "/clip.mp4" }));
    expect(getVideo(defaultRoot).hasAttribute("preload")).toBe(false);
  });

  it("emits intrinsic width and height attributes when provided", () => {
    const root = mountVideo(
      renderSetVideo({ height: 360, src: "/clip.mp4", width: 640 }),
    );
    const video = getVideo(root);

    expect(video.getAttribute("width")).toBe("640");
    expect(video.getAttribute("height")).toBe("360");

    const bareVideo = getVideo(
      mountVideo(renderSetVideo({ src: "/clip.mp4" })),
    );
    expect(bareVideo.hasAttribute("width")).toBe(false);
    expect(bareVideo.hasAttribute("height")).toBe(false);
  });

  it("emits data-fluid only when fit is fluid", () => {
    const fluidRoot = mountVideo(
      renderSetVideo({ fit: "fluid", src: "/clip.mp4" }),
    );
    expect(getWrapper(fluidRoot).hasAttribute("data-fluid")).toBe(true);

    const defaultRoot = mountVideo(renderSetVideo({ src: "/clip.mp4" }));
    expect(getWrapper(defaultRoot).hasAttribute("data-fluid")).toBe(false);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountVideo(
      renderSetVideo({ id: "my-video", src: "/clip.mp4" }),
    );
    expect(getWrapper(root).id).toBe("my-video");
  });

  it("omits id when not provided", () => {
    const root = mountVideo(renderSetVideo({ src: "/clip.mp4" }));
    expect(getWrapper(root).hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetVideo({ id: "not valid", src: "/clip.mp4" }),
    ).toThrow();
  });
});

let mediaQueryMatches = false;
const mediaQueryListeners = new Set<
  (event: { matches: boolean; media: string }) => void
>();

Object.defineProperty(document.defaultView ?? window, "matchMedia", {
  configurable: true,
  value: (query: string) => {
    let own: ((event: { matches: boolean; media: string }) => void) | undefined;
    return {
      addEventListener: (
        type: string,
        listener: (event: { matches: boolean; media: string }) => void,
      ) => {
        if (type === "change") {
          own = listener;
          mediaQueryListeners.add(listener);
        }
      },
      get matches() {
        return mediaQueryMatches;
      },
      media: query,
      removeEventListener: () => {
        if (own) mediaQueryListeners.delete(own);
        own = undefined;
      },
    };
  },
});

function setReducedMotion(matches: boolean): void {
  mediaQueryMatches = matches;
  for (const listener of [...mediaQueryListeners]) {
    listener({ matches, media: "(prefers-reduced-motion: reduce)" });
  }
}

beforeEach(() => {
  mediaQueryMatches = false;
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() =>
    Promise.resolve(),
  );
  vi.clearAllMocks();
});

describe("defineSetVideo", () => {
  beforeEach(() => {
    defineSetVideo();
  });

  it("registers the custom element and tolerates repeat definition", () => {
    expect(customElements.get("set-video")).toBeTruthy();
    expect(() => defineSetVideo()).not.toThrow();
  });

  it("withdraws autoplay while reduced motion is preferred", () => {
    mediaQueryMatches = true;
    const root = mountVideo(
      renderSetVideo({ autoPlay: true, muted: true, src: "/clip.mp4" }),
    );
    const video = getVideo(root);

    expect(video.hasAttribute("autoplay")).toBe(false);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("restores autoplay when the preference relaxes", () => {
    mediaQueryMatches = true;
    const root = mountVideo(
      renderSetVideo({ autoPlay: true, muted: true, src: "/clip.mp4" }),
    );
    const video = getVideo(root);
    expect(video.hasAttribute("autoplay")).toBe(false);

    setReducedMotion(false);
    expect(video.hasAttribute("autoplay")).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("pauses when the preference changes to reduce after load", () => {
    const root = mountVideo(
      renderSetVideo({ autoPlay: true, muted: true, src: "/clip.mp4" }),
    );
    const video = getVideo(root);
    expect(video.hasAttribute("autoplay")).toBe(true);

    setReducedMotion(true);
    expect(video.hasAttribute("autoplay")).toBe(false);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("leaves non-autoplay videos untouched", () => {
    mediaQueryMatches = true;
    const root = mountVideo(renderSetVideo({ src: "/clip.mp4" }));
    const video = getVideo(root);

    expect(video.hasAttribute("autoplay")).toBe(false);
    expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled();
  });
});

describeSpecConsistency<SetVideoProps>({
  baseProps: { src: "/clip.mp4" },
  renderer: renderSetVideo,
  spec: SET_VIDEO_SPEC,
});
