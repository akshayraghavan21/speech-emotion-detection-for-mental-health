# backend/main.py

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import librosa
import numpy as np
# import tensorflow as tf
import io
import joblib
import os
import logging
from keras.models import load_model

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002"],  # Frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to model and preprocessing objects
MODEL_PATH = os.path.join('model', 'speech_emotion_recognition_model.h5')
SCALER_PATH = os.path.join('model', 'scaler.save')
ENCODER_PATH = os.path.join('model', 'encoder.save')

# Check if all required files exist
for path in [MODEL_PATH, SCALER_PATH, ENCODER_PATH]:
    if not os.path.exists(path):
        logger.error(f"Required file not found: {path}")
        raise FileNotFoundError(f"Required file not found: {path}")

# Load the scaler
try:
    scaler = joblib.load(SCALER_PATH)
    logger.info("Scaler loaded successfully.")
except Exception as e:
    logger.error(f"Error loading scaler: {e}")
    raise e

# Load the encoder
try:
    encoder = joblib.load(ENCODER_PATH)
    logger.info("Encoder loaded successfully.")
except Exception as e:
    logger.error(f"Error loading encoder: {e}")
    raise e

# Load the trained model
try:
    print("Checking Here")
    model = load_model(MODEL_PATH)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise e

# Retrieve emotion labels from encoder
try:
    emotion_labels = encoder.categories_[0].tolist()
    logger.info(f"Emotion labels: {emotion_labels}")
except Exception as e:
    logger.error(f"Error retrieving emotion labels from encoder: {e}")
    raise e

def extract_features(data, sample_rate):
    """
    Extracts audio features from raw audio data.

    Parameters:
    - data (np.ndarray): Audio time series.
    - sample_rate (int): Sampling rate of the audio.

    Returns:
    - np.ndarray: Extracted feature vector.
    """
    try:
        # Zero Crossing Rate (ZCR)
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)

        # Chroma Short-Time Fourier Transform (Chroma_STFT)
        stft = np.abs(librosa.stft(data))
        chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)

        # Mel-Frequency Cepstral Coefficients (MFCC)
        mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate).T, axis=0)

        # Root Mean Square (RMS) Value
        rms = np.mean(librosa.feature.rms(y=data).T, axis=0)

        # Mel Spectrogram
        mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sample_rate).T, axis=0)

        # Concatenate all features into a single vector
        feature_vector = np.hstack((zcr, chroma_stft, mfcc, rms, mel))

        return feature_vector
    except Exception as e:
        logger.error(f"Error extracting features: {e}")
        raise e

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predicts the emotion from an uploaded audio file.

    Parameters:
    - file (UploadFile): The uploaded audio file.

    Returns:
    - dict: Predicted emotion and confidence score.
    """
    # Validate file type
    if not file.filename.endswith(('.wav', '.mp3', '.flac', '.m4a')):
        logger.warning(f"Unsupported file type: {file.filename}")
        raise HTTPException(status_code=400, detail="Invalid file type. Supported types: .wav, .mp3, .flac, .m4a")

    try:
        # Read file contents
        contents = await file.read()
        audio_data, sample_rate = librosa.load(io.BytesIO(contents), duration=2.5, offset=0.6)

        # Extract features
        features = extract_features(audio_data, sample_rate)

        # Scale features
        features_scaled = scaler.transform([features])

        # Reshape for Conv1D: (samples, features, 1)
        features_scaled = np.expand_dims(features_scaled, axis=2)

        # Predict emotion
        prediction = model.predict(features_scaled)

        # Decode prediction
        predicted_class = encoder.inverse_transform(prediction)[0][0]
        confidence = float(np.max(prediction))

        logger.info(f"Prediction: {predicted_class} with confidence {confidence:.2f}")

        return {"emotion": predicted_class, "confidence": confidence}
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")
