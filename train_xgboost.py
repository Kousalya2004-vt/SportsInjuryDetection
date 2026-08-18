import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier

# Load Dataset
data = pd.read_excel("sports_injury_dataset_5000.xlsx")

# Features
X = data[
    [
        "left_knee",
        "right_knee",
        "left_hip",
        "right_hip",
        "left_elbow",
        "right_elbow",
        "trunk_angle",
        "balance",
        "symmetry"
    ]
]

# Target
y = data["injury_risk"]

# Encode Labels
encoder = LabelEncoder()
y = encoder.fit_transform(y)

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    eval_metric="mlogloss"
)

model.fit(X_train, y_train)

# Predict
pred = model.predict(X_test)

accuracy = accuracy_score(y_test, pred)

print("Accuracy:", round(accuracy * 100, 2), "%")

# Save Model
joblib.dump(model, "injury_model.pkl")
joblib.dump(encoder, "label_encoder.pkl")

print("Model Saved Successfully!")