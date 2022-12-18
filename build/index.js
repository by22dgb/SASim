/*
Entry point for the application, any code that needs to be executed on startup should be called from here.
This file should not contain any logic, only calls to other files.
This file should not interact with the data layer.
*/
import { setupController } from "./controller/gameController.js";
import { bonusesView } from "./view/bonusesView.js";
import { extrasView } from "./view/extrasView.js";
import { itemsView } from "./view/itemsView.js";
import { levelsView } from "./view/levelsView.js";
import { simulationViews } from "./view/simulationView.js";
setupController();
itemsView();
bonusesView();
simulationViews();
levelsView();
extrasView();
