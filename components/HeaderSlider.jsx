import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import CloudinaryImage from "./CloudinaryImage";
import Link from "next/link";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Discover the Magnificent Abronia Graminea - Nature's Green Jewel!",
      offer: "Featured Species Spotlight",
      buttonText1: "Learn More",
      buttonText2: "View Gallery",
      imgSrc: assets.header_abronia_graminea_image,
      slug: "blog/abronia-graminea"
    },
    {
      id: 2,
      title: "Rare Abronia Lythrochila - The Red-Lipped Mountain Beauty!",
      offer: "Conservation Priority Species",
      buttonText1: "Explore Now",
      buttonText2: "Care Guide",
      imgSrc: assets.header_abronia_lythrochila_image,
      slug: "blog/abronia-lythrochila"
    },
    {
      id: 3,
      title: "Meet Abronia Oaxacae - The Mysterious Cloud Forest Dweller!",
      offer: "Endangered Species Awareness",
      buttonText1: "Discover More",
      buttonText2: "Conservation Info",
      imgSrc: assets.header_abronia_oaxacae_image,
      slug: "blog/abronia-oaxacae"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000); // Slower transition for educational content
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E8F5E8] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-green-600 pb-1 font-medium">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">

                <div className="flex items-center mt-4 md:mt-6 ">
                  <Link href={`/${slide.slug}`}>
                    <button className="md:px-10 px-7 md:py-2.5 py-2 bg-green-600 rounded-full text-white font-medium hover:bg-green-700 transition">
                      {slide.buttonText1}
                    </button>
                  </Link>
                  <Link href={`/${slide.slug}`}>
                    <button className="group flex items-center gap-2 px-6 py-2.5 font-medium hover:text-green-600 transition">
                      {slide.buttonText2}
                      <CloudinaryImage className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <CloudinaryImage
                className="md:w-72 w-48 rounded-lg shadow-lg"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-green-600' : 'bg-gray-300'}`}
            onClick={() => handleSlideChange(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;