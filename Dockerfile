FROM soajsorg/node

RUN mkdir -p /opt/soajs/soajs.catalog/node_modules/
WORKDIR /opt/soajs/soajs.catalog/
COPY . .
RUN npm install

CMD ["/bin/bash"]