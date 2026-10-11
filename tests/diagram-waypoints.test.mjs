import test from "node:test";
import assert from "node:assert/strict";
import {
  diagramEdgeAnchorPointV010, diagramManualEdgeGeometryV010,
  diagramTranslateWaypointsV010, validDiagramEdgePathOverrideV010
} from "../dist/diagram/edge-waypoints.js";
import { validateDiagramEditorStateV010 } from "../dist/diagram/surface.js";

const a={x:-100,y:0},b={x:220,y:120};
const overrides=[{pathKind:"orthogonal",waypoints:[{x:20,y:20},{x:90,y:-40}]},
  {pathKind:"rounded-orthogonal",waypoints:[{x:20,y:20},{x:90,y:-40}]},
  {pathKind:"curve",waypoints:[{x:20,y:20},{x:90,y:-40}]}];
test("manual routes contain all explicit control points and use distinct paths", () => {
  const paths=overrides.map(o=>diagramManualEdgeGeometryV010(a,b,o));
  assert.equal(new Set(paths.map(p=>p.d)).size,3);
  assert.ok(paths[0].d.includes("20 20"));
  assert.match(paths[1].d,/ Q /);
  assert.match(paths[2].d,/ C /);
  assert.ok(paths.every(p=>Number.isFinite(p.label.x)&&Number.isFinite(p.label.y)));
});
test("anchor points stick to a declared node edge", () => {
  const n={x:10,y:20,width:100,height:60};
  assert.deepEqual(diagramEdgeAnchorPointV010(n,"left"),{x:10,y:50});
  assert.deepEqual(diagramEdgeAnchorPointV010(n,"right"),{x:110,y:50});
  assert.deepEqual(diagramEdgeAnchorPointV010(n,"top"),{x:60,y:20});
  assert.deepEqual(diagramEdgeAnchorPointV010(n,"bottom"),{x:60,y:80});
  assert.equal(diagramEdgeAnchorPointV010(n,"auto"),undefined);
});
test("manual path contracts reject invalid input and silent straight point loss", () => {
  assert.equal(validDiagramEdgePathOverrideV010({pathKind:"straight",waypoints:[{x:1,y:2}]}),false);
  assert.equal(validDiagramEdgePathOverrideV010({pathKind:"curve",waypoints:[{x:NaN,y:2}]}),false);
  assert.equal(validDiagramEdgePathOverrideV010({pathKind:"orthogonal",waypoints:Array(25).fill({x:1,y:2})}),false);
  assert.equal(validDiagramEdgePathOverrideV010({pathKind:"orthogonal",sourceAnchor:"front"}),false);
  assert.throws(()=>diagramManualEdgeGeometryV010(a,b,{pathKind:"straight",waypoints:[{x:10,y:10}]}),/INVALID/);
  assert.throws(()=>diagramTranslateWaypointsV010([{x:1,y:2}],Infinity,0),/INVALID/);
});
test("manual controls translate by one group delta, without in-place mutation", () => {
  const p=[{x:-30,y:20},{x:70,y:40}];
  assert.deepEqual(diagramTranslateWaypointsV010(p,15,-8),[{x:-15,y:12},{x:85,y:32}]);
  assert.deepEqual(p,[{x:-30,y:20},{x:70,y:40}]);
});
test("surface validates view-only control points and rejects invalid anchors", () => {
  const base={contractVersion:"0.1.0",resourceId:"diagram:test",revision:1,
    nodes:[{id:"a",kind:"object",label:"A",shape:"rounded-rectangle",x:0,y:0,width:90,height:60},
      {id:"b",kind:"object",label:"B",shape:"rounded-rectangle",x:200,y:0,width:90,height:60}],
    edges:[{id:"e1",source:"a",target:"b",kind:"relation",pathKind:"rounded-orthogonal",
      sourceAnchor:"right",targetAnchor:"left",waypoints:[{x:130,y:100}]}]};
  assert.equal(validateDiagramEditorStateV010(base).ok,true);
  assert.equal(validateDiagramEditorStateV010({...base,edges:[{...base.edges[0],waypoints:[{x:Infinity,y:5}]}]}).ok,false);
  assert.equal(validateDiagramEditorStateV010({...base,edges:[{...base.edges[0],targetAnchor:"inside"}]}).ok,false);
});
