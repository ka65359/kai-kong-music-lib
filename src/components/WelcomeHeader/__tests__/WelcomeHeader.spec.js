import React from "react";
import { shallow } from "enzyme";
import WelcomeHeader from "../WelcomeHeader";

describe("WelcomeHeader() tests", () => {
  it("should render correctly in mode", () => {
    const component = shallow(<WelcomeHeader />);

    expect(component).toMatchSnapshot();
  });
});
