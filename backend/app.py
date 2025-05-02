from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

app = Flask(__name__)
CORS(app)

gpt2_tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
gpt2_model = GPT2LMHeadModel.from_pretrained("gpt2")

def generate_sentence_up_to_fullstop(input_sentence, emotion="neutral", max_length=100):
    modified_input = f"<{emotion}> {input_sentence}"
    input_ids = gpt2_tokenizer.encode(modified_input, return_tensors="pt")
    output_ids = gpt2_model.generate(
        input_ids,
        max_length=max_length,
        num_return_sequences=1,
        temperature=0.8,
        top_k=50,
        eos_token_id=gpt2_tokenizer.eos_token_id,
        pad_token_id=gpt2_tokenizer.eos_token_id
    )
    generated_text = gpt2_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    generated_text = generated_text[len(modified_input):]
    full_stop_index = generated_text.find(".")
    if full_stop_index != -1:
        generated_text = generated_text[:full_stop_index + 1]
    return generated_text.strip()

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_sentence = data.get("input", "")
    emotion = data.get("sentiment", "").lower()
    generated_sentence = generate_sentence_up_to_fullstop(input_sentence, emotion=emotion)
    return jsonify({"generated_sentence": generated_sentence})

if __name__ == "__main__":
    app.run(debug=True)
