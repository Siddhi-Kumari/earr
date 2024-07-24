import cv2
import mediapipe as mp

class FaceMeshModel:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh()

    def get_landmarks(self, image):
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_image)
        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark
            ear_landmarks = {
                "left_ear": landmarks[234],
                "right_ear": landmarks[454]
            }
            return ear_landmarks
        return {}

    def get_ear_coordinates(self, image):
        landmarks = self.get_landmarks(image)
        if landmarks:
            height, width, _ = image.shape
            ear_coordinates = {
                "left_ear": (int(landmarks["left_ear"].x * width), int(landmarks["left_ear"].y * height)),
                "right_ear": (int(landmarks["right_ear"].x * width), int(landmarks["right_ear"].y * height))
            }
            return ear_coordinates
        return {}
