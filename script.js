const generateButton = document.getElementById("generateButton");
const badgeCanvas = document.getElementById("badgeCanvas");
const downloadLink = document.getElementById("downloadLink");
const iconFileInput = document.getElementById("iconFile");
const ctx = badgeCanvas.getContext("2d");

generateButton.addEventListener("click", async () => {
  const dependencyName = document.getElementById("dependencyName").value;
  const outlineColor = document.getElementById("outlineColor").value;

  const width = 720;
  const height = 200;
  badgeCanvas.width = width;
  badgeCanvas.height = height;

  const iconFile = iconFileInput.files[0];

  let iconData = null;

  if (iconFile) {
    const reader = new FileReader();
    reader.readAsDataURL(iconFile);
    await new Promise((resolve) => (reader.onload = resolve));
    iconData = reader.result;
  } else {
    iconData = "https://cdn-icons-png.flaticon.com/512/25/25231.png";
  }

  try {
    function drawRoundedRectWithTransparentCorners(
      x,
      y,
      width,
      height,
      radius,
      outlineColor
    ) {
      const cornerRadius = radius;
      ctx.beginPath();
      ctx.moveTo(x + cornerRadius, y);
      ctx.lineTo(x + width - cornerRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
      ctx.lineTo(x + width, y + height - cornerRadius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - cornerRadius,
        y + height
      );
      ctx.lineTo(x + cornerRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
      ctx.lineTo(x, y + cornerRadius);
      ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = "#f2f2f2";
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 28;
      ctx.stroke();
    }

    ctx.clearRect(0, 0, width, height);

    drawRoundedRectWithTransparentCorners(
      0,
      0,
      width,
      height,
      25,
      outlineColor
    );

    const maxIconSize = 100;
    if (iconData) {
      const icon = new Image();
      icon.setAttribute("crossorigin", "anonymous");
      icon.src = iconData;
      await new Promise((resolve) => (icon.onload = resolve));

      const aspectRatio = icon.width / icon.height;
      let newWidth = icon.width;
      let newHeight = icon.height;
      if (newWidth > maxIconSize) {
        newWidth = maxIconSize;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight > maxIconSize) {
        newHeight = maxIconSize;
        newWidth = newHeight * aspectRatio;
      }
      const iconX = 40 + (maxIconSize - newWidth) / 2;
      const iconY = (height - newHeight) / 2;

      ctx.drawImage(icon, iconX, iconY, newWidth, newHeight);
    }

    ctx.fillStyle = "#333";
    ctx.font = "bold 56px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Requires", 180, height / 2 - 32);

    function calculateFontSize(text, maxWidth) {
      let fontSize = 56;
      ctx.font = `${fontSize}px sans-serif`;

      while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
        fontSize--;
        ctx.font = `${fontSize}px sans-serif`;
      }

      return fontSize;
    }

    const maxTextWidth = width - 180 - 30;
    const dynamicFontSize = calculateFontSize(dependencyName, maxTextWidth);

    ctx.font = `${dynamicFontSize}px sans-serif`;
    ctx.fillText(dependencyName, 180, height / 2 + 32);

    const dataURL = badgeCanvas.toDataURL("image/png");
    downloadLink.href = dataURL;
    downloadLink.style.display = "block";
  } catch (error) {
    console.error("Error:", error);
  }
});
