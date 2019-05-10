import React, { Component } from 'react'
import items from "./data";

const RoomContext = React.createContext();
class RoomProvider extends Component {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,

    //for filiter
    type: "all",
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false
  };

  componentDidMount() {
    let rooms = this.formatData(items);
    let featuredRooms = rooms.filter(room => room.featured === true);

    let maxPrice = Math.max(...rooms.map(item => item.price));
    let maxSize = Math.max(...rooms.map(item => item.size));

    this.setState({
      rooms,
      featuredRooms,
      sortedRooms: rooms,
      loading: false,

      //
      price: maxPrice,
      maxPrice,
      maxSize
    });
  }
  formatData(items) {
    let tempItems = items.map(item => {
      let id = item.sys.id;
      //list of images
      let images = item.fields.images.map(image => image.fields.file.url);

      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  }

  getRoom = slug => {
    let tempRooms = [...this.state.rooms];
    const room = tempRooms.find(room => room.slug === slug);
    return room;
  };

  handleChange = event => {
    //method is used for filitering rooms
    const target = event.target;
    //value is what is selected
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    //console name = 'type'  value ='the selected value'
    console.log(name, value);

    this.setState(
      {
        [name]: value
      },
      this.filterRooms
    );
  };

  filterRooms = () => {
    let {
      rooms,
      type,
      capacity,
      price,
      minSize,
      maxSize,
      breakfast,
      pets
    } = this.state;

    //this is a copy of all the rooms
    let tempRooms = [...rooms];

    // transform values
    // get capacity||price and convert back to a number
    capacity = parseInt(capacity);
    price = parseInt(price);

    // filter by type
    //if type is not 'all' filter rooms
    //else show all the rooms available
    if (type !== "all") {
      tempRooms = tempRooms.filter(room => room.type === type);
    }

    // filter by capacity
    if (capacity !== 1) {
      tempRooms = tempRooms.filter(room => room.capacity >= capacity);
    }

    // filter by price
    tempRooms = tempRooms.filter(room => room.price <= price);

  //filter by size
  tempRooms = tempRooms.filter(
    room => room.size >= minSize && room.size <= maxSize
  );
    this.setState({
      sortedRooms: tempRooms
    });
  };


  render() {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    );
  }
}

const RoomConsumer = RoomContext.Consumer;

export { RoomProvider, RoomConsumer, RoomContext };

export function withRoomConsumer(Component) {
    return function ConsumerWrapper(props) {
      return (
        <RoomConsumer>
          {value => <Component {...props} context={value} />}
        </RoomConsumer>
      );
    };
  }