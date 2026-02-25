import { ShootingStars } from "./shooting-stars";

export function ShootingStarsDemo() {
  return (
    <div className="shooting-stars-demo">
      <div className="shooting-stars-demo__bg" aria-hidden="true">
        <div className="shooting-stars-demo__glow" />
        <div className="shooting-stars-demo__stars" />
      </div>
      <div className="shooting-stars-demo__content">
        <h2>Shooting Stars Effect</h2>
        <p>
          A customizable shooting-stars background that can be layered into hero
          sections and visual panels.
        </p>
      </div>
      <ShootingStars starColor="#9E00FF" trailColor="#2EB9DF" minSpeed={15} maxSpeed={35} minDelay={1000} maxDelay={3000} />
      <ShootingStars starColor="#FF0099" trailColor="#FFB800" minSpeed={10} maxSpeed={25} minDelay={2000} maxDelay={4000} />
      <ShootingStars starColor="#00FF9E" trailColor="#00B8FF" minSpeed={20} maxSpeed={40} minDelay={1500} maxDelay={3500} />
    </div>
  );
}
