FROM node:lts-alpine3.19 AS development

WORKDIR /usr/src/app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./package.json /usr/src/app/

COPY ./pnpm-lock.yaml /usr/src/app/

# Here we install all the deps
RUN npm i -g pnpm tsx 
RUN pnpm install

COPY . /usr/src/app/

RUN pnpm drizzle-kit generate:pg

# Build the app to the /dist folder
RUN pnpm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:lts-alpine3.19 AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm i -g pnpm


# Set Working Directory
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

COPY drizzle .

RUN pnpm install --prod --frozen-lockfile --strict-peer-dependencies --reporter append-only --unsafe-perm
RUN chown -R node:node ./node_modules
COPY --chown=node:node . .

COPY --chown=node:node --from=development /usr/src/app/dist ./dist

USER node


# Run app
CMD [ "node", "dist/main" ]
