import React, { Component } from 'react';
import { View } from 'react-native';
import Menu from './MenuComponent';
import { DISHES } from '../shared/dishes';
import Dishdetail from './DishDetailComponent';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES,
      selectedDish: null
    };
  }

  onDishDelect(dishId) {
    this.setState({ selectedDish: dishId });
  }

  render() {
    return (
      <View>
        <Menu
          dishes={this.state.dishes}
          onPress={dishId => this.onDishDelect(dishId)}
        />
        <Dishdetail
          dish={
            this.state.dishes.filter(
              dish => dish.id === this.state.selectedDish
            )[0]
          }
        />
      </View>
    );
  }
}

export default Main;
