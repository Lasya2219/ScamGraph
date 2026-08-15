import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const NODE_COLORS = {
  ScamActor: '#ef4444',     // Red
  ScamCampaign: '#f59e0b',  // Amber
  Indicator: '#10b981',     // Emerald Green
  ScamType: '#a855f7',      // Purple
  Incident: '#f97316',      // Orange
  Organization: '#3b82f6'   // Blue
};

export default function GraphCanvas({ graphData, onNodeSelect }) {
  const containerRef = useRef();
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 700, height: 600 });

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 600
        });
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 60);
      }, 250);
    }
  }, [graphData]);

  return (
    <div ref={containerRef} className="w-full h-[620px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
      {/* Canvas Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Interactive Investigation Topology Canvas</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-800/80 text-[10px] text-slate-400">
        Click node to inspect | Scroll to zoom | Drag to re-position
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeId="id"
        nodeLabel={(node) => `${node.type}: ${node.name}`}
        nodeColor={(node) => NODE_COLORS[node.type] || '#94a3b8'}
        nodeRelSize={8}
        linkLabel={(link) => link.label}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={0.9}
        linkCurvature={0.12}
        linkColor={() => '#475569'}
        linkWidth={2}
        onNodeClick={(node) => onNodeSelect(node)}
        linkCanvasObjectMode={() => 'after'}
        linkCanvasObject={(link, ctx, globalScale) => {
          if (globalScale < 1.1) return;
          const MAX_FONT_SIZE = 10;
          const fontSize = Math.min(MAX_FONT_SIZE, 11 / globalScale);
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = '#94a3b8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const start = link.source;
          const end = link.target;
          if (typeof start !== 'object' || typeof end !== 'object') return;

          const textPos = {
            x: start.x + (end.x - start.x) * 0.5,
            y: start.y + (end.y - start.y) * 0.5
          };

          ctx.save();
          ctx.translate(textPos.x, textPos.y);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-18, -fontSize / 2 - 2, 36, fontSize + 4);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(link.label, 0, 0);
          ctx.restore();
        }}
        canvasObject={(node, ctx, globalScale) => {
          const label = node.name || node.id;
          const fontSize = Math.max(10 / globalScale, 3);
          ctx.font = `600 ${fontSize}px sans-serif`;
          
          // Outer Glow Circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
          ctx.fillStyle = NODE_COLORS[node.type] || '#94a3b8';
          ctx.shadowColor = NODE_COLORS[node.type] || '#94a3b8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0; // reset

          // Node Label Text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(label, node.x, node.y + 11);
        }}
      />
    </div>
  );
}