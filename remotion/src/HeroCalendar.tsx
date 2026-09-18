import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// SyncDays actual color palette
const COLORS = {
  softLinen: "#FAF8F5", // Background
  jetBlack: "#1A1A1A", // Text
  paleOak: "#A09080", // Muted text
  charcoalBlue: "#4A5568", // Dark mode muted
  reddishBrown: "#C4956A", // Accent / Today marker
  white: "#FFFFFF",
};

// Actual category colors from SyncDays (Classic theme)
const CATEGORY_COLORS: Record<string, string> = {
  "Date Night - Vlad": "#4A7C9B", // Blue
  "Date Night - Ioana": "#D4836D", // Coral
  "Birthdays & Anniversaries": "#D4836D", // Coral/pink
  "Personal Adventures": "#0A6B70", // Teal
  "Events": "#5E4B8C", // Purple
  "Holidays": "#7B8EC2", // Light purple
  "Sailing": "#0A6B70", // Teal
  "Office": "#3366CC", // Blue
  "Travel": "#E2B866", // Yellow/gold
  "Toma's Vacations": "#E2B866", // Yellow
};

// Grid constants - matching actual SyncDays (56px cells)
const CELL_SIZE = 56;
const GRID_COLS = 7;
const GRID_ROWS = 12; // Show ~3 months

// Event type matching actual CalendarEvent
type CalendarEvent = {
  id: string;
  name: string;
  category: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  style: "solid" | "outline" | "dashed";
  isLocked?: boolean;
  emoji?: string;
};

// Sample events matching the screenshot
const EVENTS: CalendarEvent[] = [
  {
    id: "guinness",
    name: "Guinness Sailing",
    category: "Sailing",
    startRow: 0,
    startCol: 1,
    endRow: 0,
    endCol: 5,
    style: "solid",
    isLocked: true,
  },
  {
    id: "vacation",
    name: "Vac...",
    category: "Travel",
    startRow: 0,
    startCol: 5,
    endRow: 0,
    endCol: 6,
    style: "outline",
    isLocked: true,
  },
  {
    id: "japan1",
    name: "Japan Trip",
    category: "Travel",
    startRow: 2,
    startCol: 2,
    endRow: 2,
    endCol: 6,
    style: "solid",
    isLocked: true,
  },
  {
    id: "japan2",
    name: "Japan Trip",
    category: "Travel",
    startRow: 3,
    startCol: 0,
    endRow: 3,
    endCol: 6,
    style: "solid",
    isLocked: true,
  },
  {
    id: "japan3",
    name: "Japan Trip",
    category: "Travel",
    startRow: 4,
    startCol: 0,
    endRow: 4,
    endCol: 6,
    style: "solid",
    isLocked: true,
  },
  {
    id: "japan4",
    name: "Japan Trip",
    category: "Travel",
    startRow: 5,
    startCol: 0,
    endRow: 5,
    endCol: 4, // Will animate to extend
    style: "solid",
    isLocked: true,
  },
  {
    id: "birthday",
    name: "Ana & Diana's Birthday",
    category: "Birthdays & Anniversaries",
    startRow: 6,
    startCol: 1,
    endRow: 6,
    endCol: 5,
    style: "solid",
    emoji: "🎂",
  },
  {
    id: "italy",
    name: "Ital...",
    category: "Travel",
    startRow: 7,
    startCol: 0,
    endRow: 7,
    endCol: 1,
    style: "solid",
    emoji: "❤️",
  },
  {
    id: "barcelona1",
    name: "Barcelona Home Exchange",
    category: "Travel",
    startRow: 7,
    startCol: 2,
    endRow: 7,
    endCol: 6,
    style: "solid",
    isLocked: true,
  },
  {
    id: "barcelona2",
    name: "Barcelona Home Exchange",
    category: "Travel",
    startRow: 8,
    startCol: 0,
    endRow: 8,
    endCol: 6,
    style: "solid",
    isLocked: true,
  },
];

