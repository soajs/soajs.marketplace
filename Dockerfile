FROM soajsorg/node

RUN mkdir -p /opt/soajs/soajs.marketplace/node_modules/
WORKDIR /opt/soajs/soajs.marketplace/
COPY . .
RUN npm install

CMD ["/bin/bash"]