LowPolyFactory.simple('cylinder', createCylinderGeometry, {
    'radius-top': 1,
    'radius-bottom': 1,
    'height': 1,
    'segments-radial': 10,
    'segments-height': 10,
    'open-ended': false,
    'theta-start': 0,
    'theta-length': 2*Math.PI   // TODO: insert a converter from radians to deg, where?
})

function createCylinderGeometry(data) {
  return new THREE.CylinderGeometry(
    data.radiusTop, data.radiusBottom, data.height, data.segmentsRadial,
    data.segmentsHeight, data.openEnded, data.thetaStart, data.thetaLength);
}