// Generate dates for the grid
const generateDates = (): { day: number; month: string | null; isOdd: boolean }[] => {
  const dates: { day: number; month: string | null; isOdd: boolean }[] = [];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Starting from June 1, 2026 (matching screenshot)
  let day = 1;
  let month = 5; // June (0-indexed)
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
    const isFirstOfMonth = day === 1;
    dates.push({
      day,
      month: isFirstOfMonth ? months[month] : null,
      isOdd: month % 2 === 1, // Odd months (Jul, Sep, Nov) have full opacity
    });

    day++;
    if (day > daysInMonth[month]) {
      day = 1;
      month = (month + 1) % 12;
    }
  }
  return dates;
};

const DATES = generateDates();

// Category item in left drawer
const CategoryItem = ({
  name,
  color,
  opacity = 1,
}: {
  name: string;
  color: string;
  opacity?: number;
}) => {
  return (
    <div
      className="flex items-center gap-3 px-2 py-2"
      style={{ opacity }}
    >
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span
        style={{
          fontFamily: "Outfit, system-ui, sans-serif",
          fontSize: 14,
          color: COLORS.jetBlack,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={COLORS.paleOak}
        strokeWidth="1.5"
        style={{ opacity: 0.5 }}
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </div>
  );
};

// Month bar in right sidebar
const MonthBar = ({
  month,
  colors,
  isExpanded = false,
}: {
  month: string;
  colors: string[];
  isExpanded?: boolean;
}) => {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div
        className="flex-1 h-5 rounded-sm overflow-hidden flex"
        style={{ backgroundColor: `${COLORS.paleOak}20` }}
      >
        {colors.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: color,
              width: `${100 / colors.length}%`,
              height: "100%",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "Outfit, system-ui, sans-serif",
          fontSize: 12,
          color: COLORS.paleOak,
          width: 28,
        }}
      >
        {month}
      </span>
    </div>
  );
};

// Single day cell
const DayCell = ({
  day,
  month,
  isOdd,
  cellOpacity,
}: {
  day: number;
  month: string | null;
  isOdd: boolean;
  cellOpacity: number;
}) => {
  const isMonthLabel = month !== null;

  return (
    <div
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: cellOpacity,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: isMonthLabel ? "50%" : 0,
          backgroundColor: isMonthLabel ? "rgba(255,255,255,0.5)" : "transparent",
        }}
      >
        <span
          style={{
            fontFamily: "Outfit, system-ui, sans-serif",
            fontSize: isMonthLabel ? 16 : 24,
            fontWeight: isMonthLabel ? 400 : 200,
            letterSpacing: isMonthLabel ? 2 : 0,
            color: isMonthLabel ? COLORS.charcoalBlue : COLORS.jetBlack,
            opacity: isMonthLabel ? 1 : (isOdd ? 1 : 0.3),
          }}
        >
          {isMonthLabel ? month : day}
        </span>
      </div>
    </div>
  );
};

