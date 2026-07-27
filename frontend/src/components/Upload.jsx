import React, { useState } from "react";

function Upload() {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [message, setMessage] = useState("");
    const [risk, setRisk] = useState("");
    const [percentage, setPercentage] = useState("");
    const [bodyPart, setBodyPart] = useState("");
    const [reason, setReason] = useState("");
    const [recommendations, setRecommendations] = useState([]);

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const uploadVideo = async () => {

        if (!file) {
            alert("Please select a video.");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/upload_video",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            console.log("Backend Response:", data);

            if (response.ok) {

                setMessage(data.message || "");

                setRisk(data.risk || "");

                setReason(data.reason || "");

                setPercentage(data.percentage || "");

                setBodyPart(data.bodyPart || "");

                setRecommendations(data.recommendation || []);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

            alert("Server Error");

        }

    };

    return (

        <div
            style={{
                textAlign: "center",
                marginTop: "30px"
            }}
        >

            <h1>Sports Injury Detection</h1>

            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
            />

            <br /><br />

            {preview && (

                <video
                    width="700"
                    controls
                    src={preview}
                />

            )}

            <br /><br />

            <button
                onClick={uploadVideo}
                style={{
                    padding: "10px 30px",
                    fontSize: "18px",
                    cursor: "pointer"
                }}
            >
                Upload
            </button>

            <br /><br />

            <h2>{message}</h2>

            {risk && (

                <div
                    style={{
                        width: "70%",
                        margin: "auto",
                        background: "#f5f5f5",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "left"
                    }}
                >

                    <h2>AI Injury Detection Result</h2>

                    <p>
                        <b>Risk Level:</b> {risk}
                    </p>

                    <p>
                        <b>Confidence:</b> {percentage}%
                    </p>

                    <p>
                        <b>Detected Body Part:</b> {bodyPart}
                    </p>

                    <p>
                        <b>Reason:</b> {reason}
                    </p>

                    <h3>Recommendations</h3>

                    <ul>

                        {recommendations.length > 0 ? (

                            recommendations.map((item, index) => (

                                <li key={index}>{item}</li>

                            ))

                        ) : (

                            <li>No recommendations available.</li>

                        )}

                    </ul>

                </div>

            )}

        </div>

    );

}

export default Upload;