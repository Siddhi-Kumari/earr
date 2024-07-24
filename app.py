from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
from src.face_mesh_model import FaceMeshModel

app = Flask(__name__)
face_mesh_model = FaceMeshModel()


def gen_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break

        ear_coordinates = face_mesh_model.get_ear_coordinates(frame)

        # Draw landmarks on the frame
        if ear_coordinates:
            for coord in ear_coordinates.values():
                x, y = coord
                cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)

        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/ear_coordinates')
def ear_coordinates():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        return jsonify({"error": "Failed to capture image"}), 500

    coordinates = face_mesh_model.get_ear_coordinates(frame)
    return jsonify(coordinates)



if __name__ == '__main__':
    app.run(debug=True)