// Event pill component
const EventPill = ({
  event,
  isAnimating,
  animatedEndCol,
  floatOffset,
  entranceProgress,
}: {
  event: CalendarEvent;
  isAnimating: boolean;
  animatedEndCol?: number;
  floatOffset: number;
  entranceProgress: number;
}) => {
  const endCol = animatedEndCol ?? event.endCol;
  const color = CATEGORY_COLORS[event.category] || "#888";
  const isSolid = event.style === "solid";
  const isOutline = event.style === "outline";
  const isDashed = event.style === "dashed";

  // Calculate position
  const left = event.startCol * CELL_SIZE + 4;
  const top = event.startRow * CELL_SIZE + 4 + floatOffset;
  const width = (endCol - event.startCol + 1) * CELL_SIZE - 8;
  const height = 48;

  // Calculate day count
  const totalDays = (event.endRow - event.startRow) * 7 + (endCol - event.startCol + 1);

  // Entrance animation
  const scale = interpolate(entranceProgress, [0, 1], [0.9, 1]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 0.85]);

  // Shadow for floating effect
  const shadowIntensity = isAnimating ? 0.2 : 0.1;
  const shadowY = isAnimating ? 6 : 3;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: 9999, // full pill
        backgroundColor: isSolid ? color : "transparent",
        border: isSolid ? "none" : `2px ${isDashed ? "dashed" : "solid"} ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 12px",
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        opacity,
        boxShadow: isSolid ? `0 ${shadowY}px 8px rgba(0,0,0,${shadowIntensity})` : "none",
        zIndex: isSolid ? 30 : 20,
      }}
    >
      {/* Lock icon */}
      {event.isLocked && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSolid ? COLORS.white : color}
          strokeWidth="3"
          style={{ marginRight: 6, flexShrink: 0 }}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}

      {/* Emoji */}
      {event.emoji && (
        <span style={{ marginRight: 6, flexShrink: 0 }}>{event.emoji}</span>
      )}

      {/* Event name */}
      <span
        style={{
          fontFamily: "Outfit, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 400,
          color: isSolid ? COLORS.white : color,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          textAlign: "center",
        }}
      >
        {event.name}
      </span>

      {/* Day count badge */}
      {totalDays > 1 && (
        <span
          style={{
            fontFamily: "Outfit, system-ui, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: isSolid ? COLORS.white : color,
            opacity: 0.7,
            marginLeft: 6,
            flexShrink: 0,
          }}
        >
          {Math.round(totalDays)}d
        </span>
      )}
    </div>
  );
};

// Resize handle
const ResizeHandle = ({
  x,
  y,
  isVisible,
}: {
  x: number;
  y: number;
  isVisible: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 3),
    [-1, 1],
    [0.9, 1.1]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x - 8,
        top: y,
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: COLORS.softLinen,
        border: `2px solid ${COLORS.paleOak}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        transform: `scale(${isVisible ? pulse : 0})`,
        opacity: isVisible ? 1 : 0,
        zIndex: 100,
      }}
    />
  );
};

