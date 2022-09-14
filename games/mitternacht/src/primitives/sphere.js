LowPolyFactory.simple('sphere', createSphereGeometry, {
    'radius': 1,
    'segments-width': 10,
    'segments-height': 10,
    'phi-start': 0,
    'phi-length': 2*Math.PI,
    'theta-start': 0,
    'theta-length': 2*Math.PI   // TODO: insert a converter from radians to deg, where?
});

function createSphereGeometry(data) {
  return new THREE.SphereGeometry(
    data.radius, data.segmentsWidth, data.segmentsHeight, data.phiStart,
    data.phiLength, data.thetaStart, data.thetaLength);
}
