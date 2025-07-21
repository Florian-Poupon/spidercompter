import React from "react";
import mascot from "../assets/SpiderMascot.svg";

export default function SpiderMascot({ className = "" }) {
  return <img src="spidey.png" alt="Mascotte Spider-Man" className={className} draggable={false} />;
}
