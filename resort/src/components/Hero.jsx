import React from 'react'

const Hero = ({ children, hero }) => {
  return (
    <header className={hero}>{children}</header>
  )
}

export default Hero

// this is the default css class named defaultHero
Hero.defaultProps = {
    hero: "defaultHero"
  };
