FROM python:3.6
LABEL maintainer="carmignanifederico@gmail.com"
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8080
ENTRYPOINT ["python"]
#CMD ["app/app.py"]
RUN python producer.py
#RUN python consumer.py

CMD [consumer.py]
