from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber

app = Flask(__name__)
CORS(app)

skills = [
    "python",
    "sql",
    "machine learning",
    "data analysis",
    "communication",
    "leadership",
    "react",
    "javascript"
]


@app.route("/analyze", methods=["POST"])
def analyze():

    file = request.files["resume"]

    text = ""

    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    text = text.lower()

    found = []
    missing = []

    for skill in skills:
        if skill in text:
            found.append(skill)
        else:
            missing.append(skill)

    score = int((len(found) / len(skills)) * 100)

    suggestions = []
    for skill in missing:
        suggestions.append(f"Consider adding experience with {skill}")

    return jsonify({
        "found": found,
        "missing": missing,
        "score": score,
        "suggestions": suggestions
    })


if __name__ == "__main__":
    app.run(debug=True)