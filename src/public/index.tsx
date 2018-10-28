import * as React from "react";
import * as ReactDOM from 'react-dom';
import {Test} from "./components/test";
ReactDOM.render(<Test />, document.getElementById("index"));

import app, {TodoItem} from './vue';
console.log(app);
console.log(TodoItem);