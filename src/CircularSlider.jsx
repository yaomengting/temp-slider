import React, { useState, useRef, useEffect } from 'react';
import './CircularSlider.css';

const CircularSlider = () => {
  const [desiredTemp, setDesiredTemp] = useState(73.1);
  const currentTemp = 76.0;
  const [angle, setAngle] = useState(-90);
  const svgRef = useRef(null);
  const draggingRef = useRef(false);

  const handleMouseMove = (e) => {
    if (!draggingRef.current || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const newAngle = Math.atan2(y, x) * (180 / Math.PI);
    
    if (newAngle >= -90 && newAngle <= 90) {
      setAngle(newAngle);
      const newTemp = 60 + ((newAngle + 90) / 180) * (85 - 60);
      setDesiredTemp(newTemp);
    }
  };

  const handleMouseDown = () => {
    draggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
  }

  const radius = 90;
  const startAngle = -90;
  const endAngle = angle;

  return (
    <div className="circular-slider-container">
    
      <svg
        ref={svgRef}
        width="200"
        height="100"
        viewBox="0 0 200 100"
        onMouseDown={handleMouseDown}
      >
        <path d={describeArc(100, 100, radius, -90, 90)} stroke="white" strokeWidth="10" fill="none" />
        <path d={describeArc(100, 100, radius, -90, angle)} stroke="blue" strokeWidth="10" fill="none" />
        <circle
          cx={polarToCartesian(100, 100, radius, angle).x}
          cy={polarToCartesian(100, 100, radius, angle).y}
          r="10"
          fill="blue"
        />
      </svg>
      <div className="temperature-display">
        <div className="desired-temp">{desiredTemp.toFixed(1)}°F</div>
        <div className="current-temp">{currentTemp.toFixed(1)}</div>
        <div className="label">Fan - Home</div>
      </div>
    </div>
  );
};

export default CircularSlider;



