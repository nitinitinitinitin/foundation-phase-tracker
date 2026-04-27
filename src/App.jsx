import { useState, useEffect, useRef } from "react";
import { supabase, PROGRESS_ROW_ID } from "./supabase";

const weeks = [
  {
    id: 1,
    week: "WEEK 1",
    dates: "Apr 25 – May 1",
    status: "complete",
    subjects: {
      cv: {
        topic: "Camera Calibration",
        tasks: [
          "Watch First Principles CV: Camera Calibration Part 1–3",
          "Read OpenCV camera calibration tutorial",
          "Print checkerboard, take 20+ photos with cameras",
          "Understand intrinsic vs extrinsic parameters",
        ],
      },
      cpp: null,
      math: null,
    },
  },
  {
    id: 2,
    week: "WEEK 2",
    dates: "May 2 – May 8",
    status: "complete",
    subjects: {
      cv: {
        topic: "Stereo Calibration + Depth",
        tasks: [
          "Watch First Principles CV: Epipolar Geometry Part 1–2",
          "Run OpenCV calibration on checkerboard photos",
          "Visualize results (reprojection error, camera positions)",
          "Understand what the calibration matrix means",
        ],
      },
      cpp: null,
      math: null,
    },
  },
  {
    id: 3,
    week: "WEEK 3",
    dates: "May 9 – May 15",
    status: "active",
    subjects: {
      cv: {
        topic: "Triangulation + LED Detection",
        tasks: [
          "Study triangulation theory (2D to 3D)",
          "Code: Detect single LED in both cameras",
          "Triangulate its 3D position using cv::triangulatePoints",
          "Understand why calibrated cameras are needed for triangulation",
        ],
      },
      cpp: null,
      math: null,
    },
  },
  {
    id: 4,
    week: "WEEK 4",
    dates: "May 16 – May 22",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Epipolar Geometry",
        tasks: [
          "Watch First Principles CV: Epipolar Geometry Part 1",
          "Watch First Principles CV: Epipolar Geometry Part 2",
          "Understand: epipolar plane, epipolar line, baseline",
          "Understand: Essential Matrix and Fundamental Matrix",
          "Paper: Draw two cameras and a 3D point, draw the epipolar geometry",
        ],
      },
      cpp: {
        topic: "Arrays and Vectors",
        tasks: [
          "LearnCpp: Chapter 11.1 — Arrays (fixed size)",
          "LearnCpp: Chapter 11.2 — Array indexing and loops",
          "LearnCpp: Chapter 16.1 — Introduction to std::vector",
          "LearnCpp: Chapter 16.2 — Passing vectors to functions",
          "Practice: Store 5 numbers in a vector, loop and print each",
          "Practice: Store XY coordinates of 3 points, print each",
        ],
      },
      math: {
        topic: "What is a Vector?",
        tasks: [
          "Watch 3Blue1Brown: Essence of Linear Algebra — Chapter 1 (Vectors)",
          "Watch 3Blue1Brown: Essence of Linear Algebra — Chapter 2 (Span, Basis)",
          "Khan Academy: Linear Algebra — Vector intro exercises",
          "Paper: Draw vectors (2,3) and (−1,4), add them, draw result",
          "Paper: Multiply (2,3) by scalar 2, draw result",
          "Paper: What does multiplying by a negative number do?",
        ],
      },
    },
  },
  {
    id: 5,
    week: "WEEK 5",
    dates: "May 23 – May 29",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Stereo Vision and Disparity",
        tasks: [
          "Watch First Principles CV: Stereo Vision / Rectification",
          "Understand: what does image rectification do?",
          "Understand: what is disparity?",
          "Understand: depth = (focal_length × baseline) / disparity",
          "Paper: Calculate depth from given baseline, focal length, disparity",
          "Paper: What happens to depth if disparity doubles?",
        ],
      },
      cpp: {
        topic: "Functions in Depth",
        tasks: [
          "LearnCpp: Chapter 2.1 — Introduction to functions",
          "LearnCpp: Chapter 2.2 — Function return values",
          "LearnCpp: Chapter 2.3 — Void functions",
          "LearnCpp: Chapter 9.1 — Introduction to references",
          "LearnCpp: Chapter 9.2 — Passing by reference vs by value",
          "Practice: Write a function that returns distance from origin",
          "Practice: Write a function that swaps two points by reference",
        ],
      },
      math: {
        topic: "Dot Product",
        tasks: [
          "Watch 3Blue1Brown: Chapter 9 (Dot products and duality)",
          "Khan Academy: Dot product exercises",
          "Paper: Calculate (2,3)·(4,1)",
          "Paper: Calculate (1,0)·(0,1) — what does it mean geometrically?",
          "Paper: What does a dot product of 0 mean?",
          "Paper: Find a vector perpendicular to (2,3)",
        ],
      },
    },
  },
  {
    id: 6,
    week: "WEEK 6",
    dates: "May 30 – Jun 5",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "The Pinhole Camera Model",
        tasks: [
          "Watch First Principles CV: Perspective Projection",
          "Understand: what is the pinhole camera model?",
          "Understand: how does a 3D point project onto 2D image plane?",
          "Understand: what is focal length physically?",
          "Understand: what is the principal point (cx, cy)?",
          "Open your calibration output — identify every value in K matrix",
          "Paper: Manually project a 3D point using your actual focal length",
        ],
      },
      cpp: {
        topic: "Pointers",
        tasks: [
          "LearnCpp: Chapter 9.6 — Introduction to pointers",
          "LearnCpp: Chapter 9.7 — Null pointers",
          "LearnCpp: Chapter 9.9 — Pointer arithmetic",
          "LearnCpp: Chapter 9.10 — Pointers and arrays",
          "Practice: Create an integer, make a pointer to it, change value through pointer",
          "Practice: Use a pointer to loop through an array",
        ],
      },
      math: {
        topic: "Matrix Basics",
        tasks: [
          "Watch 3Blue1Brown: Chapter 3 (Linear transformations and matrices)",
          "Watch 3Blue1Brown: Chapter 4 (Matrix multiplication as composition)",
          "Khan Academy: Matrix multiplication exercises",
          "Paper: Multiply two 2×2 matrices by hand",
          "Paper: What does multiplying a vector by a matrix DO geometrically?",
          "Paper: What is the identity matrix?",
          "Paper: Multiply vector (2,3) by a 90° rotation matrix",
        ],
      },
    },
  },
  {
    id: 7,
    week: "WEEK 7",
    dates: "Jun 6 – Jun 12",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "The Projection Matrix",
        tasks: [
          "Watch First Principles CV: Camera Projection Matrix",
          "Understand: P = K × [R | t]",
          "Understand: K is intrinsic, [R|t] is extrinsic",
          "Understand: P takes a 3D point and gives a 2D pixel",
          "Paper: Write out what K looks like (3×3 matrix)",
          "Paper: What is the size of P?",
          "Paper: Trace a 3D point all the way to a 2D pixel using K, R, t",
        ],
      },
      cpp: {
        topic: "Classes — Introduction",
        tasks: [
          "LearnCpp: Chapter 13.1 — Introduction to classes",
          "LearnCpp: Chapter 13.2 — Member functions",
          "LearnCpp: Chapter 13.3 — Public and private members",
          "LearnCpp: Chapter 13.5 — Constructors",
          "Practice: Write a Point3D class with x, y, z member variables",
          "Practice: Add constructor, print() method, distanceTo() method",
        ],
      },
      math: {
        topic: "Matrix Transformations in 3D",
        tasks: [
          "Watch 3Blue1Brown: Chapter 5 (The determinant)",
          "Watch 3Blue1Brown: Chapter 6 (Inverse matrices, column space)",
          "Khan Academy: Matrix inverse exercises",
          "Paper: Write rotation matrix for 90° around Z axis",
          "Paper: Apply it to (1,0,0) and (0,1,0) — what do you get?",
          "Paper: What does the determinant of a rotation matrix always equal?",
        ],
      },
    },
  },
  {
    id: 8,
    week: "WEEK 8",
    dates: "Jun 13 – Jun 19",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Triangulation Concepts",
        tasks: [
          "Watch First Principles CV: Triangulation / 3D Reconstruction",
          "Understand: a single camera ray has infinite 3D solutions",
          "Understand: two rays from two cameras give one 3D solution",
          "Understand: in practice rays don't perfectly intersect (noise)",
          "Understand: DLT finds the best estimate despite noise",
          "Paper: Draw camera 1 and camera 2, draw rays to a 3D point",
          "Paper: What happens if detection has 1 pixel of error?",
        ],
      },
      cpp: {
        topic: "Classes — Going Deeper",
        tasks: [
          "LearnCpp: Chapter 13.6 — Const class objects and member functions",
          "LearnCpp: Chapter 13.7 — Static member variables",
          "LearnCpp: Chapter 14.1 — Introduction to operator overloading",
          "LearnCpp: Chapter 14.2 — Overloading arithmetic operators",
          "Practice: Add operator+ and operator− to your Point3D class",
          "Practice: Write a Vector3D class with dot() and cross() methods",
        ],
      },
      math: {
        topic: "Cross Product",
        tasks: [
          "Watch Khan Academy: Cross product (visual explanation)",
          "Khan Academy: Cross product exercises",
          "Paper: Calculate (1,0,0) × (0,1,0)",
          "Paper: Calculate (2,3,0) × (1,0,0)",
          "Paper: What direction does the cross product point?",
          "Paper: If two vectors are parallel, what is their cross product?",
        ],
      },
    },
  },
  {
    id: 9,
    week: "WEEK 9",
    dates: "Jun 20 – Jun 26",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Essential and Fundamental Matrix",
        tasks: [
          "Watch First Principles CV: Essential Matrix / Fundamental Matrix",
          "Understand: what does the Essential Matrix encode?",
          "Understand: E is for calibrated cameras, F is for uncalibrated",
          "Understand: how they relate corresponding points across cameras",
          "Paper: If you have a point in camera 1, what does F give you in camera 2?",
          "Paper: What is the relationship between E and F?",
        ],
      },
      cpp: {
        topic: "Inheritance and Polymorphism",
        tasks: [
          "LearnCpp: Chapter 17.1 — Introduction to inheritance",
          "LearnCpp: Chapter 17.2 — Basic inheritance in C++",
          "LearnCpp: Chapter 17.3 — Order of construction",
          "LearnCpp: Chapter 18.1 — Pointers and references to base classes",
          "Practice: Create base class Shape with area() method",
          "Practice: Create Circle and Rectangle that inherit from Shape",
        ],
      },
      math: {
        topic: "Coordinate Systems and Transformations",
        tasks: [
          "Watch 3Blue1Brown: Chapter 9 (Change of basis)",
          "Khan Academy: Change of basis exercises",
          "Paper: What does it mean to change coordinate systems?",
          "Paper: Point at (3,4) in world space, camera at (1,0) — what is it in camera space?",
          "Paper: Why do we need to transform between world space and camera space?",
        ],
      },
    },
  },
  {
    id: 10,
    week: "WEEK 10",
    dates: "Jun 27 – Jul 3",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Multi-Camera Systems",
        tasks: [
          "Read Vicon and OptiTrack documentation for concepts",
          "Understand: what is the marker correspondence problem?",
          "Understand: what is camera synchronization and why it matters?",
          "Understand: what is a rigid body in mocap?",
          "Paper: If cameras are 10ms out of sync and subject moves at 2m/s, what is the error?",
          "Paper: List every problem that needs solving for multi-camera mocap",
        ],
      },
      cpp: {
        topic: "File I/O and Standard Library",
        tasks: [
          "LearnCpp: Chapter 28.1 — Input and output streams",
          "LearnCpp: Chapter 28.4 — File I/O",
          "LearnCpp: Chapter 16.3 — std::vector capacity and resizing",
          "LearnCpp: Chapter 23.1 — Introduction to std::map",
          "Practice: Save 5 (x,y,z) points to a text file, read them back, print them",
        ],
      },
      math: {
        topic: "Full Projection Equation (Consolidation)",
        tasks: [
          "No new videos — consolidation week",
          "Paper: Write the full projection equation pixel = K × [R|t] × X",
          "Paper: Identify the size of each matrix/vector",
          "Paper: Project 3D point (0,0,100) with fx=500, fy=500, cx=320, cy=240",
          "Paper: Project 3D point (50,0,100) — what changed and why?",
        ],
      },
    },
  },
  {
    id: 11,
    week: "WEEK 11",
    dates: "Jul 4 – Jul 10",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Skeleton Models and Joint Hierarchies",
        tasks: [
          "Research: Vicon plug-in gait marker set (search and read)",
          "Understand: what is a joint hierarchy? (root → spine → shoulder → elbow)",
          "Understand: what is a rigid body segment?",
          "Understand: forward kinematics vs inverse kinematics",
          "Re-read your SRS skeleton mapping section — does it make sense now?",
          "Paper: Draw a simplified 10-joint skeleton as a hierarchy tree",
          "Paper: For the upper arm, where would you place 3 markers?",
        ],
      },
      cpp: {
        topic: "Templates and Standard Library",
        tasks: [
          "LearnCpp: Chapter 11.16 — Introduction to std::array",
          "LearnCpp: Chapter 23.2 — std::map operations",
          "LearnCpp: Chapter 22.1 — Introduction to templates",
          "LearnCpp: Chapter 22.2 — Function templates",
          "Practice: Write a template function min(a, b) that works for int and float",
          "Practice: Use std::map to store camera names and focal lengths, print all",
        ],
      },
      math: {
        topic: "Rotation Representations",
        tasks: [
          "Watch YouTube: 'Euler angles gimbal lock explained'",
          "Watch YouTube: 'Quaternions explained visually' (3Blue1Brown optional)",
          "Understand: rotation matrix, Euler angles, quaternions",
          "Understand: what is gimbal lock and why it's a problem",
          "Paper: Write rotation matrix for 45° around X axis",
          "Paper: Write rotation matrix for 45° around Y axis, multiply them",
          "Paper: Does the order of multiplication matter? Test it.",
        ],
      },
    },
  },
  {
    id: 12,
    week: "WEEK 12",
    dates: "Jul 11 – Jul 17",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Pose Estimation (PnP)",
        tasks: [
          "Watch First Principles CV: Pose Estimation / PnP problem",
          "Understand: what is the PnP (Perspective-n-Point) problem?",
          "Understand: input = known 3D points + their 2D projections",
          "Understand: output = rotation and translation of object",
          "Paper: You have 4 markers on an arm — how does PnP give you joint rotation?",
        ],
      },
      cpp: {
        topic: "Memory Management",
        tasks: [
          "LearnCpp: Chapter 19.1 — Dynamic memory allocation with new and delete",
          "LearnCpp: Chapter 19.2 — Dynamically allocating arrays",
          "LearnCpp: Chapter 22.5 — std::unique_ptr (smart pointers)",
          "LearnCpp: Chapter 22.6 — std::shared_ptr",
          "Practice: Create an object using new, use it, delete it",
          "Practice: Create the same object using unique_ptr — note the difference",
        ],
      },
      math: {
        topic: "Least Squares",
        tasks: [
          "Watch YouTube: 'Least squares explained visually' (StatQuest)",
          "Understand: more equations than unknowns → best approximate solution",
          "Understand: this is what calibration and triangulation use with noisy data",
          "Paper: You measured a point 3 times: (1.1,2.0), (0.9,2.1), (1.0,1.9) — best estimate?",
          "Paper: Why is averaging not always the best approach?",
        ],
      },
    },
  },
  {
    id: 13,
    week: "WEEK 13",
    dates: "Jul 18 – Jul 24",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Full Pipeline Review",
        tasks: [
          "No new topics — consolidation week",
          "Paper: Draw the full mocap pipeline from scratch",
          "Paper: For each stage write — what goes in, what comes out, what can go wrong",
          "Re-read your entire SRS — mark every section you now understand fully",
        ],
      },
      cpp: {
        topic: "Review and Consolidation",
        tasks: [
          "No new chapters — consolidation week",
          "Go back to earliest C++ code and rewrite it cleaner",
          "Write from scratch: store 3D points in a file, read them, calculate centroid, print",
          "If you get stuck: use LearnCpp, not Claude",
        ],
      },
      math: {
        topic: "Full Review",
        tasks: [
          "No new topics — consolidation week",
          "Paper: Add vectors (3,1,2) and (−1,4,0)",
          "Paper: Dot product of (2,3,1) and (1,−1,2)",
          "Paper: Cross product of (1,0,0) and (0,1,0)",
          "Paper: Multiply a 3×3 rotation matrix by a 3D point",
          "Paper: Project 3D point (10,5,200) onto image with fx=600, fy=600, cx=320, cy=240",
        ],
      },
    },
  },
  {
    id: 14,
    week: "WEEK 14",
    dates: "Jul 25 – Jul 31",
    status: "upcoming",
    subjects: {
      cv: {
        topic: "Final Self-Assessment",
        tasks: [
          "Answer: What does camera calibration find?",
          "Answer: What are all the intrinsic parameters?",
          "Answer: What is the projection matrix?",
          "Answer: What is an epipolar line?",
          "Answer: What is disparity and how does it relate to depth?",
          "Answer: What is triangulation and when does it fail?",
          "Answer: What is the PnP problem?",
          "Answer: What is a joint hierarchy?",
        ],
      },
      cpp: {
        topic: "Final Self-Assessment",
        tasks: [
          "Answer: What is a pointer? When would you use one?",
          "Answer: What is a class? What is public vs private?",
          "Answer: What is the difference between passing by value vs by reference?",
          "Answer: What is a std::vector?",
          "Answer: What is a template function?",
          "Answer: What is a smart pointer?",
        ],
      },
      math: {
        topic: "Final Self-Assessment",
        tasks: [
          "Answer: What does the dot product tell you?",
          "Answer: What does the cross product give you?",
          "Answer: What does multiplying by a matrix do geometrically?",
          "Answer: What is a rotation matrix?",
          "Answer: What is gimbal lock?",
          "Answer: What does least squares solve?",
          "Write a one-page explanation of your entire mocap system (no jargon)",
        ],
      },
    },
  },
];

