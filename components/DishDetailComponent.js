import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  PanResponder
} from 'react-native';
import { Card, Icon, Rating, Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish({ dish, favorite, onPress, onAddComment }) {
  handleViewRef = ref => (this.view = ref);

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) return true;
    else return false;
  };

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if (dx > 200) return true;
    else return false;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderGrant: () => {
      this.view
        .rubberBand(1000)
        .then(endState =>
          console.log(endState.finished ? 'finished' : 'cancelled')
        );
    },
    onPanResponderEnd: (e, gestureState) => {
      if (recognizeDrag(gestureState))
        Alert.alert(
          'Add to Favorites?',
          'Are you sure you wish to add ' + dish.name + ' to your favorites?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel pressed'),
              style: 'cancel'
            },
            {
              text: 'Okay',
              onPress: () => (favorite ? 'already done' : onPress())
            }
          ],
          { cancellable: false }
        );
      else if (recognizeComment(gestureState)) onAddComment();
      return true;
    }
  });

  if (dish != null) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={this.handleViewRef}
        {...panResponder.panHandlers}
      >
        <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row'
            }}
          >
            <Icon
              raised
              reverse
              name={favorite ? 'heart' : 'heart-o'}
              type="font-awesome"
              color="#f50"
              onPress={() => (favorite ? 'already done' : onPress())}
            />
            <Icon
              raised
              reverse
              name="pencil"
              type="font-awesome"
              color="#512DA8"
              onPress={() => onAddComment()}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View />;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}></Text>
        <Rating
          readonly
          startingValue={item.rating}
          imageSize={12}
          style={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            margin: 5
          }}
        />
        <Text style={{ fontSize: 12 }}>
          {'-- ' + item.author + ', ' + item.date}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 0,
      author: '',
      comment: ''
    };
  }

  markFavorite = dishId => {
    this.props.postFavorite(dishId);
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  resetState = () => {
    this.setState({
      showModal: false,
      rating: 0,
      author: '',
      comment: ''
    });
  };

  handleComment = dishId => {
    console.log('Rating: ' + this.state.rating);
    console.log('Author: ' + this.state.author);
    console.log('Comment: ' + this.state.comment);
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );

    this.resetState();
  };

  static navigationOptions = {
    title: 'Dish Details'
  };

  render() {
    const dishId = this.props.navigation.getParam('dishId', '');
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el == dishId)}
          onPress={() => this.markFavorite(dishId)}
          onAddComment={() => this.openModal()}
        />
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.closeModal();
          }}
          onRequestClose={() => {
            this.closeModal();
          }}
        >
          <ScrollView>
            <View
              style={{
                paddingTop: 50,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Rating
                showRating
                onFinishRating={value => {
                  this.setState({ rating: value });
                }}
                startingValue={this.state.rating}
                ratingTextColor="#F1C40F"
              />
            </View>
            <View>
              <Input
                placeholder="Author"
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={text => this.setState({ author: text })}
              />
            </View>
            <View>
              <Input
                placeholder="Comment"
                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                onChangeText={text => this.setState({ comment: text })}
              />
            </View>
            <View>
              <Button
                title="Submit"
                buttonStyle={{ backgroundColor: '#512DA8', margin: 20 }}
                onPress={() => this.handleComment(dishId)}
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
            <View>
              <Button
                title="Cancel"
                buttonStyle={{ backgroundColor: '#777', margin: 20 }}
                onPress={() => this.closeModal()}
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
          </ScrollView>
        </Modal>
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId == dishId
          )}
        />
      </ScrollView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dishdetail);
