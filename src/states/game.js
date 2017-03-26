import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Traffic from '../objects/Traffic';

class Game extends Phaser.State {

  constructor() {
    super();

    let cursors,
        player,
        road,
        traffic,
        semiHonkLong;
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.sound.play('themesong');

    this.semiHonkLong = this.game.add.audio('semi_honk_long');
    this.semiHonkLong.volume = 0.85;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.createMap();
    this.createTraffic();
    this.player = new Player(this.game, this.road, 490, 300);
  }

  createMap() {
    this.game.stage.backgroundColor = '#005493';

    this.road = this.game.add.tileSprite(0, 0, 1920, 1080, 'road');
    this.road.scale.setTo(0.5, 0.5);
  }

  createTraffic() {
    this.traffic = this.game.add.group();

    this.traffic.add(new Enemy(this.game, 400, 200));

    this.game.time.events.repeat(Phaser.Timer.SECOND, Infinity, this.createCar, this);
  }

  update() {
    let cursors = this.cursors;
    this.player.updatePlayer(cursors);
    this.road.tilePosition.y += 11;

    this.game.physics.arcade.collide(this.player, this.traffic);
    this.game.physics.arcade.collide(this.traffic);

  }

  createCar () {
    let colors = [ "orng_car", "turq_car", "purple_car", "semi_truck" ];
    let coords = [ { x : 369, y : -200}, { x : 430, y : -200}, { x : 492, y: -200}, { x : 552, y : -200} ],
        randomColor = Math.floor(Math.random() * 4),
        randomCoord = Math.floor(Math.random() * 4),
        color = colors[randomColor],
        location = coords[randomCoord],
        enemy = new Enemy(this.game, location.x, location.y)
        // enemy = this.traffic.add(new Enemy(this.game, 400, 400)location.x, location.y, color);
        this.traffic.add(enemy);

    this.traffic.add(enemy);
    if (color === "semi_truck") {
      if (Math.floor(Math.random() * 4) === 0) {
        this.semiHonkLong.play();
      }
    }
  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
