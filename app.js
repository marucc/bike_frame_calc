var defaultData = {
  frameSize: '540',
  slopeSize: '40',
  horizontalTopTube: '540',
  seatAngle: '74.5',
  headAngle: '72',
  bbDrop: '70',
  forkOffset: '45',
  headTubeUp: '20',
  headTubeDown: '20',
  headParts: '14',
  headCrown: '15',
  forkSize: '350',
};

var data = Object.assign({
  headTube: null,
  frontCenter: null,
  downAngle: null,
  headTopAngle: null,
  topSeatAngle: null,

  errors: {
  },
}, defaultData, {});
var scale = 0.5;
var drowLine = function (context, lineType, startX, startY, relativeEndX, relativeEndY) {
  context.beginPath();
  switch (lineType) {
    case 'guide':
      context.lineWidth = 1;
      context.strokeStyle = 'blue';
      break;
    case 'frame':
      context.lineWidth = 3;
      context.strokeStyle = 'black';
      break;
  }
  context.moveTo(startX * scale - 0.5, startY * scale - 0.5);
  context.lineTo((startX + relativeEndX) * scale - 0.5, (startY + relativeEndY) * scale - 0.5);
  context.closePath();
  context.stroke();
};
var drowArc = function (context, lineType, centerX, centerY, radius, startAngle, endAngle) {
  context.beginPath();
  switch (lineType) {
    case 'guide':
      context.lineWidth = 1;
      context.strokeStyle = 'blue';
      break;
    case 'frame':
      context.lineWidth = 3;
      context.strokeStyle = 'black';
      break;
  }
  context.arc(centerX * scale, centerY * scale, radius * scale, startAngle * (Math.PI / 180), endAngle * (Math.PI / 180));
  context.stroke();
};
var drow = _.debounce(function () {
  var context = this.canvas.getContext('2d');
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  app.headTube = null;
  app.frontCenter = null;
  app.downAngle = null;
  app.headTopAngle = null;
  app.topSeatAngle = null;
  var {
    frameSize,
    slopeSize,
    horizontalTopTube,
    seatAngle,
    headAngle,
    bbDrop,
    forkOffset,
    headTubeUp,
    headTubeDown,
    headParts,
    headCrown,
    forkSize,
  } = app;

  app.errors = {};
  app.errors.frameSize = (frameSize === '' || frameSize < 200 || 700 < frameSize);
  app.errors.slopeSize = (slopeSize === '' || slopeSize < 0 || (frameSize && frameSize / 2 < slopeSize));
  app.errors.horizontalTopTube = (horizontalTopTube === '' || horizontalTopTube < 200 || 700 < horizontalTopTube);
  app.errors.seatAngle = (seatAngle === '' || seatAngle < 60 || 85 < seatAngle);
  app.errors.headAngle = (headAngle === '' || headAngle < 60 || 85 < headAngle);
  app.errors.bbDrop = (bbDrop === '' || bbDrop < 0 || 100 < bbDrop);
  app.errors.forkOffset = (forkOffset === '' || forkOffset < 0 || 100 < forkOffset);
  app.errors.headTubeUp = (headTubeUp === '' || headTubeUp < 0 || 40 < headTubeUp);
  app.errors.headTubeDown = (headTubeDown === '' || headTubeDown < 0 || 40 < headTubeDown);
  app.errors.headParts = (headParts === '' || headParts < 0 || 40 < headParts);
  app.errors.headCrown = (headCrown === '' || headCrown < 0 || 40 < headCrown);
  app.errors.forkSize = (forkSize === '' || forkSize < 15 || 400 < forkSize);
  if (_.values(app.errors).filter(function (v) { return v }).length) {
    return;
  }

  frameSize = _.toNumber(frameSize);
  slopeSize = _.toNumber(slopeSize);
  horizontalTopTube = _.toNumber(horizontalTopTube);
  seatAngle = _.toNumber(seatAngle);
  headAngle = _.toNumber(headAngle);
  bbDrop = _.toNumber(bbDrop);
  forkOffset = _.toNumber(forkOffset);
  headTubeUp = _.toNumber(headTubeUp);
  headTubeDown = _.toNumber(headTubeDown);
  headParts = _.toNumber(headParts);
  headCrown = _.toNumber(headCrown);
  forkSize = _.toNumber(forkSize);
  var seatRadian = seatAngle * (Math.PI / 180);
  var headRadian = headAngle * (Math.PI / 180);
  var isSloping = slopeSize > 0;

  var headTube = null;
  var frontCenter = null;
  var downAngle = null;
  var headTopAngle = null;
  var topSeatAngle = null;

  var bbX = 800;
  var bbY = bbDrop < 100 ? 900 : 900 - bbDrop;

  // seatTube
  var seatTubeOffsetX = frameSize * Math.cos(seatRadian);
  var seatTubeHeight = frameSize * Math.sin(seatRadian);
  if (seatTubeOffsetX > 200) {
    bbX = 900 - seatTubeOffsetX;
  }
  var seatTubeRealOffsetX = seatTubeOffsetX;
  var seatTubeRealHeight = seatTubeHeight;
  if (isSloping) {
    seatTubeRealOffsetX = (frameSize - slopeSize) * Math.cos(seatRadian);
    seatTubeRealHeight = (frameSize - slopeSize) * Math.sin(seatRadian);
  }
  var seatGide = 80;
  drowLine(context, 'guide', bbX, bbY, (frameSize + seatGide) * Math.cos(seatRadian), (frameSize + seatGide) * Math.sin(seatRadian) * -1);
  drowLine(context, 'frame', bbX, bbY, seatTubeRealOffsetX, seatTubeRealHeight * -1);

  // BB Drop base line
  drowLine(context, 'guide', 0, bbY - bbDrop, 1000, 0);

  // Top Tube
  var headTopTubeX = bbX + seatTubeOffsetX - horizontalTopTube;
  var headTopTubeY = bbY - seatTubeHeight;
  var topDownTubeX = bbX + seatTubeRealOffsetX;
  var topDownTubeY = bbY - seatTubeRealHeight;
  if (isSloping) {
    drowLine(context, 'guide', headTopTubeX, headTopTubeY, horizontalTopTube, 0);
  }
  drowLine(context, 'frame', headTopTubeX, headTopTubeY, topDownTubeX - headTopTubeX, topDownTubeY - headTopTubeY);

  // Head Tube
  var headGideHeight = bbDrop * 2;
  var headGideWidth = headGideHeight / Math.tan(headRadian);
  drowLine(context, 'guide', headTopTubeX + headGideWidth, headTopTubeY - headGideHeight, (seatTubeHeight - bbDrop + headGideHeight * 2) / Math.tan(headRadian) * -1, seatTubeHeight - bbDrop + headGideHeight * 2);

  var forkOffsetRadian = (90 - headAngle) * (Math.PI / 180);
  var frontX = headTopTubeX - (seatTubeHeight - bbDrop) / Math.tan(headRadian) - (forkOffset / Math.cos(forkOffsetRadian));
  var frontY = bbY - bbDrop;
  drowLine(context, 'guide', frontX, frontY, forkOffset * Math.cos(forkOffsetRadian), forkOffset * Math.sin(forkOffsetRadian));

  var forkRadian = (90 - (Math.asin(forkOffset / forkSize) * (180 / Math.PI)) - (90 - headAngle)) * (Math.PI / 180);
  var forkHeadX = frontX + forkSize * Math.cos(forkRadian);
  var forkHeadY = frontY - forkSize * Math.sin(forkRadian);
  drowLine(context, 'guide', frontX, frontY, forkHeadX - frontX, forkHeadY - frontY);

  var headPartsGuide = 6;
  var headPartsHeight = headPartsGuide * Math.cos(headRadian);
  var headPartsWidth = headPartsGuide * Math.sin(headRadian);
  drowLine(context, 'guide', forkHeadX - headPartsWidth, forkHeadY - headPartsHeight, headPartsWidth * 2, headPartsHeight * 2);

  var headCrownX = forkHeadX + headCrown * Math.cos(headRadian);
  var headCrownY = forkHeadY - headCrown * Math.sin(headRadian);
  drowLine(context, 'guide', headCrownX - headPartsWidth, headCrownY - headPartsHeight, headPartsWidth * 2, headPartsHeight * 2);

  var headBottomX = forkHeadX + (headCrown + headParts) * Math.cos(headRadian);
  var headBottomY = forkHeadY - (headCrown + headParts) * Math.sin(headRadian);

  headTube = (headTopTubeX - headBottomX) / Math.cos(headRadian) + headTubeUp;
  if (headTube < headTubeUp + headTubeDown) {
    app.errors.headTube = true;
    return;
  }
  drowLine(context, 'frame', headBottomX, headBottomY, headTube * Math.cos(headRadian), headTube * Math.sin(headRadian) * -1);

  // Down Tube
  var headDownTubeX = headBottomX + headTubeDown * Math.cos(headRadian);
  var headDownTubeY = headBottomY - headTubeDown * Math.sin(headRadian);
  drowLine(context, 'frame', headDownTubeX, headDownTubeY, bbX - headDownTubeX, bbY - headDownTubeY);

  // Front - Center
  frontCenter = Math.sqrt(Math.pow(bbX - frontX, 2) + Math.pow(bbY - frontY, 2));
  drowLine(context, 'guide', frontX, frontY - 20, 0, 40);
  drowLine(context, 'guide', bbX - 40, bbY, 80, 0);
  drowLine(context, 'guide', bbX, bbY - 40, 0, 80);
  drowLine(context, 'guide', frontX, frontY, bbX - frontX, bbY - frontY);

  // Top Tube Angle
  var topTubeAngle = isSloping ? Math.atan2(seatTubeHeight - seatTubeRealHeight, horizontalTopTube - (seatTubeOffsetX - seatTubeRealOffsetX)) * (180 / Math.PI) : 0;

  // Down Tube Angle
  downAngle = Math.atan2(bbX - headDownTubeX, bbY - headDownTubeY) * (180 / Math.PI) + (90 - headAngle);
  drowArc(context, 'guide', headDownTubeX, headDownTubeY, 60, (180 - headAngle) - downAngle, 180 - headAngle);

  // Head Tube - Top Tube Angle
  headTopAngle = headAngle + topTubeAngle;
  drowArc(context, 'guide', headTopTubeX, headTopTubeY, 60, 360 - headAngle, topTubeAngle);

  // Top Tube - Seat Tube Angle
  topSeatAngle = seatAngle + topTubeAngle;
  drowArc(context, 'guide', topDownTubeX, topDownTubeY, 60, 180 - seatAngle, 180 - seatAngle + topSeatAngle);


  app.headTube = headTube !== null ? _.round(headTube, 1) : null;
  app.frontCenter = frontCenter !== null ? _.round(frontCenter, 1) : null;
  app.downAngle = downAngle !== null ? _.round(downAngle, 1) : null;
  app.headTopAngle = headTopAngle !== null ? _.round(headTopAngle, 1) : null;
  app.topSeatAngle = topSeatAngle !== null ? _.round(topSeatAngle, 1) : null;
}, 500);
var changed = function (newValue, oldValue) {
  if (newValue != oldValue) {
    drow();
  }
}
var app = new Vue({
  el: '#app',
  data: data,
  watch: {
    frameSize: changed,
    slopeSize: changed,
    horizontalTopTube: changed,
    seatAngle: changed,
    headAngle: changed,
    bbDrop: changed,
    forkOffset: changed,
    headTubeUp: changed,
    headTubeDown: changed,
    headParts: changed,
    headCrown: changed,
    forkSize: changed,
  },
  created: function () {
    drow();
  },
  methods: {
    reset: function () {
      _.forEach(_.keys(defaultData), function (key) {
        this.data[key] = defaultData[key];
      });
      if (navigator.onLine && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration()
          .then(registration => {
            registration.unregister();
          })
        location.reload(true)
      } else {
        drow();
      }
    },
  },
});
