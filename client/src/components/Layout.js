"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./Header"));
const Layout = () => {
    return (<react_1.Fragment>
      <Header_1.default />
      <react_router_dom_1.Outlet />
    </react_1.Fragment>);
};
exports.default = Layout;
