# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /workspace

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the workspace to the nodejs user
RUN chown -R nextjs:nodejs /workspace
USER nextjs

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
