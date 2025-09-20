import mascot from "../assets/SpiderMascot.svg";

export default function SpiderMascot({ className = "", title = "La mascotte Spider" }) {
  return (
    <img
      src={mascot}
      alt="Mascotte Spider-Man célébrant la progression"
      title={title}
      className={`select-none ${className}`.trim()}
      draggable={false}
    />
  );
}
