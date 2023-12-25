"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const NotFound_1 = __importDefault(require("./pages/NotFound"));
const Home_1 = __importDefault(require("./pages/Home"));
const SignIn_1 = __importDefault(require("./pages/SignIn"));
const SignUp_1 = __importDefault(require("./pages/SignUp"));
const About_1 = __importDefault(require("./pages/About"));
const Profile_1 = __importDefault(require("./pages/Profile"));
const Layout_1 = __importDefault(require("./components/Layout"));
const App = () => {
    return (<react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="*" element={<NotFound_1.default />}/>
        <react_router_dom_1.Route path="/" element={<Layout_1.default />}>
          <react_router_dom_1.Route path="" index element={<Home_1.default />}/>
          <react_router_dom_1.Route path="sign-in" element={<SignIn_1.default />}/>
          <react_router_dom_1.Route path="sign-up" element={<SignUp_1.default />}/>
          <react_router_dom_1.Route path="about" element={<About_1.default />}/>
          <react_router_dom_1.Route path="profile" element={<Profile_1.default />}/>
        </react_router_dom_1.Route>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
};
exports.default = App;
