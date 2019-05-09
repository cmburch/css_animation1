import React, { Component } from 'react'
import { RoomContext } from "../Context";

class FeaturedRooms extends Component {

static contextType = RoomContext;
  render() {
      const {name,greeting} = this.context;
    return (
      <div>
        Hello from feature rooms {name} {greeting}
      </div>
    )
  }
}

export default FeaturedRooms
