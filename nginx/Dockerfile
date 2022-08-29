FROM nginx:1.21.6
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
#RUN mkdir /etc/nginx/html/private
COPY html/index.html /etc/nginx/html/index.html
COPY html/private/index.html /etc/nginx/html/private/index.html
COPY html/user/index.html /etc/nginx/html/user/index.html
COPY html/admin/index.html /etc/nginx/html/admin/index.html
COPY html/manager/index.html /etc/nginx/html/manager/index.html
COPY html/assets /etc/nginx/html/assets
COPY html/js /etc/nginx/html/js