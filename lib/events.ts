// Custom event system for cross-component communication

export const EVENTS = {
  OPEN_ESTIMATE_MODAL: "openEstimateModal",
  SCROLL_TO_SERVICES: "scrollToServices",
} as const;

export const emitEvent = (eventName: string, detail?: unknown) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }
};

export const subscribeToEvent = (
  eventName: string,
  handler: (event: CustomEvent) => void
) => {
  if (typeof window !== "undefined") {
    window.addEventListener(eventName, handler as EventListener);
    return () => window.removeEventListener(eventName, handler as EventListener);
  }
  return () => {};
};
