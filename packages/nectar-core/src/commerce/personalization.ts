/**
 * Reusable Personalization Preview Engine V2.
 * Renders templates dynamically using proportion scaling relative to canvas bounds.
 */

export const drawPersonalizedTemplate = (
  canvas: HTMLCanvasElement,
  template: any,
  playerName: string,
  playerNumber: string,
  drawSafeArea: boolean = false
): { inSafeArea: boolean } => {
  const ctx = canvas.getContext('2d');
  if (!ctx || !template) return { inSafeArea: true };

  const targetWidth = canvas.width;
  const targetHeight = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, targetWidth, targetHeight);

  // Calculate scaling factor
  const refWidth = template.canvasWidth || 600;
  const refHeight = template.canvasHeight || 600;
  const scaleX = targetWidth / refWidth;
  const scaleY = targetHeight / refHeight;

  const safe = template.safeArea || { x: 0, y: 0, width: refWidth, height: refHeight };

  // Helper to check if a rect is inside safe area
  const isRectInSafe = (rx: number, ry: number, rw: number, rh: number) => {
    return (
      rx >= safe.x &&
      ry >= safe.y &&
      rx + rw <= safe.x + safe.width &&
      ry + rh <= safe.y + safe.height
    );
  };

  const nameSet = template.nameSettings || {};
  const numSet = template.numberSettings || {};
  let inSafeArea = true;

  // Determine safety checks
  if (playerName && nameSet.x !== undefined) {
    const isNameSafe = isRectInSafe(
      nameSet.x - nameSet.width / 2,
      nameSet.y - nameSet.height / 2,
      nameSet.width,
      nameSet.height
    );
    if (!isNameSafe) inSafeArea = false;
  }

  if (playerNumber && numSet.x !== undefined) {
    const isNumSafe = isRectInSafe(
      numSet.x - numSet.width / 2,
      numSet.y - numSet.height / 2,
      numSet.width,
      numSet.height
    );
    if (!isNumSafe) inSafeArea = false;
  }

  // Draw background image
  if (template.renderImageUrl) {
    const imgKey = `img_${template.renderImageUrl}`;
    let img: HTMLImageElement | undefined = (globalThis as any)[imgKey];
    if (!img) {
      img = new Image();
      img.crossOrigin = "anonymous";
      img.src = template.renderImageUrl;
      (globalThis as any)[imgKey] = img;
      img.onload = () => {
        // Redraw canvas on image load
        drawPersonalizedTemplate(canvas, template, playerName, playerNumber, drawSafeArea);
      };
    }

    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    } else {
      // Shading fallback during image load
      ctx.fillStyle = "#121212";
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
  } else {
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Helper to draw text block
  const drawTextBlock = (text: string, settings: any) => {
    if (!text || settings.x === undefined) return;

    ctx.save();

    // Scale coordinates
    const cx = settings.x * scaleX;
    const cy = settings.y * scaleY;
    const rot = (settings.rotation || 0) * Math.PI / 180;
    const op = settings.opacity !== undefined ? settings.opacity : 1;

    ctx.globalAlpha = op;
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Font settings
    const fontSize = (settings.fontSize || 40) * scaleX;
    const fFamily = settings.fontFamily || "Impact";
    const fWeight = settings.fontWeight || "900";
    ctx.font = `${fWeight} ${fontSize}px ${fFamily}, sans-serif`;
    ctx.textAlign = (settings.alignment || "center") as CanvasTextAlign;
    ctx.textBaseline = "middle";

    const textCol = settings.color || "#ffffff";
    ctx.fillStyle = textCol;

    // Apply shadow if enabled
    if (settings.enableShadow) {
      ctx.shadowColor = settings.shadowColor || "rgba(0,0,0,0.5)";
      ctx.shadowBlur = (settings.shadowBlur || 4) * scaleX;
      ctx.shadowOffsetX = (settings.shadowOffsetX || 2) * scaleX;
      ctx.shadowOffsetY = (settings.shadowOffsetY || 2) * scaleX;
    }

    // Text transformations
    let textToDraw = text;
    if (settings.textTransform === "uppercase") {
      textToDraw = text.toUpperCase();
    }

    // Draw text outline if enabled
    if (settings.enableOutline) {
      ctx.strokeStyle = settings.outlineColor || "#000000";
      ctx.lineWidth = (settings.outlineWidth || 4) * scaleX;
      ctx.strokeText(textToDraw, 0, 0);
    }

    // Draw fill text
    ctx.fillText(textToDraw, 0, 0);

    ctx.restore();
  };

  // Draw Number
  if (playerNumber && numSet.x !== undefined) {
    drawTextBlock(playerNumber, numSet);
  }

  // Draw Player Name
  if (playerName && nameSet.x !== undefined) {
    drawTextBlock(playerName, nameSet);
  }

  // Draw Safe Area border in editor mode
  if (drawSafeArea) {
    ctx.save();
    ctx.strokeStyle = inSafeArea ? "rgba(34, 197, 94, 0.6)" : "rgba(239, 68, 68, 0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(
      safe.x * scaleX,
      safe.y * scaleY,
      safe.width * scaleX,
      safe.height * scaleY
    );

    // Draw text bounding indicators
    const drawBounds = (settings: any) => {
      if (settings.x === undefined) return;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(
        (settings.x - settings.width / 2) * scaleX,
        (settings.y - settings.height / 2) * scaleY,
        settings.width * scaleX,
        settings.height * scaleY
      );
    };
    drawBounds(nameSet);
    drawBounds(numSet);

    ctx.restore();
  }

  return { inSafeArea };
};
