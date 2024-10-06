# Base image
FROM node:21-slim AS base

# Install necessary build tools for compiling native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Install dependencies and build the types package
FROM base AS types_builder
WORKDIR /app

# Copy over yarn workspace files and types package files
COPY package.json yarn.lock ./
COPY packages/types/package.json packages/types/yarn.lock ./packages/types/

# Install dependencies according to the lockfile
RUN yarn install

# Build types package
COPY packages/types ./packages/types
WORKDIR /app/packages/types
RUN yarn build

# Build dependencies for NodeJS package
FROM base AS node_deps
WORKDIR /app

# Copy yarn workspace files and node package files
COPY package.json yarn.lock ./
COPY packages/node/package.json packages/node/yarn.lock ./packages/node/

# Copy built types package over
COPY --from=types_builder /app/packages/types ./packages/types

# Install dependencies according to the lockfile
RUN yarn install

# Build dependencies for NextJS package
FROM base AS next_deps
WORKDIR /app

# Copy yarn workspace files and front package files
COPY package.json yarn.lock ./
COPY packages/front/package.json packages/front/yarn.lock ./packages/front/

# Copy built types package over
COPY --from=types_builder /app/packages/types ./packages/types

# Install dependencies according to the lockfile
RUN yarn install

# Build nodeJS package
FROM base AS node_builder
WORKDIR /app

# Copy node modules and node package files
COPY --from=node_deps /app/node_modules ./node_modules
COPY packages/node ./packages/node
COPY --from=types_builder /app/packages/types ./packages/types

# Build nodeJS package
WORKDIR /app/packages/node
RUN yarn build

# Build NextJS package
FROM base AS next_builder
WORKDIR /app

# Copy node modules and front package files
COPY --from=next_deps /app/node_modules ./node_modules
COPY packages/front ./packages/front
COPY --from=types_builder /app/packages/types ./packages/types

# Build NextJS package
WORKDIR /app/packages/front
RUN yarn build

# Production image
FROM node:21-slim AS runner

# Set the working directory
WORKDIR /app

# Copy build files and dependencies
COPY --from=node_deps /app/node_modules ./node_modules
COPY --from=node_builder /app/packages/node/build ./packages/node/build
COPY --from=node_builder /app/packages/node/.env ./.env
COPY --from=next_builder /app/packages/front/.next ./packages/front/.next
COPY --from=types_builder /app/packages/types/build ./packages/types/build
COPY packages/types/package.json ./packages/types/package.json

# Set environment variable for production
ENV NODE_ENV=production

# Run the server
CMD ["node", "packages/node/build/app.js"]