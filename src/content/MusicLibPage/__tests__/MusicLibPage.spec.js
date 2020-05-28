import React from "react";
import { shallow } from "enzyme";
import MusicLibPage from "../MusicLibPage";

describe("MusicLibPage() tests", () => {
  it("should render correctly in mode", () => {
    const component = shallow(<MusicLibPage />);

    expect(component).toMatchSnapshot();
  });
});
