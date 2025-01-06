from flask import Flask, request, jsonify
import base64
import os
from mistralai import Mistral
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def encode_image(image_path):
    """Encode the image to base64."""
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode("utf-8")
    except FileNotFoundError:
        print(f"Error: The file {image_path} was not found.")
        return None
    except Exception as e:  # Added general exception handling
        print(f"Error: {e}")
        return None


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        # Retrieve text and image from the form data
        text = request.form.get("text")
        image = request.files.get("image")

        # If an image is uploaded, encode it in base64
        base64_image = None
        if image:
            image_path = os.path.join("uploads", image.filename)
            os.makedirs(
                os.path.dirname(image_path), exist_ok=True
            )  # Ensure directory exists
            image.save(image_path)
            base64_image = encode_image(image_path)

        # Retrieve the Mistral API key from the environment
        api_key = "odLEdf8R67rNpeEuLXKPokG3p0RyS6QX"

        # Initialize the Mistral client
        client = Mistral(api_key=api_key)

        # Prepare the chat messages
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": text if text else "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": (
                            f"data:image/jpeg;base64,{base64_image}"
                            if base64_image
                            else ""
                        ),
                    },
                ],
            }
        ]

        # Get the chat response from Mistral
        chat_response = client.chat.complete(
            model="pixtral-12b-2409", messages=messages
        )

        result = chat_response.choices[0].message.content

        return jsonify({"success": True, "result": result})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
