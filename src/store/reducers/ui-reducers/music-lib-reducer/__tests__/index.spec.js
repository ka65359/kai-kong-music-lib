import sampleReducer from "../index.js";
import { setSongs, clearSongs } from "store/actions";

describe("sample reducer tests", function() {
  let currentState;
  let store;
  let undefinedVal;

  beforeEach(function() {
    currentState = sampleReducer(undefinedVal, {});
    store = {
      getState: jest.fn(() => currentState),
      dispatch: jest.fn(
        (action) => (currentState = sampleReducer(currentState, action))
      )
    };
  });

  afterEach(function() {
    currentState = null;
    store = null;
  });

  describe("setSongs()", function() {
    let payload;

    afterEach(function() {
      payload = null;
      store.dispatch(clearSongs());
    });

    test("it handles no params", () => {
      store.dispatch(setSongs());
      expect(store.getState()).toHaveProperty("songs", []);
    });

    test("it can be set", () => {
      payload = ["foo", "bar"]; // TODO: real data
      store.dispatch(setSongs(payload));
      expect(store.getState()).toHaveProperty("songs", payload);
    });
  });

  describe("clearSongs()", function() {
    let payload;

    afterEach(function() {
      payload = null;
      store.dispatch(clearSongs());
    });

    test("it clears with no previous value", () => {
      store.dispatch(setSongs());
      store.dispatch(clearSongs());
      expect(store.getState()).toHaveProperty("songs", []);
    });

    test("it clears with a previous value", () => {
      payload = ["foo", "foo1"]; // TODO: real data
      store.dispatch(setSongs(payload));
      store.dispatch(clearSongs());
      expect(store.getState()).toHaveProperty("songs", []);
    });
  });
});
