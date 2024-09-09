LowPolyFactory.simple('circle', createCircleGeometry, {
    'radius': 1,
    'segments': 10,
    'theta-start': 0,
    'theta-length': 2*Math.PI   // TODO: insert a converter from radians to deg, where?
})

function createCircleGeometry(data) {
  return new THREE.CircleGeometry(
    data.radius, data.segments, data.thetaStart, data.thetaLength);
}
