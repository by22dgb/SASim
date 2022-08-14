import { setupController } from "./controller/gameController.js";
import { bonusesView } from "./view/bonusesView.js";
import { itemsView } from "./view/itemsView.js";
import { simulationViews } from "./view/simulationView.js";

setupController();
itemsView();
bonusesView();
simulationViews();
