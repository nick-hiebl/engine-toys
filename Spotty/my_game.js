function draw() {

    // Fill in background with a 5% opaque white colour.
    fill(255, 0.05);
    bg();

    // Only activate 20% of the time.
    if (random(1) < 0.20) {

        // Choose a random position and radius.
        x = random(width);
        y = random(height);
        r = random(20, 100);

        // Choose a random colour.
        fill(random(255), random(255), random(255));

        // Draw ellipse onto screen.
        ellipse(x, y, r, r);
    }
}
