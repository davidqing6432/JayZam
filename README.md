# JayZam

## Description

This is an audio-classification project created to classify Jay-Z songs. It is specifically capable of identifying the first 10 seconds of 3 songs: American Gangster, GOD DID, and Young Forever.

## Tech Stack

This project uses Python and TensorFlow on the backend in order to classify music. It then uses Flask to connect to the frontend, which is built in HTML, CSS, and JavaScript.

## Usage

Create 3 folders: `/cleaned_data`, `/augmented_data`, and `/incoming/idk`.

To use this app, create a Docker container to store all of the requirements.

Follow this command sequence to build and run your Docker container.

```shell
docker-compose build
docker-compose up -d
docker-compose run -p 8080:5000 python /bin/bash
```

Once inside the Docker container, run this python sequence.

```python
python noise.py
python clean.py
python train.py
python app.py
```

The first 3 commands will take a while, as they create noisy files, clean each file, and then train all files through the CNN. After `python app.py` runs, it will load up the app at [localhost:8080](http://localhost:8080).

From there, the app should be there! Have fun classifying!
