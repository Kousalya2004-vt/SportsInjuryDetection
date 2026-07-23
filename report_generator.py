from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.units import inch
import os


def generate_report(result):

    output_folder = "outputs"

    os.makedirs(output_folder, exist_ok=True)

    pdf_path = os.path.join(
        output_folder,
        "Sports_Injury_Report.pdf"
    )

    doc = SimpleDocTemplate(pdf_path)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "<b>Sports Injury Detection Report</b>",
            styles["Title"]
        )
    )

    elements.append(Spacer(1, 0.3 * inch))

    elements.append(
        Paragraph(
            f"<b>Risk Level:</b> {result['risk']}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Injury Probability:</b> {result['percentage']} %",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Affected Body Part:</b> {result['bodyPart']}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Biomechanics Score:</b> {result['biomechanics']}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Stability Score:</b> {result['stability']}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"<b>Balance Score:</b> {result['balance']}",
            styles["BodyText"]
        )
    )

    elements.append(Spacer(1, 0.3 * inch))

    elements.append(
        Paragraph(
            "<b>Recommendations</b>",
            styles["Heading2"]
        )
    )

    for item in result["recommendation"]:
        elements.append(
            Paragraph(
                "• " + item,
                styles["BodyText"]
            )
        )

    elements.append(Spacer(1, 0.3 * inch))

    elements.append(
        Paragraph(
            "<b>Timeline</b>",
            styles["Heading2"]
        )
    )

    for t in result["timeline"]:
        elements.append(
            Paragraph(
                f"{t['time']} : {t['level']}",
                styles["BodyText"]
            )
        )

    doc.build(elements)

    return pdf_path


if __name__ == "__main__":

    sample = {

        "risk": "Medium",

        "percentage": 65.4,

        "bodyPart": "Hip",

        "recommendation": [
            "Reduce training intensity",
            "Warm up before exercise",
            "Improve flexibility"
        ],

        "biomechanics": 172,

        "stability": 92,

        "balance": 90,

        "timeline": [
            {"time": "0s", "level": "Medium"},
            {"time": "5s", "level": "Medium"},
            {"time": "10s", "level": "Medium"}
        ]
    }

    path = generate_report(sample)

    print("Report Saved:", path)