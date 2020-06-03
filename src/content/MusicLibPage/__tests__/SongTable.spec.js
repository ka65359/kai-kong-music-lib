import React from "react";
import { shallow } from "enzyme";
import SongTable from "../SongTable";

describe("SongTable() tests", () => {
  it("should render correctly in mode", () => {
    const component = shallow(<SongTable />);

    expect(component).toMatchSnapshot();
  });
});