// Cursor
const Cursor = ({ x, y, opacity }: { x: number; y: number; opacity: number }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        zIndex: 200,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.48 0 .72-.58.38-.92L6.35 2.86a.5.5 0 0 0-.85.35Z"
          fill={COLORS.jetBlack}
          stroke={COLORS.white}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export const HeroCalendar = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation timeline (6 seconds = 180 frames at 30fps)
  // 0-20: UI elements fade in
  // 20-50: Cursor appears and moves to resize handle
  // 50-100: Event extends
  // 100-180: Hold and subtle floating continues

  // Grid entrance
  const gridEntrance = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Japan trip row 5 extension animation
  const extensionStart = 50;
  const extensionProgress = spring({
    frame: frame - extensionStart,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const japan4EndCol = interpolate(
    extensionProgress,
    [0, 1],
    [4, 6], // Extend from col 4 to col 6 (2 more days)
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cursor animation
  const cursorMoveProgress = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const cursorDragProgress = interpolate(extensionProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor positions
  const handleStartX = 5 * CELL_SIZE - 4 + 280 + 32; // Account for sidebar
  const handleStartY = 5 * CELL_SIZE + 4 + 68 + 16; // Account for header
  const handleEndX = 7 * CELL_SIZE - 4 + 280 + 32;

  let cursorX = interpolate(cursorMoveProgress, [0, 1], [900, handleStartX]);
  let cursorY = interpolate(cursorMoveProgress, [0, 1], [400, handleStartY]);

  if (frame >= extensionStart) {
    cursorX = interpolate(cursorDragProgress, [0, 1], [handleStartX, handleEndX]);
  }

  const cursorOpacity = interpolate(frame, [20, 30, 160, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showResizeHandle = frame >= 40 && frame <= 160;

  // Floating animation offset
  const getFloatOffset = (id: string) => {
    const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
    return Math.sin((frame / fps) * Math.PI * 0.3 + seed) * 1.5;
  };

  // Event entrance stagger
  const getEventEntrance = (index: number) => {
    const delay = 10 + index * 3;
    return spring({
      frame: frame - delay,
      fps,
      config: { damping: 20, stiffness: 100 },
    });
  };

  // Sidebar data
  const categories = [
    { name: "Date Night - Vlad", color: "#4A7C9B" },
    { name: "Date Night - Ioana", color: "#D4836D" },
    { name: "Birthdays & Anniversaries", color: "#D4836D" },
    { name: "Personal Adventures", color: "#0A6B70" },
    { name: "Events", color: "#5E4B8C" },
    { name: "Holidays", color: "#7B8EC2" },
    { name: "Sailing", color: "#0A6B70" },
    { name: "Office", color: "#3366CC" },
    { name: "Travel", color: "#E2B866" },
    { name: "Toma's Vacations", color: "#E2B866" },
  ];

  const months = [
    { month: "Jun", colors: ["#E2B866", "#0A6B70", "#4A7C9B"] },
    { month: "Jul", colors: ["#E2B866", "#D4836D"] },
    { month: "Aug", colors: ["#E2B866", "#5E4B8C", "#0A6B70"] },
    { month: "Sep", colors: ["#E2B866", "#D4836D", "#4A7C9B"] },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.softLinen,
        fontFamily: "Outfit, system-ui, sans-serif",
      }}
    >
      {/* Left Sidebar - Categories */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 280,
          height: "100%",
          borderRight: `1px solid ${COLORS.paleOak}30`,
          backgroundColor: COLORS.softLinen,
          opacity: gridEntrance,
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 68,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${COLORS.paleOak}20`,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: COLORS.jetBlack,
            }}
          >
            Categories
          </span>
        </div>

        {/* Category list */}
        <div style={{ padding: "16px 16px" }}>
          {/* Create new category button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              color: COLORS.paleOak,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `1px dashed ${COLORS.paleOak}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span style={{ fontSize: 14 }}>Create New Category</span>
            <span style={{ fontSize: 10, marginLeft: "auto" }}>10/∞</span>
          </div>

          {/* Categories */}
          {categories.map((cat, i) => (
            <CategoryItem
              key={cat.name}
              name={cat.name}
              color={cat.color}
              opacity={interpolate(frame, [5 + i * 2, 15 + i * 2], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          ))}
        </div>

        {/* VIEW section at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            padding: "0 16px",
          }}
        >
          <div style={{ fontSize: 11, color: COLORS.paleOak, marginBottom: 8, letterSpacing: 1 }}>
            VIEW
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                backgroundColor: COLORS.jetBlack,
                borderRadius: 9999,
                color: COLORS.softLinen,
                fontSize: 12,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Personal
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                border: `1px solid ${COLORS.paleOak}30`,
                borderRadius: 9999,
                fontSize: 12,
                color: COLORS.jetBlack,
              }}
            >
              <span style={{ color: "#E84A5F" }}>❤️</span>
              <span style={{ color: "#E84A5F" }}>❤️</span>
              thedodans
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div
        style={{
          position: "absolute",
          left: 280,
          right: 200,
          top: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        {/* Header row with day names */}
        <div
          style={{
            height: 68,
            display: "flex",
            alignItems: "flex-end",
            paddingBottom: 8,
            paddingLeft: 32,
            opacity: gridEntrance,
          }}
        >
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div
              key={i}
              style={{
                width: CELL_SIZE,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 400,
                color: COLORS.paleOak,
              }}
            >
              {day}
            </div>
          ))}
          {/* Right side header content */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingRight: 16,
              color: COLORS.paleOak,
              fontSize: 12,
            }}
          >
            <span>60 events</span>
            <span style={{ color: COLORS.jetBlack, fontWeight: 500 }}>Today</span>
          </div>
        </div>

        {/* Grid container */}
        <div
          style={{
            position: "relative",
            paddingLeft: 32,
            paddingTop: 0,
          }}
        >
          {/* Day cells grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
            }}
          >
            {DATES.map((date, i) => {
              const row = Math.floor(i / GRID_COLS);
              const col = i % GRID_COLS;
              const cellDelay = (row * 0.5 + col * 0.3) * 0.5;
              const cellOpacity = interpolate(
                frame,
                [cellDelay, cellDelay + 15],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              return (
                <DayCell
                  key={i}
                  day={date.day}
                  month={date.month}
                  isOdd={date.isOdd}
                  cellOpacity={cellOpacity}
                />
              );
            })}
          </div>

          {/* Events layer */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 32,
              width: GRID_COLS * CELL_SIZE,
              height: GRID_ROWS * CELL_SIZE,
              pointerEvents: "none",
            }}
          >
            {EVENTS.map((event, i) => {
              const isJapan4 = event.id === "japan4";
              const endCol = isJapan4 ? japan4EndCol : event.endCol;

              return (
                <EventPill
                  key={event.id}
                  event={event}
                  isAnimating={isJapan4 && frame >= extensionStart && frame <= extensionStart + 60}
                  animatedEndCol={isJapan4 ? endCol : undefined}
                  floatOffset={getFloatOffset(event.id)}
                  entranceProgress={getEventEntrance(i)}
                />
              );
            })}

            {/* Resize handle on japan4 event */}
            <ResizeHandle
              x={(japan4EndCol + 1) * CELL_SIZE - 4}
              y={5 * CELL_SIZE + 4 + 16}
              isVisible={showResizeHandle}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Months */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 200,
          height: "100%",
          borderLeft: `1px solid ${COLORS.paleOak}30`,
          backgroundColor: COLORS.softLinen,
          opacity: gridEntrance,
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 68,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${COLORS.paleOak}20`,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 300, color: COLORS.jetBlack }}>
            Months
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.paleOak} strokeWidth="1.5">
              <polyline points="9 14 4 9 9 4" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </svg>
          </div>
        </div>

        {/* Year accordions */}
        <div style={{ padding: "16px 20px" }}>
          {/* 2025 collapsed */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.paleOak }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ fontSize: 14 }}>2025</span>
            </div>
          </div>

          {/* 2026 expanded */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.reddishBrown} strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span style={{ fontSize: 14, color: COLORS.reddishBrown, fontWeight: 500 }}>2026</span>
              <span style={{ fontSize: 10, color: COLORS.reddishBrown, marginLeft: "auto" }}>Current</span>
            </div>

            {/* Month bars */}
            <div style={{ paddingLeft: 20 }}>
              {months.map((m, i) => (
                <MonthBar
                  key={m.month}
                  month={m.month}
                  colors={m.colors}
                />
              ))}
            </div>
          </div>

          {/* 2027 collapsed */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.paleOak }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ fontSize: 14 }}>2027</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 56,
          backgroundColor: COLORS.softLinen,
          borderTop: `1px solid ${COLORS.paleOak}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          opacity: gridEntrance,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.jetBlack }}>SyncDays</span>
          <span style={{ fontSize: 11, color: COLORS.paleOak }}>v0.9.80</span>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {[
            "M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", // Calendar
            "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", // Phone
            "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", // Circle
          ].map((path, i) => (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={i === 0 ? COLORS.jetBlack : COLORS.paleOak}
              strokeWidth="1.5"
            >
              <path d={path} />
            </svg>
          ))}
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {[1, 2, 3, 4].map((_, i) => (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.paleOak}
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          ))}
        </div>
      </div>

      {/* Cursor */}
      <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} />
    </AbsoluteFill>
  );
};
