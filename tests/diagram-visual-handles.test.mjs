import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramMoveWaypointV010, diagramEditableOrthogonalSegmentsV010,
  diagramDragOrthogonalSegmentV010, diagramManualEdgeGeometryV010
} from "../dist/diagram/edge-waypoints.js";

const start={x:0,y:0},end={x:120,y:100};
const override={pathKind:"orthogonal",waypoints:[{x:40,y:0},{x:40,y:100}]};
const original=JSON.stringify(override);

function routeFromWaypoints(points) {
  const all=[start,...points,end];
  for(let i=1;i<all.length;i++) {
    assert.ok(all[i-1].x===all[i].x || all[i-1].y===all[i].y,"all segments remain orthogonal");
  }
  return diagramManualEdgeGeometryV010(start,end,{...override,waypoints:points});
}

test("waypoint preview changes only the requested control and never mutates the original",()=>{
  const next=diagramMoveWaypointV010(override.waypoints,1,12,-18);
  assert.deepEqual(next,[{x:40,y:0},{x:52,y:82}]);
  assert.equal(JSON.stringify(override),original);
  assert.match(diagramManualEdgeGeometryV010(start,end,{...override,waypoints:next}).d,/52 82/);
});

test("visible manual orthogonal handles enumerate routed segments",()=>{
  const handles=diagramEditableOrthogonalSegmentsV010(start,end,override);
  assert.equal(handles.length,3);
  assert.deepEqual(handles.map(x=>x.axis),["y","x","y"]);
  assert.deepEqual(handles.map(x=>x.index),[0,1,2]);
  assert.deepEqual(handles.map(x=>[x.x,x.y]),[[20,0],[40,50],[80,100]]);
});

test("internal perpendicular segment drag keeps both endpoints attached and route valid",()=>{
  const points=diagramDragOrthogonalSegmentV010(start,end,override,1,18);
  assert.deepEqual(points,[{x:58,y:0},{x:58,y:100}]);
  assert.ok(routeFromWaypoints(points).d.includes("58"));
  assert.equal(JSON.stringify(override),original);
});

test("moving first and last route segments inserts elbows without moving fixed terminals",()=>{
  const first=diagramDragOrthogonalSegmentV010(start,end,override,0,20);
  const last=diagramDragOrthogonalSegmentV010(start,end,override,2,-15);
  assert.equal(routeFromWaypoints(first).kind,"orthogonal");
  assert.equal(routeFromWaypoints(last).kind,"orthogonal");
  assert.deepEqual(first[0],{x:0,y:20});
  assert.deepEqual(last.at(-1),{x:120,y:85});
  assert.equal(JSON.stringify(override),original);
});

test("drag rejects invalid indices, nonfinite coordinates, unsupported path kinds and out-of-bounds",()=>{
  assert.throws(()=>diagramMoveWaypointV010(override.waypoints,-1,1,1),/INVALID/);
  assert.throws(()=>diagramMoveWaypointV010(override.waypoints,0,Infinity,1),/INVALID/);
  assert.throws(()=>diagramMoveWaypointV010(override.waypoints,0,1e9,0),/INVALID/);
  assert.throws(()=>diagramDragOrthogonalSegmentV010(start,end,override,5,2),/INVALID/);
  assert.throws(()=>diagramDragOrthogonalSegmentV010(start,end,override,1,NaN),/INVALID/);
  assert.throws(()=>diagramDragOrthogonalSegmentV010(start,end,
    {pathKind:"curve",waypoints:override.waypoints},0,3),/INVALID/);
});
