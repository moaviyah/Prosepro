import os
from flask import Flask, request, jsonify
from PIL import Image
import pytesseract as tess
import io
import logging

# Hugging Face Transformers
from transformers import pipeline

# Gensim
# from gensim.summarization import summarize as gensim_summarize

# Sumy
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer

# spaCy
import spacy
import spacy_transformers

# NLTK
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from string import punctuation
from collections import Counter

nltk.download('punkt')
nltk.download('stopwords')

# Configure tesseract path
tess.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def extract_text():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    image = Image.open(image_file)

    text = tess.image_to_string(image)
    print(text)
    return jsonify({'book_name': text})

# Hugging Face summarizer
huggingface_summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# spaCy model
spacy_nlp = spacy.load("en_core_web_trf")

def spacy_summarize(text, n=3):
    doc = spacy_nlp(text)
    summary = " ".join([sent.text for sent in doc.sents][:n])
    return summary

def nltk_summarize(text, n=3):
    sentences = sent_tokenize(text)
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english') + list(punctuation))
    words = [word for word in words if word not in stop_words]
    word_freq = Counter(words)
    sentence_scores = {sent: sum(word_freq[word] for word in word_tokenize(sent.lower()) if word in word_freq) for sent in sentences}
    summary_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:n]
    return ' '.join(summary_sentences)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    description = data.get('description')
    logging.debug('Received description: %s', description)

    if not description:
        logging.debug('No description provided')
        return jsonify({'error': 'No description provided'}), 400

    try:
        # Hugging Face Transformers
        huggingface_summary = huggingface_summarizer(description, max_length=150, min_length=40, do_sample=False)[0]['summary_text']

        # Gensim
        # gensim_summary = gensim_summarize(description, ratio=0.2)

        # Sumy
        # pummarizer = LsaSummarizer()
        # sumy_suarser = PlaintextParser.from_string(description, Tokenizer("english"))
        # sumy_smmary = ' '.join([str(sentence) for sentence in sumy_summarizer(parser.document, 3)])

        # # spaCy
        # spacy_summary = spacy_summarize(description)

        # # NLTK
        nltk_summary = nltk_summarize(description)

        summaries = {
            'huggingface_summary': huggingface_summary,
            # 'gensim_summary': gensim_summary,
            # 'sumy_summary': sumy_summary,
            # 'spacy_summary': spacy_summary,
            # 'nltk_summary': nltk_summary
        }

        logging.debug('Generated summaries: %s', summaries)
        return jsonify(summaries), 200
    except Exception as e:
        logging.error('Error generating summaries', exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
