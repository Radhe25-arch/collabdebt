import React, { useMemo } from 'react';

const ERA_LANES = [
  { label: 'FOUNDATIONS', years: [1950, 1969] },
  { label: 'STRUCTURE', years: [1970, 1989] },
  { label: 'WEB & SCRIPTS', years: [1990, 2004] },
  { label: 'MODERN POWER', years: [2005, 2019] },
  { label: 'NEXT ERA', years: [2020, 2030] },
];

export default function TechTree({ languages, onNodeClick }) {
  const nodeWidth = 140;
  const nodeHeight = 40;
  const lanePadding = 100;
  const verticalSpacing = 80;

  const nodes = useMemo(() => {
    return languages.map((lang, index) => {
      // Find lane index based on year
      const laneIndex = ERA_LANES.findIndex(
        lane => lang.year >= lane.years[0] && lang.year <= lane.years[1]
      );
      
      // Vertical position based on usage category index to group them
      // In a real force-layout this would be dynamic
      const usageOffset = (index % 10) * verticalSpacing;

      return {
        ...lang,
        x: laneIndex * (nodeWidth + lanePadding) + 50,
        y: usageOffset + 100,
      };
    });
  }, [languages]);

  const edges = useMemo(() => {
    const e = [];
    nodes.forEach(node => {
      if (node.parent && node.parent.length) {
        node.parent.forEach(pName => {
          const parent = nodes.find(n => n.name === pName || n.id === pName.toLowerCase());
          if (parent) {
            e.push({ from: parent, to: node });
          }
        });
      }
    });
    return e;
  }, [nodes]);

  return (
    <div className="w-full h-[600px] bg-black/40 border border-white/[0.06] rounded-[4px] relative overflow-auto custom-scrollbar">
      <svg 
        width={nodes.length * 60 + 500} 
        height={1000} 
        className="cursor-grab active:cursor-grabbing select-none"
      >
        {/* Draw Lanes Background */}
        {ERA_LANES.map((lane, i) => (
          <g key={lane.label}>
            <rect 
              x={i * (nodeWidth + lanePadding)} 
              y={0} 
              width={nodeWidth + lanePadding} 
              height="100%" 
              fill={i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'}
            />
            <text 
              x={i * (nodeWidth + lanePadding) + 20} 
              y={30} 
              className="font-mono text-[9px] font-black fill-[#333] uppercase tracking-[0.2em]"
            >
              {lane.label} // {lane.years[0]} - {lane.years[1]}
            </text>
          </g>
        ))}

        {/* Draw Edges */}
        {edges.map((edge, i) => {
          const midX = (edge.from.x + nodeWidth + edge.to.x) / 2;
          return (
            <path
              key={i}
              d={`M ${edge.from.x + nodeWidth} ${edge.from.y + nodeHeight/2} 
                 C ${midX} ${edge.from.y + nodeHeight/2}, 
                   ${midX} ${edge.to.y + nodeHeight/2}, 
                   ${edge.to.x} ${edge.to.y + nodeHeight/2}`}
              fill="none"
              stroke="rgba(59,130,246,0.15)"
              strokeWidth="1.2"
              className="hover:stroke-cyber transition-all duration-300"
            />
          );
        })}

        {/* Draw Nodes */}
        {nodes.map(node => (
          <g 
            key={node.id} 
            transform={`translate(${node.x}, ${node.y})`}
            onClick={() => onNodeClick(node)}
            className="cursor-pointer group"
          >
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx="2"
              className="fill-black stroke-white/[0.08] group-hover:stroke-cyber transition-all"
              style={{ filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.05))' }}
            />
            {/* Year Badge */}
            <rect width="32" height="14" x={nodeWidth - 36} y={-7} rx="1" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
            <text x={nodeWidth - 32} y={3} className="font-mono text-[7px] font-black fill-[#444]">{node.year}</text>
            
            <text
              x={12}
              y={24}
              className="font-mono text-[11px] font-black fill-white uppercase tracking-wider group-hover:fill-cyber transition-colors"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
