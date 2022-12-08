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

If you want to create your own model, run these four commands inside the Docker container.

```python
python noise.py
python clean.py
python train.py
python app.py
```

The first 3 commands will take a while, as they create noisy files, clean each file, and then train all files through the CNN. After `python app.py` runs, it will load up the app at [localhost:8080](http://localhost:8080).

Included in the project, there is also an h5 file, which will be used as a pretrained file. If you would like to use this file instead, just run `python app.py` inside of the docker container.

From there, the app should be there! Have fun classifying!
