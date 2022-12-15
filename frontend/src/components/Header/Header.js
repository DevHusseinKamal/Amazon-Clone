import React from "react";
import Carousel from "react-bootstrap/Carousel";

import "./Header.css";

let incId = 0;
const imagesData = [
  { src: "/images/slider-img-1.jpg" },
  { src: "/images/slider-img-2.jpg" },
  { src: "/images/slider-img-3.jpg" },
  { src: "/images/slider-img-4.jpg" },
];

const Header = () => {
  const insertedCarouselItems = imagesData.map((item) => {
    incId++;
    return (
      <Carousel.Item key={incId}>
        <img className="d-block w-100" src={item.src} alt="" />
      </Carousel.Item>
    );
  });

  return (
    <Carousel indicators={false} className="header">
      {insertedCarouselItems}
    </Carousel>
  );
};

export default Header;
