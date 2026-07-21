import "@monospaced/set-assets/fonts.css";
import "@monospaced/set-core/styles.css";

import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { Example } from "./Example";
import { Index } from "./Index";
import { StepperPage } from "./Stepper";

type Route = "index" | "app" | "example" | "stepper";

function getRoute(): Route {
  const slug = window.location.hash.replace(/^#/, "");
  if (slug === "app" || slug === "example" || slug === "stepper") return slug;
  return "index";
}

function Router() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "app") return <App />;
  if (route === "example") return <Example />;
  if (route === "stepper") return <StepperPage />;
  return <Index />;
}

const container = document.getElementById("root");

if (!container) throw new Error("#root not found");

createRoot(container).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
