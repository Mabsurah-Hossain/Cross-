import { Avatar, Car, Lane, Particle } from './types';
import { isPavement } from './rules';

export const CELL_SIZE = 54; // Grid cell size in pixels
export const GRID_COLS = 11; // 11 horizontal columns (-5 to +5 from center)
export const ROAD_WIDTH = CELL_SIZE * GRID_COLS;

// Cache building layouts per row for consistent visuals
const buildingCache: Record<number, { leftColor: string; rightColor: string; leftFloors: number; rightFloors: number; awning: string }> = {};

function getBuildingData(row: number) {
  if (!buildingCache[row]) {
    const colors = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6', '#38BDF8', '#FB923C'];
    const awnings = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const seed = Math.abs(Math.sin(row * 9301 + 49297));
    const seed2 = Math.abs(Math.cos(row * 49297 + 9301));
    buildingCache[row] = {
      leftColor: colors[Math.floor(seed * colors.length) % colors.length],
      rightColor: colors[Math.floor(seed2 * colors.length) % colors.length],
      leftFloors: 1 + Math.floor(seed * 3),
      rightFloors: 1 + Math.floor(seed2 * 3),
      awning: awnings[Math.floor((seed + seed2) * awnings.length) % awnings.length],
    };
  }
  return buildingCache[row];
}

/**
 * Draw background, roads, pavements, buildings and lane markings
 */
