import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "black",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}
        onClick={() => {
          navigate("/home");
        }}
      >
        College Management system

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "5px",
            backgroundColor: "white",
            animation: "waveAnimation 2s infinite"
          }}
        ></div>
      </div>
      <style>
        {`
          @keyframes waveAnimation {
            0% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(2);
            }
            100% {
              transform: scaleY(1);
            }
          }
        `}
      </style>
    </>
  );
}
