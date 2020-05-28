import fetchMock from "fetch-mock";
import * as storeActions from "store/actions";
import { getAllSongs } from "../index.js";

describe("songs actions tests", function() {
  afterAll(function() {
    fetchMock.restore();
  });

  describe("getAllSongs()", () => {
    let dispatch;
    let payload;
    let setSongsSpy;
    let rslt;

    beforeEach(function() {
      setSongsSpy = jest.spyOn(storeActions, "setSongs");
      payload = {};
      dispatch = jest.fn();
    });

    afterEach(function() {
      dispatch.mockReset();
      dispatch = null;
      setSongsSpy.mockReset();
      setSongsSpy = null;
      payload = null;
      rslt = null;
      fetchMock.reset();
      fetchMock.restore();
    });

    test("it handles no params", (done) => {
      fetchMock.get("*", {});
      rslt = getAllSongs()(dispatch);
      expect(rslt).toBeInstanceOf(Promise);
      rslt
        .then(() => {
          let err = "We succeeded when we shouldn't have";
          expect(err).toBeFalsey();
        })
        .catch(() => {
          expect(dispatch).not.toHaveBeenCalled();
          done();
        });
    });

    test("it handles internal server errors", (done) => {
      fetchMock.mock("*", 500);
      rslt = getAllSongs(payload)(dispatch);
      expect(rslt).toBeInstanceOf(Promise);
      rslt
        .then(() => {
          let err = "We succeeded when we shouldn't have";
          expect(err).toBeFalsey();
        })
        .catch(() => {
          expect(dispatch).not.toHaveBeenCalled();
          done();
        });
    });

    test("it calls dispatch on success with results", (done) => {
      fetchMock.get("*", {
        ok: true,
        status: 200,
        hits: [1, 2, 3]
      });
      rslt = getAllSongs(payload)(dispatch);
      expect(rslt).toBeInstanceOf(Promise);
      rslt
        .then(() => {
          expect(setSongsSpy).toHaveBeenCalled();
          done();
        })
        .catch((err) => {
          expect("Error: " + err).toBeFalsey();
        });
    });
  });
});
