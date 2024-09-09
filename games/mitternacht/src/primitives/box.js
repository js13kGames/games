LowPolyFactory.simple('box', createBoxGeometry, {
    'width': 1,
    'height': 1,
    'depth': 1,
    'segments-width': 10,
    'segments-height': 10,
    'segments-depth': 10
});

function createBoxGeometry(data) {
  return new THREE.BoxGeometry(
    data.width, data.height, data.depth, data.segmentsWidth,
    data.segmentsHeight, data.segmentsDepth);
}