const subjectColors = {
  cv: { bg: "rgba(0,212,255,0.12)", border: "#00d4ff", text: "#00d4ff", label: "COMPUTER VISION" },
  cpp: { bg: "rgba(255,140,0,0.12)", border: "#ff8c00", text: "#ff8c00", label: "C++" },
  math: { bg: "rgba(160,100,255,0.12)", border: "#a064ff", text: "#a064ff", label: "MATH" },
};

const statusConfig = {
  complete: { label: "COMPLETE", color: "#00ff88" },
  active: { label: "IN PROGRESS", color: "#00d4ff" },
  upcoming: { label: "UPCOMING", color: "#555" },
};

// Debounce helper — waits `delay` ms after the last call before firing `fn`
function useDebouncedCallback(fn, delay) {
  const timer = useRef(null);
  return (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  };
}

// Persist checked state to Supabase (upserts a single row keyed by PROGRESS_ROW_ID).
// Falls back to localStorage so the UI still works if Supabase is unreachable.
function useSupabaseChecked(initial) {
  const [checked, setChecked] = useState(initial);
  const [synced, setSynced] = useState(false); // true once remote data is loaded

  // Sign in anonymously so RLS (auth.role() = 'authenticated') passes
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await supabase.auth.signInAnonymously();
      }
    })();
  }, []);

  // Load from Supabase on mount (after auth is ready)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) return;
        const { data, error } = await supabase
          .from("progress")
          .select("checked")
          .eq("id", PROGRESS_ROW_ID)
          .maybeSingle();

        if (!error && data?.checked) {
          setChecked(data.checked);
        } else {
          // No remote row yet — try localStorage as seed
          try {
            const local = localStorage.getItem("fp-checked");
            if (local) setChecked(JSON.parse(local));
          } catch {}
        }
        setSynced(true);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Debounced save — fires 800 ms after the last toggle
  const saveToSupabase = useDebouncedCallback(async (value) => {
    // Persist locally as fallback
    try { localStorage.setItem("fp-checked", JSON.stringify(value)); } catch {}
    // Upsert to Supabase
    await supabase.from("progress").upsert({
      id: PROGRESS_ROW_ID,
      checked: value,
      updated_at: new Date().toISOString(),
    });
  }, 800);

  function updateChecked(updater) {
    setChecked((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveToSupabase(next);
      return next;
    });
  }

  return [checked, updateChecked, synced];
}

