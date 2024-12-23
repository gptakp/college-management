import { Layout } from "antd";
import React, { useState, useEffect } from "react";
const { Header, Footer, Content } = Layout
const CarouselComponent = () => {
  const [images, setImages] = useState([
    {
      url: "https://www.gvpcdpgc.edu.in/latest_images/gvp_cricket_team_2023.jpeg",
      borderRadius: "20px 20px 10% 10%",
    },
    {
      url: "https://www.gvpcdpgc.edu.in/latest_images/field_visit_2.jpg",
      borderRadius: "20px 20px 10% 10%",
    },
    {
      url: "https://www.gvpcdpgc.edu.in/latest_images/indstryvisit_cse1.jpeg",
      borderRadius: "20px 20px 10% 10%",
    },
    {
      url: "https://www.gvpcdpgc.edu.in/latest_images/placement_anirudh.jpeg",
      borderRadius: "20px 20px 10% 10%",
    },
    {
      url: "https://www.gvpcdpgc.edu.in/latest_images/technirvana_ece.JPG",
      borderRadius: "20px 20px 10% 10%",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    const intervalId = setInterval(handleNext, 3000);
    return () => clearInterval(intervalId);
  }, [activeIndex]);

  return (
    <div>
        <div >
      {/* Navigation Bar */}
      <nav style={{ height: "50px", 
      backgroundColor: "#757479",
       color: "white",
        display: "flex", 
        justifyContent: "space-between",
         alignItems: "center", 
         padding: "0 0px",
          position: "relative" , 
          borderBottomLeftRadius:"20px", 
          borderBottomRightRadius:"20px",
          marginBottom:"30px",
          marginTop:"-40px"
          }}>
        <ul className="nav align-items-center justify-content-center" style={{ listStyle: "none", display: "flex", gap: "20px" }}>
          <li className="nav-item me-3" data-bs-toggle="tooltip" data-bs-animation="false" data-bs-placement="bottom" data-bs-original-title="Sunday CLOSED">
            <span><i className="far fa-clock me-2"></i>Visit time: Mon-Sat 9:00 AM - 05:00 PM</span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" style={{color:"white", marginLeft:"400px"}}><i className="fas fa-headset me-2"></i>Call us now: 8367777635</a>
          </li>
        </ul>
        <div style={{ display: "flex", gap: "20px" }}>
          <li className="nav-item">
            <a className="nav-link" href="mailto:gvprushikonda@gmail.com" style={{color:"white"}}>
              <i className="fas fa-envelope me-2"></i>Mail: gvprushikonda@gmail.com
            </a>
          </li>
          {/* Top social */}
          <ul className="list-unstyled d-flex mb-0" style={{ listStyle: "none", display: "flex", gap: "10px" }}>
            <li> <a className="px-2 nav-link" href=""><i className="fab fa-facebook"></i></a> </li>
            <li> <a className="px-2 nav-link" href=""><i className="fab fa-youtube"></i></a> </li>
            <li> <a className="px-2 nav-link" href=""><i className="fab fa-twitter"></i></a> </li>
            <li> <a className="ps-2 nav-link" href=""><i className="fab fa-linkedin-in"></i></a> </li>
          </ul>
        </div>
      </nav>

      {/* Carousel */}
       <div style={{ position: "relative", maxWidth: "1800px", margin: "auto" }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              display: index === activeIndex ? "block" : "none",
              position: "absolute",
              width: "100%",
              height: "900px",
              animation: "fadeAnimation 1s ease-in-out",
            }}
          >
            <img
              src={image.url}
              alt={`Image ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: image.borderRadius,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "2em",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handlePrev}
            >
              &lsaquo; Prev
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "2em",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleNext}
            >
              Next &rsaquo;
            </div>
          </div>
        ))}
        <style>
          {`
            @keyframes fadeAnimation {
              from { opacity: 0.4; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div> 
    </div>
    </div>    
    
  );
};

export default CarouselComponent;