export function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  cameraY: number,
  viewWidth: number,
  viewHeight: number,
  lanes: Map<number, Lane>
) {
  const roadLeft = (viewWidth - ROAD_WIDTH) / 2;
  const roadRight = roadLeft + ROAD_WIDTH;

  // Determine visible row range based on camera
  const minVisibleY = cameraY - 100;
  const maxVisibleY = cameraY + viewHeight + 100;

  const startRow = Math.floor(minVisibleY / CELL_SIZE) - 1;
  const endRow = Math.ceil(maxVisibleY / CELL_SIZE) + 1;

  for (let r = startRow; r <= endRow; r++) {
    const rowY = viewHeight - (r * CELL_SIZE - cameraY);
    const lane = lanes.get(r);
    const isPave = isPavement(r);

    // 1. Draw Sidewalk Buildings (Left and Right of the road)
    const bData = getBuildingData(r);

    // Left side buildings & scenery
    ctx.fillStyle = '#1E293B'; // deep sidewalk base
    ctx.fillRect(0, rowY - CELL_SIZE, roadLeft, CELL_SIZE);
    ctx.fillStyle = '#334155';
    ctx.fillRect(roadLeft - 16, rowY - CELL_SIZE, 16, CELL_SIZE); // curb

    // Building structure Left
    const bLeftWidth = Math.max(0, roadLeft - 24);
    if (bLeftWidth > 20) {
      ctx.fillStyle = bData.leftColor;
      ctx.fillRect(0, rowY - CELL_SIZE + 2, bLeftWidth, CELL_SIZE - 4);
      // Roof trim
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, rowY - CELL_SIZE + 2, bLeftWidth, 5);
      // Windows
      ctx.fillStyle = '#FEF08A'; // Warm glowing window
      const winW = 12;
      const winH = 14;
      for (let wx = 12; wx < bLeftWidth - 20; wx += 24) {
        ctx.fillRect(wx, rowY - CELL_SIZE + 12, winW, winH);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(wx + 5, rowY - CELL_SIZE + 12, 2, winH); // window pane
        ctx.fillRect(wx, rowY - CELL_SIZE + 18, winW, 2);
        ctx.fillStyle = '#FEF08A';
      }
      // Awning
      ctx.fillStyle = bData.awning;
      ctx.fillRect(bLeftWidth - 14, rowY - CELL_SIZE + 6, 14, CELL_SIZE - 12);
    }

    // Right side buildings & scenery
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(roadRight, rowY - CELL_SIZE, viewWidth - roadRight, CELL_SIZE);
    ctx.fillStyle = '#334155';
    ctx.fillRect(roadRight, rowY - CELL_SIZE, 16, CELL_SIZE); // curb

    // Building structure Right
    const bRightX = roadRight + 24;
    const bRightWidth = viewWidth - bRightX;
    if (bRightWidth > 20) {
      ctx.fillStyle = bData.rightColor;
      ctx.fillRect(bRightX, rowY - CELL_SIZE + 2, bRightWidth, CELL_SIZE - 4);
      // Roof trim
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(bRightX, rowY - CELL_SIZE + 2, bRightWidth, 5);
      // Windows
      ctx.fillStyle = '#FEF08A';
      const winW = 12;
      const winH = 14;
      for (let wx = bRightX + 16; wx < viewWidth - 20; wx += 24) {
        ctx.fillRect(wx, rowY - CELL_SIZE + 12, winW, winH);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(wx + 5, rowY - CELL_SIZE + 12, 2, winH);
        ctx.fillRect(wx, rowY - CELL_SIZE + 18, winW, 2);
        ctx.fillStyle = '#FEF08A';
      }
      // Awning
      ctx.fillStyle = bData.awning;
      ctx.fillRect(bRightX, rowY - CELL_SIZE + 6, 14, CELL_SIZE - 12);
    }

    // 2. Main Road or Pavement
    if (isPave) {
      // Pavement: checkered tiles / park green pattern
      ctx.fillStyle = '#CBD5E1'; // Concrete light grey
      ctx.fillRect(roadLeft, rowY - CELL_SIZE, ROAD_WIDTH, CELL_SIZE);

      // Sidewalk tile grid lines
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.strokeRect(roadLeft, rowY - CELL_SIZE, ROAD_WIDTH, CELL_SIZE);

      // Tile joints
      for (let c = 0; c < GRID_COLS; c++) {
        const tileX = roadLeft + c * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(tileX, rowY - CELL_SIZE);
        ctx.lineTo(tileX, rowY);
        ctx.stroke();

        // Alternating subtle sidewalk texture
        if ((c + r) % 2 === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          ctx.fillRect(tileX + 2, rowY - CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
      }

      // Yellow safety curb edge
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(roadLeft, rowY - CELL_SIZE, ROAD_WIDTH, 4);
      ctx.fillRect(roadLeft, rowY - 4, ROAD_WIDTH, 4);

      // Safe Zone Marker text badge on center of pavement
      if (r > 0) {
        ctx.fillStyle = '#059669'; // Green safe badge
        const badgeW = 140;
        const badgeX = roadLeft + (ROAD_WIDTH - badgeW) / 2;
        ctx.beginPath();
        ctx.roundRect(badgeX, rowY - CELL_SIZE + 14, badgeW, CELL_SIZE - 28, 8);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`★ SAFE PAVEMENT ★`, roadLeft + ROAD_WIDTH / 2, rowY - CELL_SIZE / 2);
      } else {
        // Start line
        ctx.fillStyle = '#2563EB';
        const badgeW = 130;
        const badgeX = roadLeft + (ROAD_WIDTH - badgeW) / 2;
        ctx.beginPath();
        ctx.roundRect(badgeX, rowY - CELL_SIZE + 14, badgeW, CELL_SIZE - 28, 8);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`START LINE`, roadLeft + ROAD_WIDTH / 2, rowY - CELL_SIZE / 2);
      }

      // Decorative items on sides of pavement
      drawPavementDecorations(ctx, roadLeft, rowY - CELL_SIZE, r);
    } else {
      // Asphalt Road
      ctx.fillStyle = '#1E293B'; // Dark asphalt
      ctx.fillRect(roadLeft, rowY - CELL_SIZE, ROAD_WIDTH, CELL_SIZE);

      // Subtle asphalt asphalt noise / texture lines
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(roadLeft, rowY - 2, ROAD_WIDTH, 2);

      // Dashed lane dividers
      ctx.fillStyle = '#FBBF24'; // Bright road yellow dash
      const dashWidth = 24;
      const dashHeight = 4;
      for (let x = roadLeft + 10; x < roadRight; x += 48) {
        ctx.fillRect(x, rowY - CELL_SIZE / 2 - dashHeight / 2, dashWidth, dashHeight);
      }

      // Road edge reflectors
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(roadLeft + 2, rowY - CELL_SIZE + 4, 3, 6);
      ctx.fillRect(roadRight - 5, rowY - CELL_SIZE + 4, 3, 6);

      // Direction indicator arrow painted faintly on the asphalt
      if (lane) {
        const arrowX = lane.direction === 1 ? roadLeft + 40 : roadRight - 40;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        if (lane.direction === 1) {
          ctx.moveTo(arrowX, rowY - CELL_SIZE / 2 - 8);
          ctx.lineTo(arrowX + 16, rowY - CELL_SIZE / 2);
          ctx.lineTo(arrowX, rowY - CELL_SIZE / 2 + 8);
        } else {
          ctx.moveTo(arrowX, rowY - CELL_SIZE / 2 - 8);
          ctx.lineTo(arrowX - 16, rowY - CELL_SIZE / 2);
          ctx.lineTo(arrowX, rowY - CELL_SIZE / 2 + 8);
        }
        ctx.fill();
      }
    }
  }
}

