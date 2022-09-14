LowPolyFactory.simple('plane', createPlaneGeometry, {
    'width': 1,
    'height': 1,
    'segments-width': 10,
    'segments-height': 10
})

function createPlaneGeometry(data) {
  return new THREE.PlaneGeometry(
    data.width, data.height, data.segmentsWidth, data.segmentsHeight);
}
