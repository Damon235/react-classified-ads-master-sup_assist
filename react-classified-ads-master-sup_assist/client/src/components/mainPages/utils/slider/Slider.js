import React, { useEffect, useState } from "react";

export default function ImageSlider({ SliderData }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const lastIndex = SliderData.length - 1;

    if (!isPaused) {
      const slideInterval = setInterval(() => {
        setCurrent((prevCurrent) =>
          prevCurrent === lastIndex ? 0 : prevCurrent + 1
        );
      }, 5000); // Change this value to set the interval (in milliseconds)

      return () => {
        clearInterval(slideInterval);
      };
    }
  }, [current, isPaused, SliderData]);

  const handlePrevious = () => {
    setIsPaused(true);
    setCurrent((prevCurrent) =>
      prevCurrent === 0 ? SliderData.length - 1 : prevCurrent - 1
    );
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrent((prevCurrent) =>
      prevCurrent === SliderData.length - 1 ? 0 : prevCurrent + 1
    );
  };

  const handlePauseResume = () => {
    setIsPaused((prevState) => !prevState);
  };

  useEffect(() => {
    let resumeInterval;

    if (isPaused) {
      resumeInterval = setInterval(() => {
        setIsPaused(false);
      }, 3000); // Resume interval after 3 seconds (adjust as needed)
    }

    return () => {
      clearInterval(resumeInterval);
    };
  }, [isPaused]);

  return (
    <div className="slider-body">
      {SliderData.map((slider, sliderIndex) => {
        const { image, id } = slider;
        let position = "nextSlide";
        if (sliderIndex === current) {
          position = "activeSlide";
        }
        if (
          sliderIndex === current - 1 ||
          (current === 0 && sliderIndex === SliderData.length - 1)
        ) {
          position = "lastSlide";
        }
        return (
          <div id="slider" className={`${position} slider`} key={id}>
            <img src={image} alt="slider image" />
          </div>
        );
      })}
      <div className="left" onClick={handlePrevious}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        </svg>
      </div>
      <div className="right" onClick={handleNext}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
        </svg>
      </div>
      <div className="pause" onClick={handlePauseResume}>
        {isPaused ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h10v16h-10zm12 0h10v16h-10z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M6 4l15 8-15 8z" />
          </svg>
        )}
      </div>
    </div>
  );
}
