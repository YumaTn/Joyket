import { createDrawerNavigator } from "@react-navigation/drawer";
import SCREENS from ".";
import BestSeller from "../Category/BestSeller";
import Lastest from "../Category/Lastest";
import Navigation from "./Navigation";

const Drawer = createDrawerNavigator();
const Category = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#c6cbef',
            width: 240,
          },
        }}
      >
        <Drawer.Screen
          name={SCREENS.NAVIGATION}
          component={Navigation}
           />
        <Drawer.Screen
          name={SCREENS.BESTSELLER}
          component={BestSeller}
           />
        
        <Drawer.Screen
          name={SCREENS.LASTEST}
          component={Lastest}
        />
      </Drawer.Navigator>
    );
  };
  
  export default Category;