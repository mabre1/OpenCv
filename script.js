cv = import("./opencv");

const constraints = {
    video: true
  };
  
  let video = document.querySelector('video');
  
  navigator.mediaDevices.getUserMedia(constraints).
    then((stream) => {video.srcObject = stream});
  
  
  let video;
  let src;
  let dst;
  let gray;
  let cap;
  let faces;
  let classifier;
  let streaming;
  
  // load pre-trained classifiers
  classifier.load('haarcascade_frontalface_default.xml');
  
  const FPS = 30;
  function processVideo() {
      try {
          if (!streaming) {
              // clean and stop.
              src.delete();
              dst.delete();
              gray.delete();
              faces.delete();
              classifier.delete();
              return;
          }
          let begin = Date.now();
          // start processing.
          cap.read(src);
          src.copyTo(dst);
          cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
          // detect faces.
          classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
          // draw faces.
          for (let i = 0; i < faces.size(); ++i) {
              let face = faces.get(i);
              let point1 = new cv.Point(face.x, face.y);
              let point2 = new cv.Point(face.x + face.width, face.y + face.height);
              cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
          }
          cv.imshow('canvasOutput', dst);
          // schedule the next one.
          let delay = 1000/FPS - (Date.now() - begin);
          setTimeout(processVideo, delay);
      } catch (err) {
          utils.printError(err);
      }
  };
  
 export function onOpenCvReady() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    streaming = true;
    src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    gray = new cv.Mat();
    cap = new cv.VideoCapture(video);
    faces = new cv.RectVector();
    classifier = new cv.CascadeClassifier();
    // schedule the first one.
  setTimeout(processVideo, 0);
  }