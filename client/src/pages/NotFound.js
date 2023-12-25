"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const NotFound = () => {
    const navigate = (0, react_router_dom_1.useNavigate)(); // Create a navigate
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            navigate("/");
        }, 3000);
    }, [navigate]);
    return (<div>
      This page NotFound
      <br />
      Redirect to home page after 3 second
    </div>);
};
exports.default = NotFound;
