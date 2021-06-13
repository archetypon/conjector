import {loadInjector, loadMenu} from './services/DOMManipulator';
import css from '../css/main.css';

document.addEventListener("DOMContentLoaded", loadMenu());
document.addEventListener("DOMContentLoaded", loadInjector());