import json
import os
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from predict import predict
import subprocess

# Create App
app = Flask(__name__)

# Select Route


@app.route('/', methods=['POST', 'GET'])
@app.route('/index.html')
def index():
    return render_template("index.html")


@app.route('/about.html', methods=['POST', 'GET'])
def about():
    return render_template("about.html")

@app.route("/receive", methods=['POST'])
def form():
    file = request.files['file']
    file.save(secure_filename(file.filename))
    print(file)

    # with open(os.path.abspath(f'{file.filename}'), 'wb') as f:
    #     f.write(file.getvalue())

    command = ['ffmpeg', '-i', secure_filename(file.filename), '-f', 'segment', '-segment_time', '15', 'incoming/idk/out%9d.wav']
    # # file.save(secure_filename('out.wav'))
    subprocess.run(command,stdout=subprocess.PIPE,stdin=subprocess.PIPE)

    result = predict()
    os.remove(secure_filename(file.filename))
    os.remove('incoming/idk/out000000000.wav')

    result = jsonify(result)
    return result

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")