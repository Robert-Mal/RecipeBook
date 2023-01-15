import timePassed from "../shared/utils/timePassed";

let now: number;

describe("time passed util", () => {
  beforeEach(() => {
    now = new Date().getTime();
  });

  it("should return 1 second ago", () => {
    const secondAgo = now - 1000;
    expect(timePassed(String(secondAgo))).toBe("1 second ago");
  });

  it("should return 2 seconds ago", () => {
    const secondAgo = now - 2000;
    expect(timePassed(String(secondAgo))).toBe("2 seconds ago");
  });

  it("should return 1 minute ago", () => {
    const secondAgo = now - 1000 * 60;
    expect(timePassed(String(secondAgo))).toBe("1 minute ago");
  });

  it("should return 2 minutes ago", () => {
    const secondAgo = now - 2000 * 60;
    expect(timePassed(String(secondAgo))).toBe("2 minutes ago");
  });

  it("should return 1 hour ago", () => {
    const secondAgo = now - 1000 * 60 * 60;
    expect(timePassed(String(secondAgo))).toBe("1 hour ago");
  });

  it("should return 2 hours ago", () => {
    const secondAgo = now - 2000 * 60 * 60;
    expect(timePassed(String(secondAgo))).toBe("2 hours ago");
  });

  it("should return 1 day ago", () => {
    const secondAgo = now - 1000 * 60 * 60 * 24;
    expect(timePassed(String(secondAgo))).toBe("1 day ago");
  });

  it("should return 2 days ago", () => {
    const secondAgo = now - 2000 * 60 * 60 * 24;
    expect(timePassed(String(secondAgo))).toBe("2 days ago");
  });

  it("should return 1 week ago", () => {
    const secondAgo = now - 1000 * 60 * 60 * 24 * 7;
    expect(timePassed(String(secondAgo))).toBe("1 week ago");
  });

  it("should return 2 week ago", () => {
    const secondAgo = now - 2000 * 60 * 60 * 24 * 7;
    expect(timePassed(String(secondAgo))).toBe("2 weeks ago");
  });

  it("should return 1 month ago", () => {
    const secondAgo = now - 1000 * 60 * 60 * 24 * 7 * 4;
    expect(timePassed(String(secondAgo))).toBe("1 month ago");
  });

  it("should return 2 months ago", () => {
    const secondAgo = now - 2000 * 60 * 60 * 24 * 7 * 5;
    expect(timePassed(String(secondAgo))).toBe("2 months ago");
  });
});
