# Use the official Node.js image.
FROM node:21 AS base

# Install dependencies only when needed
FROM base AS deps

# Set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package.json yarn.lock* ./

# Install dependencies.
RUN yarn install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary build files and assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/build ./build
COPY --from=builder /app/.env ./.env

# Run server 
CMD ["node", "build/app.js"]