import React from "react";

function ShimmerEffect() {
  const shimmerEffect = {
    background: "#ddd",
    height: "130px",
  };
  const shimmerContent = {
    borderRadius: "3px",
    background: "gray",
    height: "20px",
    margin: "5px",
    animation: "shimmer 1s Infinite linear",
  };
  const emptyArray = Array.from({ length: 10 });
  return (
    <div className="notes">
      {emptyArray.map((elem, index) => {
        return (
          <div
            key={index}
            className="note shimmerEffect"
            style={shimmerEffect} >
            <div className="" style={shimmerContent}></div>
            <div className="" style={shimmerContent}></div>
            <div style={{ ...shimmerContent, width: "60%" }}></div>
          </div>
        );
      })}
    </div>
  );
}

export default ShimmerEffect;
