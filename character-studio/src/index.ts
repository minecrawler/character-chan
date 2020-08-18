import 'regenerator-runtime'
import "./index.pug"
import "./main.scss"
import('./components/index');


import * as app from "./app/app";

// @ts-ignore
window.app = app;
