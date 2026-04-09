let jeu;

class Nourriture {
  constructor(x, y, taille, couleur) {
    this.x = x;
    this.y = y;
    this.taille = taille;
    this.couleur = couleur;
  }

  dessiner() {
    fill(this.couleur);
    noStroke();
    ellipse(this.x, this.y, this.taille * 2);
  }

  respawn() {
    this.x = random(width);
    this.y = random(height);
    this.taille = random(5, 15);
    this.couleur = color(random(255), random(255), random(255));
  }
}

class Blob {
  constructor(x, y, taille, offsetX = 0, offsetY = 0, destX = null, destY = null, animDuration = 0) {
    this.x = x;
    this.y = y;
    this.taille = taille;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.cibleX = x;
    this.cibleY = y;
    this.startX = x;
    this.startY = y;
    this.destX = destX === null ? x : destX;
    this.destY = destY === null ? y : destY;
    this.animDuration = animDuration;
    this.animStart = animDuration > 0 ? millis() : 0;
    this.formeGroupe = offsetX !== 0 || offsetY !== 0 || animDuration > 0;
  }

  mettreAJour() {
    if (this.animDuration > 0) {
      const t = constrain((millis() - this.animStart) / this.animDuration, 0, 1);
      const ease = this.easeOutBack(t);
      this.x = lerp(this.startX, this.destX, ease);
      this.y = lerp(this.startY, this.destY, ease);
      if (t >= 1) {
        this.animDuration = 0;
      }
    } else if (this.formeGroupe) {
      this.cibleX = lerp(this.cibleX, mouseX + this.offsetX, 0.1);
      this.cibleY = lerp(this.cibleY, mouseY + this.offsetY, 0.1);
      this.x = lerp(this.x, this.cibleX, 0.15);
      this.y = lerp(this.y, this.cibleY, 0.15);
    } else {
      this.cibleX = lerp(this.cibleX, mouseX, 0.1);
      this.cibleY = lerp(this.cibleY, mouseY, 0.1);
      this.x = lerp(this.x, this.cibleX, 0.05);
      this.y = lerp(this.y, this.cibleY, 0.05);
    }

    this.x = constrain(this.x, this.taille, width - this.taille);
    this.y = constrain(this.y, this.taille, height - this.taille);
  }

  easeOutBack(t) {
    return 1 + (t -= 1) * t * ((1.70158 + 1) * t + 1.70158);
  }

  dessiner() {
    fill(0, 150, 255);
    stroke(255);
    strokeWeight(2);
    push();
    translate(this.x, this.y);
    beginShape();
    const points = 14;
    for (let i = 0; i < points; i++) {
      const angle = map(i, 0, points, 0, TWO_PI);
      const noiseVal = noise(this.x * 0.01, this.y * 0.01, frameCount * 0.02 + angle);
      const r = this.taille + (noiseVal - 0.5) * 3;
      const vx = cos(angle) * r;
      const vy = sin(angle) * r;
      vertex(vx, vy);
    }
    endShape(CLOSE);
    pop();
  }

  manger(nourriture) {
    const distance = dist(this.x, this.y, nourriture.x, nourriture.y);
    if (distance < this.taille + nourriture.taille) {
      if (this.taille > nourriture.taille) {
        this.taille += nourriture.taille * 0.1;
        return true;
      } else {
        this.taille *= 0.5;
        return false;
      }
    }
    return false;
  }
}

class Jeu {
  constructor() {
    this.blobs = [];
    this.nourriture = [];
    this.estDivise = false;
    this.tempsDivision = 0;
    this.animationSplit = false;
    this.splitX = 0;
    this.splitY = 0;
    this.splitStart = 0;
    this.splitDuration = 400;
  }

  initialiser() {
    this.blobs = [new Blob(width / 2, height / 2, 20)];
    this.nourriture = Array.from({ length: 50 }, () => this.creerNourriture());
  }

  creerNourriture() {
    return new Nourriture(random(width), random(height), random(5, 15), color(random(255), random(255), random(255)));
  }

  update() {
    this.blobs.forEach(blob => blob.mettreAJour());
    if (this.estDivise && millis() - this.tempsDivision > 15000) {
      this.fusionner();
    }
    this.verifierCollisions();
  }

  draw() {
    background(100);
    this.dessinerGrille();
    this.blobs.forEach(blob => blob.dessiner());
    this.nourriture.forEach(food => food.dessiner());
    this.dessinerEffetSplit();
    fill(255);
    noStroke();
    text("Agar.io Clone - Déplacez la souris, Espace pour diviser", 10, 20);
  }

  verifierCollisions() {
    for (let food of this.nourriture) {
      for (let blob of this.blobs) {
        if (blob.manger(food)) {
          food.respawn();
          break;
        }
      }
    }
  }

  dessinerGrille() {
    stroke(200);
    strokeWeight(1);
    for (let x = 0; x < width; x += 50) {
      line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 50) {
      line(0, y, width, y);
    }
  }

  diviser() {
    if (this.estDivise || this.blobs.length > 1) return;
    const blob = this.blobs[0];
    const nombrePieces = max(2, min(8, floor(blob.taille / 10)));
    const nouvelleTaille = blob.taille / sqrt(nombrePieces);
    const nouveauxBlobs = [
      new Blob(blob.x, blob.y, nouvelleTaille, 0, 0, blob.x, blob.y, 250)
    ];
    const restants = nombrePieces - 1;
    const distance = nouvelleTaille * 2;
    const pasAngle = TWO_PI / max(1, restants);
    for (let i = 0; i < restants; i++) {
      const angle = i * pasAngle;
      const offsetX = cos(angle) * distance;
      const offsetY = sin(angle) * distance;
      nouveauxBlobs.push(new Blob(blob.x, blob.y, nouvelleTaille, offsetX, offsetY, blob.x + offsetX, blob.y + offsetY, 250));
    }
    this.blobs = nouveauxBlobs;
    this.estDivise = true;
    this.tempsDivision = millis();
    this.lancerAnimationSplit(blob.x, blob.y);
  }

  lancerAnimationSplit(x, y) {
    this.animationSplit = true;
    this.splitX = x;
    this.splitY = y;
    this.splitStart = millis();
  }

  dessinerEffetSplit() {
    if (!this.animationSplit) return;
    const t = constrain((millis() - this.splitStart) / this.splitDuration, 0, 1);
    const alpha = map(1 - t, 0, 1, 0, 180);
    const taille = lerp(0, 80, t);
    noFill();
    stroke(255, alpha);
    strokeWeight(3);
    ellipse(this.splitX, this.splitY, taille + 20);
    ellipse(this.splitX, this.splitY, taille + 40);
    if (t >= 1) {
      this.animationSplit = false;
    }
  }

  fusionner() {
    if (!this.estDivise || this.blobs.length <= 1) return;
    let totalX = 0;
    let totalY = 0;
    let totalTaille = 0;
    for (let blob of this.blobs) {
      totalX += blob.x * blob.taille;
      totalY += blob.y * blob.taille;
      totalTaille += blob.taille;
    }
    const moyenneX = totalX / totalTaille;
    const moyenneY = totalY / totalTaille;
    this.blobs = [new Blob(moyenneX, moyenneY, totalTaille)];
    this.estDivise = false;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  jeu = new Jeu();
  jeu.initialiser();
}

function draw() {
  jeu.update();
  jeu.draw();
}

function keyPressed() {
  if (key === ' ') {
    jeu.diviser();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
