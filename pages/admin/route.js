import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  AlertTriangle,
  Clock,
  RotateCcw,
  Navigation,
  Ban,
} from "lucide-react";
import _ from "lodash";
import { stopsData } from "../../data/stop.js";
import { routesData } from "../../data/route.js";

const DtcRouteOptimizer = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [stops, setStops] = useState([]);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const moveSpeed = 50;
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 1200 });
  const [routes, setRoutes] = useState([]);
  const [blockedRoutes, setBlockedRoutes] = useState(new Set());
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [trafficIntensity, setTrafficIntensity] = useState(1);
  const [activeTab, setActiveTab] = useState("map");
  const canvasRef = useRef(null);
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        setViewPosition((pos) => ({ ...pos, x: pos.x + moveSpeed }));
        break;
      case "ArrowRight":
        setViewPosition((pos) => ({ ...pos, x: pos.x - moveSpeed }));
        break;
      case "ArrowUp":
        setViewPosition((pos) => ({ ...pos, y: pos.y + moveSpeed }));
        break;
      case "ArrowDown":
        setViewPosition((pos) => ({ ...pos, y: pos.y - moveSpeed }));
        break;
      default:
        break;
    }
  };

  const loadData = async () => {
    try {
      setStops(stopsData);
      setRoutes(routesData);

      // Initial render
      drawRoutes();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add this useEffect for keyboard events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = width * 0.5; // Maintain 2:1 aspect ratio
        setCanvasSize({ width, height });
      }
    };

    // Initial size
    updateCanvasSize();

    // Add resize listener
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const normalizeCoordinates = (stops) => {
    const minLat = Math.min(...stops.map((s) => s.latitude));
    const maxLat = Math.max(...stops.map((s) => s.latitude));
    const minLong = Math.min(...stops.map((s) => s.longitude));
    const maxLong = Math.max(...stops.map((s) => s.longitude));

    // Add padding to prevent points at edges
    const padding = 40;
    const effectiveWidth = canvasSize.width - padding * 2;
    const effectiveHeight = canvasSize.height - padding * 2;

    return stops.map((stop) => ({
      ...stop,
      x: ((stop.longitude - minLong) / (maxLong - minLong)) * effectiveWidth,
      y: ((stop.latitude - minLat) / (maxLat - minLat)) * effectiveHeight,
    }));
  };

  //   const handleMouseHover = (e) => {
  //     if (isPanning) return;

  //     const canvas = canvasRef.current;
  //     if (!canvas) return;

  //     const rect = canvas.getBoundingClientRect();
  //     const x = e.clientX - rect.left - viewPosition.x;
  //     const y = e.clientY - rect.top - viewPosition.y;

  //     // Find hovered stop
  //     const normalizedStops = normalizeCoordinates(stops);
  //     const hoveredStop = normalizedStops.find((stop) => {
  //       const distance = Math.sqrt(
  //         Math.pow(stop.x - x, 2) + Math.pow(stop.y - y, 2)
  //       );
  //       return distance < 10;
  //     });

  //     // Change cursor if hovering over a stop
  //     canvas.style.cursor = hoveredStop ? "pointer" : "grab";
  //   };

  const drawRoutes = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("No canvas reference");
      return;
    }

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const ctx = canvas.getContext("2d");
    const normalizedStops = normalizeCoordinates(stops);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(viewPosition.x, viewPosition.y);

    // Draw route connections based on actual routes
    routes.forEach((route) => {
      const [startName, endName] = route.route.split(/->|→|=>/);
      const startStop = normalizedStops.find((s) =>
        s.name.includes(startName.trim())
      );
      const endStop = normalizedStops.find((s) =>
        s.name.includes(endName)
      );

      if (startStop && endStop) {
        const routeKey = `${startStop.id}-${endStop.id}`;
        ctx.beginPath();
        ctx.moveTo(startStop.x, startStop.y);
        ctx.lineTo(endStop.x, endStop.y);

        if (blockedRoutes.has(route.id)) {
          ctx.strokeStyle = "#ef4444";
          ctx.setLineDash([5, 5]);
        } else if (selectedRouteId && route.id === selectedRouteId) {
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
        } else {
          // Color based on route type
          switch (route.type) {
            case "Express":
              ctx.strokeStyle = "#3b82f6"; // blue
              break;
            case "Night":
              ctx.strokeStyle = "#6366f1"; // indigo
              break;
            case "Hospital":
              ctx.strokeStyle = "#ef4444"; // red
              break;
            case "University":
              ctx.strokeStyle = "#f59e0b"; // amber
              break;
            case "Metro_Feeder":
              ctx.strokeStyle = "#10b981"; // emerald
              break;
            default:
              ctx.strokeStyle = "#6b7280"; // gray
          }
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw stops
    normalizedStops.forEach((stop) => {
      ctx.beginPath();
      ctx.arc(stop.x, stop.y, 4, 0, Math.PI * 2);

      // Change stop color based on type
      switch (stop.id.substring(0, 3)) {
        case "HSP": // Hospitals
          ctx.fillStyle = "#ef4444";
          break;
        case "MTR": // Metro
          ctx.fillStyle = "#10b981";
          break;
        case "EDU": // Educational
          ctx.fillStyle = "#f59e0b";
          break;
        default:
          ctx.fillStyle = "#1e40af";
      }

      ctx.fill();

      // Draw stop names
      ctx.fillStyle = "#1e293b";
      ctx.font = "10px Arial";
      ctx.fillText(stop.name, stop.x + 6, stop.y - 6);
    });

    // Draw legend
    const legend = [
      { type: "Express", color: "#3b82f6" },
      { type: "Night", color: "#6366f1" },
      { type: "Hospital", color: "#ef4444" },
      { type: "University", color: "#f59e0b" },
      { type: "Metro Feeder", color: "#10b981" },
      { type: "Regular", color: "#6b7280" },
    ];

    const legendX = canvas.width - 150;
    const legendY = 20;

    legend.forEach((item, index) => {
      const y = legendY + index * 20;
      ctx.beginPath();
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.moveTo(legendX, y);
      ctx.lineTo(legendX + 30, y);
      ctx.stroke();

      ctx.fillStyle = "#1e293b";
      ctx.font = "12px Arial";
      ctx.fillText(item.type, legendX + 40, y + 4);
    });

    ctx.restore();
  };

  const distanceToLine = (point, lineStart, lineEnd) => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMapClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - viewPosition.x;
    const y = e.clientY - rect.top - viewPosition.y;

    // Check if clicked on a route line
    const normalizedStops = normalizeCoordinates(stops);

    for (const route of routes) {
      const [startName, endName] = route.route.split(/->|→|=>/);
      const startStop = normalizedStops.find((s) =>
        s.name.includes(startName.trim())
      );
      const endStop = normalizedStops.find((s) => s.name.includes(endName));

      if (startStop && endStop) {
        // Check if click is near the route line
        const distToLine = distanceToLine(
          { x, y },
          { x: startStop.x, y: startStop.y },
          { x: endStop.x, y: endStop.y }
        );

        if (distToLine < 10) {
          // 10 pixels threshold
          setSelectedRoute(route);
          setSelectedRouteId(route.id);
          findAlternativeRoutes(route);
          return;
        }
      }
    }
  };

  useEffect(() => {
    drawRoutes();
  }, [viewPosition, stops, blockedRoutes]);

  const [dragStart, setDragStart] = useState(null);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - viewPosition.x,
      y: e.clientY - rect.top - viewPosition.y,
    });
    setIsPanning(true);
  };
  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragStart.x;
    const y = e.clientY - rect.top - dragStart.y;

    setViewPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleRouteBlock = (routeId) => {
    setBlockedRoutes((prev) => {
      const newBlocked = new Set(prev);
      if (newBlocked.has(routeId)) {
        newBlocked.delete(routeId);
      } else {
        newBlocked.add(routeId);
      }
      return newBlocked;
    });
    findAlternativeRoutes(selectedRoute);
  };

  //   const handleMapClick = (e) => {
  //     const canvas = canvasRef.current;
  //     if (!canvas) return;

  //     // Get click coordinates relative to canvas
  //     const rect = canvas.getBoundingClientRect();
  //     const x = e.clientX - rect.left - viewPosition.x;
  //     const y = e.clientY - rect.top - viewPosition.y;

  //     // Find the clicked stop
  //     const normalizedStops = normalizeCoordinates(stops);
  //     const clickedStop = normalizedStops.find((stop) => {
  //       const distance = Math.sqrt(
  //         Math.pow(stop.x - x, 2) + Math.pow(stop.y - y, 2)
  //       );
  //       return distance < 10; // Click radius of 10 pixels
  //     });

  //     if (clickedStop) {
  //       // Find routes that include this stop
  //       const matchingRoutes = routes.filter((route) => {
  //         const [start, end] = route.route.split(/->|→|=>/);
  //         return (
  //           start.includes(clickedStop.name) || end.includes(clickedStop.name)
  //         );
  //       });

  //       if (matchingRoutes.length > 0) {
  //         setSelectedRoute(matchingRoutes[0]); // Select the first matching route
  //         // Highlight the route on the map
  //         drawRoutes(matchingRoutes[0].id);
  //         // Generate alternative routes
  //         findAlternativeRoutes(matchingRoutes[0]);
  //       }
  //     }
  //   };

  const findAlternativeRoutes = (selectedRoute) => {
    if (!selectedRoute) return;

    // GA Parameters
    const POPULATION_SIZE = 20;
    const GENERATIONS = 50;
    const MUTATION_RATE = 0.1;
    const ELITE_SIZE = 2;

    // ACO Parameters
    const PHEROMONE_DECAY = 0.1;
    const PHEROMONE_DEPOSIT = 1.0;

    class Route {
      constructor(path) {
        this.path = path;
        this.fitness = this.calculateFitness();
      }

      calculateFitness() {
        let totalDistance = 0;
        let trafficPenalty = 0;
        let blockedPenalty = 0;

        for (let i = 0; i < this.path.length - 1; i++) {
          const currentStop = this.path[i];
          const nextStop = this.path[i + 1];

          // Calculate direct distance
          const distance = Math.sqrt(
            Math.pow(currentStop.latitude - nextStop.latitude, 2) +
              Math.pow(currentStop.longitude - nextStop.longitude, 2)
          );

          // Add basic distance
          totalDistance += distance;

          // Add traffic intensity penalty
          trafficPenalty += distance * trafficIntensity;

          // Check if route segment is blocked
          const routeKey = `${currentStop.id}-${nextStop.id}`;
          if (blockedRoutes.has(routeKey)) {
            blockedPenalty += 1000; // Heavy penalty for blocked routes
          }
        }

        return totalDistance + trafficPenalty + blockedPenalty;
      }
    }

    // Parse the selected route to get start and end points
    const parseRoute = (routeName) => {
      const parts = routeName.split(/->|→|=>/);
      return {
        start: parts[0].trim(),
        end: parts[1].trim(),
      };
    };

    const routePoints = parseRoute(selectedRoute.route);

    // Find actual stops for start and end
    const startStop = stops.find((s) => s.name.includes(routePoints.start));
    const endStop = stops.find((s) => s.name.includes(routePoints.end));

    if (!startStop || !endStop) return;

    // Initialize pheromone matrix
    const pheromoneMatrix = {};
    stops.forEach((stop1) => {
      stops.forEach((stop2) => {
        if (stop1.id !== stop2.id) {
          pheromoneMatrix[`${stop1.id}-${stop2.id}`] = 1.0;
        }
      });
    });

    // Generate initial population
    const generateRandomRoute = () => {
      let current = startStop;
      const path = [current];
      const visited = new Set([current.id]);

      while (current.id !== endStop.id && path.length < stops.length) {
        // Get possible next stops
        const possibleNext = stops.filter(
          (stop) =>
            !visited.has(stop.id) &&
            Math.abs(stop.latitude - current.latitude) < 0.1 &&
            Math.abs(stop.longitude - current.longitude) < 0.1
        );

        if (possibleNext.length === 0) break;

        // Choose next stop based on pheromone levels and distance
        const nextStop = possibleNext.reduce(
          (best, next) => {
            const pheromone =
              pheromoneMatrix[`${current.id}-${next.id}`] || 1.0;
            const distance = Math.sqrt(
              Math.pow(next.latitude - endStop.latitude, 2) +
                Math.pow(next.longitude - endStop.longitude, 2)
            );
            const score = (pheromone + 0.1) / (distance + 0.1);
            return score > best.score ? { stop: next, score } : best;
          },
          { stop: possibleNext[0], score: -Infinity }
        ).stop;

        path.push(nextStop);
        visited.add(nextStop.id);
        current = nextStop;
      }

      return new Route(path);
    };

    let population = Array(POPULATION_SIZE)
      .fill()
      .map(() => generateRandomRoute());

    // Evolution process
    for (let gen = 0; gen < GENERATIONS; gen++) {
      // Sort by fitness
      population.sort((a, b) => a.fitness - b.fitness);

      // Keep elite routes
      const newPopulation = population.slice(0, ELITE_SIZE);

      // Update pheromone matrix
      population.forEach((route) => {
        for (let i = 0; i < route.path.length - 1; i++) {
          const current = route.path[i];
          const next = route.path[i + 1];
          const key = `${current.id}-${next.id}`;
          pheromoneMatrix[key] =
            (1 - PHEROMONE_DECAY) * (pheromoneMatrix[key] || 1.0) +
            PHEROMONE_DEPOSIT / route.fitness;
        }
      });

      // Generate new population
      while (newPopulation.length < POPULATION_SIZE) {
        const parent1 = population[Math.floor(Math.random() * ELITE_SIZE)];
        const parent2 = population[Math.floor(Math.random() * ELITE_SIZE)];

        // Crossover
        const crossoverPoint = Math.floor(Math.random() * parent1.path.length);
        const childPath = [...parent1.path.slice(0, crossoverPoint)];

        // Add remaining points from parent2 that aren't already in child
        for (const stop of parent2.path) {
          if (!childPath.find((s) => s.id === stop.id)) {
            childPath.push(stop);
          }
        }

        // Mutation
        if (Math.random() < MUTATION_RATE) {
          const idx1 = Math.floor(Math.random() * (childPath.length - 2)) + 1;
          const idx2 = Math.floor(Math.random() * (childPath.length - 2)) + 1;
          [childPath[idx1], childPath[idx2]] = [
            childPath[idx2],
            childPath[idx1],
          ];
        }

        newPopulation.push(new Route(childPath));
      }

      population = newPopulation;
    }

    // Get the best alternative routes
    const alternatives = population
      .sort((a, b) => a.fitness - b.fitness)
      .slice(0, 3)
      .map((route, index) => ({
        path: route.path.map((stop) => stop.name).join(" → "),
        duration: Math.round(route.fitness / 100), // Approximate duration in minutes
        distance: Math.round(route.fitness / 150), // Approximate distance in km
        blockedSegments: route.path
          .slice(0, -1)
          .filter((stop, i) =>
            blockedRoutes.has(`${stop.id}-${route.path[i + 1].id}`)
          ).length,
      }));

    setAlternativeRoutes(alternatives);
  };

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium ${
        active
          ? "bg-emerald-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="p-6">
          <h1 className="text-3xl font-bold">DTC Route Optimizer</h1>
          <p className="text-gray-500">
            Interactive route planning with real-time updates
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Live Updates
        </div>
      </div>

      {blockedRoutes.size > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-red-800 font-medium">Route Blockages</h3>
              <p className="text-red-700">
                {blockedRoutes.size} routes are currently blocked. Alternative
                routes have been calculated.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex space-x-4 border-b">
          <TabButton
            id="map"
            label="Route Map"
            active={activeTab === "map"}
            onClick={setActiveTab}
          />
          <TabButton
            id="controls"
            label="Traffic Controls"
            active={activeTab === "controls"}
            onClick={setActiveTab}
          />
          <TabButton
            id="alternatives"
            label="Alternative Routes"
            active={activeTab === "alternatives"}
            onClick={setActiveTab}
          />
        </div>

        {activeTab === "map" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-row top-10 mt-5 left-4 absolute z-30 gap-2">
              <div className="bg-white p-3 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-90">
                <div className="text-sm font-medium mb-3">Map Controls</div>
                <div className="grid grid-cols-3 gap-2">
                  <div />
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      setViewPosition((pos) => ({
                        ...pos,
                        y: pos.y + moveSpeed,
                      }))
                    }
                  >
                    ↑
                  </button>
                  <div />
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      setViewPosition((pos) => ({
                        ...pos,
                        x: pos.x + moveSpeed,
                      }))
                    }
                  >
                    ←
                  </button>
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => setViewPosition({ x: 0, y: 0 })}
                    title="Reset View"
                  >
                    ⌂
                  </button>
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      setViewPosition((pos) => ({
                        ...pos,
                        x: pos.x - moveSpeed,
                      }))
                    }
                  >
                    →
                  </button>
                  <div />
                  <button
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      setViewPosition((pos) => ({
                        ...pos,
                        y: pos.y - moveSpeed,
                      }))
                    }
                  >
                    ↓
                  </button>
                  <div />
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-white p-4 rounded-lg shadow">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full border rounded-lg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                tabIndex={0}
                onClick={handleMapClick}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg mb-4">Selected Route</h3>
              {selectedRoute ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                    <span className="font-medium">{selectedRoute.route}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Travel Time</div>
                        <div className="text-lg font-medium">
                          {Math.round(selectedRoute.time)} mins
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Distance</div>
                        <div className="text-lg font-medium">
                          {selectedRoute.distance} km
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    onClick={() => findAlternativeRoutes(selectedRoute)}
                  >
                    Find Alternatives
                  </button>
                </div>
              ) : (
                <div className="text-gray-500 flex items-center justify-center h-32">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    Select a route on the map
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "controls" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Traffic Intensity Controls</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Global Traffic Intensity
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={trafficIntensity}
                  onChange={(e) =>
                    setTrafficIntensity(parseFloat(e.target.value))
                  }
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Current: {trafficIntensity.toFixed(1)}x normal traffic
                </div>
              </div>

              <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                {routes.slice(0, 90).map((route, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border-b"
                  >
                    <span className="text-sm">{route.route}</span>
                    <button
                      className={`px-3 py-1 rounded text-sm ${
                        blockedRoutes.has(route.id)
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => handleRouteBlock(route.id)}
                    >
                      {blockedRoutes.has(route.id) ? (
                        <div className="flex items-center">
                          <Ban className="w-4 h-4 mr-1" />
                          Blocked
                        </div>
                      ) : (
                        "Block Route"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "alternatives" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4">Alternative Routes</h3>
            {alternativeRoutes.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {alternativeRoutes.map((route, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">Option {idx + 1}</div>
                    <div className="space-y-2 text-sm">
                      <div>Route: {route.path}</div>
                      <div>Duration: {route.duration} mins</div>
                      <div>Distance: {route.distance} km</div>
                    </div>
                    <button className="mt-3 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Select This Route
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No alternative routes currently available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DtcRouteOptimizer;
