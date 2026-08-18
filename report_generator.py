from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os
import datetime

def create_progress_bar(score, max_width_inch=1.6):
    """Creates a horizontal progress bar matching Images 3 & 4."""
    fill_pct = max(0, min(100, score)) / 100.0
    filled_width = fill_pct * max_width_inch * inch
    unfilled_width = (1.0 - fill_pct) * max_width_inch * inch

    if filled_width <= 0:
        bar_table = Table([[""]], colWidths=[max_width_inch * inch])
        bar_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#e5e7eb')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        return bar_table

    if unfilled_width <= 0:
        bar_table = Table([[""]], colWidths=[max_width_inch * inch])
        bar_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#007965')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        return bar_table

    bar_table = Table([["", ""]], colWidths=[filled_width, unfilled_width])
    bar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#007965')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#e5e7eb')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    return bar_table


def generate_report(result):
    output_folder = "outputs"
    os.makedirs(output_folder, exist_ok=True)

    report_id = result.get("report_id") or result.get("id") or "8538f6b6-481c-4068-8002-7a6b8901e6d8"
    pdf_path = os.path.join(output_folder, f"kinetic_summary_{report_id}.pdf")

    # Document setup with custom margins
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom typography styles matching Kinetic design
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#111827')
    )

    meta_sub_style = ParagraphStyle(
        'MetaSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#6b7280')
    )

    h2_style = ParagraphStyle(
        'H2Title',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#111827'),
        spaceBefore=12,
        spaceAfter=8
    )

    h3_style = ParagraphStyle(
        'H3Title',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#111827'),
        spaceBefore=10,
        spaceAfter=6
    )

    table_label_style = ParagraphStyle(
        'TableLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#6b7280')
    )

    table_val_style = ParagraphStyle(
        'TableValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#111827')
    )

    big_score_style = ParagraphStyle(
        'BigScore',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=36,
        alignment=1,
        textColor=colors.HexColor('#111827')
    )

    score_label_style = ParagraphStyle(
        'ScoreLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        alignment=1,
        textColor=colors.HexColor('#6b7280')
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=11,
        alignment=1,
        textColor=colors.HexColor('#92400e')
    )

    metric_val_style = ParagraphStyle(
        'MetricVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        alignment=1,
        textColor=colors.HexColor('#111827')
    )

    rec_cat_style = ParagraphStyle(
        'RecCat',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#111827'),
        spaceBefore=6,
        spaceAfter=2
    )

    rec_body_style = ParagraphStyle(
        'RecBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#374151')
    )

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor('#9ca3af')
    )

    elements = []

    # Data extraction
    date_str = result.get("date") or datetime.datetime.utcnow().strftime("%b %d, %Y %H:%M UTC")
    requested_by = result.get("athlete_name") or result.get("requested_by") or "Kousalya Venkata Sai Lakshmi"
    source_file = result.get("source_file") or result.get("video_name") or f"{report_id}.mp4"
    activity_type = result.get("activity_type") or result.get("sport") or "Running"
    duration = result.get("duration") or "8.6s"
    frame_rate = result.get("frame_rate") or "25.0 fps"
    resolution = result.get("resolution") or "3840x2160"
    frames_analyzed = result.get("frames_analyzed") or 107
    detection_rate = result.get("detection_rate") or "100.0%"
    confidence = result.get("confidence") or "100.0%"
    if isinstance(confidence, (int, float)):
        confidence = f"{confidence:.1f}%"

    overall_score = result.get("percentage") if result.get("percentage") is not None else (result.get("overall_risk") or 44)
    risk_level = (result.get("risk") or result.get("risk_category") or "Moderate Risk").upper()
    if not risk_level.endswith("RISK"):
        risk_level = f"{risk_level} RISK"

    mov_quality = result.get("movement_quality") or 29
    biomech_eff = result.get("biomechanics") or 79
    fatigue_risk = result.get("fatigue_risk") or 95
    athlete_health = result.get("athlete_health") or 56

    # 1. HEADER (Kinetic — Movement Risk Report)
    header_html = "<b>Kinetic — Movement Risk Report</b>"
    elements.append(Paragraph(header_html, title_style))
    elements.append(Spacer(1, 4))
    
    sub_html = f"Analysis ID <font color='#4b5563'>{report_id}</font> &nbsp;&nbsp; Generated {date_str} &nbsp;&nbsp; Requested by <b>{requested_by}</b>"
    elements.append(Paragraph(sub_html, meta_sub_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e5e7eb'), spaceAfter=10))

    # 2. METADATA TABLE
    meta_table_data = [
        [
            Paragraph("SOURCE FILE", table_label_style), Paragraph(str(source_file), table_val_style),
            Paragraph("ACTIVITY TYPE", table_label_style), Paragraph(str(activity_type), table_val_style)
        ],
        [
            Paragraph("DURATION", table_label_style), Paragraph(str(duration), table_val_style),
            Paragraph("FRAME RATE", table_label_style), Paragraph(str(frame_rate), table_val_style)
        ],
        [
            Paragraph("RESOLUTION", table_label_style), Paragraph(str(resolution), table_val_style),
            Paragraph("FRAMES ANALYZED", table_label_style), Paragraph(str(frames_analyzed), table_val_style)
        ],
        [
            Paragraph("DETECTION RATE", table_label_style), Paragraph(str(detection_rate), table_val_style),
            Paragraph("AI CONFIDENCE", table_label_style), Paragraph(str(confidence), table_val_style)
        ]
    ]

    meta_table = Table(meta_table_data, colWidths=[1.3*inch, 2.3*inch, 1.4*inch, 2.0*inch])
    meta_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f3f4f6')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))

    elements.append(meta_table)
    elements.append(Spacer(1, 14))

    # 3. INJURY RISK ASSESSMENT SECTION
    elements.append(Paragraph("Injury Risk Assessment", h2_style))

    badge_bg = colors.HexColor('#fef3c7') if "MODERATE" in risk_level else (colors.HexColor('#fee2e2') if "HIGH" in risk_level else colors.HexColor('#d1fae5'))
    badge_fg = colors.HexColor('#92400e') if "MODERATE" in risk_level else (colors.HexColor('#991b1b') if "HIGH" in risk_level else colors.HexColor('#065f46'))
    badge_style.textColor = badge_fg

    badge_table = Table([[Paragraph(f"<b>{risk_level}</b>", badge_style)]], colWidths=[1.6*inch])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), badge_bg),
        ('ALIGN', (0,0), (0,0), 'CENTER'),
        ('VALIGN', (0,0), (0,0), 'MIDDLE'),
        ('TOPPADDING', (0,0), (0,0), 3),
        ('BOTTOMPADDING', (0,0), (0,0), 3),
    ]))

    left_score_cell = [
        Spacer(1, 4),
        Paragraph(f"{int(overall_score)}", big_score_style),
        Paragraph("OVERALL RISK SCORE / 100", score_label_style),
        Spacer(1, 8),
        badge_table,
        Spacer(1, 4)
    ]

    sub_metrics_table = Table([
        [Paragraph(f"<b>{mov_quality}</b>", metric_val_style), Paragraph(f"<b>{biomech_eff}</b>", metric_val_style), Paragraph(f"<b>{fatigue_risk}</b>", metric_val_style), Paragraph(f"<b>{athlete_health}</b>", metric_val_style)],
        [Paragraph("MOVEMENT QUALITY", score_label_style), Paragraph("BIOMECH. EFFICIENCY", score_label_style), Paragraph("FATIGUE RISK", score_label_style), Paragraph("ATHLETE HEALTH", score_label_style)]
    ], colWidths=[1.2*inch, 1.3*inch, 1.2*inch, 1.2*inch])

    sub_metrics_table.setStyle(TableStyle([
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f3f4f6')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))

    risk_box_table = Table([[left_score_cell, sub_metrics_table]], colWidths=[2.1*inch, 4.9*inch])
    risk_box_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e5e7eb')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (0,0), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))

    elements.append(risk_box_table)
    elements.append(Spacer(1, 14))

    # 4. SCORE COMPOSITION TABLE (Matching Images 3 & 4)
    elements.append(Paragraph("Score Composition", h3_style))

    comp_headers = [
        Paragraph("<b>COMPONENT</b>", table_label_style),
        Paragraph("<b>SCORE /100</b>", table_label_style),
        Paragraph("<b>WEIGHT</b>", table_label_style),
        Paragraph("<b>VISUAL DISTRIBUTION</b>", table_label_style)
    ]

    components_data = result.get("score_composition") or [
        ("Biomechanical deviations", 71, "35%"),
        ("Historical injury factors", 10, "20%"),
        ("Movement asymmetry", 10, "20%"),
        ("Training load", 40, "15%"),
        ("Fatigue", 95, "10%")
    ]

    comp_rows = [comp_headers]
    for name, sc, wt in components_data:
        comp_rows.append([
            Paragraph(name, table_val_style),
            Paragraph(str(sc), table_val_style),
            Paragraph(wt, table_val_style),
            create_progress_bar(sc, max_width_inch=1.8)
        ])

    comp_table = Table(comp_rows, colWidths=[2.3*inch, 1.0*inch, 1.0*inch, 2.7*inch])
    comp_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor('#e5e7eb')),
        ('LINEBELOW', (0,1), (-1,-1), 0.5, colors.HexColor('#f3f4f6')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(comp_table)
    elements.append(Spacer(1, 14))

    # 5. INJURY TYPE RISK TABLE (Matching Image 4)
    elements.append(Paragraph("Injury Type Risk", h3_style))

    injury_headers = [
        Paragraph("<b>INJURY TYPE</b>", table_label_style),
        Paragraph("<b>PROBABILITY</b>", table_label_style),
        Paragraph("<b>CONTRIBUTING FACTORS</b>", table_label_style)
    ]

    injury_types_data = result.get("injury_type_risks") or [
        ("ACL Injury Risk", "100%", "Knee bending inward when landing or jumping"),
        ("Ankle Sprain Risk", "61%", "Landing hard on heels without bending knees"),
        ("Hamstring Injury Risk", "43%", "Leg muscle fatigue detected during movement"),
        ("Shoulder Injury Risk", "9%", "Normal upper-body alignment with low stress")
    ]

    injury_rows = [injury_headers]
    for itype, prob, factors in injury_types_data:
        injury_rows.append([
            Paragraph(itype, table_val_style),
            Paragraph(prob, table_val_style),
            Paragraph(factors, table_val_style)
        ])

    injury_table = Table(injury_rows, colWidths=[2.0*inch, 1.1*inch, 3.9*inch])
    injury_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor('#e5e7eb')),
        ('LINEBELOW', (0,1), (-1,-1), 0.5, colors.HexColor('#f3f4f6')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(injury_table)

    # PAGE BREAK TO PAGE 2 FOR TOP RECOMMENDATIONS & FINDINGS
    elements.append(PageBreak())

    # PAGE 2: TOP RECOMMENDATIONS & FINDINGS (Simple English)
    elements.append(Paragraph("Top Recommendations", h2_style))
    elements.append(Spacer(1, 4))

    recs = result.get("recommendations_categorized") or {
        "Training modifications": [
            ("<font color='#d97706'><b>[MEDIUM]</b></font> <b>Practice hard drills early</b> — Do fast running, jumping, and cutting drills at the start of your training when your legs are fresh and full of energy.")
        ],
        "Recovery plan": [
            ("<font color='#dc2626'><b>[HIGH]</b></font> <b>Rest and drink plenty of water</b> — Your body showed fatigue near the end of your run. Get 7 to 9 hours of sleep every night, drink water, and lower heavy training by 10-15% this week.")
        ],
        "Strengthening": [
            ("<font color='#dc2626'><b>[HIGH]</b></font> <b>Strengthen hips and legs</b> — Your knees bend inward slightly when moving. Do side band walks, leg lifts, and glute bridges 3 times a week to keep your hips strong.")
        ],
        "Exercises": [
            ("<font color='#dc2626'><b>[HIGH]</b></font> <b>Practice soft one-leg landings</b> — Practice landing softly on one leg while keeping your knee straight over your toes to prevent your knee from twisting.")
        ]
    }

    if isinstance(recs, list):
        formatted_recs = {
            "Training modifications": [],
            "Recovery plan": [],
            "Strengthening": [],
            "Exercises": []
        }
        cats = list(formatted_recs.keys())
        for idx, item in enumerate(recs):
            c = cats[idx % len(cats)]
            formatted_recs[c].append(f"<font color='#dc2626'><b>[HIGH]</b></font> {item}")
        recs = formatted_recs

    for cat, items in recs.items():
        elements.append(Paragraph(cat, rec_cat_style))
        for item in items:
            elements.append(Paragraph(item, rec_body_style))
            elements.append(Spacer(1, 3))
        elements.append(Spacer(1, 4))

    # RISKY MOMENTS TIMELINE (Simple English)
    elements.append(Paragraph("Risky moments timeline", h3_style))
    timeline_items = result.get("risky_timeline") or [
        "• <b>5.24s</b> — <font color='#d97706'>[Medium]</font> <b>Wrist pressure when sliding:</b> Avoid landing flat on a stiff arm when sliding on wet ground.",
        "• <b>7.86s</b> — <font color='#2563eb'>[Low]</font> <b>Hard turn and weight shift:</b> Keep your knees bent and feet balanced when turning fast."
    ]
    for t_item in timeline_items:
        elements.append(Paragraph(t_item, rec_body_style))
        elements.append(Spacer(1, 3))

    elements.append(Spacer(1, 8))

    # TECHNIQUE FINDINGS (Simple English)
    elements.append(Paragraph("Technique findings", h3_style))
    findings = result.get("technique_findings") or [
        ("Deceleration & Balance", "Keep your arms spread wide when stopping fast to stay balanced and keep your body steady."),
        ("Sliding Mechanics", "Keep your arms close to your body when sliding to protect your shoulder and wrist from getting hurt.")
    ]
    for title, desc in findings:
        elements.append(Paragraph(f"<b>{title}</b>", rec_cat_style))
        elements.append(Paragraph(desc, rec_body_style))
        elements.append(Spacer(1, 4))

    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#e5e7eb'), spaceAfter=10))

    # Disclaimer Footer Box (Simple English)
    disclaimer_text = (
        "<b>AI model information:</b> Posture analysis using MediaPipe Pose. "
        "The injury risk score is calculated from body angles, balance, muscle fatigue, and training load. "
        "This is an automated safety guide and does not replace medical advice."
    )
    elements.append(Paragraph(disclaimer_text, disclaimer_style))

    doc.build(elements)
    return pdf_path

if __name__ == "__main__":
    sample = {
        "report_id": "8538f6b6-481c-4068-8002-7a6b8901e6d8",
        "date": "Aug 14, 2026 12:15 UTC",
        "requested_by": "Kousalya Venkata Sai Lakshmi",
        "source_file": "8538f6b6-481c-4068-8002-7a6b8901e6d8.mp4",
        "activity_type": "Running",
        "duration": "8.6s",
        "frame_rate": "25.0 fps",
        "resolution": "3840x2160",
        "frames_analyzed": 107,
        "detection_rate": "100.0%",
        "confidence": "100.0%",
        "percentage": 44,
        "risk": "Moderate Risk",
        "movement_quality": 29,
        "biomechanics": 79,
        "fatigue_risk": 95,
        "athlete_health": 56
    }
    path = generate_report(sample)
    print("Report Generated:", path)