/**
 * Draw decorative street lamps, trees, or hydrants on pavements
 */
function drawPavementDecorations(
  ctx: CanvasRenderingContext2D,
  roadLeft: number,
  pavementY: number,
  row: number
) {
  // Tree on left end
  const tree1X = roadLeft + 20;
  const treeY = pavementY + CELL_SIZE / 2;
  ctx.fillStyle = '#78350F'; // Trunk
  ctx.fillRect(tree1X - 4, treeY, 8, 14);
  ctx.fillStyle = '#15803D'; // Foliage
  ctx.beginPath();
  ctx.arc(tree1X, treeY - 4, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22C55E';
  ctx.beginPath();
  ctx.arc(tree1X - 3, treeY - 8, 8, 0, Math.PI * 2);
  ctx.fill();

  // Streetlamp or hydrant on right end
  const rightX = roadLeft + ROAD_WIDTH - 20;
  if (row % 2 === 0) {
    // Streetlamp
    ctx.fillStyle = '#475569';
    ctx.fillRect(rightX - 2, pavementY + 10, 4, CELL_SIZE - 14);
    ctx.fillStyle = '#FACC15'; // Glowing bulb
    ctx.beginPath();
    ctx.arc(rightX, pavementY + 12, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Fire hydrant
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(rightX - 5, pavementY + 16, 10, 16);
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.arc(rightX, pavementY + 16, 5, Math.PI, 0);
    ctx.fill();
  }
}

/**
 * Render a cartoon car with spinning wheels, lights, and reflections
 */
export function drawCar(
  ctx: CanvasRenderingContext2D,
  car: Car,
  cameraY: number,
  viewHeight: number
) {
  const drawY = viewHeight - (car.y - cameraY);
  const isMovingRight = car.speed > 0;

  ctx.save();
  ctx.translate(car.x, drawY);

  // Soft car shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(car.width / 2, car.height + 2, car.width * 0.48, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car Body Base
  ctx.fillStyle = car.color;
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.roundRect(0, 2, car.width, car.height - 4, 8);
  ctx.fill();
  ctx.stroke();

  // Car Cabin / Roof
  const roofW = car.width * 0.52;
  const roofH = car.height * 0.72;
  const roofX = isMovingRight ? car.width * 0.2 : car.width * 0.28;
  const roofY = (car.height - roofH) / 2;

  ctx.fillStyle = car.roofColor || '#1E293B';
  ctx.beginPath();
  ctx.roundRect(roofX, roofY, roofW, roofH, 6);
  ctx.fill();
  ctx.stroke();

  // Windshield & Windows
  ctx.fillStyle = '#93C5FD'; // Glass blue
  const winFrontX = isMovingRight ? roofX + roofW - 8 : roofX + 2;
  ctx.fillRect(winFrontX, roofY + 3, 6, roofH - 6);

  const winRearX = isMovingRight ? roofX + 3 : roofX + roofW - 9;
  ctx.fillRect(winRearX, roofY + 3, 6, roofH - 6);

  // Special car model details
  if (car.type === 'taxi') {
    // Taxi roof sign
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(roofX + roofW / 2 - 10, roofY - 7, 20, 8);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 6px sans-serif';
    ctx.fillText('TAXI', roofX + roofW / 2 - 7, roofY - 1);
    // Checkered stripe
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, car.height / 2 - 2, car.width, 3);
  } else if (car.type === 'truck') {
    // Delivery van back container
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    const contX = isMovingRight ? 4 : car.width * 0.4;
    ctx.fillRect(contX, 4, car.width * 0.55, car.height - 8);
  } else if (car.type === 'sport') {
    // Rear spoiler
    const spoilerX = isMovingRight ? 2 : car.width - 6;
    ctx.fillStyle = '#111827';
    ctx.fillRect(spoilerX, 1, 4, car.height - 2);
  }

  // Headlights & Tail Lights
  const headlightX = isMovingRight ? car.width - 3 : 0;
  const taillightX = isMovingRight ? 0 : car.width - 3;

  // Front yellow headlights with beam glow
  ctx.fillStyle = '#FEF08A';
  ctx.fillRect(headlightX, 6, 3, 6);
  ctx.fillRect(headlightX, car.height - 12, 3, 6);

  // Subtle headlight beam cone
  ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
  ctx.beginPath();
  if (isMovingRight) {
    ctx.moveTo(car.width, 6);
    ctx.lineTo(car.width + 40, -4);
    ctx.lineTo(car.width + 40, car.height + 4);
    ctx.lineTo(car.width, car.height - 6);
  } else {
    ctx.moveTo(0, 6);
    ctx.lineTo(-40, -4);
    ctx.lineTo(-40, car.height + 4);
    ctx.lineTo(0, car.height - 6);
  }
  ctx.fill();

  // Rear red tail lights
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(taillightX, 7, 3, 5);
  ctx.fillRect(taillightX, car.height - 12, 3, 5);

  // Wheels (top and bottom tires)
  ctx.fillStyle = '#18181B';
  const wheelW = 12;
  const wheelH = 4;
  const wFrontX = isMovingRight ? car.width - 18 : 6;
  const wRearX = isMovingRight ? 6 : car.width - 18;

  // Top wheels
  ctx.fillRect(wFrontX, -1, wheelW, wheelH);
  ctx.fillRect(wRearX, -1, wheelW, wheelH);
  // Bottom wheels
  ctx.fillRect(wFrontX, car.height - 3, wheelW, wheelH);
  ctx.fillRect(wRearX, car.height - 3, wheelW, wheelH);

  // Hubcaps
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(wFrontX + 4, 0, 4, 2);
  ctx.fillRect(wRearX + 4, 0, 4, 2);
  ctx.fillRect(wFrontX + 4, car.height - 2, 4, 2);
  ctx.fillRect(wRearX + 4, car.height - 2, 4, 2);

  ctx.restore();
}

/**
 * Render the cartoon avatar player with animated hop squash/stretch and direction
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: { x: number; y: number; col: number; row: number; hopProgress: number; direction: 'up' | 'down' | 'left' | 'right' },
  avatar: Avatar,
  cameraY: number,
  viewHeight: number
) {
  const drawX = player.x;
  const drawY = viewHeight - (player.y - cameraY);

  ctx.save();
  ctx.translate(drawX + CELL_SIZE / 2, drawY - CELL_SIZE / 2);

  // Calculate hop lift and squash-and-stretch
  const hopLift = Math.sin(player.hopProgress * Math.PI) * 16;
  let scaleX = 1;
  let scaleY = 1;

  if (player.hopProgress > 0) {
    if (player.hopProgress < 0.5) {
      // Ascending stretch
      scaleX = 0.88;
      scaleY = 1.15;
    } else {
      // Landing squash
      scaleX = 1.14;
      scaleY = 0.86;
    }
  }

  // Draw shadow (shrinks as player hops higher)
  const shadowScale = Math.max(0.4, 1 - hopLift / 25);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, CELL_SIZE / 2 - 4, 14 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Apply hop lift & squash
  ctx.translate(0, -hopLift);
  ctx.scale(scaleX, scaleY);

  // Rotation based on movement direction
  if (player.direction === 'left') {
    ctx.scale(-1, 1);
  }

  const baseColor = avatar.accentColor;
  const secondary = avatar.secondaryColor;

  // Specific avatar drawings
  drawAvatarCharacter(ctx, avatar.id, baseColor, secondary, player.hopProgress);

  ctx.restore();
}

/**
 * Draw custom cartoon avatar sprites
 */
function drawAvatarCharacter(
  ctx: CanvasRenderingContext2D,
  id: string,
  primary: string,
  secondary: string,
  hop: number
) {
  const bob = Math.sin(hop * Math.PI * 2) * 2;

  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;

  switch (id) {
    case 'clucky': {
      // Chicken body
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Red comb
      ctx.fillStyle = secondary;
      ctx.beginPath();
      ctx.arc(0, -18, 6, 0, Math.PI * 2);
      ctx.arc(6, -17, 5, 0, Math.PI * 2);
      ctx.arc(-6, -17, 5, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.moveTo(3, -2);
      ctx.lineTo(12, 1);
      ctx.lineTo(3, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Big Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(3, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(4, -6, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Wings
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.ellipse(-8, 3, 6, 10, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'ribbit': {
      // Frog body
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Frog Eyes on top
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(-8, -12, 8, 0, Math.PI * 2);
      ctx.arc(8, -12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White eyeballs
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-8, -12, 5, 0, Math.PI * 2);
      ctx.arc(8, -12, 5, 0, Math.PI * 2);
      ctx.fill();
      // Pupils
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-7, -12, 2.5, 0, Math.PI * 2);
      ctx.arc(7, -12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Rosy cheeks
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.arc(-10, 4, 3, 0, Math.PI * 2);
      ctx.arc(10, 4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Big smile
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 3, 8, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      break;
    }

    case 'whiskers': {
      // Cat body
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pointy ears
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(-14, -6);
      ctx.lineTo(-10, -20);
      ctx.lineTo(-4, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, -10);
      ctx.lineTo(10, -20);
      ctx.lineTo(14, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner ears
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.moveTo(-12, -7);
      ctx.lineTo(-10, -16);
      ctx.lineTo(-6, -10);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, -10);
      ctx.lineTo(10, -16);
      ctx.lineTo(12, -7);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-6, -2, 2.5, 0, Math.PI * 2);
      ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Nose & whiskers
      ctx.fillStyle = '#F472B6';
      ctx.beginPath();
      ctx.arc(0, 3, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.5;
      // Left whiskers
      ctx.beginPath();
      ctx.moveTo(-4, 3); ctx.lineTo(-15, 1);
      ctx.moveTo(-4, 4); ctx.lineTo(-15, 6);
      // Right whiskers
      ctx.moveTo(4, 3); ctx.lineTo(15, 1);
      ctx.moveTo(4, 4); ctx.lineTo(15, 6);
      ctx.stroke();
      break;
    }

    case 'beep': {
      // Retro robot square head
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.roundRect(-14, -12, 28, 26, 6);
      ctx.fill();
      ctx.stroke();

      // Antenna
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(0, -22);
      ctx.stroke();
      ctx.fillStyle = '#EF4444'; // Glowing red beacon
      ctx.beginPath();
      ctx.arc(0, -23, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Visor screen
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(-10, -7, 20, 10);

      // Cyan glowing eyes
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(-8, -5, 5, 6);
      ctx.fillRect(3, -5, 5, 6);

      // Bolts on ears
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-17, -3, 3, 8);
      ctx.fillRect(14, -3, 3, 8);
      break;
    }

    default: {
      // Universal colorful cartoon animal/hero base
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.arc(0, 2, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Secondary patch
      ctx.fillStyle = secondary;
      ctx.beginPath();
      ctx.arc(0, 6, 8, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-5, -4, 4.5, 0, Math.PI * 2);
      ctx.arc(5, -4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-4, -4, 2.5, 0, Math.PI * 2);
      ctx.arc(6, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Cute smile
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 4, 4, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
      break;
    }
  }
}

/**
 * Render floating score notifications and particles
 */
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  cameraY: number,
  viewHeight: number
) {
  for (const p of particles) {
    const drawY = viewHeight - (p.y - cameraY);
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
