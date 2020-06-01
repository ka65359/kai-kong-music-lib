import React from "react";
import { shallow } from "enzyme";
import AddSong from "../AddSong";

describe("AddSong() tests", () => {
  it("should render correctly in mode", () => {
    const component = shallow(<AddSong />);

    expect(component).toMatchSnapshot();
  });
});