function buildInitialChecked() {
  const checked = {};
  weeks.forEach((w) => {
    Object.entries(w.subjects).forEach(([subj, data]) => {
      if (!data) return;
      data.tasks.forEach((_, i) => {
        const key = `${w.id}-${subj}-${i}`;
        checked[key] = w.status === "complete";
      });
    });
  });
  return checked;
}

export default function App() {
  const [checked, setChecked, synced] = useSupabaseChecked(buildInitialChecked());
  const [expanded, setExpanded] = useState({ 3: true });

  function toggle(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleWeek(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function weekProgress(week) {
    let total = 0, done = 0;
    Object.entries(week.subjects).forEach(([subj, data]) => {
      if (!data) return;
      data.tasks.forEach((_, i) => {
        total++;
        if (checked[`${week.id}-${subj}-${i}`]) done++;
      });
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function overallProgress() {
    let total = 0, done = 0;
    weeks.forEach((w) => {
      const p = weekProgress(w);
      total += p.total;
      done += p.done;
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  const overall = overallProgress();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0c0f",
      color: "#e8e8e8",
      fontFamily: "'Courier New', monospace",
      padding: "32px 20px",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 6, color: "#555", marginBottom: 8 }}>
            MAY – JULY 2026
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#fff",
            margin: 0,
          }}>
            FOUNDATION PHASE
          </h1>
          <div style={{ fontSize: 12, color: "#444", marginTop: 6, letterSpacing: 2 }}>
            PROGRESS TRACKER
          </div>
          <div style={{ fontSize: 10, color: synced ? "#00ff8866" : "#55555588", marginTop: 8, letterSpacing: 2 }}>
            {synced ? "● SYNCED" : "○ CONNECTING…"}
          </div>
        </div>

        {/* Overall Progress */}
        <div style={{
          background: "#111116",
          border: "1px solid #222",
          borderRadius: 10,
          padding: "24px 28px",
          marginBottom: 32,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 4 }}>OVERALL PROGRESS</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>{overall.pct}<span style={{ fontSize: 16, color: "#444" }}>%</span></div>
            </div>
            <div style={{ textAlign: "right", fontSize: 13, color: "#444" }}>
              <span style={{ color: "#fff" }}>{overall.done}</span> / {overall.total} tasks
            </div>
          </div>
          <div style={{ background: "#1a1a22", borderRadius: 4, height: 8, overflow: "hidden" }}>
            <div style={{
              width: `${overall.pct}%`,
              height: "100%",
              background: "linear-gradient(90deg, #00d4ff, #00ff88)",
              borderRadius: 4,
              transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {[
              { label: "CV", color: "#00d4ff" },
              { label: "C++", color: "#ff8c00" },
              { label: "MATH", color: "#a064ff" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#555" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Weeks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {weeks.map((week) => {
            const { done, total, pct } = weekProgress(week);
            const isOpen = !!expanded[week.id];
            const sc = statusConfig[week.status];
            const hasSubjects = Object.values(week.subjects).some(Boolean);

            return (
              <div key={week.id} style={{
                background: "#111116",
                border: `1px solid ${isOpen ? "#2a2a35" : "#1a1a22"}`,
                borderRadius: 10,
                overflow: "hidden",
              }}>

                {/* Week Header */}
                <button
                  onClick={() => toggleWeek(week.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "18px 24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                  }}
                >
                  {/* Progress circle */}
                  <div style={{ position: "relative", width: 42, height: 42, flexShrink: 0 }}>
                    <svg width="42" height="42" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="21" cy="21" r="17" fill="none" stroke="#1e1e28" strokeWidth="3" />
                      <circle
                        cx="21" cy="21" r="17" fill="none"
                        stroke={pct === 100 ? "#00ff88" : "#00d4ff"}
                        strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 17}`}
                        strokeDashoffset={`${2 * Math.PI * 17 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.4s ease" }}
                      />
                    </svg>
                    <div style={{
                      position: "absolute", inset: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#888", fontWeight: 700,
                    }}>
                      {pct}%
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: "#fff" }}>
                        {week.week}
                      </span>
                      <span style={{
                        fontSize: 10, letterSpacing: 2, color: sc.color,
                        border: `1px solid ${sc.color}`,
                        padding: "2px 8px", borderRadius: 3,
                      }}>
                        {sc.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#444", letterSpacing: 1 }}>{week.dates}</div>
                  </div>

                  <div style={{ fontSize: 11, color: "#333", letterSpacing: 1 }}>
                    {done}/{total}
                  </div>

                  <div style={{
                    fontSize: 16, color: "#333",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}>▶</div>
                </button>

                {/* Week progress bar */}
                <div style={{ height: 2, background: "#1a1a22", margin: "0 24px" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    background: pct === 100 ? "#00ff88" : "linear-gradient(90deg, #00d4ff, #7b61ff)",
                    transition: "width 0.4s ease",
                  }} />
                </div>

                {/* Expanded Content */}
                {isOpen && hasSubjects && (
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {Object.entries(week.subjects).map(([subj, data]) => {
                      if (!data) return null;
                      const sc = subjectColors[subj];
                      const subjDone = data.tasks.filter((_, i) => checked[`${week.id}-${subj}-${i}`]).length;

                      return (
                        <div key={subj} style={{
                          background: sc.bg,
                          border: `1px solid ${sc.border}22`,
                          borderLeft: `3px solid ${sc.border}`,
                          borderRadius: 8,
                          padding: "16px 18px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 10, letterSpacing: 3, color: sc.text, marginBottom: 2 }}>
                                {sc.label}
                              </div>
                              <div style={{ fontSize: 13, color: "#ccc", fontWeight: 600 }}>{data.topic}</div>
                            </div>
                            <div style={{ fontSize: 11, color: "#555" }}>{subjDone}/{data.tasks.length}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {data.tasks.map((task, i) => {
                              const key = `${week.id}-${subj}-${i}`;
                              const isDone = !!checked[key];
                              return (
                                <label key={i} style={{
                                  display: "flex", alignItems: "flex-start", gap: 10,
                                  cursor: "pointer", opacity: isDone ? 0.45 : 1,
                                  transition: "opacity 0.2s",
                                }}>
                                  <div
                                    onClick={() => toggle(key)}
                                    style={{
                                      width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                                      border: `1px solid ${isDone ? sc.border : "#333"}`,
                                      background: isDone ? sc.border : "transparent",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      marginTop: 1, transition: "all 0.15s ease",
                                    }}
                                  >
                                    {isDone && <span style={{ fontSize: 10, color: "#000", fontWeight: 700 }}>✓</span>}
                                  </div>
                                  <span
                                    onClick={() => toggle(key)}
                                    style={{
                                      fontSize: 12, color: isDone ? "#555" : "#bbb",
                                      lineHeight: 1.5,
                                      textDecoration: isDone ? "line-through" : "none",
                                    }}
                                  >
                                    {task}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 40, fontSize: 11, color: "#2a2a35", letterSpacing: 3 }}>
          FOUNDATION PHASE · MAY–JULY 2026 · NITIN
        </div>
      </div>
    </div>
  );
}
