const onWheel = (e) => {
  const isTrackpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
  console.log(isTrackpad);
}
